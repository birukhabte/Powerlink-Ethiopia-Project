import React, { useState, useEffect } from 'react';
import {
    ListTodo,
    Clock,
    CheckCircle,
    Calendar,
    MapPin,
    ArrowRight,
    Loader2,
    AlertTriangle,
    Activity
} from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketContext';

const TechDashboard = () => {
    const navigate = useNavigate();
    const { socket, isConnected } = useSocket();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Real-time updates
    useEffect(() => {
        if (socket && isConnected) {
            // Listen for new task assignments
            socket.on('notification', (notification) => {
                if (notification.type === 'info' && notification.title.includes('assigned')) {
                    console.log('New task assigned:', notification);
                    // Refresh dashboard data
                    fetchDashboardData();
                }
            });

            // Listen for task updates
            socket.on('task-update', (updateData) => {
                console.log('Task updated:', updateData);
                fetchDashboardData();
            });
        }

        return () => {
            if (socket) {
                socket.off('notification');
                socket.off('task-update');
            }
        };
    }, [socket, isConnected]);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please log in to access the dashboard.');
                setLoading(false);
                return;
            }

            const response = await axios.get(API_ENDPOINTS.dashboard.technician, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setData(response.data.data);
                setError(null); // Clear any previous errors
            } else {
                setError('Failed to load dashboard data.');
            }
        } catch (err) {
            console.error('Error fetching technician dashboard:', err);
            if (err.response) {
                // Server responded with error status
                if (err.response.status === 401) {
                    setError('Authentication failed. Please log in again.');
                } else if (err.response.status === 403) {
                    setError('Access denied. You do not have permission to view this dashboard.');
                } else {
                    setError(`Server error: ${err.response.data?.error || 'Unknown error'}`);
                }
            } else if (err.request) {
                // Network error
                setError('Network error. Please check your connection and try again.');
            } else {
                // Other error
                setError('Failed to load dashboard data.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Destructure data for easier access
    const { stats = {}, assignedTasks = [], schedule = [] } = data || {};

    const cards = [
        { label: 'Assigned Tasks', value: stats.assigned || 0, icon: <ListTodo />, color: 'blue' },
        { label: 'In Progress', value: stats.in_progress || 0, icon: <Clock />, color: 'orange' },
        { label: 'Completed Today', value: stats.completed_today || 0, icon: <CheckCircle />, color: 'green' },
        { label: 'Upcoming', value: stats.upcoming || 0, icon: <Calendar />, color: 'purple' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Loading your dashboard...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <p className="text-red-600 font-medium mb-2">Failed to load dashboard</p>
                        <p className="text-gray-500 text-sm">{error}</p>
                        <button
                            onClick={fetchDashboardData}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            {!loading && !error && (
                <>
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Field Operations</h1>
                            <p className="text-gray-500 font-medium">Manage your assignments and site visits.</p>
                        </div>
                        <div className="bg-green-50 px-4 py-2 rounded-2xl border border-green-100 flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className={`text-sm font-black uppercase tracking-widest ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
                                {isConnected ? 'Live Updates Active' : 'Connecting...'}
                            </span>
                        </div>
                    </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl hover:shadow-gray-200/50 transition-all">
                        <div className={`p-3 rounded-2xl bg-${card.color}-50 text-${card.color}-600 w-fit mb-4 group-hover:scale-110 transition-transform`}>
                            {card.icon}
                        </div>
                        <div className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">{card.label}</div>
                        <div className="text-3xl font-black text-gray-900">{card.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Assignments */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
                        <h2 className="font-black text-gray-900 flex items-center gap-2">
                            <ListTodo className="text-blue-600" />
                            Active Assignments
                        </h2>
                        <button 
                            onClick={() => navigate('/technician/tasks')}
                            className="text-blue-600 text-xs font-black uppercase hover:underline flex items-center gap-1"
                        >
                            Task Manager <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="flex-1">
                        {assignedTasks.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">
                                <Clock size={40} className="mx-auto mb-4 opacity-20" />
                                <p className="font-medium">No active tasks assigned to you right now.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {assignedTasks.slice(0, 4).map(task => (
                                    <div key={task.id} className="p-6 hover:bg-green-50/30 transition-colors flex items-center justify-between group">
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 p-2 rounded-xl ${task.priority === 'high' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                                <AlertTriangle size={16} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-gray-900">{task.id}</span>
                                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                                                        {task.type === 'service_request' ? 'Service' : 'Outage'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                                                    <MapPin size={14} className="text-gray-400" /> {task.location}
                                                </p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => navigate('/technician/tasks')}
                                            className="p-3 rounded-2xl bg-gray-50 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:bg-green-600 group-hover:text-white transition-all shadow-lg"
                                        >
                                            <ArrowRight size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Schedule Snapshot */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/20">
                        <h2 className="font-black text-gray-900 flex items-center gap-2">
                            <Calendar className="text-purple-600" />
                            Daily Schedule
                        </h2>
                    </div>
                    <div className="flex-1 p-6">
                        {schedule.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                                <Calendar size={32} className="mb-2 opacity-20" />
                                <p className="text-sm font-medium">No scheduled visits for today.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {schedule.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-start relative pb-4 last:pb-0">
                                        {idx !== schedule.length - 1 && (
                                            <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-gray-100"></div>
                                        )}
                                        <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-black text-xs flex-shrink-0 z-10 border-2 border-white">
                                            {idx + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs font-black text-purple-600 uppercase tracking-widest">
                                                {new Date(item.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="font-bold text-gray-900 text-sm truncate">
                                                {item.ticket_id || `OUT-${item.id}`}
                                            </div>
                                            <div className="text-xs text-gray-500 font-medium truncate">
                                                {item.type === 'service_request' ? 
                                                    `${item.city || ''}, ${item.woreda || ''}` : 
                                                    item.address || 'Location not specified'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
                </>
            )}
        </div>
    );
};

export default TechDashboard;
