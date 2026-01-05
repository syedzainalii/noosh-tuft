'use client';

import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>NexGen Web - Premium Website Development</title>
        <meta name="description" content="Transform your digital presence with cutting-edge websites. Custom development, stunning designs, and unmatched performance." />
      </head>
      <body className={inter.className}>
        <Navbar />
        <div className="pt-20">
          {children}
        </div>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
