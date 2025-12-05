import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateCreativeIdeas = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Eres un asistente de estrategia de marca creativo. Ayuda al equipo con la siguiente solicitud: ${prompt}. 
      Mantén un tono profesional pero inspirador. Responde siempre en Español. Usa viñetas claras si es aplicable.`,
    });
    return response.text || "No se generó respuesta.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Lo siento, no pude generar ideas en este momento. Por favor verifica la API Key.";
  }
};