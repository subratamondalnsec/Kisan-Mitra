import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { DealerReviewAPI } from "../apis";
import {
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
  resetDealerState
} from "../../slices/dealerSlice";

// Get all reviews for a specific dealer
export function getDealerReviews(dealerId, page = 1, limit = 10, sort = "newest") {
  return async (dispatch) => {
    const toastId = toast.loading("Loading reviews...");
    dispatch(setReviewsLoading(true));
    dispatch(clearError());
    
    try {
      const response = await apiConnector(
        "GET", 
        `${DealerReviewAPI.GET_DEALER_REVIEWS}${dealerId}/reviews`,
        null,
        null,
        { page, limit, sort }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const { dealer, reviews, pagination, ratingDistribution } = response.data.data;

      // Update dealer info
      dispatch(setCurrentDealerInfo(dealer));
      
      // Update reviews
      dispatch(setDealerReviews(reviews));
      
      // Update pagination
      dispatch(setPagination(pagination));
      
      // Update rating distribution
      dispatch(setRatingDistribution(ratingDistribution));
      
      // Update sort
      dispatch(setSortBy(sort));

      toast.success("Reviews loaded successfully");
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to load reviews";
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    }
    
    dispatch(setReviewsLoading(false));
    toast.dismiss(toastId);
  };
}

// Main function to add or update a dealer review (farmers only)
export function addOrUpdateDealerReview(dealerId, rating, review, token) {
  return async (dispatch, getState) => {
    const { auth } = getState();
    const toastId = toast.loading("Submitting review...");
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      if (!rating || rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }

      const response = await apiConnector(
        "POST",
        `${DealerReviewAPI.ADD_UPDATE_REVIEW}${dealerId}/review`,
        { rating, review },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const { dealer, averageRating, ratingCount, isUpdate } = response.data.data;

      // Update dealer's rating info
      dispatch(updateDealerRating({ averageRating, ratingCount }));

      // Find the user's review from the response using auth user ID
      const userReview = dealer.ratings.find(r => r.user._id === auth.user?.id);
      
      if (userReview) {
        // Update user's own review
        dispatch(setUserReview(userReview));
        
        // Update or add review in the reviews list
        if (isUpdate) {
          dispatch(updateReview(userReview));
        } else {
          dispatch(addReview(userReview));
        }
      }

      toast.success(response.data.message);
      
    } catch (error) {
      console.error("Review submission error:", error);
      
      let errorMessage = "Failed to submit review";
      
      if (error.response?.status === 400 && error.response?.data?.message?.includes("Duplicate key")) {
        errorMessage = "You may have already reviewed this dealer. Please refresh the page and try again.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch(setReviewError(errorMessage));
      toast.error(errorMessage);
    }
    
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// Delete a review for a dealer (farmers only)
export function deleteDealerReview(dealerId, token) {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting review...");
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const response = await apiConnector(
        "DELETE",
        `${DealerReviewAPI.DELETE_REVIEW}${dealerId}/review/delete`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const { averageRating, ratingCount } = response.data.data;

      // Update dealer's rating info
      dispatch(updateDealerRating({ averageRating, ratingCount }));

      // Clear user's review
      dispatch(clearUserReview());

      toast.success(response.data.message);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete review";
      dispatch(setReviewError(errorMessage));
      toast.error(errorMessage);
    }
    
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// Get farmer's own review for a dealer
export function getFarmerReview(dealerId, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const response = await apiConnector(
        "GET",
        `${DealerReviewAPI.GET_FARMER_REVIEW}${dealerId}/review/farmer`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success && response.data.data.hasReview) {
        dispatch(setUserReview(response.data.data.review));
      } else {
        dispatch(clearUserReview());
      }
      
    } catch (error) {
      dispatch(clearUserReview());
    }
    
    dispatch(setLoading(false));
  };
}

// Get dealer's own reviews (for dealer dashboard)
export function getDealerOwnReviews(token) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading your reviews...");
    dispatch(setReviewsLoading(true));
    dispatch(clearError());
    
    try {
      const response = await apiConnector(
        "GET",
        DealerReviewAPI.GET_OWN_REVIEWS,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const { averageRating, ratingCount, reviews } = response.data.data;

      // Update dealer's own rating info
      dispatch(updateDealerRating({ averageRating, ratingCount }));
      
      // Update reviews
      dispatch(setDealerReviews(reviews));

      toast.success("Reviews loaded successfully");
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to load reviews";
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    }
    
    dispatch(setReviewsLoading(false));
    toast.dismiss(toastId);
  };
}

// Reset dealer review state
export function resetDealerReviewState() {
  return async (dispatch) => {
    dispatch(resetDealerState());
  };
}

// Load more reviews (pagination)
export function loadMoreReviews(dealerId, page, limit = 10, sort = "newest") {
  return async (dispatch, getState) => {
    const { dealer } = getState();
    const currentReviews = dealer.dealerReviews;
    
    dispatch(setReviewsLoading(true));
    
    try {
      const response = await apiConnector(
        "GET",
        `${DealerReviewAPI.GET_DEALER_REVIEWS}${dealerId}/reviews`,
        null,
        null,
        { page, limit, sort }
      );

      if (response.data.success) {
        const { reviews, pagination } = response.data.data;
        
        // Append new reviews to existing ones
        dispatch(setDealerReviews([...currentReviews, ...reviews]));
        dispatch(setPagination(pagination));
      }
      
    } catch (error) {
      toast.error("Failed to load more reviews");
    }
    
    dispatch(setReviewsLoading(false));
  };
}
