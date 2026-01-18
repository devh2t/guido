
import React, { useState, useRef, useEffect } from 'react';
import { Tour } from '../types';
import TourMap from './TourMap';
import { ArrowLeft, Footprints, Bus, TramFront, TrainFront, Clock, List, Map as MapIcon, Heart, ChevronRight, Headphones, Ship, Car, Mountain } from 'lucide-react';

interface TimelineDetailViewProps {
  tour: Tour;
  onBack: () => void;
  onSelectStop: (index: number) => void;
  t: (key: string) => string;
}

const TimelineDetailView: React.FC<TimelineDetailViewProps> = ({ tour, onBack, onSelectStop, t }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');
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
    if (activeTab === 'map' && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeCard = container.children[mapActiveIndex] as HTMLElement;
      if (activeCard) {
        const scrollOffset = activeCard.offsetLeft - (container.offsetWidth / 2) + (activeCard.offsetWidth / 2);
        container.scrollTo({ left: scrollOffset, behavior: 'smooth' });
      }
    }
  }, [mapActiveIndex, activeTab]);

  return (
    <div className={`fixed inset-0 z-[250] bg-white flex flex-col animate-in fade-in slide-in-from-bottom duration-500 overflow-hidden ${isRtl ? 'font-arabic' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Ultra Compact Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-2 shrink-0 flex items-center justify-between shadow-sm z-30">
        <div className="flex items-center gap-3 min-w-0">
          <button 
            onClick={onBack} 
            className="p-1.5 rounded-full bg-slate-50 text-slate-900 border border-slate-200/50 active:scale-90 transition-all"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
          <div className="flex flex-col min-w-0">
            <h2 className="text-[13px] font-black text-slate-900 truncate leading-tight">
              {tour.tourTitle}
            </h2>
            <p className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">{tour.stops.length} {t('checkpoints')}</p>
          </div>
        </div>

        {/* Tab Toggle - Pill Style */}
        <div className="flex bg-slate-100 p-0.5 rounded-full border border-slate-200/30">
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black transition-all ${activeTab === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
          >
            <List className="w-3 h-3" />
            <span className="hidden sm:inline">{t('itinerary')}</span>
          </button>
          <button 
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black transition-all ${activeTab === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
          >
            <MapIcon className="w-3 h-3" />
            <span className="hidden sm:inline">{t('explore')}</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative bg-slate-50">
        {activeTab === 'list' ? (
          <div className="h-full overflow-y-auto no-scrollbar p-3 space-y-2 animate-in fade-in duration-500 pb-32">
            <div className="max-w-screen-md mx-auto space-y-2">
              {tour.stops.map((stop, idx) => (
                <div key={idx} className="relative group">
                  {/* Vertical Progress Line */}
                  {idx < tour.stops.length - 1 && (
                    <div className={`absolute top-10 bottom-0 w-[1px] bg-slate-200 z-0 ${isRtl ? 'right-[18px]' : 'left-[18px]'}`} />
                  )}

                  <div className="relative z-10 flex gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      <button 
                        onClick={() => onSelectStop(idx)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shadow-sm border-2 transition-all ${activeTab === 'list' ? 'bg-slate-900 text-white border-white' : 'bg-white text-slate-400 border-slate-100'}`}
                      >
                        {idx + 1}
                      </button>
                      
                      {idx < tour.stops.length - 1 && (
                        <div className="my-3 py-1">
                          <div className="bg-white border border-slate-100 p-1 rounded-lg text-slate-300">
                            {getTransportIcon(tour.stops[idx+1].transportMode)}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div 
                        onClick={() => onSelectStop(idx)}
                        className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:border-slate-300 transition-all active:scale-[0.99] cursor-pointer flex gap-3 items-center"
                      >
                        {stop.visualUrl && (
                          <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden border border-slate-50">
                            <img src={stop.visualUrl} alt={stop.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-0.5 gap-2">
                            <h3 className="text-sm font-bold text-slate-800 leading-tight truncate">
                              {stop.name}
                            </h3>
                            <div className={`shrink-0 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase ${stop.estimatedCost === 0 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                              {stop.estimatedCost === 0 ? t('free') : `${stop.estimatedCost} ${tour.currency}`}
                            </div>
                          </div>
                          <p className="text-slate-500 text-[10px] font-medium leading-tight line-clamp-2">
                            {stop.description}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex items-center gap-1 text-[8px] font-black text-slate-400 uppercase tracking-wider">
                              <Clock className="w-2.5 h-2.5" />
                              {stop.costDescription || t('visit')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full relative animate-in fade-in duration-700">
            <TourMap 
              stops={tour.stops} 
              activeStopIndex={mapActiveIndex} 
              onStopClick={setMapActiveIndex} 
              currency={tour.currency} 
            />
            
            {/* Horizontal Mini Carousel */}
            <div 
              ref={scrollContainerRef}
              className="absolute bottom-4 left-0 right-0 flex gap-3 overflow-x-auto px-6 pb-2 no-scrollbar z-20 snap-x"
            >
              {tour.stops.map((stop, idx) => (
                <div 
                  key={idx}
                  onClick={() => setMapActiveIndex(idx)}
                  className={`snap-center flex-shrink-0 w-[240px] sm:w-[280px] bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border transition-all duration-300 ${mapActiveIndex === idx ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-transparent opacity-90'}`}
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black shrink-0 text-sm">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[11px] font-black text-slate-800 truncate">{stop.name}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {stop.estimatedCost === 0 ? t('free') : `${stop.estimatedCost} ${tour.currency}`}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onSelectStop(idx); }}
                      className="p-2 rounded-lg bg-slate-100 text-slate-900 active:scale-90 transition-all"
                    >
                      <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineDetailView;
