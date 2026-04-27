import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { MapPin, Info, Navigation, Search } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ServiceMap = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [mapCenter, setMapCenter] = useState([9.0192, 38.7525]); // Default to Addis Ababa

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/schedule`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                // Filter only tasks that have coordinates
                const tasksWithCoords = response.data.schedule.filter(t => {
                    // For outages, coordinates are in extendedProps
                    if (t.type === 'outage') {
                        return t.extendedProps.latitude && t.extendedProps.longitude;
                    }
                    // For service requests, coordinates are directly in extendedProps
                    return t.extendedProps.latitude && t.extendedProps.longitude;
                });
                setTasks(tasksWithCoords);
                if (tasksWithCoords.length > 0) {
                    // Use the first task's coordinates as center
                    const firstTask = tasksWithCoords[0];
                    const lat = parseFloat(firstTask.extendedProps.latitude);
                    const lng = parseFloat(firstTask.extendedProps.longitude);
                    setMapCenter([lat, lng]);
                }
            }
        } catch (error) {
            console.error('Error fetching tasks for map:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.extendedProps.address && task.extendedProps.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const ChangeView = ({ center }) => {
        const map = useMap();
        map.setView(center, map.getZoom());
        return null;
    };

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col md:flex-row gap-4">
            {/* Sidebar List */}
            <div className="w-full md:w-80 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100 italic font-medium text-gray-500">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">No tasks with location found.</div>
                    ) : (
                        filteredTasks.map((task) => (
                            <div
                                key={task.id}
                                className="p-4 border-b border-gray-50 hover:bg-blue-50 transition-colors cursor-pointer"
                                onClick={() => setMapCenter([parseFloat(task.extendedProps.latitude), parseFloat(task.extendedProps.longitude)])}
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-800 text-sm">{task.title}</h3>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${task.type === 'outage' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {task.type}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 flex items-center mt-2">
                                    <MapPin size={12} className="mr-1" /> {task.extendedProps.address || 'Address not listed'}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative">
                <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <ChangeView center={mapCenter} />
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {filteredTasks.map((task) => (
                        <Marker
                            key={task.id}
                            position={[parseFloat(task.extendedProps.latitude), parseFloat(task.extendedProps.longitude)]}
                        >
                            <Popup>
                                <div className="p-1">
                                    <h3 className="font-bold text-gray-800 border-b pb-1 mb-2">{task.title}</h3>
                                    <div className="space-y-2 text-sm">
                                        <p className="flex items-center text-gray-600">
                                            <Info size={14} className="mr-2" /> {task.extendedProps.description || 'No description'}
                                        </p>
                                        <p className="flex items-center text-gray-600 font-medium">
                                            Status: <span className="ml-2 text-blue-600 uppercase font-bold">{task.extendedProps.status}</span>
                                        </p>
                                        <button
                                            className="w-full mt-3 flex items-center justify-center bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition-colors gap-2"
                                            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${task.extendedProps.latitude},${task.extendedProps.longitude}`, '_blank')}
                                        >
                                            <Navigation size={14} /> Get Directions
                                        </button>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default ServiceMap;
