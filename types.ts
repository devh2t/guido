
export interface Stop {
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  commentary: string;
  estimatedCost: number;
  costDescription: string;
  distanceFromPrevious?: string; // e.g. "1.5 km"
  transportMode?: 'walking' | 'bus' | 'tram' | 'metro' | 'ferry' | 'taxi' | 'cable_car';
  transportCost?: number;
  transportDescription?: string; // e.g. "Take Metro Line 1 to Station X"
  visualUrl?: string; // URL to a real photo
  groundingLinks?: { title: string; uri: string }[];
}

export interface Tour {
  tourTitle: string;
  city: string;
  overview: string;
  stops: Stop[];
  totalEstimatedCost: number;
  currency: string;
  totalDistance?: string;
  headerVisualUrl?: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'male' | 'female';
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}
