import Link from 'next/link'
import { Camera } from 'lucide-react'
import type { ReactNode } from 'react'

interface SiteHeaderProps {
  action?: ReactNode
}

export default function SiteHeader({ action }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent shadow-glow">
            <Camera size={17} className="text-white" />
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
            Snap<span className="text-accent-light">Booth</span>
          </span>
        </Link>
        {action}
      </div>
    </header>
  )
}
