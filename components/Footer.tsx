
import React from 'react';
import { Compass, Bookmark } from 'lucide-react';

interface FooterProps {
  view: 'explore' | 'saved';
  setView: (val: 'explore' | 'saved') => void;
  t: (key: string) => string;
}

const Footer: React.FC<FooterProps> = ({ view, setView, t }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-slate-100 p-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-around max-w-sm mx-auto">
        <button 
          onClick={() => setView('explore')} 
          className={`flex flex-col items-center transition-all duration-300 ${view === 'explore' ? 'text-indigo-600' : 'text-slate-300'}`}
        >
          <Compass className={`w-6 h-6 mb-1 ${view === 'explore' ? 'fill-indigo-600/10' : ''}`} />
          <span className="text-[10px] font-black uppercase tracking-tighter">{t('explore')}</span>
        </button>
        <button 
          onClick={() => setView('saved')} 
          className={`flex flex-col items-center transition-all duration-300 ${view === 'saved' ? 'text-indigo-600' : 'text-slate-300'}`}
        >
          <Bookmark className={`w-6 h-6 mb-1 ${view === 'saved' ? 'fill-indigo-600/10' : ''}`} />
          <span className="text-[10px] font-black uppercase tracking-tighter">{t('library')}</span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
