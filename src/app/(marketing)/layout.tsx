import type { ReactNode } from 'react'
import BackgroundOrbs from '@/components/layout/BackgroundOrbs'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[var(--bg-primary)]">
      <BackgroundOrbs />
      {children}
    </div>
  )
}
