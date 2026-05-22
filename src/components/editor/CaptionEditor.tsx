'use client'

import { cn } from '@/lib/cn'
import type { FrameTheme } from '@/types'

const COLOR_PRESETS = [
  '#ffffff', '#6366f1', '#06b6d4', '#eab308', '#22c55e',
  '#f97316', '#a855f7', '#111111', '#ef4444', '#ec4899',
]

interface CaptionEditorProps {
  caption: string
  captionColor: string
  theme: FrameTheme
  onChange: (caption: string) => void
  onColorChange: (color: string) => void
  spacious?: boolean
}

export default function CaptionEditor({
  caption,
  captionColor,
  theme,
  onChange,
  onColorChange,
  spacious,
}: CaptionEditorProps) {
  return (
    <div className={cn('flex flex-col', spacious ? 'gap-6' : 'gap-3')}>
      <input
        type="text"
        value={caption}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tambah caption di strip..."
        maxLength={40}
        className={cn('input-field', spacious && 'py-3.5 text-base sm:py-4')}
      />

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-subtle sm:text-sm">Warna teks</span>
        <div className="flex flex-wrap gap-2 sm:gap-2.5">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onColorChange(color)}
              className={cn(
                'rounded-full transition-all hover:scale-110',
                spacious ? 'h-8 w-8 sm:h-9 sm:w-9' : 'h-6 w-6',
                captionColor === color
                  ? 'ring-2 ring-accent ring-offset-2 ring-offset-surface-card'
                  : 'border-2 border-border'
              )}
              style={{ background: color }}
              aria-label={`Warna ${color}`}
            />
          ))}
          <input
            type="color"
            value={captionColor}
            onChange={(e) => onColorChange(e.target.value)}
            className={cn(
              'cursor-pointer rounded-full border-0 bg-transparent p-0',
              spacious ? 'h-8 w-8 sm:h-9 sm:w-9' : 'h-6 w-6'
            )}
            title="Pilih warna kustom"
          />
        </div>
      </div>

      {caption && (
        <p
          className={cn(
            'word-break rounded-xl border border-border px-4 py-3 text-center font-semibold shadow-sm',
            spacious ? 'text-base sm:text-lg sm:py-4' : 'text-sm md:text-base'
          )}
          style={{
            color: captionColor,
            background: theme.backgroundColor,
            lineHeight: 1.6,
          }}
        >
          {caption}
        </p>
      )}
    </div>
  )
}
