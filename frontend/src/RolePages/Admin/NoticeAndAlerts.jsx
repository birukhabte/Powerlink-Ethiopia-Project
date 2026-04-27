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
    Clock,
    Target,
    Shield,
    XCircle,
    RefreshCw
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
        target_role: 'all',
        schedule: ''
    });

    React.useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_ENDPOINTS.announcements.admin, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setNotices(response.data.announcement1);
            }
        } catch (error) {
            console.error('Error fetching notices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNotice = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const announcementData = {
                title: newNotice.title,
                content: newNotice.message,
                type: newNotice.type,
                target_role: newNotice.target_role,
                priority: newNotice.type === 'error' ? 5 : newNotice.type === 'warning' ? 4 : 3,
                expires_at: newNotice.schedule || null
            };

            const url = editingNotice 
                ? API_ENDPOINTS.announcements.byId(editingNotice.id) 
                : API_ENDPOINTS.announcements.base;
            
            const method = editingNotice ? 'put' : 'post';
            
            const response = await axios[method](url, announcementData, {
                headers: { Authorization: `Bearer ${token}` }
            });
                
            if (response.data.success) {
                fetchNotices();
                handleCancelEdit();
                alert(`Notice ${editingNotice ? 'updated' : 'published'} successfully!`);
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
            target_role: notice.target_role || 'all',
            schedule: notice.expires_at ? new Date(notice.expires_at).toISOString().slice(0, 16) : ''
        });
        setShowForm(true);
    };

    const handleCancelEdit = () => {
        setShowForm(false);
        setEditingNotice(null);
        setNewNotice({ title: '', message: '', type: 'info', target_role: 'all', schedule: '' });
    };

    const handleDeleteNotice = async (id) => {
        if (!window.confirm('Are you sure you want to delete this notice?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(API_ENDPOINTS.announcements.byId(id), {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setNotices(notices.filter(n => n.id !== id));
            }
        } catch (error) {
            console.error('Error deleting notice:', error);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'error': return <AlertTriangle className="text-red-500" />;
            case 'warning': return <AlertTriangle className="text-amber-500" />;
            case 'maintenance': return <Wrench className="text-blue-500" />;
            default: return <Bell className="text-indigo-500" />;
        }
    };

    const getTargetBadge = (role) => {
        switch (role) {
            case 'supervisor': return <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1"><Shield size={10} /> Supervisor</span>;
            case 'technician': return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1"><Wrench size={10} /> Technician</span>;
            case 'customer': return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1"><Users size={10} /> Customers</span>;
            default: return <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">All Users</span>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">BROADCAST CENTER</h1>
                        <p className="text-slate-500 font-medium italic">Manage system-wide alerts and role-specific notifications</p>
                    </div>
                    <button onClick={() => setShowForm(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 flex items-center shadow-lg shadow-indigo-100 transition-all active:scale-95">
                        <Plus className="mr-2" /> CREATE NEW BROADCAST
                    </button>
                </header>

                {showForm && (
                    <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10 border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-slate-900 italic uppercase tracking-widest flex items-center gap-2">
                                <Send className="text-indigo-600" size={24} /> {editingNotice ? 'REVISE BROADCAST' : 'COMPOSE BROADCAST'}
                            </h2>
                            <button onClick={handleCancelEdit} className="text-slate-400 hover:text-slate-600">
                                <XCircle />
                            </button>
                        </div>
                        <form onSubmit={handleCreateNotice} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Broadcast Title</label>
                                    <input type="text" value={newNotice.title} onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold" placeholder="E.g. System Maintenance Window" required />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Alert Category</label>
                                    <select value={newNotice.type} onChange={(e) => setNewNotice({ ...newNotice, type: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold">
                                        <option value="info">Standard Announcement</option>
                                        <option value="warning">Urgent Warning</option>
                                        <option value="error">Emergency Alert</option>
                                        <option value="maintenance">Maintenance Update</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Broadcast Content</label>
                                <textarea value={newNotice.message} onChange={(e) => setNewNotice({ ...newNotice, message: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all min-h-[120px]" placeholder="Enter the full message for the targeted users..." required />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest flex items-center gap-2">
                                        <Target size={12} /> Target Audience
                                    </label>
                                    <select value={newNotice.target_role} onChange={(e) => setNewNotice({ ...newNotice, target_role: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold">
                                        <option value="all">Everyone (Global)</option>
                                        <option value="customer">Customers Only</option>
                                        <option value="supervisor">Supervisors Only</option>
                                        <option value="technician">Technicians Only</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest flex items-center gap-2">
                                        <Calendar size={12} /> Expiration (Optional)
                                    </label>
                                    <input type="datetime-local" value={newNotice.schedule} onChange={(e) => setNewNotice({ ...newNotice, schedule: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={handleCancelEdit} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                                    DISCARD
                                </button>
                                <button type="submit" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 flex items-center gap-2">
                                    <Send size={18} /> {editingNotice ? 'UPDATE BROADCAST' : 'PUBLISH BROADCAST'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center py-20">
                            <RefreshCw className="animate-spin text-indigo-500 mb-4" size={48} />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching active broadcasts...</p>
                        </div>
                    ) : notices.length === 0 ? (
                        <div className="bg-white rounded-[2.5rem] p-20 text-center border-4 border-dashed border-slate-200">
                            <Bell className="mx-auto text-slate-200 mb-6" size={80} />
                            <h3 className="text-2xl font-black text-slate-800 italic uppercase">Silence is Golden</h3>
                            <p className="text-slate-500 font-medium">No active broadcasts or alerts in the system.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {notices.map(notice => (
                                <div key={notice.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                                                {getTypeIcon(notice.type)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    {getTargetBadge(notice.target_role)}
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${notice.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                        {notice.is_active ? 'Active' : 'Expired'}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-black text-slate-900 tracking-tight">{notice.title}</h3>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditNotice(notice)} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-indigo-100 hover:text-indigo-600 transition-all">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDeleteNotice(notice.id)} className="p-2 bg-slate-100 text-red-600 rounded-xl hover:bg-red-100 transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 text-sm font-medium leading-relaxed px-1">
                                        {notice.content}
                                    </p>
                                    <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(notice.created_at).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><Clock size={12} /> {new Date(notice.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Shield size={12} /> CREATED BY {notice.created_by_username || 'ADMIN'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoticeAndAlerts;