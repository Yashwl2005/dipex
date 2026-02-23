import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Activity, PlaySquare, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export const Evaluations = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPendingSubmissions = async () => {
            try {
                const sportsStr = localStorage.getItem('sports');
                const sports = sportsStr ? JSON.parse(sportsStr).join(',') : '';
                const res = await api.get(`/admin/submissions?status=pending&sports=${sports}`);
                setSubmissions(res.data);
            } catch (err) {
                console.error('Failed to fetch submissions', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPendingSubmissions();
    }, []);

    const handleReviewClick = (submissionId) => {
        // Future enhancement: could pass the specific ID to Review page
        navigate('/review');
    };

    return (
        <Layout sidebarType="dark">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <div className="text-sm text-muted mb-2 font-medium" style={{ color: '#2b2b85', letterSpacing: '1px' }}>
                        <Activity size={16} className="inline mr-2" />
                        PENDING EVALUATIONS
                    </div>
                    <h1 className="text-3xl font-bold mb-1" style={{ color: '#0f172a' }}>Video Submissions</h1>
                    <p className="text-muted text-sm" style={{ maxWidth: '600px', lineHeight: '1.5' }}>
                        Review unassessed video proofs uploaded by athletes. Evaluate their biomechanics, verify scores, and approve or request re-uploads.
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="dashboard-grid mb-6">
                <div className="card stat-card flex items-center gap-4">
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#fcd34d', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309' }}>
                        <Activity size={24} />
                    </div>
                    <div>
                        <div className="text-xs text-muted font-bold mb-1 tracking-wider">AWAITING REVIEW</div>
                        <div className="text-2xl font-bold">{submissions.length}</div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div className="flex justify-between items-center" style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                    <div className="text-sm font-bold tracking-wider color-muted flex items-center gap-2">
                        <PlaySquare size={16} /> RECENT UPLOADS
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading submissions...</div>
                ) : submissions.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No pending video submissions right now.</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ color: '#64748b', fontSize: '12px', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>ATHLETE</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>TEST TYPE</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>DATE SUBMITTED</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>STATUS</th>
                                <th style={{ padding: '16px 24px', fontWeight: 'bold', textAlign: 'right' }}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((sub, i) => (
                                <tr key={sub._id || i} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onClick={() => handleReviewClick(sub._id)}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div className="font-bold text-main">{sub.user?.name || 'Unknown Athlete'}</div>
                                        <div className="text-xs text-muted">{sub.user?.email || 'N/A'}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{sub.testName}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: '#64748b' }}>
                                        {new Date(sub.dateTaken).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                                            Pending
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <button
                                            className="btn-primary"
                                            style={{ backgroundColor: '#4f46e5', padding: '6px 14px', fontSize: '13px', borderRadius: '6px' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleReviewClick(sub._id);
                                            }}
                                        >
                                            Review Video
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Layout>
    );
};
