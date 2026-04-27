import React, { useState, useEffect } from 'react';
import {
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    ChevronRight,
    FileText,
    MapPin,
    User,
    Calendar,
    RefreshCw,
    Wrench,
    ArrowRight
} from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import axios from 'axios';

const Ticket = () => {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [outages, setOutages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('service'); // 'service' or 'outage'

    const stages = [
        { key: 'pending', label: 'Waiting', icon: Clock },
        { key: 'approved', label: 'Approved', icon: CheckCircle },
        { key: 'assigned', label: 'Assigned', icon: User },
        { key: 'in_progress', label: 'In Progress', icon: Wrench },
        { key: 'completed', label: 'Completed', icon: CheckCircle },
        { key: 'resolved', label: 'Resolved', icon: CheckCircle }
    ];

    useEffect(() => {
        fetchTickets();
        fetchOutages();
        const interval = setInterval(() => {
            fetchTickets();
            fetchOutages();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchTickets = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            const userId = user?.id;
            const token = localStorage.getItem('token');

            if (!userId) {
                setLoading(false);
                return;
            }

            const response = await axios.get(API_ENDPOINTS.serviceRequests.byUser(userId), {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setTickets(response.data.tickets);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOutages = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            const userId = user?.id;
            const token = localStorage.getItem('token');

            if (!userId) {
                return;
            }

            const response = await axios.get(API_ENDPOINTS.outages.byUser(userId), {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setOutages(response.data.outages);
            }
        } catch (error) {
            console.error('Error fetching outages:', error);
        }
    };

    const getStatusIndex = (status) => {
        const index = stages.findIndex(s => s.key === status);
        if (index === -1) {
            if (status === 'under_review') return 0;
            if (status === 'resolved') return 4;
            return 0;
        }
        return index;
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

    const formatOutageType = (outageType) => {
        const outageMap = {
            'power-outage': 'Power Outage',
            'transformer-failure': 'Transformer Failure',
            'line-damage': 'Line Damage',
            'maintenance': 'Maintenance',
            'other': 'Other'
        };
        return outageMap[outageType] || outageType;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
            case 'resolved': return 'bg-emerald-100 text-emerald-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'pending':
            case 'under_review': return 'bg-amber-100 text-amber-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const TicketList = ({ items, selectedItem, setSelectedItem, type, formatType, getStatusColor, refreshFunction }) => (
        <div className="grid lg:grid-cols-12 gap-8">
            {/* Ticket List */}
            <div className="lg:col-span-4 space-y-4">
                <div className="flex items-center justify-between px-2 mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active queue</span>
                    <button onClick={refreshFunction} className="text-blue-600 hover:rotate-180 transition-transform duration-500">
                        <RefreshCw size={14} />
                    </button>
                </div>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${selectedItem?.id === item.id ? 'border-blue-500 bg-white shadow-xl ring-4 ring-blue-50' : 'border-transparent bg-white shadow-sm hover:border-slate-200'}`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                    {type === 'service' ? item.ticket_id : `OUT-${item.id}`}
                                </div>
                                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(item.status)}`}>
                                    {item.status}
                                </div>
                            </div>
                            <h3 className="font-black text-slate-900 mb-4">
                                {type === 'service' ? formatType(item.service_type) : formatType(item.outage_type)}
                            </h3>
                            <div className="flex items-center text-xs text-slate-500 gap-4">
                                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(item.created_at).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1 text-blue-600 font-bold">TRACKING <ArrowRight size={12} /></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ticket Tracking View */}
            <div className="lg:col-span-8">
                {selectedItem ? (
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                        <div className="bg-slate-900 p-8 text-white">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(selectedItem.status)}`}>
                                            {selectedItem.status.replace('_', ' ')}
                                        </div>
                                        <span className="text-slate-400 font-bold text-sm">
                                            {type === 'service' ? selectedItem.ticket_id : `OUT-${selectedItem.id}`}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-black tracking-tight">
                                        {type === 'service' ? formatType(selectedItem.service_type) : formatType(selectedItem.outage_type)}
                                    </h2>
                                </div>
                                {type === 'service' && (
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Priority Level</div>
                                        <div className={`text-xl font-black ${selectedItem.priority === 'high' ? 'text-red-500' : 'text-amber-500'}`}>
                                            {selectedItem.priority?.toUpperCase()}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Visual Timeline */}
                            <div className="relative mt-12 mb-4">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 rounded-full"></div>
                                <div 
                                    className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 rounded-full transition-all duration-1000"
                                    style={{ width: `${(getStatusIndex(selectedItem.status) / (stages.length - 1)) * 100}%` }}
                                ></div>
                                
                                <div className="relative flex justify-between">
                                    {stages.map((stage, idx) => {
                                        const isActive = idx <= getStatusIndex(selectedItem.status);
                                        const isCurrent = idx === getStatusIndex(selectedItem.status);
                                        const Icon = stage.icon;
                                        
                                        return (
                                            <div key={stage.key} className="flex flex-col items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 z-10 ${isActive ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-900' : 'bg-slate-800 text-slate-500'}`}>
                                                    <Icon size={18} />
                                                </div>
                                                <span className={`mt-3 text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-blue-400' : 'text-slate-600'}`}>
                                                    {stage.label}
                                                </span>
                                                {isCurrent && (
                                                    <div className="mt-1 animate-bounce">
                                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                            {type === 'service' ? 'Service Location' : 'Outage Location'}
                                        </h4>
                                        <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl">
                                            <MapPin className="text-blue-600 mt-1" size={20} />
                                            <p className="text-slate-700 font-medium leading-relaxed">
                                                {type === 'service' ? selectedItem.full_address : selectedItem.address}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Submission Details</h4>
                                        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl text-sm">
                                            {type === 'service' ? (
                                                <>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500">Contact Person</span>
                                                        <span className="font-bold text-slate-900">{selectedItem.full_name}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500">Phone</span>
                                                        <span className="font-bold text-slate-900">{selectedItem.phone}</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500">Outage Type</span>
                                                        <span className="font-bold text-slate-900">{formatType(selectedItem.outage_type)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500">Urgency</span>
                                                        <span className="font-bold text-slate-900">{selectedItem.urgency}</span>
                                                    </div>
                                                </>
                                            )}
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Submitted On</span>
                                                <span className="font-bold text-slate-900">{new Date(selectedItem.created_at).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Field Progress</h4>
                                        <div className="bg-slate-900 rounded-2xl p-6 text-white">
                                            {selectedItem.status === 'in_progress' ? (
                                                <>
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="text-xs font-bold text-blue-400 uppercase">Estimated Time</span>
                                                        <span className="text-2xl font-black tracking-tighter">{selectedItem.estimated_time || '3 Hours'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                                                            <Wrench className="text-blue-500" size={20} />
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] font-bold text-slate-500 uppercase">Assigned Tech</div>
                                                            <div className="text-sm font-bold">{selectedItem.assigned_to_name || 'Dispatching...'}</div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : selectedItem.status === 'resolved' ? (
                                                <div className="text-center">
                                                    <CheckCircle className="text-emerald-500 mx-auto mb-2" size={40} />
                                                    <div className="text-lg font-black uppercase italic tracking-tighter">Issue Resolved</div>
                                                    <p className="text-slate-400 text-[10px] uppercase font-bold mt-1">Thank you for your patience</p>
                                                </div>
                                            ) : (
                                                <div className="py-4 text-center">
                                                    <Clock className="text-slate-700 mx-auto mb-2" size={40} />
                                                    <p className="text-slate-500 text-xs font-bold uppercase italic">
                                                        {type === 'service' ? 'Awaiting Supervisor Approval' : 'Awaiting Technician Assignment'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {selectedItem.technician_notes && (
                                        <div className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-4">
                                            <h4 className="text-[10px] font-black text-amber-600 uppercase mb-2">Technician Notes</h4>
                                            <p className="text-amber-900 text-sm italic font-medium">"{selectedItem.technician_notes}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
                                <button className="px-6 py-3 border-2 border-slate-200 text-slate-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                                    <AlertCircle size={16} /> REPORT ISSUE WITH TICKET
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-3xl p-20 text-center border-4 border-dashed border-slate-200 flex flex-col items-center justify-center h-full">
                        <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center shadow-xl mb-6 ring-8 ring-slate-100">
                            <RefreshCw className="text-slate-300" size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2 italic uppercase tracking-tighter">Tracking Console</h3>
                        <p className="text-slate-500 max-w-xs mx-auto font-medium">
                            Select a {type === 'service' ? 'service request' : 'outage report'} from your queue to view real-time field progress, technician assignments, and estimated restoration times.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

    if (loading && tickets.length === 0 && outages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="animate-spin text-blue-500 mb-4" size={48} />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing your requests...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <header className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">MY REQUESTS & REPORTS</h1>
                <p className="text-slate-500 font-medium">Track the real-time status of your power applications and outage reports</p>
            </header>

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-8 bg-slate-100 p-1 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('service')}
                    className={`px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
                        activeTab === 'service' 
                            ? 'bg-white text-slate-900 shadow-lg' 
                            : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Service Requests ({tickets.length})
                </button>
                <button
                    onClick={() => setActiveTab('outage')}
                    className={`px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
                        activeTab === 'outage' 
                            ? 'bg-white text-slate-900 shadow-lg' 
                            : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Outage Reports ({outages.length})
                </button>
            </div>

            {activeTab === 'service' && (
                <>
                    {tickets.length === 0 ? (
                        <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-100">
                            <FileText className="mx-auto text-slate-200 mb-6" size={80} />
                            <h2 className="text-2xl font-black text-slate-800 mb-2">No Active Service Requests</h2>
                            <p className="text-slate-500 mb-8">You haven't submitted any service requests yet.</p>
                            <button 
                                onClick={() => window.location.href = '/customer/request'}
                                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                            >
                                NEW APPLICATION
                            </button>
                        </div>
                    ) : (
                        <TicketList 
                            items={tickets} 
                            selectedItem={selectedTicket} 
                            setSelectedItem={setSelectedTicket}
                            type="service"
                            formatType={formatServiceType}
                            getStatusColor={getStatusColor}
                            refreshFunction={fetchTickets}
                        />
                    )}
                </>
            )}

            {activeTab === 'outage' && (
                <>
                    {outages.length === 0 ? (
                        <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-100">
                            <AlertCircle className="mx-auto text-slate-200 mb-6" size={80} />
                            <h2 className="text-2xl font-black text-slate-800 mb-2">No Outage Reports</h2>
                            <p className="text-slate-500 mb-8">You haven't reported any outages yet.</p>
                            <button 
                                onClick={() => window.location.href = '/customer/report-outage'}
                                className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
                            >
                                REPORT OUTAGE
                            </button>
                        </div>
                    ) : (
                        <TicketList 
                            items={outages} 
                            selectedItem={selectedTicket} 
                            setSelectedItem={setSelectedTicket}
                            type="outage"
                            formatType={formatOutageType}
                            getStatusColor={getStatusColor}
                            refreshFunction={fetchOutages}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Ticket;