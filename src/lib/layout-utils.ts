import type { BoothLayout, LayoutId, PhotoShot } from '@/types'

/** Tailwind grid class for preview/editor grids */
export function getPreviewGridClass(layoutId: LayoutId): string {
  return layoutId === '2x2' ? 'grid-cols-2' : 'grid-cols-1'
}

/** Number of placeholder slots shown in theme preview mockup */
export function getPreviewSlotCount(layout: BoothLayout): number {
  return Math.min(layout.shotCount, 4)
}

/** Build ordered shot slots (filled or null) for grid preview */
export function buildPreviewSlots(shots: PhotoShot[], shotCount: number): (PhotoShot | null)[] {
  return Array.from({ length: shotCount }, (_, i) => shots[i] ?? null)
}
