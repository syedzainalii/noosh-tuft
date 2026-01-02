'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface HandcraftPhoto {
  id: number;
  title: string;
  description: string;
  image_url: string;
  order_index: number;
  created_at: string;
}

export default function AdminHandcraftsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [photos, setPhotos] = useState<HandcraftPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<HandcraftPhoto | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    order_index: 0,
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await api.get('/api/handcraft-photos');
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPhoto) {
        await api.put(`/api/handcraft-photos/${editingPhoto.id}`, formData);
      } else {
        await api.post('/api/handcraft-photos', formData);
      }
      fetchPhotos();
      setShowAddModal(false);
      setEditingPhoto(null);
      setFormData({ title: '', description: '', image_url: '', order_index: 0 });
    } catch (error) {
      console.error('Error saving photo:', error);
      alert('Failed to save photo');
    }
  };

  const handleEdit = (photo: HandcraftPhoto) => {
    setEditingPhoto(photo);
    setFormData({
      title: photo.title,
      description: photo.description,
      image_url: photo.image_url,
      order_index: photo.order_index,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    try {
      await api.delete(`/api/handcraft-photos/${id}`);
      fetchPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo');
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingPhoto(null);
    setFormData({ title: '', description: '', image_url: '', order_index: 0 });
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Handcraft Process Photos</h1>
            <p className="text-gray-600">Manage your crafting process showcase</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            ✨ Add New Photo
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white p-4 shadow-dreamy rounded-3xl">
                  <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-80 rounded-2xl mb-4"></div>
                  <div className="bg-gray-300 h-6 rounded-lg w-3/4 mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded-lg w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : photos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo, index) => {
              const rotations = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'];
              const rotation = rotations[index % rotations.length];
              
              return (
                <div 
                  key={photo.id}
                  className="group"
                >
                  <div className={`bg-white p-4 shadow-dreamy hover:shadow-glow transition-all duration-300 transform hover:scale-105 hover:rotate-0 ${rotation}`}>
                    <div className="relative h-80 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl mb-4 overflow-hidden">
                      {photo.image_url ? (
                        <Image
                          src={photo.image_url}
                          alt={photo.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-primary-300">
                          <span className="text-5xl">🎨</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-gray-700">
                        Order: {photo.order_index}
                      </div>
                    </div>
                    <div className="text-center mb-4">
                      <h3 className="font-handwriting text-gray-700 text-lg mb-1">
                        {photo.title}
                      </h3>
                      {photo.description && (
                        <p className="text-sm text-gray-500 italic line-clamp-2">
                          {photo.description}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleEdit(photo)}
                        className="flex-1 flex items-center justify-center space-x-2 text-primary-600 hover:text-primary-800 hover:bg-primary-50 transition-all py-2 rounded-xl"
                      >
                        <PencilIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(photo.id, photo.title)}
                        className="flex-1 flex items-center justify-center space-x-2 text-red-600 hover:text-red-800 hover:bg-red-50 transition-all py-2 rounded-xl"
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-100 via-secondary-100 to-accent-100 rounded-full mb-6 shadow-dreamy">
              <span className="text-6xl">🧵</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No photos yet</h3>
            <p className="text-gray-600 mb-6">Start showcasing your handcraft process</p>
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              Add First Photo
            </button>
          </div>
        )}

        {/* Add/Edit Photo Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-dreamy border border-primary-100 animate-slide-up max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold gradient-text mb-1">
                    {editingPhoto ? 'Edit Photo' : 'Add New Photo'}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {editingPhoto ? 'Update your process photo' : 'Add a photo of your crafting process'}
                  </p>
                </div>
                <span className="text-4xl">🎨</span>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Photo Title * <span className="text-gray-400 font-normal text-xs">(e.g., "Sketching the design")</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter a descriptive title..."
                    className="input-field"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description <span className="text-gray-400 font-normal text-xs">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add a caption or description..."
                    className="input-field"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Image URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/image.jpg"
                    className="input-field"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-2">💡 Tip: Upload your photo to an image host and paste the URL here</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Display Order <span className="text-gray-400 font-normal text-xs">(lower numbers appear first)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  />
                </div>

                {formData.image_url && (
                  <div className="border-2 border-primary-100 rounded-2xl p-4 bg-primary-50/30">
                    <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                    <div className="relative h-80 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl overflow-hidden">
                      <Image
                        src={formData.image_url}
                        alt="Preview"
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-4 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingPhoto ? '💾 Update Photo' : '✨ Add Photo'}
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
