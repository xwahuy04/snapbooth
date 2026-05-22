'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { buildPhotoFilterCss } from '@/lib/filter-utils'
import { FILTERS } from '@/lib/data'
import type { EditorAdjustments } from '@/types'

interface FilterPanelProps {
  activeFilterId: string
  previewDataUrl?: string
  adjustments?: EditorAdjustments
  onSelect: (id: string) => void
  spacious?: boolean
}

export default function FilterPanel({
  activeFilterId,
  previewDataUrl,
  adjustments,
  onSelect,
  spacious,
}: FilterPanelProps) {
  return (
    <div
      className={cn(
        'grid gap-3',
        spacious
          ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4'
          : 'grid-cols-3 gap-2.5'
      )}
    >
      {FILTERS.map((f) => {
        const active = f.id === activeFilterId
        const css = buildPhotoFilterCss(f.id, adjustments)
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onSelect(f.id)}
            className={cn(
              'flex flex-col items-center gap-2 rounded-2xl p-2.5 transition-all active:scale-[0.98] sm:p-3',
              spacious && 'gap-2.5 sm:p-3.5',
              active ? 'option-card-active' : 'option-card'
            )}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-800/50">
              {previewDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewDataUrl}
                  alt={f.name}
                  className="h-full w-full object-cover"
                  style={{ filter: css !== 'none' ? css : undefined }}
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-xl sm:text-2xl"
                  style={{ filter: css !== 'none' ? css : undefined }}
                >
                  {f.preview}
                </div>
              )}
              {active && (
                <div className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent shadow-sm">
                  <Check size={10} className="text-white" />
                </div>
              )}
            </div>
            <span
              className={cn(
                'font-medium',
                spacious ? 'text-xs' : 'text-[11px]',
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
