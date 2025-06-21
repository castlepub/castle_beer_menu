import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Castle Beer Menu',
  description: 'Live beer menu for The Castle',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Add Silk browser zoom adjustment
  React.useEffect(() => {
    if (typeof window !== 'undefined' && navigator.userAgent.includes('Silk')) {
      document.body.style.zoom = '0.6';
    }
  }, []);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
} 