import { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { GridZone } from '../types';

interface GridMapProps {
  zones: GridZone[];
}

export function GridMap({ zones }: GridMapProps) {
  // Example coordinates for zones (replace with actual coordinates)
  const zoneCoordinates = {
    'Zone A': { lat: 40.7128, lng: -74.0060 },
    'Zone B': { lat: 40.7328, lng: -73.9860 },
    'Zone C': { lat: 40.7528, lng: -74.0260 },
    'Zone D': { lat: 40.7028, lng: -73.9660 },
    'Zone E': { lat: 40.7228, lng: -74.0460 },
    'Zone F': { lat: 40.7428, lng: -73.9460 }
  };

  const getStatusColor = (status: GridZone['status']) => {
    switch (status) {
      case 'critical':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      default:
        return '#10B981';
    }
  };

  return (
    <div className="h-[400px] rounded-lg overflow-hidden">
      <MapContainer
        center={[40.7128, -74.0060]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {zones.map(zone => {
          const coords = zoneCoordinates[zone.name as keyof typeof zoneCoordinates];
          if (!coords) return null;

          return (
            <Circle
              key={zone.id}
              center={[coords.lat, coords.lng]}
              radius={500}
              pathOptions={{
                color: getStatusColor(zone.status),
                fillColor: getStatusColor(zone.status),
                fillOpacity: 0.5
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{zone.name}</h3>
                  <p>Load: {zone.load}%</p>
                  <p>Efficiency: {zone.efficiency}%</p>
                  <p>Status: {zone.status}</p>
                </div>
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>
    </div>
  );
}