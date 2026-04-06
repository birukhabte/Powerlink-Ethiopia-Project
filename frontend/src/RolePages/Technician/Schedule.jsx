import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { Calendar, Clock, MapPin, Tag, Info, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

const Schedule = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/schedule`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                // Map tasks to FullCalendar event format
                const formattedEvents = response.data.schedule.map(item => ({
                    id: item.id,
                    title: item.title,
                    start: item.start,
                    className: `event-${item.type}`,
                    extendedProps: item.extendedProps,
                    backgroundColor: item.type === 'outage' ? '#ef4444' : '#3b82f6',
                    borderColor: 'transparent'
                }));
                setEvents(formattedEvents);
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEventClick = (info) => {
        setSelectedEvent(info.event);
    };

    const handleDateClick = (arg) => {
        console.log('Date clicked:', arg.dateStr);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-4">
            {/* Calendar Main Section */}
            <div className="flex-1 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                            <Calendar className="text-blue-600" size={24} />
                            Task Schedule
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Manage your assigned outages and service requests.</p>
                    </div>
                </div>

                <div className="calendar-container">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        events={events}
                        eventClick={handleEventClick}
                        dateClick={handleDateClick}
                        height="70vh"
                        editable={true}
                        selectable={true}
                        dayMaxEvents={true}
                        eventTimeFormat={{
                            hour: 'numeric',
                            minute: '2-digit',
                            meridiem: 'short'
                        }}
                    />
                </div>
            </div>

            {/* Event Detail Sidebar */}
            <div className="w-full lg:w-96 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 min-h-[400px]">
                    <h2 className="font-bold text-lg mb-6 flex items-center gap-2 text-gray-800 border-b pb-4">
                        <Info className="text-blue-600" size={20} />
                        Task Details
                    </h2>
                    
                    {selectedEvent ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                                    {selectedEvent.title}
                                </h3>
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${selectedEvent.extendedProps?.type === 'outage' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {selectedEvent.extendedProps?.type}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Clock className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                                    <div>
                                        <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Scheduled Time</div>
                                        <div className="text-gray-700 font-medium">
                                            {new Date(selectedEvent.start).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                                    <div>
                                        <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Location</div>
                                        <div className="text-gray-700 font-medium">{selectedEvent.extendedProps?.address || selectedEvent.extendedProps?.full_address || 'Addis Ababa (Default)'}</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Tag className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                                    <div>
                                        <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Status & Priority</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="font-bold text-blue-600 uppercase text-xs px-2 py-1 bg-blue-50 rounded border border-blue-100">
                                                {selectedEvent.extendedProps?.status}
                                            </span>
                                            <span className="font-bold text-orange-600 uppercase text-xs px-2 py-1 bg-orange-50 rounded border border-orange-100">
                                                {selectedEvent.extendedProps?.urgency || selectedEvent.extendedProps?.priority || 'Normal'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <button 
                                    className="w-full bg-blue-600 text-white rounded-xl py-3 font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 mb-3"
                                    onClick={() => alert('Feature coming soon: Updating status')}
                                >
                                    <Clock size={18} /> Update Status
                                </button>
                                <button 
                                    className="w-full bg-gray-50 text-gray-600 rounded-xl py-3 font-bold hover:bg-gray-100 transition-all"
                                    onClick={() => setSelectedEvent(null)}
                                >
                                    Clear Selection
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <Calendar className="text-gray-300 mb-4" size={48} strokeWidth={1} />
                            <p className="text-gray-500 font-medium">Select a task from the calendar to view its details.</p>
                        </div>
                    )}
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl shadow-xl text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle size={24} />
                        <h3 className="font-bold">Next Tasks</h3>
                    </div>
                    <div className="space-y-3">
                        {events.slice(0, 2).map((evt, idx) => (
                           <div key={idx} className="bg-white/10 p-3 rounded-lg backdrop-blur-md">
                               <div className="text-xs font-bold text-blue-100 uppercase opacity-75">{new Date(evt.start).toDateString()}</div>
                               <div className="font-bold truncate">{evt.title}</div>
                           </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .fc .fc-toolbar-title { font-size: 1.25rem !important; font-weight: 800 !important; color: #1f2937 !important; }
                .fc .fc-button-primary { background-color: #3b82f6 !important; border: none !important; border-radius: 8px !important; font-weight: 600 !important; padding: 6px 14px !important; }
                .fc .fc-button-primary:hover { background-color: #2563eb !important; }
                .fc .fc-button-active { background-color: #1d4ed8 !important; }
                .fc-event { cursor: pointer !important; padding: 2px 4px !important; border-radius: 4px !important; }
                .fc .fc-daygrid-day-number { font-weight: 600; color: #4b5563; padding: 8px !important; }
                .fc .fc-col-header-cell-cushion { color: #6b7280; font-weight: 700; padding: 12px !important; }
                .fc-day-today { background: #f0f7ff !important; }
                .calendar-container { overflow-x: auto; }
            `}</style>
        </div>
    );
};

export default Schedule;
