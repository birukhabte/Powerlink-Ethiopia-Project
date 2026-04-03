import React, { useState } from 'react';
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
    RefreshCw
} from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';

const Ticket = () => {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [tickets, setTickets] = useState([]);

    // Sample default tickets
    const defaultTickets = [
        {
            id: 'OUT-2024-00123',
            title: 'Power Outage - Bole Area',
            status: 'in-progress',
            created: '2024-01-15 14:30',
            location: 'Bole, Addis Ababa',
            description: 'Complete power outage affecting entire street',
            technician: 'Tech #T-456',
            priority: 'High',
            updates: [
                { time: '14:30', message: 'Outage reported' },
                { time: '15:15', message: 'Technician assigned' },
                { time: '16:00', message: 'On-site investigation started' }
            ]
        },
        {
            id: 'SRV-2024-00089',
            title: 'New Connection Request',
            status: 'pending',
            created: '2024-01-14 10:15',
            location: 'Kirkos, Addis Ababa',
            description: 'Request for new electricity connection',
            technician: 'Not assigned',
            priority: 'Medium',
            updates: [
                { time: '10:15', message: 'Service requested' },
                { time: '11:00', message: 'Document validation in progress' }
            ]
        }
    ];

    React.useEffect(() => {
        fetchTickets();
        // Refresh every 30 seconds to get latest status updates
        const interval = setInterval(fetchTickets, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchTickets = async () => {
        try {
            // Get user from localStorage
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            const userId = user?.id;

            console.log('=== TICKET FETCH DEBUG ===');
            console.log('User from localStorage:', user);
            console.log('User ID:', userId);

            if (!userId) {
                console.log('No user ID found, showing default tickets');
                // If no user, just show default tickets
                setTickets(defaultTickets);
                return;
            }

            // Fetch user-specific service requests from backend
            const url = API_ENDPOINTS.serviceRequests.byUser(userId);
            console.log('Fetching from URL:', url);

            const response = await fetch(url);
            const data = await response.json();

            console.log('API Response:', data);
            console.log('Tickets count:', data.tickets?.length || 0);

            if (data.success && data.tickets && data.tickets.length > 0) {
                console.log('Processing tickets:', data.tickets);

                // Format the tickets for display
                const userTickets = data.tickets.map(ticket => ({
                    id: ticket.ticket_id,
                    title: formatServiceType(ticket.service_type) + ' Request',
                    status: ticket.status,
                    created: new Date(ticket.created_at).toLocaleString(),
                    location: ticket.full_address,
                    description: `Service request for ${formatServiceType(ticket.service_type)}`,
                    technician: ticket.assigned_to_username || 'Not assigned',
                    priority: capitalizeFirst(ticket.priority || 'medium'),
                    supervisorNotes: ticket.supervisor_notes,
                    documents: ticket.documents,
                    updates: generateUpdates(ticket)
                }));

                console.log('Formatted tickets:', userTickets);
                setTickets(userTickets);
            } else {
                console.log('No tickets found for this user');
                // No tickets found for this user
                setTickets([]);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
            // Show empty state on error
            setTickets([]);
        }
    };

    const generateUpdates = (ticket) => {
        const updates = [];

        // Initial creation
        updates.push({
            time: new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            message: 'Service request submitted'
        });

        // Status-based updates
        if (ticket.status === 'under_review') {
            updates.push({
                time: new Date(ticket.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                message: 'Request under review by supervisor'
            });
        }

        if (ticket.status === 'approved') {
            updates.push({
                time: new Date(ticket.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                message: 'Request approved by supervisor'
            });
        }

        if (ticket.status === 'rejected') {
            updates.push({
                time: new Date(ticket.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                message: `Request rejected${ticket.supervisor_notes ? ': ' + ticket.supervisor_notes : ''}`
            });
        }

        if (ticket.status === 'assigned' && ticket.assigned_to_username) {
            updates.push({
                time: new Date(ticket.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                message: `Assigned to technician: ${ticket.assigned_to_username}`
            });
        }

        if (ticket.status === 'in_progress') {
            updates.push({
                time: new Date(ticket.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                message: 'Work in progress'
            });
        }

        if (ticket.status === 'completed') {
            updates.push({
                time: new Date(ticket.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                message: 'Service request completed'
            });
        }

        return updates;
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
        if (!str) return 'Medium';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
            case 'resolved': return <CheckCircle className="text-green-500" />;
            case 'in_progress':
            case 'in-progress': return <RefreshCw className="text-blue-500" />;
            case 'rejected': return <XCircle className="text-red-500" />;
            case 'pending':
            case 'under_review': return <Clock className="text-yellow-500" />;
            default: return <AlertCircle className="text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'in_progress':
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'pending':
            case 'under_review': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleRefresh = () => {
        fetchTickets();
        console.log('Tickets refreshed from backend');
    };

    if (tickets.length === 0) {
        return (
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8 text-center">
                <FileText className="mx-auto text-gray-400 mb-4" size={64} />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Tickets Found</h2>
                <p className="text-gray-600 mb-6">You haven't created any service requests or outage reports yet.</p>
                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Report an Issue
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">My Tickets</h1>
                <p className="text-gray-600">Track your service requests and outage reports</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Ticket List - Left Column */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-xl shadow p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg">All Tickets ({tickets.length})</h2>
                            <button onClick={handleRefresh} className="text-blue-600 text-sm">
                                <RefreshCw size={16} className="inline mr-1" /> Refresh
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[500px] overflow-y-auto">
                            {tickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={`p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition ${selectedTicket?.id === ticket.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-gray-800">{ticket.id}</div>
                                        <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                                            {ticket.status.toUpperCase()}
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-gray-800 mb-1">{ticket.title}</h3>
                                    <div className="flex items-center text-sm text-gray-600 mb-2">
                                        <Calendar size={14} className="mr-1" />
                                        {ticket.created}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <MapPin size={14} className="mr-1" />
                                        {ticket.location}
                                    </div>
                                    <div className="flex items-center mt-3 text-blue-600 text-sm">
                                        View Details <ChevronRight size={16} className="ml-1" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Ticket Details - Right Column */}
                <div className="md:col-span-2">
                    {selectedTicket ? (
                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center mb-2">
                                        {getStatusIcon(selectedTicket.status)}
                                        <span className={`ml-2 px-3 py-1 rounded-full ${getStatusColor(selectedTicket.status)}`}>
                                            {selectedTicket.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedTicket.title}</h2>
                                    <p className="text-gray-600 mt-1">Ticket ID: {selectedTicket.id}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-500">Priority</div>
                                    <div className="text-lg font-bold text-red-600">{selectedTicket.priority}</div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center text-gray-700 mb-1">
                                            <MapPin size={16} className="mr-2" />
                                            <span className="font-medium">Location</span>
                                        </div>
                                        <p className="text-gray-900">{selectedTicket.location}</p>
                                    </div>

                                    <div>
                                        <div className="flex items-center text-gray-700 mb-1">
                                            <Calendar size={16} className="mr-2" />
                                            <span className="font-medium">Created</span>
                                        </div>
                                        <p className="text-gray-900">{selectedTicket.created}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center text-gray-700 mb-1">
                                            <User size={16} className="mr-2" />
                                            <span className="font-medium">Assigned Technician</span>
                                        </div>
                                        <p className="text-gray-900">{selectedTicket.technician}</p>
                                    </div>

                                    {selectedTicket.resolved && (
                                        <div>
                                            <div className="flex items-center text-gray-700 mb-1">
                                                <CheckCircle size={16} className="mr-2 text-green-500" />
                                                <span className="font-medium">Resolved</span>
                                            </div>
                                            <p className="text-gray-900">{selectedTicket.resolved}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-800 mb-2">Description</h3>
                                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedTicket.description}</p>
                            </div>

                            {/* Supervisor Notes */}
                            {selectedTicket.supervisorNotes && (
                                <div className="mb-6">
                                    <h3 className="font-bold text-gray-800 mb-2">Supervisor Notes</h3>
                                    <div className={`p-4 rounded-lg border ${selectedTicket.status === 'rejected'
                                        ? 'bg-red-50 border-red-200 text-red-800'
                                        : 'bg-blue-50 border-blue-200 text-blue-800'
                                        }`}>
                                        <p>{selectedTicket.supervisorNotes}</p>
                                    </div>
                                </div>
                            )}

                            {/* Updates Timeline */}
                            <div>
                                <h3 className="font-bold text-gray-800 mb-4">Status Updates</h3>
                                <div className="space-y-4">
                                    {selectedTicket.updates.map((update, idx) => (
                                        <div key={idx} className="flex">
                                            <div className="flex flex-col items-center mr-4">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                {idx < selectedTicket.updates.length - 1 && (
                                                    <div className="w-0.5 h-full bg-blue-200"></div>
                                                )}
                                            </div>
                                            <div className="pb-4">
                                                <div className="font-medium text-gray-800">{update.message}</div>
                                                <div className="text-sm text-gray-500 mt-1">{update.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow p-8 text-center h-full flex items-center justify-center">
                            <div>
                                <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                                <h3 className="text-xl font-bold text-gray-600 mb-2">Select a Ticket</h3>
                                <p className="text-gray-500">Choose a ticket from the list to view its details and status.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Ticket;