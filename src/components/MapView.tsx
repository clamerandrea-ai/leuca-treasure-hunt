import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { stages } from '../data/stages';

// Fix default marker icons for Leaflet + bundler
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const goldIcon = new L.DivIcon({
  html: `<div style="
    width: 20px; height: 20px;
    background: radial-gradient(circle, #E8C875, #C4A265);
    border: 2px solid #0A1628;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(232, 200, 117, 0.6);
  " class="marker-current"></div>`,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const completedIcon = new L.DivIcon({
  html: `<div style="
    width: 16px; height: 16px;
    background: #22c55e;
    border: 2px solid #0A1628;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; color: white;
  ">&#10003;</div>`,
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const userIcon = new L.DivIcon({
  html: `<div style="
    width: 14px; height: 14px;
    background: #3b82f6;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
  "></div>`,
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { duration: 1 });
  }, [center, map]);
  return null;
}

interface MapViewProps {
  userPosition: { lat: number; lng: number } | null;
}

export function MapView({ userPosition }: MapViewProps) {
  const { state } = useGame();
  const currentStage = stages.find(s => s.id === state.currentStage);

  const center: [number, number] = currentStage
    ? [currentStage.lat, currentStage.lng]
    : [39.7950, 18.3530];

  return (
    <div className="w-full h-48 rounded-xl overflow-hidden border border-gold/20 mx-4" style={{ maxWidth: 'calc(100% - 2rem)' }}>
      <MapContainer
        center={center}
        zoom={16}
        minZoom={15}
        maxZoom={18}
        zoomControl={true}
        className="w-full h-full"
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} />

        {/* Completed stages */}
        {stages
          .filter(s => state.completedStages.includes(s.id))
          .map(s => (
            <Marker key={s.id} position={[s.lat, s.lng]} icon={completedIcon}>
              <Popup>{s.name} &#10003;</Popup>
            </Marker>
          ))}

        {/* Current stage */}
        {currentStage && state.screen === 'playing' && (
          <>
            <Circle
              center={[currentStage.lat, currentStage.lng]}
              radius={currentStage.proximityRadius}
              pathOptions={{
                color: 'rgba(196, 162, 101, 0.4)',
                fillColor: 'rgba(196, 162, 101, 0.1)',
                fillOpacity: 0.3,
              }}
            />
            <Marker position={[currentStage.lat, currentStage.lng]} icon={goldIcon}>
              <Popup>{currentStage.name}</Popup>
            </Marker>
          </>
        )}

        {/* Dev mode: show all stages */}
        {state.devMode &&
          stages
            .filter(s => !state.completedStages.includes(s.id) && s.id !== state.currentStage)
            .map(s => (
              <Marker key={s.id} position={[s.lat, s.lng]} icon={goldIcon} opacity={0.3}>
                <Popup>{s.name} (nascosta)</Popup>
              </Marker>
            ))}

        {/* User position */}
        {userPosition && (
          <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon}>
            <Popup>Tu sei qui</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
