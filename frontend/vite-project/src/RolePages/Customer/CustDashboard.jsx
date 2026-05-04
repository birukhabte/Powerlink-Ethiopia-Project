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
    Target
} from 'lucide-react';
import GISMap from '../../components/SimpleGISMap';
import { API_ENDPOINTS } from '../../config/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const context = useOutletContext() || {};
    const { showOutageForm = false, setShowOutageForm = () => {}, showMap = false, setShowMap = () => {} } = context;
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const [outageData, setOutageData] = useState({
        location: '',
        coordinates: null,
        outageType: 'complete',
        reason: '',
        description: '',
        estimatedAffected: 'household',
        urgency: 'medium'
    });

    // Sample existing outages for the map
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

    const outageTypes = [
        'Complete Power Outage',
        'Partial/Flickering',
        'Low Voltage',
        'High Voltage',
        'Transformer Issue',
        'Line Damage'
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
        // If we're in the outage form, switch back to it
        if (showOutageForm) {
            setShowMap(false);
        }
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

    const handleSubmitOutage = async (e) => {
        e.preventDefault();
        const newErrors = {};

        // Validation
        if (!outageData.location) newErrors.location = 'Location is required';
        if (!outageData.reason) newErrors.reason = 'Reason is required';
        if (!outageData.description) newErrors.description = 'Description is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            // Prepare outage report data
            const outageReport = {
                title: `Power Outage - ${outageData.location}`,
                description: outageData.description,
                outage_type: outageData.outageType,
                urgency: outageData.urgency,
                latitude: outageData.coordinates?.lat || null,
                longitude: outageData.coordinates?.lng || null,
                address: outageData.location,
                estimated_affected: outageData.estimatedAffected,
                reason: outageData.reason,
                reported_by: 1 // Replace with actual user ID from auth
            };

            // Submit to backend
            const response = await fetch(API_ENDPOINTS.outages.base, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(outageReport)
            });

            const data = await response.json();

            if (data.success) {
                // Create local ticket for immediate display
                const ticketId = `OUT-${new Date().getFullYear()}-${String(data.outage.id).padStart(5, '0')}`;
                const newTicket = {
                    id: ticketId,
                    title: `Power Outage - ${outageData.location}`,
                    status: 'pending',
                    created: new Date().toLocaleString(),
                    location: outageData.location,
                    description: outageData.description,
                    technician: 'Not assigned',
                    priority: outageData.urgency.charAt(0).toUpperCase() + outageData.urgency.slice(1),
                    coordinates: outageData.coordinates,
                    updates: [
                        { time: new Date().toLocaleTimeString(), message: 'Outage reported' }
                    ]
                };

                // Save to localStorage
                const existingTickets = JSON.parse(localStorage.getItem('powerlink_tickets') || '[]');
                localStorage.setItem('powerlink_tickets', JSON.stringify([newTicket, ...existingTickets]));

                setSubmitted(true);
                setErrors({});

                // Reset form after 3 seconds
                setTimeout(() => {
                    setShowOutageForm(false);
                    setSubmitted(false);
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
            } else {
                alert('Error submitting outage report: ' + data.error);
            }
        } catch (error) {
            console.error('Error submitting outage:', error);
            alert('Failed to submit outage report. Please try again.');
        }
    };

    return (
        <>
            {!showOutageForm && !showMap && (
                <>
                    {/* Dashboard Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow">
                            <div className="text-2xl font-bold text-green-600">Active</div>
                            <div className="text-gray-600">Power Status</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow">
                            <div className="text-2xl font-bold">2</div>
                            <div className="text-gray-600">Open Tickets</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow">
                            <div className="text-2xl font-bold">5</div>
                            <div className="text-gray-600">Resolved Issues</div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => setShowOutageForm(true)}
                                className="p-4 border-2 border-red-200 bg-red-50 rounded-lg flex items-center hover:bg-red-100 cursor-pointer"
                            >
                                <AlertTriangle className="text-red-600 mr-3" />
                                <div>
                                    <div className="font-bold">Report Outage</div>
                                    <div className="text-sm text-gray-600">Report power interruption</div>
                                </div>
                            </button>

                            <button
                                onClick={() => setShowMap(true)}
                                className="p-4 border-2 border-blue-200 bg-blue-50 rounded-lg flex items-center hover:bg-blue-100 cursor-pointer"
                            >
                                <Map className="text-blue-600 mr-3" />
                                <div>
                                    <div className="font-bold">View Outage Map</div>
                                    <div className="text-sm text-gray-600">Real-time outage locations</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Outage Reporting Form */}
            {showOutageForm && (
                <div className="bg-white rounded-xl shadow p-6 max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold flex items-center">
                            <AlertTriangle className="text-red-600 mr-3" />
                            Report Power Outage
                        </h2>
                        <button onClick={() => setShowOutageForm(false)} className="cursor-pointer">
                            <XCircle className="text-gray-400" />
                        </button>
                    </div>

                    {submitted ? (
                        <div className="text-center py-12">
                            <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
                            <h3 className="text-2xl font-bold mb-2">Outage Reported Successfully!</h3>
                            <p className="text-gray-600 mb-4">Ticket #OUT-2024-00123 has been created.</p>
                            <p className="text-sm text-gray-500">GIS map updated. Our team will respond shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitOutage} className="space-y-6">
                            {/* Location */}
                            <div>
                                <label className="block mb-2 font-medium">
                                    <MapPin className="inline mr-2" size={18} />
                                    Location *
                                </label>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={outageData.location}
                                        onChange={(e) => setOutageData({ ...outageData, location: e.target.value })}
                                        placeholder="Enter your address or select from map"
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowMap(true)}
                                            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                        >
                                            <Map className="mr-1" size={16} />
                                            Select from Map
                                        </button>
                                        <button
                                            type="button"
                                            onClick={getCurrentLocation}
                                            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                        >
                                            <Navigation className="mr-1" size={16} />
                                            Use Current Location
                                        </button>
                                    </div>
                                    {outageData.coordinates && (
                                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                            <Target className="inline mr-1" size={14} />
                                            Coordinates: {outageData.coordinates.lat.toFixed(6)}, {outageData.coordinates.lng.toFixed(6)}
                                        </div>
                                    )}
                                </div>
                                {errors.location && (
                                    <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                                )}
                            </div>

                            {/* Outage Type & Urgency */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2 font-medium">Outage Type *</label>
                                    <select
                                        value={outageData.outageType}
                                        onChange={(e) => setOutageData({ ...outageData, outageType: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    >
                                        {outageTypes.map((type, idx) => (
                                            <option key={idx} value={type.toLowerCase()}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        <AlertTriangle className="inline mr-2" size={18} />
                                        Urgency Level
                                    </label>
                                    <select
                                        value={outageData.urgency}
                                        onChange={(e) => setOutageData({ ...outageData, urgency: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    >
                                        <option value="low">Low (Not urgent)</option>
                                        <option value="medium">Medium (Standard)</option>
                                        <option value="high">High (Critical)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="block mb-2 font-medium">Reason (if known)</label>
                                <input
                                    type="text"
                                    value={outageData.reason}
                                    onChange={(e) => setOutageData({ ...outageData, reason: e.target.value })}
                                    placeholder="e.g., Storm, accident, equipment failure"
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                                {errors.reason && (
                                    <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block mb-2 font-medium">Description *</label>
                                <textarea
                                    rows="4"
                                    value={outageData.description}
                                    onChange={(e) => setOutageData({ ...outageData, description: e.target.value })}
                                    placeholder="Describe the issue in detail..."
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                )}
                            </div>

                            {/* Affected Area */}
                            <div>
                                <label className="block mb-2 font-medium">
                                    <Users className="inline mr-2" size={18} />
                                    Estimated Affected Area
                                </label>
                                <select
                                    value={outageData.estimatedAffected}
                                    onChange={(e) => setOutageData({ ...outageData, estimatedAffected: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                >
                                    <option value="household">Just my household</option>
                                    <option value="street">My street/neighborhood</option>
                                    <option value="multiple">Multiple streets</option>
                                    <option value="area">Entire area/sector</option>
                                </select>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold text-lg cursor-pointer"
                            >
                                Submit Outage Report
                            </button>
                        </form>
                    )}
                </div>
            )}

            {/* GIS Map View */}
            {showMap && (
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold flex items-center">
                            <Map className="text-blue-600 mr-3" />
                            Interactive Outage Map
                        </h2>
                        <button onClick={() => setShowMap(false)} className="cursor-pointer">
                            <XCircle className="text-gray-400" />
                        </button>
                    </div>

                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">How to use the map:</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• <strong>Red markers:</strong> Existing power outages</li>
                            <li>• <strong>Blue marker:</strong> Your current location (if available)</li>
                            <li>• <strong>Green marker:</strong> Selected location for your report</li>
                            <li>• <strong>Click anywhere</strong> on the map to select that location</li>
                        </ul>
                    </div>

                    <GISMap
                        onLocationSelect={handleLocationSelect}
                        selectedLocation={outageData.coordinates ? [outageData.coordinates.lat, outageData.coordinates.lng] : null}
                        existingOutages={existingOutages}
                        height="500px"
                    />

                    {outageData.location && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg">
                            <h4 className="font-semibold text-green-800">Selected Location:</h4>
                            <p className="text-green-700">{outageData.location}</p>
                            {showOutageForm && (
                                <button
                                    onClick={() => setShowMap(false)}
                                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Use This Location for Report
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Dashboard;
