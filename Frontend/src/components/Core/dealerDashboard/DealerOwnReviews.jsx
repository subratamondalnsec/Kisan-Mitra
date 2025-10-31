import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { getDealerOwnReviews } from '../../../services/operations/DealerReviewOperations';

const DealerOwnReviews = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector(state => state.auth);
  const {
    dealerReviews,
    currentDealerInfo,
    reviewsLoading,
    error
  } = useSelector(state => state.dealer);

  const [sortBy, setSortBy] = useState('newest');

  // Load dealer's own reviews on component mount
  useEffect(() => {
    if (token && user?.role === 'dealer') {
      dispatch(getDealerOwnReviews(token));
    }
  }, [dispatch, token, user?.role]);

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    // Sort existing reviews instead of making new API call
    // Backend already returns sorted by newest first
  };

  // Sort reviews based on selected option
  const getSortedReviews = () => {
    if (!dealerReviews || dealerReviews.length === 0) return [];
    
    const reviews = [...dealerReviews];
    
    switch (sortBy) {
      case 'oldest':
        return reviews.reverse();
      case 'highest':
        return reviews.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return reviews.sort((a, b) => a.rating - b.rating);
      case 'newest':
      default:
        return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Render star rating
  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
      </div>
    );
  };

  // Render rating distribution
  const renderRatingDistribution = () => {
    if (!dealerReviews || dealerReviews.length === 0) return null;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    dealerReviews.forEach(review => {
      distribution[review.rating]++;
    });

    const total = dealerReviews.length;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = distribution[rating];
            const percentage = total > 0 ? (count / total) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-sm w-6">{rating}</span>
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12">({count})</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (reviewsLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => dispatch(getDealerOwnReviews(token))}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const sortedReviews = getSortedReviews();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Reviews</h1>
        <p className="text-gray-600">Manage and view all reviews received from farmers</p>
      </div>

      {/* Rating Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {currentDealerInfo.averageRating?.toFixed(1) || '0.0'}
            </div>
            <div className="text-gray-600 mb-2">Average Rating</div>
            {renderStarRating(currentDealerInfo.averageRating || 0)}
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {currentDealerInfo.ratingCount || 0}
            </div>
            <div className="text-gray-600">Total Reviews</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {sortedReviews.filter(review => review.rating >= 4).length}
            </div>
            <div className="text-gray-600">Positive Reviews</div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      {renderRatingDistribution()}

      {/* Sort Controls */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">All Reviews ({sortedReviews.length})</h2>
        
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      {sortedReviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reviews Yet</h3>
          <p className="text-gray-500">
            You haven't received any reviews from farmers yet. Keep providing excellent service to get your first review!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <div key={review._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    {review.user?.image ? (
                      <img
                        src={review.user.image}
                        alt={`${review.user.firstName} ${review.user.lastName}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-green-600 font-semibold text-lg">
                        {review.user?.firstName?.charAt(0) || 'F'}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {review.user?.firstName} {review.user?.lastName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                
                {renderStarRating(review.rating)}
              </div>
              
              {review.review && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{review.review}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DealerOwnReviews;