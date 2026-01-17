
import React, { useEffect, useRef } from 'react';
import { Tour, Stop } from '../types';
import { Share2, Bookmark, PlayCircle, StopCircle, ArrowRight, Footprints, Bus, TramFront, TrainFront, Loader, List } from 'lucide-react';

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

  useEffect(() => {
    if (timelineRef.current) {
      const activeElement = timelineRef.current.children[activeStopIndex * 2]; 
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    }
  }, [activeStopIndex]);

  const getTransportIcon = (mode?: 'walking' | 'bus' | 'tram' | 'metro') => {
    switch (mode) {
      case 'walking': return <Footprints className="w-3 h-3" />;
      case 'bus': return <Bus className="w-3 h-3" />;
      case 'tram': return <TramFront className="w-3 h-3" />;
      case 'metro': return <TrainFront className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="w-full space-y-3 text-start">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
             <span className="bg-orange-100 text-orange-600 text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider">{tour.city}</span>
             <span className="bg-green-50 text-green-600 text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider">
               {tour.totalEstimatedCost} {tour.currency}
             </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight mb-1">{tour.tourTitle}</h2>
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{tour.overview}</p>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={onSave} className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg">
            <Bookmark className="w-3.5 h-3.5" />
            {t('save')}
          </button>
          <button onClick={onShowTimeline} className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
            <List className="w-3.5 h-3.5" />
            Itinerary
          </button>
        </div>
        
        <div className="bg-slate-50/50 rounded-xl p-2 overflow-x-auto no-scrollbar" ref={timelineRef}>
          <div className="flex items-center w-max gap-1.5">
            {tour.stops.map((stop, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <div className="flex flex-col items-center flex-shrink-0 w-4 text-center opacity-30">
                    <div className="w-px h-4 bg-slate-300"></div>
                  </div>
                )}
                <button
                  onClick={() => onStopChange(index)}
                  className={`flex-shrink-0 w-28 p-2 rounded-lg text-start transition-all border ${activeStopIndex === index ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-100'}`}
                >
                  <h3 className={`font-bold text-[9px] leading-tight truncate ${activeStopIndex === index ? 'text-white' : 'text-slate-800'}`}>{index + 1}. {stop.name}</h3>
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {activeStop && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">{activeStopIndex + 1}</span>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{activeStop.name}</h3>
          </div>
          
          {activeStop.visualUrl && (
            <div className="mb-3 rounded-xl overflow-hidden aspect-video border border-slate-100">
              <img src={activeStop.visualUrl} alt={activeStop.name} className="w-full h-full object-cover" />
            </div>
          )}

          <p className="text-slate-500 text-xs mb-3 leading-relaxed font-medium">{activeStop.description}</p>
          
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
            <p className="text-slate-700 text-xs leading-relaxed font-medium">{activeStop.commentary}</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => onPlayNarration(activeStop.commentary)}
              disabled={loadingAudio}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all ${isPlaying ? 'bg-red-500 text-white shadow-lg' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-50'}`}
            >
              {loadingAudio ? <Loader className="w-4 h-4 animate-spin" /> : isPlaying ? <StopCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
              {loadingAudio ? 'Loading...' : isPlaying ? t('stopSession') : t('hearNarration')}
            </button>
            
            {!isLastStop && (
              <button
                onClick={() => onStopChange(activeStopIndex + 1)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-white border border-slate-200 text-slate-600 active:bg-slate-50"
              >
                <span>Next Stop</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDisplay;
