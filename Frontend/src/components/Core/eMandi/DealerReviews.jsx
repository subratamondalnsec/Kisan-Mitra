import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useDarkMode } from '../../../contexts/DarkModeContext';
import {
  getDealerReviews,
  deleteDealerReview,
  getFarmerReview,
  addOrUpdateDealerReview,
  loadMoreReviews,
  resetDealerReviewState
} from '../../../services/operations/DealerReviewOperations';

const DealerReviews = () => {
  const { dealerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDarkMode } = useDarkMode();
  
  // Redux state
  const { token, user } = useSelector(state => state.auth);
  const {
    dealerReviews,
    currentDealerInfo,
    pagination,
    ratingDistribution,
    sortBy,
    userReview,
    loading,
    reviewsLoading,
    error
  } = useSelector(state => state.dealer);

  // Tab state
  const [activeTab, setActiveTab] = useState('all-reviews'); // 'all-reviews', 'my-review'

  // Local state for review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewMode, setReviewMode] = useState('add'); // 'add', 'update'
  const [editingReview, setEditingReview] = useState(false);

  // Load reviews and farmer's own review on component mount
  useEffect(() => {
    if (dealerId) {
      dispatch(getDealerReviews(dealerId, 1, 10, sortBy));
      
      // Load farmer's own review if user is a farmer
      if (token && user?.role === 'farmer') {
        dispatch(getFarmerReview(dealerId, token));
      }
    }

    // Cleanup on unmount
    return () => {
      dispatch(resetDealerReviewState());
    };
  }, [dispatch, dealerId, sortBy, token, user?.role]);

  // Set existing review if user has already reviewed
  useEffect(() => {
    if (userReview) {
      setSelectedRating(userReview.rating);
      setReviewText(userReview.review || '');
      setReviewMode('update');
    } else {
      setSelectedRating(0);
      setReviewText('');
      setReviewMode('add');
    }
  }, [userReview]);

  // Handle sort change
  const handleSortChange = (newSort) => {
    if (newSort !== sortBy) {
      dispatch(getDealerReviews(dealerId, 1, 10, newSort));
    }
  };

  // Handle load more reviews
  const handleLoadMore = () => {
    if (pagination.hasNextPage) {
      dispatch(loadMoreReviews(dealerId, pagination.currentPage + 1, 10, sortBy));
    }
  };

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Please login to submit a review');
      navigate('/auth');
      return;
    }

    if (user?.role !== 'farmer') {
      toast.error('Only farmers can review dealers');
      return;
    }

    if (selectedRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Use the combined function that handles both add and update
      await dispatch(addOrUpdateDealerReview(dealerId, selectedRating, reviewText.trim(), token));
      
      setShowReviewForm(false);
      // Refresh reviews to show the new/updated review
      dispatch(getDealerReviews(dealerId, 1, 10, sortBy));
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete review
  const handleDeleteReview = async () => {
    if (!window.confirm('Are you sure you want to delete your review?')) {
      return;
    }

    try {
      await dispatch(deleteDealerReview(dealerId, token));
      setShowReviewForm(false);
      // Refresh reviews
      dispatch(getDealerReviews(dealerId, 1, 10, sortBy));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  // Handle cancel review
  const handleCancelReview = () => {
    setShowReviewForm(false);
    setEditingReview(false);
    if (userReview) {
      setSelectedRating(userReview.rating);
      setReviewText(userReview.review || '');
      setReviewMode('update');
    } else {
      setSelectedRating(0);
      setReviewText('');
      setReviewMode('add');
    }
  };

  // Handle edit review (for My Review tab)
  const handleEditReview = () => {
    if (userReview) {
      setSelectedRating(userReview.rating);
      setReviewText(userReview.review || '');
      setReviewMode('update');
      setEditingReview(true);
    }
  };

  // Star rating component
  const StarRating = ({ rating, interactive = false, size = 'text-xl' }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            className={`${size} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} ${
              star <= (interactive ? (hoverRating || selectedRating) : rating)
                ? 'text-yellow-400' 
                : 'text-gray-300'
            }`}
            onClick={interactive ? () => setSelectedRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
            disabled={!interactive}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (reviewsLoading && dealerReviews.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading reviews...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
      }`}>
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-6 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`backdrop-blur-lg rounded-xl shadow-lg border p-5 mb-5 ${
          isDarkMode 
            ? 'bg-gray-800/70 border-gray-700' 
            : 'bg-white/70 border-gray-200'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className={`text-xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Reviews for {currentDealerInfo.name}
              </h1>
              {currentDealerInfo.businessName && (
                <p className={`text-sm mb-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {currentDealerInfo.businessName}
                </p>
              )}
              
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex items-center">
                  <StarRating rating={currentDealerInfo.averageRating} />
                  <span className={`ml-2 font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {currentDealerInfo.averageRating?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  ({currentDealerInfo.ratingCount} {currentDealerInfo.ratingCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              {/* Rating Distribution */}
              <div className="grid grid-cols-5 gap-2 text-xs">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-1">
                    <span className={`w-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {rating}
                    </span>
                    <span className="text-yellow-400">★</span>
                    <div className={`flex-1 rounded-full h-1.5 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div 
                        className="bg-yellow-400 h-1.5 rounded-full transition-all duration-300"
                        style={{ 
                          width: currentDealerInfo.ratingCount > 0 
                            ? `${(ratingDistribution[rating] / currentDealerInfo.ratingCount) * 100}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {ratingDistribution[rating] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate(-1)}
              className={`ml-4 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Tab Switcher - Only show if user is a farmer */}
        {user?.role === 'farmer' && (
          <div className={`backdrop-blur-lg rounded-xl shadow-lg border mb-5 overflow-hidden ${
            isDarkMode 
              ? 'bg-gray-800/70 border-gray-700' 
              : 'bg-white/70 border-gray-200'
          }`}>
            <div className="flex">
              <button
                onClick={() => setActiveTab('all-reviews')}
                className={`flex-1 px-4 py-3 text-center font-medium transition-all duration-300 text-sm ${
                  activeTab === 'all-reviews'
                    ? 'bg-green-600 text-white'
                    : isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-700/50' 
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Reviews
              </button>
              <button
                onClick={() => setActiveTab('my-review')}
                className={`flex-1 px-4 py-3 text-center font-medium transition-all duration-300 text-sm ${
                  activeTab === 'my-review'
                    ? 'bg-green-600 text-white'
                    : isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-700/50' 
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                My Review
              </button>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'all-reviews' ? (
          <>
            {/* Add Review Section - Only for Farmers */}
            {user?.role === 'farmer' && (
              <div className={`backdrop-blur-lg rounded-xl shadow-lg border p-5 mb-5 ${
                isDarkMode 
                  ? 'bg-gray-800/70 border-gray-700' 
                  : 'bg-white/70 border-gray-200'
              }`}>
                {!showReviewForm ? (
                  <div className="text-center">
                    <h3 className={`text-lg font-semibold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {userReview ? 'Update Your Review' : 'Share Your Experience'}
                    </h3>
                    <p className={`text-sm mb-4 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {userReview 
                        ? 'You have already reviewed this dealer. Click to update your review.' 
                        : 'Help other farmers by sharing your experience with this dealer.'
                      }
                    </p>
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => setShowReviewForm(true)}
                        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 text-sm font-medium"
                      >
                        {userReview ? 'Update Review' : 'Write a Review'}
                      </button>
                      {userReview && (
                        <button
                          onClick={handleDeleteReview}
                          className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm font-medium"
                        >
                          Delete Review
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview}>
                    <h3 className={`text-lg font-semibold mb-4 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {reviewMode === 'update' ? 'Update Your Review' : 'Write a Review'}
                    </h3>
                    
                    <div className="mb-4">
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        Rating *
                      </label>
                      <StarRating rating={selectedRating} interactive={true} size="text-2xl" />
                    </div>

                    <div className="mb-4">
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        Review (Optional)
                      </label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={3}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="Share your experience with this dealer..."
                        maxLength={500}
                      />
                      <p className={`text-xs mt-1 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {reviewText.length}/500 characters
                      </p>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isSubmitting || selectedRating === 0}
                        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 text-sm font-medium"
                      >
                        {isSubmitting ? 'Submitting...' : (reviewMode === 'update' ? 'Update Review' : 'Submit Review')}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelReview}
                        className={`px-5 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                          isDarkMode 
                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Sort and Filter */}
            <div className={`backdrop-blur-lg rounded-xl shadow-lg border p-4 mb-5 ${
              isDarkMode 
                ? 'bg-gray-800/70 border-gray-700' 
                : 'bg-white/70 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-base font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  All Reviews
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className={`border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {dealerReviews.length === 0 ? (
                <div className={`backdrop-blur-lg rounded-xl shadow-lg border p-6 text-center ${
                  isDarkMode 
                    ? 'bg-gray-800/70 border-gray-700' 
                    : 'bg-white/70 border-gray-200'
                }`}>
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    No reviews yet. Be the first to review this dealer!
                  </p>
                </div>
              ) : (
                dealerReviews.map((review, index) => (
                  <div key={index} className={`backdrop-blur-lg rounded-xl shadow-lg border p-4 ${
                    isDarkMode 
                      ? 'bg-gray-800/70 border-gray-700' 
                      : 'bg-white/70 border-gray-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      {/* Farmer Avatar */}
                      <div className="flex-shrink-0">
                        <img
                          src={review.user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${review.user?.firstName} ${review.user?.lastName}`}
                          alt={`${review.user?.firstName} ${review.user?.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                      
                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className={`font-semibold text-sm ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {review.user?.firstName} {review.user?.lastName}
                            </h4>
                            <div className="flex items-center mt-1">
                              <StarRating rating={review.rating} />
                              <span className={`ml-2 text-xs ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {formatDate(review.createdAt)}
                              </span>
                              {review.updatedAt !== review.createdAt && (
                                <span className={`ml-2 text-xs ${
                                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                                }`}>
                                  (edited)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {review.review && (
                          <p className={`mt-2 text-sm leading-relaxed ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {review.review}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Load More Button */}
            {pagination.hasNextPage && (
              <div className="text-center mt-5">
                <button
                  onClick={handleLoadMore}
                  disabled={reviewsLoading}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 text-sm font-medium"
                >
                  {reviewsLoading ? 'Loading...' : 'Load More Reviews'}
                </button>
              </div>
            )}

            {/* Pagination Info */}
            {dealerReviews.length > 0 && (
              <div className={`text-center mt-4 text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Showing {dealerReviews.length} of {pagination.totalReviews} reviews
              </div>
            )}
          </>
        ) : (
          /* My Reviews Tab */
          <div className={`backdrop-blur-lg rounded-xl shadow-lg border p-5 ${
            isDarkMode 
              ? 'bg-gray-800/70 border-gray-700' 
              : 'bg-white/70 border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-5 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              My Review for this Dealer
            </h3>
            
            {!editingReview ? (
              userReview ? (
                <div className="space-y-4">
                  {/* Display User's Review */}
                  <div className={`border rounded-lg p-4 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700/30' 
                      : 'border-gray-200 bg-gray-50/30'
                  }`}>
                    <div className="flex items-start space-x-3">
                      {/* User Avatar */}
                      <div className="flex-shrink-0">
                        <img
                          src={user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${user?.firstName} ${user?.lastName}`}
                          alt={`${user?.firstName} ${user?.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                      
                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className={`font-semibold text-sm ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {user?.firstName} {user?.lastName}
                            </h4>
                            <div className="flex items-center mt-1">
                              <StarRating rating={userReview.rating} />
                              <span className={`ml-2 text-xs ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {formatDate(userReview.createdAt)}
                              </span>
                              {userReview.updatedAt !== userReview.createdAt && (
                                <span className={`ml-2 text-xs ${
                                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                                }`}>
                                  (edited)
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            <button
                              onClick={handleEditReview}
                              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 text-xs font-medium transition-all duration-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={handleDeleteReview}
                              className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 text-xs font-medium transition-all duration-300"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        
                        {userReview.review && (
                          <p className={`mt-2 text-sm leading-relaxed ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {userReview.review}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* No Review Yet */
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📝</div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    No Review Yet
                  </h3>
                  <p className={`text-sm mb-5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    You haven't reviewed this dealer yet.
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('all-reviews');
                      setShowReviewForm(true);
                    }}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 text-sm font-medium"
                  >
                    Write Your First Review
                  </button>
                </div>
              )
            ) : (
              /* Edit Review Form */
              <form onSubmit={handleSubmitReview}>
                <h4 className={`text-lg font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Edit Your Review
                </h4>
                
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Rating *
                  </label>
                  <StarRating rating={selectedRating} interactive={true} size="text-2xl" />
                </div>

                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Review (Optional)
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={3}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Share your experience with this dealer..."
                    maxLength={500}
                  />
                  <p className={`text-xs mt-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {reviewText.length}/500 characters
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || selectedRating === 0}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 text-sm font-medium"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Review'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelReview}
                    className={`px-5 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DealerReviews;