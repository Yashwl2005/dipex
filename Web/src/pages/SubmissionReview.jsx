import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { History, Play, SkipBack, SkipForward, Volume2, Settings, Maximize, ShieldAlert, Download, CheckCircle, RefreshCcw, XCircle, FileText, Activity } from 'lucide-react';
import api from '../api';

export const SubmissionReview = () => {
    const [submission, setSubmission] = useState(null);
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                // In a real app, you'd get the submission ID from the URL params
                // For this demo, we'll just fetch the first pending submission
                const sportsStr = localStorage.getItem('sports');
                const sports = sportsStr ? JSON.parse(sportsStr).join(',') : '';
                const res = await api.get(`/admin/submissions?status=pending&sports=${sports}`);
                if (res.data.length > 0) {
                    setSubmission(res.data[0]);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchSubmissions();
    }, []);

    const evaluate = async (status, baseScore) => {
        if (!submission) return;
        try {
            await api.put(`/admin/submissions/${submission._id}/evaluate`, {
                status,
                score: baseScore,
                remarks
            });
            alert(`Submission ${status} successfully!`);
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    if (!submission) {
        return (
            <Layout sidebarType="none" showHeader={true}>
                <div style={{ padding: '40px', textAlign: 'center' }}>No pending submissions to review.</div>
            </Layout>
        );
    }

    const { user } = submission;

    return (
        <Layout sidebarType="none" showHeader={true}>
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <div className="text-sm text-muted mb-2 font-medium">
                        Home &gt; Submissions &gt; <strong style={{ color: '#0f172a' }}>{user?.name || 'Athlete'} - Review</strong>
                    </div>
                    <h1 className="text-3xl font-bold mb-1" style={{ color: '#2b2b85' }}>Submission Review</h1>
                    <p className="text-muted text-sm">Application ID: {submission._id.substring(0, 8).toUpperCase()} &bull; Submitted on {new Date(submission.dateTaken).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-4">
                    <div style={{ padding: '8px 16px', color: '#d97706', border: '1px solid #fde68a', backgroundColor: '#fef3c7', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#d97706' }}></div>
                        Status: Pending Evaluation
                    </div>
                    <button className="btn-secondary flex items-center gap-2" style={{ borderRadius: '8px', padding: '8px 16px' }}>
                        <History size={16} />
                        History
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '24px', alignItems: 'start' }}>
                {/* Left Column - Video Player */}
                <div>
                    <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#1e293b', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                        {submission.videoProofUrl ? (
                            <video
                                src={submission.videoProofUrl}
                                controls
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: '#64748b' }}>
                                No video proof provided for this submission.
                            </div>
                        )}
                    </div>

                    {/* Video Tools Bar */}
                    <div className="card mt-6" style={{ display: 'flex', gap: '24px', padding: '16px 24px' }}>
                        <div>
                            <div className="text-xs text-muted font-bold tracking-wider mb-2">PLAYBACK SPEED</div>
                            <div className="flex gap-2">
                                {['0.25x', '0.5x', '1x', '2x'].map(speed => (
                                    <button key={speed} style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', backgroundColor: speed === '1x' ? '#2b2b85' : '#f1f5f9', color: speed === '1x' ? 'white' : '#64748b', fontWeight: 'bold' }}>{speed}</button>
                                ))}
                            </div>
                        </div>
                        <div style={{ width: '1px', backgroundColor: '#e2e8f0' }}></div>
                        <div>
                            <div className="text-xs text-muted font-bold tracking-wider mb-2">FRAME SCRUBBING</div>
                            <div className="flex gap-2">
                                <button style={{ padding: '8px 24px', borderRadius: '4px', border: 'none', backgroundColor: '#f1f5f9', color: '#64748b' }}><SkipBack size={18} /></button>
                                <button style={{ padding: '8px 24px', borderRadius: '4px', border: 'none', backgroundColor: '#f1f5f9', color: '#64748b' }}><SkipForward size={18} /></button>
                            </div>
                        </div>
                        <div style={{ width: '1px', backgroundColor: '#e2e8f0' }}></div>
                        <div style={{ flex: 1 }}>
                            <div className="text-xs text-muted font-bold tracking-wider mb-2">ANALYSIS TOOLS</div>
                            <div className="flex gap-2 w-full">
                                <button style={{ flex: 1, padding: '8px 16px', borderRadius: '4px', border: 'none', backgroundColor: '#f1f5f9', color: '#64748b' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg></button>
                                <button style={{ flex: 1, padding: '8px 16px', borderRadius: '4px', border: 'none', backgroundColor: '#f1f5f9', color: '#64748b' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z" /><path d="M4 12h16" /><path d="M12 4v16" /></svg></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Info Panels */}
                <div>
                    {/* Athlete Profile Card */}
                    <div className="card mb-6" style={{ padding: '24px' }}>
                        <div className="flex gap-4 mb-6">
                            <div style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                                <img src="https://i.pravatar.cc/150?img=12" alt="Rajesh Kumar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-main">Rajesh Kumar</div>
                                <div className="text-sm font-semibold" style={{ color: '#2b2b85', marginBottom: '4px' }}>Category: Elite Javelin Throw</div>
                                <div className="flex gap-2 mt-1">
                                    <span style={{ fontSize: '10px', fontWeight: 'bold', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>U-19</span>
                                    <span style={{ fontSize: '10px', fontWeight: 'bold', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>HARYANA</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <div className="text-xs text-muted mb-1 font-bold">AGE</div>
                                <div className="text-sm font-bold text-main">18 Years 4 Months</div>
                            </div>
                            <div>
                                <div className="text-xs text-muted mb-1 font-bold">PRIMARY SPORT</div>
                                <div className="text-sm font-bold text-main">Athletics - Javelin</div>
                            </div>
                            <div>
                                <div className="text-xs text-muted mb-1 font-bold">COACH</div>
                                <div className="text-sm font-bold text-main">Dharmendra Singh</div>
                            </div>
                            <div>
                                <div className="text-xs text-muted mb-1 font-bold">ACADEMIC LEVEL</div>
                                <div className="text-sm font-bold text-main">12th Standard</div>
                            </div>
                        </div>
                    </div>

                    {/* Certificates & Documents */}
                    <div className="card mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold">Certificates & Documents</h3>
                            <span style={{ fontSize: '12px', backgroundColor: '#f8fafc', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold', color: '#64748b' }}>2 Files</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                <div className="flex items-center gap-3">
                                    <div style={{ width: '32px', height: '32px', backgroundColor: '#fee2e2', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                                        <FileText size={16} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-main">National_Participation_2023.pdf</div>
                                        <div className="text-xs text-muted">1.2 MB &bull; Verified</div>
                                    </div>
                                </div>
                                <button style={{ color: '#94a3b8' }}><Download size={18} /></button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                <div className="flex items-center gap-3">
                                    <div style={{ width: '32px', height: '32px', backgroundColor: '#e0e7ff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                                        <FileText size={16} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-main">State_ID_Proof.jpg</div>
                                        <div className="text-xs text-muted">842 KB &bull; Verified</div>
                                    </div>
                                </div>
                                <button style={{ color: '#94a3b8' }}><Download size={18} /></button>
                            </div>
                        </div>
                    </div>

                    {/* AI Performance Metrics */}
                    <div className="card mb-6">
                        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                            <Activity size={18} color="#4f46e5" /> AI PERFORMANCE METRICS
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                                <div className="text-xs font-bold text-muted mb-2 tracking-wider">RELEASE VELOCITY</div>
                                <div className="text-2xl font-bold text-main mb-2">28.4 <span className="text-sm text-muted">m/s</span></div>
                                <div style={{ width: '100%', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}>
                                    <div style={{ width: '85%', height: '100%', backgroundColor: '#2b2b85', borderRadius: '2px' }}></div>
                                </div>
                            </div>
                            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                                <div className="text-xs font-bold text-muted mb-2 tracking-wider">LAUNCH ANGLE</div>
                                <div className="text-2xl font-bold text-main mb-2">42.1 <span className="text-sm text-muted">deg</span></div>
                                <div style={{ width: '100%', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}>
                                    <div style={{ width: '70%', height: '100%', backgroundColor: '#2b2b85', borderRadius: '2px' }}></div>
                                </div>
                            </div>
                            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                                <div className="text-xs font-bold text-muted mb-1 tracking-wider">GRIP TECHNIQUE</div>
                                <div className="text-sm font-bold" style={{ color: '#16a34a' }}>EXCELLENT (FORK)</div>
                                <div className="text-xs text-muted mt-1">Confidence: 94%</div>
                            </div>
                            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                                <div className="text-xs font-bold text-muted mb-1 tracking-wider">RUN-UP SPEED</div>
                                <div className="text-sm font-bold" style={{ color: '#2b2b85' }}>CONSISTENCY HIGH</div>
                                <div className="text-xs text-muted mt-1">6.8m/s Peak</div>
                            </div>
                        </div>
                    </div>

                    {/* Reviewer Evaluation */}
                    <div className="card" style={{ borderColor: '#e2e8f0' }}>
                        <h3 className="text-sm font-bold mb-4">Reviewer Evaluation</h3>

                        <div className="mb-4">
                            <div className="text-xs font-bold text-muted mb-2 tracking-wider">REVIEWER REMARKS</div>
                            <textarea
                                style={{ width: '100%', minHeight: '100px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }}
                                placeholder="Enter detailed feedback for the athlete..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            ></textarea>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '20px' }}>
                            <div className="flex items-center gap-2">
                                <ShieldAlert size={16} color="#ef4444" />
                                <span className="text-sm font-bold text-main">Flag as Suspicious</span>
                            </div>
                            <div style={{ width: '40px', height: '24px', backgroundColor: '#e2e8f0', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                                <div style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => evaluate('approved', 92)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4', color: '#16a34a', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <CheckCircle size={20} />
                                APPROVE
                            </button>
                            <button onClick={() => evaluate('pending', 0)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #fed7aa', backgroundColor: '#fff7ed', color: '#ea580c', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <RefreshCcw size={20} />
                                REUPLOAD
                            </button>
                            <button onClick={() => evaluate('rejected', 0)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#dc2626', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <XCircle size={20} />
                                REJECT
                            </button>
                        </div>

                        <div className="text-center mt-4">
                            <span className="text-xs text-muted italic">Evaluating this submission will notify the State Admin and Athlete via SMS/Email.</span>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
};
