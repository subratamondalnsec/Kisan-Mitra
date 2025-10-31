const Dealer = require("../models/Dealer");
const Farmer = require("../models/Farmer");

// Helper function to validate review data
const validateReviewData = (rating, farmerId, dealerId) => {
  if (!rating || rating < 1 || rating > 5) {
    return { isValid: false, message: "Rating must be between 1 and 5" };
  }
  if (!farmerId) {
    return { isValid: false, message: "Farmer ID is required" };
  }
  if (!dealerId) {
    return { isValid: false, message: "Dealer ID is required" };
  }
  return { isValid: true };
};

// Helper function to calculate average rating
const calculateAverageRating = (currentAverage, currentCount, oldRating, newRating, isNewReview) => {
  let newAverage;
  
  if (isNewReview) {
    // Adding new review
    newAverage = ((currentAverage * currentCount) + newRating) / (currentCount + 1);
  } else {
    // Updating existing review
    if (currentCount > 0) {
      newAverage = ((currentAverage * currentCount) - oldRating + newRating) / currentCount;
    } else {
      newAverage = newRating;
    }
  }
  
  return Math.round(newAverage * 10) / 10; // Round to 1 decimal place
};

// Add or Update Review for a Dealer (Main function)
exports.addOrUpdateReview = async (req, res) => {
  try {
    const { dealerId } = req.params;
    const { rating, review } = req.body;
    const farmerId = req.farmer.id;

    // Validation
    const validation = validateReviewData(rating, farmerId, dealerId);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    // Check if user is a farmer
    if (req.farmer.role !== 'farmer') {
      return res.status(403).json({
        success: false,
        message: "Only farmers can review dealers"
      });
    }


    // Find the dealer
    const dealer = await Dealer.findById(dealerId);
    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found"
      });
    }

    // Check if farmer exists
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found"
      });
    }

    // Check if review already exists
    const existingReviewIndex = dealer.ratings.findIndex(
      r => r.user.toString() === farmerId
    );

    let isUpdate = false;
    let oldRating = 0;

    if (existingReviewIndex !== -1) {
      // Update existing review
      isUpdate = true;
      oldRating = dealer.ratings[existingReviewIndex].rating;
      const oldCreatedAt = dealer.ratings[existingReviewIndex].createdAt;
      
      dealer.ratings[existingReviewIndex] = {
        user: farmerId,
        rating: rating,
        review: review?.trim() || "",
        createdAt: oldCreatedAt,
        updatedAt: new Date()
      };

      // Recalculate average rating
      dealer.averageRating = calculateAverageRating(
        dealer.averageRating, 
        dealer.ratingCount, 
        oldRating, 
        rating, 
        false
      );
    } else {
      // Add new review
      const newReview = {
        user: farmerId,
        rating: rating,
        review: review?.trim() || "",
        createdAt: new Date(),
        updatedAt: new Date()
      };

      dealer.ratings.push(newReview);

      // Recalculate average rating and count
      dealer.ratingCount += 1;
      dealer.averageRating = calculateAverageRating(
        dealer.averageRating, 
        dealer.ratingCount - 1, 
        0, 
        rating, 
        true
      );
    }

    await dealer.save();

    // Return updated dealer info with populated reviews
    const updatedDealer = await Dealer.findById(dealerId)
      .populate('ratings.user', 'firstName lastName image')
      .select('averageRating ratingCount ratings');

    res.status(200).json({
      success: true,
      message: isUpdate ? "Review updated successfully" : "Review added successfully",
      data: {
        dealer: updatedDealer,
        averageRating: dealer.averageRating,
        ratingCount: dealer.ratingCount,
        isUpdate: isUpdate
      }
    });

  } catch (error) {
    console.error("Add/Update Review Error:", error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate key error - this might be due to a database index issue. Please contact support.",
        error: "Database constraint violation"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Delete a review for a dealer
exports.deleteReview = async (req, res) => {
  try {
    const { dealerId } = req.params;
    const farmerId = req.farmer.id;

    // Check if user is a farmer
    if (req.farmer.role !== 'farmer') {
      return res.status(403).json({
        success: false,
        message: "Only farmers can delete reviews"
      });
    }

    // Find the dealer
    const dealer = await Dealer.findById(dealerId);
    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found"
      });
    }

    // Find existing review
    const existingReviewIndex = dealer.ratings.findIndex(
      r => r.user.toString() === farmerId
    );

    if (existingReviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "No review found to delete"
      });
    }

    const deletedRating = dealer.ratings[existingReviewIndex].rating;

    // Remove the review
    dealer.ratings.splice(existingReviewIndex, 1);

    // Recalculate average rating and count
    if (dealer.ratingCount > 1) {
      dealer.averageRating = ((dealer.averageRating * dealer.ratingCount) - deletedRating) / (dealer.ratingCount - 1);
      dealer.averageRating = Math.round(dealer.averageRating * 10) / 10;
    } else {
      dealer.averageRating = 0;
    }
    dealer.ratingCount = Math.max(0, dealer.ratingCount - 1);

    await dealer.save();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: {
        averageRating: dealer.averageRating,
        ratingCount: dealer.ratingCount
      }
    });

  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get a specific farmer's review for a dealer
