
import React, { useState, useRef, useEffect } from 'react';
import { 
  generateTourData, 
  generateAudioNarration, 
  decodeBase64, 
  decodeAudioBuffer,
  reverseGeocode
} from './services/geminiService';
import { saveTourOffline, getSavedToursOffline, deleteTourOffline } from './services/dbService';
import { Tour } from './types';
import { LANGUAGES } from './constants';
import { translations } from './translations';

import Header from './components/Header';
import MobileSearchOverlay from './components/MobileSearchOverlay';
import TourDisplay from './components/TourDisplay';
import LibraryDisplay from './components/LibraryDisplay';
import TimelineDetailView from './components/TimelineDetailView';
import Footer from './components/Footer';
import Toast from './components/Toast';

import { Compass, Loader, Search, WifiOff, Heart, Filter } from 'lucide-react';

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [activeTourCity, setActiveTourCity] = useState('');
  const [searchCityInput, setSearchCityInput] = useState('');
  const [budget, setBudget] = useState<number>(100);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');
  const [voice, setVoice] = useState('Charon');
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGeolocationLoading, setIsGeolocationLoading] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [savedTours, setSavedTours] = useState<Tour[]>([]);
  const [view, setView] = useState<'explore' | 'saved' | 'timeline'>('explore');
  const [isMobileSearchOverlayOpen, setIsMobileSearchOverlayOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const t = (key: string) => translations[language]?.[key] || translations['en'][key];

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    getSavedToursOffline().then(setSavedTours);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleGeolocationSearch = () => {
    if (!navigator.geolocation) {
      triggerToast("Geolocation not supported");
      return;
    }
    setIsGeolocationLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const cityName = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        setSearchCityInput(cityName);
      } catch (e) {
        triggerToast("Couldn't detect city.");
      } finally {
        setIsGeolocationLoading(false);
      }
    }, () => {
      triggerToast("Location permission denied.");
      setIsGeolocationLoading(false);
    });
  };

  const startTourGeneration = async (cityName: string) => {
    if (!isOnline) {
      triggerToast("Creation requires internet.");
      return;
    }
    setLoading(true);
    setIsMobileSearchOverlayOpen(false);
    try {
      const selectedLang = LANGUAGES.find(l => l.code === language)?.name || 'English';
      const data = await generateTourData(cityName, selectedLang, budget, currency);
      setTour(data);
      setActiveTourCity(cityName);
      setView('explore');
    } catch (error) {
      triggerToast("Error generating tour.");
    } finally { setLoading(false); }
  };

  const handleSaveTour = async () => {
    if (!tour) return;
    if (savedTours.find(s => s.tourTitle === tour.tourTitle)) {
      triggerToast("Already saved!");
      return;
    }
    await saveTourOffline(tour);
    const updated = await getSavedToursOffline();
    setSavedTours(updated);
    triggerToast("Saved for offline use!");
  };

  const handleDeleteTour = async (title: string) => {
    await deleteTourOffline(title);
    const updated = await getSavedToursOffline();
    setSavedTours(updated);
  };

  const playNarration = async (text: string) => {
    if (!isOnline) {
      triggerToast("Audio requires internet.");
      return;
    }
    if (isPlaying) { 
      if (audioSourceRef.current) audioSourceRef.current.stop();
      setIsPlaying(false);
      return; 
    }
    setLoadingAudio(true);
    try {
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const base64 = await generateAudioNarration(text, voice);
      const buffer = await decodeAudioBuffer(decodeBase64(base64), audioContextRef.current);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsPlaying(false);
      audioSourceRef.current = source;
      source.start(0);
      setIsPlaying(true);
    } catch (error) { triggerToast("Audio playback failed."); } finally { setLoadingAudio(false); }
  };

  const recommendedCities = [
    { name: 'Kyoto', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800' },
    { name: 'Rome', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800' },
    { name: 'Paris', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800' },
    { name: 'Bali', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800' }
  ];

  return (
    <div className={`min-h-screen pb-20 bg-white ${language === 'ar' ? 'font-arabic' : ''}`}>
      <Toast show={showToast} message={toastMessage} />
      
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[1000] bg-orange-600 text-white text-[10px] font-black py-1 flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg">
          <WifiOff className="w-3 h-3" />
          Offline Mode
        </div>
      )}

      {view !== 'explore' || tour ? (
        <Header 
          onOpenMobileSearch={() => setIsMobileSearchOverlayOpen(true)}
          activeTourCity={activeTourCity}
          t={t}
          loading={loading}
        />
      ) : null}

      <MobileSearchOverlay 
        isOpen={isMobileSearchOverlayOpen} 
        onClose={() => setIsMobileSearchOverlayOpen(false)}
        searchCityInput={searchCityInput} 
        setSearchCityInput={setSearchCityInput}
        suggestions={[]}
        onSearch={startTourGeneration} 
        isGeolocationLoading={isGeolocationLoading}
        onGeolocationSearch={handleGeolocationSearch}
        budget={budget} setBudget={setBudget}
        currency={currency} setCurrency={setCurrency}
        language={language} setLanguage={setLanguage}
        voice={voice} setVoice={setVoice}
        t={t}
      />

      <main className={`${view === 'explore' && !tour ? 'pt-0' : 'max-w-screen-md mx-auto px-4 pt-2'}`}>
        {view === 'saved' ? (
          <LibraryDisplay 
            tours={savedTours} t={t} 
            onOpen={(t) => { setTour(t); setActiveTourCity(t.city); setView('explore'); }}
            onDelete={(idx) => handleDeleteTour(savedTours[idx].tourTitle)}
            onShare={() => {}} onCreateNew={() => { setView('explore'); setTour(null); setIsMobileSearchOverlayOpen(true); }}
          />
        ) : view === 'timeline' && tour ? (
          <TimelineDetailView 
            tour={tour} onBack={() => setView('explore')} 
            onSelectStop={(idx) => { setView('explore'); setActiveStopIndex(idx); }} t={t} 
          />
        ) : tour ? (
          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="h-[300px] flex flex-col items-center justify-center p-6 text-center">
                <Loader className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
                <h3 className="text-lg font-black text-slate-800">{t('curating')}...</h3>
              </div>
            ) : (
              <TourDisplay 
                tour={tour} activeStopIndex={activeStopIndex} onStopChange={setActiveStopIndex}
                onPlayNarration={playNarration} isPlaying={isPlaying} loadingAudio={loadingAudio}
                onSave={handleSaveTour} onShare={() => {}}
                onShowTimeline={() => setView('timeline')}
                language={language} t={t}
              />
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {/* Reduced Hero Height */}
            <div className="relative h-[40vh] min-h-[320px] w-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1540544660406-6a69dacb2804?auto=format&fit=crop&q=80&w=1200" 
                className="absolute inset-0 w-full h-full object-cover" 
                alt="Luxury Travel"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />

              {/* Tighter Search Bar Trigger */}
              <div className="absolute top-8 left-0 right-0 px-5 z-20">
                <button 
                  onClick={() => setIsMobileSearchOverlayOpen(true)}
                  className="w-full bg-white/95 backdrop-blur-md h-11 rounded-xl px-4 flex items-center justify-between shadow-xl active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-slate-900" />
                    <span className="text-slate-400 font-medium text-xs">Where do you wanna go?</span>
                  </div>
                  <Filter className="w-3.5 h-3.5 text-slate-900 opacity-60" />
                </button>
              </div>

              {/* Hero Content - Adjusted Sizes */}
              <div className="absolute bottom-10 left-0 right-0 px-6 z-10">
                <h2 className="text-white text-2xl font-bold leading-tight mb-2 max-w-[240px] tracking-tight">
                  Discover your next luxury escape
                </h2>
                <p className="text-white/80 text-xs font-medium mb-5">
                  Personalized travel journeys
                </p>
                <button 
                  onClick={() => setIsMobileSearchOverlayOpen(true)}
                  className="bg-orange-600 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-xl active:scale-95 transition-all"
                >
                  Start Exploring Now
                </button>
              </div>
            </div>

            {/* Content Section - Denser Padding */}
            <div className="bg-white rounded-t-[2rem] -mt-8 relative z-20 px-6 pt-8 pb-6 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
              <h3 className="text-lg font-bold text-slate-900 mb-0.5 tracking-tight">
                Your travel companion
              </h3>
              <p className="text-slate-500 text-[10px] font-medium mb-5">
                Explore in responsible, local ways
              </p>

              {/* Smaller Categories */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6">
                {['Africa', 'Asia', 'Europe', 'Americas', 'Oceania'].map(cat => (
                  <button 
                    key={cat} 
                    className="shrink-0 bg-slate-50 border border-slate-100 px-5 py-2 rounded-full font-bold text-slate-900 text-xs hover:bg-slate-100 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Recommended</h3>
              </div>

              <div className="flex gap-4 overflow-x-auto no-scrollbar">
                {recommendedCities.map((city, idx) => (
                  <div key={idx} className="shrink-0 w-[200px] group cursor-pointer" onClick={() => {
                    setSearchCityInput(city.name);
                    setIsMobileSearchOverlayOpen(true);
                  }}>
                    <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-3 shadow-lg">
                      <img src={city.img} className="w-full h-full object-cover" alt={city.name} />
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-900 shadow-md">
                        <Heart className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-4 left-4">
                        <h4 className="text-white text-lg font-bold drop-shadow-md">{city.name}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer view={view === 'timeline' ? 'explore' : view} setView={(v) => {
        if (v === 'explore' && tour) setTour(null);
        setView(v as any);
      }} t={t} />
    </div>
  );
};

export default App;
