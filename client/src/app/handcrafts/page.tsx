'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Image from 'next/image';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface HandcraftPhoto {
  id: number;
  title: string;
  description: string;
  image_url: string;
  order_index: number;
  created_at: string;
}

export default function HandcraftsPage() {
  const [photos, setPhotos] = useState<HandcraftPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await api.get('/api/handcraft-photos');
        setPhotos(response.data);
      } catch (error) {
        console.error('Error fetching handcraft photos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50/60 via-secondary-50/40 to-pearl-100/60 py-20">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-primary-300 to-secondary-300 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-secondary-300 to-accent-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6">
            <span className="text-7xl">🧵</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
              Handcrafted
            </span>
            <br />
            <span className="text-gray-800">with Love</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            Watch our artisanal process come to life. Every stitch, every thread, every moment captured with care.
          </p>
        </div>
      </div>

      {/* Polaroid Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white p-4 shadow-dreamy">
                  <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-80 mb-4"></div>
                  <div className="bg-gray-300 h-6 rounded w-3/4 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : photos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {photos.map((photo, index) => {
              const rotations = ['-rotate-3', 'rotate-2', '-rotate-1', 'rotate-3', '-rotate-2', 'rotate-1'];
              const rotation = rotations[index % rotations.length];
              
              return (
                <div 
                  key={photo.id}
                  className="animate-fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className={`bg-white p-4 shadow-dreamy hover:shadow-glow transition-all duration-500 transform hover:scale-105 hover:rotate-0 ${rotation}`}>
                    <div className="relative h-80 bg-gradient-to-br from-primary-50 to-secondary-50 mb-4 overflow-hidden">
                      {photo.image_url ? (
                        <Image
                          src={photo.image_url}
                          alt={photo.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-primary-300">
                          <SparklesIcon className="h-20 w-20" />
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="font-handwriting text-gray-700 text-lg mb-1">
                        {photo.title}
                      </h3>
                      {photo.description && (
                        <p className="text-sm text-gray-500 italic">
                          {photo.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-100 via-secondary-100 to-accent-100 rounded-full mb-6 shadow-dreamy">
              <span className="text-6xl">🎨</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-xl text-gray-600 mb-8">
              We're capturing our crafting process to share with you!
            </p>
            <p className="text-gray-500 max-w-md mx-auto">
              Check back soon to see behind-the-scenes photos of how we create each handcrafted piece.
            </p>
          </div>
        )}
      </div>

      {/* Quote Section */}
      <div className="bg-gradient-to-r from-primary-50 via-secondary-50 to-accent-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-2xl md:text-3xl text-gray-700 italic font-light leading-relaxed mb-4">
            "Every piece tells a story of dedication, patience, and love."
          </p>
          <p className="text-gray-600 text-lg">💝 Handcrafted with care by Noosh Tuft</p>
        </div>
      </div>
    </div>
  );
}
