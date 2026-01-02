'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { Product } from '@/types';
import Image from 'next/image';
import { SparklesIcon, TruckIcon, ShieldCheckIcon, CreditCardIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get('/api/products?is_featured=true&limit=6');
        setFeaturedProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 min-h-[90vh] flex items-center">
        {/* Dreamy Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/60 via-secondary-50/40 to-pearl-100/60">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-primary-300 to-secondary-300 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
            <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-br from-secondary-300 to-accent-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-br from-accent-200 to-primary-200 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          </div>
          {/* Sparkle overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-secondary-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-accent-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-primary-300 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 w-full">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full mb-8 shadow-dreamy border border-primary-100">
              <HeartIcon className="h-5 w-5 text-primary-500 animate-pulse" />
              <span className="text-sm font-bold text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text">Curated with Love, Just for You</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8 animate-slide-up leading-tight">
              <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent drop-shadow-sm">
                Your Dream
              </span>
              <br />
              <span className="text-gray-800">Collection ✨</span>
            </h1>
            
            <p className="text-xl md:text-3xl text-gray-600 mb-12 max-w-3xl mx-auto animate-slide-up font-light leading-relaxed" style={{animationDelay: '0.1s'}}>
              Discover handpicked treasures that make you sparkle
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center animate-slide-up" style={{animationDelay: '0.2s'}}>
              <Link href="/products" className="btn-primary text-lg group relative overflow-hidden">
                <span className="relative z-10 flex items-center justify-center">
                  Shop Now
                  <ArrowRightIcon className="inline-block h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Floating Elements */}
            <div className="mt-16 flex justify-center space-x-8 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💖</span>
                </div>
                <span className="text-sm font-medium">Handpicked</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary-100 to-accent-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <span className="text-sm font-medium">Premium Quality</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-100 to-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎀</span>
                </div>
                <span className="text-sm font-medium">Fast Shipping</span>
              </div>
            </div>
          </div>
        </div>

        {/* Elegant Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="white" opacity="0.9"/>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-white/50 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-glass text-center group hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-all duration-300 shadow-glow">
                <TruckIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 gradient-text">Free Shipping</h3>
              <p className="text-gray-600 leading-relaxed">Complimentary delivery on all orders over $50 💝</p>
            </div>

            <div className="card-glass text-center group hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary-400 via-accent-400 to-primary-400 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-all duration-300 shadow-glow">
                <ShieldCheckIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 gradient-text">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed">Handpicked items with guaranteed excellence ✨</p>
            </div>

            <div className="card-glass text-center group hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-400 via-primary-400 to-secondary-400 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-all duration-300 shadow-glow">
                <CreditCardIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 gradient-text">Secure Checkout</h3>
              <p className="text-gray-600 leading-relaxed">Safe and easy payment processing 🎀</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-6xl">✨</span>
          </div>
          <h2 className="section-title">Trending Now</h2>
          <p className="section-subtitle">Our most loved pieces, curated just for you</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-64 rounded-xl mb-4"></div>
                <div className="bg-gray-300 h-6 rounded-lg w-3/4 mb-3"></div>
                <div className="bg-gray-200 h-4 rounded-lg w-full mb-2"></div>
                <div className="bg-gray-200 h-4 rounded-lg w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <Link 
                key={product.id} 
                href={`/products/${product.slug}`}
                className="group"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="card hover:shadow-glow cursor-pointer overflow-hidden group-hover:border-primary-200">
                  <div className="relative h-72 mb-5 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl overflow-hidden">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-primary-300">
                        <HeartIcon className="h-20 w-20" />
                      </div>
                    )}
                    {product.compare_at_price && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-accent-400 to-accent-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-glow animate-pulse">
                        💝 Sale
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent h-24"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary-500 group-hover:to-secondary-500 group-hover:bg-clip-text transition-all leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-5 line-clamp-2 leading-relaxed">
                    {product.description || 'Discover this amazing product ✨'}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-3xl font-black bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.compare_at_price && (
                        <span className="text-gray-400 line-through text-sm font-medium">
                          ${product.compare_at_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all shadow-lg">
                      <ArrowRightIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && featuredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-100 via-secondary-100 to-accent-100 rounded-full mb-6 shadow-dreamy">
              <span className="text-5xl">💝</span>
            </div>
            <p className="text-2xl text-gray-600 mb-8 font-medium">No featured products yet</p>
            <Link href="/products" className="btn-primary">
              Browse All Products
            </Link>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 py-28 mt-20">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float" style={{animationDelay: '0.7s'}}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <span className="text-7xl">💖</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            Join Our Community
          </h2>
          <p className="text-2xl md:text-3xl text-white/95 mb-12 font-light leading-relaxed">
            Be part of something special. Discover curated treasures daily ✨
          </p>
          <Link href="/products" className="inline-flex items-center bg-white text-primary-600 px-10 py-5 rounded-full font-black text-xl hover:bg-pearl-50 transition-all duration-300 shadow-2xl hover:shadow-glow transform hover:scale-110 group">
            Start Shopping
            <ArrowRightIcon className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
