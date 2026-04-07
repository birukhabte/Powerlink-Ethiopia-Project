import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    FileCheck,
    Users,
    BarChart,
    LogOut,
    Eye,
    Bell,
    MessageSquare,
    History
} from 'lucide-react';

const SupervisorSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: <Home />, label: 'Dashboard', path: '/supervisor-dashboard' },
        { icon: <Eye />, label: 'Review Requests', path: '/supervisor/requests' },
        { icon: <FileCheck />, label: 'Validate Docs', path: '/supervisor/validate' },
        { icon: <Users />, label: 'Assign Tasks', path: '/supervisor/assign' },
        { icon: <BarChart />, label: 'Team Performance', path: '/supervisor/performance' },
        { icon: <MessageSquare />, label: 'Chat', path: '/supervisor/chat' },
        { icon: <Bell />, label: 'Notifications', path: '/supervisor/notifications' },
        { icon: <History />, label: 'History', path: '/supervisor/history' },
        { icon: <Users />, label: 'Profile', path: '/supervisor/profile' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const firstName = user.firstName || 'Supervisor';
    const firstLetter = firstName.charAt(0).toUpperCase();

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white h-screen shadow-md p-4 sticky top-0 overflow-y-auto custom-scrollbar">
            <div className="mb-8 p-4 bg-blue-50 rounded-lg flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                    {firstLetter}
                </div>
                <div>
                    <div className="font-bold text-blue-700">
                        {firstName}
                    </div>
                    <div className="text-xs text-gray-600">
                        Field Supervisor
                    </div>
                </div>
            </div>

            <nav className="space-y-2 flex-1 flex flex-col">
                {menuItems.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left cursor-pointer transition-colors duration-200 ${location.pathname === item.path ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'
                            }`}
                    >
                        <span className={`${location.pathname === item.path ? 'text-blue-700' : 'text-gray-400'}`}>
                            {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg text-left cursor-pointer transition-colors duration-200 text-red-600 hover:bg-red-50 mt-auto"
                >
                    <span className="text-red-500">
                        <LogOut />
                    </span>
                    <span className="font-medium">Logout</span>
                </button>
            </nav>
        </aside>
    );
};

export default SupervisorSidebar;
