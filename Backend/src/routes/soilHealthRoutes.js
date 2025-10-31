const express = require('express');
const router = express.Router();

// Import soil health controller
const {
  getSoilHealthHistory,
  testSoilQuality,
  deleteSoilHealthRecord
} = require('../controllers/SoilHealthController');

// Import auth middleware
const { auth } = require('../middlewares/auth');

// Protected routes (authentication required - Farmer only)
// GET - Fetch all soil health history for the authenticated farmer
router.get('/history', auth, getSoilHealthHistory);

// POST - Test soil quality and call ML model
router.post('/test', auth, testSoilQuality);

// DELETE - Delete a specific soil health record
router.delete('/delete-soilHealthId', auth, deleteSoilHealthRecord);

module.exports = router;
