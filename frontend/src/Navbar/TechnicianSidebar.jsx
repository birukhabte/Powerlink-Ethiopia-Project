import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ListTodo,
    MapPin,
    Calendar,
    MessageSquare,
    RefreshCw,
    User,
    History,
    Bell,
    LogOut
} from 'lucide-react';
import NotificationBell from '../components/NotificationBell';

const TechnicianSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/technician-dashboard' },
        { icon: <ListTodo size={20} />, label: 'My Tasks', path: '/technician/tasks' },
        { icon: <MapPin size={20} />, label: 'Service Map', path: '/technician/map' },
        { icon: <Calendar size={20} />, label: 'Schedule', path: '/technician/schedule' },
        { icon: <MessageSquare size={20} />, label: 'Chat', path: '/technician/chat' },
        { icon: <RefreshCw size={20} />, label: 'Post Updates', path: '/technician/updates' },
        { icon: <History size={20} />, label: 'History', path: '/technician/history' },
        { icon: <Bell size={20} />, label: 'Notifications', path: '/technician/notifications' },
        { icon: <User size={20} />, label: 'Profile', path: '/technician/profile' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const firstName = user.first_name || user.firstName || 'Technician';

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white h-screen shadow-md p-4 sticky top-0 overflow-y-auto border-r border-gray-100">
            <div className="mb-4 flex justify-between items-center px-2">
                <div className="font-black text-xl text-blue-600 tracking-tighter italic">POWERLINK</div>
                <NotificationBell />
            </div>

            <div className="mb-8 p-4 bg-green-50 rounded-xl flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {firstName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                    <div className="font-bold text-green-700 truncate">{firstName}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Technician</div>
                </div>
            </div>

            <nav className="space-y-1 flex-1">
                {menuItems.map((item, idx) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={idx}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all duration-200 group ${isActive
                                ? 'bg-green-600 text-white shadow-lg shadow-green-100'
                                : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                                }`}
                        >
                            <span className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-green-500'}`}>
                                {item.icon}
                            </span>
                            <span className="font-semibold text-sm">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <button
                onClick={handleLogout}
                className="mt-auto w-full flex items-center space-x-3 p-3 rounded-xl text-left text-red-500 hover:bg-red-50 transition-all duration-200 font-semibold text-sm"
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </aside>
    );
};

export default TechnicianSidebar;
