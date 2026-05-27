import type { ReactNode } from 'react'
import BackgroundOrbs from '@/components/layout/BackgroundOrbs'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Photobooth Online — Frame & Filter Gratis',
  path: '/',
})

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[var(--bg-primary)]">
      <BackgroundOrbs />
      {children}
    </div>
  )
}
