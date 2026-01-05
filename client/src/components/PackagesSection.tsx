'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import Link from 'next/link';
import { SparklesIcon, RocketLaunchIcon, CheckIcon } from '@heroicons/react/24/outline';

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string;
  is_popular: boolean;
  button_text: string;
  button_link: string;
  icon: string;
}

export default function PackagesSection() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await api.get('/api/packages/');
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || packages.length === 0) return null;

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-30"></div>
      
      {/* Glowing orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 mb-8">
            <RocketLaunchIcon className="h-8 w-8 text-cyan-400" />
            <span className="text-cyan-400 font-bold uppercase text-lg tracking-wider">Website Packages</span>
          </div>
          <h2 className="section-title text-6xl md:text-8xl">
            Choose Your Website Package
          </h2>
          <p className="section-subtitle text-2xl md:text-3xl">
            From startup to enterprise — we've got you covered
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative group"
            >
              {pkg.is_popular && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                >
                  <div className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center gap-2 shadow-lg glow-purple">
                    <SparklesIcon className="h-5 w-5 text-white" />
                    <span className="text-white font-bold text-sm uppercase">Most Popular</span>
                  </div>
                </motion.div>
              )}

              <div className={`card-holo h-full flex flex-col relative overflow-hidden ${pkg.is_popular ? 'border-purple-500 border-2 glow-purple' : ''}`}>
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Icon with enhanced glow */}
                <div className="text-7xl mb-6 text-center group-hover:scale-125 transition-all duration-300 relative z-10"
                     style={{ filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.5))' }}>
                  {pkg.icon}
                </div>

                {/* Package Name */}
                <h3 className="text-3xl font-black mb-4 text-center gradient-text relative z-10">
                  {pkg.name}
                </h3>

                {/* Description */}
                <p className="text-text-secondary text-center mb-6 flex-grow relative z-10 text-lg">
                  {pkg.description}
                </p>

                {/* Price with enhanced styling */}
                <div className="mb-8 text-center relative z-10">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-6xl font-black neon-text" 
                          style={{ textShadow: '0 0 30px rgba(0, 255, 255, 0.6)' }}>
                      ${pkg.price}
                    </span>
                    {pkg.duration && (
                      <span className="text-text-tertiary text-xl font-medium">
                        {pkg.duration}
                      </span>
                    )}
                  </div>
                  <div className="text-text-tertiary text-sm mt-2 uppercase tracking-wider">
                    One-time payment
                  </div>
                </div>

                {/* Features */}
                {pkg.features && (
                  <div className="space-y-4 mb-8">
                    {pkg.features.split('\n').filter(f => f.trim()).map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3 group/feature"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50 group-hover/feature:bg-cyan-500 transition-all duration-300">
                          <CheckIcon className="h-4 w-4 text-cyan-400 group-hover/feature:text-white" />
                        </div>
                        <span className="text-text-secondary text-sm leading-relaxed">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative z-10"
                >
                  <Link
                    href={pkg.button_link || '/contact'}
                    className={`btn-${pkg.is_popular ? 'primary' : 'secondary'} w-full text-center block mt-auto text-lg py-4 relative overflow-hidden group/button`}
                  >
                    <span className="relative z-10">{pkg.button_text}</span>
                    {pkg.is_popular && (
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover/button:opacity-100 transition-opacity"></div>
                    )}
                  </Link>
                </motion.div>

                {/* Enhanced hover effect */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-pink-500/20 rounded-3xl blur-xl"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="card-glass inline-block p-12 max-w-3xl">
            <p className="text-text-secondary text-2xl mb-8 font-light">
              Need a <span className="text-cyan-400 font-bold">custom solution</span>? 
              <br />Let's build something extraordinary together.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/contact" className="btn-primary inline-flex items-center gap-3 text-xl px-12 py-5">
                <span>Get Custom Quote</span>
                <RocketLaunchIcon className="h-6 w-6" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
