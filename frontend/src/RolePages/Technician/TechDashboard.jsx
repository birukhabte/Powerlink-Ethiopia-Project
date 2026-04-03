import React from 'react';
import {
    Wrench,
    Map,
    MessageSquare,
    Clock,
    MapPin,
    FileText,
    AlertTriangle,
    ClipboardList,
    CheckCircle2,
    Timer,
    Star
} from 'lucide-react';

const TechDashboard = () => {
    const stats = [
        { title: 'Tasks Today', value: '5', icon: <ClipboardList size={24} className="text-blue-600" />, color: 'bg-blue-100' },
        { title: 'Completed', value: '3/5', icon: <CheckCircle2 size={24} className="text-green-600" />, color: 'bg-green-100' },
        { title: 'Avg. Time/Task', value: '1.2 hrs', icon: <Timer size={24} className="text-yellow-600" />, color: 'bg-yellow-100' },
        { title: 'Rating', value: '4.8/5', icon: <Star size={24} className="text-purple-600" />, color: 'bg-purple-100' }
    ];

    const quickActions = [
        { icon: <Wrench size={20} />, label: 'View Tasks', link: '/tasks', color: 'bg-indigo-600 hover:bg-indigo-700' },
        { icon: <Map size={20} />, label: 'Assigned Area', link: '/technician-map', color: 'bg-emerald-600 hover:bg-emerald-700' },
        { icon: <MessageSquare size={20} />, label: 'Team Chat', link: '/chat', color: 'bg-blue-600 hover:bg-blue-700' },
        { icon: <Clock size={20} />, label: 'Update Status', link: '/update-status', color: 'bg-orange-600 hover:bg-orange-700' }
    ];

    const todaysTasks = [
        { id: 'T-123', location: 'Bole, AA', type: 'Outage Repair', status: 'In Progress', priority: 'High', time: '08:00 - 10:00' },
        { id: 'T-124', location: 'Megenagna', type: 'Meter Check', status: 'Pending', priority: 'Medium', time: '11:00 - 12:00' },
        { id: 'T-125', location: 'Kirkos', type: 'Line Maintenance', status: 'Scheduled', priority: 'Low', time: '14:00 - 15:30' }
    ];

    const tools = [
        { icon: <MapPin className="text-blue-500" />, label: 'Navigation', desc: 'Get directions to job sites' },
        { icon: <FileText className="text-green-500" />, label: 'Work Reports', desc: 'Submit completion reports' },
        { icon: <AlertTriangle className="text-yellow-500" />, label: 'Safety Checklist', desc: 'Daily safety verification' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'In Progress': return 'text-blue-600 bg-blue-50';
            case 'Pending': return 'text-yellow-600 bg-yellow-50';
            case 'Scheduled': return 'text-gray-600 bg-gray-50';
            case 'Completed': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'text-red-600 bg-red-50';
            case 'Medium': return 'text-yellow-600 bg-yellow-50';
            case 'Low': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Technician Dashboard</h1>
                    <p className="text-gray-500">Welcome back, Tech-023</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-500 text-sm font-medium">{stat.title}</span>
                                <div className={`p-2 rounded-lg ${stat.color}`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Tasks */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    className={`${action.color} text-white p-4 rounded-xl shadow-md flexflex-col items-center justify-center transition-transform hover:scale-105 active:scale-95 space-y-2`}
                                >
                                    <div>{action.icon}</div>
                                    <span className="font-medium text-sm">{action.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Today's Tasks */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="font-bold text-gray-800 flex items-center">
                                    <ClipboardList className="mr-2 text-blue-600" size={20} />
                                    Today's Schedule
                                </h2>
                                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {todaysTasks.map((task) => (
                                    <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-gray-800">{task.type}</h3>
                                                <div className="text-sm text-gray-500 flex items-center mt-1">
                                                    <MapPin size={14} className="mr-1" /> {task.location}
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                                {task.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-3">
                                            <div className="text-sm text-gray-600 flex items-center">
                                                <Clock size={14} className="mr-1" /> {task.time}
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Tools & Resources */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <h2 className="font-bold text-gray-800 mb-4">Quick Tools</h2>
                            <div className="space-y-3">
                                {tools.map((tool, index) => (
                                    <button key={index} className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left group">
                                        <div className="mr-3 p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                                            {tool.icon}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-700">{tool.label}</div>
                                            <div className="text-xs text-gray-500">{tool.desc}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-5 text-white">
                            <div className="flex items-center mb-3">
                                <AlertTriangle className="mr-2" />
                                <h3 className="font-bold">Safety Reminder</h3>
                            </div>
                            <p className="text-blue-100 text-sm mb-4">
                                Remember to wear all required PPE before entering the site. Report any hazards immediately.
                            </p>
                            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors">
                                Verify Safety Checklist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechDashboard;
