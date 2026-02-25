import React, { useState } from 'react';
import {
    Bell,
    AlertTriangle,
    Wrench,
    Edit,
    Trash2,
    Send,
    Calendar,
    Eye,
    Users,
    Plus,
    Clock
} from 'lucide-react';

import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const NoticeAndAlerts = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const [newNotice, setNewNotice] = useState({
        title: '',
        message: '',
        type: 'info',
        target: 'all',
        schedule: ''
    });

    // Fetch notices on mount
    React.useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.announcements.admin);
            // Handle the API response format: { success: true, announcement1: [...] }
            if (response.data.success) {
                setNotices(response.data.announcement1);
            } else {
                console.error('Failed to fetch notices:', response.data.error);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notices:', error);
            setLoading(false);
        }
    };

    const handleCreateNotice = async (e) => {
        e.preventDefault();
        try {
            // Map the notice fields to announcement fields
            const announcementData = {
                title: newNotice.title,
                content: newNotice.message,
                type: newNotice.type,
                priority: newNotice.type === 'error' ? 5 : newNotice.type === 'warning' ? 4 : 3,
                expires_at: newNotice.schedule || null,
                created_by: 1
            };

            if (editingNotice) {
                // Update existing notice
                const response = await axios.put(API_ENDPOINTS.announcements.byId(editingNotice.id), announcementData);
                
                if (response.data.success) {
                    fetchNotices();
                    setNewNotice({ title: '', message: '', type: 'info', target: 'all', schedule: '' });
                    setShowForm(false);
                    setEditingNotice(null);
                    alert('Notice updated successfully!');
                } else {
                    alert('Failed to update notice: ' + response.data.error);
                }
            } else {
                // Create new notice
                const response = await axios.post(API_ENDPOINTS.announcements.base, announcementData);
                
                if (response.data.success) {
                    fetchNotices();
                    setNewNotice({ title: '', message: '', type: 'info', target: 'all', schedule: '' });
                    setShowForm(false);
                    alert('Notice created successfully!');
                } else {
                    alert('Failed to create notice: ' + response.data.error);
                }
            }
        } catch (error) {
            console.error('Error saving notice:', error);
            alert('Failed to save notice');
        }
    };

    const handleEditNotice = (notice) => {
        setEditingNotice(notice);
        setNewNotice({
            title: notice.title,
            message: notice.content,
            type: notice.type,
            target: 'all',
            schedule: notice.expires_at ? new Date(notice.expires_at).toISOString().slice(0, 16) : ''
        });
        setShowForm(true);
    };

    const handleCancelEdit = () => {
        setShowForm(false);
        setEditingNotice(null);
        setNewNotice({ title: '', message: '', type: 'info', target: 'all', schedule: '' });
    };

    const handleDeleteNotice = async (id) => {
        if (window.confirm('Delete this notice?')) {
            try {
                const response = await axios.delete(API_ENDPOINTS.announcements.byId(id));
                if (response.data.success) {
                    setNotices(notices.filter(notice => notice.id !== id));
                    alert('Notice deleted successfully!');
                } else {
                    alert('Failed to delete notice: ' + response.data.error);
                }
            } catch (error) {
                console.error('Error deleting notice:', error);
                alert('Failed to delete notice');
            }
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'error':
            case 'warning': return <AlertTriangle className="text-red-500" />;
            case 'maintenance': return <Wrench className="text-yellow-500" />;
            default: return <Bell className="text-blue-500" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'error':
            case 'warning': return 'bg-red-50 border-red-200';
            case 'maintenance': return 'bg-yellow-50 border-yellow-200';
            default: return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Notices & Alerts Panel</h1>
                        <p className="text-gray-600">Manage public notices and emergency alerts</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    >
                        <Plus className="mr-2" /> Create Notice
                    </button>
                </div>

                {/* Create/Edit Notice Form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4">
                            {editingNotice ? 'Edit Notice' : 'Create New Notice'}
                        </h2>
                        <form onSubmit={handleCreateNotice} className="space-y-4">
                            <div>
                                <label className="block mb-2">Title</label>
                                <input
                                    type="text"
                                    value={newNotice.title}
                                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    placeholder="Enter notice title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Message</label>
                                <textarea
                                    value={newNotice.message}
                                    onChange={(e) => setNewNotice({ ...newNotice, message: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    rows="3"
                                    placeholder="Enter notice message"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2">Type</label>
                                    <select
                                        value={newNotice.type}
                                        onChange={(e) => setNewNotice({ ...newNotice, type: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    >
                                        <option value="info">Announcement</option>
                                        <option value="warning">Warning Alert</option>
                                        <option value="error">Emergency Alert</option>
                                        <option value="success">Success Notice</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2">Target Audience</label>
                                    <select
                                        value={newNotice.target}
                                        onChange={(e) => setNewNotice({ ...newNotice, target: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    >
                                        <option value="all">All Users</option>
                                        <option value="customers">Customers Only</option>
                                        <option value="special">Special Customers</option>
                                        <option value="specific">Specific Area</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 flex items-center">
                                    <Calendar className="mr-2" size={18} /> Schedule (Optional)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={newNotice.schedule}
                                    onChange={(e) => setNewNotice({ ...newNotice, schedule: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                                >
                                    <Send className="mr-2" /> {editingNotice ? 'Update Notice' : 'Publish Notice'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Notices List */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    {notices.length === 0 ? (
                        <div className="p-12 text-center">
                            <Bell className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-gray-600 mb-2">No Notices Available</h3>
                            <p className="text-gray-500">Create your first notice to inform users</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notices.map(notice => (
                                <div key={notice.id} className={`p-6 ${getTypeColor(notice.type)}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center">
                                            {getTypeIcon(notice.type)}
                                            <h3 className="text-lg font-bold ml-2">{notice.title}</h3>
                                            <span className="ml-3 px-2 py-1 text-xs rounded-full bg-white">
                                                {notice.type.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditNotice(notice)}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                title="Edit Notice"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteNotice(notice.id)}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                title="Delete Notice"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 mb-4">{notice.content}</p>

                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <div className="flex items-center space-x-4">
                                            <span className="flex items-center">
                                                <Users size={14} className="mr-1" />
                                                All Users
                                            </span>
                                            <span className="flex items-center">
                                                <Calendar size={14} className="mr-1" />
                                                {new Date(notice.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <span className="flex items-center">
                                            <Clock size={14} className="mr-1" />
                                            {notice.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats Summary */}
                {notices.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-white p-4 rounded-xl shadow text-center">
                            <div className="text-2xl font-bold text-blue-600">{notices.length}</div>
                            <div className="text-gray-600">Total Notices</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {notices.filter(n => n.type === 'error' || n.type === 'warning').length}
                            </div>
                            <div className="text-gray-600">Emergency Alerts</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoticeAndAlerts;