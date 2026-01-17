
import { Language, VoiceOption } from './types';

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: '🇺🇸 English' },
  { code: 'ar', name: 'Arabic', nativeName: '🇸🇦 العربية' },
  { code: 'fr', name: 'French', nativeName: '🇫🇷 Français' },
  { code: 'pt', name: 'Portuguese', nativeName: '🇵🇹 Português' },
  { code: 'es', name: 'Spanish', nativeName: '🇪🇸 Español' },
  { code: 'de', name: 'German', nativeName: '🇩🇪 Deutsch' },
  { code: 'hi', name: 'Hindi', nativeName: '🇮🇳 हिन्दी' },
  { code: 'zh', name: 'Chinese', nativeName: '🇨🇳 中文' },
  { code: 'ko', name: 'Korean', nativeName: '🇰🇷 한국어' },
  { code: 'tr', name: 'Turkish', nativeName: '🇹🇷 Türkçe' },
  { code: 'ru', name: 'Russian', nativeName: '🇷🇺 Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '🇯🇵 日本語' },
];

export interface ExtendedVoiceOption extends VoiceOption {
  image: string;
  description: string;
}

export const VOICES: ExtendedVoiceOption[] = [
  { 
    id: 'Charon', 
    name: 'Charon', 
    gender: 'female', 
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    description: 'Friendly & Warm'
  },
  { 
    id: 'Kore', 
    name: 'Kore', 
    gender: 'male', 
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    description: 'Energetic & Fun'
  },
  { 
    id: 'Puck', 
    name: 'Puck', 
    gender: 'female', 
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    description: 'Calm & Professional'
  },
  { 
    id: 'Zephyr', 
    name: 'Zephyr', 
    gender: 'male', 
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    description: 'Deep & Authoritative'
  },
  { 
    id: 'Fenrir', 
    name: 'Fenrir', 
    gender: 'male', 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    description: 'Storyteller Style'
  },
];
