const express = require('express');
const router = express.Router();
const { signup, login, getProfile, updateProfile, updatePreferredLanguage, getPreferredLanguage } = require('../controllers/DellerAuth');
const { 
  deleteReview, 
  getFarmerReview,
  addOrUpdateReview, 
  getAllReviews, 
  getDealerOwnReviews 
} = require('../controllers/dealerReviewController');
const { auth } = require('../middlewares/auth');

// Authentication routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/language', auth, getPreferredLanguage);
router.put('/language', auth, updatePreferredLanguage);

// Review routes
router.post('/:dealerId/review', auth, addOrUpdateReview); // Add or update review (farmers only) - Main endpoint
router.delete('/:dealerId/review/delete', auth, deleteReview); // Delete review (farmers only)
router.get('/:dealerId/review/farmer', auth, getFarmerReview); // Get farmer's own review for a dealer
router.get('/:dealerId/reviews', getAllReviews); // Get all reviews for a dealer (public)
router.get('/reviews/own', auth, getDealerOwnReviews); // Get dealer's own reviews (dealer only)

module.exports = router;