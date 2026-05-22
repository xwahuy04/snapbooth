'use client'

import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { PhotoShot } from '@/types'

interface ShotStripProps {
  shots: PhotoShot[]
  shotsNeeded: number
  onRemove: (id: string) => void
}

export default function ShotStrip({ shots, shotsNeeded, onRemove }: ShotStripProps) {
  const slots = Array.from({ length: shotsNeeded }, (_, i) => shots[i] ?? null)

  return (
    <div className="flex flex-col gap-4">
      <p className="section-label">
        Hasil Foto ({shots.length}/{shotsNeeded})
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {slots.map((shot, i) => (
          <div
            key={shot?.id ?? `empty-${i}`}
            className={cn(
              'relative h-[4.5rem] w-[6rem] shrink-0 overflow-hidden rounded-xl transition-all sm:h-20 sm:w-28',
              shot ? 'border-2 border-accent shadow-sm' : 'border-2 border-dashed border-border bg-surface-raised'
            )}
          >
            {shot ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={shot.dataUrl} alt={`Shot ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => onRemove(shot.id)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/90 shadow-sm"
                  aria-label="Hapus foto"
                >
                  <X size={10} className="text-white" />
                </button>
                <span className="absolute bottom-1 left-1.5 rounded bg-accent px-1.5 py-0.5 text-[9px] font-bold text-white">
                  #{i + 1}
                </span>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-medium text-subtle">
                {i + 1}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
