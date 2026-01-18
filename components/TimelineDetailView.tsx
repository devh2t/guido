
import React, { useState, useRef, useEffect } from 'react';
import { Tour } from '../types';
import TourMap from './TourMap';
import { ArrowLeft, Footprints, Bus, TramFront, TrainFront, Clock, ChevronRight, Ship, Car, Mountain } from 'lucide-react';

interface TimelineDetailViewProps {
  tour: Tour;
  onBack: () => void;
  onSelectStop: (index: number) => void;
  t: (key: string) => string;
}

const TimelineDetailView: React.FC<TimelineDetailViewProps> = ({ tour, onBack, onSelectStop, t }) => {
  const [mapActiveIndex, setMapActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isRtl = document.documentElement.dir === 'rtl';

  const getTransportIcon = (mode?: string) => {
    switch (mode?.toLowerCase()) {
      case 'walking': return <Footprints className="w-3.5 h-3.5" />;
      case 'bus': return <Bus className="w-3.5 h-3.5" />;
      case 'tram': return <TramFront className="w-3.5 h-3.5" />;
      case 'metro': return <TrainFront className="w-3.5 h-3.5" />;
      case 'ferry': return <Ship className="w-3.5 h-3.5" />;
      case 'taxi': return <Car className="w-3.5 h-3.5" />;
      case 'cable_car': return <Mountain className="w-3.5 h-3.5" />;
      default: return <Footprints className="w-3.5 h-3.5" />;
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeCard = container.children[mapActiveIndex] as HTMLElement;
      if (activeCard) {
        const scrollOffset = activeCard.offsetLeft - (container.offsetWidth / 2) + (activeCard.offsetWidth / 2);
        container.scrollTo({ left: scrollOffset, behavior: 'smooth' });
      }
    }
  }, [mapActiveIndex]);

  return (
    <div className={`fixed inset-0 z-[250] bg-white flex flex-col animate-in fade-in slide-in-from-bottom duration-500 overflow-hidden ${isRtl ? 'font-arabic' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Absolute Top Header - Floating style */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg border border-slate-100">
          <button 
            onClick={onBack} 
            className="p-1.5 rounded-xl bg-slate-900 text-white active:scale-90 transition-all"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
          <div className="flex flex-col pr-2">
            <h2 className="text-[12px] font-black text-slate-900 truncate leading-tight max-w-[150px]">
              {tour.tourTitle}
            </h2>
            <p className="text-[8px] font-bold text-orange-600 uppercase tracking-widest">{tour.stops.length} {t('checkpoints')}</p>
          </div>
        </div>
      </div>

      {/* Main Map Content - Immersive View */}
      <div className="flex-1 relative bg-slate-50">
        <TourMap 
          stops={tour.stops} 
          activeStopIndex={mapActiveIndex} 
          onStopClick={setMapActiveIndex} 
          currency={tour.currency} 
        />
        
        {/* Horizontal Mini Carousel - Swipeable cards at bottom */}
        <div 
          ref={scrollContainerRef}
          className="absolute bottom-6 left-0 right-0 flex gap-3 overflow-x-auto px-6 pb-4 no-scrollbar z-20 snap-x"
        >
          {tour.stops.map((stop, idx) => (
            <div 
              key={idx}
              onClick={() => setMapActiveIndex(idx)}
              className={`snap-center flex-shrink-0 w-[280px] bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-2xl border transition-all duration-300 cursor-pointer ${
                mapActiveIndex === idx 
                ? 'border-slate-900 ring-4 ring-slate-900/5 translate-y-[-4px]' 
                : 'border-transparent opacity-95 scale-95'
              }`}
            >
              <div className="flex gap-3 items-center">
                {/* Compact Image or Number */}
                <div className="relative shrink-0">
                  {stop.visualUrl ? (
                    <img src={stop.visualUrl} className="w-14 h-14 rounded-xl object-cover border border-slate-100 shadow-sm" alt={stop.name} />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400">
                      {idx + 1}
                    </div>
                  )}
                  <div className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[9px] font-black shadow-md border border-white">
                    {idx + 1}
                  </div>
                </div>

                {/* Text Details */}
                <div className="min-w-0 flex-1 py-0.5 text-left">
                  <h4 className="text-[13px] font-black text-slate-900 truncate leading-tight mb-1">{stop.name}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-orange-600 uppercase bg-orange-50 px-1.5 py-0.5 rounded">
                      {stop.estimatedCost === 0 ? t('free') : `${stop.estimatedCost} ${tour.currency}`}
                    </span>
                    <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase">
                      {getTransportIcon(stop.transportMode)}
                      <span>{stop.transportMode || 'Walk'}</span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <button 
                  onClick={(e) => { e.stopPropagation(); onSelectStop(idx); }}
                  className="w-10 h-10 shrink-0 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center active:bg-slate-200 transition-all border border-slate-100"
                >
                  <ChevronRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineDetailView;
