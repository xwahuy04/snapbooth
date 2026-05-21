'use client'

import { useState } from 'react'
import { STICKER_PACKS } from '@/lib/data'
import type { FrameTheme } from '@/types'

type PackKey = keyof typeof STICKER_PACKS

const PACK_LABELS: Record<PackKey, string> = {
  hearts: '❤️ Hati',
  faces: '😊 Wajah',
  nature: '🌸 Alam',
  fun: '🎉 Fun',
  food: '🍓 Makanan',
}

interface StickerPanelProps {
  theme: FrameTheme
  onAdd: (emoji: string) => void
}

export default function StickerPanel({ theme, onAdd }: StickerPanelProps) {
  const [activePack, setActivePack] = useState<PackKey>('hearts')

  return (
    <div className="flex flex-col gap-3">
      <h3 className="section-label text-xs md:text-sm">Stiker</h3>

      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
        {(Object.keys(STICKER_PACKS) as PackKey[]).map((pack) => (
          <button
            key={pack}
            onClick={() => setActivePack(pack)}
            className="flex-shrink-0 text-[11px] md:text-xs font-medium px-3 py-1.5 rounded-full transition-all"
            style={{
              background: activePack === pack ? 'var(--accent-blue-50)' : 'var(--bg-secondary)',
              color: activePack === pack ? 'var(--accent-blue)' : 'var(--text-secondary)',
              border: activePack === pack ? '1px solid var(--accent-blue-100)' : '1px solid var(--border)',
            }}
          >
            {PACK_LABELS[pack]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {STICKER_PACKS[activePack].map((emoji) => (
          <button
            key={emoji}
            onClick={() => onAdd(emoji)}
            className="p-2 text-2xl flex items-center justify-center rounded-xl transition-all hover:scale-110 hover:shadow-md active:scale-95"
            style={{
              aspectRatio: '1',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
            }}
            aria-label={`Tambah stiker ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
