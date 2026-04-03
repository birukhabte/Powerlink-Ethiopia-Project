import React, { useState } from 'react';
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
    Eye
} from 'lucide-react';

const TaskList = () => {
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskStatus, setTaskStatus] = useState('');
    const [tasks, setTasks] = useState([
        {
            id: 'T-00123',
            type: 'Outage Repair',
            location: 'Bole, Street 123',
            customer: 'St. Mary Hospital',
            priority: 'High',
            timeSlot: '10:00 - 12:00',
            status: 'assigned',
            details: 'Complete power outage in ICU wing. Emergency backup engaged.',
            technicianNotes: '',
            assignedDate: 'Today',
            estimatedDuration: '2 hours'
        },
        {
            id: 'T-00124',
            type: 'Meter Installation',
            location: 'Megenagna, Block 5',
            customer: 'Residential - A. Johnson',
            priority: 'Medium',
            timeSlot: '14:00 - 16:00',
            status: 'assigned',
            details: 'New smart meter installation. Customer present on site.',
            technicianNotes: '',
            assignedDate: 'Today',
            estimatedDuration: '1.5 hours'
        },
        {
            id: 'T-00125',
            type: 'Line Maintenance',
            location: 'Kirkos Subcity',
            customer: 'Multiple Residents',
            priority: 'Low',
            timeSlot: 'Tomorrow 08:00 - 10:00',
            status: 'pending',
            details: 'Routine line inspection and maintenance.',
            technicianNotes: '',
            assignedDate: 'Tomorrow',
            estimatedDuration: '2 hours'
        },
    ]);

    const statusOptions = [
        'Traveling to Site',
        'On-site - Assessment',
        'In Progress - Repair',
        'Waiting for Parts',
        'Completed Successfully',
        'Cannot Complete',
        'Escalated to Supervisor'
    ];

    const handleStatusUpdate = (taskId, status) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, status: status.toLowerCase() } : task
        );
        setTasks(updatedTasks);
        setTaskStatus(status);

        // UC-13 Step 5: System notifies supervisor, users, customers
        console.log(`Status updated for ${taskId}: ${status}`);
        console.log('Notifying supervisor, users, and customers...');

        // UC-13 Step 6: Map and reports are updated
        console.log('Updating GIS map and system reports...');

        if (status === 'Cannot Complete') {
            // UC-13 Alternative: Inform supervisor via chat
            alert('Task cannot be completed. Please inform supervisor via chat with reason.');
        }

        if (status === 'Completed Successfully') {
            // Show success message
            setTimeout(() => {
                setSelectedTask(null);
                setTaskStatus('');
            }, 2000);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle className="text-green-500" />;
            case 'cannot_complete': return <XCircle className="text-red-500" />;
            default: return <Clock className="text-yellow-500" />;
        }
    };

    // UC-12 Step 4: If no tasks
    if (tasks.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                    <ClipboardList className="mx-auto text-gray-300 mb-4" size={64} />
                    <h2 className="text-2xl font-bold text-gray-600 mb-2">No Tasks Assigned</h2>
                    <p className="text-gray-500 mb-6">You don't have any tasks assigned at the moment.</p>
                    <p className="text-sm text-gray-400">Your supervisor will assign tasks to you shortly.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                        <ClipboardList className="mr-3" /> My Tasks
                    </h1>
                    <p className="text-gray-600">View and update your assigned tasks</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left: Tasks List */}
                    <div className="lg:col-span-2">
                        {/* UC-12 Step 2: System displays assigned tasks with time slots */}
                        <div className="bg-white rounded-xl shadow p-4 mb-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">Assigned Tasks ({tasks.length})</h2>
                                <div className="text-sm text-gray-600">
                                    Today: {tasks.filter(t => t.assignedDate === 'Today').length} tasks
                                </div>
                            </div>

                            {/* UC-12 Step 3: Technician views tasks and locations */}
                            <div className="space-y-4">
                                {tasks.map(task => (
                                    <div
                                        key={task.id}
                                        className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedTask?.id === task.id ? 'border-blue-500 bg-blue-50' : ''}`}
                                        onClick={() => setSelectedTask(task)}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <div className="font-bold text-gray-800">{task.id}</div>
                                                <h3 className="font-semibold text-lg flex items-center">
                                                    <Wrench className="mr-2" size={18} /> {task.type}
                                                </h3>
                                            </div>
                                            <div className="flex flex-col items-end space-y-2">
                                                <span className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                                                    {task.priority} Priority
                                                </span>
                                                {getStatusIcon(task.status)}
                                            </div>
                                        </div>

                                        <div className="flex items-center text-gray-600 mb-2">
                                            <MapPin size={16} className="mr-2" /> {task.location}
                                        </div>
                                        <div className="flex items-center text-gray-600 mb-2">
                                            <User size={16} className="mr-2" /> {task.customer}
                                        </div>
                                        <div className="flex items-center text-gray-600 mb-3">
                                            <Clock size={16} className="mr-2" /> {task.timeSlot}
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="text-sm text-gray-500">{task.assignedDate}</div>
                                            <div className="flex items-center text-blue-600">
                                                View Details <ChevronRight size={16} className="ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {tasks.filter(t => t.assignedDate === 'Today').length}
                                </div>
                                <div className="text-gray-600">Today's Tasks</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow text-center">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {tasks.filter(t => t.status === 'assigned' || t.status === 'pending').length}
                                </div>
                                <div className="text-gray-600">Pending</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {tasks.filter(t => t.status === 'completed').length}
                                </div>
                                <div className="text-gray-600">Completed</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Task Details & Status Update */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow p-6 sticky top-6">
                            {selectedTask ? (
                                <>
                                    {/* UC-13 Step 2: System displays task details */}
                                    <h2 className="text-xl font-bold mb-4">Task Details</h2>
                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <div className="text-sm text-gray-600">Task ID</div>
                                            <div className="font-bold">{selectedTask.id}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Location</div>
                                            <div className="font-medium flex items-center">
                                                <MapPin size={16} className="mr-2" /> {selectedTask.location}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Customer</div>
                                            <div className="font-medium">{selectedTask.customer}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Time Slot</div>
                                            <div className="font-medium flex items-center">
                                                <Clock size={16} className="mr-2" /> {selectedTask.timeSlot}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Details</div>
                                            <div className="text-gray-700 bg-gray-50 p-3 rounded">
                                                {selectedTask.details}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Estimated Duration</div>
                                            <div className="font-medium">{selectedTask.estimatedDuration}</div>
                                        </div>
                                    </div>

                                    {/* UC-13 Step 3: Technician fills in task status/progress */}
                                    <div className="mb-6">
                                        <label className="block mb-2 font-bold">Update Task Status</label>
                                        <select
                                            value={taskStatus}
                                            onChange={(e) => setTaskStatus(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                                        >
                                            <option value="">Select Status</option>
                                            {statusOptions.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>

                                        {/* UC-13 Step 4: Technician submits update */}
                                        <button
                                            onClick={() => handleStatusUpdate(selectedTask.id, taskStatus)}
                                            disabled={!taskStatus}
                                            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center ${!taskStatus ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                                        >
                                            Update Status
                                        </button>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="space-y-3">
                                        <button className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center">
                                            <Navigation className="mr-2" /> Get Directions
                                        </button>
                                        <button className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center">
                                            <Eye className="mr-2" /> View Customer History
                                        </button>
                                        <button
                                            onClick={() => alert('Opening chat with supervisor...')}
                                            className="w-full py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center"
                                        >
                                            <MessageSquare className="mr-2" /> Chat with Supervisor
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <ClipboardList className="mx-auto text-gray-300 mb-4" size={48} />
                                    <h3 className="text-xl font-bold text-gray-600 mb-2">Select a Task</h3>
                                    <p className="text-gray-500">Choose a task from the list to view details and update status</p>
                                </div>
                            )}
                        </div>

                        {/* Tools & Resources */}
                        <div className="bg-white rounded-xl shadow p-6 mt-6">
                            <h3 className="font-bold mb-4">Quick Tools</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                                    <Calendar className="mx-auto mb-2" />
                                    <div className="text-sm">Schedule</div>
                                </button>
                                <button className="p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                                    <Upload className="mx-auto mb-2" />
                                    <div className="text-sm">Upload Photos</div>
                                </button>
                                <button className="p-3 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100">
                                    <AlertTriangle className="mx-auto mb-2" />
                                    <div className="text-sm">Safety Check</div>
                                </button>
                                <button className="p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100">
                                    <MessageSquare className="mx-auto mb-2" />
                                    <div className="text-sm">Chat</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskList;