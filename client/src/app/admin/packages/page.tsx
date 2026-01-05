'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string;
  is_popular: boolean;
  is_active: boolean;
  order_index: number;
  button_text: string;
  button_link: string;
  icon: string;
  color_scheme: string;
}

export default function AdminPackages() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration: '',
    features: '',
    is_popular: false,
    is_active: true,
    order_index: 0,
    button_text: 'Get Started',
    button_link: '',
    icon: '⚡',
    color_scheme: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchPackages();
  }, [user, router]);

  const fetchPackages = async () => {
    try {
      const response = await api.get('/api/packages/all');
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPackage) {
        await api.put(`/api/packages/${editingPackage.id}`, formData);
        toast.success('Package updated successfully!');
      } else {
        await api.post('/api/packages/', formData);
        toast.success('Package created successfully!');
      }
      fetchPackages();
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Error saving package');
    }
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description || '',
      price: pkg.price,
      duration: pkg.duration || '',
      features: pkg.features || '',
      is_popular: pkg.is_popular,
      is_active: pkg.is_active,
      order_index: pkg.order_index,
      button_text: pkg.button_text,
      button_link: pkg.button_link || '',
      icon: pkg.icon || '⚡',
      color_scheme: pkg.color_scheme || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    try {
      await api.delete(`/api/packages/${id}`);
      toast.success('Package deleted successfully!');
      fetchPackages();
    } catch (error) {
      toast.error('Error deleting package');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration: '',
      features: '',
      is_popular: false,
      is_active: true,
      order_index: 0,
      button_text: 'Get Started',
      button_link: '',
      icon: '⚡',
      color_scheme: ''
    });
    setEditingPackage(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Manage Packages</h1>
            <p className="text-text-secondary">Create and manage pricing packages for your site</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            {showForm ? 'Cancel' : 'Add Package'}
          </button>
        </div>

        {showForm && (
          <div className="card-glass mb-8">
            <h2 className="text-2xl font-bold mb-6 gradient-text">
              {editingPackage ? 'Edit Package' : 'Create New Package'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Package Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Icon (Emoji)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="input-field"
                    placeholder="⚡"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="input-field"
                    placeholder="per month"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Button Text</label>
                  <input
                    type="text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Button Link</label>
                  <input
                    type="text"
                    value={formData.button_link}
                    onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                    className="input-field"
                    placeholder="/contact"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Order Index</label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Features (one per line)</label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="input-field"
                  rows={5}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_popular}
                    onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                    className="w-5 h-5 rounded bg-bg-tertiary border-2 border-cyan-500"
                  />
                  <span className="text-sm font-medium">Mark as Popular</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5 rounded bg-bg-tertiary border-2 border-cyan-500"
                  />
                  <span className="text-sm font-medium">Active</span>
                </label>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn-primary">
                  {editingPackage ? 'Update Package' : 'Create Package'}
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`card-glass ${pkg.is_popular ? 'border-purple-500' : ''}`}>
              {pkg.is_popular && (
                <div className="flex items-center gap-2 mb-4">
                  <SparklesIcon className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-bold text-purple-500">POPULAR</span>
                </div>
              )}
              
              <div className="text-4xl mb-4">{pkg.icon}</div>
              <h3 className="text-2xl font-bold mb-2 gradient-text">{pkg.name}</h3>
              <p className="text-text-secondary text-sm mb-4">{pkg.description}</p>
              
              <div className="mb-4">
                <span className="text-4xl font-bold text-cyan-400">₹{pkg.price}</span>
                {pkg.duration && <span className="text-text-tertiary ml-2">/ {pkg.duration}</span>}
              </div>

              {pkg.features && (
                <div className="mb-6 space-y-2">
                  {pkg.features.split('\n').filter(f => f.trim()).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-500 mt-1">✓</span>
                      <span className="text-sm text-text-secondary">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(pkg)}
                  className="flex-1 btn-secondary flex items-center justify-center gap-2"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="flex-1 btn-accent flex items-center justify-center gap-2"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete
                </button>
              </div>

              <div className="mt-4 flex gap-4 text-xs text-text-tertiary">
                <span>Order: {pkg.order_index}</span>
                <span>{pkg.is_active ? '✓ Active' : '✗ Inactive'}</span>
              </div>
            </div>
          ))}
        </div>

        {packages.length === 0 && !showForm && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-xl text-text-secondary mb-6">No packages yet</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Create Your First Package
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
