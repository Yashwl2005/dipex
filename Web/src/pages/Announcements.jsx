import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Plus, Trash2, Megaphone, Send, Bell, Calendar, Award, Info, AlertCircle } from 'lucide-react';
import api from '../api';
import './Announcements.css';

export default function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'general'
    });

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        try {
            setLoading(true);
            const res = await api.get('/announcements');
            setAnnouncements(res.data);
        } catch (error) {
            console.error('Error loading announcements:', error);
            alert('Failed to load announcements');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description) return;

        try {
            setPosting(true);
            await api.post('/announcements', formData);
            setFormData({ title: '', description: '', type: 'general' });
            loadAnnouncements();
        } catch (error) {
            console.error('Failed to post announcement', error);
            alert('Failed to post announcement');
        } finally {
            setPosting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;

        try {
            await api.delete(`/announcements/${id}`);
            loadAnnouncements();
        } catch (error) {
            console.error('Failed to delete', error);
            alert('Failed to delete announcement');
        }
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'general': return <Bell size={24} />;
            case 'trial': return <Calendar size={24} />;
            case 'scholarship': return <Award size={24} />;
            case 'camp': return <AlertCircle size={24} />;
            case 'update': return <Info size={24} />;
            default: return <Megaphone size={24} />;
        }
    };

    return (
        <Layout sidebarType="light">
            <div className="announcements-header-card">
                <h1 className="announcements-header-title">Announcements Hub</h1>
                <p className="announcements-header-subtitle">Publish dynamic, real-time news to all connected athlete applications instantly.</p>
            </div>

            <div className="dashboard-grid max-w-4xl mx-auto">
                {/* Form Section */}
                <div style={{ gridColumn: 'span 12' }}>
                    <div className="card h-full" style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
                            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: '#0f172a', margin: 0 }}>
                                <Send size={20} className="text-main" /> Create Update
                            </h2>
                            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', marginBottom: 0 }}>
                                Push a notification instantly to all athletes.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6" style={{ padding: '24px' }}>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    className="form-input w-full"
                                    placeholder="e.g. National Trials Q3 Dates"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '14px' }}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                <select
                                    className="form-input w-full"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '14px', cursor: 'pointer' }}
                                >
                                    <option value="general">General News</option>
                                    <option value="trial">Trials & Selection</option>
                                    <option value="scholarship">Scholarship & Grants</option>
                                    <option value="camp">Training Camp Alert</option>
                                    <option value="update">App Platform Update</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                                <textarea
                                    className="form-input w-full"
                                    placeholder="Enter the detailed announcement text here..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '14px', resize: 'vertical', minHeight: '48px' }}
                                    rows={2}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-primary flex items-center justify-center gap-2 mt-2"
                                style={{ width: '100%', padding: '14px', borderRadius: '8px', fontSize: '15px' }}
                                disabled={posting}
                            >
                                <Plus size={18} />
                                {posting ? 'Publishing...' : 'Publish Update'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div style={{ gridColumn: 'span 12' }}>
                    <div className="card h-full" style={{ padding: '32px', backgroundColor: '#f8fafc', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                        <div className="flex justify-between items-center mb-6" style={{ paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
                            <h2 className="text-xl font-bold" style={{ color: '#0f172a' }}>Live Feed</h2>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', backgroundColor: '#fff', padding: '6px 16px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                {announcements.length} Active Records
                            </span>
                        </div>

                        {loading ? (
                            <div className="text-center py-12" style={{ color: '#64748b', fontWeight: '600' }}>
                                <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', margin: '0 auto 16px auto', animation: 'spin 1s linear infinite' }}></div>
                                Syncing announcements...
                            </div>
                        ) : announcements.length === 0 ? (
                            <div className="empty-state-card">
                                <div className="empty-state-icon">
                                    <Megaphone size={32} />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>No Broadcasts Active</h3>
                                <p style={{ maxWidth: '300px', margin: '0 auto', lineHeight: '1.5' }}>Create your first announcement using the form to instantly notify your athletes.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {announcements.map((item) => (
                                    <div key={item._id} className={`announcement-card type-${item.type}`}>
                                        <div className="flex" style={{ flex: 1 }}>
                                            <div className="announcement-icon-wrapper">
                                                {getIconForType(item.type)}
                                            </div>
                                            <div style={{ flex: 1, paddingRight: '16px' }}>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="announcement-badge">
                                                        {item.type}
                                                    </span>
                                                    <span className="announcement-date">
                                                        {new Date(item.createdAt).toLocaleString(undefined, {
                                                            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                                <h3 className="announcement-title">{item.title}</h3>
                                                <p className="announcement-desc">{item.description}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="announcement-delete-btn"
                                            title="Retract Announcement"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
