import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, FileCheck, Users, BarChart, Clock, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';

const SupervisorDashboard = () => {
    const navigate = useNavigate();
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([
        { title: 'Pending Validations', value: '0', icon: <FileCheck size={24} className="text-yellow-600" />, color: 'bg-yellow-100', border: 'border-yellow-200' },
        { title: 'Active Technicians', value: '18/20', icon: <Users size={24} className="text-blue-600" />, color: 'bg-blue-100', border: 'border-blue-200' },
        { title: 'Open Requests', value: '0', icon: <Activity size={24} className="text-green-600" />, color: 'bg-green-100', border: 'border-green-200' },
        { title: 'Avg. Response Time', value: '1.5 hrs', icon: <Clock size={24} className="text-purple-600" />, color: 'bg-purple-100', border: 'border-purple-200' }
    ]);

    // Fetch pending service requests from backend
    useEffect(() => {
        fetchPendingRequests();
        // Refresh every 30 seconds
        const interval = setInterval(fetchPendingRequests, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchPendingRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_ENDPOINTS.serviceRequests.pending);
            const data = await response.json();

            if (data.success) {
                setPendingRequests(data.requests);
                
                // Update stats
                const pendingCount = data.requests.length;
                const highPriorityCount = data.requests.filter(r => r.priority === 'high').length;
                
                setStats([
                    { title: 'Pending Validations', value: pendingCount.toString(), icon: <FileCheck size={24} className="text-yellow-600" />, color: 'bg-yellow-100', border: 'border-yellow-200' },
                    { title: 'Active Technicians', value: '18/20', icon: <Users size={24} className="text-blue-600" />, color: 'bg-blue-100', border: 'border-blue-200' },
                    { title: 'Open Requests', value: pendingCount.toString(), icon: <Activity size={24} className="text-green-600" />, color: 'bg-green-100', border: 'border-green-200' },
                    { title: 'Avg. Response Time', value: '1.5 hrs', icon: <Clock size={24} className="text-purple-600" />, color: 'bg-purple-100', border: 'border-purple-200' }
                ]);
            }
        } catch (error) {
            console.error('Error fetching pending requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        { icon: <Eye size={20} />, label: 'Review Requests', link: '/supervisor/requests', color: 'bg-indigo-600 hover:bg-indigo-700' },
        { icon: <FileCheck size={20} />, label: 'Validate Docs', link: '/supervisor/validate', color: 'bg-emerald-600 hover:bg-emerald-700' },
        { icon: <Users size={20} />, label: 'Assign Tasks', link: '/supervisor/assign', color: 'bg-blue-600 hover:bg-blue-700' },
        { icon: <BarChart size={20} />, label: 'Team Performance', link: '/supervisor/performance', color: 'bg-orange-600 hover:bg-orange-700' }
    ];

    // Format service requests for display
    const formatServiceType = (serviceType) => {
        const serviceMap = {
            'new-service': 'New Service Connection',
            'relocation': 'Service Relocation',
            'name-change': 'Name Change',
            'tariff-change': 'Tariff Change',
            'meter-separation': 'Meter Separation'
        };
        return serviceMap[serviceType] || serviceType;
    };

    const calculateWaitTime = (createdAt) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffMs = now - created;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        
        if (diffHours > 0) {
            return `${diffHours} hr${diffHours > 1 ? 's' : ''}`;
        }
        return `${diffMins} min${diffMins !== 1 ? 's' : ''}`;
    };

    // Separate requests by priority
    const highPriorityRequests = pendingRequests.filter(r => r.priority === 'high');
    const normalPriorityRequests = pendingRequests.filter(r => r.priority !== 'high');

    const teamOverview = [
        { name: 'Tech-023', status: 'On-site', tasks: 3, efficiency: '95%' },
        { name: 'Tech-045', status: 'Available', tasks: 1, efficiency: '92%' },
        { name: 'Tech-067', status: 'On-break', tasks: 2, efficiency: '88%' }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Supervisor Dashboard</h1>
                <p className="text-gray-500">Overview of field operations and team performance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className={`p-4 rounded-xl border ${stat.border} bg-white shadow-sm flex items-center justify-between`}>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.color}`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4">
                {quickActions.map((action, index) => (
                    <button
                        key={index}
                        className={`${action.color} text-white px-4 py-2.5 rounded-lg shadow-md flex items-center transition-transform transform hover:scale-105 active:scale-95 font-medium text-sm`}
                        onClick={() => navigate(action.link)}
                    >
                        <span className="mr-2">{action.icon}</span>
                        {action.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pending Queue - Takes up 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    {/* High Priority */}
                    <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
                        <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex justify-between items-center">
                            <h3 className="font-bold text-red-800 flex items-center">
                                <AlertTriangle size={18} className="mr-2" />
                                High Priority Queue
                            </h3>
                            <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full font-bold">
                                {highPriorityRequests.length} Pending
                            </span>
                        </div>
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading...</div>
                        ) : highPriorityRequests.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No high priority requests</div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {highPriorityRequests.map((request) => (
                                    <div key={request.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center cursor-pointer" onClick={() => navigate('/supervisor/requests')}>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-800">{request.ticket_id}</span>
                                                <span className="text-gray-400">|</span>
                                                <span className="font-medium text-gray-700">{formatServiceType(request.service_type)}</span>
                                            </div>
                                            <div className="text-xs text-gray-600 mt-1">{request.full_name} • {request.city}</div>
                                            <div className="text-xs text-red-500 font-medium mt-1">Wait Time: {calculateWaitTime(request.created_at)}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500">Status</div>
                                            <div className="font-medium text-yellow-600 capitalize">
                                                {request.status.replace('_', ' ')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Normal Priority */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-bold text-gray-700">New Connection Requests</h3>
                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full font-bold">
                                {normalPriorityRequests.length} Pending
                            </span>
                        </div>
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading...</div>
                        ) : normalPriorityRequests.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No pending requests</div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {normalPriorityRequests.map((request) => (
                                    <div key={request.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center cursor-pointer" onClick={() => navigate('/supervisor/requests')}>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-800">{request.ticket_id}</span>
                                                <span className="text-gray-400">|</span>
                                                <span className="font-medium text-gray-700">{formatServiceType(request.service_type)}</span>
                                            </div>
                                            <div className="text-xs text-gray-600 mt-1">{request.full_name} • {request.city}, {request.woreda}</div>
                                            <div className="text-xs text-gray-500 mt-1">Wait Time: {calculateWaitTime(request.created_at)}</div>
                                        </div>
                                        <button className="text-blue-600 text-sm font-medium hover:underline" onClick={(e) => { e.stopPropagation(); navigate('/supervisor/requests'); }}>
                                            Review
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Team Overview - Takes up 1 column */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-fit">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="font-bold text-gray-800">Team Status</h3>
                    </div>
                    <div className="p-2">
                        {teamOverview.map((tech, i) => (
                            <div key={i} className="p-3 mb-2 rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all bg-gray-50/50">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-800">{tech.name}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${tech.status === 'On-site' ? 'bg-green-100 text-green-700' :
                                        tech.status === 'Available' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-200 text-gray-700'
                                        }`}>
                                        {tech.status}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Active Tasks: <strong className="text-gray-700">{tech.tasks}</strong></span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 border-t border-gray-100 text-center">
                        <button className="text-blue-600 text-sm font-medium hover:underline w-full">
                            View All Technicians
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupervisorDashboard;