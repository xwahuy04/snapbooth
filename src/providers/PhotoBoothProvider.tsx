'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { usePhotoBooth, type UsePhotoBoothReturn } from '@/hooks/usePhotoBooth'

const PhotoBoothContext = createContext<UsePhotoBoothReturn | null>(null)

export function PhotoBoothProvider({ children }: { children: ReactNode }) {
  const value = usePhotoBooth()
  return <PhotoBoothContext.Provider value={value}>{children}</PhotoBoothContext.Provider>
}

export function usePhotoBoothContext(): UsePhotoBoothReturn {
  const ctx = useContext(PhotoBoothContext)
  if (!ctx) {
    throw new Error('usePhotoBoothContext must be used within PhotoBoothProvider')
  }
  return ctx
}
