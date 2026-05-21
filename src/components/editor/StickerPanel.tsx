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
      <h3 className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
        STIKER
      </h3>

      {/* Pack tabs */}
      <div className="flex gap-1 overflow-x-auto pb-0.5">
        {(Object.keys(STICKER_PACKS) as PackKey[]).map((pack) => (
          <button
            key={pack}
            onClick={() => setActivePack(pack)}
            className="flex-shrink-0 font-mono text-[10px] px-2.5 py-1.5 rounded-full transition-all"
            style={{
              background: activePack === pack ? `${theme.accentColor}22` : 'rgba(255,255,255,0.04)',
              color: activePack === pack ? theme.accentColor : 'var(--text-secondary)',
              border: `1px solid ${activePack === pack ? theme.accentColor : 'transparent'}`,
            }}
          >
            {PACK_LABELS[pack]}
          </button>
        ))}
      </div>

      {/* Stickers grid */}
      <div className="grid grid-cols-5 gap-1.5">
        {STICKER_PACKS[activePack].map((emoji) => (
          <button
            key={emoji}
            onClick={() => onAdd(emoji)}
            className="card p-1.5 text-2xl flex items-center justify-center rounded-lg transition-all hover:scale-110 active:scale-95"
            style={{ aspectRatio: '1' }}
            aria-label={`Tambah stiker ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
