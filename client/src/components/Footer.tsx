'use client';

import Link from 'next/link';
import { EnvelopeIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    /* Purplish-Pink Mesh Gradient */
    <footer className="relative overflow-hidden bg-[#862e9c] bg-[radial-gradient(at_top_right,_#d6336c_0%,_#862e9c_50%,_#4c061d_100%)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">
              Noosh Tufts
            </h3>
            <p className="text-purple-100/90 mb-4">
              Handcrafted tufted & embroidered art pieces made with love and care.
            </p>
            <div className="flex items-center gap-2 text-white">
              <EnvelopeIcon className="h-5 w-5 text-pink-300" />
              <a 
                href="mailto:noosh.tufts@gmail.com"
                className="hover:text-pink-200 transition-colors font-medium underline underline-offset-4 decoration-white/20"
              >
                noosh.tufts@gmail.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'Home', href: '/' },
                { name: 'Our Handcrafts', href: '/handcrafts' },
                { name: 'Shop All', href: '/products' },
                { name: 'Categories', href: '/categories' },
                { name: 'About Us', href: '/about' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-purple-100/80 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-lg font-bold mb-4">Customer Support</h4>
            <ul className="space-y-2">
              {[
                { name: 'My Orders', href: '/orders' },
                { name: 'Shopping Cart', href: '/cart' },
                { name: 'My Profile', href: '/profile' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-purple-100/80 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-purple-200/60 text-sm">
              © {currentYear} Noosh Tuft. All rights reserved.
            </p>
            <p className="text-purple-200/60 text-sm flex items-center gap-1">
              Made with <HeartIcon className="h-4 w-4 text-pink-400 fill-pink-400" /> for handcraft lovers
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Blur Glows (mimics the image background) */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-500/30 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-400/20 blur-[100px] rounded-full pointer-events-none"></div>
    </footer>
  );
}