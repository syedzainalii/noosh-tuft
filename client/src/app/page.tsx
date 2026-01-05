'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Product, Category } from '@/types';
import Image from 'next/image';
import { SparklesIcon, TruckIcon, ShieldCheckIcon, CreditCardIcon, ArrowRightIcon, HeartIcon, BoltIcon, RocketLaunchIcon, CodeBracketIcon, DevicePhoneMobileIcon, CubeTransparentIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import AdvancedBackground from '@/components/AdvancedBackground';
import PackagesSection from '@/components/PackagesSection';

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
    <div className="min-h-screen relative">
      {/* Advanced Interactive Background */}
      <AdvancedBackground />
      
      {/* Scanline Effect */}
      <div className="scanlines"></div>

      {/* Hero Section - Ultra Modern */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden"
           style={{ 
             background: 'radial-gradient(circle at 30% 50%, rgba(0, 255, 255, 0.15) 0%, transparent 60%), radial-gradient(circle at 70% 30%, rgba(160, 32, 240, 0.2) 0%, transparent 60%)'
           }}>
        {/* Slideshow Images */}
        {heroBanners.length > 0 && !bannerLoading ? (
          <>
            {heroBanners.map((banner, index) => (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ 
                  opacity: index === currentSlide ? 1 : 0,
                  scale: index === currentSlide ? 1 : 1.1
                }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <Image
                  src={banner.image_url}
                  alt={banner.title || `Hero Banner ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent"></div>
              </motion.div>
            ))}
          </>
        ) : (
          <>
            <div className="absolute inset-0 cyber-grid"></div>
          </>
        )}
        
        {/* Content Overlay */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
        >
          {heroBanners.length === 0 ? (
            <>
              {/* Floating badge */}
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 mb-8 backdrop-blur-xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
                <CodeBracketIcon className="h-8 w-8 text-cyan-400 relative z-10" />
                <span className="text-cyan-400 font-bold uppercase text-lg tracking-wider relative z-10">Premium Web Development</span>
              </motion.div>

              {/* Main headline with 3D effect */}
              <motion.h1 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-6xl sm:text-7xl lg:text-9xl font-black mb-8 leading-tight relative"
                style={{ 
                  textShadow: '0 0 80px rgba(0, 255, 255, 0.5), 0 0 30px rgba(160, 32, 240, 0.5)'
                }}
              >
                <span className="gradient-text block">Build Your</span>
                <span className="gradient-text block">Digital Empire</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-2xl sm:text-3xl lg:text-4xl mb-16 max-w-4xl mx-auto text-text-secondary font-light"
              >
                Custom websites that don't just look amazing — they <span className="text-cyan-400 font-bold">dominate</span> your market
              </motion.p>

              {/* CTA Buttons with hover effects */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="flex gap-6 justify-center flex-wrap"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="#packages" className="btn-primary text-xl px-12 py-6 flex items-center gap-3 relative overflow-hidden group">
                    <span className="relative z-10">View Packages</span>
                    <RocketLaunchIcon className="h-7 w-7 relative z-10 group-hover:translate-x-2 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="#portfolio" className="btn-secondary text-xl px-12 py-6 flex items-center gap-3">
                    <CubeTransparentIcon className="h-7 w-7" />
                    <span>See Our Work</span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Stats bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="mt-24 flex gap-12 justify-center flex-wrap"
              >
                {[
                  { number: "500+", label: "Websites Built" },
                  { number: "98%", label: "Client Satisfaction" },
                  { number: "24/7", label: "Support Available" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-4xl sm:text-5xl font-black gradient-text mb-2">{stat.number}</div>
                    <div className="text-text-tertiary text-sm uppercase tracking-wider">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          ) : (
            <>
              {heroBanners[currentSlide]?.title && (
                <motion.h1 
                  key={`title-${currentSlide}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-6xl sm:text-7xl lg:text-8xl font-black mb-8 text-white drop-shadow-2xl neon-text"
                >
                  {heroBanners[currentSlide].title}
                </motion.h1>
              )}
              {heroBanners[currentSlide]?.subtitle && (
                <motion.p 
                  key={`subtitle-${currentSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-2xl sm:text-3xl mb-12 max-w-3xl mx-auto text-white/90 drop-shadow-lg"
                >
                  {heroBanners[currentSlide].subtitle}
                </motion.p>
              )}
            </>
          )}
        </motion.div>

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

      {/* Our Process - Web Development */}
      <div className="relative py-32 overflow-hidden" id="portfolio">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20 px-4 sm:px-6 lg:px-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 mb-6">
              <CodeBracketIcon className="h-8 w-8 text-cyan-400" />
            </div>
            <h2 className="section-title">Our Development Process</h2>
            <p className="section-subtitle">From concept to launch - perfected</p>
          </motion.div>

          {/* Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
            {[
              { 
                icon: <CodeBracketIcon className="h-16 w-16" />,
                title: "1. Strategy & Planning",
                description: "Deep dive into your goals, audience, and competition to craft the perfect roadmap"
              },
              { 
                icon: <CubeTransparentIcon className="h-16 w-16" />,
                title: "2. Design & Prototype",
                description: "Stunning designs that captivate users and convert visitors into customers"
              },
              { 
                icon: <BoltIcon className="h-16 w-16" />,
                title: "3. Development",
                description: "Clean, fast, and scalable code built with cutting-edge technologies"
              },
              { 
                icon: <RocketLaunchIcon className="h-16 w-16" />,
                title: "4. Launch & Optimize",
                description: "Deploy with confidence and continuously improve performance"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="card-holo h-full p-8 text-center relative group">
                  {/* Number badge */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center font-black text-white text-lg glow-cyan">
                    {index + 1}
                  </div>
                  
                  {/* Icon with glow effect */}
                  <div className="mb-6 text-cyan-400 flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold gradient-text mb-4">
                    {step.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-20 px-4 sm:px-6 lg:px-8"
          >
            <p className="text-text-secondary italic text-xl mb-8">
              Every website is a masterpiece of code, design, and performance ⚡
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="#packages" className="btn-primary inline-flex items-center gap-3">
                <span>Start Your Project</span>
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Packages Section */}
      <div id="packages">
        <PackagesSection />
      </div>

      {/* Testimonials Section */}
      <div className="relative py-32 overflow-hidden">
        {/* Glowing gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/50 mb-8">
              <SparklesIcon className="h-8 w-8 text-pink-400" />
            </div>
            <h2 className="section-title">Client Success Stories</h2>
            <p className="section-subtitle">Real results from real businesses</p>
          </motion.div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                company: "TechStart Inc",
                role: "CEO",
                image: "👩‍💼",
                quote: "NexGen Web transformed our online presence completely. Our conversion rate tripled within the first month!",
                rating: 5
              },
              {
                name: "Michael Chen",
                company: "Digital Innovators",
                role: "Marketing Director",
                image: "👨‍💻",
                quote: "The attention to detail and cutting-edge design exceeded all expectations. Best investment we've made.",
                rating: 5
              },
              {
                name: "Emma Rodriguez",
                company: "Global Solutions",
                role: "Founder",
                image: "👩‍🚀",
                quote: "Professional, innovative, and incredibly responsive. They turned our vision into reality and beyond.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="card-holo h-full p-8 relative">
                  {/* Quote marks */}
                  <div className="text-6xl text-cyan-400/30 font-serif absolute top-4 left-4">"</div>
                  
                  {/* Stars */}
                  <div className="flex gap-1 mb-6 justify-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-text-secondary text-lg mb-8 leading-relaxed italic relative z-10">
                    {testimonial.quote}
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-4 border-t border-cyan-500/20 pt-6">
                    <div className="text-5xl">{testimonial.image}</div>
                    <div>
                      <div className="font-bold text-lg gradient-text">{testimonial.name}</div>
                      <div className="text-text-tertiary text-sm">{testimonial.role}</div>
                      <div className="text-cyan-400 text-sm font-medium">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-cyan-500/20 border border-yellow-500/50 mb-8">
            <BoltIcon className="h-8 w-8 text-yellow-400" />
          </div>
          <h2 className="section-title">Why Choose NexGen Web</h2>
          <p className="section-subtitle">The technology that powers success</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <CodeBracketIcon className="h-12 w-12" />,
                title: "Modern Tech Stack",
                description: "React, Next.js, TypeScript - we use cutting-edge technologies for lightning-fast, scalable websites"
              },
              {
                icon: <DevicePhoneMobileIcon className="h-12 w-12" />,
                title: "Mobile-First Design",
                description: "Every website perfectly optimized for all devices - from phones to 4K displays"
              },
              {
                icon: <BoltIcon className="h-12 w-12" />,
                title: "Blazing Fast Performance",
                description: "99+ PageSpeed scores with optimized loading times that keep visitors engaged"
              },
              {
                icon: <ShieldCheckIcon className="h-12 w-12" />,
                title: "Enterprise Security",
                description: "Bank-level security protocols to protect your business and customer data"
              },
              {
                icon: <RocketLaunchIcon className="h-12 w-12" />,
                title: "SEO Optimized",
                description: "Built-in SEO best practices to rank higher and get discovered by your audience"
              },
              {
                icon: <CubeTransparentIcon className="h-12 w-12" />,
                title: "Scalable Architecture",
                description: "Grow from startup to enterprise without rebuilding - our code scales with you"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="card-holo h-full p-8 text-center relative group">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icon */}
                  <div className="mb-6 text-cyan-400 flex justify-center group-hover:scale-110 transition-transform duration-300 relative z-10">
                    {feature.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold gradient-text mb-4 relative z-10">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-text-secondary leading-relaxed relative z-10">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
      </div>


      {/* CTA Section */}
      <div className="relative overflow-hidden py-40 mt-20">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20"></div>
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        
        {/* Floating orbs */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.7s'}}></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10"
        >
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <span className="text-8xl">💖</span>
          </motion.div>
          <h2 className="text-6xl md:text-8xl font-black mb-10 leading-tight">
            <span className="gradient-text">Ready to Dominate Your Market?</span>
          </h2>
          <p className="text-2xl md:text-4xl text-text-secondary mb-16 font-light leading-relaxed">
            Let's build a website that converts visitors into customers ⚡
          </p>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="#packages" className="inline-flex items-center btn-primary text-xl px-12 py-6 gap-4">
              <span>Get Started Today</span>
              <ArrowRightIcon className="h-7 w-7 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}