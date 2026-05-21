'use client'

import { Check } from 'lucide-react'
import type { FrameTheme, BoothLayout } from '@/types'
import { THEMES, LAYOUTS } from '@/lib/data'

interface ThemeSelectorProps {
  selectedThemeId: string
  selectedLayout: BoothLayout
  onSelectTheme: (id: string) => void
  onSelectLayout: (layout: BoothLayout) => void
}

export default function ThemeSelector({
  selectedThemeId,
  selectedLayout,
  onSelectTheme,
  onSelectLayout,
}: ThemeSelectorProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Layout picker */}
      <div>
        <h3 className="section-label mb-3">
          Layout Foto
        </h3>
        <div className="grid grid-cols-4 gap-2.5">
          {LAYOUTS.map((layout) => {
            const active = layout.id === selectedLayout.id
            return (
              <button
                key={layout.id}
                onClick={() => onSelectLayout(layout)}
                className="flex flex-col items-center gap-2 p-3.5 rounded-xl transition-all hover:shadow-md active:scale-[0.98]"
                style={{
                  background: active ? 'var(--accent-blue-50)' : 'var(--bg-secondary)',
                  border: active ? '2px solid var(--accent-blue)' : '2px solid var(--border)',
                  boxShadow: active ? 'var(--shadow-blue)' : 'var(--shadow-xs)',
                }}
              >
                <span className="text-xl">{layout.icon}</span>
                <span
                  className="text-[11px] font-medium"
                  style={{ color: active ? 'var(--accent-blue)' : 'var(--text-secondary)' }}
                >
                  {layout.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Theme picker */}
      <div>
        <h3 className="section-label mb-3">
          Pilih Tema
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {THEMES.map((theme) => {
            const active = theme.id === selectedThemeId
            return (
              <button
                key={theme.id}
                onClick={() => onSelectTheme(theme.id)}
                className="flex items-center gap-3 p-3.5 text-left rounded-xl transition-all hover:shadow-md active:scale-[0.98] relative overflow-hidden"
                style={{
                  background: active ? 'var(--accent-blue-50)' : 'var(--bg-card)',
                  border: active ? '2px solid var(--accent-blue)' : '2px solid var(--border)',
                  boxShadow: active ? 'var(--shadow-blue)' : 'var(--shadow-xs)',
                }}
              >
                {/* Color swatch */}
                <div
                  className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-lg"
                  style={{
                    background: theme.previewColor,
                    border: `2.5px solid ${theme.accentColor}`,
                    boxShadow: `0 2px 8px -2px ${theme.accentColor}44`,
                  }}
                >
                  {theme.emoji}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div
                    className="font-display font-semibold text-sm truncate"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {theme.name}
                  </div>
                  <div
                    className="text-[11px] truncate"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {theme.description}
                  </div>
                </div>

                {/* Active check */}
                {active && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--accent-blue)' }}
                  >
                    <Check size={11} className="text-white" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
