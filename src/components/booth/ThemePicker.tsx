'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { THEMES } from '@/lib/data'

interface ThemePickerProps {
  selectedThemeId: string
  onSelectTheme: (id: string) => void
}

export default function ThemePicker({ selectedThemeId, onSelectTheme }: ThemePickerProps) {
  return (
    <section className="flex flex-col gap-5">
      <h3 className="section-label">Pilih Tema</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {THEMES.map((theme) => {
          const active = theme.id === selectedThemeId
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme.id)}
              className={cn(
                'flex items-center gap-4 rounded-2xl p-4 text-left sm:p-5',
                active ? 'option-card-active' : 'option-card'
              )}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl shadow-inner sm:h-14 sm:w-14"
                style={{
                  background: theme.previewColor,
                  border: `1px solid ${theme.accentColor}40`,
                }}
              >
                {theme.emoji}
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-[15px] font-bold text-foreground sm:text-base">
                  {theme.name}
                </div>
                <div className="mt-0.5 truncate text-xs font-medium text-muted sm:text-sm">
                  {theme.description}
                </div>
              </div>

              <div
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent transition-all duration-300',
                  active ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                )}
              >
                <Check size={14} className="text-white" />
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
