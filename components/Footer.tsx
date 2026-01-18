
import React from 'react';
import { Compass, Heart } from 'lucide-react';

interface FooterProps {
  view: 'explore' | 'saved';
  setView: (val: 'explore' | 'saved') => void;
  t: (key: string) => string;
}

const Footer: React.FC<FooterProps> = ({ view, setView, t }) => {
  const isRtl = document.documentElement.dir === 'rtl';

  return (
    <div className="fixed bottom-6 left-0 right-0 px-8 z-[400] pointer-events-none">
      <footer className="max-w-[320px] mx-auto pointer-events-auto">
        {/* Compact fully rounded pill container */}
        <div className="relative bg-white/95 backdrop-blur-md border border-slate-200 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.08)] rounded-full p-1 flex items-center justify-around overflow-hidden">
          
          {/* Smooth pill-shaped indicator */}
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-slate-100 rounded-full transition-all duration-300 ease-out ${
              view === 'explore' 
                ? (isRtl ? 'translate-x-full' : '-translate-x-full') 
                : 'translate-x-0'
            }`}
            style={{ 
              left: isRtl ? 'auto' : '50%',
              right: isRtl ? '50%' : 'auto',
              transform: view === 'explore' 
                ? (isRtl ? 'translateX(50%)' : 'translateX(-50%)') 
                : (isRtl ? 'translateX(-50%)' : 'translateX(50%)')
            }}
          />

          {/* Explore Tab */}
          <button 
            onClick={() => setView('explore')} 
            className={`relative z-10 flex-1 flex flex-col items-center justify-center py-2.5 transition-all duration-200 active:scale-95 ${
              view === 'explore' ? 'text-slate-900' : 'text-slate-400'
            }`}
          >
            <Compass className={`w-[18px] h-[18px] mb-0.5 transition-transform duration-300 ${view === 'explore' ? 'scale-100 opacity-100' : 'opacity-60'}`} />
            <span className={`text-[9px] font-black uppercase tracking-wider`}>
              {t('explore')}
            </span>
          </button>

          {/* Wishlist Tab */}
          <button 
            onClick={() => setView('saved')} 
            className={`relative z-10 flex-1 flex flex-col items-center justify-center py-2.5 transition-all duration-200 active:scale-95 ${
              view === 'saved' ? 'text-slate-900' : 'text-slate-400'
            }`}
          >
            <Heart className={`w-[18px] h-[18px] mb-0.5 transition-transform duration-300 ${view === 'saved' ? 'scale-100 opacity-100' : 'opacity-60'}`} />
            <span className={`text-[9px] font-black uppercase tracking-wider`}>
              {t('wishlist')}
            </span>
          </button>

        </div>
      </footer>
    </div>
  );
};

export default Footer;
