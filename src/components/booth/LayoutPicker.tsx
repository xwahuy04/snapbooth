'use client'

import { cn } from '@/lib/cn'
import type { BoothLayout } from '@/types'
import { LAYOUTS } from '@/lib/data'

interface LayoutPickerProps {
  selectedLayout: BoothLayout
  onSelectLayout: (layout: BoothLayout) => void
}

export default function LayoutPicker({ selectedLayout, onSelectLayout }: LayoutPickerProps) {
  return (
    <section className="flex flex-col gap-5">
      <h3 className="section-label">Layout Foto</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {LAYOUTS.map((layout) => {
          const active = layout.id === selectedLayout.id
          return (
            <button
              key={layout.id}
              type="button"
              onClick={() => onSelectLayout(layout)}
              className={cn(
                'flex flex-col items-center gap-3 rounded-2xl p-4 sm:p-5',
                active ? 'option-card-active' : 'option-card'
              )}
            >
              <span
                className={cn(
                  'text-2xl transition-transform duration-300 sm:text-3xl',
                  active ? 'scale-110 text-accent-light' : 'text-foreground group-hover:scale-110'
                )}
              >
                {layout.icon}
              </span>
              <span
                className={cn(
                  'text-[13px] font-semibold sm:text-sm',
                  active ? 'text-accent-light' : 'text-muted'
                )}
              >
                {layout.label}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
