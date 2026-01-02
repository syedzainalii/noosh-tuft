'use client';

import Link from 'next/link';
import { EnvelopeIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    /* Updated background to the vibrant purplish-pink mesh style */
    <footer className="relative overflow-hidden bg-[#d6336c] bg-[radial-gradient(at_top_right,_#f06292_0%,_#862e9c_50%,_#a61e4d_100%)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand Section */}
          <div>
            {/* Title: Made white to stand out clearly */}
            <h3 className="text-2xl font-bold mb-4 text-white">
              Noosh Tufts
            </h3>
            <p className="text-pink-100 mb-4">
              Handcrafted tufted & embroidered art pieces made with love and care.
            </p>
            <div className="flex items-center gap-2 text-white">
              <EnvelopeIcon className="h-5 w-5 text-pink-200" />
              <a 
                href="mailto:noosh.tufts@gmail.com"
                className="hover:text-white transition-colors underline underline-offset-4 decoration-pink-300/40"
              >
                noosh.tufts@gmail.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-pink-100/90 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/handcrafts" className="text-pink-100/90 hover:text-white transition-colors">
                  Our Handcrafts
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-pink-100/90 hover:text-white transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-pink-100/90 hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-pink-100/90 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Customer Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/orders" className="text-pink-100/90 hover:text-white transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-pink-100/90 hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-pink-100/90 hover:text-white transition-colors">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-pink-100/70 text-sm">
              © {currentYear} Noosh Tufts. All rights reserved.
            </p>
            <p className="text-pink-100/70 text-sm flex items-center gap-1">
              Made with <HeartIcon className="h-4 w-4 text-white fill-white" /> for handcraft lovers
            </p>
          </div>
        </div>
      </div>

      {/* Background soft glow - mimics the image light effect */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 blur-[100px] rounded-full pointer-events-none"></div>
    </footer>
  );
}