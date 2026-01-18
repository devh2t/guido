
import React, { useEffect, useRef } from 'react';
import { Stop } from '../types';

interface TourMapProps {
  stops: Stop[];
  activeStopIndex: number;
  onStopClick: (index: number) => void;
  currency: string;
}

const TourMap: React.FC<TourMapProps> = ({ stops, activeStopIndex, onStopClick }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([stops[0]?.latitude || 0, stops[0]?.longitude || 0], 13);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);
      
      L.control.zoom({ position: 'topright' }).addTo(mapRef.current);
    }

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    if (polylineRef.current) polylineRef.current.remove();

    const latLngs: [number, number][] = [];
    stops.forEach((stop, idx) => {
      const latLng: [number, number] = [stop.latitude, stop.longitude];
      latLngs.push(latLng);

      const isActive = idx === activeStopIndex;
      const markerIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 ${isActive ? 'bg-slate-900 scale-125' : 'bg-slate-500'} rounded-full shadow-xl border-4 border-white flex items-center justify-center transition-all duration-300">
              <span class="text-[10px] font-black text-white">${idx + 1}</span>
            </div>
            ${isActive ? '<div class="absolute w-12 h-12 bg-slate-900/20 rounded-full animate-ping"></div>' : ''}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(latLng, { icon: markerIcon }).addTo(mapRef.current);
      marker.on('click', () => onStopClick(idx));
      markersRef.current.push(marker);
    });

    if (latLngs.length > 1) {
      polylineRef.current = L.polyline(latLngs, {
        color: '#0f172a',
        weight: 4,
        opacity: 0.6,
        dashArray: '10, 10',
        lineJoin: 'round'
      }).addTo(mapRef.current);
    }

    if (activeStopIndex >= 0 && stops[activeStopIndex]) {
      mapRef.current.flyTo([stops[activeStopIndex].latitude, stops[activeStopIndex].longitude], 15, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    } else if (latLngs.length > 0) {
      mapRef.current.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50] });
    }
  }, [stops, activeStopIndex, onStopClick]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
};

export default TourMap;
