import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Clock, Zap, MapPin, User, TrendingUp, Download } from 'lucide-react';
import {
    BarChart as RechartsBarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const CustomerDashboard = () => {
    const context = useOutletContext() || {};
    const { darkMode = true } = context;

    const [stats, setStats] = useState({
        powerStatus: 'Loading...',
        openTickets: 0,
        resolvedIssues: 0,
        avgResponseTime: 'Calculating...'
    });
    const [recentTickets, setRecentTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');

            // Fetch service requests
            const requestsResponse = await fetch(`${API_URL}/api/service-requests`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const requestsData = await requestsResponse.json();

            // Fetch outages
            const outagesResponse = await fetch(`${API_URL}/api/outages`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const outagesData = await outagesResponse.json();

            if (requestsData.success && outagesData.success) {
                // Filter user's requests
                const userRequests = requestsData.requests.filter(r => r.customer_id === user.id);
                const userOutages = outagesData.outages.filter(o => o.reported_by === user.id);

                // Calculate stats
                const openCount = [...userRequests, ...userOutages].filter(
                    item => item.status === 'pending' || item.status === 'under_review' || item.status === 'in_progress'
                ).length;

                const resolvedCount = [...userRequests, ...userOutages].filter(
                    item => item.status === 'completed' || item.status === 'resolved'
                ).length;

                // Calculate average response time
                const completedItems = [...userRequests, ...userOutages].filter(
                    item => item.status === 'completed' || item.status === 'resolved'
                );
                
                let avgTime = 'N/A';
                if (completedItems.length > 0) {
                    const totalHours = completedItems.reduce((sum, item) => {
                        const created = new Date(item.created_at);
                        const updated = new Date(item.updated_at);
                        const hours = (updated - created) / (1000 * 60 * 60);
                        return sum + hours;
                    }, 0);
                    avgTime = `${(totalHours / completedItems.length).toFixed(1)} hrs`;
                }

                setStats({
                    powerStatus: 'Active',
                    openTickets: openCount,
                    resolvedIssues: resolvedCount,
                    avgResponseTime: avgTime
                });

                // Format recent tickets
                const allTickets = [
                    ...userRequests.map(r => ({
                        id: r.ticket_id,
                        title: formatServiceType(r.service_type),
                        status: r.status,
                        date: new Date(r.created_at).toLocaleDateString(),
                        location: r.full_address,
                        technician: r.assigned_to_username || 'Unassigned'
                    })),
                    ...userOutages.map(o => ({
                        id: o.ticket_id,
                        title: 'Power Outage Report',
                        status: o.status,
                        date: new Date(o.created_at).toLocaleDateString(),
                        location: o.location,
                        technician: o.assigned_to_username || 'Unassigned'
                    }))
                ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

                setRecentTickets(allTickets);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

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

    // Customer Stats
    const statsCards = [
        {
            icon: <Zap size={24} />,
            label: 'Power Status',
            value: stats.powerStatus,
            change: 'Connected',
            color: 'green'
        },
        {
            icon: <AlertTriangle size={24} />,
            label: 'Open Tickets',
            value: loading ? '...' : stats.openTickets.toString(),
            change: 'Active requests',
            color: 'orange'
        },
        {
            icon: <CheckCircle size={24} />,
            label: 'Resolved Issues',
            value: loading ? '...' : stats.resolvedIssues.toString(),
            change: 'Completed',
            color: 'blue'
        },
        {
            icon: <Clock size={24} />,
            label: 'Avg Response Time',
            value: loading ? '...' : stats.avgResponseTime,
            change: 'Average',
            color: 'purple'
        }
    ];

    // Service Requests Data (mock for chart)
    const serviceRequests = [
        { month: 'Jan', requests: 2, completed: 2 },
        { month: 'Feb', requests: 3, completed: 3 },
        { month: 'Mar', requests: 1, completed: 1 },
        { month: 'Apr', requests: 4, completed: 3 },
        { month: 'May', requests: 2, completed: 2 },
        { month: 'Jun', requests: 3, completed: 3 }
    ];

    // Outage History (mock for table)
    const outageHistory = [
        { area: 'Bole', outages: 3, avgDuration: '2.5 hrs' },
        { area: 'Megenagna', outages: 2, avgDuration: '1.8 hrs' },
        { area: 'Kirkos', outages: 4, avgDuration: '3.2 hrs' },
        { area: 'Gurd Shola', outages: 1, avgDuration: '1.5 hrs' },
        { area: 'Addis Central', outages: 2, avgDuration: '2.0 hrs' }
    ];

    // Request Status Distribution (calculated from real data)
    const requestStatus = [
        { name: 'Completed', value: stats.resolvedIssues, color: '#10b981' },
        { name: 'In Progress', value: Math.floor(stats.openTickets / 2), color: '#3b82f6' },
        { name: 'Pending', value: Math.ceil(stats.openTickets / 2), color: '#f59e0b' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return darkMode ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-green-100 text-green-800 border-green-300';
            case 'in_progress':
                return darkMode ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-800 border-blue-300';
            case 'pending':
                return darkMode ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-yellow-100 text-yellow-800 border-yellow-300';
            default:
                return darkMode ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' : 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatColor = (color) => {
        const colors = {
            green: darkMode ? 'text-green-400' : 'text-green-600',
            orange: darkMode ? 'text-orange-400' : 'text-orange-600',
            blue: darkMode ? 'text-blue-400' : 'text-blue-600',
            purple: darkMode ? 'text-purple-400' : 'text-purple-600'
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Welcome Back, John!
                </h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Here's your power service overview
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((stat, idx) => (
                    <div
                        key={idx}
                        className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border transition-all hover:shadow-lg`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-100'}`}>
                                <div className={getStatColor(stat.color)}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                            {stat.label}
                        </h3>
                        <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                            {stat.value}
                        </div>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {stat.change}
                        </p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Service Requests Chart */}
                <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                        <TrendingUp className={darkMode ? 'text-cyan-400' : 'text-blue-600'} size={20} />
                        Service Requests Trend
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={serviceRequests}>
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
                            <Line type="monotone" dataKey="requests" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4' }} />
                            <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Request Status Distribution */}
                <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                        <CheckCircle className={darkMode ? 'text-cyan-400' : 'text-blue-600'} size={20} />
                        Request Status Distribution
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={requestStatus}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {requestStatus.map((entry, index) => (
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

            {/* Recent Tickets */}
            <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border mb-8`}>
                <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                    <Clock className={darkMode ? 'text-cyan-400' : 'text-blue-600'} size={20} />
                    Recent Service Requests
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'}>
                            <tr>
                                <th className={`text-left p-3 font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Ticket ID</th>
                                <th className={`text-left p-3 font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Title</th>
                                <th className={`text-left p-3 font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Location</th>
                                <th className={`text-left p-3 font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Technician</th>
                                <th className={`text-left p-3 font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Status</th>
                                <th className={`text-left p-3 font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Date</th>
                            </tr>
                        </thead>
                        <tbody className={`${darkMode ? 'divide-gray-700' : 'divide-gray-200'} divide-y`}>
                            {recentTickets.map((ticket) => (
                                <tr key={ticket.id} className={darkMode ? 'hover:bg-[#141b2d]' : 'hover:bg-gray-50'}>
                                    <td className={`p-3 font-mono text-sm ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                                        {ticket.id}
                                    </td>
                                    <td className={`p-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {ticket.title}
                                    </td>
                                    <td className={`p-3 flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <MapPin size={14} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                                        {ticket.location}
                                    </td>
                                    <td className={`p-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {ticket.technician}
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(ticket.status)}`}>
                                            {ticket.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </td>
                                    <td className={`p-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {ticket.date}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Outage History by Area */}
            <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
                <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                    <AlertTriangle className={darkMode ? 'text-red-400' : 'text-red-600'} size={20} />
                    Outage History by Area
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'}>
                            <tr>
                                <th className={`text-left p-3 font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Area</th>
                                <th className={`text-left p-3 font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Total Outages</th>
                                <th className={`text-left p-3 font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Avg Duration</th>
                                <th className={`text-left p-3 font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Trend</th>
                            </tr>
                        </thead>
                        <tbody className={`${darkMode ? 'divide-gray-700' : 'divide-gray-200'} divide-y`}>
                            {outageHistory.map((item, idx) => (
                                <tr key={idx} className={darkMode ? 'hover:bg-[#141b2d]' : 'hover:bg-gray-50'}>
                                    <td className={`p-3 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {item.area}
                                    </td>
                                    <td className={`p-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {item.outages}
                                    </td>
                                    <td className={`p-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {item.avgDuration}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-1">
                                            <TrendingUp size={16} className="text-green-500" />
                                            <span className="text-sm text-green-500">Stable</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
