import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Download, FileDown, MapPin, Users, Activity, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import './Dashboard.css';
import api from '../api';

export const ShortlistedAthletes = () => {
    const [athletes, setAthletes] = useState([]);

    useEffect(() => {
        const fetchAthletes = async () => {
            try {
                const sportsStr = localStorage.getItem('sports');
                const sports = sportsStr ? JSON.parse(sportsStr).join(',') : '';
                const res = await api.get(`/admin/athletes?sports=${sports}`);
                setAthletes(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAthletes();
    }, []);

    const avgScore = athletes.length ? (athletes.reduce((acc, a) => acc + (a.overallScore || 0), 0) / athletes.length).toFixed(1) : 0;

    return (
        <Layout sidebarType="light">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="text-xs font-bold mb-2 flex items-center gap-2" style={{ color: '#2b2b85', letterSpacing: '1px' }}>
                        <MapPin size={16} /> NATIONAL TRAINING CAMP
                    </div>
                    <h1 className="text-3xl font-bold mb-1 text-main">Shortlisted Athletes</h1>
                    <p className="text-muted text-sm" style={{ maxWidth: '600px', lineHeight: '1.5' }}>Manage and export top-performing athletes selected for the upcoming national development programs based on recent trial scores.</p>
                </div>
                <div className="flex gap-4 items-center">
                    <button className="btn-secondary flex items-center gap-2" style={{ height: '44px' }}>
                        <FileText size={18} />
                        Export to CSV
                    </button>
                    <button className="btn-primary flex items-center gap-2" style={{ height: '44px', backgroundColor: '#222976' }}>
                        <FileDown size={18} />
                        Export to Excel
                    </button>
                </div>
            </div>

            <div className="dashboard-grid mb-6">
                <div className="card stat-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <div className="text-xs text-muted font-bold mb-1">Total Shortlisted</div>
                        <div className="text-2xl font-bold">{athletes.length} Athletes</div>
                    </div>
                </div>
                <div className="card stat-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#dcfce7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                        <Activity size={24} />
                    </div>
                    <div>
                        <div className="text-xs text-muted font-bold mb-1">Avg. Performance Score</div>
                        <div className="text-2xl font-bold">{avgScore}%</div>
                    </div>
                </div>
                <div className="card stat-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#ffedd5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
                        <MapPin size={24} />
                    </div>
                    <div>
                        <div className="text-xs text-muted font-bold mb-1">States Represented</div>
                        <div className="text-2xl font-bold">--</div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '0' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ color: '#64748b', fontSize: '12px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold', letterSpacing: '0.5px' }}>ATHLETE NAME</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold', letterSpacing: '0.5px' }}>CONTACT</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold', letterSpacing: '0.5px' }}>STATE</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold', letterSpacing: '0.5px' }}>ACTIVITY</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold', letterSpacing: '0.5px' }}>PERFORMANCE SCORE</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold', letterSpacing: '0.5px', textAlign: 'center' }}>PROFILE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {athletes.map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div className="flex items-center gap-4">
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e0e7ff', color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                                                {row.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-main" style={{ fontSize: '15px' }}>{row.name}</div>
                                                <div className="text-xs text-muted mt-1">ID: {row._id.substring(0, 8)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div className="text-main" style={{ fontWeight: '500' }}>{row.email}</div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '600' }}>Delhi</span>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div className="flex items-center gap-2" style={{ color: '#2b2b85', fontWeight: '700' }}>
                                            <Activity size={16} /> {row.sport || 'General'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div className="flex flex-col gap-2">
                                            <div style={{ width: '120px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ width: `${row.overallScore || 0}%`, height: '100%', backgroundColor: '#22c55e' }}></div>
                                            </div>
                                            <div className="text-xs font-bold" style={{ textAlign: 'center', width: '120px' }}>{row.overallScore || 0}/100</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                                        <button style={{ color: '#94a3b8' }}>
                                            <FileText size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center" style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0' }}>
                    <div className="text-sm text-muted">
                        Showing <strong style={{ color: '#0f172a' }}>1 to 5</strong> of <strong style={{ color: '#0f172a' }}>128</strong> athletes
                    </div>
                    <div className="flex gap-1">
                        <button style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}><ChevronLeft size={16} /></button>
                        <button style={{ width: '32px', height: '32px', border: '1px solid #222976', backgroundColor: '#222976', color: '#ffffff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>1</button>
                        <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: '14px' }}>2</button>
                        <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: '14px' }}>3</button>
                        <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '14px' }}>...</button>
                        <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: '14px' }}>26</button>
                        <button style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a' }}><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
