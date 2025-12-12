'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import Layout from '../components/Layout';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const getMagnitudeColor = (mag: number): string => {
  if (mag >= 7) return '#d73027';
  if (mag >= 6) return '#fc8d59';
  if (mag >= 5) return '#fee08b';
  if (mag >= 4) return '#d9ef8b';
  return '#91cf60';
};

const createQuakeIcon = (mag: number, L: any) => {
  const size = Math.max(8, Math.min(24, mag * 3));
  const color = getMagnitudeColor(mag);
  return L.divIcon({
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 6px rgba(0,0,0,0.4);
    "></div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

interface Seism {
  id: string;
  time: string;
  latitude: number;
  longitude: number;
  mag: number;
  place: string;
  depth: number;
}

export default function SeismMapPage() {
  const [seisms, setSeisms] = useState<Seism[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
  const [Leaflet, setLeaflet] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then(L => {
        setLeaflet(L.default);
      });
    }
  }, []);

  useEffect(() => {
    const fetchSeisms = async () => {
      try {
        const res = await fetch(`http://localhost:8000/seisms?page=1&limit=500`);
        const data = await res.json();
        const quakes = data.data as Seism[];

        if (quakes.length > 0) {
          setMapCenter([quakes[0].latitude, quakes[0].longitude]);
        }

        setSeisms(quakes);
      } catch (err) {
        console.error('Failed to load seisms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeisms();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-xl font-bold mb-4">Carte des Séismes Récents (M ≥ 2.5)</h1>

        {loading ? (
          <div className="flex justify-center items-center h-[600px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          </div>
        ) : (
          <div className="h-[600px] w-full rounded-lg overflow-hidden">
            <MapContainer
              center={mapCenter}
              zoom={3}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
              />
              {Leaflet && seisms.map(quake => {
                if (typeof quake.latitude !== 'number' || typeof quake.longitude !== 'number') return null;

                return (
                  <Marker
                    key={quake.id}
                    position={[quake.latitude, quake.longitude]}
                    icon={createQuakeIcon(quake.mag, Leaflet)}
                  >
                    <Popup>
                      <div className="text-sm space-y-2 max-w-xs">
                        <h3 className="font-bold text-red-600">
                          Magnitude {quake.mag}
                        </h3>
                        <p>
                          <strong>Lieu :</strong> {quake.place}
                        </p>
                        <p>
                          <strong>Date :</strong> {new Date(quake.time).toLocaleString('fr-FR')}
                        </p>
                        <p>
                          <strong>Profondeur :</strong> {quake.depth} km
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {quake.id}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        )}
      </div>
    </Layout>
  );
}