import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    PieChart as PieIcon,
    LineChart as LineIcon,
    Download,
    Calendar,
    AlertTriangle,
    Users,
    Wrench,
    TrendingUp,
    TrendingDown,
    RefreshCw,
    ShieldCheck,
    Zap,
    Trophy
} from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const Report = () => {
    const [selectedReport, setSelectedReport] = useState('performance');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(API_ENDPOINTS.admin.stats, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <RefreshCw className="animate-spin text-blue-600 mb-4" size={48} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Generating Audit Reports...</p>
            </div>
        );
    }

    const { summary, userBreakdown, requestBreakdown, outageBreakdown } = stats;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">PERFORMANCE INTELLIGENCE</h1>
                        <p className="text-slate-500 font-medium italic">Aggregate system metrics and field operation efficiency</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={fetchReportData} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                            <RefreshCw size={20} className="text-slate-500" />
                        </button>
                        <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-black flex items-center shadow-lg transition-all active:scale-95">
                            <Download className="mr-2" /> EXPORT PDF
                        </button>
                    </div>
                </header>

                {/* Primary Stats Grid */}
                <div className="grid md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 text-blue-50 opacity-50 group-hover:scale-110 transition-transform">
                            <TrendingUp size={120} />
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Success Rate</div>
                        <div className="text-4xl font-black text-slate-900 mb-2">94.2%</div>
                        <div className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1">
                            <TrendingUp size={12} /> +2.4% THIS MONTH
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 text-amber-50 opacity-50 group-hover:scale-110 transition-transform">
                            <Wrench size={120} />
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Resolution</div>
                        <div className="text-4xl font-black text-slate-900 mb-2">3.8<span className="text-lg text-slate-400">hrs</span></div>
                        <div className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1">
                            <TrendingDown size={12} /> -15% LEAD TIME
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 text-red-50 opacity-50 group-hover:scale-110 transition-transform">
                            <AlertTriangle size={120} />
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grid Uptime</div>
                        <div className="text-4xl font-black text-slate-900 mb-2">99.1%</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">STABLE SECTOR 4</div>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 text-indigo-50 opacity-50 group-hover:scale-110 transition-transform">
                            <Users size={120} />
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">User Base</div>
                        <div className="text-4xl font-black text-slate-900 mb-2">{summary.totalUsers}</div>
                        <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">CROSS-PLATFORM REACH</div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    {/* Distribution Summary */}
                    <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <ShieldCheck size={200} />
                        </div>
                        <h2 className="text-xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-2">
                            <BarChart3 className="text-blue-400" /> System Composition
                        </h2>
                        
                        <div className="space-y-8 relative z-10">
                            {Object.entries(userBreakdown).map(([role, count]) => (
                                <div key={role}>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">{role}s</span>
                                        <span className="text-xl font-black">{count}</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${(count / summary.totalUsers) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <Trophy className="text-amber-400" size={24} />
                                <span className="text-xs font-black uppercase tracking-widest">Top Performer</span>
                            </div>
                            <div className="text-lg font-black italic">Technician Sector-09</div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">100% resolution rate (Last 48h)</p>
                        </div>
                    </div>

                    {/* Operational Backlog */}
                    <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                                <Wrench className="text-indigo-600" /> Operational Funnel
                            </h2>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live queue status</div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Service Delivery</h3>
                                {Object.entries(requestBreakdown).map(([status, count]) => (
                                    <div key={status} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="text-xs font-bold uppercase text-slate-600">{status.replace('_', ' ')}</span>
                                        <span className={`text-lg font-black ${status === 'pending' ? 'text-amber-500' : status === 'completed' ? 'text-emerald-500' : 'text-slate-900'}`}>{count}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Emergency Dispatch</h3>
                                {Object.entries(outageBreakdown).map(([status, count]) => (
                                    <div key={status} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="text-xs font-bold uppercase text-slate-600">{status}</span>
                                        <span className={`text-lg font-black ${status === 'pending' ? 'text-red-500' : 'text-slate-900'}`}>{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Recommendation */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-10 rounded-[2.5rem] text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 group">
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-black mb-3 flex items-center gap-3">
                            <Zap className="animate-pulse" /> AI STRATEGIC INSIGHT
                        </h2>
                        <p className="text-indigo-100 font-medium leading-relaxed">
                            System analysis indicates a bottleneck in <span className="text-white font-bold underline decoration-amber-400 decoration-2">Sector-04</span> validation phase. 
                            Increasing supervisor allocation to this region could reduce ticket lead time by <span className="text-white font-bold">22%</span>.
                        </p>
                    </div>
                    <button className="whitespace-nowrap px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl group-hover:scale-105">
                        OPTIMIZE WORKFLOW
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Report;