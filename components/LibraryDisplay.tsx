
import React from 'react';
import { Tour } from '../types';
import { Share2, Trash2, Plus, Heart } from 'lucide-react';

interface LibraryDisplayProps {
  tours: Tour[];
  onOpen: (tour: Tour) => void;
  onDelete: (index: number) => void;
  onShare: (tour: Tour) => void;
  onCreateNew: () => void;
  t: (key: string) => string;
}

const LibraryDisplay: React.FC<LibraryDisplayProps> = ({ tours, onOpen, onDelete, onShare, onCreateNew, t }) => {
  const isRtl = document.documentElement.dir === 'rtl';

  return (
    <div className="space-y-6 text-start px-6 animate-in fade-in duration-500 pb-32">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 pt-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Heart className="w-6 h-6 text-orange-500 fill-orange-500" />
            {t('savedTours')}
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Your curated escapes</p>
        </div>
        <button onClick={onCreateNew} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t('createTour')}
        </button>
      </div>

      {tours.length === 0 ? (
        <div className="h-[50vh] border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center text-slate-400 bg-white/50 dark:bg-white/5">
          <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 opacity-20" />
          </div>
          <p className="text-sm font-black uppercase tracking-widest">No tours saved yet.</p>
          <button onClick={onCreateNew} className="mt-6 text-indigo-500 font-bold text-xs uppercase hover:underline">Start Exploring</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tours.map((t_saved, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-white/5 hover:shadow-xl transition-all group/card overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em]">{t_saved.city}</span>
                <div className="flex gap-2">
                  <button onClick={() => onShare(t_saved)} className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-indigo-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(idx)} className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 leading-tight truncate">{t_saved.tourTitle}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 font-medium leading-relaxed">{t_saved.overview}</p>
              
              <div className="flex justify-between items-end mt-auto">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t_saved.stops.length} {t('checkpoints')}</span>
                  <span className="text-xs font-black text-orange-600 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-lg w-fit">
                    {t_saved.totalEstimatedCost} {t_saved.currency}
                  </span>
                </div>
                <button 
                  onClick={() => onOpen(t_saved)} 
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                >
                  {t('openTour')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryDisplay;
