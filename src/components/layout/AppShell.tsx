import Link from 'next/link'
import { Camera } from 'lucide-react'
import type { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
  headerAction?: ReactNode
}

export default function AppShell({ children, headerAction }: AppShellProps) {
  return (
    <div className="page-shell bg-surface">
      <header className="site-header">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent shadow-glow">
              <Camera size={14} className="text-white" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              SnapBooth
            </span>
          </Link>
          {headerAction}
        </div>
      </header>

      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  )
}
