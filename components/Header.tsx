
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
    <header className="bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 sticky top-0 z-[100] py-2 md:py-3 backdrop-blur-md bg-white/95 transition-colors">
      <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center shrink-0 cursor-pointer group" onClick={() => window.location.reload()}>
          <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center font-black text-white dark:text-slate-900 text-lg shadow-sm group-active:scale-95 transition-transform">K</div>
          <h1 className="hidden sm:block ml-3 text-lg font-black tracking-tighter uppercase text-slate-900 dark:text-white">Kuratour</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex justify-center">
          <button 
            onClick={onOpenMobileSearch} 
            disabled={loading}
            className="w-full max-w-sm md:max-w-md flex items-center gap-3 py-2.5 px-5 rounded-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] text-slate-600 dark:text-slate-400 transition-all active:scale-[0.98] hover:shadow-md group"
          >
            <Search className="w-4 h-4 text-slate-900 dark:text-white stroke-[2] shrink-0" />
            <span className="flex-1 text-sm font-medium text-slate-500 dark:text-slate-400 text-start truncate">
              {activeTourCity ? `${activeTourCity}` : "Where do you wanna go?"}
            </span>
            <div className="pl-3 border-l border-slate-100 dark:border-white/10">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-900 dark:text-white stroke-[2]" />
            </div>
          </button>
        </div>

        {/* Small spacer to balance logo if sm:block is not visible */}
        <div className="w-8 sm:hidden" />
      </div>
    </header>
  );
};

export default Header;
