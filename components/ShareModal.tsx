
import React from 'react';
import { Tour } from '../types';
import { X, Loader, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: Tour | null;
  onDownloadPDF: () => void;
  isPreparing: boolean;
  progress: number;
  t: (key: string) => string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, tour, onDownloadPDF, isPreparing, progress, t }) => {
  if (!isOpen || !tour) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">Generate Professional Guide</h3>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">Grounded in Real Data</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 md:space-y-8">
          
          {/* Progress Bar */}
          {isPreparing && (
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Retrieving Real Visuals...</span>
                <span className="text-lg font-black text-indigo-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Itinerary Preview */}
          <div className="space-y-6">
            <div className="bg-indigo-600 rounded-2xl p-5 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
              <div className="relative z-10">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">{tour.city} Explorer</p>
                <h4 className="text-xl md:text-2xl font-black leading-tight mb-2">{tour.tourTitle}</h4>
                <div className="flex gap-4 text-xs font-bold opacity-90">
                  <span>{tour.stops.length} Stops</span>
                  <span>•</span>
                  <span>{tour.totalDistance}</span>
                  <span>•</span>
                  <span>{tour.totalEstimatedCost} {tour.currency}</span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-full bg-white/10 -skew-x-12 translate-x-16"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tour.stops.map((stop, i) => (
                <div key={i} className="group relative aspect-video rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shadow-sm transition-all hover:shadow-md flex flex-col">
                  {stop.visualUrl ? (
                    <img 
                      src={stop.visualUrl} 
                      alt={stop.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader className="w-5 h-5 text-indigo-500 animate-spin" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <span className="text-[7px] font-black px-1 py-0.5 bg-indigo-600 rounded uppercase tracking-wider mb-1 inline-block">Stop {i+1}</span>
                    <p className="text-[10px] font-black truncate">{stop.name}</p>
                    {stop.groundingLinks && stop.groundingLinks.length > 0 && (
                      <a href={stop.groundingLinks[0].uri} target="_blank" rel="noopener noreferrer" className="flex gap-1 mt-1 items-center hover:underline">
                        <ExternalLink className="w-2.5 h-2.5 text-blue-400" />
                        <span className="text-[8px] font-bold text-blue-300">Search Source</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 md:p-8 border-t border-slate-100 bg-white">
          <button
            onClick={onDownloadPDF}
            disabled={isPreparing}
            className="w-full py-4 md:py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-base md:text-lg"
          >
            {isPreparing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Searching Assets...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Download PDF Itinerary
              </>
            )}
          </button>
          <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-[0.2em] mt-5">Google Search Grounded Images</p>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;