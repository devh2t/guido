
import React from 'react';
import { LANGUAGES, VOICES } from '../constants';
import { X, Check, Headphones } from 'lucide-react';

interface SettingsSectionProps {
  isOpen: boolean;
  onClose: () => void;
  budget: number;
  setBudget: (val: number) => void;
  currency: string;
  setCurrency: (val: string) => void;
  language: string;
  setLanguage: (val: string) => void;
  voice: string;
  setVoice: (val: string) => void;
  onClearAll: () => void;
  t: (key: string) => string;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  isOpen, onClose, budget, setBudget, currency, setCurrency,
  language, setLanguage, voice, setVoice, onClearAll, t
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in slide-in-from-bottom duration-500">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">{t('customize')}</h3>
          <button onClick={onClose} className="p-2 bg-slate-200/50 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          {/* Budget & Currency */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('maxBudget')}</label>
            <div className="flex gap-3">
              <input 
                type="number" 
                className="flex-1 p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-black text-slate-800 text-lg focus:border-indigo-600 focus:bg-white outline-none transition-all" 
                value={budget} 
                onChange={(e) => setBudget(Number(e.target.value))} 
              />
              <select 
                className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-100 font-black text-indigo-600 text-sm focus:border-indigo-600 outline-none transition-all" 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
              >
                {['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'MAD', 'AED'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('targetLang')}</label>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.slice(0, 8).map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`p-3 rounded-xl border-2 text-start transition-all ${language === lang.code ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                >
                  <span className="text-xs font-black">{lang.nativeName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Narrator Selection (Rich Avatars) */}
          <div className="space-y-4 pb-4">
            <div className="flex justify-between items-end">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('narrator')}</label>
               <span className="text-[9px] font-black text-indigo-500 flex items-center gap-1">
                 <Headphones className="w-3 h-3" /> PREVIEW READY
               </span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {VOICES.map(v => (
                <button 
                  key={v.id} 
                  onClick={() => setVoice(v.id)} 
                  className={`flex items-center gap-4 p-3 rounded-[1.5rem] border-2 transition-all ${voice === v.id ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'}`}
                >
                  <div className="relative shrink-0">
                    <img src={v.image} alt={v.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                    {voice === v.id && (
                      <div className="absolute -top-2 -right-2 bg-indigo-600 text-white p-1 rounded-full shadow-lg border-2 border-white">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-start">
                    <h4 className={`text-sm font-black ${voice === v.id ? 'text-slate-900' : 'text-slate-700'}`}>{v.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{v.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-white flex gap-3">
          <button onClick={onClearAll} className="flex-1 py-4 text-sm font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-colors">
            {t('toutEffacer')}
          </button>
          <button onClick={onClose} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 active:scale-95 transition-all">
            {t('appliquer')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
