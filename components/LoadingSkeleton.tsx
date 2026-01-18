
import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Globe2, Zap, ShieldCheck, Landmark, Camera } from 'lucide-react';

interface LoadingSkeletonProps {
  t: (key: string) => string;
  city: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ city, t }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const steps = [
    { text: `Establishing connection to ${city}...`, icon: <Globe2 className="w-4 h-4" /> },
    { text: "Scouting top-rated landmarks...", icon: <Landmark className="w-4 h-4" /> },
    { text: "Calculating optimal travel routes...", icon: <Compass className="w-4 h-4" /> },
    { text: "Personalizing audio commentary...", icon: <Camera className="w-4 h-4" /> },
    { text: "Polishing your luxury itinerary...", icon: <Sparkles className="w-4 h-4" /> }
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 99 ? 99 : prev + (Math.random() * 1.5)));
    }, 120);

    const stepInterval = setInterval(() => {
      setStep((s) => (s + 1) % steps.length);
    }, 2800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [steps.length]);

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
      {/* Blurred Background Filter */}
      <div className="absolute inset-0 bg-slate-50/60 dark:bg-slate-950/80 backdrop-blur-xl z-0" />
      
      {/* Scanning Line Effect */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <div className="w-full h-[2px] bg-orange-500/30 dark:bg-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.5)] absolute top-0 animate-[scan_3s_infinite_linear]" />
      </div>

      {/* Compact Content Card */}
      <div className="relative z-20 w-full max-w-[340px] bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-white/5 flex flex-col items-center">
        
        {/* Animated Status Badge */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </div>
          <span className="text-[9px] font-black text-orange-600 dark:text-orange-500 uppercase tracking-[0.3em]">
            Synthesis in Progress
          </span>
        </div>

        {/* Title & City */}
        <div className="text-center space-y-2 mb-10">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
            Curating {city}
          </h3>
          <div className="h-5 overflow-hidden">
            <p className="text-slate-400 dark:text-slate-500 font-bold text-xs tracking-tight transition-all duration-500">
              {steps[step].text}
            </p>
          </div>
        </div>

        {/* Immersive Progress Bar */}
        <div className="w-full space-y-4 mb-8">
          <div className="flex justify-between items-end px-1">
            <span className="text-[9px] font-black text-slate-300 dark:text-white/20 uppercase tracking-widest">Optimizing Guide</span>
            <span className="text-sm font-black text-orange-600 dark:text-orange-500">{Math.floor(progress)}%</span>
          </div>
          
          <div className="w-full h-2.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden relative border border-slate-50 dark:border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full shadow-[0_0_12px_rgba(249,115,22,0.3)] transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Compact Badge Row */}
        <div className="flex items-center justify-around w-full pt-4 border-t border-slate-50 dark:border-white/5">
          {[
            { icon: <Zap className="w-3.5 h-3.5" />, label: "Smart" },
            { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: "Verified" },
            { icon: <Compass className="w-3.5 h-3.5" />, label: "Local" }
          ].map((badge, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 opacity-30">
              <div className="text-slate-900 dark:text-white">{badge.icon}</div>
              <span className="text-[7px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingSkeleton;
