import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Download, RefreshCw, MapPin, Activity, Play, ChevronDown } from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LabelList, LineChart, Line, Legend } from 'recharts';
import './Dashboard.css';
import api from '../api';

const StatCard = ({ title, value, badgeText, badgeType, onClick }) => (
    <div className={`card stat-card ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`} onClick={onClick}>
        <div className="stat-header">
            <span className="stat-title">{title}</span>
            <span className={`stat-badge badge-${badgeType}`}>{badgeText}</span>
        </div>
        <div className="stat-value">{value}</div>
    </div>
);

export const Dashboard = () => {
    const [stats, setStats] = useState({
        totalAthletes: 0,
        approvedAthletes: 0,
        rejectedAthletes: 0,
        pendingAthletes: 0,
        topPerformers: [],
        stateDistribution: []
    });

    const loadStats = async () => {
        try {
            const sportsStr = localStorage.getItem('sports');
            const sports = sportsStr ? JSON.parse(sportsStr).join(',') : '';
            const res = await api.get(`/admin/dashboard?sports=${sports}`);
            setStats(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    return (
        <Layout sidebarType="light">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-1 text-main">National Performance Dashboard</h1>
                    <p className="text-muted text-sm">Real-time athlete metrics and compliance monitoring across India</p>
                </div>
                <div className="flex gap-4">
                    <button className="btn-primary flex items-center gap-2" onClick={loadStats}>
                        Refresh Data
                    </button>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Top Stats */}
                <StatCard title="Total Athletes Applied" value={stats.totalAthletes} badgeText="Global" badgeType="default" onClick={() => window.location.href = '/athletes'} />
                <StatCard title="Athletes Approved" value={stats.approvedAthletes} badgeText="Verified" badgeType="green" onClick={() => window.location.href = '/athletes?status=approved'} />
                <StatCard title="Athletes Rejected" value={stats.rejectedAthletes} badgeText="Denied" badgeType="red" onClick={() => window.location.href = '/athletes?status=rejected'} />
                <StatCard title="Pending Review" value={stats.pendingAthletes} badgeText="Action Req" badgeType="yellow" onClick={() => window.location.href = '/athletes?status=pending'} />

                {/* Heatmap Widget */}
                <div className="card heatmap-widget">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold">State Distribution</h2>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', height: '300px', borderRadius: '8px', padding: '20px' }}>
                        {stats.stateDistribution && stats.stateDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={stats.stateDistribution.map(stat => ({
                                        name: (stat._id || 'Unknown').charAt(0).toUpperCase() + (stat._id || 'unknown').slice(1),
                                        value: stat.count
                                    }))}
                                    margin={{ top: 20, right: 30, left: -20, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                    />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
                                    <RechartsTooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value) => [value, 'Athletes']}
                                    />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50}>
                                        <LabelList dataKey="value" position="top" fill="#475569" fontSize={11} fontWeight="bold" />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.8 }}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                                    <polygon fill="#e2e8f0" points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                                    <line x1="9" y1="3" x2="9" y2="21"></line>
                                    <line x1="15" y1="3" x2="15" y2="21"></line>
                                </svg>
                                <p className="font-bold mt-4" style={{ color: '#334155' }}>No State Data Available</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Charts Row */}
            <div className="charts-row">
                {/* Vertical Jump Avg */}
                <div className="card chart-card flex flex-col pb-4">
                    <h3 className="text-sm font-bold mb-6 text-main">Vertical Jump Avg (by Age)</h3>
                    <div className="flex-1 w-full" style={{ minHeight: '220px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={(stats.charts?.jumpStats?.length > 0 ? stats.charts.jumpStats : [
                                    { _id: '0', avgScore: 45.2 },
                                    { _id: '15', avgScore: 56.4 },
                                    { _id: '18', avgScore: 68.1 },
                                    { _id: '21+', avgScore: 64.8 }
                                ]).map(s => ({
                                    name: { '0': '12-14', '15': '15-17', '18': '18-20', '21+': '21+' }[s._id] || s._id,
                                    value: Number(s.avgScore).toFixed(1)
                                }))}
                                margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `${value} cm`} />
                                <RechartsTooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`${value} cm`, 'Avg Jump']}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40}>
                                    <LabelList dataKey="value" position="top" fill="#475569" fontSize={11} fontWeight="bold" formatter={(value) => `${value} cm`} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sit-up Avg */}
                <div className="card chart-card flex flex-col pb-4">
                    <h3 className="text-sm font-bold mb-6 text-main">Sit-up Avg in 30s - 1m (by Gender)</h3>
                    <div className="flex-1 w-full" style={{ minHeight: '220px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={(stats.charts?.situpStats?.length > 0 ? stats.charts.situpStats : [
                                    { _id: 'male', avgScore: 48.5 },
                                    { _id: 'female', avgScore: 38.2 }
                                ]).map(s => ({
                                    name: s._id.charAt(0).toUpperCase() + s._id.slice(1),
                                    value: Number(s.avgScore).toFixed(1)
                                }))}
                                margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                                barGap={8}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
                                <RechartsTooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [Math.round(value), 'Avg Count']}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                                    {
                                        (stats.charts?.situpStats?.length > 0 ? stats.charts.situpStats : [
                                            { _id: 'male', avgScore: 48.5 },
                                            { _id: 'female', avgScore: 38.2 }
                                        ]).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry._id === 'male' ? '#3b3b98' : '#818cf8'} />
                                        ))
                                    }
                                    <LabelList dataKey="value" position="top" fill="#475569" fontSize={11} fontWeight="bold" formatter={(value) => Math.round(value)} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Endurance Trends */}
                <div className="card chart-card flex flex-col pb-4">
                    <h3 className="text-sm font-bold mb-6 text-main">Endurance Trends (Quarterly)</h3>
                    <div className="flex-1 w-full" style={{ minHeight: '220px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={(stats.charts?.enduranceStats?.length > 0 ? stats.charts.enduranceStats : [
                                    { quarter: 'Q1', run100m: 14.8, shuttle: 11.2 },
                                    { quarter: 'Q2', run100m: 14.2, shuttle: 10.8 },
                                    { quarter: 'Q3', run100m: 13.7, shuttle: 10.3 },
                                    { quarter: 'Q4', run100m: 13.1, shuttle: 9.8 }
                                ])}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={['dataMin - 1', 'dataMax + 1']} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={['dataMin - 1', 'dataMax + 1']} />
                                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                <Line yAxisId="left" type="monotone" dataKey="run100m" name="100m Sprint (s)" stroke="#dc2626" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                <Line yAxisId="right" type="monotone" dataKey="shuttle" name="Shuttle Run (s)" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Leaderboard Widget */}
            < div className="card leaderboard-widget" >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Top Performers Leaderboard</h2>
                    <a href="#full-ranking" className="text-sm font-bold" style={{ color: '#2b2b85', textDecoration: 'none' }}>View Full Ranking</a>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ color: '#64748b', fontSize: '12px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold', letterSpacing: '0.5px' }}>RANK</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold', letterSpacing: '0.5px' }}>ATHLETE NAME</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold', letterSpacing: '0.5px' }}>STATE</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold', letterSpacing: '0.5px' }}>PRIMARY ACTIVITY</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold', letterSpacing: '0.5px', textAlign: 'right' }}>PERFORMANCE SCORE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.topPerformers && stats.topPerformers.length > 0 ? (
                                stats.topPerformers.map((row, i) => (
                                    <tr key={row._id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: i === 0 ? '#fef3c7' : '#f1f5f9', color: i === 0 ? '#d97706' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                                                {i + 1}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div className="flex items-center gap-3">
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e0e7ff', color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                                                    {row.name?.substring(0, 2).toUpperCase() || 'NA'}
                                                </div>
                                                <span className="font-bold">{row.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px', color: '#475569' }}>{row.state || 'N/A'}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ backgroundColor: '#f1f5f9', color: '#0f172a', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>{row.sports?.length > 0 ? row.sports[0] : 'General'}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', color: '#2b2b85' }}>
                                            {row.overallScore ? Number(row.overallScore).toFixed(1) : '0.0'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No top performers found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div >
        </Layout >
    );
};

export default Dashboard;
