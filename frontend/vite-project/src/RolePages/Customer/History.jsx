import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, MapPin, User, Calendar } from 'lucide-react';

const History = () => {
    const { darkMode } = useOutletContext() || { darkMode: true };
    const [historyData] = useState([
        {
            id: 1,
            type: 'service_request',
            title: 'Service Request Completed',
            description: 'Meter installation at residential area',
            location: 'Bole, Addis Ababa',
            status: 'completed',
            date: '2024-01-15',
            time: '14:30',
            technician: 'Tech-023 (Michael T.)',
            ticketId: 'SR-2024-001'
        },
        {
            id: 2,
            type: 'outage_report',
            title: 'Power Outage Reported',
            description: 'Complete power outage in the area',
            location: 'Megenagna, Addis Ababa',
            status: 'resolved',
            date: '2024-01-12',
            time: '10:15',
            technician: 'Tech-045 (David M.)',
            ticketId: 'OUT-2024-00123'
        },
        {
            id: 3,
            type: 'service_request',
            title: 'Transformer Repair',
            description: 'Transformer maintenance and repair',
            location: 'Kirkos, Addis Ababa',
            status: 'completed',
            date: '2024-01-08',
            time: '09:45',
            technician: 'Tech-023 (Michael T.)',
            ticketId: 'SR-2024-002'
        },
        {
            id: 4,
            type: 'outage_report',
            title: 'Partial Power Outage',
            description: 'Flickering lights reported',
            location: 'Gurd Shola, Addis Ababa',
            status: 'resolved',
            date: '2024-01-05',
            time: '16:20',
            technician: 'Tech-067 (John K.)',
            ticketId: 'OUT-2024-00122'
        },
        {
            id: 5,
            type: 'service_request',
            title: 'Line Maintenance',
            description: 'Power line inspection and maintenance',
            location: 'Addis Central, Addis Ababa',
            status: 'completed',
            date: '2024-01-01',
            time: '11:00',
            technician: 'Tech-089 (Sarah M.)',
            ticketId: 'SR-2024-003'
        },
    ]);

    const getStatusColor = (status) => {
        if (darkMode) {
            switch (status) {
                case 'completed':
                case 'resolved':
                    return 'bg-green-500/20 text-green-400 border-green-500/30';
                case 'pending':
                    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
                case 'in_progress':
                    return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
                default:
                    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
            }
        } else {
            switch (status) {
                case 'completed':
                case 'resolved':
                    return 'bg-green-100 text-green-800 border-green-300';
                case 'pending':
                    return 'bg-yellow-100 text-yellow-800 border-yellow-300';
                case 'in_progress':
                    return 'bg-blue-100 text-blue-800 border-blue-300';
                default:
                    return 'bg-gray-100 text-gray-800 border-gray-300';
            }
        }
    };

    const getTypeIcon = (type) => {
        if (type === 'service_request') {
            return <CheckCircle className={darkMode ? 'text-cyan-400' : 'text-blue-600'} size={20} />;
        } else {
            return <AlertCircle className={darkMode ? 'text-red-400' : 'text-red-600'} size={20} />;
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'} p-6`}>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Service History
                    </h1>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        View all your past service requests and outage reports
                    </p>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                    {historyData.map((item, index) => (
                        <div
                            key={item.id}
                            className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border transition-all hover:shadow-lg`}
                        >
                            <div className="flex gap-6">
                                {/* Timeline dot */}
                                <div className="flex flex-col items-center">
                                    <div className={`p-3 rounded-full ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-100'}`}>
                                        {getTypeIcon(item.type)}
                                    </div>
                                    {index < historyData.length - 1 && (
                                        <div className={`w-1 h-12 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} mt-2`}></div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {item.title}
                                            </h3>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {item.description}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}>
                                            {item.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            <Calendar size={16} className={darkMode ? 'text-cyan-400' : 'text-blue-600'} />
                                            <span>{item.date} {item.time}</span>
                                        </div>
                                        <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            <MapPin size={16} className={darkMode ? 'text-cyan-400' : 'text-blue-600'} />
                                            <span>{item.location}</span>
                                        </div>
                                        <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            <User size={16} className={darkMode ? 'text-cyan-400' : 'text-blue-600'} />
                                            <span>{item.technician}</span>
                                        </div>
                                        <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            <Clock size={16} className={darkMode ? 'text-cyan-400' : 'text-blue-600'} />
                                            <span className={`font-mono ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                                                {item.ticketId}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-xl text-center border`}>
                        <div className={`text-3xl font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                            {historyData.length}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Total Services
                        </div>
                    </div>
                    <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-xl text-center border`}>
                        <div className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                            {historyData.filter(h => h.status === 'completed' || h.status === 'resolved').length}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Completed
                        </div>
                    </div>
                    <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-xl text-center border`}>
                        <div className={`text-3xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                            {historyData.filter(h => h.type === 'outage_report').length}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Outage Reports
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;
