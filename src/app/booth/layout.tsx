'use client'

import type { ReactNode } from 'react'
import BoothHeader from '@/components/booth/BoothHeader'
import { PhotoBoothProvider } from '@/providers/PhotoBoothProvider'

export default function BoothLayout({ children }: { children: ReactNode }) {
  return (
    <PhotoBoothProvider>
      <div className="flex min-h-screen flex-col bg-surface">
        <BoothHeader />
        {children}
      </div>
    </PhotoBoothProvider>
  )
}
