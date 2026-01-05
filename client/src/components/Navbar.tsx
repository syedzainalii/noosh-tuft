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
        ? 'backdrop-blur-xl border-b border-cyan-500/20' 
        : 'backdrop-blur-lg'
    }`}
    style={{
      background: scrolled 
        ? 'linear-gradient(135deg, rgba(18, 18, 26, 0.95), rgba(26, 26, 38, 0.95))'
        : 'linear-gradient(135deg, rgba(18, 18, 26, 0.8), rgba(26, 26, 38, 0.8))'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300 glow-cyan">
                <HeartIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-bold gradient-text">
                  NexGen Web
                </span>
                <span className="hidden sm:block text-[9px] text-text-tertiary font-medium tracking-wide -mt-1 max-w-[180px]">Premium Website Development</span>
              </div>
            </Link>
          </div>
            
          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-2">
            <Link 
              href="/" 
              className="px-5 py-2.5 rounded-xl text-text-primary hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all duration-300 font-medium"
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="px-5 py-2.5 rounded-xl text-text-primary hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all duration-300 font-medium"
            >
              Shop All
            </Link>
            <Link 
              href="/categories" 
              className="px-5 py-2.5 rounded-xl text-text-primary hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all duration-300 font-medium"
            >
              Categories
            </Link>
            <Link 
              href="/services" 
              className="px-5 py-2.5 rounded-xl text-text-primary hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all duration-300 font-medium"
            >
              Services
            </Link>
            <Link 
              href="/about" 
              className="px-5 py-2.5 rounded-xl text-text-primary hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all duration-300 font-medium"
            >
              About Us
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link href="/cart" className="relative p-3 rounded-xl hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all duration-300 group">
                  <ShoppingCartIcon className="h-6 w-6 text-text-primary group-hover:text-cyan-400 transition-colors" />
                  {items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-br from-pink-500 to-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold glow-pink animate-scale-in">
                      {items.length}
                    </span>
                  )}
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all duration-300">
                    <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center glow-cyan">
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-text-primary font-semibold text-sm">{user?.full_name}</span>
                  </button>
                  <div className="absolute right-0 mt-3 w-60 backdrop-blur-xl rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-cyan-500/30"
                       style={{background: 'linear-gradient(135deg, rgba(18, 18, 26, 0.98), rgba(26, 26, 38, 0.98))'}}>
                    <Link
                      href="/profile"
                      className="block px-5 py-3 text-sm text-text-primary hover:bg-cyan-500/10 hover:text-cyan-400 transition-all mx-3 rounded-xl font-medium"
                    >
                      ✨ My Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-5 py-3 text-sm text-text-primary hover:bg-cyan-500/10 hover:text-cyan-400 transition-all mx-3 rounded-xl font-medium"
                    >
                      💝 My Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="block px-5 py-3 text-sm text-text-primary hover:bg-purple-500/10 hover:text-purple-400 transition-all mx-3 rounded-xl font-medium"
                      >
                        👑 Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-2 border-cyan-500/20 mx-3" />
                    <button
                      onClick={logout}
                      className="block w-full text-left px-5 py-3 text-sm text-pink-400 hover:bg-pink-500/10 transition-all mx-3 rounded-xl font-medium"
                    >
                      👋 Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="px-5 py-2.5 text-text-primary hover:text-cyan-400 font-semibold transition-all duration-300 rounded-xl hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30">
                  Sign In
                </Link>
                <Link href="/register" className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold glow-cyan transition-all duration-300 transform hover:scale-105">
                  Join Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <Link href="/cart" className="relative p-2">
                <ShoppingCartIcon className="h-6 w-6 text-text-primary" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-br from-pink-500 to-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold glow-pink">
                    {items.length}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all"
            >
              <Bars3Icon className="h-6 w-6 text-text-primary" />
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
                href="/categories"
                className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600 rounded-xl transition-all font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                🎨 Categories
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