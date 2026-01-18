
import { create } from 'zustand';
import { Tour } from '../types';
import { getSavedToursOffline, saveTourOffline, deleteTourOffline } from '../services/dbService';

interface AppState {
  isOnline: boolean;
  savedTours: Tour[];
  view: 'explore' | 'saved' | 'timeline' | 'login' | 'profile';
  isLoading: boolean;
  theme: 'light' | 'dark';
  
  // Actions
  setOnline: (status: boolean) => void;
  setView: (view: 'explore' | 'saved' | 'timeline' | 'login' | 'profile') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  loadSavedTours: () => Promise<void>;
  addSavedTour: (tour: Tour) => Promise<void>;
  removeSavedTour: (tourTitle: string) => Promise<void>;
  init: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  savedTours: [],
  view: 'explore',
  isLoading: false,
  theme: (typeof localStorage !== 'undefined' ? localStorage.getItem('theme') as 'light' | 'dark' : 'light') || 'light',

  setOnline: (status) => set({ isOnline: status }),
  setView: (view) => set({ view }),
  setTheme: (theme) => {
    set({ theme });
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },

  loadSavedTours: async () => {
    try {
      const tours = await getSavedToursOffline();
      set({ savedTours: tours });
    } catch (e) {
      console.error("Failed to load offline tours", e);
    }
  },

  addSavedTour: async (tour) => {
    await saveTourOffline(tour);
    await get().loadSavedTours();
  },

  removeSavedTour: async (tourTitle) => {
    await deleteTourOffline(tourTitle);
    await get().loadSavedTours();
  },

  init: () => {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('online', () => get().setOnline(true));
    window.addEventListener('offline', () => get().setOnline(false));
    
    // Initial theme setup
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      get().setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      get().setTheme('dark');
    }

    get().loadSavedTours();
  }
}));
