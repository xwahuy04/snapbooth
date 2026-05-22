import type { FrameStyleId } from '@/types'

export interface FrameStyleOption {
  id: FrameStyleId
  label: string
  description: string
  emoji: string
}

export const FRAME_STYLES: FrameStyleOption[] = [
  {
    id: 'soft',
    label: 'Soft Glow',
    description: 'Sudut membulat & bayangan lembut',
    emoji: '✨',
  },
  {
    id: 'polaroid',
    label: 'Polaroid',
    description: 'Bingkai putih klasik cetak instan',
    emoji: '📸',
  },
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'Tipis & bersih tanpa bayangan berat',
    emoji: '◻️',
  },
  {
    id: 'classic',
    label: 'Classic',
    description: 'Double border elegan photobooth',
    emoji: '🎪',
  },
]
