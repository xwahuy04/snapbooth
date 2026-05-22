import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'

interface StepHeaderProps {
  title: string
  description?: ReactNode
  align?: 'left' | 'center'
  action?: ReactNode
  className?: string
}

export default function StepHeader({
  title,
  description,
  align = 'left',
  action,
  className,
}: StepHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'text-center sm:flex-col sm:items-center',
        className
      )}
    >
      <div className={cn('space-y-2', align === 'center' && 'mx-auto')}>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-base">{description}</p>
        )}
      </div>
      {action}
    </header>
  )
}
