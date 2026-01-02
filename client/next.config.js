/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    // Legacy domains support
    domains: [
      'localhost', 
      'images.unsplash.com', 
      'via.placeholder.com',
      'noosh-tuft-backend.vercel.app',
    ],
  },
}

module.exports = nextConfig
