'use client'

import { X } from 'lucide-react'
import type { PhotoShot, FrameTheme } from '@/types'

interface ShotStripProps {
  shots: PhotoShot[]
  shotsNeeded: number
  theme: FrameTheme
  onRemove: (id: string) => void
}

export default function ShotStrip({ shots, shotsNeeded, theme, onRemove }: ShotStripProps) {
  const slots = Array.from({ length: shotsNeeded }, (_, i) => shots[i] ?? null)

  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-xs" style={{ color: theme.accentColor + '99' }}>
        HASIL FOTO ({shots.length}/{shotsNeeded})
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {slots.map((shot, i) => (
          <div
            key={shot?.id ?? `empty-${i}`}
            className="relative flex-shrink-0 rounded-lg overflow-hidden"
            style={{
              width: 88,
              height: 66,
              border: shot
                ? `2px solid ${theme.accentColor}66`
                : '2px dashed rgba(255,255,255,0.1)',
              background: shot ? undefined : 'rgba(255,255,255,0.02)',
            }}
          >
            {shot ? (
              <>
                {/* Photo thumbnail */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shot.dataUrl}
                  alt={`Shot ${i + 1}`}
                  className="w-full h-full object-cover"
                  style={{ filter: shot.filterId !== 'none' ? `var(--filter-${shot.filterId})` : undefined }}
                />
                {/* Remove button */}
                <button
                  onClick={() => onRemove(shot.id)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full flex items-center justify-center bg-black/70 hover:bg-red-500/80 transition-colors"
                  aria-label="Hapus foto"
                >
                  <X size={10} className="text-white" />
                </button>
                {/* Shot number */}
                <span
                  className="absolute bottom-0.5 left-1 font-mono text-[9px]"
                  style={{ color: theme.accentColor }}
                >
                  #{i + 1}
                </span>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  {i + 1}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
