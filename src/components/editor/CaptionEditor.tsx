'use client'

import type { FrameTheme } from '@/types'

const COLOR_PRESETS = [
  '#ffffff', '#2563eb', '#06b6d4', '#eab308', '#22c55e',
  '#f97316', '#7c3aed', '#111111', '#ef4444', '#ec4899',
]

interface CaptionEditorProps {
  caption: string
  captionColor: string
  theme: FrameTheme
  onChange: (caption: string) => void
  onColorChange: (color: string) => void
}

export default function CaptionEditor({ caption, captionColor, theme, onChange, onColorChange }: CaptionEditorProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="section-label text-xs md:text-sm">Caption</h3>

      <input
        type="text"
        value={caption}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tambah caption di strip..."
        maxLength={40}
        className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all"
        style={{
          background: 'var(--bg-secondary)',
          border: caption ? '1px solid var(--accent-blue)' : '1px solid var(--border)',
          color: 'var(--text-primary)',
          boxShadow: caption ? '0 0 0 3px var(--accent-blue-50)' : 'none',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--accent-blue)'
          e.target.style.boxShadow = '0 0 0 3px var(--accent-blue-50)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = caption ? 'var(--accent-blue)' : 'var(--border)'
          e.target.style.boxShadow = caption ? '0 0 0 3px var(--accent-blue-50)' : 'none'
        }}
      />

      <div className="flex items-center gap-2.5">
        <span className="text-[11px] md:text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          Warna:
        </span>
        <div className="flex gap-1.5 flex-wrap">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className="w-6 h-6 rounded-full transition-all hover:scale-125"
              style={{
                background: color,
                border: captionColor === color ? '2.5px solid var(--accent-blue)' : '2px solid var(--border)',
                boxShadow: captionColor === color ? '0 0 0 2px var(--accent-blue-50)' : 'var(--shadow-xs)',
              }}
              aria-label={`Warna ${color}`}
            />
          ))}
          <input
            type="color"
            value={captionColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-6 h-6 rounded-full cursor-pointer border-0 p-0"
            style={{ background: 'transparent' }}
            title="Pilih warna kustom"
          />
        </div>
      </div>

      {caption && (
        <p className="font-semibold text-sm md:text-base text-center px-3 py-2 rounded-lg word-break"
          style={{
            color: captionColor,
            background: `${theme.backgroundColor}`,
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            lineHeight: 1.6,
          }}>
          {caption}
        </p>
      )}
    </div>
  )
}
