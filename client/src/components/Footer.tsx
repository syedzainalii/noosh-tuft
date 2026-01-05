'use client';

import Link from 'next/link';
// Removed PhoneIcon from imports
import { EnvelopeIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-pink-50 via-rose-100 to-pink-200 text-gray-800 border-t border-pink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="flex flex-col">
                          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Noosh Tufts
            </h3>
            <p className="text-gray-600 mb-6">
              Handcrafted tufted & embroidered art pieces made with love and care.
            </p>
            
            {/* Contact Details */}
            <div className="space-y-4">

              <div className="flex items-center gap-3 ">
                <EnvelopeIcon className="h-5 w-5" />
                <a 
                  href="mailto:noosh.tufts@gmail.com"
                  className="hover:text-pink-600 transition-colors underline underline-offset-4 decoration-white/20"
                >
                  noosh.tufts@gmail.com
                </a>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-xs uppercase tracking-wider text-gray-600 mb-2 font-semibold">
                  Contact for Website Development
                </p>
                <div className="flex items-center gap-3">
                  {/* WhatsApp SVG Icon */}
                  <svg 
                    className="h-5 w-5 text-green-600 fill-current" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <a 
                    href="https://wa.me/923002678500"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-pink-500 transition-colors font-medium"
                  >
                    +92 300 2678500
                  </a>
                </div>
              </div>
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