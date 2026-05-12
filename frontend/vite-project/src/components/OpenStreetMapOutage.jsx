import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const OpenStreetMapOutage = ({ darkMode, onLocationSelect, existingOutages = [] }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const currentLocationMarkerRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentLocationName, setCurrentLocationName] = useState('Loading...');
  const [selectedLocationName, setSelectedLocationName] = useState('');

  useEffect(() => {
    // Initialize map
    if (!mapInstanceRef.current) {
      // Center on Addis Ababa, Ethiopia (default)
      const map = L.map(mapRef.current).setView([9.0320, 38.7469], 13);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Get user's current location on load
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            
            // Center map on user's location
            map.setView([latitude, longitude], 15);
            
            // Reverse geocode to get location name
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
              .then(res => res.json())
              .then(data => {
                const locationName = data.display_name || 'Unknown location';
                setCurrentLocationName(locationName);
                
                // Add blue marker for current location with address
                const currentMarker = L.marker([latitude, longitude], {
                  icon: L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                  }),
                  isCurrentLocation: true
                }).addTo(map);

                currentMarker.bindPopup(`
                  <div style="padding: 10px; max-width: 250px;">
                    <strong style="color: #2563eb; font-size: 14px;">📍 Your Current Location</strong><br/>
                    <p style="margin: 8px 0; color: #374151; font-size: 12px;">${locationName}</p>
                    <span style="color: #6b7280; font-size: 11px;">
                      ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
                    </span>
                  </div>
                `).openPopup();

                currentLocationMarkerRef.current = currentMarker;
                setCurrentLocation({ lat: latitude, lng: longitude });
              })
              .catch(() => {
                setCurrentLocationName('Unable to get location name');
                
                // Add marker without address
                const currentMarker = L.marker([latitude, longitude], {
                  icon: L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                  }),
                  isCurrentLocation: true
                }).addTo(map);

                currentMarker.bindPopup(`
                  <div style="padding: 8px;">
                    <strong style="color: #2563eb;">📍 Your Current Location</strong><br/>
                    <span style="color: #6b7280;">Lat: ${latitude.toFixed(6)}<br/>
                    Lng: ${longitude.toFixed(6)}</span>
                  </div>
                `).openPopup();

                currentLocationMarkerRef.current = currentMarker;
                setCurrentLocation({ lat: latitude, lng: longitude });
              });
          },
          (error) => {
            console.log('Location access denied or unavailable:', error);
            setCurrentLocationName('Location access denied');
            // Map stays centered on Addis Ababa if location is denied
          }
        );
      }

      // Add click handler for selecting location
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        
        // Remove previous selection marker
        markersRef.current.forEach(marker => {
          if (marker.options.isSelection) {
            map.removeLayer(marker);
          }
        });

        // Add new selection marker (green)
        const marker = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          }),
          isSelection: true
        }).addTo(map);

        markersRef.current.push(marker);
        setSelectedLocation({ lat, lng });

        // Reverse geocode to get address
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          .then(res => res.json())
          .then(data => {
            const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            setSelectedLocationName(address);
            
            // Update marker popup with address
            marker.bindPopup(`
              <div style="padding: 10px; max-width: 250px;">
                <strong style="color: #16a34a; font-size: 14px;">✓ Selected Outage Location</strong><br/>
                <p style="margin: 8px 0; color: #374151; font-size: 12px;">${address}</p>
                <span style="color: #6b7280; font-size: 11px;">
                  ${lat.toFixed(6)}, ${lng.toFixed(6)}
                </span>
              </div>
            `).openPopup();
            
            if (onLocationSelect) {
              onLocationSelect({ lat, lng, address });
            }
          })
          .catch(() => {
            const address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            setSelectedLocationName(address);
            
            marker.bindPopup(`
              <div style="padding: 8px;">
                <strong style="color: #16a34a;">✓ Selected Location</strong><br/>
                <span style="color: #6b7280;">Lat: ${lat.toFixed(6)}<br/>
                Lng: ${lng.toFixed(6)}</span>
              </div>
            `).openPopup();
            
            if (onLocationSelect) {
              onLocationSelect({ lat, lng, address });
            }
          });
      });
    }

    // Add existing outage markers
    if (mapInstanceRef.current && existingOutages.length > 0) {
      // Clear existing outage markers
      markersRef.current.forEach(marker => {
        if (!marker.options.isSelection) {
          mapInstanceRef.current.removeLayer(marker);
        }
      });
      markersRef.current = markersRef.current.filter(m => m.options.isSelection);

      // Add new outage markers
      existingOutages.forEach(outage => {
        const markerColor = getMarkerColor(outage.type);
        
        const marker = L.marker([outage.lat, outage.lng], {
          icon: L.icon({
            iconUrl: markerColor,
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          }),
          isSelection: false
        }).addTo(mapInstanceRef.current);

        marker.bindPopup(`
          <div style="padding: 8px; min-width: 200px;">
            <strong style="color: #dc2626;">${outage.type}</strong><br/>
            <span style="color: #6b7280;">Status: ${outage.status}</span><br/>
            <span style="color: #6b7280;">Reported: ${outage.reportedAt}</span><br/>
            <p style="margin-top: 8px; color: #374151;">${outage.description}</p>
          </div>
        `);

        markersRef.current.push(marker);
      });
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [existingOutages, onLocationSelect]);

  const getMarkerColor = (type) => {
    const typeMap = {
      'Complete Outage': 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      'Partial Outage': 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
      'Line Damage': 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    };
    return typeMap[type] || 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png';
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 15);
            
            // Trigger click at current location
            mapInstanceRef.current.fire('click', {
              latlng: L.latLng(latitude, longitude)
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please click on the map to select a location.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        style={{ 
          height: '400px', 
          width: '100%',
          borderRadius: '8px',
          border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb'
        }}
      />
      
      {/* GPS Button */}
      <button
        type="button"
        onClick={getCurrentLocation}
        className={`absolute top-4 right-4 z-[1000] p-3 rounded-lg shadow-lg ${
          darkMode 
            ? 'bg-[#1f2a40] text-cyan-400 hover:bg-[#141b2d]' 
            : 'bg-white text-blue-600 hover:bg-gray-50'
        } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
        title="Use my current location"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>

      {/* Instructions */}
      <div className={`mt-4 p-3 rounded-lg ${
        darkMode ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-blue-50 border-blue-200'
      } border`}>
        <p className={`text-sm ${darkMode ? 'text-cyan-400' : 'text-blue-800'}`}>
          📍 Blue marker shows your current location. Click anywhere on the map to select outage location, or use the GPS button to recenter.
        </p>
      </div>

      {currentLocation && (
        <div className={`mt-2 p-3 rounded-lg ${
          darkMode ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'
        } border text-sm`}>
          <div className="flex items-start gap-2">
            <span className="text-lg">📍</span>
            <div>
              <div className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
                Your Current Location
              </div>
              <div className={`${darkMode ? 'text-blue-300' : 'text-blue-700'} mt-1`}>
                {currentLocationName}
              </div>
              <div className={`${darkMode ? 'text-blue-500' : 'text-blue-600'} text-xs mt-1`}>
                {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedLocation && (
        <div className={`mt-2 p-3 rounded-lg ${
          darkMode ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'
        } border text-sm`}>
          <div className="flex items-start gap-2">
            <span className="text-lg">✓</span>
            <div>
              <div className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-800'}`}>
                Selected Outage Location
              </div>
              <div className={`${darkMode ? 'text-green-300' : 'text-green-700'} mt-1`}>
                {selectedLocationName}
              </div>
              <div className={`${darkMode ? 'text-green-500' : 'text-green-600'} text-xs mt-1`}>
                {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenStreetMapOutage;
