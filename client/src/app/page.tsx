'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Product, Category } from '@/types';
import Image from 'next/image';
import { SparklesIcon, TruckIcon, ShieldCheckIcon, CreditCardIcon, ArrowRightIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [heroBanners, setHeroBanners] = useState<any[]>([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

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

    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    const fetchHeroBanners = async () => {
      try {
        const response = await api.get('/api/hero-banners/active');
        setHeroBanners(response.data || []);
      } catch (error) {
        console.error('Failed to fetch hero banners:', error);
      } finally {
        setBannerLoading(false);
      }
    };

    fetchFeaturedProducts();
    fetchCategories();
    fetchHeroBanners();
  }, []);

  // Auto-rotate slideshow
  useEffect(() => {
    if (heroBanners.length <= 1) return; // No rotation if 0 or 1 banner
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 7000); // Change slide every 7 seconds

    return () => clearInterval(interval);
  }, [heroBanners.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
  };

  return (
    <div className="min-h-screen">

      {/* Hero Section - Slideshow */}
       <div className="relative h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
        {/* Slideshow Images */}
        {heroBanners.length > 0 && !bannerLoading ? (
          <>
            {heroBanners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image
                  src={banner.image_url}
                  alt={banner.title || `Hero Banner ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/5 to-black/10"></div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 via-secondary-100/20 to-accent-100/20"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTE4IDM2YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
          </>
        )}
        
        {/* Content Overlay */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {heroBanners.length === 0 ? (
            <div className="inline-block mb-6 animate-bounce">
              <SparklesIcon className="h-16 w-16 text-primary-500" />
            </div>
          ) : null}
          {heroBanners[currentSlide]?.title && (
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 transition-all duration-500 text-white drop-shadow-2xl">
              {heroBanners[currentSlide].title}
            </h1>
          )}
          {heroBanners[currentSlide]?.subtitle && (
            <p className="text-xl sm:text-2xl mb-8 max-w-2xl mx-auto transition-all duration-500 text-white drop-shadow-lg">
              {heroBanners[currentSlide].subtitle}
            </p>
          )}
        </div>

        {/* Navigation Arrows */}
        {heroBanners.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full transition-all duration-300 group"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full transition-all duration-300 group"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {heroBanners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Featured Products */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-6xl">✨</span>
          </div>
          <h2 className="section-title">Welcome to Noosh Tufts</h2>
          <p className="section-subtitle">Tufted Designs Handcrafted with Love</p>
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
                        Rs {product.price.toFixed(2)}
                      </span>
                      {product.compare_at_price && (
                        <span className="text-gray-400 line-through text-sm font-medium">
                          Rs {product.compare_at_price.toFixed(2)}
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

      {/* Polaroid Showcase - Crafting Process */}
      <div className="relative bg-gradient-to-b from-white/90 to-pearl-50/90 backdrop-blur-sm py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 px-4 sm:px-6 lg:px-8">
            <div className="inline-block mb-4">
              <span className="text-5xl">🧵</span>
            </div>
            <h2 className="section-title">Textured Art</h2>
            <p className="section-subtitle">Elevate your space with hand-tufted wall decor that adds warmth and dimension.</p>
          </div>

          {/* Polaroid Cards Carousel */}
          <div className="relative">
            <div className="flex gap-8 overflow-x-auto pb-12 px-8 scrollbar-hide snap-x snap-mandatory"
                 style={{scrollPaddingLeft: '2rem', scrollPaddingRight: '2rem'}}>
              {/* Polaroid Card 1 */}
              <div className="flex-shrink-0 w-80 snap-center">
                <div className="bg-white p-4 shadow-dreamy hover:shadow-glow transition-all duration-500 transform hover:-rotate-2 hover:scale-105" style={{transform: 'rotate(-3deg)'}}>
                  <div className="relative h-80 bg-gradient-to-br from-primary-50 to-secondary-50 mb-4 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-primary-300">
                      <span className="text-6xl">🎨</span>
                    </div>
                  </div>
                  <div className="text-center font-handwriting text-gray-700 text-lg">
                    Sketching the design
                  </div>
                </div>
              </div>

              {/* Polaroid Card 3 */}
              <div className="flex-shrink-0 w-80 snap-center">
                <div className="bg-white p-4 shadow-dreamy hover:shadow-glow transition-all duration-500 transform hover:-rotate-1 hover:scale-105" style={{transform: 'rotate(-1deg)'}}>
                  <div className="relative h-80 bg-gradient-to-br from-accent-50 to-primary-50 mb-4 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-accent-300">
                      <span className="text-6xl">🧶</span>
                    </div>
                  </div>
                  <div className="text-center font-handwriting text-gray-700 text-lg">
                    Tufting magic begins
                  </div>
                </div>
              </div>

              {/* Polaroid Card 2 */}
              <div className="flex-shrink-0 w-80 snap-center">
                <div className="bg-white p-4 shadow-dreamy hover:shadow-glow transition-all duration-500 transform hover:rotate-2 hover:scale-105" style={{transform: 'rotate(2deg)'}}>
                  <div className="relative h-80 bg-gradient-to-br from-secondary-50 to-accent-50 mb-4 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-secondary-300">
                      <span className="text-6xl">✂️</span>
                    </div>
                  </div>
                  <div className="text-center font-handwriting text-gray-700 text-lg">
                    Cutting the fabric
                  </div>
                </div>
              </div>

              {/* Polaroid Card 4 */}
              <div className="flex-shrink-0 w-80 snap-center">
                <div className="bg-white p-4 shadow-dreamy hover:shadow-glow transition-all duration-500 transform hover:rotate-3 hover:scale-105" style={{transform: 'rotate(1deg)'}}>
                  <div className="relative h-80 bg-gradient-to-br from-primary-50 to-accent-50 mb-4 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-primary-300">
                      <span className="text-6xl">✨</span>
                    </div>
                  </div>
                  <div className="text-center font-handwriting text-gray-700 text-lg">
                    Adding final touches
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 px-4 sm:px-6 lg:px-8">
            <p className="text-gray-600 italic text-lg">
              Each piece tells a story of dedication and craftsmanship 💝
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-gradient-to-b from-pearl-50/50 to-white/50 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-glass text-center group hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-all duration-300 shadow-glow">
                <TruckIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 gradient-text">Free Shipping</h3>
              <p className="text-gray-600 leading-relaxed">Complimentary delivery on all orders over Rs 50</p>
            </div>

            <div className="card-glass text-center group hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary-400 via-accent-400 to-primary-400 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-all duration-300 shadow-glow">
                <ShieldCheckIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 gradient-text">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed">Handpicked items with guaranteed excellence</p>
            </div>

            <div className="card-glass text-center group hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-400 via-primary-400 to-secondary-400 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-all duration-300 shadow-glow">
                <CreditCardIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 gradient-text">Personalized Handcrafts</h3>
              <p className="text-gray-600 leading-relaxed">Custom designs made with love and care</p>
            </div>
          </div>
        </div>
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