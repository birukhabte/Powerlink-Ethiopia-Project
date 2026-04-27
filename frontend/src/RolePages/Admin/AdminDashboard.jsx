import React, { useState, useEffect } from 'react';
import {
    Users,
    ClipboardList,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    Clock,
    Activity,
    ShieldCheck,
    Loader2
} from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(API_ENDPOINTS.admin.stats, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching admin stats:', err);
                setError('Failed to load dashboard data. Please check your connection.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-10 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">Analyzing system data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center">
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl inline-block max-w-md border border-red-100 shadow-sm">
                    <AlertTriangle className="mx-auto mb-4" size={48} />
                    <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
                    <p className="text-sm opacity-90">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const { summary, userBreakdown, requestBreakdown, outageBreakdown, recentActivity } = stats;

    const cards = [
        { title: 'Total Users', value: summary.totalUsers, icon: <Users />, color: 'blue', trend: '+12%' },
        { title: 'Pending Requests', value: summary.pendingRequests, icon: <Clock />, color: 'amber', trend: 'Critical' },
        { title: 'Total Outages', value: summary.totalOutages, icon: <AlertTriangle />, color: 'red', trend: 'Active' },
        { title: 'Completed', value: summary.completedRequests, icon: <CheckCircle />, color: 'green', trend: '94% Success' },
    ];

    const pieData = Object.entries(userBreakdown).map(([name, value]) => ({ name, value }));
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Overview</h1>
                <p className="text-gray-500 font-medium">Real-time performance metrics and system health.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-${card.color}-50 text-${card.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                                {card.icon}
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-${card.color}-50 text-${card.color}-600`}>
                                {card.trend}
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">{card.title}</h3>
                        <div className="text-3xl font-black text-gray-900">{card.value}</div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Graph */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <TrendingUp className="text-blue-600" size={24} />
                                Request Activity
                            </h2>
                            <p className="text-sm text-gray-500 font-medium">Daily service requests volume</p>
                        </div>
                        <select className="bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-600 px-4 py-2 outline-none cursor-pointer">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={recentActivity}>
                                <defs>
                                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                                    dy={10}
                                    tickFormatter={(str) => new Date(str).toLocaleDateString([], {weekday: 'short'})}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                                <Tooltip 
                                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                    itemStyle={{fontWeight: 700, color: '#3b82f6'}}
                                />
                                <Area type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRequests)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* User Breakdown */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Activity className="text-purple-600" size={24} />
                        User Distribution
                    </h2>
                    <p className="text-sm text-gray-500 font-medium mb-6">By account type</p>
                    
                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={4} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Label */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <div className="text-2xl font-black text-gray-900">{summary.totalUsers}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</div>
                        </div>
                    </div>

                    <div className="space-y-3 mt-4">
                        {pieData.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                                    <span className="text-sm font-bold text-gray-600 capitalize">{entry.name}</span>
                                </div>
                                <span className="text-sm font-black text-gray-900">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* System Health */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-200 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <ShieldCheck size={160} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-2xl font-black mb-2 flex items-center gap-3">
                            <Activity className="animate-pulse" />
                            System Health: Optimized
                        </h2>
                        <p className="text-blue-100 font-medium">
                            The PowerLink system is currently processing requests at peak efficiency. 
                            Active technicians are responding within the target SLA window.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-1">Active Techs</div>
                            <div className="text-2xl font-black">{summary.activeTechnicians}</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-1">Load Status</div>
                            <div className="text-2xl font-black">Low</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;