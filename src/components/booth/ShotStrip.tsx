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
    <div className="flex flex-col gap-2.5">
      <p className="section-label text-xs md:text-sm">
        Hasil Foto ({shots.length}/{shotsNeeded})
      </p>
      <div className="flex gap-2.5 overflow-x-auto pb-1">
        {slots.map((shot, i) => (
          <div
            key={shot?.id ?? `empty-${i}`}
            className="relative flex-shrink-0 rounded-xl overflow-hidden transition-all"
            style={{
              width: 92,
              height: 69,
              border: shot ? '2px solid var(--accent-blue)' : '2px dashed var(--border)',
              background: shot ? undefined : 'var(--bg-secondary)',
              boxShadow: shot ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {shot ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={shot.dataUrl} alt={`Shot ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => onRemove(shot.id)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(239,68,68,0.9)', boxShadow: 'var(--shadow-sm)' }}
                  aria-label="Hapus foto"
                >
                  <X size={10} className="text-white" />
                </button>
                <span
                  className="absolute bottom-1 left-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded"
                  style={{ background: 'var(--accent-blue)', color: 'white' }}
                >
                  #{i + 1}
                </span>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
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
