
import React, { useEffect, useState } from 'react';
import { Tour } from '../types';
import { 
  ArrowRight, 
  Footprints, 
  Bus, 
  TramFront, 
  TrainFront, 
  Ship, 
  Car, 
  Mountain,
  Share2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Volume2,
  StopCircle,
  Eye,
  Bookmark,
  ArrowLeft
} from 'lucide-react';

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
  onBack: () => void;
}

const TourDisplay: React.FC<TourDisplayProps> = ({
  tour, activeStopIndex, onStopChange, onPlayNarration,
  isPlaying, loadingAudio, onSave, onShare, onShowTimeline, language, t, onBack
}) => {
  const activeStop = tour.stops[activeStopIndex];
  const isLastStop = activeStopIndex === tour.stops.length - 1;
  const isRtl = document.documentElement.dir === 'rtl';
  
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
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
    <div className={`w-full space-y-4 text-start pb-10 ${isRtl ? 'font-arabic' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Back & Navigation Header */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={onBack} className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm active:scale-90 transition-transform">
          <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Main Trip Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -translate-y-16 translate-x-16" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
             <span className="bg-orange-50 dark:bg-orange-500/10 text-orange-600 text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-wider flex items-center gap-1.5">
               <MapPin className="w-3 h-3" /> {tour.city.toUpperCase()}
             </span>
             <span className="bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-wider">
               {tour.totalEstimatedCost} {tour.currency}
             </span>
          </div>
          
          <div className="flex justify-between items-start gap-4 mb-8">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight flex-1">
              {tour.tourTitle}
            </h2>
            <button 
              onClick={onShare}
              className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={onSave} 
              className="flex-[1.2] flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-white/5 py-5 rounded-[1.8rem] border border-slate-100 dark:border-white/5 active:scale-[0.97] transition-all"
            >
              <Bookmark className="w-5 h-5 text-slate-900 dark:text-white" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                Ajouter aux Favoris
              </span>
            </button>
            <button 
              onClick={onShowTimeline} 
              className="flex-1 flex flex-col items-center justify-center gap-2 bg-[#FFF1E6] dark:bg-orange-500/20 py-5 rounded-[1.8rem] border border-[#FFE4D0] dark:border-orange-500/20 active:scale-[0.97] transition-all"
            >
              <Eye className="w-5 h-5 text-orange-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">
                Full Itinerary
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Stop Detail Card */}
      {activeStop && (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-white/5 animate-in fade-in duration-500">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight flex-1 mr-4">
                {activeStop.name}
              </h3>
              <div className="bg-slate-100 dark:bg-white/10 px-4 py-1.5 rounded-full">
                <span className="text-xs font-black text-slate-900 dark:text-white tracking-widest">
                  {activeStopIndex + 1} / {tour.stops.length}
                </span>
              </div>
            </div>

            {/* Split Action Bar (Audio + Next Stop) */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onPlayNarration(activeStop.commentary)}
                disabled={loadingAudio}
                className="flex-[0.9] h-14 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-white/5 rounded-full flex items-center justify-center gap-3 active:scale-[0.97] transition-all shadow-sm group"
              >
                {isPlaying ? (
                   <StopCircle className="w-5 h-5 text-red-500" />
                ) : (
                   <Volume2 className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform" />
                )}
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-900 dark:text-white">
                  Audio-Guide
                </span>
              </button>

              <button
                onClick={() => onStopChange(isLastStop ? 0 : activeStopIndex + 1)}
                className="flex-1 h-14 bg-[#0F172A] dark:bg-white rounded-full flex items-center justify-center gap-3 active:scale-[0.97] transition-all shadow-xl"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white dark:text-[#0F172A]">
                  {isLastStop ? 'REPRENDRE' : 'PROCHAIN ARRÊT'}
                </span>
                <ArrowRight className={`w-4 h-4 text-white dark:text-[#0F172A] ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Image Container */}
            <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-inner">
              <img src={activeStop.visualUrl} alt={activeStop.name} className="w-full aspect-[4/3] object-cover" />
              {activeStop.transportMode && (
                <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg border border-white/20">
                  {getTransportIcon(activeStop.transportMode)}
                  <span className="text-[10px] font-black uppercase tracking-widest capitalize">{activeStop.transportMode}</span>
                </div>
              )}
            </div>

            {/* Commentary/Description */}
            <div className="relative">
              <p className={`text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium ${isExpanded ? '' : 'line-clamp-4'}`}>
                {activeStop.description}
              </p>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline"
              >
                {isExpanded ? 'Show Less' : 'Read More'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDisplay;
