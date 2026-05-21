'use client'

import { Check } from 'lucide-react'
import { FILTERS } from '@/lib/data'
import type { FrameTheme } from '@/types'

interface FilterPanelProps {
  activeFilterId: string
  theme: FrameTheme
  previewDataUrl?: string
  onSelect: (id: string) => void
}

export default function FilterPanel({ activeFilterId, theme, previewDataUrl, onSelect }: FilterPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="section-label text-xs md:text-sm">Filter Foto</h3>
      <div className="grid grid-cols-3 gap-2.5">
        {FILTERS.map((f) => {
          const active = f.id === activeFilterId
          return (
            <button
              key={f.id}
              onClick={() => onSelect(f.id)}
              className="flex flex-col items-center gap-2 p-2.5 rounded-xl transition-all hover:shadow-md active:scale-[0.98]"
              style={{
                background: active ? 'var(--accent-blue-50)' : 'var(--bg-card)',
                border: active ? '2px solid var(--accent-blue)' : '2px solid var(--border)',
                boxShadow: active ? 'var(--shadow-blue)' : 'var(--shadow-xs)',
              }}
            >
              <div className="w-full rounded-lg overflow-hidden relative" style={{ aspectRatio: '4/3', background: '#f1f5f9' }}>
                {previewDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewDataUrl} alt={f.name} className="w-full h-full object-cover"
                    style={{ filter: f.css !== 'none' ? f.css : undefined }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl"
                    style={{ filter: f.css !== 'none' ? f.css : undefined }}>
                    {f.preview}
                  </div>
                )}
                {active && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--accent-blue)', boxShadow: 'var(--shadow-sm)' }}>
                    <Check size={9} className="text-white" />
                  </div>
                )}
              </div>
              <span className="text-[11px] md:text-xs font-medium"
                style={{ color: active ? 'var(--accent-blue)' : 'var(--text-secondary)' }}>
                {f.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
