import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Download, RefreshCw, MapPin, Activity, Play, ChevronDown } from 'lucide-react';
import './Dashboard.css';
import api from '../api';

const StatCard = ({ title, value, badgeText, badgeType }) => (
    <div className="card stat-card">
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
        stateDistribution: [],
        flaggedActivity: null
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
                <StatCard title="Total Athletes Applied" value={stats.totalAthletes} badgeText="Global" badgeType="default" />
                <StatCard title="Athletes Approved" value={stats.approvedAthletes} badgeText="Verified" badgeType="green" />
                <StatCard title="Athletes Rejected" value={stats.rejectedAthletes} badgeText="Denied" badgeType="red" />
                <StatCard title="Pending Review" value={stats.pendingAthletes} badgeText="Action Req" badgeType="yellow" />

                {/* Heatmap Widget */}
                <div className="card heatmap-widget">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg">State Performance Heatmap</h2>
                        <button className="btn-secondary flex items-center gap-2 text-sm" style={{ padding: '6px 12px' }}>
                            All Sports <ChevronDown size={14} />
                        </button>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', height: '300px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        {stats.stateDistribution && stats.stateDistribution.length > 0 ? (
                            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
                                {stats.stateDistribution.map(stat => (
                                    <div key={stat._id || 'unknown'} className="flex items-center gap-4">
                                        <div style={{ minWidth: '100px', fontSize: '13px', fontWeight: 'bold', color: '#475569', textTransform: 'capitalize' }}>{stat._id || 'Unknown'}</div>
                                        <div style={{ flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${Math.min((stat.count / Math.max(stats.totalAthletes, 1)) * 100, 100)}%`, height: '100%', backgroundColor: '#3b82f6' }}></div>
                                        </div>
                                        <div style={{ minWidth: '30px', textAlign: 'right', fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>{stat.count}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <div style={{ position: 'relative', opacity: 0.8 }}>
                                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon fill="#e2e8f0" points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                                        <line x1="9" y1="3" x2="9" y2="21"></line>
                                        <line x1="15" y1="3" x2="15" y2="21"></line>
                                    </svg>
                                    <div style={{ position: 'absolute', top: '15px', left: '40px', color: '#3b3b98' }}>
                                        <MapPin size={32} fill="currentColor" stroke="white" />
                                    </div>
                                </div>
                                <p className="font-bold mt-4" style={{ color: '#334155' }}>No State Data Available</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Flagged Activity */}
                <div className="card flagged-widget">
                    <h2 className="text-lg flex items-center gap-2 mb-4">
                        <Activity size={20} color="#dc2626" /> Flagged Activity
                    </h2>
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <div className="text-xs text-muted mb-1 uppercase font-bold tracking-wider">REJECTED VIDEOS</div>
                            <div className="text-3xl font-bold" style={{ color: '#dc2626' }}>{stats.flaggedActivity?.count || 0}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="text-xs text-muted mb-1">Risk Status</div>
                            <div className="text-xs font-bold" style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '4px' }}>MONITORING</div>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                        <div className="text-xs text-muted mb-2 font-bold tracking-wider">LATEST REJECTION</div>
                        {stats.flaggedActivity?.latest ? (
                            <div className="flex items-center gap-3">
                                <div style={{ width: '40px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Play fill="#94a3b8" stroke="none" size={16} />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">Review Failed</div>
                                    <div className="text-xs text-muted">{stats.flaggedActivity.latest.user?.name || 'Unknown'} - {stats.flaggedActivity.latest.user?.state || 'Unknown'}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-muted">No recently flagged videos</div>
                        )}
                    </div>

                    <button className="btn-secondary" style={{ width: '100%', borderColor: '#2b2b85', color: '#2b2b85' }}>
                        Review All Flags
                    </button>
                </div>
            </div>

            {/* Charts Row */}
            <div className="charts-row">
                {/* Vertical Jump Avg */}
                <div className="card chart-card flex flex-col">
                    <h3 className="text-sm font-bold mb-6">Vertical Jump Avg (by Age)</h3>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '12px', paddingBottom: '24px' }}>
                        {stats.charts?.jumpStats?.length > 0 ? (
                            stats.charts.jumpStats.map(stat => {
                                const heightValues = { '0': 60, '15': 90, '18': 140, '21+': 120 };
                                const labels = { '0': '12-14', '15': '15-17', '18': '18-20', '21+': '21+' };
                                const heightAmount = stat.avgScore || heightValues[stat._id] || 50;
                                return (
                                    <div key={stat._id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '150px', width: '100%', padding: '0 4px' }}>
                                            <div style={{ borderTopRadius: '4px', backgroundColor: '#3b3b98', width: '100%', height: `${Math.min(heightAmount * 2, 150)}px`, textAlign: 'center', transition: 'height 0.3s' }}>
                                                <span style={{ color: 'white', fontSize: '10px', display: 'block', paddingTop: '4px' }}>{Math.round(stat.avgScore)}</span>
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted mt-2">{labels[stat._id] || stat._id}</span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-muted" style={{ width: '100%' }}>
                                <Activity size={24} className="mb-2 text-slate-300" />
                                <p className="text-xs">No Data</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sit-up Avg */}
                <div className="card chart-card flex flex-col">
                    <h3 className="text-sm font-bold mb-6">Sit-up Avg (by Gender)</h3>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: '24px' }}>
                        {stats.charts?.situpStats?.length > 0 ? (
                            stats.charts.situpStats.map(stat => (
                                <div key={stat._id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '140px', width: '100%', padding: '0 8px' }}>
                                        <div style={{ borderTopRadius: '4px', backgroundColor: stat._id === 'male' ? '#3b3b98' : '#cbd5e1', width: '100%', height: `${Math.min(stat.avgScore * 1.5, 140)}px`, textAlign: 'center', transition: 'height 0.3s' }}>
                                            <span style={{ color: stat._id === 'male' ? 'white' : '#334155', fontSize: '10px', display: 'block', paddingTop: '4px' }}>{Math.round(stat.avgScore)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-muted" style={{ width: '100%' }}>
                                <Activity size={24} className="mb-2 text-slate-300" />
                                <p className="text-xs">No Data</p>
                            </div>
                        )}
                    </div>
                    {stats.charts?.situpStats?.length > 0 && (
                        <div className="flex justify-center gap-6 mt-4 pb-4 border-b" style={{ borderColor: '#f1f5f9' }}>
                            <div className="flex items-center gap-2 text-xs font-bold text-main">
                                <div style={{ width: '8px', height: '8px', backgroundColor: '#3b3b98' }}></div> Male
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-main">
                                <div style={{ width: '8px', height: '8px', backgroundColor: '#cbd5e1' }}></div> Female
                            </div>
                        </div>
                    )}
                </div>

                {/* Endurance Trends */}
                <div className="card chart-card">
                    <h3 className="text-sm font-bold mb-6">Endurance Trends (Quarterly)</h3>
                    <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', marginTop: '20px', position: 'relative' }}>
                        {stats.charts?.enduranceStats?.length > 1 ? (
                            <svg viewBox="0 0 100 50" width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                                {/* Very rough path generation just to mimic a dynamic trend line based on actual score drops/rises */}
                                <path
                                    d={`M 0 ${50 - Math.min((stats.charts.enduranceStats[0]?.avgScore || 20) / 2, 50)} 
                                        L 33 ${50 - Math.min((stats.charts.enduranceStats[1]?.avgScore || 25) / 2, 50)} 
                                        L 66 ${50 - Math.min((stats.charts.enduranceStats[2]?.avgScore || 30) / 2, 50)} 
                                        L 100 ${50 - Math.min((stats.charts.enduranceStats[3]?.avgScore || 40) / 2, 50)}`}
                                    fill="none" stroke="#2b2b85" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                />
                            </svg>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-muted h-full w-full">
                                <Activity size={24} className="mb-2 text-slate-300" />
                                <p className="text-xs">Need 2+ Quarters</p>
                            </div>
                        )}
                    </div>
                    {stats.charts?.enduranceStats?.length > 1 && (
                        <div className="flex justify-between mt-8 text-xs text-muted px-4">
                            <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Leaderboard Widget */}
            <div className="card leaderboard-widget">
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
            </div>
        </Layout>
    );
};
