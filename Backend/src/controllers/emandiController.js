const { getBestCropWithGemini } = require("../utils/crop_predict.js");
const {
  fetchAgmarknetData,
  fetchGeographies,
  fetchMarketPrices,
  fetchMarkets,
getBestMarketsWithGemini
} = require("../utils/emandi_fetch_data.js");

// 🌾 Fetch commodities
exports.getAgmarknetData = async (req, res) => {
  try {
    const data = await fetchAgmarknetData();
    if (!data)
      return res.status(404).json({ success: false, message: "No commodities found" });

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("❌ getAgmarknetData Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🌍 Fetch all geographies
exports.getGeographies = async (req, res) => {
  try {
    const data = await fetchGeographies();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("❌ getGeographies Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 💰 Fetch market prices
exports.getMarketPrices = async (req, res) => {
  try {
    const { commodity_id, state_id, district_id } = req.body;

    if (!commodity_id || !state_id) {
      return res.status(400).json({
        success: false,
        message: "commodity_id and state_id are required",
      });
    }

    const data = await fetchMarketPrices(commodity_id, state_id, district_id);
    res.status(200).json({
      success: true,
      message: "Fetched market prices successfully",
      data,
    });
  } catch (err) {
    console.error("❌ getMarketPrices Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.getMarkets = async (req, res) => {
  try {
    const { commodity_id, state_id, district_id } = req.body;

    if (!commodity_id || !state_id || !district_id) {
      return res.status(400).json({
        success: false,
        message: "commodity_id, state_id, and district_id are required",
      });
    }

    const data = await fetchMarkets(commodity_id, state_id, district_id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No markets found for given parameters",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fetched markets successfully",
      data,
    });
  } catch (err) {
    console.error("❌ Controller Error (getMarkets):", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch markets",
      error: err.message,
    });
  }
};


exports.getBestMarkets = async (req, res) => {
  try {
    console.log("call get best markets")
    const { data, farmerLocation } = req.body;

    // ✅ Validate inputs
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: "Valid 'data' array required" });
    }
    if (!farmerLocation || !farmerLocation.state) {
      return res.status(400).json({ error: "Valid 'farmerLocation' object required" });
    }

    // ✅ Call Gemini helper
    const result = await getBestMarketsWithGemini({ data, farmerLocation });
    console.log(result.top_5_markets)

    res.status(200).json(result);
  } catch (error) {
    console.log("❌ Gemini Market Advisor Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};


exports.getBestCrops=async (req, res) => {
  try {
    const soilData = req.body;
    const result = await getBestCropWithGemini({ soilData });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}