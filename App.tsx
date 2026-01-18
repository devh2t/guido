
import React, { useState, useRef, useEffect } from 'react';
import { 
  generateTourData, 
  generateAudioNarration, 
  decodeBase64, 
  decodeAudioBuffer,
} from './services/geminiService';
import { getSavedToursOffline, saveTourOffline, deleteTourOffline } from './services/dbService';
import { cacheTourMapTiles } from './services/mapCacheService';
import { Tour } from './types';
import { useI18n } from './hooks/useI18n';

import Header from './components/Header';
import MobileSearchOverlay from './components/MobileSearchOverlay';
import TourDisplay from './components/TourDisplay';
import LibraryDisplay from './components/LibraryDisplay';
import TimelineDetailView from './components/TimelineDetailView';
import LoadingSkeleton from './components/LoadingSkeleton';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ProfileView from './components/ProfileView';
import NarratorOverlay from './components/NarratorOverlay';
import ShareTourOverlay from './components/ShareTourOverlay';

import { Search, WifiOff, Heart, Filter, History, Compass } from 'lucide-react';

type ViewType = 'home' | 'explore' | 'saved' | 'profile' | 'timeline';
type Continent = 'Africa' | 'Asia' | 'Europe' | 'Americas' | 'Oceania';

const App: React.FC = () => {
  const { language, setLanguage, t, isRtl } = useI18n('en');
  
  const [view, setView] = useState<ViewType>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as 'light' | 'dark';
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [savedTours, setSavedTours] = useState<Tour[]>([]);
  
  const [activeTourCity, setActiveTourCity] = useState('');
  const [searchCityInput, setSearchCityInput] = useState('');
  const [maxBudget, setMaxBudget] = useState<number>(500);
  const [currency, setCurrency] = useState('USD');
  const [voice, setVoice] = useState('Charon');
  const [tour, setTour] = useState<Tour | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobileSearchOverlayOpen, setIsMobileSearchOverlayOpen] = useState(false);
  const [isShareOverlayOpen, setIsShareOverlayOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeCategory, setActiveCategory] = useState<Continent>('Africa');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    loadSavedTours();
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const loadSavedTours = async () => {
    const tours = await getSavedToursOffline();
    setSavedTours(tours);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const startTourGeneration = async (cityName: string, interests: string[]) => {
    setLoading(true);
    setIsMobileSearchOverlayOpen(false);
    setActiveTourCity(cityName);
    try {
      const data = await generateTourData(cityName, 'English', 0, maxBudget, currency, interests);
      setTour(data);
      setActiveStopIndex(0);
      setView('explore');
    } catch (error) {
      triggerToast("Generation failed.");
    } finally { 
      setLoading(false); 
    }
  };

  const handleSaveTour = async () => {
    if (!tour) return;
    await saveTourOffline(tour);
    await cacheTourMapTiles(tour);
    await loadSavedTours();
    triggerToast("Saved to favorites!");
  };

  const playNarration = async (text: string) => {
    if (isPlaying) { stopAudio(); return; }
    setLoadingAudio(true);
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      const base64 = await generateAudioNarration(text, voice, language);
      const bytes = decodeBase64(base64);
      const buffer = await decodeAudioBuffer(bytes, audioContextRef.current, 24000, 1);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsPlaying(false);
      audioSourceRef.current = source;
      source.start(0);
      setIsPlaying(true);
    } catch (e) { 
      console.error("Audio playback error:", e);
      triggerToast("Audio failed."); 
    } finally { 
      setLoadingAudio(false); 
    }
  };

  const stopAudio = () => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch(e) {}
    }
    setIsPlaying(false);
  };

  const categoryHeroImages: Record<Continent, string> = {
    'Africa': 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1200',
    'Asia': 'https://images.unsplash.com/photo-1464817739973-0128fe79aa1b?w=1200',
    'Europe': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200',
    'Americas': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1200',
    'Oceania': 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200'
  };

  const cityData: Record<Continent, {name: string, img: string}[]> = {
    'Africa': [{ name: 'Marrakech', img: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800' }, { name: 'Cairo', img: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800' }],
    'Asia': [{ name: 'Kyoto', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800' }],
    'Europe': [{ name: 'Paris', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800' }, { name: 'Rome', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800' }],
    'Americas': [{ name: 'New York', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800' }],
    'Oceania': [{ name: 'Sydney', img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800' }]
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 ${view === 'timeline' ? '' : 'pb-36'}`}>
      <Toast show={showToast} message={toastMessage} />
      {loading && <LoadingSkeleton city={activeTourCity} t={t} />}
      <NarratorOverlay isPlaying={isPlaying} voiceId={voice} onStop={stopAudio} isRtl={isRtl} />
      
      {tour && <ShareTourOverlay isOpen={isShareOverlayOpen} onClose={() => setIsShareOverlayOpen(false)} tour={tour} t={t} />}

      {!isOnline && (
        <div className="fixed top-0 inset-x-0 z-[1000] bg-orange-600 text-white text-[10px] font-black py-1 flex justify-center gap-2 uppercase tracking-widest shadow-lg">
          <WifiOff className="w-3 h-3" /> Offline Mode
        </div>
      )}

      <main className="w-full h-full">
        {view === 'home' ? (
          <div className="animate-in fade-in duration-500">
            <div className="relative h-[45vh] min-h-[400px] w-full overflow-hidden">
              <img src={categoryHeroImages[activeCategory] || categoryHeroImages['Africa']} className="absolute inset-0 w-full h-full object-cover" alt="Hero" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />
              <div className="absolute top-8 left-0 right-0 px-5 z-20">
                <button onClick={() => setIsMobileSearchOverlayOpen(true)} className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md h-12 rounded-xl px-4 flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-slate-900 dark:text-white" />
                    <span className="text-slate-400 font-medium text-xs">Where do you wanna go?</span>
                  </div>
                  <Filter className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
                </button>
              </div>
              <div className="absolute bottom-12 left-0 right-0 px-8 z-10 text-start">
                <h2 className="text-white text-3xl font-black leading-tight mb-2 tracking-tight">Discover your next luxury escape</h2>
                <p className="text-white/80 text-sm font-medium mb-6">Personalized travel journeys</p>
                <button onClick={() => setIsMobileSearchOverlayOpen(true)} className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-xl active:scale-95 transition-all">
                  Start Exploring Now
                </button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-950 rounded-t-[2.5rem] -mt-8 relative z-20 px-6 pt-10 pb-10 border-t border-slate-100 dark:border-white/5">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">Your travel companion</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Explore in responsible, local ways</p>
              
              <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8">
                {(Object.keys(cityData) as Continent[]).map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`shrink-0 px-6 py-2.5 rounded-full text-xs font-black transition-all ${activeCategory === cat ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}>
                    {cat}
                  </button>
                ))}
              </div>

              <h4 className="text-base font-black text-slate-900 dark:text-white mb-4">Recommended in {activeCategory}</h4>
              <div className="flex gap-4 overflow-x-auto no-scrollbar">
                {cityData[activeCategory].map((city, idx) => (
                  <div key={idx} className="shrink-0 w-[240px] group cursor-pointer" onClick={() => { setSearchCityInput(city.name); setIsMobileSearchOverlayOpen(true); }}>
                    <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-3 shadow-lg">
                      <img src={city.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={city.name} />
                      <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-900 shadow-md">
                        <Heart className="w-5 h-5" />
                      </div>
                      <div className="absolute bottom-6 left-6">
                        <h4 className="text-white text-xl font-black drop-shadow-md">{city.name}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : view === 'explore' ? (
          <div className="max-w-screen-md mx-auto px-4 pt-4 animate-in fade-in duration-500">
            {tour ? (
              <TourDisplay 
                tour={tour} activeStopIndex={activeStopIndex} onStopChange={setActiveStopIndex}
                onPlayNarration={playNarration} isPlaying={isPlaying} loadingAudio={loadingAudio}
                onSave={handleSaveTour} onShare={() => setIsShareOverlayOpen(true)}
                onShowTimeline={() => setView('timeline')} language={language} t={t}
                onBack={() => setTour(null)}
              />
            ) : (
              <div className="space-y-8 pt-6">
                <Header onOpenMobileSearch={() => setIsMobileSearchOverlayOpen(true)} activeTourCity={activeTourCity} t={t} loading={loading} />
                {savedTours.length > 0 && (
                  <div className="px-2">
                    <div className="flex items-center gap-2 mb-4">
                      <History className="w-5 h-5 text-orange-600" />
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">Last Trips</h3>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar">
                      {savedTours.map((st, i) => (
                        <div key={i} className="shrink-0 w-[220px] cursor-pointer" onClick={() => { setTour(st); setActiveTourCity(st.city); setActiveStopIndex(0); }}>
                          <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden shadow-lg border border-slate-100 dark:border-white/5">
                            <img src={st.stops[0]?.visualUrl} className="w-full h-full object-cover" alt={st.tourTitle} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                              <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">{st.city}</p>
                              <h4 className="text-white text-sm font-bold leading-tight line-clamp-2">{st.tourTitle}</h4>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="p-12 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-center">
                  <Compass className="w-12 h-12 text-slate-200 mb-4" />
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No Active Tour</p>
                  <button onClick={() => setIsMobileSearchOverlayOpen(true)} className="mt-4 bg-orange-600 text-white px-6 py-3 rounded-xl font-black text-xs shadow-lg">Start a New Search</button>
                </div>
              </div>
            )}
          </div>
        ) : view === 'saved' ? (
          <div className="pt-8 animate-in fade-in duration-500">
            <LibraryDisplay 
              tours={savedTours} t={t} 
              onOpen={(t) => { setTour(t); setActiveTourCity(t.city); setView('explore'); }}
              onDelete={async (idx) => { await deleteTourOffline(savedTours[idx].tourTitle); loadSavedTours(); }}
              onShare={(t) => { setTour(t); setIsShareOverlayOpen(true); }} 
              onCreateNew={() => { setView('explore'); setIsMobileSearchOverlayOpen(true); }}
            />
          </div>
        ) : view === 'profile' ? (
          <ProfileView 
            onBack={() => setView('home')} 
            t={t} theme={theme} 
            setTheme={setTheme} 
            language={language} 
            setLanguage={setLanguage}
            tripCount={savedTours.length}
            likeCount={savedTours.reduce((acc, tour) => acc + (tour.stops?.length || 0), 0)}
          />
        ) : view === 'timeline' && tour ? (
          <TimelineDetailView tour={tour} onBack={() => setView('explore')} onSelectStop={(idx) => { setView('explore'); setActiveStopIndex(idx); }} t={t} />
        ) : null}
      </main>

      <MobileSearchOverlay 
        isOpen={isMobileSearchOverlayOpen} onClose={() => setIsMobileSearchOverlayOpen(false)}
        searchCityInput={searchCityInput} setSearchCityInput={setSearchCityInput}
        onSearch={startTourGeneration} t={t}
        maxBudget={maxBudget} setMaxBudget={setMaxBudget} currency={currency} setCurrency={setCurrency}
        language={language} setLanguage={setLanguage} voice={voice} setVoice={setVoice}
      />

      {view !== 'timeline' && (
        <Footer 
          view={view} 
          setView={(v) => { setView(v); }} 
          t={t} 
        />
      )}
    </div>
  );
};

export default App;
