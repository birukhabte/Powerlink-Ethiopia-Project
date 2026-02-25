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
    Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';

const ManageRequest = () => {
    const navigate = useNavigate();
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [assignedTech, setAssignedTech] = useState({});
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterServiceType, setFilterServiceType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch service requests from backend
    useEffect(() => {
        fetchRequests();
        // Refresh every 30 seconds
        const interval = setInterval(fetchRequests, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_ENDPOINTS.serviceRequests.base);
            const data = await response.json();

            if (data.success) {
                // Format requests for display
                const formattedRequests = data.requests.map(request => ({
                    id: request.ticket_id,
                    dbId: request.id,
                    type: formatServiceType(request.service_type),
                    location: request.full_address,
                    customer: request.full_name,
                    phone: request.phone,
                    priority: capitalizeFirst(request.priority),
                    status: request.status,
                    submitted: calculateTimeAgo(request.created_at),
                    details: `${formatServiceType(request.service_type)} request from ${request.full_name}`,
                    serviceType: request.service_type,
                    city: request.city,
                    woreda: request.woreda,
                    kebele: request.kebele,
                    documents: request.documents,
                    supervisorNotes: request.supervisor_notes,
                    assignedTo: request.assigned_to_username || 'Not assigned',
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

    // Available technicians
    const technicians = [
        { id: 'T-023', name: 'Michael T.', skills: ['Outage Repair', 'Line Work'], status: 'available', zone: 'Bole' },
        { id: 'T-045', name: 'Samuel K.', skills: ['Meter Installation'], status: 'available', zone: 'Megenagna' },
        { id: 'T-067', name: 'David M.', skills: ['Transformer Repair'], status: 'busy', zone: 'Kirkos' },
        { id: 'T-089', name: 'John A.', skills: ['Emergency Response'], status: 'available', zone: 'Addis Central' },
    ];

    const timeSlots = [
        '08:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00',
        '14:00 - 16:00', '16:00 - 18:00', 'Tomorrow Morning'
    ];

    const handleAssign = (requestId, techId, timeSlot) => {
        setAssignedTech({ ...assignedTech, [requestId]: { techId, timeSlot } });

        // Update request status
        setRequests(requests.map(req =>
            req.id === requestId ? { ...req, status: 'assigned' } : req
        ));

        // Update technician status
        console.log(`Assigned ${techId} to ${requestId} at ${timeSlot}`);
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
        return status === 'assigned' ? 'text-green-600' : 'text-yellow-600';
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
                            <div className="flex justify-between items-center mb-4">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search requests..."
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="border rounded-lg px-3 py-2"
                                    value={filterServiceType}
                                    onChange={(e) => setFilterServiceType(e.target.value)}
                                >
                                    <option value="all">All Service Types</option>
                                    <option value="new-service">New Service</option>
                                    <option value="relocation">Service Relocation</option>
                                    <option value="name-change">Name Change</option>
                                    <option value="tariff-change">Tariff Change</option>
                                    <option value="meter-separation">Meter Separation</option>
                                    <option value="outage">Reported Outage</option>
                                </select>
                            </div>

                            {loading ? (
                                <div className="text-center py-8 text-gray-500">Loading requests...</div>
                            ) : filteredRequests.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">No requests found</div>
                            ) : (
                                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {filteredRequests.map(request => (
                                        <div key={request.id}
                                            className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedRequest?.id === request.id ? 'border-blue-500 bg-blue-50' : ''}`}
                                            onClick={() => setSelectedRequest(request)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="font-bold text-gray-800">{request.id}</div>
                                                    <h3 className="font-semibold">{request.type}</h3>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(request.priority)}`}>
                                                        {request.priority}
                                                    </span>
                                                    <span className={`text-sm ${getStatusColor(request.status)}`}>
                                                        {request.status === 'assigned' ? <CheckCircle size={16} className="inline" /> : <Clock size={16} className="inline" />}
                                                        {request.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                                <MapPin size={14} className="mr-1" /> {request.location}
                                            </div>
                                            <div className="text-sm text-gray-600 mb-2">{request.customer}</div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">{request.submitted}</span>
                                                <ChevronRight size={16} className="text-blue-500" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow text-center">
                                <div className="text-2xl font-bold text-blue-600">{requests.length}</div>
                                <div className="text-gray-600">Total Requests</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow text-center">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {requests.filter(r => r.status === 'pending' || r.status === 'under_review').length}
                                </div>
                                <div className="text-gray-600">Pending</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {requests.filter(r => r.status === 'assigned' || r.status === 'in_progress').length}
                                </div>
                                <div className="text-gray-600">Assigned</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Assignment Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow p-6 sticky top-6">
                            {selectedRequest ? (
                                <>
                                    <h2 className="text-xl font-bold mb-4">Assign Technician</h2>
                                    <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                                        <h3 className="font-bold text-blue-800 mb-3 flex items-center">
                                            <Info size={18} className="mr-2" /> Customer Details
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-start">
                                                <User size={16} className="mr-2 text-blue-600 mt-0.5" />
                                                <div>
                                                    <span className="text-gray-500 block">Full Name</span>
                                                    <span className="font-medium text-gray-800">{selectedRequest.customer}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <Phone size={16} className="mr-2 text-blue-600 mt-0.5" />
                                                <div>
                                                    <span className="text-gray-500 block">Phone Number</span>
                                                    <span className="font-medium text-gray-800">{selectedRequest.phone}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <MapPin size={16} className="mr-2 text-blue-600 mt-0.5" />
                                                <div>
                                                    <span className="text-gray-500 block">Address Info</span>
                                                    <span className="font-medium text-gray-800">
                                                        {selectedRequest.city}, {selectedRequest.woreda}, {selectedRequest.kebele}
                                                    </span>
                                                    <span className="text-gray-600 block text-xs mt-1">
                                                        {selectedRequest.location}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate('/supervisor/validate', { state: { requestId: selectedRequest.dbId } })}
                                            className="w-full mt-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center justify-center text-sm shadow-sm"
                                        >
                                            <FileText size={16} className="mr-2" /> Check Document
                                        </button>
                                    </div>

                                    {/* Technician Selection */}
                                    <div className="mb-6">
                                        <label className="block mb-2 font-medium">Select Technician</label>
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                            {technicians.filter(t => t.status === 'available').map(tech => (
                                                <button
                                                    key={tech.id}
                                                    onClick={() => setAssignedTech({
                                                        ...assignedTech, [selectedRequest.id]: {
                                                            ...assignedTech[selectedRequest.id],
                                                            techId: tech.id
                                                        }
                                                    })}
                                                    className={`w-full text-left p-3 border rounded-lg ${assignedTech[selectedRequest.id]?.techId === tech.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                                >
                                                    <div className="font-medium">{tech.name} ({tech.id})</div>
                                                    <div className="text-sm text-gray-600">Skills: {tech.skills.join(', ')}</div>
                                                    <div className="text-sm text-gray-500">{tech.zone}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Time Slot Selection */}
                                    <div className="mb-6">
                                        <label className="block mb-2 font-medium">Select Time Slot</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {timeSlots.map(slot => (
                                                <button
                                                    key={slot}
                                                    onClick={() => setAssignedTech({
                                                        ...assignedTech, [selectedRequest.id]: {
                                                            ...assignedTech[selectedRequest.id],
                                                            timeSlot: slot
                                                        }
                                                    })}
                                                    className={`p-2 border rounded text-sm ${assignedTech[selectedRequest.id]?.timeSlot === slot ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Assign Button */}
                                    <button
                                        onClick={() => {
                                            if (assignedTech[selectedRequest.id]?.techId && assignedTech[selectedRequest.id]?.timeSlot) {
                                                handleAssign(selectedRequest.id, assignedTech[selectedRequest.id].techId, assignedTech[selectedRequest.id].timeSlot);
                                                alert(`Assigned ${assignedTech[selectedRequest.id].techId} to ${selectedRequest.id}`);
                                            } else {
                                                alert('Please select both technician and time slot');
                                            }
                                        }}
                                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold flex items-center justify-center"
                                    >
                                        <UserCheck className="mr-2" /> Assign Request
                                    </button>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <Eye className="mx-auto text-gray-300 mb-4" size={48} />
                                    <h3 className="text-xl font-bold text-gray-600 mb-2">Select a Request</h3>
                                    <p className="text-gray-500">Choose a request from the list to assign a technician</p>
                                </div>
                            )}
                        </div>

                        {/* Available Technicians */}
                        <div className="bg-white rounded-xl shadow p-6 mt-6">
                            <h3 className="font-bold mb-4 flex items-center">
                                <Wrench className="mr-2" /> Available Technicians
                            </h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {technicians.map(tech => (
                                    <div key={tech.id} className="flex justify-between items-center p-2">
                                        <div>
                                            <div className="font-medium">{tech.name}</div>
                                            <div className="text-sm text-gray-600">{tech.id}</div>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded ${tech.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {tech.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageRequest;
