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
        name: 'Sandton Specialist Medical Centre',
        province: 'Gauteng',
        type: 'Multi-Specialty Suite',
        predictedPatients: 24,
        capacity: 28,
        risk: 'high',
        latitude: -26.1076,
        longitude: 28.0567
    },
    {
        id: 2,
        name: 'Rosebank Medical Suites',
        province: 'Gauteng',
        type: 'Primary Care Center',
        predictedPatients: 42,
        capacity: 45,
        risk: 'low',
        latitude: -26.1450,
        longitude: 28.0436
    },
    {
        id: 3,
        name: 'Cape Town Specialist Centre',
        province: 'Western Cape',
        type: 'Cardiology Clinic',
        predictedPatients: 18,
        capacity: 22,
        risk: 'medium',
        latitude: -33.9249,
        longitude: 18.4241
    },
    {
        id: 4,
        name: 'Pretoria Family Care Suite',
        province: 'Gauteng',
        type: 'Paediatric Suite',
        predictedPatients: 31,
        capacity: 32,
        risk: 'low',
        latitude: -25.7479,
        longitude: 28.2293
    },
    {
        id: 5,
        name: 'Durban Medical Hub',
        province: 'KwaZulu-Natal',
        type: 'Surgical Suites',
        predictedPatients: 35,
        capacity: 40,
        risk: 'low',
        latitude: -29.8587,
        longitude: 31.0218
    },
    {
        id: 6,
        name: 'Port Elizabeth Private Clinic',
        province: 'Eastern Cape',
        type: 'Specialist Centre',
        predictedPatients: 20,
        capacity: 24,
        risk: 'medium',
        latitude: -33.9608,
        longitude: 25.6022
    },
    {
        id: 7,
        name: 'Umhlanga Surgical Suites',
        province: 'KwaZulu-Natal',
        type: 'Day Clinic',
        predictedPatients: 19,
        capacity: 20,
        risk: 'low',
        latitude: -29.7258,
        longitude: 31.0664
    },
];

export default function InteractiveMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const [selectedClinic, setSelectedClinic] = useState<ClinicMarker | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    // Mock Route Data for Specialists Home Care Calls
    const routesData = [
        {
            id: 1,
            name: 'Optimized Specialist Visit Route 1',
            color: '#3b82f6', // blue
            coordinates: [
                [-26.1076, 28.0567], // Sandton Specialist (Start)
                [-26.1450, 28.0436], // Rosebank Medical (Stop 1)
                [-25.7479, 28.2293]  // Pretoria Family (Stop 2)
            ] as [number, number][],
            stopNames: ["Rosebank Suites", "Pretoria Family Care"]
        },
    ];

    useEffect(() => {
        if (typeof window !== 'undefined' && mapRef.current && !mapLoaded) {
            // Dynamically import Leaflet (only on client side)
            import('leaflet').then((L) => {
                // Fix for default marker icon in Next.js
                // @ts-expect-error Leaflet default icon URL bug fix
                delete L.Icon.Default.prototype._getIconUrl;
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
                    const markerColor = clinic.risk === 'high' ? '#e11d48' : clinic.risk === 'medium' ? '#d97706' : '#059669';

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
                  <span style="color: #6b7280;">Scheduled Today:</span>
                  <span style="font-weight: 600; color: #1f2937;">${clinic.predictedPatients} appts</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                  <span style="color: #6b7280;">Total Slots:</span>
                  <span style="font-weight: 600; color: #1f2937;">${clinic.capacity}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px;">
                  <span style="color: #6b7280;">Attendance Risk:</span>
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

                // Render Specialist Visit Routes
                routesData.forEach(route => {
                    L.polyline(route.coordinates as L.LatLngExpression[], {
                        color: route.color,
                        weight: 3,
                        opacity: 0.7,
                        dashArray: '10, 10',
                        lineCap: 'round'
                    }).addTo(map).bindPopup(`<b>${route.name}</b><br>Daily Route Distance: 68km`);

                    // Add small dots for stops
                    route.coordinates.forEach((coord, index) => {
                        if (index > 0 && index < route.coordinates.length - 1) {
                            L.circleMarker(coord as L.LatLngExpression, {
                                radius: 4,
                                fillColor: 'white',
                                color: route.color,
                                weight: 2,
                                opacity: 1,
                                fillOpacity: 1
                            }).addTo(map).bindPopup(`Route Stop #${index}: ${route.stopNames[index - 1]}`);
                        }
                    });
                });

                setMapLoaded(true);
            });
        }
    }, [mapLoaded]);

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Practice Map - South Africa</h2>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                        <span className="text-gray-600">High Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-gray-600">Medium Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
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
                            if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition((position) => {
                                    const { latitude, longitude } = position.coords;
                                    alert(`Located: ${latitude}, ${longitude}`);
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
                <div className="p-6 bg-gradient-to-br from-blue-50 to-emerald-50 border-t border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">{selectedClinic.name}</h3>
                          <p className="text-xs text-gray-500">{selectedClinic.province} • {selectedClinic.type}</p>
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
                            <div className="text-[10px] text-gray-500 font-semibold mb-1">Scheduled Appts</div>
                            <div className="text-lg font-bold text-gray-900">{selectedClinic.predictedPatients}</div>
                        </div>
                        <div className="bg-white/60 rounded-lg p-3">
                            <div className="text-[10px] text-gray-500 font-semibold mb-1">Capacity</div>
                            <div className="text-lg font-bold text-gray-900">{selectedClinic.capacity}</div>
                        </div>
                        <div className="bg-white/60 rounded-lg p-3">
                            <div className="text-[10px] text-gray-500 font-semibold mb-1">Utilization</div>
                            <div className="text-lg font-bold text-gray-900">
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

