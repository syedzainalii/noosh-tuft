import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Noosh Tuft - Tufted & Embroidered Handcrafts',
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
        <Sidebar />
        <div className="ml-72">
          {children}
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
