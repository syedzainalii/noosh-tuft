/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Keep your existing domains and add your production domain
    domains: [
      'localhost', 
      'images.unsplash.com', 
      'via.placeholder.com',
      'noosh-tuft-backend.vercel.app', // Add your actual Vercel project domain here
    ],
  },
  // Keep your rewrites here as well if you added them earlier
}

module.exports = nextConfig
