
import React from 'react';
import { Home, Compass, Heart, User } from 'lucide-react';

interface FooterProps {
  view: 'home' | 'explore' | 'saved' | 'profile' | 'timeline';
  setView: (val: 'home' | 'explore' | 'saved' | 'profile') => void;
  t: (key: string) => string;
}

const Footer: React.FC<FooterProps> = ({ view, setView, t }) => {
  const isRtl = document.documentElement.dir === 'rtl';

  const getTranslateX = () => {
    // 4 tabs means each takes 25%
    if (view === 'home') return isRtl ? '150%' : '-150%';
    if (view === 'explore') return isRtl ? '50%' : '-50%';
    if (view === 'saved') return isRtl ? '-50%' : '50%';
    if (view === 'profile') return isRtl ? '-150%' : '150%';
    return '0%';
  };

  return (
    <div className="fixed bottom-6 inset-x-0 px-6 z-[400] pointer-events-none">
      <footer className="max-w-[420px] mx-auto pointer-events-auto">
        <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-[0_12px_35px_-10px_rgba(0,0,0,0.12)] rounded-full p-1 flex items-center justify-around overflow-hidden">
          
          <div 
            className="absolute top-1 bottom-1 w-[calc(25%-4px)] bg-slate-100 dark:bg-white/10 rounded-full transition-all duration-300 ease-out"
            style={{ 
              left: isRtl ? 'auto' : '37.5%', 
              right: isRtl ? '37.5%' : 'auto',
              transform: `translateX(${getTranslateX()})`
            }}
          />

          <button onClick={() => setView('home')} className={`relative z-10 flex-1 flex flex-col items-center justify-center py-2.5 transition-all active:scale-95 ${view === 'home' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
            <Home className="w-[18px] h-[18px] mb-0.5" />
            <span className="text-[9px] font-black uppercase tracking-wider">{isRtl ? 'الرئيسية' : 'HOME'}</span>
          </button>

          <button onClick={() => setView('explore')} className={`relative z-10 flex-1 flex flex-col items-center justify-center py-2.5 transition-all active:scale-95 ${view === 'explore' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
            <Compass className="w-[18px] h-[18px] mb-0.5" />
            <span className="text-[9px] font-black uppercase tracking-wider">{isRtl ? 'استكشاف' : 'EXPLORE'}</span>
          </button>

          <button onClick={() => setView('saved')} className={`relative z-10 flex-1 flex flex-col items-center justify-center py-2.5 transition-all active:scale-95 ${view === 'saved' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
            <Heart className="w-[18px] h-[18px] mb-0.5" />
            <span className="text-[9px] font-black uppercase tracking-wider">{isRtl ? 'المفضلة' : 'WISHLIST'}</span>
          </button>

          <button onClick={() => setView('profile')} className={`relative z-10 flex-1 flex flex-col items-center justify-center py-2.5 transition-all active:scale-95 ${view === 'profile' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
            <User className="w-[18px] h-[18px] mb-0.5" />
            <span className="text-[9px] font-black uppercase tracking-wider">{isRtl ? 'حسابي' : 'PROFILE'}</span>
          </button>

        </div>
      </footer>
    </div>
  );
};

export default Footer;
