'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Category } from '@/types';
import toast from 'react-hot-toast';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ImageUpload from '@/components/ImageUpload';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
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
    fetchCategories();
  }, [isAuthenticated, user, router]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/categories', formData);
      toast.success('Category created successfully');
      setShowAddModal(false);
      setFormData({ name: '', slug: '', description: '', image_url: '' });
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create category');
    }
  };

  const handleDelete = async (e: React.MouseEvent, categoryId: number, categoryName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      return;
    }
    try {
      await api.delete(`/api/categories/${categoryId}`);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to delete category');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Manage Craft Categories</h1>
            <p className="text-gray-600">Organize your handcrafted products by category</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="btn-primary w-full md:w-auto"
          >
            ✨ Add New Category
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-48 rounded-2xl mb-4"></div>
                <div className="bg-gray-300 h-6 rounded-lg w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-4 rounded-lg w-full"></div>
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="card group">
                <div className="relative h-48 mb-4 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 rounded-2xl overflow-hidden">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-primary-300">
                      <span className="text-5xl">🎨</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description || 'No description'}</p>
                <div className="flex space-x-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={(e) => handleDelete(e, category.id, category.name)}
                    className="flex items-center justify-center space-x-2 text-red-600 hover:text-red-800 hover:bg-red-50 transition-all px-4 py-2.5 rounded-lg active:scale-95 touch-manipulation min-h-[44px]"
                  >
                    <TrashIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-100 via-secondary-100 to-accent-100 rounded-full mb-6 shadow-dreamy">
              <span className="text-5xl">🎀</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No categories yet</h3>
            <p className="text-gray-600 mb-6">Create your first category to organize your handcrafts</p>
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              Create First Category
            </button>
          </div>
        )}

        {/* Add Category Modal */}
        {showAddModal && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddModal(false);
                setFormData({ name: '', slug: '', description: '', image_url: '' });
              }
            }}
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-dreamy border border-primary-100 animate-slide-up max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-1">Add New Category</h2>
                  <p className="text-gray-600 text-sm">Create a new category for your handcrafts</p>
                </div>
                <span className="text-4xl">🎨</span>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Tufted Rugs, Embroidered Pillows"
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                      setFormData({ ...formData, name, slug });
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Slug * <span className="text-gray-400 font-normal text-xs">(auto-generated)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., tufted-rugs"
                    className="input-field bg-gray-50"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe this category and what makes it special..."
                    className="input-field"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  label="Category Image"
                  required={false}
                />
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <button 
                    type="submit" 
                    className="btn-primary flex-1 min-h-[44px] touch-manipulation"
                  >
                    ✨ Create Category
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowAddModal(false);
                      setFormData({ name: '', slug: '', description: '', image_url: '' });
                    }} 
                    className="btn-secondary flex-1 min-h-[44px] touch-manipulation"
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