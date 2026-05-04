import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
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
    const { darkMode } = useOutletContext() || { darkMode: true };
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
        <div className={`min-h-screen ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'} p-6`}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2 flex items-center`}>
                        <Eye className="mr-3" /> Manage Service Requests
                    </h1>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Review and assign incoming requests to technicians</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left: Requests List */}
                    <div className="lg:col-span-2">
                        <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow p-4 mb-6 border`}>
                            <div className="flex justify-between items-center mb-4">
                                <div className="relative flex-1 max-w-md">
                                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                    <input
                                        type="text"
                                        placeholder="Search requests..."
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select
                                    className={`border rounded-lg px-3 py-2 ml-4 ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
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
                                <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading requests...</div>
                            ) : filteredRequests.length === 0 ? (
                                <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No requests found</div>
                            ) : (
                                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {filteredRequests.map(request => (
                                        <div key={request.id}
                                            className={`p-4 border rounded-lg cursor-pointer ${darkMode ? 'bg-[#141b2d] border-gray-700 hover:bg-[#0f1419]' : 'bg-white border-gray-200 hover:bg-gray-50'} ${selectedRequest?.id === request.id ? (darkMode ? 'border-cyan-400 bg-cyan-400/10' : 'border-blue-500 bg-blue-50') : ''}`}
                                            onClick={() => setSelectedRequest(request)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{request.id}</div>
                                                    <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{request.type}</h3>
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

                                            <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                                                <MapPin size={14} className="mr-1" /> {request.location}
                                            </div>
                                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{request.customer}</div>
                                            <div className="flex justify-between items-center">
                                                <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{request.submitted}</span>
                                                <ChevronRight size={16} className={darkMode ? 'text-cyan-400' : 'text-blue-500'} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-xl shadow text-center border`}>
                                <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>{requests.length}</div>
                                <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Total Requests</div>
                            </div>
                            <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-xl shadow text-center border`}>
                                <div className={`text-2xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                    {requests.filter(r => r.status === 'pending' || r.status === 'under_review').length}
                                </div>
                                <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Pending</div>
                            </div>
                            <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-xl shadow text-center border`}>
                                <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                    {requests.filter(r => r.status === 'assigned' || r.status === 'in_progress').length}
                                </div>
                                <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Assigned</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Assignment Panel */}
                    <div className="lg:col-span-1">
                        <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow p-6 sticky top-6 border`}>
                            {selectedRequest ? (
                                <>
                                    <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Assign Technician</h2>
                                    <div className={`${darkMode ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-blue-50 border-blue-100'} p-4 rounded-lg mb-6 border`}>
                                        <h3 className={`font-bold mb-3 flex items-center ${darkMode ? 'text-cyan-400' : 'text-blue-800'}`}>
                                            <Info size={18} className="mr-2" /> Customer Details
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-start">
                                                <User size={16} className={`mr-2 mt-0.5 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
                                                <div>
                                                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} block`}>Full Name</span>
                                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedRequest.customer}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <Phone size={16} className={`mr-2 mt-0.5 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
                                                <div>
                                                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} block`}>Phone Number</span>
                                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedRequest.phone}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <MapPin size={16} className={`mr-2 mt-0.5 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
                                                <div>
                                                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} block`}>Address Info</span>
                                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                                        {selectedRequest.city}, {selectedRequest.woreda}, {selectedRequest.kebele}
                                                    </span>
                                                    <span className={`${darkMode ? 'text-gray-500' : 'text-gray-600'} block text-xs mt-1`}>
                                                        {selectedRequest.location}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate('/supervisor/validate', { state: { requestId: selectedRequest.dbId } })}
                                            className={`w-full mt-4 py-2 ${darkMode ? 'bg-[#141b2d] border-cyan-400 text-cyan-400 hover:bg-[#0f1419]' : 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50'} border rounded-lg transition-colors font-semibold flex items-center justify-center text-sm shadow-sm`}
                                        >
                                            <FileText size={16} className="mr-2" /> Check Document
                                        </button>
                                    </div>

                                    {/* Technician Selection */}
                                    <div className="mb-6">
                                        <label className={`block mb-2 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Select Technician</label>
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
                                                    className={`w-full text-left p-3 border rounded-lg ${assignedTech[selectedRequest.id]?.techId === tech.id ? (darkMode ? 'border-cyan-400 bg-cyan-400/10' : 'border-blue-500 bg-blue-50') : (darkMode ? 'border-gray-700 bg-[#141b2d] hover:border-gray-600' : 'border-gray-200 hover:border-gray-300')}`}
                                                >
                                                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tech.name} ({tech.id})</div>
                                                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Skills: {tech.skills.join(', ')}</div>
                                                    <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{tech.zone}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Time Slot Selection */}
                                    <div className="mb-6">
                                        <label className={`block mb-2 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Select Time Slot</label>
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
                                                    className={`p-2 border rounded text-sm ${assignedTech[selectedRequest.id]?.timeSlot === slot ? (darkMode ? 'border-green-400 bg-green-400/10 text-green-400' : 'border-green-500 bg-green-50 text-green-700') : (darkMode ? 'border-gray-700 bg-[#141b2d] text-gray-400 hover:border-gray-600' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300')}`}
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
                                        className={`w-full py-3 ${darkMode ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:opacity-90' : 'bg-blue-600 text-white hover:bg-blue-700'} rounded-lg font-bold flex items-center justify-center`}
                                    >
                                        <UserCheck className="mr-2" /> Assign Request
                                    </button>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <Eye className={`mx-auto ${darkMode ? 'text-gray-600' : 'text-gray-300'} mb-4`} size={48} />
                                    <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Select a Request</h3>
                                    <p className={darkMode ? 'text-gray-500' : 'text-gray-500'}>Choose a request from the list to assign a technician</p>
                                </div>
                            )}
                        </div>

                        {/* Available Technicians */}
                        <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow p-6 mt-6 border`}>
                            <h3 className={`font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                <Wrench className="mr-2" /> Available Technicians
                            </h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {technicians.map(tech => (
                                    <div key={tech.id} className={`flex justify-between items-center p-2 ${darkMode ? 'bg-[#141b2d] rounded' : 'bg-gray-50 rounded'}`}>
                                        <div>
                                            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tech.name}</div>
                                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{tech.id}</div>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded ${tech.status === 'available' ? (darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-800') : (darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-800')}`}>
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
