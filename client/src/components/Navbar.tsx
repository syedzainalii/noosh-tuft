'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState, useRef } from 'react';
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon, HeartIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { user, isAuthenticated, logout, fetchUser } = useAuthStore();
  const { items, fetchCart } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-xl shadow-dreamy' 
        : 'bg-gradient-to-r from-white/70 via-pearl-50/70 to-white/70 backdrop-blur-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300 shadow-glow">
                <HeartIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary-300 to-secondary-300 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                  Noosh Tufts
                </span>
                <span className="hidden sm:block text-[9px] text-gray-400 font-medium tracking-wide -mt-1 max-w-[180px]">Tufted & Embroidered Handcrafts</span>
              </div>
            </Link>
          </div>
            
          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-2">
            <Link 
              href="/" 
              className="px-5 py-2.5 rounded-full text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-300 font-medium"
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="px-5 py-2.5 rounded-full text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-300 font-medium"
            >
              Shop All
            </Link>
            <Link 
              href="/handcrafts" 
              className="px-5 py-2.5 rounded-full text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-300 font-medium"
            >
              Handcraft Ideas
            </Link>
            <Link 
              href="/about" 
              className="px-5 py-2.5 rounded-full text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-300 font-medium"
            >
              About Us
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link href="/cart" className="relative p-3 rounded-full hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-300 group">
                  <ShoppingCartIcon className="h-6 w-6 text-gray-700 group-hover:text-primary-600 transition-colors" />
                  {items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-br from-primary-500 to-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-glow animate-scale-in">
                      {items.length}
                    </span>
                  )}
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-3 px-4 py-2.5 rounded-full hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-300">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 rounded-full flex items-center justify-center shadow-lg">
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-gray-700 font-semibold text-sm">{user?.full_name}</span>
                  </button>
                  <div className="absolute right-0 mt-3 w-60 bg-white/95 backdrop-blur-xl rounded-3xl shadow-dreamy py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-primary-100">
                    <Link
                      href="/profile"
                      className="block px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600 transition-all mx-3 rounded-2xl font-medium"
                    >
                      ✨ My Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600 transition-all mx-3 rounded-2xl font-medium"
                    >
                      💝 My Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="block px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600 transition-all mx-3 rounded-2xl font-medium"
                      >
                        👑 Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-2 border-gray-200 mx-3" />
                    <button
                      onClick={logout}
                      className="block w-full text-left px-5 py-3 text-sm text-accent-600 hover:bg-accent-50 transition-all mx-3 rounded-2xl font-medium"
                    >
                      👋 Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="px-5 py-2.5 text-gray-700 hover:text-primary-600 font-semibold transition-all duration-300 rounded-full hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50">
                  Sign In
                </Link>
                <Link href="/register" className="px-6 py-2.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 text-white rounded-full font-semibold hover:shadow-glow transition-all duration-300 transform hover:scale-105">
                  Join Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <Link href="/cart" className="relative p-2">
                <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-br from-primary-500 to-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {items.length}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-full hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all"
            >
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile menu */}
        <div
          ref={mobileMenuRef}
          className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                Menu
              </h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-all"
              >
                <XMarkIcon className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <Link
                href="/"
                className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600 rounded-xl transition-all font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                🏠 Home
              </Link>
              <Link
                href="/products"
                className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600 rounded-xl transition-all font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                🛍️ Shop All
              </Link>

              <Link
                href="/handcrafts"
                className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600 rounded-xl transition-all font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                ✨ Handcraft Ideas
              </Link>
              <Link
                href="/about"
                className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600 rounded-xl transition-all font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                ℹ️ About Us
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/orders"
                    className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600 rounded-xl transition-all font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    💝 My Orders
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600 rounded-xl transition-all font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ✨ My Profile
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600 rounded-xl transition-all font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      👑 Admin Dashboard
                    </Link>
                  )}
                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-accent-600 hover:bg-accent-50 rounded-xl transition-all font-medium"
                  >
                    👋 Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600 rounded-xl transition-all font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-3 text-center bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 text-white rounded-xl font-semibold transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Join Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}