'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

// Define clinic type for the map
interface ClinicMarker {
    id: number;
    name: string;
    province: string;
    type: string;
    predictedPatients: number;
    capacity: number;
    risk: 'low' | 'medium' | 'high';
    latitude: number;
    longitude: number;
}

const clinicsData: ClinicMarker[] = [
    {
        id: 1,
        name: 'Vuwani Community Clinic',
        province: 'Limpopo',
        type: 'Primary Healthcare',
        predictedPatients: 287,
        capacity: 250,
        risk: 'high',
        latitude: -22.9491,
        longitude: 30.4256
    },
    {
        id: 2,
        name: 'Lusikisiki CHC',
        province: 'Eastern Cape',
        type: 'Community Health Centre',
        predictedPatients: 156,
        capacity: 200,
        risk: 'low',
        latitude: -31.3636,
        longitude: 29.5819
    },
    {
        id: 3,
        name: 'Nquthu District Clinic',
        province: 'KwaZulu-Natal',
        type: 'Primary Healthcare',
        predictedPatients: 198,
        capacity: 180,
        risk: 'medium',
        latitude: -28.2167,
        longitude: 30.3167
    },
    {
        id: 4,
        name: 'Makhado Mobile Unit',
        province: 'Limpopo',
        type: 'Mobile Clinic',
        predictedPatients: 134,
        capacity: 150,
        risk: 'low',
        latitude: -23.0494,
        longitude: 29.9090
    },
    {
        id: 5,
        name: 'Polokwane Central CHC',
        province: 'Limpopo',
        type: 'Community Health Centre',
        predictedPatients: 340,
        capacity: 400,
        risk: 'low',
        latitude: -23.9045,
        longitude: 29.4689
    },
    {
        id: 6,
        name: 'Mthatha District Hospital',
        province: 'Eastern Cape',
        type: 'District Hospital',
        predictedPatients: 520,
        capacity: 600,
        risk: 'medium',
        latitude: -31.5845,
        longitude: 28.7845
    },
    {
        id: 7,
        name: 'Ladysmith CHC',
        province: 'KwaZulu-Natal',
        type: 'Community Health Centre',
        predictedPatients: 280,
        capacity: 320,
        risk: 'low',
        latitude: -28.5560,
        longitude: 29.7812
    },
];

