import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Noosh Tufts - Tufted & Embroidered Handcrafts',
  description: 'Discover authentic handcrafted treasures. Each piece lovingly tufted and embroidered by artisan hands.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div className="pt-20">
          {children}
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
