
import React, { useEffect, useRef } from 'react';
import { Tour, Stop } from '../types';
import { Bookmark, PlayCircle, StopCircle, ArrowRight, Footprints, Bus, TramFront, TrainFront, Loader, List, Clock, Ship, Car, Mountain } from 'lucide-react';

interface TourDisplayProps {
  tour: Tour;
  activeStopIndex: number;
  onStopChange: (index: number) => void;
  onPlayNarration: (text: string) => void;
  isPlaying: boolean;
  loadingAudio: boolean;
  onSave: () => void;
  onShare: () => void;
  onShowTimeline: () => void;
  language: string;
  t: (key: string) => string;
}

const TourDisplay: React.FC<TourDisplayProps> = ({
  tour, activeStopIndex, onStopChange, onPlayNarration,
  isPlaying, loadingAudio, onSave, onShare, onShowTimeline, language, t
}) => {
  const activeStop = tour.stops[activeStopIndex];
  const isLastStop = activeStopIndex === tour.stops.length - 1;
  const timelineRef = useRef<HTMLDivElement>(null);
  const isRtl = document.documentElement.dir === 'rtl';

  useEffect(() => {
    if (timelineRef.current) {
      const activeElement = timelineRef.current.children[activeStopIndex * 2]; 
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    }
  }, [activeStopIndex]);

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

  return (
    <div className={`w-full space-y-3 text-start ${isRtl ? 'font-arabic' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
             <span className="bg-orange-100 text-orange-600 text-[9px] font-black uppercase px-2 py-0.5 rounded-lg tracking-wider">{tour.city}</span>
             <span className="bg-slate-100 text-slate-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-lg tracking-wider">
               {tour.totalEstimatedCost} {tour.currency}
             </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2 tracking-tight">{tour.tourTitle}</h2>
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 font-medium">{tour.overview}</p>
        </div>

        <div className="flex gap-3 mt-5 relative z-10">
          <button onClick={onSave} className="flex-1 flex items-center justify-center gap-2 text-[11px] font-bold text-slate-700 bg-slate-50 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors">
            <Bookmark className="w-4 h-4" />
            {t('save')}
          </button>
          <button onClick={onShowTimeline} className="flex-1 flex items-center justify-center gap-2 text-[11px] font-bold text-orange-600 bg-orange-50 px-4 py-3 rounded-xl hover:bg-orange-100 transition-colors">
            <List className="w-4 h-4" />
            {t('itinerary')}
          </button>
        </div>
        
        <div className="mt-6 bg-slate-50 p-2.5 rounded-2xl overflow-x-auto no-scrollbar" ref={timelineRef}>
          <div className="flex items-center w-max gap-2">
            {tour.stops.map((stop, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <div className="flex items-center opacity-20 px-1">
                    <div className="w-3 h-px bg-slate-400"></div>
                  </div>
                )}
                <button
                  onClick={() => onStopChange(index)}
                  className={`flex-shrink-0 w-32 p-3 rounded-xl text-start transition-all border shadow-sm ${activeStopIndex === index ? 'bg-slate-900 text-white border-slate-900 scale-105' : 'bg-white text-slate-700 border-slate-100'}`}
                >
                  <h3 className={`font-black text-[10px] leading-tight truncate ${activeStopIndex === index ? 'text-white' : 'text-slate-800'}`}>
                    {index + 1}. {stop.name}
                  </h3>
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {activeStop && (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 animate-in fade-in zoom-in duration-300">
          <div className="flex items-center gap-4 mb-5">
            <span className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-xl shadow-slate-200">{activeStopIndex + 1}</span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{activeStop.name}</h3>
          </div>
          
          {activeStop.visualUrl && (
            <div className="mb-5 rounded-[2rem] overflow-hidden aspect-video border border-slate-50 shadow-inner">
              <img src={activeStop.visualUrl} alt={activeStop.name} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="space-y-4">
            <p className="text-slate-500 text-sm leading-relaxed font-medium">{activeStop.description}</p>
            
            <div className="bg-slate-50/50 p-5 rounded-[1.5rem] border border-slate-100 italic">
              <p className="text-slate-700 text-sm leading-relaxed font-medium">{activeStop.commentary}</p>
            </div>

            <div className="flex items-center gap-6 py-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('visit')}</p>
                  <p className="text-[11px] font-bold text-slate-700">{activeStop.costDescription || '30-45 mins'}</p>
                </div>
              </div>

              {activeStop.transportMode && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                    {getTransportIcon(activeStop.transportMode)}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isRtl ? 'التنقل' : 'Transport'}</p>
                    <p className="text-[11px] font-bold text-slate-700">{activeStop.transportMode}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 pt-4">
              <button
                onClick={() => onPlayNarration(activeStop.commentary)}
                disabled={loadingAudio}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-sm transition-all shadow-lg ${isPlaying ? 'bg-red-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'}`}
              >
                {loadingAudio ? <Loader className="w-5 h-5 animate-spin" /> : isPlaying ? <StopCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                {loadingAudio ? '...' : isPlaying ? t('stopSession') : t('hearNarration')}
              </button>
              
              {!isLastStop && (
                <button
                  onClick={() => onStopChange(activeStopIndex + 1)}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm bg-white border-2 border-slate-100 text-slate-700 active:bg-slate-50 active:scale-95 transition-all shadow-sm"
                >
                  <span>{t('nextStop')}</span>
                  <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDisplay;
