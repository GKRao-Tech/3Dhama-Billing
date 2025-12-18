
import { GoogleGenAI, Type } from "@google/genai";
import { Bill } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBusinessInsights = async (bills: Bill[]) => {
  if (bills.length === 0) return "Start selling to see AI insights!";

  const summary = bills.slice(0, 50).map(b => ({
    date: b.date,
    total: b.total,
    items: b.items.map(i => i.name)
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these recent sales for a cake shop and provide 3 short, actionable business tips (max 10 words each) based on trends: ${JSON.stringify(summary)}`,
      config: {
        systemInstruction: "You are a bakery business consultant. Be concise and professional.",
      }
    });

    return response.text || "No insights available right now.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not load AI insights.";
  }
};
