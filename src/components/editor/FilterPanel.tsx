'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { FILTERS } from '@/lib/data'

interface FilterPanelProps {
  activeFilterId: string
  previewDataUrl?: string
  onSelect: (id: string) => void
  spacious?: boolean
}

export default function FilterPanel({
  activeFilterId,
  previewDataUrl,
  onSelect,
  spacious,
}: FilterPanelProps) {
  return (
    <div
      className={cn(
        'grid gap-3',
        spacious ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 sm:gap-4' : 'grid-cols-3 gap-2.5'
      )}
    >
      {FILTERS.map((f) => {
        const active = f.id === activeFilterId
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onSelect(f.id)}
            className={cn(
              'flex flex-col items-center gap-2.5 rounded-2xl p-3 transition-all active:scale-[0.98]',
              spacious && 'gap-3 p-3.5 sm:p-4',
              active ? 'option-card-active' : 'option-card'
            )}
          >
            <div
              className={cn(
                'relative w-full overflow-hidden rounded-xl bg-slate-200/90',
                spacious ? 'aspect-[4/3]' : 'aspect-[4/3]'
              )}
            >
              {previewDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewDataUrl}
                  alt={f.name}
                  className="h-full w-full object-cover"
                  style={{ filter: f.css !== 'none' ? f.css : undefined }}
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-2xl"
                  style={{ filter: f.css !== 'none' ? f.css : undefined }}
                >
                  {f.preview}
                </div>
              )}
              {active && (
                <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent shadow-sm">
                  <Check size={10} className="text-white" />
                </div>
              )}
            </div>
            <span
              className={cn(
                'font-medium',
                spacious ? 'text-xs sm:text-sm' : 'text-[11px] md:text-xs',
                active ? 'text-accent-light' : 'text-muted'
              )}
            >
              {f.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
