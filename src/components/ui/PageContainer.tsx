import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'

type PageContainerSize = 'default' | 'narrow' | 'wide' | 'full'

const sizeClass: Record<PageContainerSize, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-5xl',
  wide: 'max-w-6xl',
  full: 'max-w-[90rem]',
}

interface PageContainerProps {
  children: ReactNode
  size?: PageContainerSize
  className?: string
  center?: boolean
}

export default function PageContainer({
  children,
  size = 'default',
  className,
  center = true,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-5 py-8 sm:px-8 sm:py-10 lg:px-10',
        sizeClass[size],
        center && 'flex flex-col',
        className
      )}
    >
      {children}
    </div>
  )
}
