'use client'

import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { THEMES, THEME_CATEGORIES } from '@/lib/data'
import type { ThemeCategory } from '@/types'

interface ThemePickerProps {
  selectedThemeId: string
  onSelectTheme: (id: string) => void
}

export default function ThemePicker({ selectedThemeId, onSelectTheme }: ThemePickerProps) {
  const [category, setCategory] = useState<ThemeCategory | 'all'>('all')

  const filtered = useMemo(() => {
    if (category === 'all') return THEMES
    return THEMES.filter((t) => t.category === category)
  }, [category])

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="section-label">Pilih Tema</h3>
        <span className="text-xs font-semibold text-muted">{THEMES.length} tema</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {THEME_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all',
              category === cat.id
                ? 'border-accent-ring bg-accent-soft text-accent-light'
                : 'border-border bg-surface-raised text-muted hover:text-foreground'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid max-h-[420px] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 sm:gap-4">
        {filtered.map((theme) => {
          const active = theme.id === selectedThemeId
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme.id)}
              className={cn(
                'flex items-center gap-3 rounded-2xl p-3.5 text-left sm:gap-4 sm:p-4',
                active ? 'option-card-active' : 'option-card'
              )}
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg shadow-inner sm:h-12 sm:w-12"
                style={{
                  background: theme.previewColor,
                  border: `1px solid ${theme.accentColor}44`,
                }}
              >
                {theme.emoji}
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-sm font-bold text-foreground">
                  {theme.name}
                </div>
                <div className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted">
                  {theme.description}
                </div>
              </div>

              <div
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent transition-all',
                  active ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                )}
              >
                <Check size={12} className="text-white" />
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
