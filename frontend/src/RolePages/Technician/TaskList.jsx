import React, { useState, useEffect } from 'react';
import {
    ClipboardList,
    MapPin,
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
    MessageSquare,
    Calendar,
    User,
    ChevronRight,
    Wrench,
    Navigation,
    Upload,
    Eye,
    Save,
    Image as ImageIcon
} from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import axios from 'axios';
import { useSocket } from '../../contexts/SocketContext';

const TaskList = () => {
    const { socket, isConnected } = useSocket();
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    
    // Form state for updates
    const [status, setStatus] = useState('');
    const [notes, setNotes] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [evidenceImage, setEvidenceImage] = useState('');

    const statusOptions = [
        { label: 'Traveling to Site', value: 'traveling' },
        { label: 'On-site Assessment', value: 'assessment' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Waiting for Parts', value: 'waiting_parts' },
        { label: 'Completed Successfully', value: 'completed' },
        { label: 'Cannot Complete', value: 'cannot_complete' },
    ];

    useEffect(() => {
        fetchTasks();
        const interval = setInterval(fetchTasks, 60000); // Fallback polling every minute
        return () => clearInterval(interval);
    }, []);

    // Real-time updates
    useEffect(() => {
        if (socket && isConnected) {
            // Listen for new task assignments
            socket.on('notification', (notification) => {
                if (notification.type === 'info' && 
                    (notification.title.includes('assigned') || notification.title.includes('New Task'))) {
                    console.log('New task assigned to technician:', notification);
                    fetchTasks(); // Refresh tasks immediately
                }
            });

            // Listen for task updates from other sources
            socket.on('task-update', (updateData) => {
                console.log('Task updated:', updateData);
                fetchTasks(); // Refresh tasks
            });
        }

        return () => {
            if (socket) {
                socket.off('notification');
                socket.off('task-update');
            }
        };
    }, [socket, isConnected]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(API_ENDPOINTS.technician.tasks, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setTasks(response.data.tasks);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTask = (task) => {
        setSelectedTask(task);
        setStatus(task.status);
        setNotes(task.technician_notes || '');
        setEstimatedTime(task.estimated_time || '');
        setEvidenceImage(task.evidence_image || '');
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        if (!status) return;

        try {
            setUpdateLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                API_ENDPOINTS.technician.updateTask(selectedTask.type, selectedTask.id),
                {
                    status,
                    notes,
                    estimated_time: estimatedTime,
                    evidence_image: evidenceImage
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                alert('Task updated successfully!');
                fetchTasks(); // Refresh list
                // If completed, clear selection
                if (status === 'completed' || status === 'resolved') {
                    setSelectedTask(null);
                }
            }
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task: ' + (error.response?.data?.error || 'Server error'));
        } finally {
            setUpdateLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
            case 'resolved': return <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Done</span>;
            case 'in_progress': return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Active</span>;
            case 'assigned': return <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">New</span>;
            default: return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{status}</span>;
        }
    };

    if (loading && tasks.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <Wrench className="text-slate-300 mb-4" size={48} />
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
                            <ClipboardList className="mr-3 text-blue-600" size={32} /> FIELD OPERATIONS
                        </h1>
                        <p className="text-slate-500 font-medium">Manage your assigned maintenance and repair tasks</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-center">
                            <div className="text-xl font-black text-blue-600">{tasks.length}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Total Tasks</div>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-center">
                            <div className="text-xl font-black text-amber-500">{tasks.filter(t => t.status === 'assigned').length}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Pending</div>
                        </div>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Task List Column */}
                    <div className="lg:col-span-7 space-y-4">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Task Queue</h2>
                        {tasks.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                                <CheckCircle className="mx-auto text-slate-200 mb-4" size={64} />
                                <h3 className="text-xl font-bold text-slate-800">Clear Schedule!</h3>
                                <p className="text-slate-500">No tasks currently assigned to your queue.</p>
                            </div>
                        ) : (
                            tasks.map(task => (
                                <div
                                    key={`${task.type}-${task.id}`}
                                    onClick={() => handleSelectTask(task)}
                                    className={`bg-white rounded-2xl p-5 border-2 transition-all cursor-pointer hover:shadow-xl ${selectedTask?.id === task.id && selectedTask?.type === task.type ? 'border-blue-500 shadow-lg ring-4 ring-blue-50' : 'border-transparent shadow-sm'}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${task.type === 'outage_report' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {task.type === 'outage_report' ? <AlertTriangle size={20} /> : <Wrench size={20} />}
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                                    {task.ticket_id || `OUT-${task.id}`}
                                                </div>
                                                <h3 className="font-black text-slate-900 leading-tight">
                                                    {task.service_type || task.outage_type || 'Maintenance Task'}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            {getStatusBadge(task.status)}
                                            <div className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityColor(task.priority)}`}>
                                                {task.priority?.toUpperCase()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-3 text-sm text-slate-600 mb-4">
                                        <div className="flex items-center gap-2"><MapPin size={14} className="text-blue-500" /> {task.address || task.full_address}</div>
                                        <div className="flex items-center gap-2"><User size={14} className="text-blue-500" /> {task.full_name || 'Anonymous Reporter'}</div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center text-[10px] font-bold text-slate-400">
                                                <Clock size={12} className="mr-1" /> {new Date(task.created_at).toLocaleDateString()}
                                            </div>
                                            {task.estimated_time && (
                                                <div className="flex items-center text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
                                                    EST: {task.estimated_time}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-blue-600 font-black text-xs flex items-center gap-1 group">
                                            VIEW DETAILS <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Details & Update Column */}
                    <div className="lg:col-span-5">
                        {selectedTask ? (
                            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 sticky top-8">
                                <div className="bg-slate-900 p-6 text-white">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Task Control Center</span>
                                        <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-white transition-colors">
                                            <XCircle size={20} />
                                        </button>
                                    </div>
                                    <h2 className="text-2xl font-black mb-2">{selectedTask.service_type || selectedTask.outage_type || 'Task Detail'}</h2>
                                    <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                                        <MapPin size={14} /> {selectedTask.address || selectedTask.full_address}
                                    </p>
                                </div>

                                <div className="p-6">
                                    <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase mb-2">Job Description</h4>
                                        <p className="text-slate-700 text-sm leading-relaxed">
                                            {selectedTask.description || selectedTask.details || 'No additional details provided.'}
                                        </p>
                                    </div>

                                    <form onSubmit={handleUpdateTask} className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-black text-slate-500 uppercase mb-2">Update Status</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {statusOptions.map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => setStatus(opt.value)}
                                                        className={`p-3 text-xs font-bold rounded-xl border-2 transition-all ${status === opt.value ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 uppercase mb-2">Estimated Completion</label>
                                                <input
                                                    type="text"
                                                    value={estimatedTime}
                                                    onChange={(e) => setEstimatedTime(e.target.value)}
                                                    placeholder="e.g. 2 hours"
                                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 uppercase mb-2">Proof / Evidence URL</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={evidenceImage}
                                                        onChange={(e) => setEvidenceImage(e.target.value)}
                                                        placeholder="Image URL"
                                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none pl-10"
                                                    />
                                                    <ImageIcon className="absolute left-3 top-3 text-slate-400" size={18} />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black text-slate-500 uppercase mb-2">Technician Field Notes</label>
                                            <textarea
                                                rows="3"
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder="Enter details about the work done or issues encountered..."
                                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => alert('Starting navigation...')}
                                                className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Navigation size={16} /> NAVIGATE
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={updateLoading || status === selectedTask.status}
                                                className={`flex-[2] py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg ${updateLoading || status === selectedTask.status ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-blue-200'}`}
                                            >
                                                {updateLoading ? 'UPDATING...' : <><Save size={16} /> SAVE UPDATE</>}
                                            </button>
                                        </div>
                                    </form>

                                    <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                                        <button className="text-[10px] font-bold text-slate-400 uppercase hover:text-red-600 transition-colors flex items-center gap-1">
                                            <AlertTriangle size={12} /> ESCALATE TO SUPERVISOR
                                        </button>
                                        <button className="text-[10px] font-bold text-blue-600 uppercase hover:underline flex items-center gap-1">
                                            <MessageSquare size={12} /> OPEN CHAT
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center h-[500px]">
                                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                                    <ClipboardList className="text-slate-300" size={48} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2">Select a Task</h3>
                                <p className="text-slate-500 max-w-xs mx-auto text-sm">
                                    Pick a task from the queue to view customer details, get directions, and update the job status.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskList;