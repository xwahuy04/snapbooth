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
  const activeTheme = THEMES.find((t) => t.id === selectedThemeId)!

  return (
    <div className="flex flex-col gap-6">
      {/* Layout picker */}
      <div>
        <h3 className="font-mono text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
          LAYOUT FOTO
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {LAYOUTS.map((layout) => {
            const active = layout.id === selectedLayout.id
            return (
              <button
                key={layout.id}
                onClick={() => onSelectLayout(layout)}
                className="card p-3 flex flex-col items-center gap-1.5 transition-all hover:scale-105 active:scale-100"
                style={{
                  borderColor: active ? activeTheme.accentColor : undefined,
                  boxShadow: active ? `0 0 0 1px ${activeTheme.accentColor}` : undefined,
                  background: active ? `${activeTheme.accentColor}11` : undefined,
                }}
              >
                <span className="text-xl">{layout.icon}</span>
                <span className="font-mono text-[10px]" style={{ color: active ? activeTheme.accentColor : 'var(--text-secondary)' }}>
                  {layout.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Theme picker */}
      <div>
        <h3 className="font-mono text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
          PILIH TEMA
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map((theme) => {
            const active = theme.id === selectedThemeId
            return (
              <button
                key={theme.id}
                onClick={() => onSelectTheme(theme.id)}
                className="card flex items-center gap-3 p-3 text-left transition-all hover:scale-[1.02] active:scale-100 relative overflow-hidden"
                style={{
                  borderColor: active ? theme.accentColor : undefined,
                  boxShadow: active ? `0 0 0 1px ${theme.accentColor}, inset 0 0 30px ${theme.accentColor}08` : undefined,
                }}
              >
                {/* Color swatch */}
                <div
                  className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-lg"
                  style={{ background: theme.previewColor, border: `3px solid ${theme.accentColor}` }}
                >
                  {theme.emoji}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                    {theme.name}
                  </div>
                  <div className="font-mono text-[10px] truncate" style={{ color: 'var(--text-secondary)' }}>
                    {theme.description}
                  </div>
                </div>

                {/* Active check */}
                {active && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: theme.accentColor }}
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
