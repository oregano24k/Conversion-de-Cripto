
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getMarketInsight(cryptoName: string, fiatName: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza brevemente la situación actual de ${cryptoName} respecto al ${fiatName}. 
      Proporciona un resumen de 3 puntos clave sobre por qué su precio podría subir o bajar hoy. 
      Responde en español de forma profesional pero cercana.`,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      }
    });

    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Error fetching Gemini insight:", error);
    return { text: "No se pudo obtener el análisis en este momento.", sources: [] };
  }
}
