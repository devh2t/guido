
// Added React import to satisfy the React namespace usage in the component definition
import React, { useState, useRef, useEffect } from 'react';
import { Tour, Stop } from '../types';
import TourMap from './TourMap';
import { ArrowLeft, Footprints, Bus, TramFront, TrainFront, Clock, List, Map as MapIcon, Heart, ChevronRight, Headphones } from 'lucide-react';

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

  // Check if current direction is RTL
  const isRtl = document.documentElement.dir === 'rtl';

  const getTransportIcon = (mode?: 'walking' | 'bus' | 'tram' | 'metro') => {
    switch (mode) {
      case 'walking': return <Footprints className="w-4 h-4" />;
      case 'bus': return <Bus className="w-4 h-4" />;
      case 'tram': return <TramFront className="w-4 h-4" />;
      case 'metro': return <TrainFront className="w-4 h-4" />;
      default: return null;
    }
  };

  // Sync scroll position when mapActiveIndex changes for Map View
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
    <div className={`fixed inset-0 z-[250] bg-white flex flex-col animate-in fade-in slide-in-from-bottom duration-500 overflow-hidden ${isRtl ? 'rtl text-right' : 'ltr text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Premium Immersive Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 pt-4 pb-3 shrink-0 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack} 
              className="p-2 rounded-full bg-slate-50 text-slate-900 border border-slate-200/50 active:scale-90 transition-all shadow-sm"
            >
              <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
            <div className="flex flex-col">
              <h2 className="text-base font-black text-slate-900 tracking-tight leading-none truncate max-w-[160px]">
                {tour.tourTitle}
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{tour.city}</span>
                 <span className="w-0.5 h-0.5 rounded-full bg-slate-300"></span>
                 <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">{tour.stops.length} {t('checkpoints')}</span>
              </div>
            </div>
          </div>
          <button className="p-2 rounded-full bg-slate-50 text-slate-400 border border-slate-200/50">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-slate-100/80 p-1 rounded-2xl w-full max-w-[280px] mx-auto border border-slate-200/30">
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black transition-all duration-300 ${activeTab === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            <List className="w-3.5 h-3.5" />
            {t('explore')}
          </button>
          <button 
            onClick={() => setActiveTab('map')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black transition-all duration-300 ${activeTab === 'map' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            {isRtl ? 'الخريطة' : 'Map'}
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 overflow-hidden relative bg-slate-50">
        {activeTab === 'list' ? (
          <div className={`h-full overflow-y-auto no-scrollbar p-5 space-y-4 animate-in fade-in duration-500 pb-32`}>
            {tour.stops.map((stop, idx) => (
              <div key={idx} className="relative">
                {/* Fixed Timeline Connector for RTL */}
                {idx < tour.stops.length - 1 && (
                  <div className={`absolute top-14 bottom-0 w-0.5 bg-slate-200/80 rounded-full z-0 ${isRtl ? 'right-[24px]' : 'left-[24px]'}`} />
                )}

                <div className={`relative z-10 flex gap-5`}>
                  <div className="flex flex-col items-center shrink-0">
                    <button 
                      onClick={() => onSelectStop(idx)}
                      className="w-12 h-12 rounded-[1.5rem] bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-xl shadow-indigo-100 border-4 border-white active:scale-90 transition-all"
                    >
                      {idx + 1}
                    </button>
                    {idx < tour.stops.length - 1 && tour.stops[idx+1].transportMode && (
                      <div className="my-10 flex flex-col items-center gap-3">
                        <div className="bg-white border border-slate-200/60 p-2.5 rounded-2xl shadow-sm text-slate-400">
                          {getTransportIcon(tour.stops[idx+1].transportMode)}
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-full">
                          {tour.stops[idx+1].distanceFromPrevious}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 pb-8">
                    <div 
                      onClick={() => onSelectStop(idx)}
                      className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer group"
                    >
                      <div className={`flex justify-between items-start mb-3 gap-2`}>
                        <h3 className={`text-lg font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors`}>{stop.name}</h3>
                        <div className={`shrink-0 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${stop.estimatedCost === 0 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                          {stop.estimatedCost === 0 ? (isRtl ? 'مجاني' : 'FREE') : `${stop.estimatedCost} ${tour.currency}`}
                        </div>
                      </div>
                      {stop.visualUrl && (
                        <div className="mb-4 rounded-[1.5rem] overflow-hidden aspect-video border border-slate-100/50 shadow-inner">
                          <img src={stop.visualUrl} alt={stop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                      )}
                      <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2 mb-4">
                        {stop.description}
                      </p>
                      <div className="flex items-center gap-4 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          <Clock className="w-3 h-3" />
                          {stop.costDescription || (isRtl ? 'زيارة' : 'Visit')}
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-indigo-500 uppercase tracking-widest">
                          <Headphones className="w-3 h-3" />
                          {isRtl ? 'شرح صوتي' : 'Audio Guide'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full relative animate-in fade-in duration-700">
            <TourMap 
              stops={tour.stops} 
              activeStopIndex={mapActiveIndex} 
              onStopClick={setMapActiveIndex} 
              currency={tour.currency} 
            />
            
            {/* Horizontal Floating Stop Cards for Map View */}
            <div 
              ref={scrollContainerRef}
              className="absolute bottom-6 left-0 right-0 flex gap-4 overflow-x-auto px-6 pb-4 no-scrollbar z-20"
            >
              {tour.stops.map((stop, idx) => (
                <div 
                  key={idx}
                  onClick={() => setMapActiveIndex(idx)}
                  className={`flex-shrink-0 w-[280px] bg-white rounded-[2rem] p-4 shadow-2xl border-2 transition-all duration-300 ${mapActiveIndex === idx ? 'border-indigo-600 scale-105' : 'border-transparent opacity-90'}`}
                >
                  <div className="flex gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shrink-0">
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-black text-slate-800 truncate">{stop.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {stop.estimatedCost === 0 ? (isRtl ? 'مجاني' : 'Free Entry') : `${stop.estimatedCost} ${tour.currency}`}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onSelectStop(idx); }}
                    className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    {isRtl ? 'عرض التفاصيل' : 'View Details'}
                    <ChevronRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
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
