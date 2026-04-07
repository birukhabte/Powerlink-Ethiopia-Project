import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Check, CheckCheck, Trash2, Clock, Info, AlertCircle, CheckCircle2, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
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
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 bg-blue-50/20 rounded-full translate-x-1/2 -translate-y-1/2 -z-10"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-4 bg-blue-600/10 rounded-2xl w-fit shadow-lg shadow-blue-100">
                                <Bell className="text-blue-600" size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none italic font-medium text-gray-500">Notifications</h1>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Personalized system alerts and messages</p>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={markAllAsRead}
                        className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
                    >
                        <CheckCheck size={18} /> Mark all read
                    </button>
                </div>

                <div className="mt-10 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search in notifications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner placeholder:text-gray-400 font-medium"
                        />
                    </div>
                    <div className="font-bold flex items-center gap-3 p-1 bg-gray-50 rounded-2xl border border-gray-100 self-center md:self-auto uppercase tracking-widest">
                        {['all', 'unread', 'read'].map((f) => (
                            <button 
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-8 py-3 rounded-xl font-black text-[10px] transition-all uppercase ${filter === f ? 'bg-white text-blue-600 shadow-md transform scale-105 border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4 bg-white rounded-3xl shadow-sm italic font-medium text-gray-500">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-blue-600"></div>
                        <p className="font-bold text-gray-400 animate-pulse uppercase tracking-widest text-sm">Receiving updates</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="p-24 text-center bg-white rounded-3xl shadow-xl border border-dashed border-gray-200 border-4 italic">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Bell className="text-gray-200" size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 mb-2 italic font-medium text-gray-500 tracking-tight">Everything's quiet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto font-medium">You're all caught up! No new notifications to show right now.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filteredNotifications.map((n, idx) => (
                            <motion.div
                                key={n.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`group p-6 md:p-8 rounded-3xl border transition-all shadow-sm flex items-start gap-6 ${n.is_read ? 'bg-white/60 border-gray-100' : 'bg-white border-blue-100 ring-1 ring-blue-50 shadow-md translate-y-[-2px]'}`}
                            >
                                <div className={`p-4 rounded-2xl flex-shrink-0 ${n.is_read ? 'bg-gray-100' : 'bg-blue-50 shadow-lg shadow-blue-100'}`}>
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-6 mb-2">
                                        <h3 className={`text-xl font-black truncate tracking-tight transition-colors ${n.is_read ? 'text-gray-700' : 'text-gray-900 group-hover:text-blue-600'}`}>
                                            {n.title}
                                        </h3>
                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-2 flex-shrink-0 mt-2">
                                            <Clock size={12} className="text-blue-600" /> {new Date(n.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className={`text-sm leading-relaxed mb-6 font-medium italic ${n.is_read ? 'text-gray-500' : 'text-gray-600'}`}>
                                        {n.message}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        {!n.is_read && (
                                            <button 
                                                onClick={() => markAsRead(n.id)}
                                                className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:text-blue-700 bg-blue-50 px-6 py-2 rounded-xl border border-blue-100 shadow-sm transition-all hover:shadow-lg active:scale-95"
                                            >
                                                Mark as Done
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => deleteNotification(n.id)}
                                            className="text-red-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-all ml-auto md:ml-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
            <p className="text-center mt-12 text-gray-300 text-[10px] font-black uppercase tracking-[0.4em] italic font-medium text-gray-500">Encrypted Dashboard Access</p>
        </div>
    );
};

export default Notifications;
