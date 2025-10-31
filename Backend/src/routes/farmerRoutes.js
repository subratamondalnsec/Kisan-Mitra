const express = require('express');
const router = express.Router();

// Import farmer auth controller
const {
  signup,
  login,
  getProfile,
  updateProfile,
  updatePreferredLanguage,
  getPreferredLanguage
} = require('../controllers/FarmerAuth');

// Import auth middleware
const { auth } = require('../middlewares/auth');

// Public routes (no authentication required)
router.post('/signup', signup);
router.post('/login', login);

// Protected routes (authentication required)
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/language', auth, getPreferredLanguage);
router.put('/language', auth, updatePreferredLanguage);

module.exports = router;