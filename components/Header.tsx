
import React from 'react';
import { Search, SlidersHorizontal, UserCircle } from 'lucide-react'; 

interface HeaderProps {
  onOpenMobileSearch: () => void;
  onOpenLogin: () => void;
  activeTourCity: string;
  t: (key: string) => string;
  loading: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onOpenMobileSearch, onOpenLogin, activeTourCity, t, loading
}) => {
  return (
    <header className="bg-white text-slate-900 border-b border-slate-100 sticky top-0 z-[100] py-2 md:py-3 backdrop-blur-md bg-white/95">
      <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between gap-6">
        
        {/* Brand Logo */}
        <div className="flex items-center shrink-0 cursor-pointer group" onClick={() => window.location.reload()}>
          <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-sm group-active:scale-95 transition-transform">K</div>
          <h1 className="hidden lg:block ml-3 text-lg font-black tracking-tighter uppercase text-slate-900">Kuratour</h1>
        </div>

        {/* Replicated Search Bar from Mockup */}
        <div className="flex-1 flex justify-center md:justify-center">
          <button 
            onClick={onOpenMobileSearch} 
            disabled={loading}
            className="w-full max-w-sm md:max-w-md flex items-center gap-3 py-2.5 px-5 rounded-full bg-white border border-slate-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] text-slate-600 transition-all active:scale-[0.98] hover:shadow-md group"
          >
            <Search className="w-5 h-5 text-slate-900 stroke-[1.5] shrink-0" />
            <span className="flex-1 text-sm font-medium text-slate-500 text-start truncate">
              {activeTourCity ? `${activeTourCity}` : "Where do you wanna go?"}
            </span>
            <div className="pl-3 border-l border-slate-100">
              <SlidersHorizontal className="w-4 h-4 text-slate-900 stroke-[1.5]" />
            </div>
          </button>
        </div>

        {/* Profile Action */}
        <div className="shrink-0">
          <button 
            onClick={onOpenLogin} 
            className="p-1 rounded-full text-slate-400 hover:text-slate-900 active:scale-90 transition-all"
            aria-label="Profile"
          >
            <UserCircle className="w-7 h-7" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
