
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
  
  const prompt = `Create a high-quality, comprehensive city tour for ${city} in ${language}. 
  CRITICAL REQUIREMENTS:
  1. The tour MUST consist of exactly 5 to 8 distinct stops.
  2. The total estimated cost for one person MUST be strictly between ${minBudget} and ${maxBudget} ${currency}.
  3. Tailor the stops to the budget: 
     - Low budget (<50 ${currency}): Focus on free cultural spots, public parks, and historic architecture.
     - Mid budget (50-200 ${currency}): Include 1-2 paid museums or local experiences.
     - High budget (>200 ${currency}): Include premium guided tours, luxury viewpoints, or specialty workshops.
  4. Provide accurate GPS coordinates for every stop.
  5. Include detailed transport modes (walking, bus, etc.) and distances.
  6. The commentary should be engaging and localized.
  7. Return valid JSON matching the schema.`;
  
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
            minItems: 5,
            maxItems: 8,
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
              },
              required: ["name", "latitude", "longitude", "description", "commentary"]
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
  
  // Ensure every stop has a valid image and coordinates
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
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Speak this in ${targetLanguage}: ${text}` }] }],
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
