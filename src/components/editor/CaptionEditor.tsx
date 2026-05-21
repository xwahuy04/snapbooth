'use client'

import type { FrameTheme } from '@/types'

const COLOR_PRESETS = [
  '#ffffff', '#ff2d78', '#00e5ff', '#ffe600', '#a5ff85',
  '#ff9f43', '#9b59ff', '#111111', '#ff6b6b', '#ffd700',
]

interface CaptionEditorProps {
  caption: string
  captionColor: string
  theme: FrameTheme
  onChange: (caption: string) => void
  onColorChange: (color: string) => void
}

export default function CaptionEditor({
  caption,
  captionColor,
  theme,
  onChange,
  onColorChange,
}: CaptionEditorProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
        CAPTION
      </h3>

      <input
        type="text"
        value={caption}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tambah caption di strip..."
        maxLength={40}
        className="w-full px-3 py-2.5 rounded-lg font-display text-sm outline-none transition-all"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${caption ? theme.accentColor + '66' : 'rgba(255,255,255,0.1)'}`,
          color: 'var(--text-primary)',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = theme.accentColor
          e.target.style.boxShadow = `0 0 0 1px ${theme.accentColor}44`
        }}
        onBlur={(e) => {
          e.target.style.borderColor = caption ? `${theme.accentColor}66` : 'rgba(255,255,255,0.1)'
          e.target.style.boxShadow = 'none'
        }}
      />

      {/* Color picker */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Warna:</span>
        <div className="flex gap-1.5 flex-wrap">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className="w-5 h-5 rounded-full transition-all hover:scale-125"
              style={{
                background: color,
                border: captionColor === color
                  ? `2px solid white`
                  : '2px solid transparent',
                boxShadow: captionColor === color ? '0 0 0 1px rgba(255,255,255,0.5)' : 'none',
              }}
              aria-label={`Warna ${color}`}
            />
          ))}
          <input
            type="color"
            value={captionColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-5 h-5 rounded-full cursor-pointer border-0 p-0"
            style={{ background: 'transparent' }}
            title="Pilih warna kustom"
          />
        </div>
      </div>

      {caption && (
        <p
          className="font-display font-semibold text-sm text-center px-2 py-1.5 rounded"
          style={{
            color: captionColor,
            background: `${theme.backgroundColor}cc`,
            border: `1px solid ${theme.accentColor}33`,
          }}
        >
          {caption}
        </p>
      )}
    </div>
  )
}