exports.getFarmerReview = async (req, res) => {
  try {
    const { dealerId } = req.params;
    const farmerId = req.farmer.id;

    // Check if user is a farmer
    if (req.farmer.role !== 'farmer') {
      return res.status(403).json({
        success: false,
        message: "Only farmers can access this endpoint"
      });
    }

    // Find the dealer
    const dealer = await Dealer.findById(dealerId)
      .populate({
        path: 'ratings.user',
        select: 'firstName lastName image',
        model: 'Farmer'
      })
      .select('ratings');

    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found"
      });
    }

    // Find farmer's review
    const farmerReview = dealer.ratings.find(
      r => r.user._id.toString() === farmerId
    );

    if (!farmerReview) {
      return res.status(404).json({
        success: false,
        message: "No review found for this farmer",
        data: { hasReview: false }
      });
    }

    res.status(200).json({
      success: true,
      message: "Farmer review fetched successfully",
      data: {
        hasReview: true,
        review: farmerReview
      }
    });

  } catch (error) {
    console.error("Get Farmer Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get All Reviews for a Dealer
exports.getAllReviews = async (req, res) => {
  try {
    const { dealerId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'newest'; // newest, oldest, highest, lowest

    // Find the dealer
    const dealer = await Dealer.findById(dealerId);
    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found"
      });
    }

    // Get dealer with populated reviews
    let sortCriteria = {};
    switch (sort) {
      case 'newest':
        sortCriteria = { 'ratings.createdAt': -1 };
        break;
      case 'oldest':
        sortCriteria = { 'ratings.createdAt': 1 };
        break;
      case 'highest':
        sortCriteria = { 'ratings.rating': -1 };
        break;
      case 'lowest':
        sortCriteria = { 'ratings.rating': 1 };
        break;
      default:
        sortCriteria = { 'ratings.createdAt': -1 };
    }

    const dealerWithReviews = await Dealer.findById(dealerId)
      .populate({
        path: 'ratings.user',
        select: 'firstName lastName image',
        model: 'Farmer'
      })
      .select('FullName lastName businessAddress.businessName averageRating ratingCount ratings');

    if (!dealerWithReviews) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found"
      });
    }

    // Sort reviews
    let sortedReviews = [...dealerWithReviews.ratings];
    switch (sort) {
      case 'newest':
        sortedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        sortedReviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'highest':
        sortedReviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        sortedReviews.sort((a, b) => a.rating - b.rating);
        break;
      default:
        sortedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = sortedReviews.slice(startIndex, endIndex);

    // Calculate rating distribution
    const ratingDistribution = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };
    
    dealerWithReviews.ratings.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: {
        dealer: {
          id: dealerWithReviews._id,
          name: `${dealerWithReviews.FullName} ${dealerWithReviews.lastName}`,
          businessName: dealerWithReviews.businessAddress?.businessName,
          averageRating: dealerWithReviews.averageRating,
          ratingCount: dealerWithReviews.ratingCount
        },
        reviews: paginatedReviews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(sortedReviews.length / limit),
          totalReviews: sortedReviews.length,
          hasNextPage: endIndex < sortedReviews.length,
          hasPrevPage: page > 1
        },
        ratingDistribution,
        sort
      }
    });

  } catch (error) {
    console.error("Get Reviews Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get Dealer's Own Reviews (for dealer dashboard)
exports.getDealerOwnReviews = async (req, res) => {
  try {
    const dealerId = req.dealer.id; // From JWT middleware

    // Check if user is a dealer
    if (req.dealer.role !== 'dealer') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only dealers can access this route."
      });
    }

    const dealer = await Dealer.findById(dealerId)
      .populate({
        path: 'ratings.user',
        select: 'firstName lastName image',
        model: 'Farmer'
      })
      .select('averageRating ratingCount ratings');

    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found"
      });
    }

    // Sort reviews by newest first
    const sortedReviews = dealer.ratings.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: {
        averageRating: dealer.averageRating,
        ratingCount: dealer.ratingCount,
        reviews: sortedReviews
      }
    });

  } catch (error) {
    console.error("Get Dealer Own Reviews Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
