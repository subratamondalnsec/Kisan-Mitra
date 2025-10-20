import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Loading states
  loading: false,
  reviewsLoading: false,
  
  // Dealer reviews data
  dealerReviews: [],
  selectedDealer: null,
  
  // Current dealer being viewed
  currentDealerInfo: {
    id: null,
    name: "",
    businessName: "",
    averageRating: 0,
    ratingCount: 0
  },
  
  // Pagination for reviews
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  
  // Rating distribution
  ratingDistribution: {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  },
  
  // Sort and filter options
  sortBy: "newest", // newest, oldest, highest, lowest
  
  // User's own review for current dealer
  userReview: null,
  
  // Error handling
  error: null,
  reviewError: null
};

const dealerSlice = createSlice({
  name: "dealer",
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setReviewsLoading: (state, action) => {
      state.reviewsLoading = action.payload;
    },
    
    // Error handling
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    setReviewError: (state, action) => {
      state.reviewError = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
      state.reviewError = null;
    },
    
    // Dealer reviews operations
    setDealerReviews: (state, action) => {
      state.dealerReviews = action.payload;
    },
    
    setCurrentDealerInfo: (state, action) => {
      state.currentDealerInfo = action.payload;
    },
    
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    
    setRatingDistribution: (state, action) => {
      state.ratingDistribution = action.payload;
    },
    
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    
    // Add or update review
    addReview: (state, action) => {
      const newReview = action.payload;
      const existingIndex = state.dealerReviews.findIndex(
        review => review.user._id === newReview.user._id
      );
      
      if (existingIndex !== -1) {
        // Update existing review
        state.dealerReviews[existingIndex] = newReview;
      } else {
        // Add new review at the beginning
        state.dealerReviews.unshift(newReview);
        state.pagination.totalReviews += 1;
      }
    },
    
    updateReview: (state, action) => {
      const updatedReview = action.payload;
      const index = state.dealerReviews.findIndex(
        review => review.user._id === updatedReview.user._id
      );
      
      if (index !== -1) {
        state.dealerReviews[index] = updatedReview;
      }
    },
    
    // Update dealer rating info
    updateDealerRating: (state, action) => {
      const { averageRating, ratingCount } = action.payload;
      state.currentDealerInfo.averageRating = averageRating;
      state.currentDealerInfo.ratingCount = ratingCount;
    },
    
    // User's own review
    setUserReview: (state, action) => {
      state.userReview = action.payload;
    },
    
    clearUserReview: (state) => {
      state.userReview = null;
    },
    
    // Selected dealer
    setSelectedDealer: (state, action) => {
      state.selectedDealer = action.payload;
    },
    
    clearSelectedDealer: (state) => {
      state.selectedDealer = null;
    },
    
    // Reset dealer state
    resetDealerState: (state) => {
      state.dealerReviews = [];
      state.selectedDealer = null;
      state.currentDealerInfo = initialState.currentDealerInfo;
      state.pagination = initialState.pagination;
      state.ratingDistribution = initialState.ratingDistribution;
      state.userReview = null;
      state.error = null;
      state.reviewError = null;
    },
    
    // Clear reviews
    clearReviews: (state) => {
      state.dealerReviews = [];
      state.pagination = initialState.pagination;
      state.ratingDistribution = initialState.ratingDistribution;
      state.userReview = null;
    }
  }
});

export const {
  setLoading,
  setReviewsLoading,
  setError,
  setReviewError,
  clearError,
  setDealerReviews,
  setCurrentDealerInfo,
  setPagination,
  setRatingDistribution,
  setSortBy,
  addReview,
  updateReview,
  updateDealerRating,
  setUserReview,
  clearUserReview,
  setSelectedDealer,
  clearSelectedDealer,
  resetDealerState,
  clearReviews
} = dealerSlice.actions;

export default dealerSlice.reducer;
