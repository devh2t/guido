
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
import { useI18n } from './hooks/useI18n';

import Header from './components/Header';
import MobileSearchOverlay from './components/MobileSearchOverlay';
import TourDisplay from './components/TourDisplay';
import LibraryDisplay from './components/LibraryDisplay';
import TimelineDetailView from './components/TimelineDetailView';
import LoadingSkeleton from './components/LoadingSkeleton';
import Footer from './components/Footer';
import Toast from './components/Toast';
import AuthPages from './components/AuthPages';

import { Search, WifiOff, Heart, Filter, UserCircle } from 'lucide-react';

type Continent = 'Africa' | 'Asia' | 'Europe' | 'Americas' | 'Oceania';

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { language, setLanguage, t, isRtl } = useI18n('en');
  
  const [activeTourCity, setActiveTourCity] = useState('');
  const [searchCityInput, setSearchCityInput] = useState('');
  
  // Budget Range States
  const [minBudget, setMinBudget] = useState<number>(0);
  const [maxBudget, setMaxBudget] = useState<number>(1000);
  
  const [currency, setCurrency] = useState('USD');
  const [voice, setVoice] = useState('Charon');
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGeolocationLoading, setIsGeolocationLoading] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [savedTours, setSavedTours] = useState<Tour[]>([]);
  const [view, setView] = useState<'explore' | 'saved' | 'timeline' | 'login'>('explore');
  const [isMobileSearchOverlayOpen, setIsMobileSearchOverlayOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const [activeCategory, setActiveCategory] = useState<Continent>('Africa');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const categoryHeroImages: Record<Continent, string> = {
    'Africa': 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1200&auto=format&fit=crop&q=80', // Marrakech
    'Asia': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&auto=format&fit=crop&q=80', // Kyoto
    'Europe': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80', // Paris
    'Americas': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&auto=format&fit=crop&q=80', // New York
    'Oceania': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&auto=format&fit=crop&q=80' // Sydney
  };

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
    setActiveTourCity(cityName);
    setTour(null);
    setView('explore');
    
    try {
      const selectedLang = LANGUAGES.find(l => l.code === language)?.name || 'English';
      const data = await generateTourData(cityName, selectedLang, minBudget, maxBudget, currency);
      setTour(data);
      setActiveStopIndex(0);
    } catch (error) {
      triggerToast("Error generating tour.");
      setActiveTourCity('');
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
      const currentLanguageName = LANGUAGES.find(l => l.code === language)?.name || 'English';
      const base64 = await generateAudioNarration(text, voice, currentLanguageName);
      const buffer = await decodeAudioBuffer(decodeBase64(base64), audioContextRef.current);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsPlaying(false);
      audioSourceRef.current = source;
      source.start(0);
      setIsPlaying(true);
    } catch (error) { 
      console.error(error);
      triggerToast("Audio playback failed."); 
    } finally { setLoadingAudio(false); }
  };

  const cityData: Record<Continent, {name: string, img: string}[]> = {
    'Africa': [
      { name: 'Marrakech', img: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=900&auto=format&fit=crop&q=60' },
      { name: 'Chefchaouen', img: 'https://images.unsplash.com/photo-1538600838042-6a0c694ffab5?q=80&w=1035&auto=format&fit=crop' },
      { name: 'Fez', img: 'https://images.unsplash.com/photo-1512958789358-4effcbe171a0?w=900&auto=format&fit=crop&q=60' },
      { name: 'Rabat', img: 'https://plus.unsplash.com/premium_photo-1761691907039-91974b136d1e?w=900&auto=format&fit=crop&q=60' },
      { name: 'Agadir', img: 'https://images.unsplash.com/photo-1630172006681-a0b1d335c9e3?w=900&auto=format&fit=crop&q=60' },
      { name: 'Tanger', img: 'https://media.istockphoto.com/id/2167489072/photo/cape-spartel-lighthouse-near-tangier-morocco.webp?a=1&b=1&s=612x612&w=0&k=20&c=NCp-9N-Iogr13DPXpMz3rqWVw-7WvTOoRxG3ovtb3hY=' }
    ],
    'Asia': [
      { name: 'Kyoto', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800' },
      { name: 'Bali', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800' },
      { name: 'Seoul', img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800' },
      { name: 'Bangkok', img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579367?auto=format&fit=crop&q=80&w=800' },
      { name: 'Tokyo', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800' }
    ],
    'Europe': [
      { name: 'Paris', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800' },
      { name: 'Rome', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800' },
      { name: 'Barcelona', img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80&w=800' },
      { name: 'Amsterdam', img: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&q=80&w=800' },
      { name: 'Prague', img: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&q=80&w=800' }
    ],
    'Americas': [
      { name: 'New York', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800' },
      { name: 'Rio de Janeiro', img: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=800' },
      { name: 'Cusco', img: 'https://images.unsplash.com/photo-1587547131116-a0655a526190?auto=format&fit=crop&q=80&w=800' },
      { name: 'Mexico City', img: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&q=80&w=800' },
      { name: 'Vancouver', img: 'https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&q=80&w=800' }
    ],
    'Oceania': [
      { name: 'Sydney', img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=800' },
      { name: 'Melbourne', img: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&q=80&w=800' },
      { name: 'Auckland', img: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&q=80&w=800' },
      { name: 'Bora Bora', img: 'https://images.unsplash.com/photo-1532408840957-031d8034aeed?auto=format&fit=crop&q=80&w=800' },
      { name: 'Queenstown', img: 'https://images.unsplash.com/photo-1589871146128-db3f0840c492?auto=format&fit=crop&q=80&w=800' }
    ]
  };

  return (
    <div className={`min-h-screen pb-36 bg-white transition-all duration-500`}>
      <Toast show={showToast} message={toastMessage} />
      
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[1000] bg-orange-600 text-white text-[10px] font-black py-1 flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg">
          <WifiOff className="w-3 h-3" />
          Offline Mode
        </div>
      )}

      {view === 'login' && (
        <AuthPages 
          onBack={() => setView('explore')} 
          onSuccess={() => { setView('explore'); triggerToast("Successfully logged in!"); }} 
          t={t} 
        />
      )}

      {(view !== 'explore' || tour || loading) && view !== 'login' ? (
        <Header 
          onOpenMobileSearch={() => setIsMobileSearchOverlayOpen(true)}
          activeTourCity={activeTourCity}
          onOpenLogin={() => setView('login')}
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
        minBudget={minBudget} setMinBudget={setMinBudget}
        maxBudget={maxBudget} setMaxBudget={setMaxBudget}
        currency={currency} setCurrency={setCurrency}
        language={language} setLanguage={setLanguage}
        voice={voice} setVoice={setVoice}
        t={t}
      />

      {view !== 'login' && (
        <main className={`${(view === 'explore' && !tour && !loading) ? 'pt-0' : 'max-w-screen-md mx-auto px-4 pt-4'}`}>
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
          ) : loading ? (
            <LoadingSkeleton city={activeTourCity} t={t} />
          ) : tour ? (
            <TourDisplay 
              tour={tour} activeStopIndex={activeStopIndex} onStopChange={setActiveStopIndex}
              onPlayNarration={playNarration} isPlaying={isPlaying} loadingAudio={loadingAudio}
              onSave={handleSaveTour} onShare={() => {}}
              onShowTimeline={() => setView('timeline')}
              language={language} t={t}
            />
          ) : (
            <div className="animate-in fade-in duration-500">
              <div className="relative h-[40vh] min-h-[320px] w-full overflow-hidden">
                <img 
                  src={categoryHeroImages[activeCategory]} 
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700" 
                  alt={activeCategory}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />

                <div className="absolute top-8 left-0 right-0 px-5 z-20 flex items-center gap-2">
                  <button 
                    onClick={() => setIsMobileSearchOverlayOpen(true)}
                    className="flex-1 bg-white/95 backdrop-blur-md h-11 rounded-xl px-4 flex items-center justify-between shadow-xl active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="w-4 h-4 text-slate-900" />
                      <span className="text-slate-400 font-medium text-xs">Where do you wanna go?</span>
                    </div>
                    <Filter className="w-3.5 h-3.5 text-slate-900 opacity-60" />
                  </button>
                  <button onClick={() => setView('login')} className="bg-white/95 backdrop-blur-md h-11 w-11 rounded-xl flex items-center justify-center text-slate-900 shadow-xl scale-95 transition-transform active:scale-90">
                    <UserCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="absolute bottom-10 left-0 right-0 px-6 z-10 text-start">
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

              <div className="bg-white rounded-t-[2rem] -mt-8 relative z-20 px-6 pt-8 pb-36 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] text-start">
                <h3 className="text-lg font-bold text-slate-900 mb-0.5 tracking-tight">
                  Your travel companion
                </h3>
                <p className="text-slate-500 text-[10px] font-medium mb-5">
                  Explore in responsible, local ways
                </p>

                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6">
                  {(Object.keys(cityData) as Continent[]).map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setActiveCategory(cat)}
                      className={`shrink-0 border px-5 py-2 rounded-full font-bold text-xs transition-all ${
                        activeCategory === cat 
                          ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                          : 'bg-slate-50 border-slate-100 text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Recommended in {activeCategory}</h3>
                </div>

                <div className="flex gap-4 overflow-x-auto no-scrollbar">
                  {cityData[activeCategory].map((city, idx) => (
                    <div key={idx} className="shrink-0 w-[200px] group cursor-pointer" onClick={() => {
                      setSearchCityInput(city.name);
                      setIsMobileSearchOverlayOpen(true);
                    }}>
                      <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-3 shadow-lg">
                        <img src={city.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={city.name} />
                        <button className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-900 shadow-md`}>
                          <Heart className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-4 left-4 right-4">
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
      )}

      {view !== 'login' && (
        <Footer view={view === 'timeline' ? 'explore' : view} setView={(v) => {
          if (v === 'explore' && tour) setTour(null);
          setView(v as any);
        }} t={t} />
      )}
    </div>
  );
};

export default App;
