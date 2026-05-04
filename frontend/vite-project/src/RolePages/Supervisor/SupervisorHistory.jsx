import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Calendar, MapPin, User, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const SupervisorHistory = () => {
    const { darkMode } = useOutletContext() || { darkMode: true };
    const [historyItems] = useState([
        {
            id: 1,
            type: 'task_completed',
            title: 'Task Completed: Inspect Transformer',
            technician: 'John Smith',
            location: 'Main Street, Sector 1',
            date: '2024-05-05',
            time: '14:30',
            status: 'completed',
            description: 'Transformer inspection completed successfully. No issues found.'
        },
        {
            id: 2,
            type: 'task_assigned',
            title: 'Task Assigned: Power Line Repair',
            technician: 'Mike Johnson',
            location: 'Sector 5, Downtown',
            date: '2024-05-04',
            time: '10:15',
            status: 'in-progress',
            description: 'Assigned urgent power line repair task due to storm damage.'
        },
        {
            id: 3,
            type: 'document_validated',
            title: 'Document Validated',
            technician: 'Sarah Williams',
            location: 'Residential Area',
            date: '2024-05-03',
            time: '09:45',
            status: 'completed',
            description: 'Installation documents for new meter validated and approved.'
        },
        {
            id: 4,
            type: 'task_completed',
            title: 'Task Completed: Cable Installation',
            technician: 'Tom Brown',
            location: 'Industrial Zone',
            date: '2024-05-02',
            time: '16:20',
            status: 'completed',
            description: 'Underground cable installation completed on schedule.'
        },
        {
            id: 5,
            type: 'task_assigned',
            title: 'Task Assigned: Meter Replacement',
            technician: 'Lisa Davis',
            location: 'Commercial District',
            date: '2024-05-01',
            time: '11:00',
            status: 'pending',
            description: 'Assigned smart meter replacement for commercial customer.'
        },
        {
            id: 6,
            type: 'report_generated',
            title: 'Weekly Report Generated',
            technician: 'System',
            location: 'All Sectors',
            date: '2024-04-29',
            time: '08:00',
            status: 'completed',
            description: 'Weekly performance report generated with all task statistics.'
        }
    ]);

    const getTypeIcon = (type) => {
        switch (type) {
            case 'task_completed':
                return <CheckCircle size={20} />;
            case 'task_assigned':
                return <Clock size={20} />;
            case 'document_validated':
                return <CheckCircle size={20} />;
            case 'report_generated':
                return <AlertCircle size={20} />;
            default:
                return <Calendar size={20} />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'task_completed':
                return darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700';
            case 'task_assigned':
                return darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700';
            case 'document_validated':
                return darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700';
            case 'report_generated':
                return darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700';
            default:
                return darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700';
            case 'in-progress':
                return darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700';
            case 'pending':
                return darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700';
            default:
                return darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    History
                </h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    View all activities and completed tasks
                </p>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
                {historyItems.map((item, index) => (
                    <div key={item.id} className="flex gap-6">
                        {/* Timeline Line */}
                        <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(item.type)}`}>
                                {getTypeIcon(item.type)}
                            </div>
                            {index !== historyItems.length - 1 && (
                                <div className={`w-1 h-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} mt-2`}></div>
                            )}
                        </div>

                        {/* Content */}
                        <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border flex-1 mt-2`}>
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {item.title}
                                    </h3>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {new Date(item.date).toLocaleDateString()} at {item.time}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                                    {item.status.replace('-', ' ').toUpperCase()}
                                </span>
                            </div>

                            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {item.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <User size={16} className={darkMode ? 'text-cyan-400' : 'text-blue-600'} />
                                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {item.technician}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className={darkMode ? 'text-cyan-400' : 'text-blue-600'} />
                                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {item.location}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SupervisorHistory;
