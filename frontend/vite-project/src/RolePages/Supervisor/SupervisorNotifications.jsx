import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bell, Trash2, CheckCircle, AlertCircle, Info } from 'lucide-react';

const SupervisorNotifications = () => {
    const { darkMode } = useOutletContext() || { darkMode: true };
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'alert',
            title: 'Task Overdue',
            message: 'Task "Repair Power Line - Sector 5" is overdue. Please follow up with the technician.',
            timestamp: '2 hours ago',
            read: false
        },
        {
            id: 2,
            type: 'success',
            title: 'Task Completed',
            message: 'John Smith completed "Inspect Transformer at Main Street" successfully.',
            timestamp: '4 hours ago',
            read: false
        },
        {
            id: 3,
            type: 'info',
            title: 'New Request Assigned',
            message: 'New service request assigned to your team: "Cable Replacement - Downtown"',
            timestamp: '1 day ago',
            read: true
        },
        {
            id: 4,
            type: 'alert',
            title: 'Document Validation Required',
            message: 'Document validation required for 3 pending requests.',
            timestamp: '2 days ago',
            read: true
        },
        {
            id: 5,
            type: 'success',
            title: 'Report Generated',
            message: 'Weekly performance report has been generated and is ready for review.',
            timestamp: '3 days ago',
            read: true
        }
    ]);

    const handleMarkAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const handleDelete = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'alert':
                return <AlertCircle size={20} />;
            case 'success':
                return <CheckCircle size={20} />;
            case 'info':
                return <Info size={20} />;
            default:
                return <Bell size={20} />;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'alert':
                return darkMode ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-red-100 border-red-300 text-red-700';
            case 'success':
                return darkMode ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-green-100 border-green-300 text-green-700';
            case 'info':
                return darkMode ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-blue-100 border-blue-300 text-blue-700';
            default:
                return darkMode ? 'bg-gray-500/20 border-gray-500/30 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-700';
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                            Notifications
                        </h1>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <div className={`px-4 py-2 rounded-full ${darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'}`}>
                            <span className="font-bold">{unreadCount}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-12 text-center border`}>
                        <Bell className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} size={48} />
                        <p className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            No notifications
                        </p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border transition ${!notification.read ? (darkMode ? 'border-cyan-500/50' : 'border-blue-500/50') : ''}`}
                        >
                            <div className="flex gap-4">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                                    {getNotificationIcon(notification.type)}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {notification.title}
                                            </h3>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {notification.timestamp}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-cyan-400' : 'bg-blue-600'}`}></div>
                                        )}
                                    </div>

                                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {notification.message}
                                    </p>

                                    <div className="flex gap-2">
                                        {!notification.read && (
                                            <button
                                                onClick={() => handleMarkAsRead(notification.id)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${darkMode ? 'bg-[#141b2d] text-cyan-400 hover:bg-[#0f1419]' : 'bg-gray-100 text-blue-600 hover:bg-gray-200'}`}
                                            >
                                                Mark as Read
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(notification.id)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${darkMode ? 'bg-[#141b2d] text-red-400 hover:bg-[#0f1419]' : 'bg-gray-100 text-red-600 hover:bg-gray-200'}`}
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SupervisorNotifications;
