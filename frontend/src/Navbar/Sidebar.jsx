import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    FileText,
    Map,
    User,
    Bell,
    Zap,
    History,
    Users,
    BarChart,
    UserPlus,
    MessageSquare,
    Settings,
    LogOut
} from 'lucide-react';
import NotificationBell from '../components/NotificationBell';

const Sidebar = ({ setShowOutageForm, setShowMap, showOutageForm, showMap }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'customer';
    const isAdmin = role === 'admin';

    const customerMenuItems = [
        { icon: <Home />, label: 'Dashboard', path: '/dashboard', isActive: location.pathname === '/dashboard' && !showOutageForm && !showMap },
        { icon: <FileText />, label: 'Report Outage', onClick: () => { if (location.pathname !== '/dashboard') navigate('/dashboard'); setShowOutageForm(true); }, isActive: showOutageForm },
        { icon: <FileText />, label: 'Track Ticket', path: '/ticket' },
        { icon: <Zap />, label: 'Request Service', path: '/request-service' },
        { icon: <History />, label: 'History', path: '/customer/history' },
        { icon: <Bell />, label: 'Notifications', path: '/customer/notifications' },
        { icon: <User />, label: 'Profile', path: '/customer/profile' },
    ];

    const adminMenuItems = [
        { icon: <Home />, label: 'Admin Dashboard', path: '/admin-dashboard' },
        { icon: <Users />, label: 'Manage Accounts', path: '/admin/manage-accounts' },
        { icon: <BarChart />, label: 'Reports Page', path: '/admin/report' },
        { icon: <Bell />, label: 'Notices & Alerts', path: '/admin/notices' },
        { icon: <UserPlus />, label: 'Register Staff', path: '/admin/register-staff' },
        { icon: <MessageSquare />, label: 'Chat', path: '/admin/chat' },
        { icon: <History />, label: 'History', path: '/admin/history' },
        { icon: <Bell />, label: 'Notifications', path: '/admin/notifications' },
        { icon: <User />, label: 'Profile', path: '/admin/profile' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const menuItems = [
        ...(isAdmin ? adminMenuItems : customerMenuItems),
        { icon: <LogOut />, label: 'Logout', onClick: handleLogout, className: 'text-red-600 hover:bg-red-50 mt-auto' }
    ];

    const firstName = user.first_name || user.firstName || 'User';
    const displayName = (isAdmin && firstName === 'System') ? 'Admin' : firstName;
    const firstLetter = displayName.charAt(0).toUpperCase();

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white h-screen shadow-md p-4 sticky top-0 overflow-y-auto">
            <div className="mb-4 flex justify-between items-center px-2">
                <div className="font-black text-xl text-blue-600 tracking-tighter italic">POWERLINK</div>
                <NotificationBell />
            </div>

            <div className="mb-8 p-4 bg-blue-50 rounded-lg flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                    {firstLetter}
                </div>
                <div className="min-w-0">
                    <div className="font-bold text-blue-700 truncate">
                        {displayName}
                    </div>
                    <div className="text-xs text-gray-600 uppercase tracking-widest font-bold">
                        {role}
                    </div>
                </div>
            </div>

            <nav className="space-y-2 flex-1 flex flex-col">
                {menuItems.map((item, idx) => {
                    const isActive = item.isActive !== undefined ? item.isActive : location.pathname === item.path;
                    return (
                        <button
                            key={idx}
                            onClick={item.onClick ? item.onClick : () => navigate(item.path)}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left cursor-pointer transition-colors duration-200 ${item.className ? item.className : `hover:bg-blue-50 ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`
                                }`}
                        >
                            <span className={`${isActive ? 'text-blue-700' : item.className ? '' : 'text-gray-400'}`}>
                                {item.icon}
                            </span>
                            <span className="font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
