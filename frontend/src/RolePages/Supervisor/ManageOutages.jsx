import React, { useState, useEffect } from 'react';
import {
    Eye,
    Wrench,
    Calendar,
    CheckCircle,
    Clock,
    AlertTriangle,
    Search,
    Filter,
    UserCheck,
    MapPin,
    ChevronRight,
    FileText,
    Phone,
    User,
    Info,
    Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';
import axios from 'axios';

const ManageOutages = () => {
    const navigate = useNavigate();
    const [selectedOutage, setSelectedOutage] = useState(null);
    const [assignedTechId, setAssignedTechId] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [outages, setOutages] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [techLoading, setTechLoading] = useState(false);
    const [filterUrgency, setFilterUrgency] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch outages and technicians from backend
    useEffect(() => {
        fetchOutages();
        fetchTechnicians();
        // Refresh every 60 seconds
        const interval = setInterval(fetchOutages, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchOutages = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(API_ENDPOINTS.outages.manage, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                // Format outages for display
                const formattedOutages = response.data.outages.map(outage => ({
                    id: outage.id,
                    dbId: outage.id,
                    type: formatOutageType(outage.outage_type),
                    location: outage.address,
                    customer: outage.reported_by_name || 'Anonymous',
                    urgency: capitalizeFirst(outage.urgency || 'medium'),
                    status: outage.status,
                    submitted: calculateTimeAgo(outage.created_at),
                    details: `${formatOutageType(outage.outage_type)} at ${outage.address}`,
                    outageType: outage.outage_type,
                    description: outage.description,
                    assignedTo: outage.assigned_to_name || 'Not assigned',
                    assignedToId: outage.assigned_to,
                    createdAt: outage.created_at,
                    estimatedAffected: outage.estimated_affected
                }));
                setOutages(formattedOutages);
            }
        } catch (error) {
            console.error('Error fetching outages:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTechnicians = async () => {
        try {
            setTechLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(API_ENDPOINTS.admin.technicians, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setTechnicians(response.data.technicians);
            }
        } catch (error) {
            console.error('Error fetching technicians:', error);
        } finally {
            setTechLoading(false);
        }
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

    const capitalizeFirst = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const calculateTimeAgo = (createdAt) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffMs = now - created;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else if (diffHours > 0) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        }
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    };

    // Filter outages based on search and urgency
    const filteredOutages = outages.filter(outage => {
        const matchesSearch = searchTerm === '' ||
            outage.id.toString().includes(searchTerm.toLowerCase()) ||
            outage.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            outage.type.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesUrgency = filterUrgency === 'all' || outage.urgency.toLowerCase() === filterUrgency;

        return matchesSearch && matchesUrgency;
    });

    const handleAssign = async (outage) => {
        if (!assignedTechId) {
            alert('Please select a technician');
            return;
        }

        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');

            // Call the assignment endpoint
            const response = await axios.patch(API_ENDPOINTS.outages.assign(outage.dbId), {
                assigned_to: parseInt(assignedTechId),
                scheduled_date: scheduledTime || null,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log(`Assigning outage ${outage.dbId} to technician ${assignedTechId}`);

            if (response.data.success) {
                alert(`Outage OUT-${outage.id} successfully assigned!`);
                fetchOutages(); // Refresh list
                setSelectedOutage(null);
                setAssignedTechId('');
                setScheduledTime('');
            }
        } catch (error) {
            console.error('Error assigning outage:', error);
            alert('Failed to assign outage. ' + (error.response?.data?.error || ''));
        } finally {
            setActionLoading(false);
        }
    };

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'High': return 'bg-red-100 text-red-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'assigned':
            case 'in_progress': return 'text-green-600 font-semibold';
            case 'resolved': return 'text-blue-600 font-bold';
            case 'pending': return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Outage Management</h1>
                    <p className="text-gray-500 font-medium">Assign technicians to reported outages and monitor resolution progress.</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search outages..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="md:w-48">
                            <select
                                value={filterUrgency}
                                onChange={(e) => setFilterUrgency(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Urgencies</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Outage List */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center justify-between px-2 mb-4">
                                <span className="text-sm font-black text-gray-500 uppercase tracking-widest">
                                    Active Outages ({filteredOutages.length})
                                </span>
                            </div>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto">
                                {filteredOutages.map((outage) => (
                                    <div
                                        key={outage.id}
                                        onClick={() => setSelectedOutage(outage)}
                                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                                            selectedOutage?.id === outage.id
                                                ? 'border-orange-500 bg-white shadow-xl ring-4 ring-orange-50'
                                                : 'border-transparent bg-white shadow-sm hover:border-gray-200'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="text-sm font-black text-gray-400 uppercase tracking-tighter">
                                                OUT-{outage.id}
                                            </div>
                                            <div className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${getUrgencyColor(outage.urgency)}`}>
                                                {outage.urgency}
                                            </div>
                                        </div>
                                        <h3 className="font-black text-gray-900 mb-2">{outage.type}</h3>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{outage.description}</p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <MapPin size={12} /> {outage.location}
                                            </span>
                                            <span className={`font-bold ${getStatusColor(outage.status)}`}>
                                                {outage.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                                            <span className="text-xs text-gray-500">{outage.submitted}</span>
                                            <span className="text-xs text-gray-500">{outage.assignedTo}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Assignment Panel */}
                        <div className="space-y-6">
                            {selectedOutage ? (
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                                        <UserCheck className="text-orange-600" />
                                        Assign Technician
                                    </h3>

                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Select Technician</label>
                                            <select
                                                value={assignedTechId}
                                                onChange={(e) => setAssignedTechId(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            >
                                                <option value="">Choose technician...</option>
                                                {technicians.map(tech => (
                                                    <option key={tech.id} value={tech.id}>
                                                        {tech.first_name} {tech.last_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Scheduled Time (Optional)</label>
                                            <input
                                                type="datetime-local"
                                                value={scheduledTime}
                                                onChange={(e) => setScheduledTime(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleAssign(selectedOutage)}
                                        disabled={actionLoading || !assignedTechId}
                                        className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {actionLoading ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            <>
                                                <UserCheck size={18} />
                                                Assign Technician
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-3xl p-8 text-center border-2 border-dashed border-gray-200">
                                    <UserCheck className="mx-auto text-gray-300 mb-4" size={48} />
                                    <h3 className="font-black text-gray-800 mb-2">Assignment Panel</h3>
                                    <p className="text-gray-500 text-sm">Select an outage to assign a technician</p>
                                </div>
                            )}

                            {/* Outage Details */}
                            {selectedOutage && (
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                                        <Info className="text-blue-600" />
                                        Outage Details
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-xs font-bold text-gray-500 uppercase">Location</span>
                                            <p className="text-sm text-gray-900 mt-1">{selectedOutage.location}</p>
                                        </div>

                                        <div>
                                            <span className="text-xs font-bold text-gray-500 uppercase">Description</span>
                                            <p className="text-sm text-gray-900 mt-1">{selectedOutage.description}</p>
                                        </div>

                                        <div>
                                            <span className="text-xs font-bold text-gray-500 uppercase">Estimated Affected</span>
                                            <p className="text-sm text-gray-900 mt-1">{selectedOutage.estimatedAffected || 'Not specified'}</p>
                                        </div>

                                        <div>
                                            <span className="text-xs font-bold text-gray-500 uppercase">Reported By</span>
                                            <p className="text-sm text-gray-900 mt-1">{selectedOutage.customer}</p>
                                        </div>

                                        <div>
                                            <span className="text-xs font-bold text-gray-500 uppercase">Submitted</span>
                                            <p className="text-sm text-gray-900 mt-1">{new Date(selectedOutage.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageOutages;