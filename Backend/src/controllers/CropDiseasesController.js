const CropDiseasePrediction = require("../models/CropDiseaseModel");
const Farmer = require("../models/Farmer");
const axios = require("axios");
const mongoose = require("mongoose");
const {uploadFiles} = require("../utils/FileUploader");
// ML Model API Configuration
const ML_API_URL = "https://crop-disease-detection-rice-wheat-tomato.onrender.com/predict";

// Controller to handle crop disease prediction history
exports.getCropDiseasePredictionHistory = async (req, res) => {
  try {
    const farmerId = req.farmer.id;
    
    // Validate farmerId
    if (!farmerId) {
      return res.status(400).json({ 
        success: false,
        message: "Farmer ID is required" 
      });
    }

    const farmer = await Farmer.findById(farmerId).populate({
      path: "CropDiseaseHistory",
      options: { sort: { createdAt: -1 } } // Sort by most recent first
    });
    
    if (!farmer) {
      return res.status(404).json({ 
        success: false,
        message: "Farmer not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: farmer.CropDiseaseHistory || [],
      count: farmer.CropDiseaseHistory?.length || 0
    });
  } catch (error) {
    console.error("Error fetching crop disease prediction history:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
};

// Get specific prediction by ID
exports.getCropDiseasePredictionById = async (req, res) => {
  try {
    const { DiseaseId } = req.body;
    
    if (!DiseaseId) {
      return res.status(400).json({ 
        success: false,
        message: "Disease ID is required" 
      });
    }

    const prediction = await CropDiseasePrediction.findById(DiseaseId).populate('farmerId', 'firstName lastName email');
    
    if (!prediction) {
      return res.status(404).json({ 
        success: false,
        message: "Prediction not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: prediction
    });
  } catch (error) {
    console.error("Error fetching crop disease prediction by ID:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
};

// Add new crop disease prediction with ML model integration
exports.addAndCallMLModelCropDiseasePrediction = async (req, res) => {
  try {
    const { image, cropType } = req.body;
    const farmerId = req.farmer.id;
    // Validate required fields
    if (!farmerId) {
      return res.status(400).json({ 
        success: false,
        message: "Farmer ID is required" 
      });
    }

    if (!image) {
      return res.status(400).json({ 
        success: false,
        message: "Image (base64) is required" 
      });
    }

    if (!cropType) {
      return res.status(400).json({ 
        success: false,
        message: "Crop type is required" 
      });
    }

    // Validate crop type
    const validCropTypes = ['rice', 'wheat', 'tomato'];
    const normalizedCropType = cropType.toLowerCase().trim();
    
    if (!validCropTypes.includes(normalizedCropType)) {
      return res.status(400).json({ 
        success: false,
        message: `Invalid crop type. Must be one of: ${validCropTypes.join(', ')}` 
      });
    }

    // Check if farmer exists
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ 
        success: false,
        message: "Farmer not found" 
      });
    }

    // Call ML model for prediction
    const mlModelResponse = await callMLModel(image, normalizedCropType);

    // Validate ML model response
    if (!mlModelResponse.predictions || mlModelResponse.predictions.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "No predictions returned from ML model" 
      });
    }

    // Build a proper data URI for base64 image. Accept either full data URI
    // (e.g. "data:image/png;base64,...") or a raw base64 string.
    let uploadCloudBase64;
    if (typeof image === 'string' && image.startsWith('data:')) {
      uploadCloudBase64 = image;
    } else if (typeof image === 'string') {
      // If caller sent raw base64 without a MIME prefix, assume jpeg.
      // You can adjust default mime-type if you know your input (png/webp etc.).
      uploadCloudBase64 = `data:${image}`;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid image format' });
    }

    // Upload image to Cloudinary. The uploadFiles util accepts an object
    // with a `tempFilePath` property; passing a data URI string works with
    // cloudinary.uploader.upload() directly.
    const uploadResult = await uploadFiles({ tempFilePath: uploadCloudBase64 }, `KisanMitra`);
    if (!uploadResult || !uploadResult.secure_url) {
      // If the util returned an error object, include that in response for debug.
      return res.status(500).json({ 
        success: false,
        message: "Image upload failed",
        error: uploadResult?.error || uploadResult?.message || "Unknown error"
      });
    }
    const imageUrl = uploadResult.secure_url;
    // Save the prediction result to the database
    const newPrediction = new CropDiseasePrediction({
      farmerId,
      cropType: normalizedCropType,
      predictedDiseases: mlModelResponse.predictions,
      imageUrl:imageUrl
    });

    await newPrediction.save();

    // Update farmer's prediction history
    if (!farmer.CropDiseaseHistory) {
      farmer.CropDiseaseHistory = [];
    }
    farmer.CropDiseaseHistory.push(newPrediction._id);
    await farmer.save();

    // Return the saved prediction including the Cloudinary secure URL
    res.status(201).json({
      success: true,
      message: "Crop disease prediction completed successfully",
      data: {
        _id: newPrediction._id,
        farmerId: newPrediction.farmerId,
        cropType: newPrediction.cropType,
        predictedDiseases: newPrediction.predictedDiseases,
        imageUrl: newPrediction.imageUrl,
        predictionDate: newPrediction.predictionDate,
        createdAt: newPrediction.createdAt,
        updatedAt: newPrediction.updatedAt
      }
    });
  } catch (error) {
    console.error("Error adding crop disease prediction:", error);
    
    // Handle specific error types
    if (error.response) {
      // ML API responded with an error
      return res.status(error.response.status || 500).json({ 
        success: false,
        message: "ML model prediction failed",
        error: error.response.data || error.message 
      });
    } else if (error.request) {
      // Request was made but no response received
      return res.status(503).json({ 
        success: false,
        message: "ML model service unavailable. Please try again later.",
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
};

// Helper function to call ML model API
const callMLModel = async (imageBase64, cropType) => {
  try {

    // Prepare request payload
    const payload = {
      image: `${imageBase64}`,
      crop_type: cropType
    };
    // console.log("Payload for ML Model:", payload);
    console.log(`Calling ML API for crop type: ${cropType}`);

    // Make API request to ML model
    const response = await axios.post(ML_API_URL, payload);

    // Validate response
    if (!response.data) {
      throw new Error("Empty response from ML model");
    }

    const { predictions, status } = response.data;

    if(status !== 'ok') {
      throw new Error(`ML model error: ${status}`);
    }

    if (!predictions || !Array.isArray(predictions)) {
      throw new Error("Invalid prediction format from ML model");
    }

    console.log(`ML API Response - Status: ${status}, Predictions:`, predictions);

    // Return only the predictions array as per the simplified model
    return {
      predictions,
      status // Keep status for logging but won't be saved to DB
    };
  } catch (error) {
    console.error("Error calling ML model:", error.message);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error("ML model request timeout. Please try again.");
    }
    
    if (error.response) {
      throw new Error(`ML model API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    
    throw error;
  }
};

// Delete a prediction (optional - for cleanup)
exports.deleteCropDiseasePrediction = async (req, res) => {
  try {
    const { DiseaseId } = req.body;
    const farmerId = req.farmer.id;
    
    if (!DiseaseId) {
      return res.status(400).json({ 
        success: false,
        message: "DiseaseId is required" 
      });
    }
    
    const prediction = await CropDiseasePrediction.findById(DiseaseId);
    
    if (!prediction) {
      return res.status(404).json({ 
        success: false,
        message: "Prediction not found" 
      });
    }

    // Verify that the prediction belongs to the logged-in farmer
    if (prediction.farmerId.toString() !== farmerId.toString()) {
      return res.status(403).json({ 
        success: false,
        message: "You are not authorized to delete this prediction" 
      });
    }

    // Remove from farmer's history
    await Farmer.findByIdAndUpdate(
      farmerId,
      { $pull: { CropDiseaseHistory: new mongoose.Types.ObjectId(DiseaseId)} }
    );

    await CropDiseasePrediction.findByIdAndDelete(DiseaseId);

    res.status(200).json({
      success: true,
      message: "Prediction deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting crop disease prediction:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
};