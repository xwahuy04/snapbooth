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
    <div className="flex flex-col gap-10">
      {/* Layout picker */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold tracking-[0.15em] text-[var(--text-secondary)] uppercase ml-1">
          Layout Foto
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LAYOUTS.map((layout) => {
            const active = layout.id === selectedLayout.id
            return (
              <button
                key={layout.id}
                onClick={() => onSelectLayout(layout)}
                className="group relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 ease-out cursor-pointer hover:-translate-y-0.5"
                style={{
                  background: active ? 'var(--accent-blue-50)' : 'var(--bg-card)',
                  // Mengubah border dari 2px menjadi 1px agar jauh lebih elegan
                  border: active ? '1px solid var(--accent-blue)' : '1px solid var(--border)',
                  boxShadow: active ? 'var(--shadow-blue)' : 'var(--shadow-xs)',
                }}
              >
                <div 
                  className={`text-2xl transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}
                  style={{ color: active ? 'var(--accent-blue)' : 'var(--text-primary)' }}
                >
                  {layout.icon}
                </div>
                <span
                  className="text-[13px] font-semibold transition-colors"
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
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold tracking-[0.15em] text-[var(--text-secondary)] uppercase ml-1">
          Pilih Tema
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {THEMES.map((theme) => {
            const active = theme.id === selectedThemeId
            return (
              <button
                key={theme.id}
                onClick={() => onSelectTheme(theme.id)}
                className="group flex items-center gap-4 p-4 text-left rounded-2xl transition-all duration-300 ease-out cursor-pointer hover:-translate-y-0.5"
                style={{
                  background: active ? 'var(--accent-blue-50)' : 'var(--bg-card)',
                  border: active ? '1px solid var(--accent-blue)' : '1px solid var(--border)',
                  boxShadow: active ? 'var(--shadow-blue)' : 'var(--shadow-xs)',
                }}
              >
                {/* Color swatch - Diubah menjadi bulat sempurna agar lebih modern */}
                <div
                  className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-xl shadow-inner"
                  style={{
                    background: theme.previewColor,
                    border: `1px solid ${theme.accentColor}40`,
                  }}
                >
                  {theme.emoji}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div
                    className="font-display font-bold text-[15px] truncate"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {theme.name}
                  </div>
                  <div
                    className="text-[12px] truncate font-medium mt-0.5 opacity-80"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {theme.description}
                  </div>
                </div>

                {/* Active check - Animasi smooth saat dipilih */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    active ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                  }`}
                  style={{ background: 'var(--accent-blue)' }}
                >
                  <Check size={14} className="text-white" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}