import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bell, Trash2, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Notifications = () => {
    const { darkMode } = useOutletContext() || { darkMode: true };
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'success',
            title: 'Service Request Completed',
            message: 'Your service request #SR-2024-001 has been completed successfully.',
            timestamp: '2 hours ago',
            read: false
        },
        {
            id: 2,
            type: 'alert',
            title: 'Power Outage Alert',
            message: 'Power outage reported in your area. Estimated restoration time: 3 hours.',
            timestamp: '5 hours ago',
            read: false
        },
        {
            id: 3,
            type: 'info',
            title: 'Technician Assigned',
            message: 'Technician Tech-023 has been assigned to your ticket #OUT-2024-00123.',
            timestamp: '1 day ago',
            read: true
        },
        {
            id: 4,
            type: 'success',
            title: 'Payment Received',
            message: 'Your payment of ETB 500 has been received successfully.',
            timestamp: '2 days ago',
            read: true
        },
        {
            id: 5,
            type: 'info',
            title: 'System Maintenance',
            message: 'Scheduled maintenance on the system will occur on Sunday 10 PM - 12 AM.',
            timestamp: '3 days ago',
            read: true
        },
    ]);

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'alert':
                return <AlertCircle className="text-red-500" size={20} />;
            case 'info':
                return <Info className="text-blue-500" size={20} />;
            default:
                return <Bell className="text-gray-500" size={20} />;
        }
    };

    const getTypeColor = (type) => {
        if (darkMode) {
            switch (type) {
                case 'success':
                    return 'bg-green-900/20 border-l-4 border-green-500';
                case 'alert':
                    return 'bg-red-900/20 border-l-4 border-red-500';
                case 'info':
                    return 'bg-blue-900/20 border-l-4 border-blue-500';
                default:
                    return 'bg-gray-900/20 border-l-4 border-gray-500';
            }
        } else {
            switch (type) {
                case 'success':
                    return 'bg-green-50 border-l-4 border-green-500';
                case 'alert':
                    return 'bg-red-50 border-l-4 border-red-500';
                case 'info':
                    return 'bg-blue-50 border-l-4 border-blue-500';
                default:
                    return 'bg-gray-50 border-l-4 border-gray-500';
            }
        }
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
        ));
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'} p-6`}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Notifications
                    </h1>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        Stay updated with your service requests and system alerts
                    </p>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {notifications.length === 0 ? (
                        <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-12 text-center border`}>
                            <Bell className={`mx-auto ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`} size={48} />
                            <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                                No Notifications
                            </h3>
                            <p className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                                You're all caught up! Check back later for updates.
                            </p>
                        </div>
                    ) : (
                        notifications.map(notification => (
                            <div
                                key={notification.id}
                                className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-4 border ${getTypeColor(notification.type)} transition-all hover:shadow-lg`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="mt-1">
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {notification.title}
                                                </h3>
                                                {!notification.read && (
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                )}
                                            </div>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                                                {notification.message}
                                            </p>
                                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                {notification.timestamp}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        {!notification.read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className={`px-3 py-1 text-xs rounded-lg ${darkMode ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'} transition`}
                                            >
                                                Mark Read
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(notification.id)}
                                            className={`p-2 ${darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-600 hover:text-red-600 hover:bg-red-50'} rounded-lg transition`}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Stats */}
                {notifications.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-xl text-center border`}>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {notifications.filter(n => !n.read).length}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Unread
                            </div>
                        </div>
                        <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-xl text-center border`}>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {notifications.length}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Total
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
