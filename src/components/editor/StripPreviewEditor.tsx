'use client'

import { useEffect, useRef, useState } from 'react'
import { Trash2, RotateCw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { buildPreviewSlots, getPreviewGridClass } from '@/lib/layout-utils'
import { scaleStickerSize } from '@/lib/sticker-scale'
import type { BoothLayout, FrameTheme, PhotoFilter, PhotoShot, Sticker } from '@/types'

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

interface StripPreviewEditorProps {
  shots: PhotoShot[]
  layout: BoothLayout
  theme: FrameTheme
  filter: PhotoFilter
  stickers: Sticker[]
  selectedStickerId: string | null
  onSelectSticker: (id: string | null) => void
  onMoveSticker: (id: string, x: number, y: number) => void
  onRemoveSticker: (id: string) => void
  onResizeSticker: (id: string, size: number) => void
  onRotateSticker: (id: string, rotation: number) => void
  className?: string
}

export default function StripPreviewEditor({
  shots,
  layout,
  theme,
  filter,
  stickers,
  selectedStickerId,
  onSelectSticker,
  onMoveSticker,
  onRemoveSticker,
  onResizeSticker,
  onRotateSticker,
  className,
}: StripPreviewEditorProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [canvasWidth, setCanvasWidth] = useState(320)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return

    const update = () => setCanvasWidth(el.getBoundingClientRect().width)
    update()

    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [layout.id, shots.length])

  const previewSlots = buildPreviewSlots(shots, layout.shotCount)
  const gridClass = getPreviewGridClass(layout.id)
  const selected = stickers.find((s) => s.id === selectedStickerId)

  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-sticker]')) return
    onSelectSticker(null)
  }

  const handleStickerPointerDown = (e: React.PointerEvent, sticker: Sticker) => {
    e.stopPropagation()
    e.preventDefault()
    const el = canvasRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const stickerX = (sticker.x / 100) * rect.width
    const stickerY = (sticker.y / 100) * rect.height

    dragRef.current = {
      id: sticker.id,
      offsetX: e.clientX - rect.left - stickerX,
      offsetY: e.clientY - rect.top - stickerY,
    }
    setIsDragging(true)
    onSelectSticker(sticker.id)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handleStickerPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || dragRef.current.id !== (e.currentTarget as HTMLElement).dataset.stickerId) return
    const el = canvasRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left - dragRef.current.offsetX) / rect.width) * 100
    const y = ((e.clientY - rect.top - dragRef.current.offsetY) / rect.height) * 100
    onMoveSticker(dragRef.current.id, clamp(x, 4, 96), clamp(y, 4, 88))
  }

  const handleStickerPointerUp = (e: React.PointerEvent) => {
    dragRef.current = null
    setIsDragging(false)
    try {
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
  }

  return (
    <div className={cn('flex w-full flex-col gap-4', className)}>
      <div
        ref={canvasRef}
        className={cn(
          'strip-canvas relative mx-auto w-full max-w-md touch-none select-none rounded-2xl p-4 sm:max-w-lg sm:p-5 lg:max-w-xl lg:p-6',
          isDragging && 'cursor-grabbing'
        )}
        style={{ background: theme.backgroundColor }}
        onPointerDown={handleCanvasPointerDown}
        role="application"
        aria-label="Pratinjau strip foto dengan stiker yang bisa diseret"
      >
        <div className={cn('grid gap-3 sm:gap-4', gridClass)}>
          {previewSlots.map((shot, i) => (
            <div
              key={shot?.id ?? `slot-${i}`}
              className="pointer-events-none aspect-[4/3] overflow-hidden rounded-xl border border-border/60 bg-black/15"
            >
              {shot ? (
                <img
                  src={shot.dataUrl}
                  alt={`Foto ${i + 1}`}
                  className="h-full w-full object-cover"
                  style={{ filter: filter.css !== 'none' ? filter.css : undefined }}
                  draggable={false}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted/80">
                  Foto {i + 1}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sticker layer */}
        {stickers.map((sticker) => {
          const isSelected = sticker.id === selectedStickerId
          const displaySize = scaleStickerSize(sticker.size, canvasWidth)
          return (
            <div
              key={sticker.id}
              data-sticker
              data-sticker-id={sticker.id}
              className={cn(
                'absolute z-20 cursor-grab touch-none active:cursor-grabbing',
                isSelected && 'z-30'
              )}
              style={{
                left: `${sticker.x}%`,
                top: `${sticker.y}%`,
                transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
                fontSize: displaySize,
                lineHeight: 1,
              }}
              onPointerDown={(e) => handleStickerPointerDown(e, sticker)}
              onPointerMove={handleStickerPointerMove}
              onPointerUp={handleStickerPointerUp}
              onPointerCancel={handleStickerPointerUp}
            >
              <span
                className={cn(
                  'block transition-transform',
                  isSelected && 'scale-110'
                )}
                style={{
                  filter:
                    'drop-shadow(0 0 2px rgba(255,255,255,0.95)) drop-shadow(0 2px 4px rgba(0,0,0,0.55)) drop-shadow(0 4px 10px rgba(0,0,0,0.35))',
                }}
              >
                {sticker.emoji}
              </span>
              {isSelected && (
                <span className="absolute -inset-2 rounded-xl border-2 border-dashed border-accent-light/80 pointer-events-none" />
              )}
            </div>
          )
        })}

        {stickers.length === 0 && (
          <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[11px] font-medium text-muted/70">
            Pilih emoji di panel Stiker → lalu seret di sini
          </p>
        )}
      </div>

      {selected && (
        <div className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-2xl border border-border bg-surface-raised p-4 sm:max-w-lg lg:max-w-xl">
          <div className="flex items-center justify-between gap-3">
            <span className="text-2xl">{selected.emoji}</span>
            <span className="text-xs font-semibold text-muted">Stiker dipilih</span>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-ghost rounded-lg px-2 py-1.5 text-xs"
                onClick={() => onRotateSticker(selected.id, selected.rotation + 15)}
                title="Putar 15°"
              >
                <RotateCw size={14} />
              </button>
              <button
                type="button"
                className="btn-ghost rounded-lg px-2 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                onClick={() => onRemoveSticker(selected.id)}
                title="Hapus stiker"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted">
              Ukuran stiker — pratinjau & hasil akhir sama proporsinya
            </span>
            <input
              type="range"
              min={40}
              max={110}
              value={selected.size}
              onChange={(e) => onResizeSticker(selected.id, Number(e.target.value))}
              className="accent-accent h-2 w-full cursor-pointer"
            />
          </label>
        </div>
      )}
    </div>
  )
}
