import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Users, BarChart, Bell, UserPlus, MessageSquare,
    Settings, Home, AlertTriangle, Wrench, FileText,
    ChevronRight, TrendingUp, TrendingDown, Eye, Edit, Trash2
} from 'lucide-react';
import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    // Admin statistics
    const stats = [
        { icon: <Users />, label: 'Total Users', value: '1,245', change: '+12%', trend: 'up' },
        { icon: <AlertTriangle />, label: 'Active Outages', value: '23', change: '-5%', trend: 'down' },
        { icon: <Wrench />, label: 'Active Technicians', value: '45/50', change: '90%', trend: 'up' },
        { icon: <FileText />, label: 'Pending Requests', value: '156', change: '+8%', trend: 'up' },
    ];

    // Data for the graph
    const data = [
        { name: 'Total Users', value: 1245 },
        { name: 'Active Technicians', value: 45 },
        { name: 'Active Outages', value: 23 },
        { name: 'Pending Requests', value: 156 },
    ];

    // Recent activities
    const recentActivities = [
        { user: 'Tech #023', action: 'Completed task #T-456', time: '10 min ago' },
        { user: 'Supervisor', action: 'Assigned 5 new tasks', time: '25 min ago' },
        { user: 'Hospital Customer', action: 'Submitted urgent request', time: '1 hour ago' },
        { user: 'System', action: 'Generated daily report', time: '2 hours ago' },
    ];

    // Quick actions
    const quickActions = [
        { icon: <UserPlus />, label: 'Add Staff', link: '/admin/register-staff', color: 'blue' },
        { icon: <Bell />, label: 'Send Alert', link: '/admin/notices', color: 'red' },
        { icon: <BarChart />, label: 'Generate Report', link: '/admin/reports', color: 'green' },
        { icon: <Users />, label: 'Manage Users', link: '/admin/manage-accounts', color: 'purple' },
    ];

    return (
        <div className="p-6">
            {/* Stats Grid Removed as per request */}


            {/* System Overview Graph */}
            <div className="bg-white rounded-xl shadow p-6 mb-8">
                <h2 className="text-xl font-bold mb-6">System Overview</h2>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#2563eb" barSize={50} />
                        </RechartsBarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {quickActions.map((action, idx) => (
                                <Link
                                    key={idx}
                                    to={action.link}
                                    className={`p-4 rounded-xl border-2 border-${action.color}-200 bg-${action.color}-50 hover:bg-${action.color}-100 transition flex items-center`}
                                >
                                    <div className={`p-2 rounded-lg bg-${action.color}-100 text-${action.color}-600 mr-3`}>
                                        {action.icon}
                                    </div>
                                    <div>
                                        <div className="font-bold">{action.label}</div>
                                        <div className="text-sm text-gray-600 flex items-center">
                                            Click to proceed <ChevronRight size={16} className="ml-1" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="bg-white rounded-xl shadow p-6 mt-6">
                        <h2 className="text-xl font-bold mb-6">Recent Activities</h2>
                        <div className="space-y-4">
                            {recentActivities.map((activity, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                                    <div>
                                        <div className="font-medium">{activity.user}</div>
                                        <div className="text-gray-600 text-sm">{activity.action}</div>
                                    </div>
                                    <div className="text-gray-500 text-sm">{activity.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Activity */}
                <div className="space-y-8">
                    {/* Recent Activity */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                                    <div>
                                        <p className="text-sm font-medium">New customer registration</p>
                                        <p className="text-xs text-gray-500">2 minutes ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Emergency Controls */}
                    <div className="bg-white rounded-xl shadow p-6 mt-6 border-2 border-red-200">
                        <h2 className="text-xl font-bold mb-4 text-red-600 flex items-center">
                            <AlertTriangle className="mr-2" /> Emergency Controls
                        </h2>
                        <div className="space-y-3">
                            <button className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700">
                                Broadcast Emergency Alert
                            </button>
                            <button className="w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                                Initiate System Backup
                            </button>
                            <button className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-900">
                                System Maintenance Mode
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;