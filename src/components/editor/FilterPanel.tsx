'use client'

import { Check } from 'lucide-react'
import { FILTERS } from '@/lib/data'
import type { FrameTheme } from '@/types'

interface FilterPanelProps {
  activeFilterId: string
  theme: FrameTheme
  previewDataUrl?: string     // first shot for live preview
  onSelect: (id: string) => void
}

export default function FilterPanel({
  activeFilterId,
  theme,
  previewDataUrl,
  onSelect,
}: FilterPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
        FILTER FOTO
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {FILTERS.map((f) => {
          const active = f.id === activeFilterId
          return (
            <button
              key={f.id}
              onClick={() => onSelect(f.id)}
              className="card p-2 flex flex-col items-center gap-1.5 transition-all hover:scale-[1.03] active:scale-100"
              style={{
                borderColor: active ? theme.accentColor : undefined,
                background: active ? `${theme.accentColor}11` : undefined,
              }}
            >
              {/* Preview thumbnail */}
              <div
                className="w-full rounded overflow-hidden relative"
                style={{ aspectRatio: '4/3', background: '#111' }}
              >
                {previewDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewDataUrl}
                    alt={f.name}
                    className="w-full h-full object-cover"
                    style={{ filter: f.css !== 'none' ? f.css : undefined }}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-xl"
                    style={{ filter: f.css !== 'none' ? f.css : undefined }}
                  >
                    {f.preview}
                  </div>
                )}
                {active && (
                  <div
                    className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: theme.accentColor }}
                  >
                    <Check size={9} className="text-white" />
                  </div>
                )}
              </div>
              <span
                className="font-mono text-[10px]"
                style={{ color: active ? theme.accentColor : 'var(--text-secondary)' }}
              >
                {f.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
