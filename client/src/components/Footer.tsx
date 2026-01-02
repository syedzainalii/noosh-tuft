'use client';

import Link from 'next/link';
import { EnvelopeIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    /* Mesh Gradient using colors from the image: Deep Berry to Hot Pink */
    <footer className="relative overflow-hidden bg-[#d6336c] bg-[radial-gradient(at_top_left,_#f06292_0%,_#d6336c_50%,_#a61e4d_100%)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">
              Noosh Tufts
            </h3>
            <p className="text-pink-100/90 mb-4">
              Handcrafted tufted & embroidered art pieces made with love and care.
            </p>
            <div className="flex items-center gap-2 text-white">
              <EnvelopeIcon className="h-5 w-5 text-pink-200" />
              <a 
                href="mailto:noosh.tufts@gmail.com"
                className="hover:text-pink-100 transition-colors font-medium underline underline-offset-4 decoration-pink-300/50"
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
                  <Link href={link.href} className="text-pink-50/80 hover:text-white transition-colors">
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
                  <Link href={link.href} className="text-pink-50/80 hover:text-white transition-colors">
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
            <p className="text-pink-100/70 text-sm">
              © {currentYear} Noosh Tuft. All rights reserved.
            </p>
            <p className="text-pink-100/70 text-sm flex items-center gap-1">
              Made with <HeartIcon className="h-4 w-4 text-white fill-white" /> for handcraft lovers
            </p>
          </div>
        </div>
      </div>

      {/* Subtle "glow" effect in the corner to mimic the image highlights */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-pink-400/20 blur-[100px] rounded-full pointer-events-none"></div>
    </footer>
  );
}