export default function InteractiveMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const [selectedClinic, setSelectedClinic] = useState<ClinicMarker | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    // Mock Route Data for Mobile Clinics
    const routesData = [
        {
            id: 1,
            name: 'Makhado Mobile Route 1',
            color: '#3b82f6', // blue
            coordinates: [
                [-23.0494, 29.9090], // Makhado Mobile Unit (Start)
                [-23.1398, 30.4190], // Vuwani (Stop 1)
                [-22.9900, 30.6900], // Malamulele (Stop 2)
                [-23.3167, 30.7167], // Giyani (Stop 3)
                [-23.1550, 30.0550]  // Elim (Stop 4)
            ] as [number, number][],
            stopNames: ["Vuwani Clinic", "Malamulele Clinic", "Giyani Health Centre", "Elim Hospital"]
        }
    ];

    useEffect(() => {
        if (typeof window !== 'undefined' && mapRef.current && !mapLoaded) {
            // Dynamically import Leaflet (only on client side)
            import('leaflet').then((L) => {
                // Fix for default marker icon in Next.js
                delete (L.Icon.Default.prototype as any)._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                });

                // Initialize map centered on South Africa
                const map = L.map(mapRef.current!).setView([-28.5, 24.5], 6);

                // Add tile layer
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    maxZoom: 18,
                }).addTo(map);

                // Add markers for each clinic
                clinicsData.forEach((clinic) => {
                    const markerColor = clinic.risk === 'high' ? '#dc2626' : clinic.risk === 'medium' ? '#f59e0b' : '#10b981';

                    // Create custom marker icon
                    const customIcon = L.divIcon({
                        html: `
              <div style="
                background: ${markerColor};
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                position: relative;
              ">
                <div style="
                  position: absolute;
                  bottom: -8px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 0;
                  height: 0;
                  border-left: 6px solid transparent;
                  border-right: 6px solid transparent;
                  border-top: 8px solid ${markerColor};
                "></div>
              </div>
            `,
                        className: 'custom-marker',
                        iconSize: [24, 32],
                        iconAnchor: [12, 32],
                    });

                    const marker = L.marker([clinic.latitude, clinic.longitude], { icon: customIcon })
                        .addTo(map);

                    // Add popup
                    const popupContent = `
            <div style="min-width: 200px; font-family: sans-serif;">
              <h3 style="margin: 0 0 8px; color: #1f2937; font-size: 14px; font-weight: 600;">${clinic.name}</h3>
              <p style="margin: 4px 0; font-size: 12px; color: #6b7280;">${clinic.province} • ${clinic.type}</p>
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                  <span style="color: #6b7280;">Predicted:</span>
                  <span style="font-weight: 600; color: #1f2937;">${clinic.predictedPatients} patients</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                  <span style="color: #6b7280;">Capacity:</span>
                  <span style="font-weight: 600; color: #1f2937;">${clinic.capacity}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px;">
                  <span style="color: #6b7280;">Risk:</span>
                  <span style="
                    font-weight: 600;
                    color: ${markerColor};
                    text-transform: uppercase;
                    font-size: 11px;
                  ">${clinic.risk}</span>
                </div>
              </div>
            </div>
          `;

                    marker.bindPopup(popupContent);

                    // Add click event
                    marker.on('click', () => {
                        setSelectedClinic(clinic);
                    });
                });

                // Render Mobile Clinic Routes
                routesData.forEach(route => {
                    L.polyline(route.coordinates, {
                        color: route.color,
                        weight: 3,
                        opacity: 0.7,
                        dashArray: '10, 10', // Dashed line to indicate mobile route
                        lineCap: 'round'
                    }).addTo(map).bindPopup(`<b>${route.name}</b><br>Daily Distance: 45km`);

                    // Add small dots for stops
                    route.coordinates.forEach((coord, index) => {
                        if (index > 0 && index < route.coordinates.length - 1) { // Skip start/end (since it's the clinic)
                            L.circleMarker(coord, {
                                radius: 4,
                                fillColor: 'white',
                                color: route.color,
                                weight: 2,
                                opacity: 1,
                                fillOpacity: 1
                            }).addTo(map).bindPopup(`Mobile Stop #${index}`);
                        }
                    });
                });

                setMapLoaded(true);
            });
        }
    }, [mapLoaded]);

    return (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">Clinic Map - South Africa</h2>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-gray-600">High Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-gray-600">Medium Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-gray-600">Low Risk</span>
                    </div>
                </div>
            </div>

            <div className="relative">
                {/* Map Container */}
                <div
                    ref={mapRef}
                    id="clinic-map"
                    className="h-[300px] md:h-[500px] w-full"
                    style={{ zIndex: 1 }}
                />

                {/* Geolocation Button */}
                <button
                    onClick={() => {
                        if (mapRef.current) {
                            // This is a bit hacky to access the leaflet map instance, 
                            // in a real app we'd use a context or state to store the map instance
                            // or just reload the map to user location
                            if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition((position) => {
                                    const { latitude, longitude } = position.coords;
                                    alert(`Located: ${latitude}, ${longitude}`); // Visual feedback
                                    // ideally we pan the map here if we had the instance exposed
                                });
                            }
                        }
                    }}
                    className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-lg z-[400] text-black hover:bg-gray-50 transition border border-gray-200"
                    title="Use My Location"
                >
                    <Navigation className="w-6 h-6 text-black" />
                </button>

                {/* Loading State */}
                {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                        <div className="text-center">
                            <Navigation className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">Loading map...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Clinic Details Panel */}
            {selectedClinic && (
                <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 border-t border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{selectedClinic.name}</h3>
                            <p className="text-sm text-gray-600">{selectedClinic.province} • {selectedClinic.type}</p>
                        </div>
                        <button
                            onClick={() => setSelectedClinic(null)}
                            className="text-gray-400 hover:text-gray-600 transition"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/60 rounded-lg p-3">
                            <div className="text-xs text-gray-600 mb-1">Predicted Volume</div>
                            <div className="text-xl font-bold text-gray-900">{selectedClinic.predictedPatients}</div>
                        </div>
                        <div className="bg-white/60 rounded-lg p-3">
                            <div className="text-xs text-gray-600 mb-1">Capacity</div>
                            <div className="text-xl font-bold text-gray-900">{selectedClinic.capacity}</div>
                        </div>
                        <div className="bg-white/60 rounded-lg p-3">
                            <div className="text-xs text-gray-600 mb-1">Utilization</div>
                            <div className="text-xl font-bold text-gray-900">
                                {Math.round((selectedClinic.predictedPatients / selectedClinic.capacity) * 100)}%
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Leaflet CSS */}
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                crossOrigin=""
            />
        </div>
    );
}
