const Crop = require('../models/Crop.js');
const Dealer = require('../models/Dealer.js');

// Create a new crop and link it to dealer
exports.createCrop = async (req, res) => {
  try {
    // Get dealerId from authenticated user (assuming the dealer is creating their own crop)
    const dealerId = req.dealer.id;
    
    // Destructure fields from the request body
    const {
      category,
      name,
      minQuantity,
      maxQuantity,
      pricePerUnit,
      harvestDate
    } = req.body;

    // Validate required fields
    if (!category || !name || minQuantity === undefined || maxQuantity === undefined || !pricePerUnit) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided: category, name, minQuantity, maxQuantity, pricePerUnit"
      });
    }

    // Validate quantity logic
    if (minQuantity < 0 || maxQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantities cannot be negative"
      });
    }

    if (minQuantity > maxQuantity) {
      return res.status(400).json({
        success: false,
        message: "Minimum quantity cannot be greater than maximum quantity"
      });
    }

    // Validate price
    if (pricePerUnit < 0) {
      return res.status(400).json({
        success: false,
        message: "Price per unit cannot be negative"
      });
    }

    // Check if dealer exists
    const dealer = await Dealer.findById(dealerId);
    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found"
      });
    }

    // Create crop data object
    const cropData = {
      dealerId,
      category,
      name: name.trim(),
      minQuantity,
      maxQuantity,
      pricePerUnit
    };

    // Add harvest date if provided
    if (harvestDate) {
      cropData.harvestDate = new Date(harvestDate);
    }

    // Create the new crop
    const newCrop = new Crop(cropData);
    const savedCrop = await newCrop.save();

    // Add the crop's _id to the dealer's crops array
    dealer.crops.push(savedCrop._id);
    const updatedDealer = await dealer.save();

    res.status(201).json({
      success: true,
      message: "Crop created and linked to dealer successfully",
      data: {
        crop: savedCrop,
        totalCrops: updatedDealer.crops.length
      }
    });

  } catch (error) {
    console.error('Create crop error:', error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors
      });
    }

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate entry detected"
      });
    }

    // Handle invalid ObjectId errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid dealer ID format"
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all crops for a dealer
exports.getDealerCrops = async (req, res) => {
  try {
    const dealerId = req.dealer.id;

    // Get all crops for the dealer
    const crops = await Crop.find({ dealerId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Crops retrieved successfully",
      data: {
        crops,
        totalCrops: crops.length
      }
    });

  } catch (error) {
    console.error('Get dealer crops error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get a single crop by ID
exports.getCropById = async (req, res) => {
  try {
    const { cropId } = req.params;
    const dealerId = req.dealer.id;

    const crop = await Crop.findOne({ _id: cropId, dealerId }).populate('dealerId', 'FullName lastName businessAddress');

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found or you don't have permission to view it"
      });
    }

    res.status(200).json({
      success: true,
      message: "Crop retrieved successfully",
      data: { crop }
    });

  } catch (error) {
    console.error('Get crop by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid crop ID format"
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update a crop
exports.updateCrop = async (req, res) => {
  try {
    const { cropId } = req.params;
    const dealerId = req.dealer.id;
    
    // Fields that can be updated
    const allowedUpdates = [
      'category', 'name', 'minQuantity', 'maxQuantity', 
      'pricePerUnit', 'harvestDate'
    ];

    // Check if crop exists and belongs to the dealer
    const crop = await Crop.findOne({ _id: cropId, dealerId });
    
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found or you don't have permission to update it"
      });
    }

    // Validate updates
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Validate quantity logic if quantities are being updated
    const newMinQuantity = updates.minQuantity !== undefined ? updates.minQuantity : crop.minQuantity;
    const newMaxQuantity = updates.maxQuantity !== undefined ? updates.maxQuantity : crop.maxQuantity;
    
    if (newMinQuantity < 0 || newMaxQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantities cannot be negative"
      });
    }

    if (newMinQuantity > newMaxQuantity) {
      return res.status(400).json({
        success: false,
        message: "Minimum quantity cannot be greater than maximum quantity"
      });
    }

    // Validate price if being updated
    if (updates.pricePerUnit !== undefined && updates.pricePerUnit < 0) {
      return res.status(400).json({
        success: false,
        message: "Price per unit cannot be negative"
      });
    }

    // Trim name if provided
    if (updates.name) {
      updates.name = updates.name.trim();
    }

    // Convert harvestDate to Date object if provided
    if (updates.harvestDate) {
      updates.harvestDate = new Date(updates.harvestDate);
    }

    // Update the crop
    const updatedCrop = await Crop.findByIdAndUpdate(
      cropId,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Crop updated successfully",
      data: { crop: updatedCrop }
    });

  } catch (error) {
    console.error('Update crop error:', error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid crop ID format"
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete a crop
exports.deleteCrop = async (req, res) => {
  try {
    const { cropId } = req.params;
    const dealerId = req.dealer.id;

    // Check if crop exists and belongs to the dealer
    const crop = await Crop.findOne({ _id: cropId, dealerId });
    
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found or you don't have permission to delete it"
      });
    }

    // Remove crop from database
    await Crop.findByIdAndDelete(cropId);

    // Remove crop reference from dealer's crops array
    await Dealer.findByIdAndUpdate(
      dealerId,
      { $pull: { crops: cropId } }
    );

    res.status(200).json({
      success: true,
      message: "Crop deleted successfully",
      data: { deletedCropId: cropId }
    });

  } catch (error) {
    console.error('Delete crop error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid crop ID format"
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all crops (public endpoint for farmers to browse)
exports.getAllCrops = async (req, res) => {
  try {
    // Get all crops with dealer information
    const crops = await Crop.find({})
      .populate('dealerId', 'FullName lastName businessAddress averageRating isVerified contactNumber')
      .sort({ createdAt: -1 });

    // Group crops by dealer
    const dealersWithCrops = {};
    
    crops.forEach(crop => {
      const dealerId = crop.dealerId._id.toString();
      
      // If dealer doesn't exist in our object, create entry
      if (!dealersWithCrops[dealerId]) {
        dealersWithCrops[dealerId] = {
          dealerInfo: {
            _id: crop.dealerId._id,
            FullName: crop.dealerId.FullName,
            lastName: crop.dealerId.lastName,
            businessAddress: crop.dealerId.businessAddress,
            contactNumber: crop.dealerId.contactNumber,
            averageRating: crop.dealerId.averageRating,
            isVerified: crop.dealerId.isVerified
          },
          crops: [],
          totalCrops: 0
        };
      }
      
      // Add crop to dealer's crops array (without dealerId field)
      const cropData = {
        _id: crop._id,
        category: crop.category,
        name: crop.name,
        minQuantity: crop.minQuantity,
        maxQuantity: crop.maxQuantity,
        pricePerUnit: crop.pricePerUnit,
        unit: crop.unit,
        harvestDate: crop.harvestDate,
        createdAt: crop.createdAt,
        updatedAt: crop.updatedAt,
        __v: crop.__v
      };
      
      dealersWithCrops[dealerId].crops.push(cropData);
      dealersWithCrops[dealerId].totalCrops++;
    });

    // Convert object to array
    const dealersArray = Object.values(dealersWithCrops);

    res.status(200).json({
      success: true,
      message: "All crops retrieved successfully",
      data: dealersArray
    });

  } catch (error) {
    console.error('Get all crops error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get filtered crops (public endpoint for farmers to browse with filters)
exports.getFilterCrops = async (req, res) => {
  try {
    // Get filter parameters
    const { category, search, minPrice, maxPrice, location } = req.query;
    
    // Build query
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
      query.pricePerUnit = {};
      if (minPrice) query.pricePerUnit.$gte = parseFloat(minPrice);
      if (maxPrice) query.pricePerUnit.$lte = parseFloat(maxPrice);
    }

    // Get filtered crops with dealer information
    const crops = await Crop.find(query)
      .populate('dealerId', 'FullName lastName businessAddress averageRating isVerified contactNumber')
      .sort({ createdAt: -1 });

    // Filter by location if provided (dealer's city/district)
    let filteredCrops = crops;
    if (location) {
      filteredCrops = crops.filter(crop => 
        crop.dealerId.businessAddress.city.toLowerCase().includes(location.toLowerCase()) ||
        crop.dealerId.businessAddress.district.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Group crops by dealer
    const dealersWithCrops = {};
    
    filteredCrops.forEach(crop => {
      const dealerId = crop.dealerId._id.toString();
      
      // If dealer doesn't exist in our object, create entry
      if (!dealersWithCrops[dealerId]) {
        dealersWithCrops[dealerId] = {
          dealerInfo: {
            _id: crop.dealerId._id,
            FullName: crop.dealerId.FullName,
            lastName: crop.dealerId.lastName,
            businessAddress: crop.dealerId.businessAddress,
            contactNumber: crop.dealerId.contactNumber,
            averageRating: crop.dealerId.averageRating,
            isVerified: crop.dealerId.isVerified
          },
          crops: [],
          totalCrops: 0
        };
      }
      
      // Add crop to dealer's crops array (without dealerId field)
      const cropData = {
        _id: crop._id,
        category: crop.category,
        name: crop.name,
        minQuantity: crop.minQuantity,
        maxQuantity: crop.maxQuantity,
        pricePerUnit: crop.pricePerUnit,
        unit: crop.unit,
        harvestDate: crop.harvestDate,
        createdAt: crop.createdAt,
        updatedAt: crop.updatedAt,
        __v: crop.__v
      };
      
      dealersWithCrops[dealerId].crops.push(cropData);
      dealersWithCrops[dealerId].totalCrops++;
    });

    // Convert object to array
    const dealersArray = Object.values(dealersWithCrops);

    res.status(200).json({
      success: true,
      message: "Filtered crops retrieved successfully",
      data: dealersArray
    });

  } catch (error) {
    console.error('Get filtered crops error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get crop categories (for filter dropdowns)
exports.getCropCategories = async (req, res) => {
  try {
    const categories = await Crop.distinct('category');
    
    res.status(200).json({
      success: true,
      message: "Crop categories retrieved successfully",
      data: { categories }
    });

  } catch (error) {
    console.error('Get crop categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};