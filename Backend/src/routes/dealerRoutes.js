const express = require('express');
const router = express.Router();
const { signup, login, getProfile, updateProfile } = require('../controllers/DellerAuth');
const { auth } = require('../middlewares/auth');

// Authentication routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router;