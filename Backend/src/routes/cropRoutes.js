const express = require('express');
const router = express.Router();
const { 
  createCrop, 
  getDealerCrops, 
  getCropById, 
  updateCrop, 
  deleteCrop, 
  getAllCrops, 
  getFilterCrops,
  getCropCategories 
} = require('../controllers/CropController');
const { auth } = require('../middlewares/auth');

// Public routes (for farmers to browse crops)
router.get('/public', getAllCrops);
router.get('/filter', getFilterCrops);
router.get('/categories', getCropCategories);

// Protected routes (for dealers to manage their crops)
router.post('/', auth, createCrop);
router.get('/', auth, getDealerCrops);
router.get('/:cropId', auth, getCropById);
router.put('/:cropId', auth, updateCrop);
router.delete('/:cropId', auth, deleteCrop);

module.exports = router;