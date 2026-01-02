'use client';

import { useState } from 'react';
import api from '@/lib/api';
import StarRating from './StarRating';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  productId: number;
  onSuccess: () => void;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/api/reviews', {
        product_id: productId,
        rating,
        title: title.trim() || null,
        comment: comment.trim()
      });
      
      toast.success('Review submitted successfully! ✨');
      setRating(5);
      setTitle('');
      setComment('');
      onSuccess();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.detail || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-2xl font-bold gradient-text mb-6">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Your Rating *
          </label>
          <StarRating
            rating={rating}
            interactive={true}
            onChange={setRating}
            size="lg"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Review Title <span className="text-gray-400 font-normal text-xs">(optional)</span>
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Sum up your experience..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            className="input-field"
            rows={5}
            placeholder="Share your thoughts about this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            maxLength={1000}
          />
          <p className="text-xs text-gray-500 mt-1">{comment.length}/1000 characters</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full"
        >
          {isSubmitting ? 'Submitting...' : '✨ Submit Review'}
        </button>
      </form>
    </div>
  );
}
