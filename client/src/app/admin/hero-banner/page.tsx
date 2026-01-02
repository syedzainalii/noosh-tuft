'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import ImageUpload from '@/components/ImageUpload';
import { PhotoIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface HeroBanner {
  id: number;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  button1_text: string | null;
  button1_url: string | null;
  button2_text: string | null;
  button2_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export default function HeroBannerManagement() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    button1_text: '',
    button1_url: '',
    button2_text: '',
    button2_url: '',
    is_active: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user && user.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchBanners();
  }, [isAuthenticated, user, router]);

  const fetchBanners = async () => {
    try {
      const response = await api.get('/api/hero-banners');
      setBanners(response.data);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image_url) {
      alert('Please upload an image');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/api/hero-banners/${editingId}`, formData);
      } else {
        await api.post('/api/hero-banners', formData);
      }
      
      setFormData({ title: '', subtitle: '', image_url: '', is_active: true });
      setEditingId(null);
      setShowForm(false);
      await fetchBanners();
    } catch (error: any) {
      console.error('Failed to save banner:', error);
      alert(error.response?.data?.detail || 'Failed to save banner');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (banner: HeroBanner) => {
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      image_url: banner.image_url,
      button1_text: banner.button1_text || '',
      button1_url: banner.button1_url || '',
      button2_text: banner.button2_text || '',
      button2_url: banner.button2_url || '',
      is_active: banner.is_active,
    });
    setEditingId(banner.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      await api.delete(`/api/hero-banners/${id}`);
      await fetchBanners();
    } catch (error) {
      console.error('Failed to delete banner:', error);
      alert('Failed to delete banner');
    }
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      await api.put(`/api/hero-banners/${id}`, { is_active: !currentStatus });
      await fetchBanners();
    } catch (error) {
      console.error('Failed to update banner status:', error);
      alert('Failed to update banner status');
    }
  };

  const cancelEdit = () => {
    setFormData({ title: '', subtitle: '', image_url: '', button1_text: '', button1_url: '', button2_text: '', button2_url: '', is_active: true });
    setEditingId(null);
    setShowForm(false);
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
              Hero Banner Management
            </span>
          </h1>
          <p className="text-xl text-gray-600">Manage the hero banner on your home page</p>
        </div>

        {/* Create/Edit Form */}
        {showForm ? (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? '✏️ Edit Banner' : '➕ Create New Banner'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="Welcome to Noosh Tuft"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Subtitle (Optional)
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="input-field"
                  placeholder="Handcrafted Tufted & Embroidered Art"
                />
              </div>

              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                label="Hero Banner Image"
                required
              />

              {/* Button 1 */}
              <div className="border-2 border-primary-100 rounded-2xl p-6 bg-gradient-to-br from-primary-50/30 to-secondary-50/30">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🔘 Button 1 (Optional)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={formData.button1_text}
                      onChange={(e) => setFormData({ ...formData, button1_text: e.target.value })}
                      className="input-field"
                      placeholder="Shop Now"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Button URL
                    </label>
                    <input
                      type="text"
                      value={formData.button1_url}
                      onChange={(e) => setFormData({ ...formData, button1_url: e.target.value })}
                      className="input-field"
                      placeholder="/products"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Use relative URLs like /products or /categories
                    </p>
                  </div>
                </div>
              </div>

              {/* Button 2 */}
              <div className="border-2 border-secondary-100 rounded-2xl p-6 bg-gradient-to-br from-secondary-50/30 to-accent-50/30">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🔘 Button 2 (Optional)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={formData.button2_text}
                      onChange={(e) => setFormData({ ...formData, button2_text: e.target.value })}
                      className="input-field"
                      placeholder="View Gallery"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Button URL
                    </label>
                    <input
                      type="text"
                      value={formData.button2_url}
                      onChange={(e) => setFormData({ ...formData, button2_url: e.target.value })}
                      className="input-field"
                      placeholder="/handcrafts"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Use relative URLs like /handcrafts or external URLs like https://example.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
                  Set as active banner (will deactivate all others)
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Banner' : 'Create Banner'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              ➕ Create New Banner
            </button>
          </div>
        )}

        {/* Banners List */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📸 All Banners</h2>
          
          {banners.length === 0 ? (
            <div className="text-center py-12">
              <PhotoIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No banners yet. Create your first one!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="border-2 border-gray-200 rounded-2xl p-6 hover:border-primary-200 transition-colors"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative w-full md:w-64 h-40 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={banner.image_url}
                        alt={banner.title || 'Hero Banner'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {banner.title || 'Untitled Banner'}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {banner.subtitle || 'No subtitle'}
                          </p>
                          <div className="flex items-center gap-2">
                            {banner.is_active ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                <CheckCircleIcon className="h-4 w-4 mr-1" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                                <XCircleIcon className="h-4 w-4 mr-1" />
                                Inactive
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleEdit(banner)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => toggleActive(banner.id, banner.is_active)}
                          className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                            banner.is_active
                              ? 'bg-gray-500 text-white hover:bg-gray-600'
                              : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                        >
                          {banner.is_active ? '🔒 Deactivate' : '✅ Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
