
import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react'; 

interface HeaderProps {
  onOpenMobileSearch: () => void;
  activeTourCity: string;
  t: (key: string) => string;
  loading: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onOpenMobileSearch, activeTourCity, t, loading
}) => {
  return (
    <header className="bg-indigo-600 text-white shadow-md sticky top-0 z-[100] py-2">
      <div className="max-w-[1440px] mx-auto px-4 flex items-center justify-between gap-2">
        
        <div className="flex items-center shrink-0 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center font-black text-white text-base shadow-lg">K</div>
          <h1 className="hidden sm:block ml-2 text-lg font-black tracking-tight uppercase">Kuratour</h1>
        </div>

        {/* Universal Command Bar Trigger - Compact Version */}
        <div className="flex items-center gap-2 flex-1 justify-end max-w-xl">
          <button 
            onClick={onOpenMobileSearch} 
            disabled={loading}
            className="w-full flex items-center gap-2 py-1.5 px-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-indigo-50 font-bold text-[11px] text-start transition-all active:scale-[0.98] hover:bg-white/20"
          >
            <Search className="w-3.5 h-3.5 text-white/60 shrink-0" />
            <span className="truncate flex-1">
              {activeTourCity ? `${activeTourCity}` : t('enterCity')}
            </span>
            <div className="flex items-center gap-1.5 border-l border-white/20 pl-2 ml-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
