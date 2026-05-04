import { useEffect, useRef, useState } from 'react';

const GoogleMapsOutage = ({ 
    onLocationSelect, 
    selectedLocation, 
    existingOutages, 
    height = '500px',
    darkMode = true 
}) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef([]);
    const selectedMarkerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    useEffect(() => {
        if (!GOOGLE_MAPS_API_KEY) {
            setError('Google Maps API key not configured');
            setLoading(false);
            return;
        }

        const initMap = async () => {
            try {
                // Load Google Maps script dynamically
                if (!window.google) {
                    await new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,marker`;
                        script.async = true;
                        script.defer = true;
                        script.onload = resolve;
                        script.onerror = reject;
                        document.head.appendChild(script);
                    });
                }

                const google = window.google;

                // Default center (Addis Ababa, Ethiopia)
                const defaultCenter = { lat: 9.0320, lng: 38.7469 };
                const center = selectedLocation 
                    ? { lat: selectedLocation[0], lng: selectedLocation[1] }
                    : defaultCenter;

                const mapOptions = {
                    zoom: 14,
                    center: center,
                    mapTypeControl: true,
                    fullscreenControl: true,
                    streetViewControl: true,
                    styles: darkMode ? getDarkMapStyle() : getLightMapStyle()
                };

                mapInstance.current = new google.maps.Map(mapRef.current, mapOptions);

                // Add existing outage markers
                existingOutages.forEach((outage) => {
                    const marker = new google.maps.Marker({
                        position: { lat: outage.lat, lng: outage.lng },
                        map: mapInstance.current,
                        title: outage.type,
                        icon: getOutageIcon(outage.type),
                        animation: google.maps.Animation.DROP
                    });

                    const infoWindow = new google.maps.InfoWindow({
                        content: `
                            <div style="padding: 12px; font-family: Arial, sans-serif;">
                                <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #333;">${outage.type}</h3>
                                <p style="margin: 4px 0; font-size: 12px; color: #666;">
                                    <strong>Status:</strong> ${outage.status}
                                </p>
                                <p style="margin: 4px 0; font-size: 12px; color: #666;">
                                    <strong>Reported:</strong> ${outage.reportedAt}
                                </p>
                                <p style="margin: 4px 0; font-size: 12px; color: #666;">
                                    ${outage.description}
                                </p>
                            </div>
                        `
                    });

                    marker.addListener('click', () => {
                        infoWindow.open(mapInstance.current, marker);
                    });

                    markersRef.current.push(marker);
                });

                // Add selected location marker if exists
                if (selectedLocation) {
                    const selectedMarker = new google.maps.Marker({
                        position: { lat: selectedLocation[0], lng: selectedLocation[1] },
                        map: mapInstance.current,
                        title: 'Your Location',
                        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                        animation: google.maps.Animation.BOUNCE
                    });
                    selectedMarkerRef.current = selectedMarker;
                }

                // Map click listener for location selection
                mapInstance.current.addListener('click', async (event) => {
                    const lat = event.latLng.lat();
                    const lng = event.latLng.lng();

                    // Remove previous selected marker
                    if (selectedMarkerRef.current) {
                        selectedMarkerRef.current.setMap(null);
                    }

                    // Add new selected marker
                    selectedMarkerRef.current = new google.maps.Marker({
                        position: { lat, lng },
                        map: mapInstance.current,
                        title: 'Selected Location',
                        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                        animation: google.maps.Animation.DROP
                    });

                    // Get address from coordinates
                    try {
                        const geocoder = new google.maps.Geocoder();
                        const response = await geocoder.geocode({ location: { lat, lng } });
                        
                        if (response.results[0]) {
                            const address = response.results[0].formatted_address;
                            onLocationSelect({
                                address,
                                lat,
                                lng,
                                placeId: response.results[0].place_id
                            });
                        }
                    } catch (err) {
                        console.error('Geocoding error:', err);
                        onLocationSelect({
                            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                            lat,
                            lng
                        });
                    }
                });

                setLoading(false);
            } catch (err) {
                console.error('Error loading Google Maps:', err);
                setError('Failed to load Google Maps');
                setLoading(false);
            }
        };

        initMap();

        return () => {
            // Cleanup
            markersRef.current.forEach(marker => marker.setMap(null));
            if (selectedMarkerRef.current) {
                selectedMarkerRef.current.setMap(null);
            }
        };
    }, [GOOGLE_MAPS_API_KEY, selectedLocation, existingOutages, darkMode, onLocationSelect]);

    const getDarkMapStyle = () => [
        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
        },
        {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#263c3f' }]
        },
        {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6b9080' }]
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }]
        },
        {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }]
        },
        {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#746855' }]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#1f2835' }]
        },
        {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#f3751ff' }]
        },
        {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#2f3948' }]
        },
        {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#515c6d' }]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#17263c' }]
        }
    ];

    const getLightMapStyle = () => [];

    const getOutageIcon = (type) => {
        const icons = {
            'Complete Outage': 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            'Partial Outage': 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
            'Line Damage': 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
        };
        return icons[type] || 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-full bg-red-50 rounded-lg">
                <div className="text-center">
                    <p className="text-red-600 font-semibold">{error}</p>
                    <p className="text-red-500 text-sm mt-2">Please configure your Google Maps API key in .env</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading map...</p>
                </div>
            </div>
        );
    }

    return (
        <div 
            ref={mapRef} 
            style={{ height, width: '100%' }}
            className="rounded-lg overflow-hidden shadow-lg"
        />
    );
};

export default GoogleMapsOutage;
