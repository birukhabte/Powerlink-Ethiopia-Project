import React, { useState } from 'react';
import {
    BarChart3,
    PieChart,
    LineChart,
    Download,
    Filter,
    Calendar,
    AlertTriangle,
    Users,
    Wrench,
    TrendingUp,
    TrendingDown,
    Eye
} from 'lucide-react';

const Report = () => {
    const [selectedReport, setSelectedReport] = useState('outage');
    const [timeRange, setTimeRange] = useState('monthly');

    // Report data
    const reportData = {
        outage: {
            title: 'Outage Patterns Report',
            metrics: [
                { label: 'Total Outages', value: '1,234', change: '+12%', trend: 'up' },
                { label: 'Avg. Response Time', value: '1.8 hrs', change: '-15%', trend: 'down' },
                { label: 'Resolution Rate', value: '96.7%', change: '+3%', trend: 'up' },
                { label: 'Affected Customers', value: '5,678', change: '+8%', trend: 'up' }
            ],
            chartData: [
                { area: 'Bole', outages: 156, resolved: 145 },
                { area: 'Megenagna', outages: 98, resolved: 92 },
                { area: 'Kirkos', outages: 134, resolved: 128 },
                { area: 'Gurd Shola', outages: 87, resolved: 80 },
                { area: 'Addis Central', outages: 112, resolved: 108 }
            ]
        },
        usage: {
            title: 'System Usage Report',
            metrics: [
                { label: 'Active Users', value: '12,345', change: '+18%', trend: 'up' },
                { label: 'Service Requests', value: '876', change: '+22%', trend: 'up' },
                { label: 'Avg. Session Time', value: '8.5 min', change: '+5%', trend: 'up' },
                { label: 'Mobile Usage', value: '68%', change: '+12%', trend: 'up' }
            ],
            chartData: [
                { month: 'Jan', users: 10500, requests: 720 },
                { month: 'Feb', users: 11200, requests: 780 },
                { month: 'Mar', users: 11800, requests: 810 },
                { month: 'Apr', users: 12345, requests: 876 }
            ]
        },
        service: {
            title: 'Service Delivery Report',
            metrics: [
                { label: 'Completed Tasks', value: '2,345', change: '+25%', trend: 'up' },
                { label: 'Technician Efficiency', value: '92.3%', change: '+7%', trend: 'up' },
                { label: 'Customer Satisfaction', value: '4.8/5', change: '+0.3', trend: 'up' },
                { label: 'On-time Delivery', value: '94.5%', change: '+4%', trend: 'up' }
            ],
            chartData: [
                { technician: 'Tech-023', tasks: 56, rating: 4.9 },
                { technician: 'Tech-045', tasks: 48, rating: 4.7 },
                { technician: 'Tech-012', tasks: 52, rating: 4.8 },
                { technician: 'Tech-067', tasks: 44, rating: 4.6 },
                { technician: 'Tech-089', tasks: 51, rating: 4.9 }
            ]
        }
    };

    const reports = [
        { id: 'outage', icon: <AlertTriangle />, label: 'Outage Patterns' },
        { id: 'usage', icon: <Users />, label: 'System Usage' },
        { id: 'service', icon: <Wrench />, label: 'Service Delivery' },
        { id: 'technician', icon: <Users />, label: 'Technician Performance' },
        { id: 'revenue', icon: <TrendingUp />, label: 'Revenue Reports' }
    ];

    const timeRanges = [
        { id: 'daily', label: 'Daily' },
        { id: 'weekly', label: 'Weekly' },
        { id: 'monthly', label: 'Monthly' },
        { id: 'quarterly', label: 'Quarterly' }
    ];

    const currentReport = reportData[selectedReport] || reportData.outage;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">System Reports & Analytics</h1>
                    <p className="text-gray-600">View detailed statistics and performance metrics</p>
                </div>

                {/* Report Selection */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex flex-wrap gap-2">
                            {reports.map(report => (
                                <button
                                    key={report.id}
                                    onClick={() => setSelectedReport(report.id)}
                                    className={`px-4 py-2 rounded-lg flex items-center ${selectedReport === report.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {report.icon}
                                    <span className="ml-2">{report.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <Calendar className="mr-2 text-gray-500" />
                                <select
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                >
                                    {timeRanges.map(range => (
                                        <option key={range.id} value={range.id}>{range.label}</option>
                                    ))}
                                </select>
                            </div>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                                <Download className="mr-2" /> Export PDF
                            </button>
                        </div>
                    </div>

                    {/* Report Title */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        {currentReport.title} - {timeRanges.find(t => t.id === timeRange)?.label} View
                    </h2>

                    {/* Metrics Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {currentReport.metrics.map((metric, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-xl">
                                <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
                                <div className="flex items-end justify-between">
                                    <div className="text-2xl font-bold text-gray-800">{metric.value}</div>
                                    <div className={`flex items-center ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                        {metric.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                        <span className="ml-1 text-sm">{metric.change}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Bar Chart */}
                        <div className="bg-gray-50 p-6 rounded-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold flex items-center">
                                    <BarChart3 className="mr-2" /> Distribution
                                </h3>
                                <Eye className="text-gray-400 cursor-pointer" />
                            </div>
                            <div className="h-64 flex items-end space-x-4 justify-center pt-8">
                                {currentReport.chartData.slice(0, 5).map((item, idx) => {
                                    const maxValue = Math.max(...currentReport.chartData.map(d => d.outages || d.users || d.tasks));
                                    const height = ((item.outages || item.users || item.tasks) / maxValue) * 150;
                                    return (
                                        <div key={idx} className="flex flex-col items-center">
                                            <div
                                                className="w-12 bg-blue-600 rounded-t-lg"
                                                style={{ height: `${height}px` }}
                                            ></div>
                                            <div className="mt-2 text-xs text-gray-600">
                                                {item.area || item.month || item.technician?.slice(0, 8)}
                                            </div>
                                            <div className="text-sm font-bold">
                                                {item.outages || item.users || item.tasks}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Line Chart */}
                        <div className="bg-gray-50 p-6 rounded-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold flex items-center">
                                    <LineChart className="mr-2" /> Trends
                                </h3>
                                <Eye className="text-gray-400 cursor-pointer" />
                            </div>
                            <div className="h-64 flex items-center justify-center">
                                <div className="relative w-full h-full">
                                    {/* Simulated line chart */}
                                    <div className="absolute inset-0 flex items-end">
                                        {[60, 75, 85, 95].map((percent, idx) => (
                                            <div
                                                key={idx}
                                                className="flex-1 mx-2 flex items-end justify-center"
                                            >
                                                <div
                                                    className="w-3/4 bg-green-500 rounded-t-lg"
                                                    style={{ height: `${percent}%` }}
                                                ></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-4">
                                        {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((label, idx) => (
                                            <div key={idx}>{label}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    {Object.keys(currentReport.chartData[0] || {}).map((key) => (
                                        <th key={key} className="text-left p-3 font-semibold text-gray-700">
                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                        </th>
                                    ))}
                                    <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentReport.chartData.slice(0, 5).map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        {Object.values(row).map((value, idx2) => (
                                            <td key={idx2} className="p-3">{value}</td>
                                        ))}
                                        <td className="p-3">
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow">
                        <div className="flex items-center mb-4">
                            <AlertTriangle className="text-red-500 mr-3" />
                            <div>
                                <div className="font-bold">Current Outages</div>
                                <div className="text-2xl font-bold">23 Active</div>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">5 critical, 18 standard</div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        <div className="flex items-center mb-4">
                            <Users className="text-blue-500 mr-3" />
                            <div>
                                <div className="font-bold">Active Technicians</div>
                                <div className="text-2xl font-bold">45/50</div>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">90% availability rate</div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        <div className="flex items-center mb-4">
                            <TrendingUp className="text-green-500 mr-3" />
                            <div>
                                <div className="font-bold">Satisfaction Rate</div>
                                <div className="text-2xl font-bold">96.2%</div>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">+2.1% from last month</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Report;