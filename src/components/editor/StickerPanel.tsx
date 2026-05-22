'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { STICKER_PACKS } from '@/lib/data'
import type { Sticker } from '@/types'

type PackKey = keyof typeof STICKER_PACKS

const PACK_LABELS: Record<PackKey, string> = {
  hearts: '❤️ Hati',
  faces: '😊 Wajah',
  nature: '🌸 Alam',
  fun: '🎉 Fun',
  food: '🍓 Makanan',
}

interface StickerPanelProps {
  stickers: Sticker[]
  selectedStickerId: string | null
  onAdd: (emoji: string) => void
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  spacious?: boolean
}

export default function StickerPanel({
  stickers,
  selectedStickerId,
  onAdd,
  onSelect,
  onRemove,
  spacious,
}: StickerPanelProps) {
  const [activePack, setActivePack] = useState<PackKey>('hearts')

  return (
    <div className={cn('flex flex-col', spacious ? 'gap-6' : 'gap-4')}>
      <p className="rounded-xl border border-dashed border-border bg-surface-muted/50 px-4 py-3 text-xs leading-relaxed text-muted">
        <span className="font-semibold text-accent-light">Tips:</span> Ketuk emoji di bawah → stiker muncul di
        kanvas. Seret untuk pindah, ketuk stiker di daftar untuk fokus, geser slider ukuran saat dipilih.
      </p>

      {stickers.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="section-label">Stiker di strip ({stickers.length})</span>
          <div className="flex flex-wrap gap-2">
            {stickers.map((s) => {
              const active = s.id === selectedStickerId
              return (
                <div
                  key={s.id}
                  className={cn(
                    'flex items-center gap-0.5 rounded-full border pl-2 pr-0.5 py-0.5 transition-all',
                    active
                      ? 'border-accent bg-accent-soft shadow-glow'
                      : 'border-border bg-surface-raised'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(s.id)}
                    className="text-xl leading-none px-1 py-0.5"
                    aria-label={`Pilih stiker ${s.emoji}`}
                  >
                    {s.emoji}
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(s.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-muted hover:bg-red-500/20 hover:text-red-400"
                    aria-label="Hapus stiker"
                  >
                    <X size={12} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

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
          spacious ? 'grid-cols-4 gap-3 sm:grid-cols-5 sm:gap-4' : 'grid-cols-5 gap-2'
        )}
      >
        {STICKER_PACKS[activePack].map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onAdd(emoji)}
            className={cn(
              'flex aspect-square items-center justify-center rounded-2xl border border-border bg-surface-raised transition-all hover:scale-110 hover:border-accent-ring hover:bg-accent-soft hover:shadow-md active:scale-95',
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
