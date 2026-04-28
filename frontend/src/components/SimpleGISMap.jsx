import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Target, AlertTriangle } from 'lucide-react';

const SimpleGISMap = ({ onLocationSelect, selectedLocation, existingOutages = [] }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCoords, setSelectedCoords] = useState(selectedLocation);
  const [mapCenter, setMapCenter] = useState({ lat: 9.0320, lng: 38.7469 }); // Addis Ababa

  // Major landmarks and areas in Addis Ababa
  const landmarks = [
    { name: 'Bole', lat: 9.0054, lng: 38.7636, type: 'area' },
    { name: 'Piazza', lat: 9.0320, lng: 38.7469, type: 'area' },
    { name: 'Merkato', lat: 9.0320, lng: 38.7200, type: 'area' },
    { name: 'Meskel Square', lat: 9.0120, lng: 38.7636, type: 'landmark' },
    { name: 'Bole Airport', lat: 8.9779, lng: 38.7993, type: 'landmark' },
    { name: 'Arat Kilo', lat: 9.0350, lng: 38.7600, type: 'area' },
    { name: 'Kazanchis', lat: 9.0200, lng: 38.7700, type: 'area' },
    { name: 'CMC', lat: 9.0100, lng: 38.7400, type: 'area' },
    { name: 'Megenagna', lat: 9.0150, lng: 38.7900, type: 'area' },
    { name: 'Lebu', lat: 9.0500, lng: 38.7200, type: 'area' },
    { name: 'Gerji', lat: 9.0400, lng: 38.7800, type: 'area' },
    { name: 'Kality', lat: 8.9500, lng: 38.7300, type: 'area' }
  ];

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(coords);
          setMapCenter(coords);
        },
        (error) => {
          console.log('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleMapClick = async (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert pixel coordinates to lat/lng (simplified calculation)
    const mapWidth = rect.width;
    const mapHeight = rect.height;
    
    // Simple coordinate calculation (this is a basic approximation)
    const lat = mapCenter.lat + ((mapHeight / 2 - y) / mapHeight) * 0.1;
    const lng = mapCenter.lng + ((x - mapWidth / 2) / mapWidth) * 0.1;
    
    const coords = { lat, lng };
    setSelectedCoords(coords);
    
    // Get address from coordinates
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      
      onLocationSelect({
        coordinates: [lat, lng],
        address: address,
        lat: lat,
        lng: lng
      });
    } catch (error) {
      console.error('Error getting address:', error);
      onLocationSelect({
        coordinates: [lat, lng],
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        lat: lat,
        lng: lng
      });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setUserLocation(coords);
          setSelectedCoords(coords);
          setMapCenter(coords);
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            const address = data.display_name || `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
            
            onLocationSelect({
              coordinates: [coords.lat, coords.lng],
              address: address,
              lat: coords.lat,
              lng: coords.lng
            });
          } catch (error) {
            console.error('Error getting address:', error);
            onLocationSelect({
              coordinates: [coords.lat, coords.lng],
              address: `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
              lat: coords.lat,
              lng: coords.lng
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);

          // Provide specific error messages based on error code
          let errorMessage = 'Unable to get your current location. ';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Location access was denied. Please enable location permissions in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable. Please check that location services are enabled on your device.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage += 'An unknown error occurred.';
              break;
          }
          errorMessage += ' Please click on the map to select a location manually.';

          alert(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // 15 seconds timeout
          maximumAge: 60000 // Accept cached position up to 1 minute old
        }
      );
    }
  };

  return (
    <div className="w-full">
      {/* Map Controls */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={getCurrentLocation}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          <Navigation className="mr-1" size={16} />
          Get Current Location
        </button>
        {userLocation && (
          <div className="flex items-center px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm">
            <Target className="mr-1" size={16} />
            Location detected
          </div>
        )}
      </div>

      {/* Simple Map Interface */}
      <div 
        className="relative w-full h-96 bg-gradient-to-br from-green-100 to-blue-100 border-2 border-gray-300 rounded-lg cursor-crosshair overflow-hidden"
        onClick={handleMapClick}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)
          `
        }}
      >
        {/* Grid overlay to simulate map */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full border-t border-gray-400" style={{ top: `${i * 10}%` }} />
          ))}
          {[...Array(10)].map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full border-l border-gray-400" style={{ left: `${i * 10}%` }} />
          ))}
        </div>

        {/* Map Title */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow">
          <h3 className="font-semibold text-gray-800">Addis Ababa Area Map</h3>
          <p className="text-xs text-gray-600">Click anywhere to select location</p>
        </div>

        {/* Location Names and Landmarks */}
        {landmarks.map((landmark, index) => {
          const xPos = 50 + (landmark.lng - mapCenter.lng) * 1000;
          const yPos = 50 - (landmark.lat - mapCenter.lat) * 1000;
          
          // Only show landmarks that are within visible bounds
          if (xPos < 0 || xPos > 100 || yPos < 0 || yPos > 100) return null;
          
          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${xPos}%`,
                top: `${yPos}%`
              }}
            >
              {landmark.type === 'landmark' ? (
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-purple-600 rounded-full shadow-md"></div>
                  <div className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded mt-1 shadow-md whitespace-nowrap font-semibold">
                    {landmark.name}
                  </div>
                </div>
              ) : (
                <div className="bg-blue-800 bg-opacity-80 text-white text-sm px-2 py-1 rounded shadow-lg font-bold">
                  {landmark.name}
                </div>
              )}
            </div>
          );
        })}

        {/* Existing Outages */}
        {existingOutages.map((outage, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{
              left: `${50 + (outage.lng - mapCenter.lng) * 1000}%`,
              top: `${50 - (outage.lat - mapCenter.lat) * 1000}%`
            }}
          >
            <div className="relative">
              <AlertTriangle className="text-red-600 bg-white rounded-full p-1 shadow-lg" size={24} />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  {outage.type} - {outage.status}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* User Location */}
        {userLocation && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${50 + (userLocation.lng - mapCenter.lng) * 1000}%`,
              top: `${50 - (userLocation.lat - mapCenter.lat) * 1000}%`
            }}
          >
            <div className="relative">
              <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-600 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  Your Location
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected Location */}
        {selectedCoords && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${50 + (selectedCoords.lng - mapCenter.lng) * 1000}%`,
              top: `${50 - (selectedCoords.lat - mapCenter.lat) * 1000}%`
            }}
          >
            <div className="relative">
              <MapPin className="text-green-600 bg-white rounded-full p-1 shadow-lg" size={28} />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-green-600 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  Selected
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-1"></div>
              <span>Your Location</span>
            </div>
            <div className="flex items-center">
              <MapPin className="text-green-600 mr-1" size={12} />
              <span>Selected</span>
            </div>
            <div className="flex items-center">
              <AlertTriangle className="text-red-600 mr-1" size={12} />
              <span>Outages</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coordinates Display */}
      {selectedCoords && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <strong>Selected Coordinates:</strong> {selectedCoords.lat.toFixed(6)}, {selectedCoords.lng.toFixed(6)}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleGISMap;