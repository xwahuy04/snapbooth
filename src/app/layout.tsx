import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SnapBooth — Photo Studio',
  description: 'Take stunning photo strips with custom frames and filters',
  keywords: ['photobooth', 'photo strip', 'selfie', 'frame'],
  openGraph: {
    title: 'SnapBooth',
    description: 'Take stunning photo strips with custom frames and filters',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}
