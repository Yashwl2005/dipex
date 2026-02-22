import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Users, Search, Filter } from 'lucide-react';
import './Dashboard.css'; // Reusing dashboard styles for consistency
import api from '../api';

export const Athletes = () => {
    const [athletes, setAthletes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAthletes = async () => {
            try {
                const sportsStr = localStorage.getItem('sports');
                const sports = sportsStr ? JSON.parse(sportsStr).join(',') : '';
                // The /admin/athletes route already exists and is filtered by sports
                const res = await api.get(`/admin/athletes?sports=${sports}`);
                setAthletes(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAthletes();
    }, []);

    return (
        <Layout sidebarType="light">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-1 text-main">Athlete Management</h1>
                    <p className="text-muted text-sm">View and manage all authenticated athletes assigned to your sports.</p>
                </div>
                <div className="flex gap-4">
                    <button className="btn-secondary flex items-center gap-2">
                        <Filter size={16} />
                        Filter
                    </button>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                            type="text"
                            placeholder="Search athletes..."
                            style={{ padding: '8px 16px 8px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', width: '250px' }}
                        />
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ color: '#64748b', fontSize: '12px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>ATHLETE ID</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>PROFILE</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>PRIMARY SPORT</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>GENDER</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>OVERALL SCORE</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold', textAlign: 'center' }}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading athletes...</td>
                                </tr>
                            ) : athletes.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No athletes found for your assigned sports.</td>
                                </tr>
                            ) : (
                                athletes.map((athlete) => (
                                    <tr key={athlete._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '16px 24px', color: '#64748b', fontFamily: 'monospace' }}>
                                            {athlete._id.substring(0, 8).toUpperCase()}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div className="flex items-center gap-3">
                                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e0e7ff', color: '#3730a3', display: 'flex', alignItems: 'center', justifyItems: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                                                    {athlete.name?.substring(0, 1).toUpperCase() || 'A'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-main">{athlete.name}</div>
                                                    <div className="text-xs text-muted">{athlete.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ backgroundColor: '#f1f5f9', color: '#0f172a', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                                                {athlete.sports && athlete.sports.length > 0 ? athlete.sports.join(', ') : 'Not assigned'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', textTransform: 'capitalize' }}>
                                            {athlete.gender || 'N/A'}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div className="flex items-center gap-2">
                                                <div style={{ fontWeight: 'bold', color: '#2b2b85' }}>{athlete.overallScore || 0}</div>
                                                <div style={{ width: '60px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${athlete.overallScore || 0}%`, height: '100%', backgroundColor: '#2b2b85' }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                            <button style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '13px' }}>View Details</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};
