'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import StarRating from './StarRating';
import { useAuthStore } from '@/store/authStore';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface Review {
  id: number;
  product_id: number;
  user_id: number;
  user_name: string;
  rating: number;
  title?: string;
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
}

interface ProductRating {
  average_rating: number;
  total_reviews: number;
  rating_distribution: { [key: string]: number };
}

interface ReviewListProps {
  productId: number;
  refreshTrigger?: number;
}

export default function ReviewList({ productId, refreshTrigger = 0 }: ReviewListProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<ProductRating | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<number | null>(null);
  const [editData, setEditData] = useState({ rating: 5, title: '', comment: '' });

  useEffect(() => {
    fetchReviews();
    fetchRating();
  }, [productId, refreshTrigger]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/api/reviews/product/${productId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRating = async () => {
    try {
      const response = await api.get(`/api/reviews/product/${productId}/rating`);
      setRating(response.data);
    } catch (error) {
      console.error('Error fetching rating:', error);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await api.delete(`/api/reviews/${reviewId}`);
      toast.success('Review deleted successfully');
      fetchReviews();
      fetchRating();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const startEdit = (review: Review) => {
    setEditingReview(review.id);
    setEditData({
      rating: review.rating,
      title: review.title || '',
      comment: review.comment
    });
  };

  const handleUpdate = async (reviewId: number) => {
    try {
      await api.put(`/api/reviews/${reviewId}`, editData);
      toast.success('Review updated successfully! ✨');
      setEditingReview(null);
      fetchReviews();
      fetchRating();
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {rating && rating.total_reviews > 0 && (
        <div className="card">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center space-x-4 mb-2">
                <span className="text-5xl font-black gradient-text">
                  {rating.average_rating.toFixed(1)}
                </span>
                <div>
                  <StarRating rating={rating.average_rating} size="lg" />
                  <p className="text-sm text-gray-600 mt-1">
                    Based on {rating.total_reviews} {rating.total_reviews === 1 ? 'review' : 'reviews'}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 max-w-md space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = rating.rating_distribution[star.toString()] || 0;
                const percentage = rating.total_reviews > 0 
                  ? (count / rating.total_reviews) * 100 
                  : 0;

                return (
                  <div key={star} className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600 w-12">
                      {star} ⭐
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 w-12 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">
          Customer Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h3>

        {reviews.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">💭</div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">No reviews yet</h4>
            <p className="text-gray-600">Be the first to share your thoughts!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="card hover:shadow-glow transition-all duration-300">
              {editingReview === review.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                    <StarRating
                      rating={editData.rating}
                      interactive={true}
                      onChange={(r) => setEditData({ ...editData, rating: r })}
                      size="lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      className="input-field"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Review</label>
                    <textarea
                      className="input-field"
                      rows={4}
                      value={editData.comment}
                      onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleUpdate(review.id)}
                      className="btn-primary"
                    >
                      💾 Save Changes
                    </button>
                    <button
                      onClick={() => setEditingReview(null)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <StarRating rating={review.rating} size="md" />
                        {review.is_verified_purchase && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                            ✓ Verified Purchase
                          </span>
                        )}
                      </div>
                      {review.title && (
                        <h4 className="text-lg font-bold text-gray-900 mb-1">{review.title}</h4>
                      )}
                    </div>

                    {isAuthenticated && user?.id === review.user_id && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(review)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                          title="Edit review"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete review"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                    <span className="font-medium">{review.user_name}</span>
                    <span>{formatDate(review.created_at)}</span>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
