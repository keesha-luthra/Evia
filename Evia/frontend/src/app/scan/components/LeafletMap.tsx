'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in leaflet
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function LeafletMap({
  clinics,
  center
}: {
  clinics: any[];
  center: { lat: number; lng: number };
}) {
  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', zIndex: 1 }}>
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={12} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* User Location Marker */}
        <Marker position={[center.lat, center.lng]} icon={icon}>
          <Popup>
            You are here
          </Popup>
        </Marker>
        
        {/* Clinics Markers */}
        {clinics.map((clinic, index) => {
          if (!clinic.location || !clinic.location.lat || !clinic.location.lng) {
            return null;
          }
          return (
            <Marker 
              key={index} 
              position={[clinic.location.lat, clinic.location.lng]}
              icon={icon}
            >
              <Popup>
                <div className="font-semibold">{clinic.name || "Dermatology Clinic"}</div>
                <div className="text-sm">{clinic.address}</div>
                {clinic.rating && <div className="text-sm text-yellow-600">★ {clinic.rating}</div>}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
