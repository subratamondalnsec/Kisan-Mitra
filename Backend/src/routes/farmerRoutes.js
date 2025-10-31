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
const { getAgmarknetData, getGeographies, getMarketPrices,getMarkets,getBestMarkets } = require('../controllers/emandiController');
const { getBestMarketsForFarmer } = require('../utils/emandi_fetch_data');

// Public routes (no authentication required)
router.post('/signup', signup);
router.post('/login', login);

// Protected routes (authentication required)
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/language', auth, getPreferredLanguage);
router.put('/language', auth, updatePreferredLanguage);


// emandi 
router.get('/get-emandi/',getAgmarknetData);
router.get('/get-emandi/geographies',getGeographies);
router.post('/get-emandi/market-prices',getMarketPrices);
router.post('/get-emandi/markets',getMarkets)
router.post('/get-emandi/best-markets',getBestMarkets)


module.exports = router;