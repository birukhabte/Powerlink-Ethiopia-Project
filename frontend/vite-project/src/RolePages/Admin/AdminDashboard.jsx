import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Download, Users, Server, Wrench, AlertTriangle } from 'lucide-react';
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
    ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
    const { darkMode } = useOutletContext();
    
    // Stats data
    const stats = [
        { 
            icon: <Users size={24} />, 
            label: 'Total Users', 
            value: '1,245', 
            change: '+12%',
            percentage: 75
        },
        { 
            icon: <Wrench size={24} />, 
            label: 'Service Requests', 
            value: '342', 
            change: '+8%',
            percentage: 65
        },
        { 
            icon: <AlertTriangle size={24} />, 
            label: 'Active Outages', 
            value: '23', 
            change: '-15%',
            percentage: 50
        },
        { 
            icon: <Server size={24} />, 
            label: 'System Uptime', 
            value: '99.8%', 
            change: '+0.2%',
            percentage: 99
        },
    ];

    // Service requests chart data
    const serviceRequestsData = [
        { month: 'Jan', pending: 45, inProgress: 32, completed: 78 },
        { month: 'Feb', pending: 52, inProgress: 38, completed: 85 },
        { month: 'Mar', pending: 48, inProgress: 42, completed: 92 },
        { month: 'Apr', pending: 55, inProgress: 45, completed: 88 },
        { month: 'May', pending: 60, inProgress: 50, completed: 95 },
        { month: 'Jun', pending: 58, inProgress: 48, completed: 102 },
        { month: 'Jul', pending: 62, inProgress: 52, completed: 98 },
        { month: 'Aug', pending: 65, inProgress: 55, completed: 105 },
        { month: 'Sep', pending: 70, inProgress: 58, completed: 110 },
        { month: 'Oct', pending: 68, inProgress: 60, completed: 115 },
        { month: 'Nov', pending: 72, inProgress: 62, completed: 120 },
        { month: 'Dec', pending: 75, inProgress: 65, completed: 125 },
    ];

    // User registration by role
    const usersByRoleData = [
        { role: 'Customer', count: 850 },
        { role: 'Technician', count: 45 },
        { role: 'Supervisor', count: 12 },
        { role: 'Admin', count: 8 },
    ];

    // Recent service requests
    const recentRequests = [
        { id: 'SRV-1234', customer: 'John Doe', type: 'New Connection', status: 'Pending', date: '2026-05-01' },
        { id: 'SRV-1235', customer: 'Jane Smith', type: 'Repair', status: 'In Progress', date: '2026-05-01' },
        { id: 'SRV-1236', customer: 'Bob Johnson', type: 'Relocation', status: 'Completed', date: '2026-04-30' },
        { id: 'SRV-1237', customer: 'Alice Brown', type: 'Urgent Repair', status: 'In Progress', date: '2026-05-02' },
        { id: 'SRV-1238', customer: 'Charlie Wilson', type: 'New Connection', status: 'Pending', date: '2026-05-02' },
    ];

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-1">DASHBOARD</h1>
                    <p className={`text-sm ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>Welcome to your dashboard</p>
                </div>
                <button className={`flex items-center gap-2 ${darkMode ? 'bg-gradient-to-r from-purple-600 to-cyan-600' : 'bg-gradient-to-r from-blue-600 to-blue-500'} px-6 py-3 rounded-lg hover:opacity-90 transition shadow-lg text-white`}>
                    <Download size={18} />
                    DOWNLOAD REPORTS
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200 shadow-md'} rounded-lg p-6 border`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={darkMode ? 'text-cyan-400' : 'text-blue-600'}>
                                {stat.icon}
                            </div>
                            <div className="relative w-16 h-16">
                                <svg className="w-16 h-16 transform -rotate-90">
                                    <circle cx="32" cy="32" r="28" stroke={darkMode ? "#2d3748" : "#e5e7eb"} strokeWidth="4" fill="none" />
                                    <circle 
                                        cx="32" 
                                        cy="32" 
                                        r="28" 
                                        stroke={darkMode ? "#06b6d4" : "#3b82f6"} 
                                        strokeWidth="4" 
                                        fill="none"
                                        strokeDasharray={`${stat.percentage * 1.76} 176`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className={`absolute inset-0 flex items-center justify-center text-xs ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {stat.change}
                                </div>
                            </div>
                        </div>
                        <div className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Revenue Chart */}
                <div className={`lg:col-span-2 ${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200 shadow-md'} rounded-lg p-6 border`}>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Service Requests Overview</h2>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>342 Total Requests</div>
                        </div>
                        <button className={`${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'}`}>
                            <Download size={20} />
                        </button>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={serviceRequestsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#2d3748" : "#e5e7eb"} />
                            <XAxis dataKey="month" stroke={darkMode ? "#64748b" : "#9ca3af"} tick={{ fontSize: 12 }} />
                            <YAxis stroke={darkMode ? "#64748b" : "#9ca3af"} />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: darkMode ? '#1f2a40' : '#ffffff', 
                                    border: 'none', 
                                    borderRadius: '8px',
                                    color: darkMode ? '#ffffff' : '#000000'
                                }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="inProgress" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Transactions */}
                <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200 shadow-md'} rounded-lg p-6 border`}>
                    <h2 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Service Requests</h2>
                    <div className="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar">
                        {recentRequests.map((request, idx) => (
                            <div key={idx} className={`flex justify-between items-center ${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'} pb-3`}>
                                <div>
                                    <div className={`font-medium text-sm ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>{request.id}</div>
                                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{request.customer}</div>
                                    <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{request.type}</div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{request.date}</div>
                                    <div className={`text-xs px-2 py-1 rounded mt-1 ${
                                        request.status === 'Completed' ? 'bg-green-500 text-white' :
                                        request.status === 'In Progress' ? 'bg-blue-500 text-white' :
                                        'bg-yellow-500 text-white'
                                    }`}>
                                        {request.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Campaign */}
                <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200 shadow-md'} rounded-lg p-6 border`}>
                    <h2 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>System Performance</h2>
                    <div className="flex justify-center mb-6">
                        <div className="relative w-40 h-40">
                            <svg className="w-40 h-40 transform -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke={darkMode ? "#2d3748" : "#e5e7eb"} strokeWidth="12" fill="none" />
                                <circle 
                                    cx="80" 
                                    cy="80" 
                                    r="70" 
                                    stroke="url(#gradient)" 
                                    strokeWidth="12" 
                                    fill="none"
                                    strokeDasharray="440 440"
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor={darkMode ? "#06b6d4" : "#3b82f6"} />
                                        <stop offset="100%" stopColor={darkMode ? "#8b5cf6" : "#6366f1"} />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className={`text-3xl font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>99.8%</div>
                                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Uptime</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className={`font-bold text-lg ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>Excellent System Health</div>
                        <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>All services running smoothly</div>
                    </div>
                </div>

                {/* Sales Quantity */}
                <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200 shadow-md'} rounded-lg p-6 border`}>
                    <h2 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Users by Role</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <RechartsBarChart data={usersByRoleData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#2d3748" : "#e5e7eb"} />
                            <XAxis dataKey="role" stroke={darkMode ? "#64748b" : "#9ca3af"} tick={{ fontSize: 10 }} />
                            <YAxis stroke={darkMode ? "#64748b" : "#9ca3af"} />
                            <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2a40' : '#ffffff', border: 'none', color: darkMode ? '#ffffff' : '#000000' }} />
                            <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={darkMode ? "#06b6d4" : "#3b82f6"} />
                                    <stop offset="100%" stopColor={darkMode ? "#8b5cf6" : "#6366f1"} />
                                </linearGradient>
                            </defs>
                        </RechartsBarChart>
                    </ResponsiveContainer>
                </div>

                {/* Geography Traffic */}
                <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200 shadow-md'} rounded-lg p-6 border`}>
                    <h2 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Active Outages</h2>
                    <div className="space-y-3">
                        <div className={`flex justify-between items-center p-3 ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'} rounded`}>
                            <div>
                                <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Zone A - Downtown</div>
                                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Reported 2 hours ago</div>
                            </div>
                            <div className="text-red-500 text-xs font-bold">CRITICAL</div>
                        </div>
                        <div className={`flex justify-between items-center p-3 ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'} rounded`}>
                            <div>
                                <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Zone B - Industrial</div>
                                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Reported 5 hours ago</div>
                            </div>
                            <div className="text-yellow-500 text-xs font-bold">MEDIUM</div>
                        </div>
                        <div className={`flex justify-between items-center p-3 ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'} rounded`}>
                            <div>
                                <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Zone C - Residential</div>
                                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Reported 1 hour ago</div>
                            </div>
                            <div className="text-orange-500 text-xs font-bold">HIGH</div>
                        </div>
                        <div className={`flex justify-between items-center p-3 ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'} rounded`}>
                            <div>
                                <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Zone D - Suburbs</div>
                                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Reported 30 min ago</div>
                            </div>
                            <div className="text-green-500 text-xs font-bold">LOW</div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: ${darkMode ? '#1f2a40' : '#f3f4f6'};
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${darkMode ? 'linear-gradient(to bottom, #06b6d4, #8b5cf6)' : 'linear-gradient(to bottom, #3b82f6, #6366f1)'};
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;