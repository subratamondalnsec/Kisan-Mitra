import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Reviews for {currentDealerInfo.name}
              </h1>
              {currentDealerInfo.businessName && (
                <p className="text-gray-600 mb-4">{currentDealerInfo.businessName}</p>
              )}
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <StarRating rating={currentDealerInfo.averageRating} />
                  <span className="ml-2 text-lg font-semibold">
                    {currentDealerInfo.averageRating?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <span className="text-gray-600">
                  ({currentDealerInfo.ratingCount} {currentDealerInfo.ratingCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              {/* Rating Distribution */}
              <div className="grid grid-cols-5 gap-2 text-sm">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <span className="w-2">{rating}</span>
                    <span className="text-yellow-400 mx-1">★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ 
                          width: currentDealerInfo.ratingCount > 0 
                            ? `${(ratingDistribution[rating] / currentDealerInfo.ratingCount) * 100}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                    <span className="ml-2 text-gray-600">{ratingDistribution[rating] || 0}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="ml-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Back
            </button>
          </div>
        </div>

        {/* Tab Switcher - Only show if user is a farmer */}
        {user?.role === 'farmer' && (
          <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
            <div className="flex">
              <button
                onClick={() => setActiveTab('all-reviews')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 ${
                  activeTab === 'all-reviews'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Reviews
              </button>
              <button
                onClick={() => setActiveTab('my-review')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 ${
                  activeTab === 'my-review'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
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
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                {!showReviewForm ? (
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      {userReview ? 'Update Your Review' : 'Share Your Experience'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {userReview 
                        ? 'You have already reviewed this dealer. Click to update your review.' 
                        : 'Help other farmers by sharing your experience with this dealer.'
                      }
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setShowReviewForm(true)}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                      >
                        {userReview ? 'Update Review' : 'Write a Review'}
                      </button>
                      {userReview && (
                        <button
                          onClick={handleDeleteReview}
                          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                        >
                          Delete Review
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview}>
                    <h3 className="text-lg font-semibold mb-4">
                      {reviewMode === 'update' ? 'Update Your Review' : 'Write a Review'}
                    </h3>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating *
                      </label>
                      <StarRating rating={selectedRating} interactive={true} size="text-2xl" />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Review (Optional)
                      </label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Share your experience with this dealer..."
                        maxLength={500}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {reviewText.length}/500 characters
                      </p>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={isSubmitting || selectedRating === 0}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Submitting...' : (reviewMode === 'update' ? 'Update Review' : 'Submit Review')}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelReview}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Sort and Filter */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">All Reviews</h3>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {dealerReviews.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">No reviews yet. Be the first to review this dealer!</p>
                </div>
              ) : (
                dealerReviews.map((review, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start space-x-4">
                      {/* Farmer Avatar */}
                      <div className="flex-shrink-0">
                        <img
                          src={review.user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${review.user?.firstName} ${review.user?.lastName}`}
                          alt={`${review.user?.firstName} ${review.user?.lastName}`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>
                      
                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {review.user?.firstName} {review.user?.lastName}
                            </h4>
                            <div className="flex items-center mt-1">
                              <StarRating rating={review.rating} />
                              <span className="ml-2 text-sm text-gray-600">
                                {formatDate(review.createdAt)}
                              </span>
                              {review.updatedAt !== review.createdAt && (
                                <span className="ml-2 text-sm text-gray-500">(edited)</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {review.review && (
                          <p className="text-gray-700 mt-3">{review.review}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Load More Button */}
            {pagination.hasNextPage && (
              <div className="text-center mt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={reviewsLoading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {reviewsLoading ? 'Loading...' : 'Load More Reviews'}
                </button>
              </div>
            )}

            {/* Pagination Info */}
            {dealerReviews.length > 0 && (
              <div className="text-center mt-4 text-sm text-gray-600">
                Showing {dealerReviews.length} of {pagination.totalReviews} reviews
              </div>
            )}
          </>
        ) : (
          /* My Reviews Tab */
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-6">My Review for this Dealer</h3>
            
            {!editingReview ? (
              userReview ? (
                <div className="space-y-4">
                  {/* Display User's Review */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      {/* User Avatar */}
                      <div className="flex-shrink-0">
                        <img
                          src={user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${user?.firstName} ${user?.lastName}`}
                          alt={`${user?.firstName} ${user?.lastName}`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>
                      
                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {user?.firstName} {user?.lastName}
                            </h4>
                            <div className="flex items-center mt-1">
                              <StarRating rating={userReview.rating} />
                              <span className="ml-2 text-sm text-gray-600">
                                {formatDate(userReview.createdAt)}
                              </span>
                              {userReview.updatedAt !== userReview.createdAt && (
                                <span className="ml-2 text-sm text-gray-500">(edited)</span>
                              )}
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            <button
                              onClick={handleEditReview}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={handleDeleteReview}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        
                        {userReview.review && (
                          <p className="text-gray-700 mt-3">{userReview.review}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* No Review Yet */
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Review Yet</h3>
                  <p className="text-gray-600 mb-6">You haven't reviewed this dealer yet.</p>
                  <button
                    onClick={() => {
                      setActiveTab('all-reviews');
                      setShowReviewForm(true);
                    }}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                  >
                    Write Your First Review
                  </button>
                </div>
              )
            ) : (
              /* Edit Review Form */
              <form onSubmit={handleSubmitReview}>
                <h4 className="text-lg font-semibold mb-4">Edit Your Review</h4>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <StarRating rating={selectedRating} interactive={true} size="text-2xl" />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review (Optional)
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Share your experience with this dealer..."
                    maxLength={500}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {reviewText.length}/500 characters
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || selectedRating === 0}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Review'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelReview}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
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