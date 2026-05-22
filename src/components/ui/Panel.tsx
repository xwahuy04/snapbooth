import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'

interface PanelProps {
  children: ReactNode
  title?: string
  description?: string
  className?: string
  spacious?: boolean
}

export default function Panel({ children, title, description, className, spacious }: PanelProps) {
  return (
    <section
      className={cn(
        'panel',
        spacious && 'panel-spacious',
        className
      )}
    >
      {(title || description) && (
        <div className="mb-5 space-y-1 border-b border-border pb-5 sm:mb-6 sm:pb-6">
          {title && <h2 className="font-display text-base font-bold text-foreground sm:text-lg">{title}</h2>}
          {description && <p className="text-sm leading-relaxed text-muted">{description}</p>}
        </div>
      )}
      {children}
    </section>
  )
}
