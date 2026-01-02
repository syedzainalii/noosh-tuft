'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  HeartIcon,
  HomeIcon,
  SparklesIcon,
  Squares2X2Icon,
  ShoppingBagIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { Category } from '@/types';
import api from '@/lib/api';

export default function Sidebar() {
  const { user, isAuthenticated, logout, fetchUser } = useAuthStore();
  const { items, fetchCart } = useCartStore();
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategories, setShowCategories] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-white via-pearl-50/50 to-white border-r border-primary-100/50 shadow-dreamy overflow-y-auto z-50">
      {/* Logo */}
      <div className="p-6 border-b border-primary-100/50">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative w-14 h-14 bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300 shadow-glow">
            <HeartIcon className="h-7 w-7 text-white animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-300 to-secondary-300 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
              Noosh Tuft
            </span>
            <span className="text-[8px] text-gray-500 font-medium leading-tight">
              Tufted & Embroidered<br/>Handcrafts
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {/* Home */}
        <Link
          href="/"
          className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
            isActive('/') 
              ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-600 font-semibold' 
              : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-secondary-50/50'
          }`}
        >
          <HomeIcon className="h-5 w-5" />
          <span>Home</span>
        </Link>

        {/* Handcrafts Process */}
        <Link
          href="/handcrafts"
          className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
            isActive('/handcrafts') 
              ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-600 font-semibold' 
              : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-secondary-50/50'
          }`}
        >
          <SparklesIcon className="h-5 w-5" />
          <span>Our Handcrafts</span>
        </Link>

        {/* All Products */}
        <Link
          href="/products"
          className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
            isActive('/products') 
              ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-600 font-semibold' 
              : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-secondary-50/50'
          }`}
        >
          <ShoppingBagIcon className="h-5 w-5" />
          <span>All Products</span>
        </Link>

        {/* Categories Dropdown */}
        <div>
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="flex items-center justify-between w-full px-4 py-3 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-secondary-50/50 transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <Squares2X2Icon className="h-5 w-5" />
              <span>Categories</span>
            </div>
            {showCategories ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>
          
          {showCategories && (
            <div className="ml-4 mt-1 space-y-1 animate-slide-down">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="flex items-center space-x-3 px-4 py-2 rounded-xl text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50/50 transition-all duration-300"
                  >
                    <span className="text-lg">🎨</span>
                    <span>{category.name}</span>
                  </Link>
                ))
              ) : (
                <p className="px-4 py-2 text-xs text-gray-400 italic">No categories yet</p>
              )}
            </div>
          )}
        </div>

        {/* Cart */}
        {isAuthenticated && (
          <Link
            href="/cart"
            className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 ${
              isActive('/cart') 
                ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-600 font-semibold' 
                : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-secondary-50/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <ShoppingCartIcon className="h-5 w-5" />
              <span>Cart</span>
            </div>
            {items.length > 0 && (
              <span className="bg-gradient-to-br from-primary-500 to-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {items.length}
              </span>
            )}
          </Link>
        )}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent border-t border-primary-100/50">
        {isAuthenticated ? (
          <div>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-2xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.full_name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </button>

            {showUserMenu && (
              <div className="mt-2 space-y-1 animate-slide-down">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 rounded-xl transition-all"
                >
                  ✨ Profile
                </Link>
                <Link
                  href="/orders"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 rounded-xl transition-all"
                >
                  💝 Orders
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 rounded-xl transition-all"
                  >
                    👑 Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-accent-600 hover:bg-accent-50 rounded-xl transition-all"
                >
                  👋 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Link
              href="/login"
              className="block text-center px-4 py-2.5 text-gray-700 hover:text-primary-600 font-semibold transition-all duration-300 rounded-full hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="block text-center px-4 py-2.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 text-white rounded-full font-semibold hover:shadow-glow transition-all duration-300"
            >
              Join Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
