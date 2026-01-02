'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { TrashIcon, PencilIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import ImageUpload from '@/components/ImageUpload';
import toast from 'react-hot-toast';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  button_text: string;
  button_link: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminHeroSlidesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    button_text: '',
    button_link: '',
    order_index: 0,
    is_active: true,
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await api.get('/api/hero-slides?include_inactive=true');
      setSlides(response.data);
    } catch (error) {
      console.error('Error fetching slides:', error);
      toast.error('Failed to load slides');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.image_url) {
      toast.error('Title and image are required');
      return;
    }

    try {
      if (editingSlide) {
        await api.put(`/api/hero-slides/${editingSlide.id}`, formData);
        toast.success('Slide updated successfully! ✨');
      } else {
        await api.post('/api/hero-slides', formData);
        toast.success('Slide created successfully! ✨');
      }
      fetchSlides();
      closeModal();
    } catch (error) {
      console.error('Error saving slide:', error);
      toast.error('Failed to save slide');
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      image_url: slide.image_url,
      button_text: slide.button_text,
      button_link: slide.button_link,
      order_index: slide.order_index,
      is_active: slide.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    try {
      await api.delete(`/api/hero-slides/${id}`);
      toast.success('Slide deleted successfully');
      fetchSlides();
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Failed to delete slide');
    }
  };

  const toggleActive = async (slide: HeroSlide) => {
    try {
      await api.put(`/api/hero-slides/${slide.id}`, {
        is_active: !slide.is_active
      });
      toast.success(slide.is_active ? 'Slide hidden' : 'Slide activated');
      fetchSlides();
    } catch (error) {
      console.error('Error toggling slide:', error);
      toast.error('Failed to update slide');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSlide(null);
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      button_text: '',
      button_link: '',
      order_index: 0,
      is_active: true,
    });
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Hero Slideshow</h1>
            <p className="text-gray-600">Manage homepage header slides (auto-changes every 5 seconds)</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            ✨ Add New Slide
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-48 rounded-2xl mb-4"></div>
                <div className="bg-gray-300 h-6 rounded-lg w-3/4 mb-2"></div>
              </div>
            ))}
          </div>
        ) : slides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide) => (
              <div key={slide.id} className={`card ${!slide.is_active ? 'opacity-50' : ''}`}>
                <div className="relative h-48 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl mb-4 overflow-hidden">
                  {slide.image_url ? (
                    <Image
                      src={slide.image_url}
                      alt={slide.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-primary-300">
                      <span className="text-5xl">🖼️</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <span className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-gray-700">
                      Order: {slide.order_index}
                    </span>
                    {!slide.is_active && (
                      <span className="bg-red-500 text-white rounded-full px-3 py-1 text-xs font-bold">
                        Hidden
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{slide.title}</h3>
                {slide.subtitle && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{slide.subtitle}</p>
                )}
                {slide.button_text && (
                  <div className="text-xs text-primary-600 mb-4">
                    🔗 Button: {slide.button_text}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => toggleActive(slide)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl transition-all ${
                      slide.is_active
                        ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                    }`}
                  >
                    {slide.is_active ? (
                      <><EyeSlashIcon className="h-4 w-4" /><span className="text-sm font-medium">Hide</span></>
                    ) : (
                      <><EyeIcon className="h-4 w-4" /><span className="text-sm font-medium">Show</span></>
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(slide)}
                    className="flex-1 flex items-center justify-center space-x-2 text-primary-600 hover:text-primary-800 hover:bg-primary-50 transition-all py-2 rounded-xl"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id, slide.title)}
                    className="flex-1 flex items-center justify-center space-x-2 text-red-600 hover:text-red-800 hover:bg-red-50 transition-all py-2 rounded-xl"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-100 via-secondary-100 to-accent-100 rounded-full mb-6 shadow-dreamy">
              <span className="text-6xl">🎬</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No slides yet</h3>
            <p className="text-gray-600 mb-6">Create your first hero slide to showcase on homepage</p>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Create First Slide
            </button>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-dreamy border border-primary-100 my-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold gradient-text mb-1">
                    {editingSlide ? 'Edit Slide' : 'Add New Slide'}
                  </h2>
                  <p className="text-gray-600 text-sm">Create a stunning hero slide for your homepage</p>
                </div>
                <span className="text-4xl">🎬</span>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Slide Title * <span className="text-gray-400 font-normal text-xs">(main heading)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Handcrafted with Love"
                    className="input-field"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Subtitle <span className="text-gray-400 font-normal text-xs">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Discover unique artisanal creations"
                    className="input-field"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  />
                </div>

                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  label="Hero Image"
                  required={true}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Button Text <span className="text-gray-400 font-normal text-xs">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Shop Now"
                      className="input-field"
                      value={formData.button_text}
                      onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Button Link <span className="text-gray-400 font-normal text-xs">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., /products"
                      className="input-field"
                      value={formData.button_link}
                      onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Display Order <span className="text-gray-400 font-normal text-xs">(0 = first)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="input-field"
                      value={formData.order_index}
                      onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                    <div className="flex items-center space-x-4 h-12">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                          className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingSlide ? '💾 Update Slide' : '✨ Create Slide'}
                  </button>
                  <button 
                    type="button" 
                    onClick={closeModal} 
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
