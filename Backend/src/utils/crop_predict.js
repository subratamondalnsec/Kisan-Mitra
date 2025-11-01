const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();

// ✅ Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
console.log(
  "🔑 GEMINI_API_KEY loaded:",
  process.env.GEMINI_API_KEY ? "✅ Yes" : "❌ No"
);

const GEMINI_MODEL_NAME = process.env.GEMINI_MODEL_NAME || "gemini-2.5-flash";

/**
 * Get best crop recommendations + short soil, fertilizer & pesticide suggestions using Gemini
 * @param {Object} soilData - { N, P, K, PH, humidity, temperature }
 */
exports.getBestCropWithGemini = async ({ soilData }) => {
  try {
    console.log("🌾 Calling Gemini for crop recommendation...");

    if (!soilData || typeof soilData !== "object") return "NOT_ENOUGH";
    const required = ["N", "P", "K", "PH", "humidity", "temperature"];
    const ok = required.every((k) => soilData.hasOwnProperty(k));
    if (!ok) return "NOT_ENOUGH";

    // 🧠 Refined prompt for concise, human-readable output
    const prompt = `
You are an expert agronomist and soil scientist.

Input:
Soil Data: ${JSON.stringify(soilData)}

Task:
1. Suggest the **top 3 best crops** suited for this soil.
2. For each crop, give:
   - "crop"
   - "suitability_score" (0–1)
   - "key_reasons": short (max 10 words)
   - "risk_notes": short (max 10 words)
3. Suggest **2–3 soil_improvement_actions** (each under 8 words).
4. Suggest **2–3 fertilizers** with short "purpose" and "notes" (max 6–8 words).
5. Suggest **1–2 pesticides** (short names, safe types).
6. Give overall **confidence** (high | medium | low).
7. Reply ONLY with valid JSON like:
{
  "top_crops": [
    {"crop": "", "suitability_score": 0.0, "key_reasons": "", "risk_notes": ""}
  ],
  "soil_improvement_actions": ["", ""],
  "recommended_fertilizers": [{"name": "", "purpose": "", "notes": ""}],
  "recommended_pesticides": [{"name": "", "type": "", "notes": ""}],
  "confidence": ""
}
Keep sentences short, simple, and to the point.
`;

    const response = await genAI.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      maxOutputTokens: 400,
    });

    const text = response.text?.trim();
    if (!text) return { rawResponse: "EMPTY_RESPONSE" };

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { rawResponse: text };

    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      return { rawResponse: text };
    }
  } catch (err) {
    console.log("❌ Error in getBestCropWithGemini:", err);
    return { error: err.message };
  }
};
