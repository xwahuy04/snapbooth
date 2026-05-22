'use client'

import { cn } from '@/lib/cn'
import { BACKGROUNDS } from '@/lib/backgrounds'
import type { StripBackground } from '@/types'

interface BackgroundPanelProps {
  selectedId: string
  onChange: (id: string) => void
}

export default function BackgroundPanel({ selectedId, onChange }: BackgroundPanelProps) {
  const selected = BACKGROUNDS.find((bg) => bg.id === selectedId)

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs leading-relaxed text-muted">
        Pilih latar belakang yang indah untuk strip foto Anda. Kombinasikan dengan tema untuk hasil maksimal.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {BACKGROUNDS.map((bg) => (
          <button
            key={bg.id}
            type="button"
            onClick={() => onChange(bg.id)}
            className={cn(
              'group relative overflow-hidden rounded-xl border-2 p-3 transition-all duration-200',
              selectedId === bg.id
                ? 'border-accent bg-accent-soft shadow-glow'
                : 'border-border bg-surface-card hover:border-border-strong'
            )}
            title={bg.description}
          >
            {/* Background Preview */}
            <div
              className="absolute inset-0 opacity-100"
              style={{
                background: bg.value,
                backgroundSize: bg.type === 'pattern' ? '20px 20px' : 'auto',
              }}
            />

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-1">
              {bg.emoji && <span className="text-lg">{bg.emoji}</span>}
              <span className="text-[10px] font-semibold text-black/70 drop-shadow-sm">{bg.name}</span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="rounded-xl border border-border bg-surface-card p-3">
          <p className="text-xs text-muted">{selected.description}</p>
          <p className="mt-1 text-[10px] font-mono text-subtle">{selected.value}</p>
        </div>
      )}
    </div>
  )
}
