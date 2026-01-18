
import React, { useRef, useEffect, useState } from 'react';
import { X, Search, MapPin, Compass, Globe, ChevronDown, Headphones, Banknote, Star, Check, History, Sparkles, Loader2 } from 'lucide-react';
import { LANGUAGES, VOICES } from '../constants';
import { getCitySuggestions } from '../services/geminiService';

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  searchCityInput: string;
  setSearchCityInput: (city: string) => void;
  suggestions: string[];
  onSearch: (city: string, interests: string[]) => void;
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

const INTEREST_OPTIONS = [
  { id: 'cinema', label: 'Cinema', emoji: '🎬' },
  { id: 'restaurant', label: 'Gastronomy', emoji: '🍝' },
  { id: 'museum', label: 'Museums', emoji: '🏛️' },
  { id: 'parks', label: 'Nature', emoji: '🌳' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🌙' },
  { id: 'history', label: 'History', emoji: '📜' },
  { id: 'hiddengems', label: 'Hidden Gems', emoji: '💎' },
];

const MobileSearchOverlay: React.FC<MobileSearchOverlayProps> = ({
  isOpen, onClose, searchCityInput, setSearchCityInput, 
  onSearch, isGeolocationLoading, onGeolocationSearch, 
  minBudget, setMinBudget, maxBudget, setMaxBudget,
  currency, setCurrency,
  language, setLanguage, voice, setVoice, t
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLangPickerOpen, setIsLangPickerOpen] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [localSuggestions, setLocalSuggestions] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const isRtl = document.documentElement.dir === 'rtl';

  useEffect(() => {
    const saved = localStorage.getItem('kuratour_search_history');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (e) {
        setSearchHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchCityInput.length > 1) {
        setIsTyping(true);
        try {
          const results = await getCitySuggestions(searchCityInput);
          setLocalSuggestions(results);
        } catch (e) {
          setLocalSuggestions([]);
        } finally {
          setIsTyping(false);
        }
      } else {
        setLocalSuggestions([]);
      }
    };

    const timer = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(timer);
  }, [searchCityInput]);

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const addToHistory = (city: string) => {
    const updated = [city, ...searchHistory.filter(c => c !== city)].slice(0, 5);
    setSearchHistory(updated);
    localStorage.setItem('kuratour_search_history', JSON.stringify(updated));
  };

  const handleAction = () => {
    if (searchCityInput.trim()) {
      addToHistory(searchCityInput.trim());
      onSearch(searchCityInput.trim(), selectedInterests);
      onClose();
    }
  };

  const selectCity = (city: string) => {
    setSearchCityInput(city);
    setShowDropdown(false);
  };

  if (!isOpen) return null;

  const getCurrencySymbol = () => {
    switch(currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'MAD': return 'DH';
      default: return currency;
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex flex-col justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div 
        className="relative bg-white dark:bg-slate-900 w-full rounded-t-[2rem] shadow-2xl flex flex-col max-h-[95vh] animate-in slide-in-from-bottom duration-400 ease-out"
        onClick={(e) => e.stopPropagation()}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="w-10 h-1 bg-slate-200 dark:bg-white/10 rounded-full mx-auto mt-3 mb-1" />
        
        <div className="px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{t('curateJourney')}</h3>
          <button onClick={onClose} className="p-2 bg-slate-50 dark:bg-white/5 rounded-full text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 no-scrollbar">
          <div className="space-y-3 relative">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-3 h-3" /> {t('destination')}
            </label>
            <div className="relative">
              <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300`} />
              <input
                ref={inputRef}
                type="text"
                placeholder={t('whereTo')}
                onFocus={() => setShowDropdown(true)}
                className={`w-full ${isRtl ? 'pr-12 pl-12 text-right' : 'pl-12 pr-12'} py-4 rounded-xl bg-slate-50 dark:bg-white/5 font-bold text-slate-900 dark:text-white outline-none border-2 border-transparent focus:border-slate-900 dark:focus:border-white transition-all`}
                value={searchCityInput}
                onChange={(e) => setSearchCityInput(e.target.value)}
              />
              {searchCityInput && (
                <button 
                  onClick={() => setSearchCityInput('')}
                  className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 p-1 bg-slate-200 dark:bg-white/10 rounded-full`}
                >
                  <X className="w-3 h-3 text-slate-500" />
                </button>
              )}
            </div>

            {showDropdown && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-20 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden animate-in fade-in slide-in-from-top-2">
                {searchCityInput.length === 0 && searchHistory.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <History className="w-3 h-3" /> Recent Searches
                    </div>
                    {searchHistory.map((city) => (
                      <button 
                        key={city}
                        onClick={() => selectCity(city)}
                        className="w-full flex items-center gap-3 px-3 py-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors text-start"
                      >
                        <History className="w-4 h-4 text-slate-300" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{city}</span>
                      </button>
                    ))}
                  </div>
                )}

                {searchCityInput.length > 1 && (
                  <div className="p-2">
                    <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-orange-500" /> Suggestions
                    </div>
                    {isTyping && localSuggestions.length === 0 && (
                      <div className="p-4 flex items-center gap-3 text-slate-400 italic text-xs">
                        <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
                      </div>
                    )}
                    {localSuggestions.map((city) => (
                      <button 
                        key={city}
                        onClick={() => selectCity(city)}
                        className="w-full flex items-center gap-3 px-3 py-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors text-start"
                      >
                        <Compass className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{city}</span>
                      </button>
                    ))}
                    {!isTyping && localSuggestions.length === 0 && (
                      <button 
                        onClick={() => setShowDropdown(false)}
                        className="w-full flex items-center gap-3 px-3 py-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl transition-colors text-start"
                      >
                        <Search className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">Select "{searchCityInput}"</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Star className="w-3 h-3" /> {isRtl ? 'اهتماماتك' : 'What interests you?'}
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all text-xs font-bold ${
                    selectedInterests.includes(interest.id)
                      ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900'
                      : 'bg-slate-50 dark:bg-white/5 border-transparent text-slate-500 hover:border-slate-100 dark:hover:border-white/10'
                  }`}
                >
                  <span>{interest.emoji}</span>
                  <span>{interest.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Banknote className="w-3 h-3" /> {t('maxBudget')}
              </label>
              <select 
                className="bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-[10px] font-black p-1 rounded-lg outline-none" 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
              >
                {['USD', 'EUR', 'MAD', 'GBP', 'AED'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div className="relative group">
               <span className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm`}>
                 {getCurrencySymbol()}
               </span>
               <input
                type="number"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                placeholder="0"
                className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 rounded-2xl bg-slate-50 dark:bg-white/5 font-black text-slate-900 dark:text-white text-lg outline-none border-2 border-transparent focus:border-slate-900 dark:focus:border-white focus:bg-white dark:focus:bg-slate-800 transition-all`}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-3 h-3" /> {t('audioLang')}
              </label>
              <button
                onClick={() => setIsLangPickerOpen(true)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-bold text-sm"
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
                    className={`flex flex-col items-center shrink-0 w-24 p-3 rounded-2xl border-2 transition-all ${voice === v.id ? 'bg-white dark:bg-slate-800 border-orange-600' : 'bg-slate-50 dark:bg-white/5 border-transparent'}`}
                  >
                    <img src={v.image} alt={v.name} className="w-12 h-12 rounded-lg object-cover mb-2" />
                    <span className={`text-[10px] font-bold truncate ${voice === v.id ? 'text-orange-600' : 'text-slate-500'}`}>{v.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-8 pt-4 border-t border-slate-50 dark:border-white/5 bg-white dark:bg-slate-900">
          <button 
            disabled={!searchCityInput.trim()}
            onClick={handleAction}
            className="w-full py-4 bg-slate-900 dark:bg-white disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white dark:text-slate-900 rounded-xl font-bold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <Compass className="w-5 h-5" />
            {t('curateJourney')}
          </button>
        </div>
      </div>

      {isLangPickerOpen && (
        <div className="fixed inset-0 z-[600] flex flex-col justify-end bg-black/40 backdrop-blur-[2px]">
          <div className="absolute inset-0" onClick={() => setIsLangPickerOpen(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-t-[2rem] max-h-[60vh] overflow-y-auto px-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-black text-slate-800 dark:text-white">Select Language</h4>
              <button onClick={() => setIsLangPickerOpen(false)} className="text-orange-600 font-bold">Done</button>
            </div>
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code); setIsLangPickerOpen(false); }}
                className={`w-full text-left py-4 border-b border-slate-50 dark:border-white/5 flex justify-between items-center ${language === lang.code ? 'text-orange-600' : 'text-slate-600 dark:text-slate-400'}`}
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
