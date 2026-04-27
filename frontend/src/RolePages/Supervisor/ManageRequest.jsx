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

const ManageRequest = () => {
    const navigate = useNavigate();
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [assignedTechId, setAssignedTechId] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [requests, setRequests] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [techLoading, setTechLoading] = useState(false);
    const [filterServiceType, setFilterServiceType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch service requests and technicians from backend
    useEffect(() => {
        fetchRequests();
        fetchTechnicians();
        // Refresh every 60 seconds
        const interval = setInterval(fetchRequests, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(API_ENDPOINTS.serviceRequests.base, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                // Format requests for display
                const formattedRequests = response.data.requests.map(request => ({
                    id: request.ticket_id,
                    dbId: request.id,
                    type: formatServiceType(request.service_type),
                    location: request.full_address,
                    customer: request.full_name,
                    phone: request.phone,
                    priority: capitalizeFirst(request.priority || 'medium'),
                    status: request.status,
                    submitted: calculateTimeAgo(request.created_at),
                    details: `${formatServiceType(request.service_type)} request from ${request.full_name}`,
                    serviceType: request.service_type,
                    city: request.city,
                    woreda: request.woreda,
                    kebele: request.kebele,
                    documents: request.documents,
                    supervisorNotes: request.supervisor_notes,
                    assignedTo: request.assigned_to_name || 'Not assigned',
                    assignedToId: request.assigned_to,
                    createdAt: request.created_at
                }));
                setRequests(formattedRequests);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
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

    // Filter requests based on search and service type
    const filteredRequests = requests.filter(request => {
        const matchesSearch = searchTerm === '' ||
            request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.type.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterServiceType === 'all' || request.serviceType === filterServiceType;

        return matchesSearch && matchesType;
    });

    const handleAssign = async (request) => {
        if (!assignedTechId || !scheduledTime) {
            alert('Please select both a technician and a scheduled time');
            return;
        }

        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            
            // Call the approval/assignment endpoint
            const response = await axios.post(API_ENDPOINTS.serviceRequests.approve(request.dbId), {
                assigned_to: parseInt(assignedTechId),
                supervisor_notes: `Scheduled for ${scheduledTime}`,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                alert(`Task ${request.id} successfully assigned!`);
                fetchRequests(); // Refresh list
                setSelectedRequest(null);
                setAssignedTechId('');
                setScheduledTime('');
            }
        } catch (error) {
            console.error('Error assigning task:', error);
            alert('Failed to assign task. ' + (error.response?.data?.error || ''));
        } finally {
            setActionLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
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
            case 'completed': return 'text-blue-600 font-bold';
            case 'rejected': return 'text-red-600';
            default: return 'text-yellow-600';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                        <Eye className="mr-3" /> Manage Service Requests
                    </h1>
                    <p className="text-gray-600">Review and assign incoming requests to technicians</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left: Requests List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow p-4 mb-6">
                            <div className="flex justify-between items-center mb-4 gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by ID or Customer..."
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                    value={filterServiceType}
                                    onChange={(e) => setFilterServiceType(e.target.value)}
                                >
                                    <option value="all">All Service Types</option>
                                    <option value="new-service">New Service</option>
                                    <option value="relocation">Service Relocation</option>
                                    <option value="name-change">Name Change</option>
                                    <option value="tariff-change">Tariff Change</option>
                                    <option value="meter-separation">Meter Separation</option>
                                </select>
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center py-12">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                                    <p className="text-gray-500">Loading requests...</p>
                                </div>
                            ) : filteredRequests.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                                    <p className="text-gray-500">No requests match your criteria</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {filteredRequests.map(request => (
                                        <div key={request.dbId}
                                            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${selectedRequest?.dbId === request.dbId ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200'}`}
                                            onClick={() => {
                                                setSelectedRequest(request);
                                                setAssignedTechId(request.assignedToId || '');
                                            }}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="font-bold text-gray-800 text-sm">{request.id}</div>
                                                    <h3 className="font-bold text-gray-900">{request.type}</h3>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(request.priority)}`}>
                                                        {request.priority}
                                                    </span>
                                                    <span className={`text-xs flex items-center gap-1 ${getStatusColor(request.status)}`}>
                                                        {request.status === 'assigned' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                                        {request.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-3">
                                                <div className="flex items-center"><MapPin size={14} className="mr-1 text-blue-500" /> {request.location.substring(0, 30)}...</div>
                                                <div className="flex items-center"><User size={14} className="mr-1 text-blue-500" /> {request.customer}</div>
                                            </div>
                                            
                                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                                                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Submitted {request.submitted}</span>
                                                <div className="flex items-center text-blue-600 text-xs font-bold">
                                                    MANAGE <ChevronRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Stats Summary */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="text-3xl font-extrabold text-blue-600">{requests.length}</div>
                                <div className="text-sm font-semibold text-gray-500 uppercase">Total Volume</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="text-3xl font-extrabold text-amber-500">
                                    {requests.filter(r => r.status === 'pending' || r.status === 'under_review').length}
                                </div>
                                <div className="text-sm font-semibold text-gray-500 uppercase">Pending Review</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="text-3xl font-extrabold text-emerald-500">
                                    {requests.filter(r => r.status === 'assigned' || r.status === 'in_progress').length}
                                </div>
                                <div className="text-sm font-semibold text-gray-500 uppercase">Field Operations</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Assignment Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6 border border-gray-100 overflow-hidden">
                            {selectedRequest ? (
                                <>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-gray-900">Task Assignment</h2>
                                        <div className={`px-2 py-1 rounded text-[10px] font-bold ${getPriorityColor(selectedRequest.priority)}`}>
                                            {selectedRequest.priority}
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-200">
                                        <h3 className="font-bold text-slate-800 mb-3 flex items-center text-sm">
                                            <Info size={16} className="mr-2 text-blue-600" /> CUSTOMER INFO
                                        </h3>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">Full Name</span>
                                                <span className="font-bold text-slate-900">{selectedRequest.customer}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">Phone</span>
                                                <span className="font-bold text-slate-900">{selectedRequest.phone}</span>
                                            </div>
                                            <div className="pt-2">
                                                <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Service Address</span>
                                                <p className="text-slate-700 text-xs leading-relaxed bg-white p-2 rounded border border-slate-100">
                                                    {selectedRequest.city}, {selectedRequest.woreda}, {selectedRequest.kebele}<br/>
                                                    <span className="text-[10px]">{selectedRequest.location}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate('/supervisor/validate', { state: { requestId: selectedRequest.dbId } })}
                                            className="w-full mt-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold flex items-center justify-center text-sm shadow-md shadow-blue-100"
                                        >
                                            <FileText size={16} className="mr-2" /> VALIDATE DOCUMENTS
                                        </button>
                                    </div>

                                    {/* Technician Selection */}
                                    <div className="mb-6">
                                        <label className="block mb-2 font-bold text-gray-700 text-sm uppercase tracking-wider">Select Field Technician</label>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            {techLoading ? (
                                                <div className="text-center py-4 text-xs text-gray-400">Loading staff list...</div>
                                            ) : technicians.length === 0 ? (
                                                <div className="text-center py-4 text-xs text-red-400">No active technicians found</div>
                                            ) : (
                                                technicians.map(tech => (
                                                    <button
                                                        key={tech.id}
                                                        onClick={() => setAssignedTechId(tech.id)}
                                                        className={`w-full text-left p-3 border rounded-xl transition-all flex items-center justify-between ${assignedTechId === tech.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-200'}`}
                                                    >
                                                        <div>
                                                            <div className="font-bold text-gray-900 text-sm">{tech.first_name} {tech.last_name}</div>
                                                            <div className="text-[10px] text-gray-500 font-medium uppercase">{tech.phone || 'No phone'}</div>
                                                        </div>
                                                        {assignedTechId === tech.id && <Check size={16} className="text-blue-600" />}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Scheduled Time */}
                                    <div className="mb-6">
                                        <label className="block mb-2 font-bold text-gray-700 text-sm uppercase tracking-wider">Scheduled Window</label>
                                        <select 
                                            className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                                            value={scheduledTime}
                                            onChange={(e) => setScheduledTime(e.target.value)}
                                        >
                                            <option value="">Select Time Slot</option>
                                            <option value="Morning (08:00 - 12:00)">Morning (08:00 - 12:00)</option>
                                            <option value="Afternoon (13:00 - 17:00)">Afternoon (13:00 - 17:00)</option>
                                            <option value="Emergency Response (ASAP)">Emergency Response (ASAP)</option>
                                            <option value="Tomorrow Morning">Tomorrow Morning</option>
                                        </select>
                                    </div>

                                    {/* Assign Button */}
                                    <button
                                        onClick={() => handleAssign(selectedRequest)}
                                        disabled={actionLoading || !assignedTechId || !scheduledTime}
                                        className={`w-full py-4 rounded-xl font-black text-white uppercase tracking-widest flex items-center justify-center transition-all ${actionLoading || !assignedTechId || !scheduledTime ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg active:scale-95'}`}
                                    >
                                        {actionLoading ? 'ASSIGNING...' : <><UserCheck className="mr-2" /> DISPATCH TECHNICIAN</>}
                                    </button>
                                </>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Eye className="text-slate-300" size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Queue Management</h3>
                                    <p className="text-gray-500 text-sm px-4">Select a request from the active queue to start the validation and dispatching workflow.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageRequest;
