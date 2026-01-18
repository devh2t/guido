
import React, { useState, useEffect } from 'react';
import { Compass, Sparkles } from 'lucide-react';

interface LoadingSkeletonProps {
  t: (key: string) => string;
  city: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ city }) => {
  const [step, setStep] = useState(0);
  const steps = [
    "Analyzing local landmarks in " + city + "...",
    "Curating hidden gems and scenic routes...",
    "Calculating walking distances and transport...",
    "Drafting your personalized audio commentary...",
    "Finalizing your luxury itinerary..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % steps.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 max-w-screen-md mx-auto">
      {/* Header Skeleton */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-4 w-16 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-4 w-20 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="h-8 w-3/4 bg-slate-100 rounded-xl mb-3 animate-pulse" />
        <div className="h-4 w-full bg-slate-50 rounded-lg mb-2 animate-pulse" />
        <div className="h-4 w-2/3 bg-slate-50 rounded-lg animate-pulse" />
        
        <div className="flex gap-3 mt-6">
          <div className="flex-1 h-12 bg-slate-100 rounded-xl animate-pulse" />
          <div className="flex-1 h-12 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 animate-pulse" />
          <div className="h-6 w-1/3 bg-slate-100 rounded-lg animate-pulse" />
        </div>

        <div className="aspect-video bg-slate-50 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-slate-100 rounded-full animate-ping duration-[3000ms]" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center px-8">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200 mb-6 animate-bounce duration-[2000ms]">
              <Compass className="w-8 h-8 text-white" />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-orange-400" />
              AI Creation in Progress
            </p>
            <h3 className="text-slate-800 font-bold text-sm h-6 transition-all duration-500">
              {steps[step]}
            </h3>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex gap-2 overflow-hidden opacity-30">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-2 flex-1 bg-slate-200 rounded-full" />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="h-4 w-full bg-slate-50 rounded-lg animate-pulse" />
          <div className="h-4 w-full bg-slate-50 rounded-lg animate-pulse" />
          <div className="h-4 w-3/4 bg-slate-50 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
