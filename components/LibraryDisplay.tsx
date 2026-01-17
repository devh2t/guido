
import React from 'react';
import { Tour } from '../types';
import { Share2, Trash2, Plus } from 'lucide-react';

interface LibraryDisplayProps {
  tours: Tour[];
  onOpen: (tour: Tour) => void;
  onDelete: (index: number) => void;
  onShare: (tour: Tour) => void;
  onCreateNew: () => void;
  t: (key: string) => string;
}

const LibraryDisplay: React.FC<LibraryDisplayProps> = ({ tours, onOpen, onDelete, onShare, onCreateNew, t }) => {
  return (
    <div className="space-y-6 text-start">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800">{t('savedTours')}</h2>
        <button onClick={onCreateNew} className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
          <Plus className="w-4 h-4" /> {t('createTour')}
        </button>
      </div>
      {tours.length === 0 ? (
        <div className="h-64 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-12 text-center text-slate-400">
          <p className="text-base md:text-lg">No tours saved yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((t_saved, idx) => (
            <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl transition-all group/card overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{t_saved.city}</span>
                <button onClick={() => onShare(t_saved)} className="p-2 rounded-lg bg-indigo-50 text-indigo-600 opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-indigo-100">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2 truncate">{t_saved.tourTitle}</h3>
              <p className="text-sm text-slate-500 mb-5 line-clamp-2">{t_saved.overview}</p>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-auto gap-3 sm:gap-2">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-bold uppercase">{t_saved.stops.length} {t('checkpoints')} • {t_saved.totalDistance || 'N/A'}</span>
                  <span className="text-xs text-indigo-500 font-bold uppercase">{t('total')}: {t_saved.totalEstimatedCost} {t_saved.currency}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onDelete(idx)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => onOpen(t_saved)} className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100">{t('openTour')}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryDisplay;