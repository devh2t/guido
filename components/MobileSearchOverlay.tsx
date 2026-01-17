
import React, { useRef, useEffect, useState } from 'react';
import { X, Search, LocateFixed, Loader, MapPin, ArrowRight, Wallet, Headphones, Check, Compass, Globe, ChevronDown } from 'lucide-react';
import { LANGUAGES, VOICES } from '../constants';

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  searchCityInput: string;
  setSearchCityInput: (city: string) => void;
  suggestions: string[];
  onSearch: (city: string) => void;
  isGeolocationLoading: boolean;
  onGeolocationSearch: () => void;
  budget: number;
  setBudget: (val: number) => void;
  currency: string;
  setCurrency: (val: string) => void;
  language: string;
  setLanguage: (val: string) => void;
  voice: string;
  setVoice: (val: string) => void;
  t: (key: string) => string;
}

const MobileSearchOverlay: React.FC<MobileSearchOverlayProps> = ({
  isOpen, onClose, searchCityInput, setSearchCityInput, suggestions,
  onSearch, isGeolocationLoading, onGeolocationSearch, 
  budget, setBudget, currency, setCurrency,
  language, setLanguage, voice, setVoice, t
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [minPrice, setMinPrice] = useState(200);
  const [maxPrice, setMaxPrice] = useState(800);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const SLIDER_MAX = 2000;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxPrice - 50);
    setMinPrice(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minPrice + 50);
    setMaxPrice(value);
    setBudget(value);
  };

  const getCurrencySymbol = () => {
    switch(currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      default: return currency;
    }
  };

  const selectedLang = LANGUAGES.find(l => l.code === language);

  return (
    <div className="fixed inset-0 z-[500] flex flex-col justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div 
        className="relative bg-white w-full rounded-t-[2rem] shadow-2xl flex flex-col max-h-[95vh] animate-in slide-in-from-bottom duration-400 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-1" />
        
        <div className="px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900">Plan Journey</h3>
          <button onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400 active:scale-90 transition-transform">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-7 no-scrollbar">
          
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-3 h-3" /> Destination
            </label>
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${searchCityInput ? 'text-orange-600' : 'text-slate-300'}`} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Where to?"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-transparent focus:border-orange-600/20 focus:bg-white transition-all font-bold text-slate-900 text-sm shadow-sm"
                value={searchCityInput}
                onChange={(e) => setSearchCityInput(e.target.value)}
              />
            </div>
            <button
              onClick={onGeolocationSearch}
              disabled={isGeolocationLoading}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-bold text-xs active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-2">
                {isGeolocationLoading ? <Loader className="w-4 h-4 animate-spin text-orange-600" /> : <LocateFixed className="w-4 h-4 text-orange-600" />}
                <span>Use current location</span>
              </div>
              <ArrowRight className="w-3 h-3 opacity-20" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                Price Range
              </label>
              <select 
                className="bg-slate-50 text-[10px] font-black text-slate-600 uppercase tracking-tighter px-2 py-1 rounded-lg border-none focus:ring-0" 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
              >
                {['USD', 'EUR', 'GBP', 'JPY', 'AED'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="relative px-2 pt-2 pb-8">
              <div className="absolute top-1/2 left-2 right-2 h-1 bg-slate-100 rounded-full -translate-y-1/2" />
              <div 
                className="absolute top-1/2 h-1 bg-slate-900 rounded-full -translate-y-1/2"
                style={{
                  left: `calc(${(minPrice / SLIDER_MAX) * 100}% + 8px)`,
                  right: `calc(${100 - (maxPrice / SLIDER_MAX) * 100}% + 8px)`
                }}
              />
              <input
                type="range" min="0" max={SLIDER_MAX} value={minPrice}
                onChange={handleMinChange}
                className="absolute top-1/2 left-0 w-full h-1 bg-transparent appearance-none cursor-pointer -translate-y-1/2 pointer-events-none custom-range-input z-20"
                style={{ pointerEvents: 'auto' }}
              />
              <input
                type="range" min="0" max={SLIDER_MAX} value={maxPrice}
                onChange={handleMaxChange}
                className="absolute top-1/2 left-0 w-full h-1 bg-transparent appearance-none cursor-pointer -translate-y-1/2 pointer-events-none custom-range-input z-30"
                style={{ pointerEvents: 'auto' }}
              />
              <div className="absolute -bottom-2 left-0 right-0 flex justify-between px-1 text-slate-400 font-medium text-xs">
                <span>{getCurrencySymbol()}{minPrice}</span>
                <span>{getCurrencySymbol()}{maxPrice}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Globe className="w-3 h-3" /> Language
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-lg">
                {selectedLang?.nativeName.split(' ')[0]}
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-900 text-sm appearance-none focus:bg-white focus:border-orange-600/20 transition-all outline-none"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Headphones className="w-3 h-3" /> Narrator Personality
            </label>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {VOICES.map(v => (
                <button 
                  key={v.id} 
                  onClick={() => setVoice(v.id)} 
                  className={`flex flex-col items-center shrink-0 w-24 p-3 rounded-2xl border-2 transition-all ${voice === v.id ? 'bg-white border-orange-600 shadow-md' : 'bg-slate-50 border-transparent opacity-80'}`}
                >
                  <div className="relative mb-2">
                    <img src={v.image} alt={v.name} className="w-12 h-12 rounded-lg object-cover" />
                    {voice === v.id && (
                      <div className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white p-0.5 rounded-full border-2 border-white">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold truncate w-full text-center ${voice === v.id ? 'text-orange-600' : 'text-slate-500'}`}>{v.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 pb-8 pt-4 bg-white border-t border-slate-50">
          <button 
            disabled={!searchCityInput.trim()}
            onClick={() => onSearch(searchCityInput)}
            className="w-full py-4 bg-slate-900 disabled:bg-slate-200 text-white rounded-xl font-bold text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-5 h-5" />
            Curate My Journey
          </button>
        </div>
      </div>

      <style>{`
        .custom-range-input {
          -webkit-appearance: none;
          background: transparent;
        }
        .custom-range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          cursor: pointer;
          pointer-events: auto;
          transition: transform 0.1s ease;
        }
        .custom-range-input:active::-webkit-slider-thumb {
          transform: scale(1.1);
          border-color: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default MobileSearchOverlay;
