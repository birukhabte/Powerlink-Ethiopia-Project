import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MapPin, Navigation, Map, CheckCircle } from 'lucide-react';
import GoogleMapsOutage from '../../components/GoogleMapsOutage';

const ReportOutage = () => {
    const { darkMode } = useOutletContext() || { darkMode: true };
    const [showMap, setShowMap] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [step, setStep] = useState(1);

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
        { value: 'complete', label: 'Complete Power Outage', icon: '⚫' },
        { value: 'partial', label: 'Partial/Flickering', icon: '⚡' },
        { value: 'low_voltage', label: 'Low Voltage', icon: '📉' },
        { value: 'high_voltage', label: 'High Voltage', icon: '📈' },
        { value: 'transformer', label: 'Transformer Issue', icon: '🔧' },
        { value: 'line_damage', label: 'Line Damage', icon: '🌳' }
    ];

    const existingOutages = [
        {
            lat: 9.0320,
            lng: 38.7469,
            type: 'Complete Outage',
            status: 'In Progress',
            reportedAt: '2 hours ago',
            description: 'Transformer failure affecting entire block'
        },
        {
            lat: 9.0250,
            lng: 38.7500,
            type: 'Partial Outage',
            status: 'Pending',
            reportedAt: '30 minutes ago',
            description: 'Flickering lights reported'
        },
        {
            lat: 9.0400,
            lng: 38.7400,
            type: 'Line Damage',
            status: 'Resolved',
            reportedAt: '1 day ago',
            description: 'Tree fell on power lines'
        }
    ];

    const handleLocationSelect = (locationData) => {
        setOutageData({
            ...outageData,
            location: locationData.address,
            coordinates: {
                lat: locationData.lat,
                lng: locationData.lng
            }
        });
        setShowMap(false);
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
                        );
                        const data = await response.json();
                        const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                        
                        setOutageData({
                            ...outageData,
                            location: address,
                            coordinates: { lat, lng }
                        });
                    } catch (error) {
                        console.error('Error getting address:', error);
                        setOutageData({
                            ...outageData,
                            location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                            coordinates: { lat, lng }
                        });
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to get your current location. Please select manually on the map.');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const handleSubmitOutage = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!outageData.location) newErrors.location = 'Location is required';
        if (!outageData.reason) newErrors.reason = 'Reason is required';
        if (!outageData.description) newErrors.description = 'Description is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const ticketId = `OUT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;

        console.log('Outage reported:', { ...outageData, ticketId });
        setSubmitted(true);
        setErrors({});

        setTimeout(() => {
            setSubmitted(false);
            setStep(1);
            setOutageData({
                location: '',
                coordinates: null,
                outageType: 'complete',
                reason: '',
                description: '',
                estimatedAffected: 'household',
                urgency: 'medium'
            });
        }, 3000);
    };

    if (submitted) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'} flex items-center justify-center p-6`}>
                <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-12 max-w-md w-full text-center border shadow-xl`}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                        <CheckCircle className={`${darkMode ? 'text-green-400' : 'text-green-600'}`} size={32} />
                    </div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Report Submitted!
                    </h2>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                        Your outage report has been received. Our team will respond shortly.
                    </p>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'} mb-4`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Ticket ID</p>
                        <p className={`text-lg font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                            OUT-2024-{String(Math.floor(Math.random() * 100000)).padStart(5, '0')}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (showMap) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'} p-6`}>
                <div className="max-w-5xl mx-auto">
                    <div className="mb-6">
                        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                            Select Location on Map
                        </h1>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            Click on the map to select your location
                        </p>
                    </div>

                    <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border overflow-hidden`}>
                        <GoogleMapsOutage
                            onLocationSelect={handleLocationSelect}
                            selectedLocation={outageData.coordinates ? [outageData.coordinates.lat, outageData.coordinates.lng] : null}
                            existingOutages={existingOutages}
                            height="500px"
                            darkMode={darkMode}
                        />
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={() => setShowMap(false)}
                                className={`flex-1 py-3 rounded-lg font-medium transition ${darkMode ? 'bg-[#141b2d] text-gray-300 hover:bg-[#0f1419]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setShowMap(false)}
                                disabled={!outageData.location}
                                className={`flex-1 py-3 rounded-lg font-medium transition ${outageData.location ? (darkMode ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:opacity-90' : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:opacity-90') : (darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')}`}
                            >
                                Confirm Location
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'} p-6`}>
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Report Power Outage
                    </h1>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        Help us respond quickly to power interruptions
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex gap-4 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex-1">
                            <div className={`h-2 rounded-full transition ${s <= step ? (darkMode ? 'bg-gradient-to-r from-cyan-600 to-blue-600' : 'bg-gradient-to-r from-blue-600 to-blue-500') : (darkMode ? 'bg-gray-700' : 'bg-gray-300')}`}></div>
                            <p className={`text-xs mt-2 ${s <= step ? (darkMode ? 'text-cyan-400' : 'text-blue-600') : (darkMode ? 'text-gray-500' : 'text-gray-500')}`}>
                                {s === 1 ? 'Location' : s === 2 ? 'Details' : 'Confirm'}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmitOutage} className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-8 border space-y-8`}>
                    {/* Step 1: Location */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <label className={`block text-sm font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    <MapPin size={18} className={darkMode ? 'text-cyan-400' : 'text-blue-600'} />
                                    Where is the outage?
                                </label>
                                <input
                                    type="text"
                                    value={outageData.location}
                                    onChange={(e) => setOutageData({ ...outageData, location: e.target.value })}
                                    placeholder="Enter your address"
                                    className={`w-full p-4 border rounded-xl ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                />
                                {errors.location && <p className="text-red-500 text-sm mt-2">{errors.location}</p>}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowMap(true)}
                                    className={`flex-1 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${darkMode ? 'bg-[#141b2d] text-cyan-400 hover:bg-[#0f1419]' : 'bg-gray-100 text-blue-600 hover:bg-gray-200'}`}
                                >
                                    <Map size={18} /> Select on Map
                                </button>
                                <button
                                    type="button"
                                    onClick={getCurrentLocation}
                                    className={`flex-1 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${darkMode ? 'bg-[#141b2d] text-green-400 hover:bg-[#0f1419]' : 'bg-gray-100 text-green-600 hover:bg-gray-200'}`}
                                >
                                    <Navigation size={18} /> Use GPS
                                </button>
                            </div>

                            {outageData.coordinates && (
                                <div className={`p-4 rounded-xl ${darkMode ? 'bg-[#141b2d] border border-cyan-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                                    <p className={`text-sm ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                                        ✓ Location selected: {outageData.location}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Details */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <label className={`block text-sm font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    What type of outage?
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {outageTypes.map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => setOutageData({ ...outageData, outageType: type.value })}
                                            className={`p-4 rounded-xl border-2 transition text-left ${
                                                outageData.outageType === type.value
                                                    ? darkMode
                                                        ? 'border-cyan-400 bg-cyan-400/10'
                                                        : 'border-blue-500 bg-blue-50'
                                                    : darkMode
                                                        ? 'border-gray-700 hover:border-cyan-400/50'
                                                        : 'border-gray-300 hover:border-blue-400'
                                            }`}
                                        >
                                            <div className="text-xl mb-1">{type.icon}</div>
                                            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {type.label}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Urgency Level
                                </label>
                                <select
                                    value={outageData.urgency}
                                    onChange={(e) => setOutageData({ ...outageData, urgency: e.target.value })}
                                    className={`w-full p-4 border rounded-xl ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                >
                                    <option value="low">Low - Not urgent</option>
                                    <option value="medium">Medium - Standard</option>
                                    <option value="high">High - Critical</option>
                                </select>
                            </div>

                            <div>
                                <label className={`block text-sm font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Reason (if known)
                                </label>
                                <input
                                    type="text"
                                    value={outageData.reason}
                                    onChange={(e) => setOutageData({ ...outageData, reason: e.target.value })}
                                    placeholder="e.g., Storm, accident, equipment failure"
                                    className={`w-full p-4 border rounded-xl ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                />
                                {errors.reason && <p className="text-red-500 text-sm mt-2">{errors.reason}</p>}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Description */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div>
                                <label className={`block text-sm font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Describe the issue
                                </label>
                                <textarea
                                    rows="5"
                                    value={outageData.description}
                                    onChange={(e) => setOutageData({ ...outageData, description: e.target.value })}
                                    placeholder="Provide details about the outage..."
                                    className={`w-full p-4 border rounded-xl ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
                            </div>

                            <div>
                                <label className={`block text-sm font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Affected Area
                                </label>
                                <select
                                    value={outageData.estimatedAffected}
                                    onChange={(e) => setOutageData({ ...outageData, estimatedAffected: e.target.value })}
                                    className={`w-full p-4 border rounded-xl ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                >
                                    <option value="household">Just my household</option>
                                    <option value="street">My street/neighborhood</option>
                                    <option value="multiple">Multiple streets</option>
                                    <option value="area">Entire area/sector</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-gray-700">
                        <button
                            type="button"
                            onClick={() => setStep(Math.max(1, step - 1))}
                            disabled={step === 1}
                            className={`flex-1 py-3 rounded-xl font-medium transition ${step === 1 ? (darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed') : (darkMode ? 'bg-[#141b2d] text-gray-300 hover:bg-[#0f1419]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}`}
                        >
                            Back
                        </button>
                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={() => setStep(step + 1)}
                                disabled={step === 1 && !outageData.location}
                                className={`flex-1 py-3 rounded-xl font-medium transition ${(step === 1 && !outageData.location) ? (darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed') : (darkMode ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:opacity-90' : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:opacity-90')}`}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className={`flex-1 py-3 rounded-xl font-medium transition ${darkMode ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:opacity-90' : 'bg-gradient-to-r from-red-600 to-orange-500 text-white hover:opacity-90'}`}
                            >
                                Submit Report
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportOutage;
