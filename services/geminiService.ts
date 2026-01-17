
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Tour, Stop } from "../types";

// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
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
    // Access .text property directly
    return JSON.parse(response.text || '[]');
  } catch (error) { return []; }
};

export const generateTourData = async (city: string, language: string, budget: number, currency: string): Promise<Tour> => {
  const ai = getAI();
  const prompt = `Create a city tour for ${city} in ${language}. Budget: ${budget} ${currency}. Include stops with lat/lng, description, commentary script, and transport info.`;
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
        }
      }
    }
  });
  // Access .text property directly
  return JSON.parse(response.text || '{}') as Tour;
};

export const generateAudioNarration = async (text: string, voice: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
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
  // Raw PCM data from Gemini TTS is 16-bit, 24kHz, Mono
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
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
  // Access .text property directly
  return response.text?.trim() || 'Unknown City';
};

export const fetchRealStopImage = async (stopName: string, city: string): Promise<string> => {
  return `https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=800`;
};
