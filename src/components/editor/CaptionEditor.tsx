'use client'

import { cn } from '@/lib/cn'
import { CAPTION_PRESETS } from '@/lib/data'
import type { CaptionSize, FrameTheme } from '@/types'

const COLOR_PRESETS = [
  '#ffffff', '#6366f1', '#06b6d4', '#eab308', '#22c55e',
  '#f97316', '#a855f7', '#111111', '#ef4444', '#ec4899',
]

const SIZE_OPTIONS: { id: CaptionSize; label: string }[] = [
  { id: 'sm', label: 'Kecil' },
  { id: 'md', label: 'Sedang' },
  { id: 'lg', label: 'Besar' },
]

interface CaptionEditorProps {
  caption: string
  captionColor: string
  captionSize: CaptionSize
  theme: FrameTheme
  onChange: (caption: string) => void
  onColorChange: (color: string) => void
  onSizeChange: (size: CaptionSize) => void
  spacious?: boolean
}

export default function CaptionEditor({
  caption,
  captionColor,
  captionSize,
  theme,
  onChange,
  onColorChange,
  onSizeChange,
  spacious,
}: CaptionEditorProps) {
  return (
    <div className={cn('flex flex-col', spacious ? 'gap-6' : 'gap-4')}>
      <div className="flex flex-wrap gap-2">
        {CAPTION_PRESETS.filter(Boolean).map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className="rounded-full border border-border bg-surface-raised px-3 py-1.5 text-xs font-medium text-muted transition-all hover:border-accent-ring hover:text-foreground"
          >
            {preset}
          </button>
        ))}
      </div>

      <input
        type="text"
        value={caption}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tulis caption di bagian bawah strip..."
        maxLength={40}
        className={cn('input-field', spacious && 'py-3.5 text-base sm:py-4')}
      />

      <div className="flex flex-wrap gap-2">
        {SIZE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSizeChange(opt.id)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-xs font-semibold transition-all',
              captionSize === opt.id
                ? 'border-accent-ring bg-accent-soft text-accent-light'
                : 'border-border bg-surface-raised text-muted'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-subtle">Warna teks</span>
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onColorChange(color)}
              className={cn(
                'h-7 w-7 rounded-full transition-all hover:scale-110',
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
            className="h-7 w-7 cursor-pointer rounded-full border-0 bg-transparent p-0"
            title="Warna kustom"
          />
        </div>
      </div>

      {caption && (
        <p
          className={cn(
            'word-break rounded-xl border border-border px-4 py-3 text-center font-semibold shadow-sm',
            captionSize === 'lg' && 'text-lg',
            captionSize === 'md' && 'text-base',
            captionSize === 'sm' && 'text-sm'
          )}
          style={{ color: captionColor, background: theme.backgroundColor, lineHeight: 1.6 }}
        >
          {caption}
        </p>
      )}
    </div>
  )
}
