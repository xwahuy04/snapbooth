'use client'

import { Camera } from 'lucide-react'
import type { BoothLayout, FrameTheme } from '@/types'
import { getPreviewSlotCount } from '@/lib/layout-utils'

interface ThemePreviewProps {
  theme: FrameTheme
  layout: BoothLayout
}

export default function ThemePreview({ theme, layout }: ThemePreviewProps) {
  const slotCount = getPreviewSlotCount(layout)

  return (
    <div className="panel panel-spacious flex min-h-[420px] flex-col items-center justify-center lg:min-h-[480px]">
      <div className="mb-6 flex w-full items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-subtle">
          Pratinjau Tema
        </span>
      </div>

      <div
        className="flex w-52 transform flex-col gap-3 rounded-2xl p-4 shadow-2xl transition-transform duration-500 hover:scale-[1.02] sm:w-56"
        style={{
          backgroundColor: theme.backgroundColor || 'var(--color-surface-raised)',
          border: '1px solid var(--color-border)',
        }}
      >
        {Array.from({ length: slotCount }).map((_, i) => (
          <div
            key={i}
            className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-lg border border-dashed bg-black/20"
            style={{ borderColor: `${theme.accentColor}44` }}
          >
            <Camera size={20} style={{ color: theme.accentColor }} className="animate-pulse opacity-40" />
          </div>
        ))}
        <p
          className="py-1 text-center font-mono text-[9px] uppercase tracking-widest opacity-70"
          style={{ color: theme.accentColor }}
        >
          {theme.name} • {layout.label}
        </p>
      </div>
    </div>
  )
}
