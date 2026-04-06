import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Check, CheckCheck, Trash2, Clock, Info, AlertCircle, CheckCircle2, MoreVertical, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Updates = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unread, read
    const [searchQuery, setSearchQuery] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setNotifications(response.data.notifications);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_URL}/api/notifications/read/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_URL}/api/notifications/read-all`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'alert': return <AlertCircle className="text-red-500" size={20} />;
            case 'success': return <CheckCircle2 className="text-green-500" size={20} />;
            case 'info': return <Info className="text-blue-500" size={20} />;
            default: return <Bell className="text-gray-400" size={20} />;
        }
    };

    const filteredNotifications = notifications.filter(n => {
        const matchesFilter = filter === 'all' ? true : (filter === 'unread' ? !n.is_read : n.is_read);
        const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             n.message.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 pb-20">
            {/* Header section */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 mb-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-10 bg-blue-50/20 rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-blue-600/10 rounded-2xl w-fit">
                                <Bell className="text-blue-600" size={24} />
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Updates</h1>
                        </div>
                        <p className="text-gray-500 font-medium">You have <span className="text-blue-600 font-bold">{unreadCount}</span> new notifications.</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        <button 
                            onClick={markAllAsRead}
                            className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all text-sm"
                        >
                            <CheckCheck size={18} /> Mark all as read
                        </button>
                    </div>
                </div>

                {/* Filters and Search Bar */}
                <div className="mt-8 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search updates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner placeholder:text-gray-400 font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100 italic font-medium text-gray-500 self-center md:self-auto">
                        <button 
                            onClick={() => setFilter('all')}
                            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${filter === 'all' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setFilter('unread')}
                            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${filter === 'unread' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Unread
                        </button>
                        <button 
                            onClick={() => setFilter('read')}
                            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${filter === 'read' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Read
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4 bg-white rounded-3xl shadow-sm italic font-medium text-gray-500">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-blue-600"></div>
                        <p className="font-bold text-gray-400 animate-pulse uppercase tracking-widest text-sm">Loading notifications</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="p-20 text-center bg-white rounded-3xl shadow-xl border border-dashed border-gray-200 border-2">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="text-blue-200" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 italic font-medium text-gray-500">No updates found</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">Try adjusting your filters or check back later for system notifications.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filteredNotifications.map((notification) => (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`group p-5 md:p-6 rounded-3xl transition-all border shadow-sm flex items-start gap-4 ${notification.is_read ? 'bg-white/60 border-gray-100 grayscale-[0.3]' : 'bg-white border-blue-100 ring-1 ring-blue-50 shadow-md translate-y-[-2px]'}`}
                            >
                                <div className={`p-3 rounded-2xl flex-shrink-0 ${notification.is_read ? 'bg-gray-100' : 'bg-blue-50 shadow-sm shadow-blue-100'}`}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-1">
                                        <h3 className={`font-bold truncate text-lg ${notification.is_read ? 'text-gray-700' : 'text-gray-900 border-b-2 border-blue-600/10 w-fit'}`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-xs text-gray-400 font-bold flex items-center gap-1 flex-shrink-0 mt-1 uppercase">
                                            <Clock size={12} /> {new Date(notification.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className={`text-sm leading-relaxed mb-4 ${notification.is_read ? 'text-gray-500' : 'text-gray-600 font-medium'}`}>
                                        {notification.message}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        {!notification.is_read && (
                                            <button 
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => deleteNotification(notification.id)}
                                            className="text-xs font-black text-red-400 uppercase tracking-widest hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors ml-auto md:ml-0 opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default Updates;
