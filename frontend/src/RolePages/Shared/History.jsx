import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History as HistoryIcon, Search, Calendar, Filter, CheckCircle2, AlertTriangle, ExternalLink, Download, Clock, MapPin, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/schedule`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                // For history, we show completed tasks
                const completed = response.data.schedule.filter(item => 
                    item.extendedProps.status.toLowerCase() === 'completed' || 
                    item.extendedProps.status.toLowerCase() === 'closed'
                );
                setHistory(completed);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredHistory = history.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.extendedProps.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterType === 'all' ? true : item.type === filterType;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            {/* Header Section */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 bg-green-50/20 rounded-full translate-x-1/2 -translate-y-1/2 -z-10"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-4 bg-green-600/10 rounded-2xl w-fit shadow-lg shadow-green-100">
                                <HistoryIcon className="text-green-600" size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Task History</h1>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Archive of your completed assignments</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-xl shadow-blue-200 flex items-center gap-4 transition-transform hover:scale-105 active:scale-95 italic font-medium text-gray-500">
                        <div>
                            <div className="text-blue-100 font-black text-xs uppercase tracking-widest">Total Resolved</div>
                            <div className="text-4xl font-black">{history.length}</div>
                        </div>
                        <div className="h-10 w-[2px] bg-white/20"></div>
                        <CheckCircle2 size={40} className="text-blue-200" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Filters and Actions */}
                <div className="mt-10 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search completed tasks by title or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner placeholder:text-gray-400 font-medium"
                        />
                    </div>
                    <div className="font-bold flex items-center gap-3 p-1 bg-gray-50 rounded-2xl border border-gray-100 self-center md:self-auto uppercase tracking-widest">
                        <button 
                            onClick={() => setFilterType('all')}
                            className={`px-8 py-3 rounded-xl font-black text-[10px] transition-all ${filterType === 'all' ? 'bg-white text-blue-600 shadow-md transform scale-105 border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            All Tasks
                        </button>
                        <button 
                            onClick={() => setFilterType('outage')}
                            className={`px-8 py-3 rounded-xl font-black text-[10px] transition-all ${filterType === 'outage' ? 'bg-white text-red-600 shadow-md transform scale-105 border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Outages
                        </button>
                        <button 
                            onClick={() => setFilterType('service')}
                            className={`px-8 py-3 rounded-xl font-black text-[10px] transition-all ${filterType === 'service' ? 'bg-white text-blue-600 shadow-md transform scale-105 border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Service
                        </button>
                    </div>
                    <button className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-500 hover:text-blue-600 transition-all font-bold hover:shadow-lg">
                        <Download size={24} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="grid gap-6">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4 bg-white rounded-3xl shadow-sm italic font-medium text-gray-500">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-green-600"></div>
                        <p className="font-bold text-gray-400 animate-pulse uppercase tracking-widest text-sm">Synchronizing history</p>
                    </div>
                ) : filteredHistory.length === 0 ? (
                    <div className="p-24 text-center bg-white rounded-3xl shadow-xl border border-dashed border-gray-200 border-4">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <HistoryIcon className="text-gray-200" size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 mb-2 italic font-medium text-gray-500 tracking-tight">No Archive Found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto font-medium">Your resolved tasks and maintenance logs will appear here once they are marked as completed.</p>
                        <button className="mt-8 px-10 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-black active:scale-95 shadow-xl shadow-gray-200 flex items-center gap-3 mx-auto">
                            Go to active tasks <ExternalLink size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                       {filteredHistory.map((item, index) => (
                           <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-2xl hover:border-blue-100 hover:translate-x-2"
                            >
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${item.type === 'outage' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                                {item.type}
                                            </span>
                                            <span className="text-xs font-bold text-gray-300 italic font-medium text-gray-500">ID: {item.originalId || item.id}</span>
                                        </div>
                                        <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
                                            {item.title}
                                        </h2>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium line-clamp-2 italic transition-all group-hover:line-clamp-none">
                                            {item.extendedProps.description || item.extendedProps.service_type || 'Resolved maintenance task associated with your role.'}
                                        </p>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-50">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Completed On</span>
                                                <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                    <Calendar size={14} className="text-blue-600" /> {new Date(item.start).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Resolution Time</span>
                                                <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                    <Clock size={14} className="text-blue-600" /> 1.5 Hours
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Location</span>
                                                <p className="text-sm font-bold text-gray-700 truncate flex items-center gap-2">
                                                    <MapPin size={14} className="text-blue-600" /> {item.extendedProps.address || 'Field Office'}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Result</span>
                                                <p className="text-sm font-bold text-green-600 flex items-center gap-2 uppercase tracking-tighter">
                                                    <Tag size={14} /> Resolved
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:w-px bg-gray-50"></div>
                                    <div className="flex flex-col justify-center gap-3">
                                        <button className="flex items-center gap-2 p-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-blue-600 active:scale-95 shadow-xl shadow-gray-100">
                                            View Report <ExternalLink size={14} />
                                        </button>
                                        <button className="flex items-center justify-center p-4 bg-gray-50 text-gray-400 rounded-2xl transition-all hover:bg-gray-100 hover:text-gray-700 group/btn">
                                            <Download size={20} className="group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                           </motion.div>
                       ))}
                    </div>
                )}
            </div>
            
            <p className="text-center mt-12 text-gray-300 text-xs font-black uppercase tracking-[0.2em] italic font-medium text-gray-500">End of history logs • PowerLink Project</p>
        </div>
    );
};

export default History;
