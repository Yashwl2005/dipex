import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ArrowLeft, User, Activity, MapPin, Calendar, HelpCircle } from 'lucide-react';
import api from '../api';

export const AthleteDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [athlete, setAthlete] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [evaluating, setEvaluating] = useState(false);
    const [testScores, setTestScores] = useState({});

    useEffect(() => {
        const fetchAthlete = async () => {
            try {
                const res = await api.get(`/admin/athletes/${id}`);
                setAthlete(res.data.athlete);
                setSubmissions(res.data.submissions);
                setAchievements(res.data.achievements || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAthlete();
    }, [id]);

    const handleEvaluateAthlete = async (status) => {
        if (!window.confirm(`Are you sure you want to ${status} this athlete?`)) return;

        setEvaluating(true);
        try {
            await api.put(`/admin/athletes/${id}/evaluate`, { status });
            // Update local state
            setAthlete(prev => ({ ...prev, evaluationStatus: status }));
        } catch (err) {
            console.error('Evaluation failed:', err);
            alert('Failed to evaluate athlete.');
        } finally {
            setEvaluating(false);
        }
    };

    const handleEvaluateVideo = async (testId) => {
        const score = testScores[testId];
        if (score === undefined || score === '') {
            alert('Please enter a score between 0 and 25.');
            return;
        }
        const numScore = Number(score);
        if (numScore < 0 || numScore > 25) {
            alert('Score must be between 0 and 25.');
            return;
        }

        if (!window.confirm(`Are you sure you want to save the score of ${numScore}/25 for this video?`)) return;

        try {
            const res = await api.put(`/admin/submissions/${testId}/evaluate`, {
                status: 'evaluated',
                score: numScore
            });

            // Update the local submission list
            setSubmissions(prev => prev.map(sub =>
                sub._id === testId ? { ...sub, status: 'evaluated', score: numScore } : sub
            ));

            // Re-fetch athlete to get updated overallScore
            const athleteRes = await api.get(`/admin/athletes/${id}`);
            setAthlete(athleteRes.data.athlete);

            alert('Video scored successfully!');
        } catch (err) {
            console.error('Video evaluation failed:', err);
            alert('Failed to evaluate video.');
        }
    };

    if (loading) {
        return (
            <Layout sidebarType="light">
                <div className="flex h-64 items-center justify-center text-muted">Loading athlete details...</div>
            </Layout>
        );
    }

    if (!athlete) {
        return (
            <Layout sidebarType="light">
                <div className="flex flex-col items-center justify-center p-12 text-center text-muted gap-4">
                    <HelpCircle size={48} className="text-gray-400" />
                    <h2 className="text-xl font-bold text-main">Athlete Not Found</h2>
                    <p>We couldn't find an athlete matching this ID or you don't have permission to view them.</p>
                    <button className="btn-primary mt-4" onClick={() => navigate('/athletes')}>Return to Management</button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout sidebarType="light">
            <div className="pb-12 mt-2">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/athletes')} className="btn-secondary flex items-center justify-center mr-2" style={{ width: '40px', height: '40px', padding: 0 }}>
                            <ArrowLeft size={18} />
                        </button>

                        {/* Profile Photo Rendering */}
                        {athlete.profilePhotoUrl ? (
                            <img
                                src={athlete.profilePhotoUrl}
                                alt={athlete.name}
                                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginRight: '8px' }}
                            />
                        ) : (
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#e0e7ff', color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '24px', border: '3px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginRight: '8px' }}>
                                {athlete.name?.substring(0, 1).toUpperCase() || 'A'}
                            </div>
                        )}

                        <div>
                            <h1 className="text-3xl font-bold mb-1 text-main">{athlete.name}</h1>
                            <p className="text-muted text-sm tracking-wide">Ref. ID: {athlete._id.substring(0, 12)} | {athlete.sports?.join(', ') || 'General'}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {athlete.evaluationStatus === 'approved' ? (
                            <div style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16a34a]"></span>
                                </span>
                                Profile Approved
                            </div>
                        ) : athlete.evaluationStatus === 'rejected' ? (
                            <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#dc2626]"></div>
                                Profile Rejected
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => handleEvaluateAthlete('rejected')}
                                    disabled={evaluating}
                                    className="btn-secondary"
                                    style={{ color: '#dc2626', borderColor: '#fecaca', opacity: evaluating ? 0.5 : 1 }}
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleEvaluateAthlete('approved')}
                                    disabled={evaluating}
                                    className="btn-primary"
                                    style={{ opacity: evaluating ? 0.5 : 1 }}
                                >
                                    Approve Athlete
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="dashboard-grid mb-6">
                    <div className="card stat-card">
                        <div className="stat-header">
                            <span className="stat-title">Performance Score</span>
                            <span className="stat-badge badge-green">Index</span>
                        </div>
                        <div className="stat-value">{athlete.overallScore ? Number(athlete.overallScore).toFixed(1) : 'N/A'}</div>
                    </div>

                    <div className="card stat-card">
                        <div className="stat-header">
                            <span className="stat-title">Age / DOB</span>
                            <span className="stat-badge badge-default">Demo</span>
                        </div>
                        <div className="stat-value" style={{ fontSize: '24px' }}>
                            {athlete.dateOfBirth ? new Date(athlete.dateOfBirth).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '--'}
                        </div>
                    </div>

                    <div className="card stat-card">
                        <div className="stat-header">
                            <span className="stat-title">Location</span>
                            <span className="stat-badge badge-default">Region</span>
                        </div>
                        <div className="stat-value" style={{ fontSize: '24px' }}>
                            {athlete.state || '--'}
                        </div>
                    </div>

                    <div className="card stat-card">
                        <div className="stat-header">
                            <span className="stat-title">Gender</span>
                            <span className="stat-badge badge-default">Demo</span>
                        </div>
                        <div className="stat-value" style={{ fontSize: '24px', textTransform: 'capitalize' }}>
                            {athlete.gender || '--'}
                        </div>
                    </div>

                    <div className="card stat-card">
                        <div className="stat-header">
                            <span className="stat-title">Height</span>
                            <span className="stat-badge badge-default">Physical</span>
                        </div>
                        <div className="stat-value" style={{ fontSize: '24px' }}>
                            {athlete.height ? `${athlete.height} cm` : '--'}
                        </div>
                    </div>

                    <div className="card stat-card">
                        <div className="stat-header">
                            <span className="stat-title">Weight</span>
                            <span className="stat-badge badge-default">Physical</span>
                        </div>
                        <div className="stat-value" style={{ fontSize: '24px' }}>
                            {athlete.weight ? `${athlete.weight} kg` : '--'}
                        </div>
                    </div>
                </div>

                {/* Identity & Verification Documents Widget */}
                <div className="card leaderboard-widget mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold">Identity & Verification Documents</h2>
                        <span className="text-sm font-bold" style={{ color: '#64748b' }}>
                            {[athlete.aadhaarCardUrl, athlete.dobCertificateUrl, athlete.profilePhotoUrl].filter(Boolean).length} / 3 Uploaded
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Profile Photo */}
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#f8fafc' }}>
                            <div className="flex items-center gap-3">
                                <div style={{ backgroundColor: '#e0e7ff', padding: '10px', borderRadius: '8px', color: '#4f46e5' }}>
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '15px' }}>Profile Photo</h3>
                                    <p style={{ color: '#64748b', fontSize: '13px' }}>Facial Identification</p>
                                </div>
                            </div>
                            {athlete.profilePhotoUrl ? (
                                <a href={athlete.profilePhotoUrl} target="_blank" rel="noreferrer" className="btn-secondary text-center" style={{ textDecoration: 'none', color: '#4f46e5', borderColor: '#c7d2fe', fontSize: '13px', padding: '6px 12px', width: '100%' }}>
                                    View Full Photo
                                </a>
                            ) : (
                                <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', padding: '6px' }}>Not Uploaded</span>
                            )}
                        </div>

                        {/* Aadhaar Card */}
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#f8fafc' }}>
                            <div className="flex items-center gap-3">
                                <div style={{ backgroundColor: '#e0e7ff', padding: '10px', borderRadius: '8px', color: '#4f46e5' }}>
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '15px' }}>Aadhaar Card</h3>
                                    <p style={{ color: '#64748b', fontSize: '13px' }}>Identity Proof</p>
                                </div>
                            </div>
                            {athlete.aadhaarCardUrl ? (
                                <a href={athlete.aadhaarCardUrl} target="_blank" rel="noreferrer" className="btn-secondary text-center" style={{ textDecoration: 'none', color: '#4f46e5', borderColor: '#c7d2fe', fontSize: '13px', padding: '6px 12px', width: '100%' }}>
                                    View Document
                                </a>
                            ) : (
                                <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', padding: '6px' }}>Not Uploaded</span>
                            )}
                        </div>

                        {/* DOB Certificate */}
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#f8fafc' }}>
                            <div className="flex items-center gap-3">
                                <div style={{ backgroundColor: '#fce7f3', padding: '10px', borderRadius: '8px', color: '#db2777' }}>
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '15px' }}>DOB Certificate</h3>
                                    <p style={{ color: '#64748b', fontSize: '13px' }}>Age Verification</p>
                                </div>
                            </div>
                            {athlete.dobCertificateUrl ? (
                                <a href={athlete.dobCertificateUrl} target="_blank" rel="noreferrer" className="btn-secondary text-center" style={{ textDecoration: 'none', color: '#db2777', borderColor: '#fbcfe8', fontSize: '13px', padding: '6px 12px', width: '100%' }}>
                                    View Document
                                </a>
                            ) : (
                                <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', padding: '6px' }}>Not Uploaded</span>
                            )}
                        </div>

                        {/* Competition Video */}
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#f8fafc' }}>
                            <div className="flex items-center gap-3">
                                <div style={{ backgroundColor: '#dcfce7', padding: '10px', borderRadius: '8px', color: '#16a34a' }}>
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '15px' }}>Competition Video</h3>
                                    <p style={{ color: '#64748b', fontSize: '13px' }}>Unscored Reference</p>
                                </div>
                            </div>
                            {athlete.competitionVideoUrl ? (
                                <a href={athlete.competitionVideoUrl} target="_blank" rel="noreferrer" className="btn-secondary text-center" style={{ textDecoration: 'none', color: '#16a34a', borderColor: '#bbf7d0', fontSize: '13px', padding: '6px 12px', width: '100%' }}>
                                    Watch Video
                                </a>
                            ) : (
                                <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', padding: '6px' }}>Not Uploaded</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submissions Table Widget */}
                <div className="card leaderboard-widget mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold">Fitness Submissions</h2>
                        <span className="text-sm font-bold" style={{ color: '#64748b' }}>{submissions?.length || 0} Records Found</span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ color: '#64748b', fontSize: '12px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                                    <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>TEST NAME</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>DATE TAKEN</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>METRICS</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>SCORE</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>STATUS</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 'bold', textAlign: 'right' }}>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions && submissions.length > 0 ? (
                                    submissions.map((sub, i) => (
                                        <tr key={sub._id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '16px 24px', fontWeight: 'bold', color: '#0f172a' }}>{sub.testName}</td>
                                            <td style={{ padding: '16px 24px', color: '#475569' }}>
                                                {new Date(sub.dateTaken).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td style={{ padding: '16px 24px', color: '#475569' }}>
                                                <div>{sub.metrics?.duration ? `${sub.metrics.duration}s` : '--'}</div>
                                            </td>
                                            <td style={{ padding: '16px 24px', fontWeight: 'bold', color: '#2b2b85', fontSize: '16px' }}>
                                                {sub.score || '--'}
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                {sub.status === 'pending' ? (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="25"
                                                            placeholder="/25"
                                                            value={testScores[sub._id] || ''}
                                                            onChange={(e) => setTestScores({ ...testScores, [sub._id]: e.target.value })}
                                                            style={{ width: '60px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                                                        />
                                                        <button
                                                            onClick={() => handleEvaluateVideo(sub._id)}
                                                            className="btn-primary"
                                                            style={{ padding: '4px 12px', fontSize: '12px', minHeight: 'auto' }}
                                                        >
                                                            Save Score
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span style={{
                                                        backgroundColor: (sub.status === 'evaluated' || sub.status === 'approved') ? '#e0e7ff' : (sub.status === 'rejected' ? '#fee2e2' : '#fef3c7'),
                                                        color: (sub.status === 'evaluated' || sub.status === 'approved') ? '#4f46e5' : (sub.status === 'rejected' ? '#dc2626' : '#d97706'),
                                                        padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px'
                                                    }}>
                                                        {(sub.status === 'evaluated' || sub.status === 'approved') ? 'SCORED' : sub.status}
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                                {sub.videoProofUrl ? (
                                                    <a href={sub.videoProofUrl} target="_blank" rel="noreferrer" style={{ color: '#2b2b85', fontWeight: 'bold', textDecoration: 'none', fontSize: '13px' }}>
                                                        View Video
                                                    </a>
                                                ) : (
                                                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>No Tape</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No submissions found for this athlete.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Credentials Table Widget */}
                <div className="card leaderboard-widget">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold">Credentials & Vault</h2>
                        <span className="text-sm font-bold" style={{ color: '#64748b' }}>{achievements?.length || 0} Assets Linked</span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ color: '#64748b', fontSize: '12px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                                    <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>DOCUMENT TITLE</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 'bold' }}>DESCRIPTION</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 'bold', textAlign: 'right' }}>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {achievements && achievements.length > 0 ? (
                                    achievements.map((doc, i) => (
                                        <tr key={doc._id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '16px 24px', fontWeight: 'bold', color: '#0f172a' }}>{doc.title}</td>
                                            <td style={{ padding: '16px 24px', color: '#475569' }}>{doc.description || '--'}</td>
                                            <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                                {doc.proofUrl ? (
                                                    <a href={doc.proofUrl} target="_blank" rel="noreferrer" style={{ color: '#2b2b85', fontWeight: 'bold', textDecoration: 'none', fontSize: '13px' }}>
                                                        Access Document
                                                    </a>
                                                ) : (
                                                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>Unavailable</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No credentials or digital assets available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout >
    );
};

export default AthleteDetail;
