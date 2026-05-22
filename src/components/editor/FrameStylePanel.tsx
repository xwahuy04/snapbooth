'use client'

import { cn } from '@/lib/cn'
import { FRAME_STYLES } from '@/lib/frame-styles'
import type { FrameStyleId } from '@/types'

interface FrameStylePanelProps {
  activeStyle: FrameStyleId
  onSelect: (id: FrameStyleId) => void
}

export default function FrameStylePanel({ activeStyle, onSelect }: FrameStylePanelProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {FRAME_STYLES.map((style) => {
        const active = style.id === activeStyle
        return (
          <button
            key={style.id}
            type="button"
            onClick={() => onSelect(style.id)}
            className={cn(
              'flex flex-col items-start gap-2 rounded-2xl p-4 text-left transition-all',
              active ? 'option-card-active' : 'option-card'
            )}
          >
            <span className="text-2xl">{style.emoji}</span>
            <span className="font-display text-sm font-bold text-foreground">{style.label}</span>
            <span className="text-xs leading-relaxed text-muted">{style.description}</span>
          </button>
        )
      })}
    </div>
  )
}
