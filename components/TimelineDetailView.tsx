
import React, { useState, useRef, useEffect } from 'react';
import { Tour, Stop } from '../types';
import TourMap from './TourMap';
import { 
  ArrowLeft, 
  Footprints, 
  Bus, 
  TramFront, 
  TrainFront, 
  Clock, 
  ChevronRight, 
  Ship, 
  Car, 
  Mountain, 
  Timer,
  Map as MapIcon,
  List,
  Navigation2,
  CircleDollarSign
} from 'lucide-react';

interface TimelineDetailViewProps {
  tour: Tour;
  onBack: () => void;
  onSelectStop: (index: number) => void;
  t: (key: string) => string;
}

const TimelineDetailView: React.FC<TimelineDetailViewProps> = ({ tour, onBack, onSelectStop, t }) => {
  const [mapActiveIndex, setMapActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isRtl = document.documentElement.dir === 'rtl';

  const getTransportIcon = (mode?: string, size: string = "w-4 h-4") => {
    switch (mode?.toLowerCase()) {
      case 'walking': return <Footprints className={size} />;
      case 'bus': return <Bus className={size} />;
      case 'tram': return <TramFront className={size} />;
      case 'metro': return <TrainFront className={size} />;
      case 'ferry': return <Ship className={size} />;
      case 'taxi': return <Car className={size} />;
      case 'cable_car': return <Mountain className={size} />;
      default: return <Footprints className={size} />;
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current && activeTab === 'map') {
      const container = scrollContainerRef.current;
      const activeCard = container.children[mapActiveIndex] as HTMLElement;
      if (activeCard) {
        const scrollOffset = activeCard.offsetLeft - (container.offsetWidth / 2) + (activeCard.offsetWidth / 2);
        container.scrollTo({ left: scrollOffset, behavior: 'smooth' });
      }
    }
  }, [mapActiveIndex, activeTab]);

  const handleMarkerClick = (index: number) => {
    setMapActiveIndex(index);
  };

  return (
    <div className={`fixed inset-0 z-[500] bg-slate-50 dark:bg-slate-950 flex flex-col animate-in fade-in slide-in-from-bottom duration-500 overflow-hidden ${isRtl ? 'font-arabic' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header Overlay */}
      <div className="absolute top-6 left-0 right-0 z-[1010] px-6 pointer-events-none">
        <div className="max-w-2xl mx-auto flex items-center justify-between relative pointer-events-auto h-12">
          <button 
            onClick={onBack} 
            className="p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl text-slate-900 dark:text-white active:scale-90 transition-all shadow-xl border border-slate-100 dark:border-white/5"
          >
            <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 flex bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-1 rounded-2xl shadow-xl border border-slate-100 dark:border-white/5">
            <button 
              onClick={() => setActiveTab('map')}
              className={`p-2.5 rounded-xl transition-all flex items-center gap-2 ${activeTab === 'map' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <MapIcon className="w-4 h-4" />
              {activeTab === 'map' && <span className="text-[10px] font-black uppercase tracking-wider pr-1">Map</span>}
            </button>
            <button 
              onClick={() => setActiveTab('list')}
              className={`p-2.5 rounded-xl transition-all flex items-center gap-2 ${activeTab === 'list' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List className="w-4 h-4" />
              {activeTab === 'list' && <span className="text-[10px] font-black uppercase tracking-wider pr-1">List</span>}
            </button>
          </div>
          <div className="w-11" />
        </div>
      </div>

      <div className="relative flex-1 bg-white dark:bg-slate-950">
        <div className={`absolute inset-0 transition-opacity duration-500 ${activeTab === 'map' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <TourMap 
            stops={tour.stops} 
            activeStopIndex={mapActiveIndex} 
            onStopClick={handleMarkerClick} 
            currency={tour.currency} 
          />
          
          <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-slate-900/60 dark:from-black/80 via-transparent to-transparent pointer-events-none" />

          {/* Enhanced Map Carousel */}
          <div className="absolute bottom-8 left-0 right-0 z-[520]">
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto px-6 pb-4 no-scrollbar snap-x"
            >
              {tour.stops.map((stop, idx) => (
                <div 
                  key={idx}
                  onClick={() => setMapActiveIndex(idx)}
                  className={`snap-center flex-shrink-0 w-[310px] bg-white dark:bg-slate-900 rounded-[1.5rem] p-4 shadow-2xl transition-all duration-500 cursor-pointer ${
                    mapActiveIndex === idx 
                    ? 'scale-100 translate-y-0 shadow-slate-900/20 dark:shadow-white/5 ring-1 ring-slate-100 dark:ring-white/10' 
                    : 'opacity-70 scale-90 translate-y-4 shadow-none'
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    {/* Top Section: Image & Info */}
                    <div className="flex gap-4">
                      <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/10 shadow-sm">
                          <img src={stop.visualUrl} className="w-full h-full object-cover" alt={stop.name} />
                        </div>
                        <div className="absolute -top-1.5 -left-1.5 w-7 h-7 bg-orange-600 text-white rounded-lg flex items-center justify-center text-[11px] font-black shadow-lg border-2 border-white dark:border-slate-900">
                          {idx + 1}
                        </div>
                      </div>
                      
                      <div className="min-w-0 flex-1 flex flex-col justify-center">
                        <h4 className="text-[15px] font-black text-slate-900 dark:text-white truncate mb-1 leading-tight">{stop.name}</h4>
                        <div className="flex items-center gap-1.5">
                           <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-100 dark:border-orange-500/20">
                             {stop.estimatedCost === 0 ? t('free') : `${stop.estimatedCost} ${tour.currency}`}
                           </span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSelectStop(idx); }}
                        className="w-10 h-10 shrink-0 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center active:scale-90 transition-all shadow-md"
                      >
                        <ChevronRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* Detailed Logistics Command Bar */}
                    <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-3 flex items-center justify-between border border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-4">
                        {/* Enlarged Transport Pill */}
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white shadow-sm border border-slate-100 dark:border-white/10">
                            {getTransportIcon(stop.transportMode, "w-4 h-4")}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('transport') || 'Travel'}</span>
                            <span className="text-[10px] font-bold text-slate-900 dark:text-slate-200 capitalize">{stop.transportMode || 'Walk'}</span>
                          </div>
                        </div>
                        
                        {/* Enhanced Distance Info */}
                        {stop.distanceFromPrevious && idx > 0 && (
                          <div className="flex items-center gap-2 border-l border-slate-200 dark:border-white/10 pl-4">
                            <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100 dark:border-white/10">
                              <Navigation2 className="w-4 h-4 fill-indigo-500" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('distance') || 'Dist'}</span>
                              <span className="text-[10px] font-bold text-slate-900 dark:text-slate-200">{stop.distanceFromPrevious}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Visit Duration */}
                      <div className="flex flex-col items-end">
                         <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                           <Timer className="w-3.5 h-3.5" />
                           <span className="text-[10px] font-black uppercase tracking-wider">{stop.costDescription?.split(' ')[0] || '30m'}</span>
                         </div>
                         <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-0.5">{t('visit') || 'Stay'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vertical List View */}
        <div className={`absolute inset-0 bg-white dark:bg-slate-950 transition-transform duration-500 ease-in-out ${activeTab === 'list' ? 'translate-x-0' : (isRtl ? 'translate-x-full' : '-translate-x-full')} overflow-y-auto no-scrollbar pt-28 pb-32`}>
          <div className="max-w-md mx-auto px-6 relative">
            <div className="mb-8 text-start">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{tour.tourTitle}</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{tour.city} • {tour.stops.length} {t('checkpoints')}</p>
            </div>

            <div className={`absolute ${isRtl ? 'right-[43px]' : 'left-[43px]'} top-28 bottom-4 w-[2px] bg-slate-100 dark:bg-white/5 z-0`}></div>

            <div className="space-y-10 relative z-10 text-start">
              {tour.stops.map((stop, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="shrink-0">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-xl transition-all duration-300 ${mapActiveIndex === idx ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 scale-110' : 'bg-white dark:bg-slate-900 text-slate-300 dark:text-slate-600 border border-slate-100 dark:border-white/5'}`}>
                      {idx + 1}
                    </div>
                  </div>

                  <div 
                    onClick={() => { setMapActiveIndex(idx); onSelectStop(idx); }}
                    className={`flex-1 p-5 rounded-[2rem] border transition-all duration-300 cursor-pointer ${mapActiveIndex === idx ? 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 shadow-sm' : 'bg-white dark:bg-slate-950 border-transparent hover:bg-slate-50 dark:hover:bg-white/5'}`}
                  >
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight">{stop.name}</h4>
                      <span className="shrink-0 text-[10px] font-black text-orange-600 bg-orange-50 dark:bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-100 dark:border-orange-500/20">
                        {stop.estimatedCost === 0 ? t('free') : `${stop.estimatedCost} ${tour.currency}`}
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 font-medium leading-relaxed">{stop.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-slate-400">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-white/5 flex items-center justify-center text-indigo-500">
                          {getTransportIcon(stop.transportMode, "w-3.5 h-3.5")}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider">{stop.transportMode || 'Walking'}</span>
                      </div>
                      
                      {stop.distanceFromPrevious && idx > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400">
                            <Timer className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider">{stop.distanceFromPrevious}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineDetailView;
