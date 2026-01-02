'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Image from 'next/image';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface AboutPageData {
  id: number;
  title: string;
  subtitle: string | null;
  content: string;
  image_url: string | null;
  mission: string | null;
  vision: string | null;
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await api.get('/api/about');
      setAboutData(response.data);
    } catch (error) {
      console.error('Failed to fetch about data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-12 rounded w-1/3 mb-4"></div>
            <div className="bg-gray-300 h-6 rounded w-1/2 mb-8"></div>
            <div className="bg-gray-300 h-64 rounded mb-8"></div>
            <div className="bg-gray-300 h-32 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <SparklesIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">About Page Coming Soon</h2>
          <p className="text-gray-600">Our story is being written...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {aboutData.title}
            </h1>
            {aboutData.subtitle && (
              <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
                {aboutData.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Image */}
        {aboutData.image_url && (
          <div className="mb-12">
            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={aboutData.image_url}
                alt={aboutData.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="card mb-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
              {aboutData.content}
            </p>
          </div>
        </div>

        {/* Mission and Vision */}
        {(aboutData.mission || aboutData.vision) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            {aboutData.mission && (
              <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {aboutData.mission}
                </p>
              </div>
            )}

            {/* Vision */}
            {aboutData.vision && (
              <div className="card bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-500 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {aboutData.vision}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
