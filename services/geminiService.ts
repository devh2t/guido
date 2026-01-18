
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Tour, Stop } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCitySuggestions = async (input: string): Promise<string[]> => {
  if (!input || input.length < 2) return [];
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest 5 real-world city names for: "${input}". Return ONLY a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) { return []; }
};

export const generateTourData = async (
  city: string, 
  language: string, 
  minBudget: number, 
  maxBudget: number, 
  currency: string
): Promise<Tour> => {
  const ai = getAI();
  // Enhanced prompt to respect the budget range specifically
  const prompt = `Create a high-quality city tour for ${city} in ${language}. 
  The total estimated cost for one person must be between ${minBudget} and ${maxBudget} ${currency}. 
  Include stops with lat/lng, description, commentary script, and transport info. 
  If the budget is high, suggest premium experiences. If low, suggest free or low-cost landmarks.
  Ensure the response is valid JSON.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tourTitle: { type: Type.STRING },
          city: { type: Type.STRING },
          overview: { type: Type.STRING },
          totalEstimatedCost: { type: Type.NUMBER },
          currency: { type: Type.STRING },
          totalDistance: { type: Type.STRING },
          stops: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                latitude: { type: Type.NUMBER },
                longitude: { type: Type.NUMBER },
                description: { type: Type.STRING },
                commentary: { type: Type.STRING },
                estimatedCost: { type: Type.NUMBER },
                costDescription: { type: Type.STRING },
                transportMode: { type: Type.STRING },
                distanceFromPrevious: { type: Type.STRING }
              }
            }
          }
        },
        required: ["tourTitle", "city", "stops", "totalEstimatedCost", "currency"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  
  const data = JSON.parse(text) as Tour;
  
  if (!data || !data.stops || !Array.isArray(data.stops) || data.stops.length === 0) {
    throw new Error("Invalid tour data generated: Missing stops");
  }

  // Ensure every stop has coordinates and images
  data.stops = data.stops.map(stop => ({
    ...stop,
    latitude: stop.latitude || 0,
    longitude: stop.longitude || 0,
    visualUrl: `https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=800`
  }));

  return data;
};

export const generateAudioNarration = async (text: string, voice: string, targetLanguage: string = 'English'): Promise<string> => {
  const ai = getAI();
  const personalityMap: Record<string, string> = {
    'Charon': 'Friendly, warm, and welcoming local guide.',
    'Kore': 'Energetic, fun, and enthusiastic explorer.',
    'Puck': 'Calm, professional, and sophisticated historian.',
    'Zephyr': 'Deep, authoritative, and knowledgeable expert.',
    'Fenrir': 'Classic storyteller with a sense of wonder.'
  };
  const personality = personalityMap[voice] || 'Professional guide.';

  const textOptimizationResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are ${voice}, a narrator with the following personality: ${personality}. Adapt the following text for a natural, spoken audio guide in ${targetLanguage}. TEXT: "${text}"`,
  });

  const optimizedText = textOptimizationResponse.text || text;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Speak this in ${targetLanguage}: ${optimizedText}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { 
        voiceConfig: { 
          prebuiltVoiceConfig: { voiceName: voice } 
        } 
      },
    },
  });

  const base64 = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
  if (!base64) throw new Error("No audio generated");
  return base64;
};

export const decodeBase64 = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const decodeAudioBuffer = async (data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length;
  const buffer = ctx.createBuffer(1, frameCount, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
};

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `What city is at latitude ${lat}, longitude ${lng}? Return only the city name.`
  });
  return response.text?.trim() || 'Unknown City';
};

export const fetchRealStopImage = async (stopName: string, city: string): Promise<string> => {
  return `https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=800`;
};
