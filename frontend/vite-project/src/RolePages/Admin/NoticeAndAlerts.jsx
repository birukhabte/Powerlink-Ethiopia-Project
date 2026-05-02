import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
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
    Clock,
    X
} from 'lucide-react';

import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const NoticeAndAlerts = () => {
    const { darkMode } = useOutletContext();
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
        if (darkMode) {
            switch (type) {
                case 'error':
                case 'warning': return 'bg-red-900/20 border-l-4 border-red-500';
                case 'maintenance': return 'bg-yellow-900/20 border-l-4 border-yellow-500';
                default: return 'bg-cyan-900/20 border-l-4 border-cyan-500';
            }
        } else {
            switch (type) {
                case 'error':
                case 'warning': return 'bg-red-50 border-l-4 border-red-500';
                case 'maintenance': return 'bg-yellow-50 border-l-4 border-yellow-500';
                default: return 'bg-blue-50 border-l-4 border-blue-500';
            }
        }
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Notices & Alerts Panel</h1>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Manage public notices and emergency alerts</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className={`px-4 py-2 ${darkMode ? 'bg-gradient-to-r from-purple-600 to-cyan-600' : 'bg-gradient-to-r from-blue-600 to-blue-500'} text-white rounded-lg hover:opacity-90 transition flex items-center shadow-lg`}
                    >
                        <Plus className="mr-2" /> Create Notice
                    </button>
                </div>

                {/* Create/Edit Notice Form */}
                {showForm && (
                    <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200 shadow-md'} rounded-xl p-6 mb-6 border`}>
                        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {editingNotice ? 'Edit Notice' : 'Create New Notice'}
                        </h2>
                        <form onSubmit={handleCreateNotice} className="space-y-4">
                            <div>
                                <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title</label>
                                <input
                                    type="text"
                                    value={newNotice.title}
                                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                                    className={`w-full p-3 ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                    placeholder="Enter notice title"
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Message</label>
                                <textarea
                                    value={newNotice.message}
                                    onChange={(e) => setNewNotice({ ...newNotice, message: e.target.value })}
                                    className={`w-full p-3 ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                    rows="3"
                                    placeholder="Enter notice message"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type</label>
                                    <select
                                        value={newNotice.type}
                                        onChange={(e) => setNewNotice({ ...newNotice, type: e.target.value })}
                                        className={`w-full p-3 ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                    >
                                        <option value="info">Announcement</option>
                                        <option value="warning">Warning Alert</option>
                                        <option value="error">Emergency Alert</option>
                                        <option value="success">Success Notice</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Target Audience</label>
                                    <select
                                        value={newNotice.target}
                                        onChange={(e) => setNewNotice({ ...newNotice, target: e.target.value })}
                                        className={`w-full p-3 ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                    >
                                        <option value="all">All Users</option>
                                        <option value="customers">Customers Only</option>
                                        <option value="special">Special Customers</option>
                                        <option value="specific">Specific Area</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className={`block mb-2 flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <Calendar className="mr-2" size={18} /> Schedule (Optional)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={newNotice.schedule}
                                    onChange={(e) => setNewNotice({ ...newNotice, schedule: e.target.value })}
                                    className={`w-full p-3 ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className={`px-4 py-2 border ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-[#141b2d]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`px-4 py-2 ${darkMode ? 'bg-gradient-to-r from-purple-600 to-cyan-600' : 'bg-gradient-to-r from-blue-600 to-blue-500'} text-white rounded-lg hover:opacity-90 transition flex items-center shadow-lg`}
                                >
                                    <Send className="mr-2" /> {editingNotice ? 'Update Notice' : 'Publish Notice'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Notices List */}
                <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200 shadow-md'} rounded-xl overflow-hidden border`}>
                    {notices.length === 0 ? (
                        <div className="p-12 text-center">
                            <Bell className={`mx-auto ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`} size={48} />
                            <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>No Notices Available</h3>
                            <p className={darkMode ? 'text-gray-500' : 'text-gray-500'}>Create your first notice to inform users</p>
                        </div>
                    ) : (
                        <div className={`${darkMode ? 'divide-gray-700' : 'divide-gray-200'} divide-y`}>
                            {notices.map(notice => (
                                <div key={notice.id} className={`p-6 ${getTypeColor(notice.type)}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center">
                                            {getTypeIcon(notice.type)}
                                            <h3 className={`text-lg font-bold ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{notice.title}</h3>
                                            <span className={`ml-3 px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-[#141b2d] text-gray-300 border border-gray-700' : 'bg-white text-gray-700 border border-gray-300'}`}>
                                                {notice.type.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditNotice(notice)}
                                                className={`p-1 ${darkMode ? 'text-cyan-400 hover:bg-cyan-400/10' : 'text-blue-600 hover:bg-blue-50'} rounded`}
                                                title="Edit Notice"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteNotice(notice.id)}
                                                className={`p-1 ${darkMode ? 'text-red-400 hover:bg-red-400/10' : 'text-red-600 hover:bg-red-50'} rounded`}
                                                title="Delete Notice"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{notice.content}</p>

                                    <div className={`flex justify-between items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
                        <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200 shadow-md'} p-4 rounded-xl text-center border`}>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>{notices.length}</div>
                            <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Total Notices</div>
                        </div>
                        <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200 shadow-md'} p-4 rounded-xl text-center border`}>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                                {notices.filter(n => n.type === 'error' || n.type === 'warning').length}
                            </div>
                            <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Emergency Alerts</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoticeAndAlerts;