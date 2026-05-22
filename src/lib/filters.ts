import type { PhotoFilter } from '@/types'

export const FILTERS: PhotoFilter[] = [
  { id: 'none', name: 'Original', css: 'none', preview: '🔲' },
  { id: 'vivid', name: 'Vivid', css: 'saturate(1.55) contrast(1.08)', preview: '🌈' },
  { id: 'fade', name: 'Fade', css: 'brightness(1.08) saturate(0.78) contrast(0.92)', preview: '🌫️' },
  { id: 'warm', name: 'Warm', css: 'sepia(0.28) brightness(1.04)', preview: '🌅' },
  { id: 'cool', name: 'Cool', css: 'hue-rotate(15deg) saturate(0.95) brightness(1.02)', preview: '🧊' },
  { id: 'bw', name: 'B&W', css: 'grayscale(1) contrast(1.05)', preview: '⬛' },
  { id: 'drama', name: 'Drama', css: 'contrast(1.45) brightness(0.88)', preview: '🎭' },
  { id: 'golden', name: 'Golden', css: 'sepia(0.55) brightness(1.08) saturate(1.25)', preview: '✨' },
  { id: 'lomo', name: 'Lomo', css: 'saturate(1.7) contrast(1.25) brightness(0.92)', preview: '🎞️' },
  { id: 'pastel', name: 'Pastel', css: 'saturate(0.75) brightness(1.1) contrast(0.95)', preview: '🩷' },
  { id: 'matte', name: 'Matte', css: 'contrast(0.92) brightness(1.06) saturate(0.88)', preview: '🪶' },
  { id: 'neon', name: 'Neon Pop', css: 'saturate(1.8) contrast(1.15) brightness(1.05)', preview: '💡' },
  { id: 'blush', name: 'Blush', css: 'sepia(0.12) saturate(1.2) hue-rotate(-5deg)', preview: '🌺' },
  { id: 'ink', name: 'Ink', css: 'grayscale(0.4) contrast(1.35) brightness(0.9)', preview: '🖋️' },
  { id: 'vintage', name: 'Vintage', css: 'sepia(0.45) contrast(1.1) brightness(0.95)', preview: '📻' },
  { id: 'punch', name: 'Punch', css: 'saturate(1.5) contrast(1.2) brightness(1.02)', preview: '👊' },
]
