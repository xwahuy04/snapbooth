import type { EditorAdjustments } from '@/types'
import { FILTERS } from '@/lib/filters'

const DEFAULT_ADJUSTMENTS: EditorAdjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
}

export function buildPhotoFilterCss(
  filterId: string,
  adjustments: EditorAdjustments = DEFAULT_ADJUSTMENTS
): string {
  const base = FILTERS.find((f) => f.id === filterId)?.css ?? 'none'
  const parts: string[] = []

  if (base !== 'none') parts.push(base)

  if (adjustments.brightness !== 100) {
    parts.push(`brightness(${adjustments.brightness}%)`)
  }
  if (adjustments.contrast !== 100) {
    parts.push(`contrast(${adjustments.contrast}%)`)
  }
  if (adjustments.saturation !== 100) {
    parts.push(`saturate(${adjustments.saturation}%)`)
  }

  return parts.length > 0 ? parts.join(' ') : 'none'
}
