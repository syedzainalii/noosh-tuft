'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  button_text: string;
  button_link: string;
  order_index: number;
  is_active: boolean;
}

export default function HeroSlideshow() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length, isPaused]);

  const fetchSlides = async () => {
    try {
      const response = await api.get('/api/hero-slides');
      setSlides(response.data);
    } catch (error) {
      console.error('Error fetching slides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (isLoading) {
    return (
      <div className="relative h-[70vh] min-h-[500px] bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl">✨</div>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative h-[70vh] min-h-[500px] bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center px-4">
            <div className="text-7xl mb-6">💝</div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                Welcome to
              </span>
              <br />
              <span className="text-gray-800">Noosh Tuft</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Handcrafted with love, just for you ✨
            </p>
            <Link href="/products" className="btn-primary text-lg inline-flex items-center">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative h-[70vh] min-h-[500px] overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.image_url}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-3xl animate-slide-up">
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className="text-xl md:text-3xl text-white/95 mb-10 font-light drop-shadow-lg">
                    {slide.subtitle}
                  </p>
                )}
                {slide.button_text && slide.button_link && (
                  <Link
                    href={slide.button_link}
                    className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-full font-bold text-lg hover:bg-primary-50 transition-all duration-300 shadow-2xl hover:shadow-glow transform hover:scale-105"
                  >
                    {slide.button_text}
                    <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-800" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? 'bg-white w-12 h-3'
                  : 'bg-white/50 hover:bg-white/80 w-3 h-3'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
