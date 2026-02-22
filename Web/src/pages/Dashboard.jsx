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
        activeEvaluations: 0,
        avgPerformanceScore: 0
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
                    <h1 className="text-3xl text-main font-bold mb-1">National Performance Dashboard</h1>
                    <p className="text-muted text-sm">Real-time athlete metrics and compliance monitoring across India</p>
                </div>
                <div className="flex gap-4">
                    <button className="btn-secondary flex items-center gap-2">
                        <Download size={16} />
                        Export Report
                    </button>
                    <button className="btn-primary flex items-center gap-2" onClick={loadStats}>
                        Refresh Data
                    </button>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Top Stats */}
                <StatCard title="Total Athletes Tracked" value={stats.totalAthletes} badgeText="+12%" badgeType="green" />
                <StatCard title="Active Evaluations" value={stats.activeEvaluations} badgeText="+5%" badgeType="green" />
                <StatCard title="Avg. Performance Score" value={`${stats.avgPerformanceScore}%`} badgeText="-2%" badgeType="red" />

                {/* Heatmap Widget */}
                <div className="card heatmap-widget">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg">State Performance Heatmap</h2>
                        <button className="btn-secondary flex items-center gap-2 text-sm" style={{ padding: '6px 12px' }}>
                            All Sports <ChevronDown size={14} />
                        </button>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', height: '300px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ position: 'relative', opacity: 0.8 }}>
                            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <polygon fill="#e2e8f0" points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                                <line x1="9" y1="3" x2="9" y2="21"></line>
                                <line x1="15" y1="3" x2="15" y2="21"></line>
                            </svg>
                            <div style={{ position: 'absolute', top: '15px', left: '40px', color: '#3b3b98' }}>
                                <MapPin size={32} fill="currentColor" stroke="white" />
                            </div>
                            <div style={{ position: 'absolute', bottom: '10px', right: '0px', width: '20px', height: '20px', backgroundColor: '#a5b4fc', borderRadius: '50%' }}></div>
                            <div style={{ position: 'absolute', bottom: '-10px', left: '-10px', width: '24px', height: '24px', backgroundColor: '#a5b4fc', borderRadius: '50%' }}></div>
                        </div>
                        <p className="font-bold mt-4" style={{ color: '#334155' }}>Interactive Map Component</p>
                        <p className="text-sm text-muted">Loading performance density data for India...</p>
                    </div>
                </div>

                {/* Flagged Activity */}
                <div className="card flagged-widget">
                    <h2 className="text-lg flex items-center gap-2 mb-4">
                        <Activity size={20} color="#dc2626" /> Flagged Activity
                    </h2>
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <div className="text-xs text-muted mb-1 uppercase font-bold tracking-wider">FLAGGED VIDEOS</div>
                            <div className="text-3xl text-danger-color font-bold">24</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="text-xs text-muted mb-1">Risk Status</div>
                            <div className="text-xs font-bold" style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '4px' }}>MEDIUM RISK</div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="text-xs font-bold text-main mb-2">Risk Distribution</div>
                        <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                            <div style={{ width: '60%', backgroundColor: '#22c55e' }}></div>
                            <div style={{ width: '25%', backgroundColor: '#f59e0b' }}></div>
                            <div style={{ width: '15%', backgroundColor: '#ef4444' }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted">
                            <span>Low (60%)</span>
                            <span>Med (25%)</span>
                            <span>High (15%)</span>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                        <div className="text-xs text-muted mb-2 font-bold tracking-wider">LATEST FLAG</div>
                        <div className="flex items-center gap-3">
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Play fill="#94a3b8" stroke="none" size={16} />
                            </div>
                            <div>
                                <div className="font-bold text-sm">Potential Frame Drop</div>
                                <div className="text-xs text-muted">Regional Center: Patiala</div>
                            </div>
                        </div>
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
                        {/* Just simple CSS bars for mockup */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                            <div style={{ height: '60px', width: '100%', backgroundColor: '#3b3b98', borderRadius: '4px 4px 0 0' }}></div>
                            <span className="text-xs text-muted mt-2">12-14</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                            <div style={{ height: '90px', width: '100%', backgroundColor: '#3b3b98', borderRadius: '4px 4px 0 0' }}></div>
                            <span className="text-xs text-muted mt-2">15-17</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                            <div style={{ height: '140px', width: '100%', backgroundColor: '#3b3b98', borderRadius: '4px 4px 0 0' }}></div>
                            <span className="text-xs text-muted mt-2">18-20</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                            <div style={{ height: '120px', width: '100%', backgroundColor: '#3b3b98', borderRadius: '4px 4px 0 0' }}></div>
                            <span className="text-xs text-muted mt-2">21+</span>
                        </div>
                    </div>
                </div>

                {/* Sit-up Avg */}
                <div className="card chart-card flex flex-col">
                    <h3 className="text-sm font-bold mb-6">Sit-up Avg (by Gender)</h3>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: '24px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                            <div style={{ height: '100px', width: '24px', backgroundColor: '#3b3b98', borderRadius: '4px 4px 0 0' }}></div>
                            <div style={{ height: '80px', width: '24px', backgroundColor: '#cbd5e1', borderRadius: '4px 4px 0 0' }}></div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                            <div style={{ height: '140px', width: '24px', backgroundColor: '#3b3b98', borderRadius: '4px 4px 0 0' }}></div>
                            <div style={{ height: '120px', width: '24px', backgroundColor: '#cbd5e1', borderRadius: '4px 4px 0 0' }}></div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-6 mt-4 pb-4 border-b" style={{ borderColor: '#f1f5f9' }}>
                        <div className="flex items-center gap-2 text-xs font-bold text-main">
                            <div style={{ width: '8px', height: '8px', backgroundColor: '#3b3b98' }}></div> Male
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-main">
                            <div style={{ width: '8px', height: '8px', backgroundColor: '#cbd5e1' }}></div> Female
                        </div>
                    </div>
                    <div className="flex justify-around mt-4">
                        <span className="text-xs text-muted">Junior</span>
                        <span className="text-xs text-muted">Senior</span>
                    </div>
                </div>

                {/* Endurance Trends */}
                <div className="card chart-card">
                    <h3 className="text-sm font-bold mb-6">Endurance Trends (Quarterly)</h3>
                    <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', marginTop: '20px' }}>
                        <svg viewBox="0 0 100 50" width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                            <path d="M 0 40 Q 15 35 25 25 T 50 20 T 75 22 T 100 5" fill="none" stroke="#2b2b85" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="flex justify-between mt-8 text-xs text-muted px-4">
                        <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
                    </div>
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
                            <tr style={{ color: '#64748b', fontSize: '12px', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '16px 8px', fontWeight: 'bold', letterSpacing: '0.5px' }}>RANK</th>
                                <th style={{ padding: '16px 8px', fontWeight: 'bold', letterSpacing: '0.5px' }}>ATHLETE NAME</th>
                                <th style={{ padding: '16px 8px', fontWeight: 'bold', letterSpacing: '0.5px' }}>STATE</th>
                                <th style={{ padding: '16px 8px', fontWeight: 'bold', letterSpacing: '0.5px' }}>PRIMARY ACTIVITY</th>
                                <th style={{ padding: '16px 8px', fontWeight: 'bold', letterSpacing: '0.5px', textAlign: 'right' }}>PERFORMANCE SCORE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { rank: 1, init: 'AS', name: 'Arjun Singh', state: 'Haryana', activity: '100m Sprint', score: '98.4', bg: '#fef3c7', activeColor: '#d97706', initBg: '#e0e7ff', initColor: '#3730a3' },
                                { rank: 2, init: 'PK', name: 'Priya Kumari', state: 'Punjab', activity: 'Vertical Jump', score: '96.8', bg: '#f1f5f9', activeColor: '#64748b', initBg: '#e0e7ff', initColor: '#3730a3' },
                                { rank: 3, init: 'RN', name: 'Rahul Nair', state: 'Kerala', activity: 'Endurance Run', score: '95.2', bg: '#fff7ed', activeColor: '#ea580c', initBg: '#e0e7ff', initColor: '#3730a3' },
                                { rank: 4, init: 'ST', name: 'Sneha Thakur', state: 'Manipur', activity: 'Sit-ups', score: '94.7', bg: '#f1f5f9', activeColor: '#64748b', initBg: '#e0e7ff', initColor: '#3730a3' },
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px 8px' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: row.bg, color: row.activeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                                            {row.rank}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 8px' }}>
                                        <div className="flex items-center gap-3">
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: row.initBg, color: row.initColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                                                {row.init}
                                            </div>
                                            <span className="font-bold">{row.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 8px', color: '#475569' }}>{row.state}</td>
                                    <td style={{ padding: '16px 8px' }}>
                                        <span style={{ backgroundColor: '#f1f5f9', color: '#0f172a', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>{row.activity}</span>
                                    </td>
                                    <td style={{ padding: '16px 8px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', color: '#2b2b85' }}>
                                        {row.score}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};
