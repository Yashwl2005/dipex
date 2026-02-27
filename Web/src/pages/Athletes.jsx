import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Users, Search, Filter, MoreVertical, Eye } from 'lucide-react';
import './Dashboard.css'; // Reusing dashboard styles for consistency
import api from '../api';

export const Athletes = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [athletes, setAthletes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAthletes = async () => {
            try {
                const sportsStr = localStorage.getItem('sports');
                const sports = sportsStr ? JSON.parse(sportsStr).join(',') : '';

                const queryParams = new URLSearchParams(location.search);
                const statusFilter = queryParams.get('status');

                let endpoint = `/admin/athletes?sports=${sports}`;
                if (statusFilter) {
                    endpoint += `&status=${statusFilter}`;
                }

                const res = await api.get(endpoint);
                setAthletes(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAthletes();
    }, [location.search]);

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

            <div className="card" style={{ padding: '0', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ color: '#475569', fontSize: '12px', backgroundColor: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold', borderBottom: '2px solid #e2e8f0' }}>Athlete ID</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold', borderBottom: '2px solid #e2e8f0' }}>Profile</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold', borderBottom: '2px solid #e2e8f0' }}>Primary Sport</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold', borderBottom: '2px solid #e2e8f0' }}>Gender</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold', borderBottom: '2px solid #e2e8f0' }}>Status</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold', borderBottom: '2px solid #e2e8f0' }}>Overall Score</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold', borderBottom: '2px solid #e2e8f0', textAlign: 'right' }}>Actions</th>
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
                                        <td style={{ padding: '16px 24px', color: '#64748b', fontFamily: 'monospace', fontWeight: '500' }}>
                                            #{athlete._id.substring(0, 6).toUpperCase()}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div className="flex items-center gap-3">
                                                {athlete.profilePhotoUrl ? (
                                                    <img
                                                        src={athlete.profilePhotoUrl}
                                                        alt={athlete.name}
                                                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                                                    />
                                                ) : (
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e0e7ff', color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                        {athlete.name?.substring(0, 1).toUpperCase() || 'A'}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-main" style={{ fontSize: '15px' }}>{athlete.name}</div>
                                                    <div className="text-xs text-muted" style={{ marginTop: '2px' }}>{athlete.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ backgroundColor: '#f1f5f9', color: '#0f172a', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', letterSpacing: '0.3px' }}>
                                                {athlete.sports && athlete.sports.length > 0 ? athlete.sports.join(', ') : 'Not assigned'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', textTransform: 'capitalize', color: '#475569', fontWeight: '500' }}>
                                            {athlete.gender || 'N/A'}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                <div style={{
                                                    width: '8px', height: '8px', borderRadius: '50%', marginRight: '8px',
                                                    backgroundColor: athlete.evaluationStatus === 'approved' ? '#16a34a' : athlete.evaluationStatus === 'rejected' ? '#dc2626' : '#d97706'
                                                }}></div>
                                                <span style={{
                                                    color: athlete.evaluationStatus === 'approved' ? '#15803d' : athlete.evaluationStatus === 'rejected' ? '#b91c1c' : '#b45309',
                                                    fontSize: '13px', fontWeight: '600', textTransform: 'capitalize'
                                                }}>
                                                    {athlete.evaluationStatus || 'Pending'}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div className="flex items-center gap-3">
                                                <div style={{ fontWeight: '700', color: '#1e293b', width: '30px' }}>{athlete.overallScore ? Number(athlete.overallScore).toFixed(1) : '0.0'}</div>
                                                <div style={{ width: '80px', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${athlete.overallScore || 0}%`, height: '100%', backgroundColor: '#3b82f6', borderRadius: '4px' }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <button
                                                onClick={() => navigate(`/athletes/${athlete._id}`)}
                                                className="btn-secondary flex items-center gap-2"
                                                style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                            >
                                                <Eye size={14} />
                                                View Details
                                            </button>
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

export default Athletes;
