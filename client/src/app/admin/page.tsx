'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { DashboardStats } from '@/types';
import Link from 'next/link';
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CubeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user && user.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchStats();
  }, [isAuthenticated, user, router]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-8 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card">
                  <div className="bg-gray-300 h-16 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Admin Dashboard
            </span>
          </h1>
          <p className="text-xl text-gray-600">Manage your store and track performance</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="card-glass bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Total Orders</p>
                  <p className="text-4xl font-bold">{stats.total_orders}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <ShoppingBagIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="card-glass bg-gradient-to-br from-green-500 to-green-600 text-white border-none hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Total Revenue</p>
                  <p className="text-4xl font-bold">Rs {stats.total_revenue.toFixed(2)}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <CurrencyDollarIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="card-glass bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Total Customers</p>
                  <p className="text-4xl font-bold">{stats.total_customers}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <UserGroupIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="card-glass bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-1">Total Products</p>
                  <p className="text-4xl font-bold">{stats.total_products}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <CubeIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="card-glass bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-none hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium mb-1">Pending Orders</p>
                  <p className="text-4xl font-bold">{stats.pending_orders}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <ClockIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="card-glass bg-gradient-to-br from-red-500 to-red-600 text-white border-none hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium mb-1">Low Stock Alert</p>
                  <p className="text-4xl font-bold">{stats.low_stock_products}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <ExclamationTriangleIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin/products" className="group">
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 hover:border-primary-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="text-primary-600 font-bold text-lg mb-2 group-hover:text-primary-700">🛍️ Products</div>
                <p className="text-sm text-gray-600">View and edit products</p>
              </div>
            </Link>
            <Link href="/admin/categories" className="group">
              <div className="p-6 rounded-xl bg-gradient-to-br from-secondary-50 to-secondary-100 border-2 border-secondary-200 hover:border-secondary-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="text-secondary-600 font-bold text-lg mb-2 group-hover:text-secondary-700">🎨 Categories</div>
                <p className="text-sm text-gray-600">Organize your catalog</p>
              </div>
            </Link>
            <Link href="/admin/handcrafts" className="group">
              <div className="p-6 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-200 hover:border-pink-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="text-pink-600 font-bold text-lg mb-2 group-hover:text-pink-700">🧵 Handcrafts</div>
                <p className="text-sm text-gray-600">Process photos</p>
              </div>
            </Link>
            <Link href="/admin/orders" className="group">
              <div className="p-6 rounded-xl bg-gradient-to-br from-accent-50 to-accent-100 border-2 border-accent-200 hover:border-accent-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="text-accent-600 font-bold text-lg mb-2 group-hover:text-accent-700">📦 Orders</div>
                <p className="text-sm text-gray-600">Track and fulfill orders</p>
              </div>
            </Link>
            <Link href="/admin/hero-banner" className="group">
              <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="text-indigo-600 font-bold text-lg mb-2 group-hover:text-indigo-700">🖼️ Hero Banner</div>
                <p className="text-sm text-gray-600">Manage home page banner</p>
              </div>
            </Link>
            <Link href="/admin/about" className="group">
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="text-purple-600 font-bold text-lg mb-2 group-hover:text-purple-700">ℹ️ About Page</div>
                <p className="text-sm text-gray-600">Edit about us content</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
