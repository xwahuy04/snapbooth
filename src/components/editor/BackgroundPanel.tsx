'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import { BACKGROUNDS, BACKGROUND_CATEGORIES } from '@/lib/backgrounds'
import type { BackgroundCategory, StripBackground } from '@/types'

interface BackgroundPanelProps {
  selectedId: string
  onChange: (id: string) => void
}

export default function BackgroundPanel({ selectedId, onChange }: BackgroundPanelProps) {
  const [activeCategory, setActiveCategory] = useState<BackgroundCategory | 'all'>('all')

  const filtered: StripBackground[] =
    activeCategory === 'all'
      ? BACKGROUNDS
      : BACKGROUNDS.filter((bg) => bg.category === activeCategory)

  const selected = BACKGROUNDS.find((bg) => bg.id === selectedId)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs leading-relaxed text-muted">
        Pilih latar belakang untuk strip foto Anda. Kombinasikan dengan tema untuk hasil maksimal.
      </p>

      {/* Category filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={cn(
            'shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all',
            activeCategory === 'all'
              ? 'border-accent-ring bg-accent-soft text-accent-light'
              : 'border-border bg-surface-raised text-muted hover:text-foreground'
          )}
        >
          🎨 Semua
        </button>
        {BACKGROUND_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all',
              activeCategory === cat.id
                ? 'border-accent-ring bg-accent-soft text-accent-light'
                : 'border-border bg-surface-raised text-muted hover:text-foreground'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Background grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {filtered.map((bg) => (
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
          <p className="mt-1 text-[10px] font-mono text-subtle">{selected.value.slice(0, 60)}{selected.value.length > 60 ? '…' : ''}</p>
        </div>
      )}
    </div>
  )
}
