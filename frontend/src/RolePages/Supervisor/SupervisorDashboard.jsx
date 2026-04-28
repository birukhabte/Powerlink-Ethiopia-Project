import React, { useState, useEffect } from 'react';
import {
    ClipboardList,
    Clock,
    CheckCircle,
    AlertCircle,
    Users,
    TrendingUp,
    MapPin,
    ArrowRight,
    Loader2
} from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { useNavigate } from 'react-router-dom';

const SupervisorDashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(API_ENDPOINTS.dashboard.supervisor, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setData(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching supervisor dashboard:', err);
                setError('Failed to load dashboard. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-10">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-bold">Synchronizing dispatch data...</p>
            </div>
        );
    }

    const { stats, pendingRequests, pendingOutages, activeTechnicians } = data;

    const statCards = [
        { label: 'Total Requests', value: stats.total, icon: <ClipboardList />, color: 'blue' },
        { label: 'Pending Dispatch', value: stats.pending, icon: <Clock />, color: 'amber' },
        { label: 'Active Tasks', value: stats.in_progress + stats.assigned, icon: <TrendingUp />, color: 'indigo' },
        { label: 'Recently Completed', value: stats.completed, icon: <CheckCircle />, color: 'green' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Operations Center</h1>
                <p className="text-gray-500 font-medium">Monitoring service flow and technician dispatch.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
                        <div className={`p-3 rounded-2xl bg-${card.color}-50 text-${card.color}-600 w-fit mb-4 group-hover:scale-110 transition-transform`}>
                            {card.icon}
                        </div>
                        <div className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">{card.label}</div>
                        <div className="text-3xl font-black text-gray-900">{card.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Urgent Pending Requests */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <h2 className="font-black text-gray-900 flex items-center gap-2">
                            <AlertCircle className="text-amber-500" />
                            Urgent Requests ({pendingRequests.length + pendingOutages.length})
                        </h2>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => navigate('/supervisor/requests')}
                                className="text-blue-600 text-xs font-black uppercase hover:underline flex items-center gap-1"
                            >
                                Service <ArrowRight size={14} />
                            </button>
                            <button 
                                onClick={() => navigate('/supervisor/outages')}
                                className="text-orange-600 text-xs font-black uppercase hover:underline flex items-center gap-1"
                            >
                                Outages <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1">
                        {pendingRequests.length === 0 && pendingOutages.length === 0 ? (
                            <div className="p-10 text-center text-gray-400 font-medium">No pending requests found</div>
                        ) : (
                            <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                                {/* Service Requests */}
                                {pendingRequests.slice(0, 3).map(req => (
                                    <div key={`service-${req.id}`} className="p-5 hover:bg-blue-50/30 transition-colors flex items-center justify-between group">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`w-2 h-2 rounded-full ${req.priority === 'high' ? 'bg-red-500' : 'bg-amber-400'}`}></span>
                                                <span className="font-bold text-gray-900 text-sm">{req.ticket_id}</span>
                                                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">Service</span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate font-medium flex items-center gap-1">
                                                <MapPin size={12} /> {req.full_address}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => navigate('/supervisor/requests')}
                                            className="p-2 rounded-xl bg-blue-50 text-blue-600 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                ))}
                                
                                {/* Outage Reports */}
                                {pendingOutages.slice(0, 3).map(outage => (
                                    <div key={`outage-${outage.id}`} className="p-5 hover:bg-orange-50/30 transition-colors flex items-center justify-between group">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`w-2 h-2 rounded-full ${outage.urgency === 'high' ? 'bg-red-500' : 'bg-amber-400'}`}></span>
                                                <span className="font-bold text-gray-900 text-sm">OUT-{outage.id}</span>
                                                <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold uppercase">Outage</span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate font-medium flex items-center gap-1">
                                                <MapPin size={12} /> {outage.address}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => navigate('/supervisor/outages')}
                                            className="p-2 rounded-xl bg-orange-50 text-orange-600 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Available Technicians */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <h2 className="font-black text-gray-900 flex items-center gap-2">
                            <Users className="text-green-600" />
                            Dispatchable Technicians
                        </h2>
                    </div>
                    <div className="flex-1">
                        {activeTechnicians.length === 0 ? (
                            <div className="p-10 text-center text-gray-400 font-medium">No technicians online</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                                {activeTechnicians.map(tech => (
                                    <div key={tech.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-black text-lg">
                                            {tech.first_name?.[0] || 'T'}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-gray-900 text-sm truncate">{tech.first_name} {tech.last_name}</div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">Available</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Performance Banner */}
            <div className="bg-blue-600 p-8 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-200">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
                        <TrendingUp size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black mb-1">Weekly Resolution Rate: 92%</h2>
                        <p className="text-blue-100 font-medium text-sm">Response times are 15% faster than last month. Keep it up!</p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/supervisor/requests')}
                    className="px-8 py-3 bg-white text-blue-600 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-lg"
                >
                    Review Queue
                </button>
            </div>
        </div>
    );
};

export default SupervisorDashboard;