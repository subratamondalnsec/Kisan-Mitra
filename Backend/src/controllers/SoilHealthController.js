const SoilHealth = require('../models/SoilHealthModel');
const Farmer = require('../models/Farmer');
const axios = require('axios');

// GET - Fetch all soil health history for a farmer
exports.getSoilHealthHistory = async (req, res) => {
  try {
    const farmerId = req.farmer.id;

    // Fetch all soil health records for this farmer
    const soilHealthRecords = await SoilHealth.find({ farmerId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate('farmerId', 'firstName lastName email');

    return res.status(200).json({
      success: true,
      message: 'Soil health history fetched successfully',
      data: soilHealthRecords,
      count: soilHealthRecords.length
    });
  } catch (error) {
    console.error('Error fetching soil health history:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch soil health history',
      error: error.message
    });
  }
};

// POST - Test and call ML model for soil quality prediction
exports.testSoilQuality = async (req, res) => {
  try {
    const farmerId = req.farmer.id;
    const {
      Temperature,
      Humidity,
      Wind_Speed,
      Nitrogen,
      Phosphorous,
      Potassium,
      Crop_Type
    } = req.body;

    // Validate required fields
    if (
      Temperature === undefined ||
      Humidity === undefined ||
      Wind_Speed === undefined ||
      Nitrogen === undefined ||
      Phosphorous === undefined ||
      Potassium === undefined ||
      !Crop_Type
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: Temperature, Humidity, Wind_Speed, Nitrogen, Phosphorous, Potassium, Crop_Type'
      });
    }

    // Verify farmer exists
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Prepare data for ML model
    const mlModelData = {
      Temperature: parseFloat(Temperature),
      Humidity: parseFloat(Humidity),
      Wind_Speed: parseFloat(Wind_Speed),
      Nitrogen: parseFloat(Nitrogen),
      Phosphorous: parseFloat(Phosphorous),
      Potassium: parseFloat(Potassium),
      Crop_Type: Crop_Type
    };

    // Call ML model API
    const mlResponse = await axios.post(
      'https://crop-disease-detection-rice-wheat-tomato.onrender.com/soil_quality',
      mlModelData
    );
    console.log("ML Response Data:", mlResponse.data);
    let soilQuality = mlResponse.data.soil_quality;
    soilQuality =soilQuality *1.38

    // Determine solution based on soil quality
    let solution = '';
    if (soilQuality >= 70) {
      solution = 'Excellent soil quality! Continue with current soil management practices. Regular monitoring recommended.';
    } else if (soilQuality >= 50) {
      solution = 'Good soil quality. Consider adding organic matter and balanced fertilizers to maintain nutrient levels.';
    } else if (soilQuality >= 30) {
      solution = 'Moderate soil quality. Improve soil health by adding compost, vermicompost, and appropriate NPK fertilizers. Consider crop rotation.';
    } else {
      solution = 'Poor soil quality detected. Immediate action required: Add organic matter, implement crop rotation, apply balanced fertilizers based on soil test results, and consider green manuring.';
    }

    // Save to database
    const soilHealthRecord = new SoilHealth({
      farmerId,
      Temperature: mlModelData.Temperature,
      Humidity: mlModelData.Humidity,
      Wind_Speed: mlModelData.Wind_Speed,
      Nitrogen: mlModelData.Nitrogen,
      Phosphorous: mlModelData.Phosphorous,
      Potassium: mlModelData.Potassium,
      Crop_Type: mlModelData.Crop_Type,
      soil_quality: soilQuality,
      solution
    });

    await soilHealthRecord.save();

     // Update farmer's prediction history
    if (!farmer.SoilHealthHistory) {
      farmer.SoilHealthHistory = [];
    }

    // Update farmer's soil health history
    farmer.SoilHealthHistory.push(soilHealthRecord._id);
    await farmer.save();

    return res.status(201).json({
      success: true,
      message: 'Soil quality test completed successfully',
      data: {
        soilHealthId: soilHealthRecord._id,
        soil_quality: soilQuality,
        solution,
        inputData: mlModelData
      }
    });
  } catch (error) {
    console.error('Error testing soil quality:', error);

    // Handle axios errors
    if (error.response) {
      return res.status(error.response.status || 500).json({
        success: false,
        message: 'ML model API error',
        error: error.response.data || error.message
      });
    } else if (error.request) {
      return res.status(503).json({
        success: false,
        message: 'ML model service unavailable. Please try again later.',
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to test soil quality',
      error: error.message
    });
  }
};

// DELETE - Delete a specific soil health record
exports.deleteSoilHealthRecord = async (req, res) => {
  try {
    const farmerId = req.farmer.id;
    const { soilHealthId } = req.body;

    // Validate soilHealthId
    if (!soilHealthId) {
      return res.status(400).json({
        success: false,
        message: 'Soil health ID is required'
      });
    }

    // Find the soil health record
    const soilHealthRecord = await SoilHealth.findById(soilHealthId);

    if (!soilHealthRecord) {
      return res.status(404).json({
        success: false,
        message: 'Soil health record not found'
      });
    }

    // Check if the record belongs to the authenticated farmer
    if (soilHealthRecord.farmerId.toString() !== farmerId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own soil health records'
      });
    }

    // Delete the record
    await SoilHealth.findByIdAndDelete(soilHealthId);

    // Remove from farmer's soil health history
    await Farmer.findByIdAndUpdate(
      farmerId,
      { $pull: { SoilHealthHistory: soilHealthId } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Soil health record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting soil health record:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete soil health record',
      error: error.message
    });
  }
};
