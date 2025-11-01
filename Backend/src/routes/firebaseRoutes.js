const express = require('express');
const router = express.Router();
const {
    uploadCropImage,
    bulkUploadCropImages,
    getFarmerImages,
    getTestImages,
    updateAnalysisResult,
    deleteCropImage,
    getImageStats
} = require('../controllers/FirebaseCropImageController');

// Upload routes
router.post('/upload', uploadCropImage);
router.post('/upload/bulk', bulkUploadCropImages);

// Retrieval routes
router.get('/farmer/:farmerId', getFarmerImages);
router.get('/farmer/:farmerId/test/:testName', getTestImages);
router.get('/farmer/:farmerId/stats', getImageStats);

// Update routes
router.put('/image/:imageId/analysis', updateAnalysisResult);

// Delete routes
router.delete('/image/:imageId', deleteCropImage);

module.exports = router;
