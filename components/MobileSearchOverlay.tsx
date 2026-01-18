
import { useRef, useEffect, useState } from 'react';
import { X, Search, LocateFixed, Loader, MapPin, ArrowRight, Check, Compass, Globe, ChevronDown, Headphones, Banknote } from 'lucide-react';
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

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getCurrencySymbol = () => {
    switch(currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'MAD': return 'DH';
      default: return currency;
    }
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
          <button onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 no-scrollbar">
          {/* Destination */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-3 h-3" /> {t('destination')}
            </label>
            <div className="relative">
              <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300`} />
              <input
                ref={inputRef}
                type="text"
                placeholder={t('whereTo')}
                className={`w-full ${isRtl ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4'} py-3.5 rounded-xl bg-slate-50 font-bold text-slate-900 text-sm outline-none`}
                value={searchCityInput}
                onChange={(e) => setSearchCityInput(e.target.value)}
              />
            </div>
          </div>

          {/* Budget Inputs */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Banknote className="w-3 h-3" /> {t('priceRange')}
              </label>
              <select 
                className="bg-slate-50 text-[10px] font-black p-1 rounded-lg outline-none" 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
              >
                {['USD', 'EUR', 'MAD', 'GBP', 'AED'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">{isRtl ? 'الأدنى' : 'Min'}</span>
                <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{getCurrencySymbol()}</span>
                   <input
                    type="number"
                    value={minBudget}
                    onChange={(e) => setMinBudget(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-3 rounded-xl bg-slate-50 font-black text-slate-800 text-sm outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">{isRtl ? 'الأقصى' : 'Max'}</span>
                <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{getCurrencySymbol()}</span>
                   <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-3 rounded-xl bg-slate-50 font-black text-slate-800 text-sm outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Language & Narrator */}
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-3 h-3" /> {t('audioLang')}
              </label>
              <button
                onClick={() => setIsLangPickerOpen(true)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 text-slate-900 font-bold text-sm"
              >
                <div className="flex items-center gap-3">
                  <span>{LANGUAGES.find(l => l.code === language)?.nativeName}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Headphones className="w-3 h-3" /> {t('narrator')}
              </label>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {VOICES.map(v => (
                  <button 
                    key={v.id} 
                    onClick={() => setVoice(v.id)} 
                    className={`flex flex-col items-center shrink-0 w-24 p-3 rounded-2xl border-2 transition-all ${voice === v.id ? 'bg-white border-orange-600' : 'bg-slate-50 border-transparent'}`}
                  >
                    <img src={v.image} alt={v.name} className="w-12 h-12 rounded-lg object-cover mb-2" />
                    <span className={`text-[10px] font-bold truncate ${voice === v.id ? 'text-orange-600' : 'text-slate-500'}`}>{v.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-8 pt-4 border-t border-slate-50 bg-white">
          <button 
            disabled={!searchCityInput.trim()}
            onClick={handleAction}
            className="w-full py-4 bg-slate-900 disabled:bg-slate-200 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2"
          >
            <Compass className="w-5 h-5" />
            {t('curateJourney')}
          </button>
        </div>
      </div>

      {isLangPickerOpen && (
        <div className="fixed inset-0 z-[600] flex flex-col justify-end bg-black/40 backdrop-blur-[2px]">
          <div className="absolute inset-0" onClick={() => setIsLangPickerOpen(false)} />
          <div className="relative bg-white rounded-t-[2rem] max-h-[60vh] overflow-y-auto px-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-black text-slate-800">Select Language</h4>
              <button onClick={() => setIsLangPickerOpen(false)} className="text-orange-600 font-bold">Done</button>
            </div>
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code); setIsLangPickerOpen(false); }}
                className={`w-full text-left py-4 border-b border-slate-50 flex justify-between items-center ${language === lang.code ? 'text-orange-600' : 'text-slate-600'}`}
              >
                <span className="font-bold">{lang.nativeName}</span>
                {language === lang.code && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileSearchOverlay;
