'use client';

import Link from 'next/link';
import { EnvelopeIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    /* Changed background to a soft pink gradient and adjusted text to be readable on light/medium pink */
    <footer className="bg-gradient-to-br from-pink-50 via-rose-100 to-pink-200 text-gray-800 border-t border-pink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
              Noosh Tufts
            </h3>
            <p className="text-gray-600 mb-4">
              Handcrafted tufted & embroidered art pieces made with love and care.
            </p>
            <div className="flex items-center gap-2 text-gray-700">
              <EnvelopeIcon className="h-5 w-5 text-pink-500" />
              <a 
                href="mailto:noosh.tufts@gmail.com"
                className="hover:text-pink-600 transition-colors font-medium"
              >
                noosh.tufts@gmail.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-gray-800">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'Home', href: '/' },
                { name: 'Our Handcrafts', href: '/handcrafts' },
                { name: 'Shop All', href: '/products' },
                { name: 'Categories', href: '/categories' },
                { name: 'About Us', href: '/about' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:text-pink-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-gray-800">Customer Support</h4>
            <ul className="space-y-2">
              {[
                { name: 'My Orders', href: '/orders' },
                { name: 'Shopping Cart', href: '/cart' },
                { name: 'My Profile', href: '/profile' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:text-pink-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-pink-300/50 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} Noosh Tufts. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              Made with <HeartIcon className="h-4 w-4 text-rose-500 fill-rose-500" /> for handcraft lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}