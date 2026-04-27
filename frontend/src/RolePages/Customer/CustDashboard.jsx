import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
    FileText,
    Map,
    AlertTriangle,
    MapPin,
    Users,
    CheckCircle,
    XCircle,
    Navigation,
    Target,
    Zap,
    ChevronRight,
    Search,
    Send
} from 'lucide-react';
import GISMap from '../../components/SimpleGISMap';
import { API_ENDPOINTS } from '../../config/api';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const { showOutageForm, setShowOutageForm, showMap, setShowMap } = useOutletContext();
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);

    const [outageData, setOutageData] = useState({
        location: '',
        coordinates: null,
        outageType: 'complete',
        reason: '',
        description: '',
        estimatedAffected: 'household',
        urgency: 'medium'
    });

    const outageTypes = [
        { label: 'Complete Power Outage', value: 'complete' },
        { label: 'Partial/Flickering', value: 'partial' },
        { label: 'Low Voltage', value: 'low_voltage' },
        { label: 'Transformer Issue', value: 'transformer' },
        { label: 'Line Damage', value: 'line_damage' }
    ];

    const getCurrentLocation = () => {
        console.log('Attempting to get current location...');
        console.log('Geolocation supported:', !!navigator.geolocation);
        console.log('Protocol:', window.location.protocol);
        console.log('Hostname:', window.location.hostname);

        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser. Please update your browser or use a different device.');
            return;
        }

        // Check if we're in a secure context (HTTPS) - allow localhost for development
        if (window.location.protocol !== 'https:' &&
            window.location.hostname !== 'localhost' &&
            window.location.hostname !== '127.0.0.1') {
            alert('Location services work best with a secure connection (HTTPS). For development, localhost is allowed. If you\'re having issues, try enabling location permissions in your browser.');
        }

        console.log('Requesting geolocation...');
        setGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                console.log('Geolocation success:', position);
                const { latitude, longitude } = position.coords;
                setOutageData(prev => ({
                    ...prev,
                    coordinates: { lat: latitude, lng: longitude }
                }));

                try {
                    // Reverse geocoding for a user-friendly address
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    setOutageData(prev => ({
                        ...prev,
                        location: data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                    }));
                } catch (e) {
                    console.error('Reverse geocoding failed:', e);
                    setOutageData(prev => ({ ...prev, location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }));
                } finally {
                    setGettingLocation(false);
                }
            },
            (error) => {
                setGettingLocation(false);
                console.error('Geolocation error:', error);

                // Provide specific error messages based on error code
                let errorMessage = 'Failed to get location. ';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Location access was denied. Please enable location permissions in your browser settings and try again.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable. Please check that location services are enabled on your device.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out. Please try again.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred. Please try again or enter your location manually.';
                        break;
                }

                alert(errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000, // 15 seconds timeout
                maximumAge: 60000 // Accept cached position up to 1 minute old
            }
        );
    };

    const handleSubmitOutage = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!outageData.location) return setErrors({ location: 'Required' });
        if (!outageData.description) return setErrors({ description: 'Required' });

        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            const token = localStorage.getItem('token');

            const payload = {
                title: `${outageData.outageType.toUpperCase()} - ${outageData.location.split(',')[0]}`,
                description: outageData.description,
                outage_type: outageData.outageType,
                urgency: outageData.urgency,
                latitude: outageData.coordinates?.lat,
                longitude: outageData.coordinates?.lng,
                address: outageData.location,
                estimated_affected: outageData.estimatedAffected,
                reason: outageData.reason,
                reported_by: user?.id
            };

            const response = await axios.post(API_ENDPOINTS.outages.base, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setSubmitted(true);
                setTimeout(() => {
                    setShowOutageForm(false);
                    setSubmitted(false);
                    navigate('/ticket');
                }, 3000);
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('Failed to report outage');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {!showOutageForm && !showMap && (
                <>
                    <header className="mb-10">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">CUSTOMER CONSOLE</h1>
                        <p className="text-slate-500 font-medium">Report issues and manage your electricity services</p>
                    </header>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex items-center justify-between group">
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grid Status</div>
                                <div className="text-2xl font-black text-emerald-500 flex items-center gap-2">
                                    <Zap size={20} /> ACTIVE
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                <CheckCircle size={24} />
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/ticket')}>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Tickets</div>
                            <div className="text-3xl font-black text-slate-900">02</div>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Safety Alerts</div>
                            <div className="text-3xl font-black text-slate-900">0</div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <button onClick={() => setShowOutageForm(true)} className="relative overflow-hidden bg-white p-8 rounded-[2rem] border-2 border-red-50 shadow-xl shadow-red-100 text-left group hover:border-red-500 transition-all">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform">
                                <AlertTriangle size={120} />
                            </div>
                            <div className="bg-red-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-red-200">
                                <AlertTriangle size={28} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2 italic tracking-tighter">REPORT POWER OUTAGE</h3>
                            <p className="text-slate-500 font-medium mb-4">Let our field teams know about interruptions in your area.</p>
                            <div className="flex items-center text-red-600 font-black text-xs">
                                START REPORT <ChevronRight size={16} />
                            </div>
                        </button>

                        <button onClick={() => setShowMap(true)} className="relative overflow-hidden bg-white p-8 rounded-[2rem] border-2 border-blue-50 shadow-xl shadow-blue-100 text-left group hover:border-blue-500 transition-all">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform">
                                <Map size={120} />
                            </div>
                            <div className="bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-200">
                                <Map size={28} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2 italic tracking-tighter">VISUALIZE GRID MAP</h3>
                            <p className="text-slate-500 font-medium mb-4">Real-time view of reported outages and repair progress.</p>
                            <div className="flex items-center text-blue-600 font-black text-xs">
                                OPEN GIS MAP <ChevronRight size={16} />
                            </div>
                        </button>
                    </div>
                </>
            )}

            {showOutageForm && (
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 max-w-2xl mx-auto border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-amber-500 to-red-500"></div>
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter flex items-center gap-3">
                            <AlertTriangle className="text-red-600" size={32} /> EMERGENCY REPORT
                        </h2>
                        <button onClick={() => setShowOutageForm(false)} className="bg-slate-50 p-2 rounded-full hover:bg-slate-100 transition-colors">
                            <XCircle className="text-slate-400" />
                        </button>
                    </div>

                    {submitted ? (
                        <div className="text-center py-16">
                            <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                                <CheckCircle className="text-emerald-500" size={48} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-2">REPORT LOGGED</h3>
                            <p className="text-slate-500 font-bold mb-4 uppercase tracking-widest text-xs">Dispatching field team soon</p>
                            <p className="text-slate-400 text-sm">Redirecting to tracking console...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitOutage} className="space-y-8">
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                    <h4 className="font-black text-slate-900 text-sm tracking-widest uppercase">Location Intelligence</h4>
                                    <button type="button" onClick={getCurrentLocation} disabled={gettingLocation} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${gettingLocation ? 'bg-slate-200 text-slate-400' : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-100'}`}>
                                        {gettingLocation ? 'FETCHING GPS...' : <><Navigation size={14} /> USE PRECISE LOCATION</>}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const lat = prompt('Enter latitude (e.g., 9.1450):');
                                            const lng = prompt('Enter longitude (e.g., 38.7521):');
                                            if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                                                setOutageData(prev => ({
                                                    ...prev,
                                                    coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
                                                    location: `${parseFloat(lat).toFixed(6)}, ${parseFloat(lng).toFixed(6)}`
                                                }));
                                            }
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                                    >
                                        <MapPin size={14} /> ENTER COORDINATES
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <input type="text" value={outageData.location} onChange={(e) => setOutageData({ ...outageData, location: e.target.value })} placeholder="Enter your address..." className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-50 pl-12 text-sm font-medium" />
                                        <MapPin className="absolute left-4 top-4 text-red-500" size={20} />
                                    </div>
                                    {outageData.coordinates && (
                                        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 text-[10px] font-black uppercase flex items-center gap-2">
                                            <Target size={14} /> GPS SYNCED: {outageData.coordinates.lat.toFixed(6)}, {outageData.coordinates.lng.toFixed(6)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Incident Category</label>
                                    <select value={outageData.outageType} onChange={(e) => setOutageData({ ...outageData, outageType: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-red-50 text-sm font-bold">
                                        {outageTypes.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Urgency Level</label>
                                    <select value={outageData.urgency} onChange={(e) => setOutageData({ ...outageData, urgency: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-red-50 text-sm font-bold">
                                        <option value="low">Standard Priority</option>
                                        <option value="medium">Intermediate</option>
                                        <option value="high">Critical / Dangerous</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Context & Description</label>
                                <textarea rows="4" value={outageData.description} onChange={(e) => setOutageData({ ...outageData, description: e.target.value })} placeholder="E.g. Sparking on line, pole leaning, entire neighborhood dark..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-red-50 text-sm" />
                            </div>

                            <button type="submit" disabled={loading} className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 ${loading ? 'bg-slate-100 text-slate-400' : 'bg-red-600 text-white hover:bg-red-700 shadow-red-100 active:scale-95'}`}>
                                {loading ? 'TRANSMITTING...' : <><Send size={24} /> BROADCAST OUTAGE</>}
                            </button>
                        </form>
                    )}
                </div>
            )}

            {showMap && (
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter flex items-center gap-3">
                            <Map className="text-blue-600" size={32} /> LIVE GRID INTELLIGENCE
                        </h2>
                        <button onClick={() => setShowMap(false)} className="bg-slate-50 p-2 rounded-full hover:bg-slate-100">
                            <XCircle className="text-slate-400" />
                        </button>
                    </div>

                    <div className="rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-inner">
                        <GISMap height="500px" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
