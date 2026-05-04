import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Edit, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const AssignTasks = () => {
    const { darkMode } = useOutletContext() || { darkMode: true };
    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: 'Inspect Transformer at Main Street',
            technician: 'John Smith',
            status: 'pending',
            priority: 'high',
            dueDate: '2024-05-10',
            description: 'Check transformer condition and perform maintenance'
        },
        {
            id: 2,
            title: 'Repair Power Line - Sector 5',
            technician: 'Mike Johnson',
            status: 'in-progress',
            priority: 'critical',
            dueDate: '2024-05-08',
            description: 'Repair damaged power line due to storm'
        },
        {
            id: 3,
            title: 'Install New Meter - Residential Area',
            technician: 'Sarah Williams',
            status: 'completed',
            priority: 'medium',
            dueDate: '2024-05-05',
            description: 'Install smart meter for new customer'
        },
        {
            id: 4,
            title: 'Cable Replacement - Downtown',
            technician: 'Tom Brown',
            status: 'pending',
            priority: 'medium',
            dueDate: '2024-05-12',
            description: 'Replace old underground cables'
        }
    ]);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        technician: '',
        priority: 'medium',
        dueDate: '',
        description: ''
    });

    const technicians = ['John Smith', 'Mike Johnson', 'Sarah Williams', 'Tom Brown', 'Lisa Davis'];

    const handleAddTask = () => {
        setFormData({
            title: '',
            technician: '',
            priority: 'medium',
            dueDate: '',
            description: ''
        });
        setEditingId(null);
        setShowForm(true);
    };

    const handleEditTask = (task) => {
        setFormData({
            title: task.title,
            technician: task.technician,
            priority: task.priority,
            dueDate: task.dueDate,
            description: task.description
        });
        setEditingId(task.id);
        setShowForm(true);
    };

    const handleSaveTask = (e) => {
        e.preventDefault();
        if (editingId) {
            setTasks(tasks.map(t => t.id === editingId ? { ...t, ...formData } : t));
        } else {
            setTasks([...tasks, { id: Date.now(), ...formData, status: 'pending' }]);
        }
        setShowForm(false);
    };

    const handleDeleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const getStatusColor = (status) => {
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

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical':
                return darkMode ? 'text-red-400' : 'text-red-600';
            case 'high':
                return darkMode ? 'text-orange-400' : 'text-orange-600';
            case 'medium':
                return darkMode ? 'text-yellow-400' : 'text-yellow-600';
            case 'low':
                return darkMode ? 'text-green-400' : 'text-green-600';
            default:
                return darkMode ? 'text-gray-400' : 'text-gray-600';
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Assign Tasks
                </h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Manage and assign tasks to technicians
                </p>
            </div>

            {/* Add Task Button */}
            <button
                onClick={handleAddTask}
                className={`mb-6 flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${darkMode ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:opacity-90' : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:opacity-90'}`}
            >
                <Plus size={20} /> Add New Task
            </button>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                    {task.title}
                                </h3>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {task.description}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditTask(task)}
                                    className={`p-2 rounded-lg transition ${darkMode ? 'bg-[#141b2d] text-cyan-400 hover:bg-[#0f1419]' : 'bg-gray-100 text-blue-600 hover:bg-gray-200'}`}
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className={`p-2 rounded-lg transition ${darkMode ? 'bg-[#141b2d] text-red-400 hover:bg-[#0f1419]' : 'bg-gray-100 text-red-600 hover:bg-gray-200'}`}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Technician:
                                </span>
                                <span className={`font-medium ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                                    {task.technician}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Priority:
                                </span>
                                <span className={`font-medium capitalize ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Due Date:
                                </span>
                                <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Status:
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                    {task.status.replace('-', ' ').toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Task Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-8 max-w-md w-full border`}>
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                            {editingId ? 'Edit Task' : 'Add New Task'}
                        </h2>

                        <form onSubmit={handleSaveTask} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Task Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter task title"
                                    required
                                    className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Assign to Technician
                                </label>
                                <select
                                    value={formData.technician}
                                    onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                                    required
                                    className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                >
                                    <option value="">Select technician</option>
                                    {technicians.map((tech) => (
                                        <option key={tech} value={tech}>{tech}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Priority
                                </label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    required
                                    className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter task description"
                                    rows="3"
                                    className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className={`flex-1 py-3 rounded-lg font-medium transition ${darkMode ? 'bg-[#141b2d] text-gray-300 hover:bg-[#0f1419]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`flex-1 py-3 rounded-lg font-medium transition ${darkMode ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:opacity-90' : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:opacity-90'}`}
                                >
                                    {editingId ? 'Update Task' : 'Add Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignTasks;
