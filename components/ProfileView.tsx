
import React, { useState } from 'react';
import { Moon, Sun, User, Settings, Bell, Shield, LogOut, ChevronRight, Globe, CreditCard, Check, X, Map, Heart } from 'lucide-react';
import { LANGUAGES } from '../constants';

interface ProfileViewProps {
  onBack: () => void;
  t: (key: string) => string;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  language: string;
  setLanguage: (lang: string) => void;
  tripCount?: number;
  likeCount?: number;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  onBack, 
  t, 
  theme, 
  setTheme, 
  language, 
  setLanguage,
  tripCount = 12,
  likeCount = 48
}) => {
  const isRtl = document.documentElement.dir === 'rtl';
  const [isLangPickerOpen, setIsLangPickerOpen] = useState(false);

  const menuItems = [
    { icon: <Settings className="w-5 h-5" />, label: 'Account Settings', sub: 'Privacy, Security' },
    { icon: <CreditCard className="w-5 h-5" />, label: 'Subscriptions', sub: 'Manage your plan' },
    { icon: <Bell className="w-5 h-5" />, label: 'Notifications', sub: 'Travel alerts' },
    { icon: <Shield className="w-5 h-5" />, label: 'Legal', sub: 'Terms & Conditions' },
  ];

  const currentLangName = LANGUAGES.find(l => l.code === language)?.nativeName || 'English';

  return (
    <div className="bg-slate-50 dark:bg-slate-950 flex flex-col min-h-screen animate-in fade-in duration-500 overflow-x-hidden">
      {/* Page Header */}
      <div className="px-6 py-6 flex justify-between items-center border-b border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          {isRtl ? 'حسابي' : 'Profile'}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* User Profile Card */}
        <div className="p-8 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-[2.5rem] bg-slate-900 dark:bg-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105 duration-500">
              <User className="w-10 h-10 text-white dark:text-slate-900" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-500 rounded-xl border-4 border-slate-50 dark:border-slate-950 flex items-center justify-center shadow-lg">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-white" /> : <Sun className="w-4 h-4 text-white" />}
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Alex Johnson</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Premium Explorer</p>
        </div>

        {/* User Stats Section */}
        <div className="px-6 grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2rem] p-5 shadow-sm flex flex-col items-center justify-center gap-1 group transition-all hover:border-orange-200 dark:hover:border-orange-500/30">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 mb-1">
              <Map className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white leading-none">{tripCount}</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isRtl ? 'رحلات' : 'Trips'}</span>
          </div>

          <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2rem] p-5 shadow-sm flex flex-col items-center justify-center gap-1 group transition-all hover:border-pink-200 dark:hover:border-pink-500/30">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center text-pink-500 mb-1">
              <Heart className="w-5 h-5 fill-pink-500/20" />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white leading-none">{likeCount}</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isRtl ? 'إعجابات' : 'Likes'}</span>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="px-6 mb-4">
          <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-900 dark:text-white">
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div className="text-start">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">Dark Mode</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{theme === 'dark' ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`w-14 h-8 rounded-full transition-all relative ${theme === 'dark' ? 'bg-orange-500' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${theme === 'dark' ? (isRtl ? 'right-7' : 'left-7') : (isRtl ? 'right-1' : 'left-1')}`} />
            </button>
          </div>
        </div>

        {/* Language Selection */}
        <div className="px-6 mb-8">
          <button 
            onClick={() => setIsLangPickerOpen(true)}
            className="w-full bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-6 flex items-center justify-between shadow-sm group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-start">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">App Language</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{currentLangName}</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 text-slate-300 dark:text-slate-600 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Action Menu */}
        <div className="px-6 space-y-3">
          <div className="px-4 py-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Settings & Preferences</h4>
          </div>
          {menuItems.map((item, idx) => (
            <button 
              key={idx}
              className="w-full flex items-center justify-between p-4 rounded-3xl bg-white dark:bg-white/5 border border-slate-50 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 transition-all text-start group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">{item.label}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.sub}</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-slate-300 dark:text-slate-600 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          ))}
          
          <button className="w-full flex items-center gap-4 p-4 rounded-3xl text-red-500 font-black text-sm mt-4 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-start">
            <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            Logout
          </button>
        </div>
      </div>

      {/* Language Picker Bottom Sheet */}
      {isLangPickerOpen && (
        <div className="fixed inset-0 z-[600] flex flex-col justify-end bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setIsLangPickerOpen(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-t-[2.5rem] max-h-[80vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-500">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mx-auto mt-4 mb-2" />
            
            <div className="px-8 py-4 flex justify-between items-center border-b border-slate-50 dark:border-white/5">
              <h4 className="font-black text-slate-900 dark:text-white">Select Language</h4>
              <button 
                onClick={() => setIsLangPickerOpen(false)} 
                className="p-2 bg-slate-50 dark:bg-white/5 rounded-full text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-4 no-scrollbar">
              <div className="grid grid-cols-1 gap-1">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { 
                      setLanguage(lang.code); 
                      setIsLangPickerOpen(false); 
                    }}
                    className={`w-full text-left p-4 rounded-2xl flex justify-between items-center transition-all ${
                      language === lang.code 
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 shadow-sm' 
                        : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl">{lang.nativeName.split(' ')[0]}</span>
                      <span className="font-bold text-sm">{lang.nativeName.split(' ').slice(1).join(' ')}</span>
                    </div>
                    {language === lang.code && (
                      <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-8 border-t border-slate-50 dark:border-white/5">
              <button 
                onClick={() => setIsLangPickerOpen(false)}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm active:scale-[0.98] transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
