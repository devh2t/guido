
import React from 'react';
import { VOICES } from '../constants';
import { X, Mic } from 'lucide-react';

interface NarratorOverlayProps {
  isPlaying: boolean;
  voiceId: string;
  onStop: () => void;
  isRtl: boolean;
}

const NarratorOverlay: React.FC<NarratorOverlayProps> = ({ isPlaying, voiceId, onStop, isRtl }) => {
  if (!isPlaying) return null;

  const currentVoice = VOICES.find(v => v.id === voiceId) || VOICES[0];

  return (
    <div className={`fixed bottom-24 ${isRtl ? 'left-6' : 'right-6'} z-[450] animate-in slide-in-from-bottom-10 fade-in duration-500`}>
      <div className="relative group">
        {/* Pulsing Aura */}
        <div className="absolute inset-0 bg-orange-500/30 rounded-full animate-ping duration-[2000ms]" />
        
        {/* Sound Waves Animation */}
        <div className="absolute -inset-2 flex items-center justify-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className="w-1 bg-orange-400 rounded-full animate-bounce" 
              style={{ 
                height: '40%', 
                animationDuration: `${0.5 + i * 0.1}s`,
                animationDelay: `${i * 0.05}s` 
              }} 
            />
          ))}
        </div>

        {/* Narrator Container */}
        <div className="relative flex items-center bg-white rounded-full p-1 shadow-2xl border-2 border-orange-500">
          <div className="relative">
            <img 
              src={currentVoice.image} 
              alt={currentVoice.name} 
              className="w-14 h-14 rounded-full object-cover animate-pulse shadow-inner"
            />
            {/* Animated Mouth Overlay (Simple CSS Representation) */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-1 bg-red-400/80 rounded-full animate-pulse scale-y-150" />
            
            {/* Blinking Eyes simulation logic via pulse on a subtle overlay */}
            <div className="absolute top-5 left-3 right-3 flex justify-around opacity-0 animate-[pulse_3s_infinite]">
               <div className="w-1.5 h-1.5 bg-black/20 rounded-full" />
               <div className="w-1.5 h-1.5 bg-black/20 rounded-full" />
            </div>
          </div>

          <div className={`px-4 py-2 flex flex-col ${isRtl ? 'text-right' : 'text-left'}`}>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
              {currentVoice.name}
            </span>
            <span className="text-xs font-bold text-slate-900 whitespace-nowrap">
              {isRtl ? 'جاري الشرح...' : 'Narrating...'}
            </span>
          </div>

          <button 
            onClick={onStop}
            className="ml-2 mr-1 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className={`absolute -top-3 ${isRtl ? 'right-2' : 'left-2'} bg-orange-500 text-white p-1 rounded-full shadow-lg`}>
          <Mic className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};

export default NarratorOverlay;
