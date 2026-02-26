import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Plus, Trash2, Megaphone } from 'lucide-react';
import api from '../api';

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

    return (
        <Layout sidebarType="dark">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-1 text-main">Announcements</h1>
                    <p className="text-muted text-sm">Publish real-time news and updates to athlete apps</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Megaphone size={20} className="text-main" /> Post Update
                        </h2>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    className="form-input w-full"
                                    placeholder="e.g. New Trial Dates"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                                <select
                                    className="form-input w-full"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="general">General News</option>
                                    <option value="trial">Trials & Selection</option>
                                    <option value="scholarship">Scholarship</option>
                                    <option value="camp">Training Camp</option>
                                    <option value="update">Platform Update</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="form-input w-full min-h-[120px]"
                                    placeholder="Detailed update..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-primary flex items-center justify-center gap-2 mt-2"
                                disabled={posting}
                            >
                                <Plus size={18} />
                                {posting ? 'Publishing...' : 'Publish to App'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="card h-full">
                        <h2 className="text-xl font-bold mb-4">Active Announcements</h2>

                        {loading ? (
                            <div className="text-center py-10 text-muted">Loading...</div>
                        ) : announcements.length === 0 ? (
                            <div className="text-center py-10 text-muted bg-gray-50 rounded-lg">
                                No active announcements. Post one to notify athletes.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {announcements.map((item) => (
                                    <div key={item._id} className="p-4 border border-gray-100 rounded-lg flex items-start justify-between bg-white shadow-sm">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md uppercase tracking-wider">
                                                    {item.type}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(item.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-lg text-gray-800 mb-1">{item.title}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-4"
                                            title="Delete Announcement"
                                        >
                                            <Trash2 size={18} />
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
