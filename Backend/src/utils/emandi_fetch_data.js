const axios = require("axios");
const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();


// 🌾 1️⃣ Fetch all commodities
exports.fetchAgmarknetData = async () => {
  try {
    const response = await axios.get(`${process.env.API_URL}/commodities`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Commodities Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch commodities:", error.response?.data || error.message);
    throw error;
  }
};

// 🌍 2️⃣ Fetch states and districts
exports.fetchGeographies = async () => {
  try {
    const response = await axios.get(`${process.env.API_URL}/geographies`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Geographies Data:", response.data);
    return response.data.geographies || response.data;
  } catch (error) {
    console.error("❌ Failed to fetch geographies:", error.response?.data || error.message);
    throw error;
  }
};

// 💰 3️⃣ Fetch prices for a commodity, state, district, and market
exports.fetchMarketPrices = async (commodity_id, state_id, district_id) => {
  try {
    if (!commodity_id || !state_id) {
      throw new Error("commodity_id and state_id are required");
    }

    const body = {
      commodity_id: Number(commodity_id),
      state_id: Number(state_id),
      district_id: district_id ? [Number(district_id)] : [],
      from_date: "2025-01-01",
      to_date: "2025-10-31",
    };

    const response = await axios.post(
      `${process.env.API_URL}/prices`,
      body,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Market Prices Data:", response.data);
    return response.data.data || response.data;
  } catch (error) {
    console.error("❌ Failed to fetch market prices:", error.response?.data || error.message);
    throw error;
  }
};


// 🏪 4️⃣ Fetch markets for a given commodity, state, and district
exports.fetchMarkets = async (commodity_id, state_id, district_id) => {
  try {
    if (!commodity_id || !state_id || !district_id) {
      throw new Error("commodity_id, state_id, and district_id are required");
    } 

    const body = {
      commodity_id: Number(commodity_id),
      state_id: Number(state_id),
      district_id: Number(district_id),
      indicator: "price", // fixed as per API docs
    };

    const response = await axios.post(
      `${process.env.API_URL}/markets`,
      body,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Markets Data:", response.data);
    return response.data.data || response.data;
  } catch (error) {
    console.error("❌ Failed to fetch markets:", error.response?.data || error.message);
    throw error;
  }
};





// ✅ Initialize Gemini (v1 API)
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
console.log(
  "🔑 GEMINI_API_KEY loaded:",
  process.env.GEMINI_API_KEY ? "✅ Yes" : "❌ No"
);

const GEMINI_MODEL_NAME = process.env.GEMINI_MODEL_NAME || "gemini-2.5-flash";

/**
 * Get top 5 best markets for a farmer using Gemini
 * @param {Object} params - { data: [markets], farmerLocation: {state, district, lat, lon} }
 * @returns {Promise<Object|string>} - Parsed JSON or "NOT_ENOUGH"
 */
exports.getBestMarketsWithGemini=async({ data, farmerLocation })=> {
  try {
    if (!Array.isArray(data) || data.length === 0) return "NOT_ENOUGH";
    if (!farmerLocation || !farmerLocation.state) return "NOT_ENOUGH";

    const prompt = `
You are an AI agricultural economist.

Input:
Farmer location: ${JSON.stringify(farmerLocation)}
Market entries: ${JSON.stringify(data)}

Task:
1. If input lacks data, reply ONLY "NOT_ENOUGH".
2. Rank markets based on modal_price (higher is better) and proximity (same district > same state > other state).
3. Estimate qualitative expected_profit = modal_price - transport_cost (high, medium, low).
4. Return ONLY this JSON:
{
  "top_5_markets": [
    {
      "market_id": "<number>",
      "expected_profit": "<high|medium|low>",
      "reason": "<one-line reason>"
    }
  ]
}
`;

    const response = await genAI.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      maxOutputTokens: 400,
    });

    // console.log(response.top_5_markets)

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
    console.error("❌ Error in getBestMarketsWithGemini:", err);
    return { error: err.message };
  }
}




// // ✅ Example test
// const marketData = [
//   { market_id: 101, commodity: "Wheat", modal_price: 2800, census_state: "MP", census_district: "Indore" },
//   { market_id: 102, commodity: "Wheat", modal_price: 3100, census_state: "MP", census_district: "Bhopal" },
//   { market_id: 103, commodity: "Wheat", modal_price: 2950, census_state: "Gujarat", census_district: "Surat" },
// ];

// const farmerLocation = { state: "Madhya Pradesh", district: "Indore", lat: 22.7, lon: 75.8 };