'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import ImageUpload from '@/components/ImageUpload';

interface AboutPageData {
  id?: number;
  title: string;
  subtitle: string;
  content: string;
  image_url: string;
  mission: string;
  vision: string;
}

export default function AdminAboutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutData, setAboutData] = useState<AboutPageData | null>(null);
  const [formData, setFormData] = useState({
    title: 'About Us',
    subtitle: '',
    content: '',
    image_url: '',
    mission: '',
    vision: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user && user.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchAboutData();
  }, [isAuthenticated, user, router]);

  const fetchAboutData = async () => {
    try {
      const response = await api.get('/api/about');
      if (response.data) {
        setAboutData(response.data);
        setFormData({
          title: response.data.title || 'About Us',
          subtitle: response.data.subtitle || '',
          content: response.data.content || '',
          image_url: response.data.image_url || '',
          mission: response.data.mission || '',
          vision: response.data.vision || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch about data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content) {
      alert('Please add content for the about page');
      return;
    }

    setSaving(true);
    try {
      if (aboutData?.id) {
        // Update existing
        await api.put('/api/about', formData);
      } else {
        // Create new
        await api.post('/api/about', formData);
      }
      
      alert('About page saved successfully!');
      await fetchAboutData();
    } catch (error: any) {
      console.error('Failed to save about page:', error);
      alert(error.response?.data?.detail || 'Failed to save about page');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-8 rounded w-1/4 mb-8"></div>
            <div className="card">
              <div className="bg-gray-300 h-64 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Edit About Us Page
            </span>
          </h1>
          <p className="text-xl text-gray-600">Manage your about page content</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Page Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="About Us"
                required
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Subtitle (Optional)
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="input-field"
                placeholder="Learn more about our story"
              />
            </div>

            {/* Image Upload */}
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              label="About Page Image (Optional)"
            />

            {/* Main Content */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Main Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="input-field min-h-[200px]"
                placeholder="Tell your story... Who are you? What do you do? What makes you special?"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 This is the main content that appears on your about page
              </p>
            </div>

            {/* Mission */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Our Mission (Optional)
              </label>
              <textarea
                value={formData.mission}
                onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                className="input-field min-h-[120px]"
                placeholder="What is your mission? What drives you?"
              />
            </div>

            {/* Vision */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Our Vision (Optional)
              </label>
              <textarea
                value={formData.vision}
                onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                className="input-field min-h-[120px]"
                placeholder="What is your vision for the future?"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1"
              >
                {saving ? 'Saving...' : aboutData?.id ? 'Update About Page' : 'Create About Page'}
              </button>
              <a
                href="/about"
                target="_blank"
                className="btn-secondary flex-1 text-center"
              >
                Preview Page
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
