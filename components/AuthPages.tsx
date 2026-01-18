
import React, { useState } from 'react';
import { X, Mail, Lock, User, Globe, Compass, Facebook, Apple } from 'lucide-react';

interface AuthPagesProps {
  onBack: () => void;
  onSuccess: () => void;
  t: (key: string) => string;
}

const AuthPages: React.FC<AuthPagesProps> = ({ onBack, onSuccess, t }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const isRtl = document.documentElement.dir === 'rtl';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col justify-end md:justify-center items-center bg-white/10 backdrop-blur-md md:backdrop-blur-lg animate-in fade-in duration-300 px-0 md:px-4">
      {/* Tap overlay to close */}
      <div className="absolute inset-0 bg-slate-900/20" onClick={onBack} />
      
      <div className="relative bg-[#F9F9F9] w-full md:max-w-[420px] rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl flex flex-col max-h-[92vh] md:max-h-[85vh] animate-in slide-in-from-bottom md:zoom-in duration-500 ease-out overflow-hidden border border-white/20">
        {/* Top Header Actions */}
        <div className="px-6 py-5 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100 md:border-none">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
          <button onClick={onBack} className="text-slate-400 font-medium text-sm hover:text-indigo-600 transition-colors">
            {isRtl ? 'لاحقاً' : 'Later'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-10">
          <div className="mt-4 mb-8 text-center">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {mode === 'login' ? (isRtl ? 'تسجيل الدخول' : 'Sign in to account') : (isRtl ? 'إنشاء حساب' : 'Create an account')}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="relative group">
              <input 
                type="email" 
                required 
                className="w-full px-5 py-4 rounded-xl bg-white border border-slate-100 text-slate-900 font-medium text-sm shadow-sm outline-none focus:border-indigo-600/30 transition-all placeholder:text-slate-400"
                placeholder={isRtl ? 'البريد الإلكتروني' : 'Email Address'}
              />
            </div>

            <div className="relative group">
              <input 
                type="password" 
                required 
                className="w-full px-5 py-4 rounded-xl bg-white border border-slate-100 text-slate-900 font-medium text-sm shadow-sm outline-none focus:border-indigo-600/30 transition-all placeholder:text-slate-400"
                placeholder={isRtl ? 'كلمة المرور' : 'Password'}
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-[#FFDB5E] hover:bg-[#FFD233] text-slate-900 rounded-xl font-bold text-sm shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6"
            >
              {mode === 'login' ? (isRtl ? 'تسجيل الدخول' : 'Sign In') : (isRtl ? 'إنشاء حساب' : 'Create an Account')}
            </button>
          </form>

          <div className="mt-8 mb-8 text-center">
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-slate-400 text-sm font-medium hover:text-indigo-600 transition-colors"
            >
              {mode === 'login' ? (isRtl ? 'ليس لديك حساب؟' : "Don't have an account?") : (isRtl ? 'لديك حساب بالفعل؟' : 'Already have an account?')}
            </button>
          </div>

          <div className="h-px bg-slate-200/50 w-full mb-10" />

          <div className="space-y-3 w-full">
            <button onClick={onSuccess} className="w-full flex items-center justify-center gap-3 py-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md active:scale-[0.98] transition-all">
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5 shrink-0" alt="Google" />
              <span className="font-bold text-sm text-slate-700">{isRtl ? 'متابعة عبر جوجل' : 'Continue with Google'}</span>
            </button>
            
            <button onClick={onSuccess} className="w-full flex items-center justify-center gap-3 py-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md active:scale-[0.98] transition-all">
              <Facebook className="w-5 h-5 text-[#1877F2] fill-[#1877F2] shrink-0" />
              <span className="font-bold text-sm text-slate-700">{isRtl ? 'متابعة عبر فيسبوك' : 'Continue with Facebook'}</span>
            </button>

            <button onClick={onSuccess} className="w-full flex items-center justify-center gap-3 py-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md active:scale-[0.98] transition-all">
              <Apple className="w-5 h-5 text-black fill-black shrink-0" />
              <span className="font-bold text-sm text-slate-700">{isRtl ? 'متابعة عبر أبل' : 'Continue with Apple'}</span>
            </button>
          </div>
        </div>
        
        {/* Safe area indicator / Bottom Padding */}
        <div className="h-4 md:h-8 bg-[#F9F9F9]" />
      </div>
    </div>
  );
};

export default AuthPages;
