'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import toast from 'react-hot-toast';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import StarRating from '@/components/StarRating';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewRefresh, setReviewRefresh] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchProduct();
  }, [params.slug]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/api/products/slug/${params.slug}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Product not found');
      router.push('/products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }

    if (!product) return;

    try {
      await addToCart(product.id, quantity);
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to add to cart');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-300 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="bg-gray-300 h-8 rounded w-3/4"></div>
                <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                <div className="bg-gray-300 h-24 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              {product.category && (
                <p className="text-primary-600">{product.category.name}</p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary-600">
                ${product.price.toFixed(2)}
              </span>
              {product.compare_at_price && (
                <span className="text-xl text-gray-400 line-through">
                  ${product.compare_at_price.toFixed(2)}
                </span>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Stock: {product.stock_quantity > 0 ? (
                  <span className="text-green-600 font-semibold">
                    {product.stock_quantity} available
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">Out of stock</span>
                )}
              </p>
              {product.sku && (
                <p className="text-sm text-gray-600">SKU: {product.sku}</p>
              )}
            </div>

            {product.stock_quantity > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={product.stock_quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="input-field w-24"
                  />
                </div>

                <button
                  onClick={handleAddToCart}
                  className="btn-primary w-full text-lg py-3"
                >
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Review Form */}
            <div className="lg:col-span-1">
              {isAuthenticated ? (
                showReviewForm ? (
                  <ReviewForm
                    productId={product.id}
                    onSuccess={() => {
                      setReviewRefresh(prev => prev + 1);
                      setShowReviewForm(false);
                    }}
                  />
                ) : (
                  <div className="card text-center">
                    <div className="text-5xl mb-4">✍️</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Share Your Experience</h3>
                    <p className="text-gray-600 mb-6">Have you used this product? Let others know what you think!</p>
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="btn-primary w-full"
                    >
                      ✨ Write a Review
                    </button>
                  </div>
                )
              ) : (
                <div className="card text-center">
                  <div className="text-5xl mb-4">🔐</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Sign in to Review</h3>
                  <p className="text-gray-600 mb-6">Please log in to share your thoughts about this product</p>
                  <button
                    onClick={() => router.push('/login')}
                    className="btn-primary w-full"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2">
              <ReviewList 
                productId={product.id} 
                refreshTrigger={reviewRefresh}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
