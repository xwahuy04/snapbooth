'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import { STICKER_PACKS } from '@/lib/data'

type PackKey = keyof typeof STICKER_PACKS

const PACK_LABELS: Record<PackKey, string> = {
  hearts: '❤️ Hati',
  faces: '😊 Wajah',
  nature: '🌸 Alam',
  fun: '🎉 Fun',
  food: '🍓 Makanan',
}

interface StickerPanelProps {
  onAdd: (emoji: string) => void
  spacious?: boolean
}

export default function StickerPanel({ onAdd, spacious }: StickerPanelProps) {
  const [activePack, setActivePack] = useState<PackKey>('hearts')

  return (
    <div className={cn('flex flex-col', spacious ? 'gap-6' : 'gap-3')}>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(Object.keys(STICKER_PACKS) as PackKey[]).map((pack) => {
          const active = activePack === pack
          return (
            <button
              key={pack}
              type="button"
              onClick={() => setActivePack(pack)}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all sm:text-sm',
                spacious && 'px-5 py-2.5',
                active
                  ? 'border-accent-ring bg-accent-soft text-accent-light'
                  : 'border-border bg-surface-raised text-muted hover:text-foreground'
              )}
            >
              {PACK_LABELS[pack]}
            </button>
          )
        })}
      </div>

      <div
        className={cn(
          'grid gap-2.5',
          spacious ? 'grid-cols-5 gap-3 sm:grid-cols-6 sm:gap-4' : 'grid-cols-5 gap-2'
        )}
      >
        {STICKER_PACKS[activePack].map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onAdd(emoji)}
            className={cn(
              'flex aspect-square items-center justify-center rounded-2xl border border-border bg-surface-raised transition-all hover:scale-110 hover:border-border-strong hover:bg-surface-hover hover:shadow-md active:scale-95',
              spacious ? 'text-3xl sm:text-4xl' : 'text-2xl'
            )}
            aria-label={`Tambah stiker ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
