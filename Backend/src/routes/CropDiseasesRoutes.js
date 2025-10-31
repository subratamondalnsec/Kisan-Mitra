const express = require('express');
const router = express.Router();

// Import controllers
const {
  getCropDiseasePredictionHistory,
  getCropDiseasePredictionById,
  addAndCallMLModelCropDiseasePrediction,
  deleteCropDiseasePrediction
} = require('../controllers/CropDiseasesController');

// Import auth middleware (if needed)
const { auth } = require('../middlewares/auth');

// Routes

// GET /api/v1/crop-diseases/history - Get farmer's crop disease prediction history
router.get('/history', auth, getCropDiseasePredictionHistory);

// POST /api/v1/crop-diseases/prediction - Get specific prediction by ID
router.post('/prediction', auth, getCropDiseasePredictionById);

// POST /api/v1/crop-diseases/predict - Create new prediction with ML model
router.post('/predict', auth, addAndCallMLModelCropDiseasePrediction);

// DELETE /api/v1/crop-diseases/delete - Delete a prediction
router.delete('/delete', auth, deleteCropDiseasePrediction);

module.exports = router;
