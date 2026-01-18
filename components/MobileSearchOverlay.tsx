
import { useRef, useEffect, useState } from 'react';
import { X, Search, LocateFixed, Loader, MapPin, ArrowRight, Check, Compass, Globe, ChevronDown, Headphones } from 'lucide-react';
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
  minBudget: number;
  setMinBudget: (val: number) => void;
  maxBudget: number;
  setMaxBudget: (val: number) => void;
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
  minBudget, setMinBudget, maxBudget, setMaxBudget,
  currency, setCurrency,
  language, setLanguage, voice, setVoice, t
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLangPickerOpen, setIsLangPickerOpen] = useState(false);

  const isRtl = document.documentElement.dir === 'rtl';
  const SLIDER_MAX = 5000;

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxBudget - 100);
    setMinBudget(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minBudget + 100);
    setMaxBudget(value);
  };

  const getCurrencySymbol = () => {
    switch(currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      case 'AED': return 'د.إ';
      case 'MAD': return 'DH';
      default: return currency;
    }
  };

  const selectedLang = LANGUAGES.find(l => l.code === language);
  const minPercent = (minBudget / SLIDER_MAX) * 100;
  const maxPercent = (maxBudget / SLIDER_MAX) * 100;

  const trackStyle = isRtl ? {
    right: `${minPercent}%`,
    width: `${maxPercent - minPercent}%`
  } : {
    left: `${minPercent}%`,
    width: `${maxPercent - minPercent}%`
  };

  const handleAction = () => {
    if (searchCityInput.trim()) {
      onSearch(searchCityInput.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex flex-col justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div 
        className="relative bg-white w-full rounded-t-[2rem] shadow-2xl flex flex-col max-h-[95vh] animate-in slide-in-from-bottom duration-400 ease-out"
        onClick={(e) => e.stopPropagation()}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-1" />
        
        <div className="px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">{t('curateJourney')}</h3>
          <button onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400 active:scale-90 transition-transform">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-7 no-scrollbar">
          
          <div className="space-y-3 text-start">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-3 h-3" /> {t('destination')}
            </label>
            <div className="relative">
              <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${searchCityInput ? 'text-orange-600' : 'text-slate-300'}`} />
              <input
                ref={inputRef}
                type="text"
                placeholder={t('whereTo')}
                className={`w-full ${isRtl ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'} py-3.5 rounded-xl bg-slate-50 border border-transparent focus:border-orange-600/20 focus:bg-white transition-all font-bold text-slate-900 text-sm shadow-sm outline-none`}
                value={searchCityInput}
                onChange={(e) => setSearchCityInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAction()}
              />
            </div>
            <button
              onClick={onGeolocationSearch}
              disabled={isGeolocationLoading}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-bold text-xs active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-2">
                {isGeolocationLoading ? <Loader className="w-4 h-4 animate-spin text-orange-600" /> : <LocateFixed className="w-4 h-4 text-orange-600" />}
                <span>{t('useCurrentLocation')}</span>
              </div>
              <ArrowRight className={`w-3 h-3 opacity-20 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                {t('priceRange')}
              </label>
              <select 
                className="bg-slate-50 text-[10px] font-black text-slate-600 uppercase tracking-tighter px-2 py-1 rounded-lg border-none focus:ring-0 outline-none" 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
              >
                {['USD', 'EUR', 'GBP', 'JPY', 'AED', 'MAD'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="relative px-2 pt-2 pb-8 h-8">
              <div className="absolute top-1/2 left-2 right-2 h-1.5 bg-slate-100 rounded-full -translate-y-1/2" />
              <div 
                className="absolute top-1/2 h-1.5 bg-slate-900 rounded-full -translate-y-1/2 z-10"
                style={trackStyle}
              />
              <input
                type="range" min="0" max={SLIDER_MAX} value={minBudget}
                onChange={handleMinChange}
                className="absolute top-1/2 left-0 w-full h-1 bg-transparent appearance-none cursor-pointer -translate-y-1/2 pointer-events-none custom-range-input z-20"
                style={{ pointerEvents: 'auto' }}
              />
              <input
                type="range" min="0" max={SLIDER_MAX} value={maxBudget}
                onChange={handleMaxChange}
                className="absolute top-1/2 left-0 w-full h-1 bg-transparent appearance-none cursor-pointer -translate-y-1/2 pointer-events-none custom-range-input z-30"
                style={{ pointerEvents: 'auto' }}
              />
              <div className="absolute -bottom-2 left-0 right-0 flex justify-between px-1 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                <span>{getCurrencySymbol()}{minBudget}</span>
                <span>{getCurrencySymbol()}{maxBudget}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-start">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Globe className="w-3 h-3" /> {t('audioLang')}
            </label>
            <button
              onClick={() => setIsLangPickerOpen(true)}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-bold text-sm active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl leading-none">{selectedLang?.nativeName.split(' ')[0]}</span>
                <span>{selectedLang?.nativeName.split(' ')[1]}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-active:text-orange-600" />
            </button>
          </div>

          <div className="space-y-3 text-start">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Headphones className="w-3 h-3" /> {t('narrator')}
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
                      <div className={`absolute -top-1.5 ${isRtl ? '-left-1.5' : '-right-1.5'} bg-orange-600 text-white p-0.5 rounded-full border-2 border-white`}>
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
            onClick={handleAction}
            className="w-full py-4 bg-slate-900 disabled:bg-slate-200 text-white rounded-xl font-bold text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-5 h-5" />
            {t('curateJourney')}
          </button>
        </div>
      </div>

      {isLangPickerOpen && (
        <div className="fixed inset-0 z-[600] flex flex-col justify-end bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsLangPickerOpen(false)} />
          <div className="relative bg-white rounded-t-[2.5rem] flex flex-col max-h-[70vh] animate-in slide-in-from-bottom duration-300" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-1" />
            <div className="px-6 py-4 flex justify-between items-center border-b border-slate-50">
              <h4 className="text-base font-black text-slate-900 tracking-tight">Select Language</h4>
              <button onClick={() => setIsLangPickerOpen(false)} className="text-orange-600 font-bold text-sm">Done</button>
            </div>
            <div className="overflow-y-auto px-2 py-4 no-scrollbar">
              <div className="grid grid-cols-1">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangPickerOpen(false);
                    }}
                    className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${language === lang.code ? 'bg-orange-50 text-orange-700' : 'text-slate-600 active:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{lang.nativeName.split(' ')[0]}</span>
                      <span className="font-bold text-sm">{lang.nativeName.split(' ')[1]}</span>
                    </div>
                    {language === lang.code && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
        [dir="rtl"] .custom-range-input {
          transform: translateY(-50%) scaleX(-1);
        }
      `}</style>
    </div>
  );
};

export default MobileSearchOverlay;
