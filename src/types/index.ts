// ─── Photo & Session ─────────────────────────────────────────
export interface PhotoShot {
  id: string
  dataUrl: string       // base64 PNG from canvas
  takenAt: number       // Date.now()
  filterId: string
}

export interface PhotoSession {
  id: string
  shots: PhotoShot[]
  themeId: string
  layout: BoothLayout
  createdAt: number
  shareUrl?: string
}

// ─── Theme / Frame ────────────────────────────────────────────
export interface FrameTheme {
  id: string
  name: string
  description: string
  category: ThemeCategory
  previewColor: string       // CSS color for preview card bg
  accentColor: string        // main accent color
  frameUrl?: string          // SVG/PNG overlay (optional)
  filterCSS: string          // CSS filter string
  borderStyle: string        // CSS border shorthand
  backgroundColor: string    // strip background
  textColor: string
  watermark?: string         // e.g. "✦ SNAPBOOTH"
  emoji?: string             // category icon
}

export type ThemeCategory = 'minimal' | 'retro' | 'neon' | 'cute' | 'film' | 'party' | 'elegant'

export type FrameStyleId = 'soft' | 'polaroid' | 'minimal' | 'classic'

export type CaptionSize = 'sm' | 'md' | 'lg'

export interface EditorAdjustments {
  brightness: number
  contrast: number
  saturation: number
}

// ─── Layout ───────────────────────────────────────────────────
export interface BoothLayout {
  id: LayoutId
  label: string
  shotCount: number
  description: string
  icon: string
}

export type LayoutId = '1x1' | '2x1' | '4x1' | '2x2'

// ─── Filter ───────────────────────────────────────────────────
export interface PhotoFilter {
  id: string
  name: string
  css: string           // CSS filter string
  preview: string       // emoji / color hint
}

// ─── Sticker ──────────────────────────────────────────────────
export interface Sticker {
  id: string
  emoji: string
  x: number
  y: number
  size: number
  rotation: number
}

// ─── Editor State ─────────────────────────────────────────────
export const DEFAULT_ADJUSTMENTS: EditorAdjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
}

export interface EditorState {
  shots: PhotoShot[]
  activeFilter: string
  activeTheme: string
  stickers: Sticker[]
  caption: string
  captionColor: string
  adjustments: EditorAdjustments
  frameStyle: FrameStyleId
  captionSize: CaptionSize
}

// ─── Camera ───────────────────────────────────────────────────
export type CameraFacing = 'user' | 'environment'

export interface CameraState {
  isReady: boolean
  isCapturing: boolean
  isMirrored: boolean
  countdown: number | null
  facing: CameraFacing
  error: string | null
}

// ─── UI ───────────────────────────────────────────────────────
export type BoothStep = 'theme' | 'camera' | 'editor' | 'result'

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}
