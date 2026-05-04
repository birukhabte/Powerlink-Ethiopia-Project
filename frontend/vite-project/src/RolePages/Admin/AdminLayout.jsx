import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Users, BarChart, Bell, UserPlus, MessageSquare, Download,
    Settings, Home, AlertTriangle, Wrench, FileText, Mail, DollarSign, TrendingUp,
    ChevronRight, Eye, Edit, Trash2, Server, Menu, Moon, Sun, User, Calendar, HelpCircle,
    PieChart as PieChartIcon, LineChart as LineChartIcon, Map, Camera, X, LogOut, Lock, UserCog, Palette
} from 'lucide-react';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showPhotoUpload, setShowPhotoUpload] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'light' ? false : true);
    const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('adminProfilePhoto') || null);
    const [showOutageForm, setShowOutageForm] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Check authentication on mount
    React.useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (!token || !user) {
            navigate('/login');
        }
    }, [navigate]);

    // Get user role from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user.role || 'admin';

    // Define menu items based on role
    const getMenuItems = () => {
        if (userRole === 'customer') {
            return [
                { icon: <Home size={18} />, label: 'Dashboard', path: '/dashboard' },
                { icon: <AlertTriangle size={18} />, label: 'Report Outage', path: '/report-outage' },
                { icon: <FileText size={18} />, label: 'My Tickets', path: '/ticket' },
                { icon: <Wrench size={18} />, label: 'Request Service', path: '/request-service' },
                { icon: <Bell size={18} />, label: 'Notifications', path: '/notifications' },
                { icon: <FileText size={18} />, label: 'History', path: '/history' },
                { icon: <User size={18} />, label: 'Profile', path: '/profile' },
            ];
        }

        if (userRole === 'supervisor') {
            return [
                { icon: <Home size={18} />, label: 'Dashboard', path: '/dashboard' },
                { icon: <Wrench size={18} />, label: 'Assign Tasks', path: '/supervisor/assign-tasks' },
                { icon: <FileText size={18} />, label: 'Manage Requests', path: '/supervisor/requests' },
                { icon: <Eye size={18} />, label: 'Validate Documents', path: '/supervisor/validate' },
                { icon: <Bell size={18} />, label: 'Notifications', path: '/supervisor/notifications' },
                { icon: <FileText size={18} />, label: 'History', path: '/supervisor/history' },
                { icon: <MessageSquare size={18} />, label: 'Chat', path: '/supervisor/chat' },
            ];
        }
        
        // Admin menu (default)
        return [
            { icon: <Home size={18} />, label: 'Dashboard', path: '/dashboard' },
            { icon: <Users size={18} />, label: 'Manage Accounts', path: '/admin/manage-accounts' },
            { icon: <UserPlus size={18} />, label: 'Register Staff', path: '/admin/register-staff' },
            { icon: <Bell size={18} />, label: 'Notices & Alerts', path: '/admin/notices' },
            { icon: <BarChart size={18} />, label: 'Reports Page', path: '/admin/report' },
            { icon: <MessageSquare size={18} />, label: 'Chat', path: '/admin/chat' },
        ];
    };

    const menuItems = getMenuItems();

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const photoData = reader.result;
                setProfilePhoto(photoData);
                localStorage.setItem('adminProfilePhoto', photoData);
                setShowPhotoUpload(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setProfilePhoto(null);
        localStorage.removeItem('adminProfilePhoto');
        setShowPhotoUpload(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const toggleTheme = () => {
        const newTheme = !darkMode;
        setDarkMode(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className={`flex h-screen ${darkMode ? 'bg-[#141b2d] text-white' : 'bg-gray-50 text-gray-900'} overflow-hidden`}>
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} ${darkMode ? 'bg-[#1f2a40]' : 'bg-white'} transition-all duration-300 flex flex-col ${darkMode ? 'border-r border-gray-700' : 'border-r border-gray-200 shadow-lg'}`}>
                {/* Sidebar Header */}
                <div className={`p-6 flex items-center justify-between ${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
                    <h1 className={`text-xl font-bold ${!sidebarOpen && 'hidden'}`}>
                        {userRole === 'customer' ? 'CUSTOMER' : userRole === 'supervisor' ? 'SUPERVISOR' : 'ADMIN'}
                    </h1>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                        <Menu size={20} />
                    </button>
                </div>

                {/* User Profile */}
                {sidebarOpen && (
                    <div className={`p-6 text-center ${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'} relative`}>
                        <div className="relative w-24 h-24 mx-auto mb-3 group">
                            {profilePhoto ? (
                                <img 
                                    src={profilePhoto} 
                                    alt="Admin Profile" 
                                    className="w-24 h-24 rounded-full object-cover border-4 border-gradient-to-br from-purple-500 to-cyan-500"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                                    <User size={40} />
                                </div>
                            )}
                            <button
                                onClick={() => setShowPhotoUpload(true)}
                                className="absolute bottom-0 right-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-600 transition shadow-lg opacity-0 group-hover:opacity-100"
                            >
                                <Camera size={16} />
                            </button>
                        </div>
                        <h3 className="font-bold text-lg">
                            {JSON.parse(localStorage.getItem('user') || '{}').firstName || 'Admin'} {JSON.parse(localStorage.getItem('user') || '{}').lastName || 'User'}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>Smart Admin</p>

                        {/* Photo Upload Modal */}
                        {showPhotoUpload && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPhotoUpload(false)}>
                                <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 max-w-sm w-full mx-4 border`} onClick={(e) => e.stopPropagation()}>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold">Update Profile Photo</h3>
                                        <button onClick={() => setShowPhotoUpload(false)} className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                                            <X size={20} />
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <label className="block">
                                            <div className={`border-2 border-dashed ${darkMode ? 'border-gray-700 hover:border-cyan-400' : 'border-gray-300 hover:border-blue-500'} rounded-lg p-6 text-center cursor-pointer transition`}>
                                                <Camera className={`mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`} size={32} />
                                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>Click to upload photo</p>
                                                <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} text-xs`}>JPG, PNG or GIF (max 2MB)</p>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePhotoUpload}
                                                    className="hidden"
                                                />
                                            </div>
                                        </label>

                                        {profilePhoto && (
                                            <button
                                                onClick={removePhoto}
                                                className="w-full py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition border border-red-500/30"
                                            >
                                                Remove Current Photo
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Menu Items */}
                <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                    {menuItems.map((item, idx) => (
                        item.section ? (
                            sidebarOpen && (
                                <div key={idx} className={`px-6 py-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} uppercase font-semibold`}>
                                    {item.section}
                                </div>
                            )
                        ) : (
                            <Link
                                key={idx}
                                to={item.path}
                                className={`flex items-center gap-3 px-6 py-3 transition ${
                                    isActive(item.path) 
                                        ? darkMode 
                                            ? 'bg-[#141b2d] text-cyan-400 border-r-4 border-cyan-400' 
                                            : 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                                        : darkMode
                                            ? 'text-gray-400 hover:bg-[#141b2d]'
                                            : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {item.icon}
                                {sidebarOpen && <span className="text-sm">{item.label}</span>}
                            </Link>
                        )
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Top Bar */}
                <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200 shadow-sm'} p-4 flex justify-between items-center border-b sticky top-0 z-10`}>
                    <div className="flex-1">
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className={`${darkMode ? 'bg-[#141b2d] text-white' : 'bg-gray-100 text-gray-900'} px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={toggleTheme}
                            className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition relative`}>
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                3
                            </span>
                        </button>
                        <button 
                            onClick={() => setShowSettings(!showSettings)}
                            className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition relative`}
                        >
                            <Settings size={20} />
                        </button>
                        <button className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}>
                            <User size={20} />
                        </button>
                    </div>

                    {/* Settings Dropdown */}
                    {showSettings && (
                        <>
                            <div className="fixed inset-0 z-20" onClick={() => setShowSettings(false)}></div>
                            <div className={`absolute right-4 top-16 ${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-xl border w-72 z-30`}>
                                <div className={`p-4 ${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
                                    <h3 className="text-lg font-bold">Settings</h3>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage your account preferences</p>
                                </div>
                                
                                <div className="p-2">
                                    <button 
                                        onClick={() => {
                                            setShowSettings(false);
                                            setShowPhotoUpload(true);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 ${darkMode ? 'text-gray-300 hover:bg-[#141b2d]' : 'text-gray-700 hover:bg-gray-50'} rounded-lg transition`}
                                    >
                                        <UserCog size={18} className={darkMode ? 'text-cyan-400' : 'text-blue-600'} />
                                        <div className="text-left">
                                            <div className="font-medium">Profile Settings</div>
                                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Update photo and info</div>
                                        </div>
                                    </button>

                                    <button className={`w-full flex items-center gap-3 px-4 py-3 ${darkMode ? 'text-gray-300 hover:bg-[#141b2d]' : 'text-gray-700 hover:bg-gray-50'} rounded-lg transition`}>
                                        <Lock size={18} className={darkMode ? 'text-cyan-400' : 'text-blue-600'} />
                                        <div className="text-left">
                                            <div className="font-medium">Change Password</div>
                                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Update your password</div>
                                        </div>
                                    </button>

                                    <button 
                                        onClick={toggleTheme}
                                        className={`w-full flex items-center gap-3 px-4 py-3 ${darkMode ? 'text-gray-300 hover:bg-[#141b2d]' : 'text-gray-700 hover:bg-gray-50'} rounded-lg transition`}
                                    >
                                        <Palette size={18} className={darkMode ? 'text-cyan-400' : 'text-blue-600'} />
                                        <div className="text-left">
                                            <div className="font-medium">Appearance</div>
                                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                            </div>
                                        </div>
                                    </button>

                                    <button className={`w-full flex items-center gap-3 px-4 py-3 ${darkMode ? 'text-gray-300 hover:bg-[#141b2d]' : 'text-gray-700 hover:bg-gray-50'} rounded-lg transition`}>
                                        <Bell size={18} className={darkMode ? 'text-cyan-400' : 'text-blue-600'} />
                                        <div className="text-left">
                                            <div className="font-medium">Notifications</div>
                                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage alerts</div>
                                        </div>
                                    </button>

                                    <div className={`${darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'} my-2`}></div>

                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                    >
                                        <LogOut size={18} />
                                        <div className="text-left">
                                            <div className="font-medium">Logout</div>
                                            <div className="text-xs text-red-400/70">Sign out of your account</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Page Content */}
                <div className="p-6">
                    <Outlet context={{ darkMode, showOutageForm, setShowOutageForm, showMap, setShowMap }} />
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1f2a40;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #06b6d4, #8b5cf6);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default AdminLayout;