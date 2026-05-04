import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FileCheck, Users, Activity, Clock, AlertTriangle, CheckCircle, TrendingUp, BarChart3 } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SupervisorDashboardModern = () => {
    const { darkMode } = useOutletContext() || { darkMode: true };

    // Mock data for supervisor dashboard
    const stats = [
        { title: 'Pending Validations', value: '12', icon: <FileCheck size={24} />, color: darkMode ? 'from-yellow-600 to-orange-600' : 'from-yellow-500 to-orange-500' },
        { title: 'Active Technicians', value: '18/20', icon: <Users size={24} />, color: darkMode ? 'from-blue-600 to-cyan-600' : 'from-blue-500 to-cyan-500' },
        { title: 'Open Requests', value: '24', icon: <Activity size={24} />, color: darkMode ? 'from-green-600 to-emerald-600' : 'from-green-500 to-emerald-500' },
        { title: 'Avg Response Time', value: '1.5 hrs', icon: <Clock size={24} />, color: darkMode ? 'from-purple-600 to-pink-600' : 'from-purple-500 to-pink-500' }
    ];

    const requestTrendData = [
        { month: 'Jan', pending: 15, completed: 28, inProgress: 12 },
        { month: 'Feb', pending: 18, completed: 32, inProgress: 14 },
        { month: 'Mar', pending: 12, completed: 35, inProgress: 18 },
        { month: 'Apr', pending: 20, completed: 40, inProgress: 16 },
        { month: 'May', pending: 24, completed: 45, inProgress: 20 },
        { month: 'Jun', pending: 22, completed: 50, inProgress: 19 }
    ];

    const requestStatusData = [
        { name: 'Pending', value: 24, color: darkMode ? '#fbbf24' : '#f59e0b' },
        { name: 'In Progress', value: 20, color: darkMode ? '#60a5fa' : '#3b82f6' },
        { name: 'Completed', value: 45, color: darkMode ? '#34d399' : '#10b981' },
        { name: 'On Hold', value: 8, color: darkMode ? '#f87171' : '#ef4444' }
    ];

    const teamMembers = [
        { id: 'TECH-001', name: 'John Smith', status: 'on-site', tasks: 3, efficiency: 95, location: 'Sector 1' },
        { id: 'TECH-002', name: 'Mike Johnson', status: 'available', tasks: 1, efficiency: 92, location: 'Sector 2' },
        { id: 'TECH-003', name: 'Sarah Williams', status: 'on-site', tasks: 4, efficiency: 98, location: 'Sector 3' },
        { id: 'TECH-004', name: 'Tom Brown', status: 'on-break', tasks: 2, efficiency: 88, location: 'Base' },
        { id: 'TECH-005', name: 'Lisa Davis', status: 'available', tasks: 0, efficiency: 94, location: 'Sector 4' }
    ];

    const recentRequests = [
        { id: 'REQ-2024-001', type: 'New Connection', customer: 'Abebe Kebede', location: 'Bole', priority: 'high', status: 'pending', waitTime: '2h 30m' },
        { id: 'REQ-2024-002', type: 'Meter Replacement', customer: 'Almaz Tadesse', location: 'Nifas Silk', priority: 'medium', status: 'in-progress', waitTime: '1h 15m' },
        { id: 'REQ-2024-003', type: 'Service Relocation', customer: 'Girma Assefa', location: 'Addis Ketema', priority: 'medium', status: 'pending', waitTime: '45m' },
        { id: 'REQ-2024-004', type: 'Tariff Change', customer: 'Hiwot Mulugeta', location: 'Kolfe', priority: 'low', status: 'completed', waitTime: '30m' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700';
            case 'in-progress':
                return darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700';
            case 'completed':
                return darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700';
            default:
                return darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-700';
        }
    };

    const getTechStatusColor = (status) => {
        switch (status) {
            case 'on-site':
                return darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700';
            case 'available':
                return darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700';
            case 'on-break':
                return darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700';
            default:
                return darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Supervisor Dashboard
                </h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Overview of field operations and team performance
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border overflow-hidden relative`}
                    >
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {stat.title}
                                </p>
                                <h3 className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {stat.value}
                                </h3>
                            </div>
                            <div className={`p-3 rounded-lg bg-gradient-to-br from-${stat.color.split(' ')[1]} text-white`}>
                                {stat.icon}
                            </div>
                        </div>
                        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 ${darkMode ? 'bg-cyan-400' : 'bg-blue-400'}`}></div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Request Trend Chart */}
                <div className={`lg:col-span-2 ${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
                    <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Request Trends (6 Months)
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={requestTrendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                            <XAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                            <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: darkMode ? '#1f2a40' : '#ffffff',
                                    border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                                    borderRadius: '8px',
                                    color: darkMode ? '#ffffff' : '#000000'
                                }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="pending" stroke={darkMode ? '#fbbf24' : '#f59e0b'} strokeWidth={2} />
                            <Line type="monotone" dataKey="inProgress" stroke={darkMode ? '#60a5fa' : '#3b82f6'} strokeWidth={2} />
                            <Line type="monotone" dataKey="completed" stroke={darkMode ? '#34d399' : '#10b981'} strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Request Status Pie Chart */}
                <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
                    <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Request Status Distribution
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={requestStatusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {requestStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: darkMode ? '#1f2a40' : '#ffffff',
                                    border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                                    borderRadius: '8px',
                                    color: darkMode ? '#ffffff' : '#000000'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Team Members and Recent Requests */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team Members */}
                <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
                    <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Team Members
                    </h2>
                    <div className="space-y-3">
                        {teamMembers.map((tech) => (
                            <div key={tech.id} className={`${darkMode ? 'bg-[#141b2d] border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-lg p-4 border`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {tech.name}
                                        </p>
                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {tech.id} • {tech.location}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTechStatusColor(tech.status)}`}>
                                        {tech.status.replace('-', ' ').toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                        Tasks: <span className={`font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>{tech.tasks}</span>
                                    </span>
                                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                        Efficiency: <span className={`font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{tech.efficiency}%</span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Requests */}
                <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
                    <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Recent Requests
                    </h2>
                    <div className="space-y-3">
                        {recentRequests.map((req) => (
                            <div key={req.id} className={`${darkMode ? 'bg-[#141b2d] border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-lg p-4 border`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {req.id}
                                        </p>
                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {req.type} • {req.customer}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(req.status)}`}>
                                        {req.status.replace('-', ' ').toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                        {req.location}
                                    </span>
                                    <span className={`font-medium ${req.priority === 'high' ? (darkMode ? 'text-red-400' : 'text-red-600') : (darkMode ? 'text-gray-400' : 'text-gray-600')}`}>
                                        {req.waitTime}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupervisorDashboardModern;
