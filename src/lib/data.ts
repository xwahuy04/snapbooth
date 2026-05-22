import type { BoothLayout } from '@/types'

export { THEMES, THEME_CATEGORIES } from '@/lib/themes'
export { FILTERS } from '@/lib/filters'
export { FRAME_STYLES } from '@/lib/frame-styles'
export { BACKGROUNDS, BACKGROUND_CATEGORIES } from '@/lib/backgrounds'

export const LAYOUTS: BoothLayout[] = [
  { id: '1x1', label: '1 Foto', shotCount: 1, description: 'Single portrait shot', icon: '⬜' },
  { id: '2x1', label: '2 Foto', shotCount: 2, description: 'Duo vertical strip', icon: '▬' },
  { id: '4x1', label: '4 Foto', shotCount: 4, description: 'Classic photo strip', icon: '☰' },
  { id: '2x2', label: '2x2 Grid', shotCount: 4, description: '2×2 photo grid', icon: '⊞' },
]

export const STICKER_PACKS = {
  hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💖', '💝'],
  faces: ['😊', '😎', '🥰', '😜', '🤩', '😂', '🥳', '😍', '🤪', '😇'],
  nature: ['🌸', '🌿', '⭐', '🌙', '☀️', '🌈', '❄️', '🌺', '🍀', '✨'],
  fun: ['🎉', '🎊', '🎈', '🎀', '🎁', '🏆', '🎯', '🎸', '🎨', '🎭'],
  food: ['🍓', '🍑', '🍒', '🍰', '🧁', '🍩', '🍭', '🫧', '🧋', '🍦'],
  travel: ['✈️', '🗺️', '🧳', '🏖️', '🗽', '🎡', '⛰️', '🚗', '🛳️', '🌆'],
  symbols: ['✨', '💫', '🔥', '💯', '✅', '⭐', '🌟', '💎', '🦋', '🎵'],
}

export const CAPTION_PRESETS = [
  'Best day ever!',
  'Squad goals ✨',
  'Memories',
  'Just us 💕',
  'Party mode',
  'Vibes only',
  '2026',
  '',
]
