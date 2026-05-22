import type {
  PhotoShot,
  FrameTheme,
  BoothLayout,
  Sticker,
  EditorAdjustments,
  FrameStyleId,
  CaptionSize,
} from '@/types'
import { buildPhotoFilterCss } from '@/lib/filter-utils'
import { isLightColor, mixHex, rgbaFromHex } from '@/lib/color-utils'
import { scaleStickerSize, STICKER_REF_STRIP_WIDTH } from '@/lib/sticker-scale'

// ─── Layout constants (strip vertikal referensi ≈ lebar ini) ───
const SHOT_W = 500
const SHOT_H = 375
const OUTER_PAD = 32
const GAP = 16
const PHOTO_RADIUS = 22
const FONT_DISPLAY = '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif'
const FONT_MONO = '"Space Mono", monospace'

export function captureFrameFromVideo(video: HTMLVideoElement, filterCSS: string): string {
  const targetAspect = 4 / 3
  const videoWidth = video.videoWidth || 640
  const videoHeight = video.videoHeight || 480
  const videoAspect = videoWidth / videoHeight

  let srcX = 0
  let srcY = 0
  let srcWidth = videoWidth
  let srcHeight = videoHeight

  if (videoAspect > targetAspect) {
    srcWidth = Math.round(videoHeight * targetAspect)
    srcX = Math.round((videoWidth - srcWidth) / 2)
  } else if (videoAspect < targetAspect) {
    srcHeight = Math.round(videoWidth / targetAspect)
    srcY = Math.round((videoHeight - srcHeight) / 2)
  }

  const canvas = document.createElement('canvas')
  canvas.width = srcWidth
  canvas.height = srcHeight
  const ctx = canvas.getContext('2d')!

  ctx.translate(canvas.width, 0)
  ctx.scale(-1, 1)
  ctx.filter = filterCSS === 'none' ? 'none' : filterCSS
  ctx.drawImage(video, srcX, srcY, srcWidth, srcHeight, 0, 0, srcWidth, srcHeight)

  return canvas.toDataURL('image/png')
}

interface ComposeOptions {
  shots: PhotoShot[]
  theme: FrameTheme
  layout: BoothLayout
  caption?: string
  captionColor?: string
  captionSize?: CaptionSize
  stickers?: Sticker[]
  adjustments?: EditorAdjustments
  frameStyle?: FrameStyleId
}

export async function composeStrip(options: ComposeOptions): Promise<string> {
  const {
    shots,
    theme,
    layout,
    caption,
    captionColor,
    captionSize = 'md',
    stickers = [],
    adjustments,
    frameStyle = 'soft',
  } = options

  const footerH = caption ? 88 : 64
  let canvasW: number
  let canvasH: number

  if (layout.id === '2x2') {
    canvasW = SHOT_W * 2 + GAP + OUTER_PAD * 2
    canvasH = SHOT_H * 2 + GAP + OUTER_PAD * 2 + footerH
  } else {
    canvasW = SHOT_W + OUTER_PAD * 2
    canvasH = SHOT_H * shots.length + GAP * (shots.length - 1) + OUTER_PAD * 2 + footerH
  }

  const canvas = document.createElement('canvas')
  canvas.width = canvasW
  canvas.height = canvasH
  const ctx = canvas.getContext('2d')!

  drawStripBackground(ctx, theme, canvasW, canvasH)
  if (theme.category === 'film') {
    drawFilmGrain(ctx, canvasW, canvasH)
  }

  const images = await Promise.all(shots.map((s) => loadImage(s.dataUrl)))
  const light = isLightColor(theme.backgroundColor)

  images.forEach((img, i) => {
    const { x, y } = getShotPosition(i, layout)
    const filterCss = buildPhotoFilterCss(shots[i]?.filterId ?? 'none', adjustments)
    drawPhotoFrame(ctx, img, x, y, SHOT_W, SHOT_H, filterCss, theme, light, frameStyle, i)
  })

  drawFooter(ctx, theme, canvasW, canvasH, footerH, caption, captionColor, captionSize)

  for (const sticker of stickers) {
    drawStickerOnCanvas(ctx, sticker, canvasW, canvasH)
  }

  return canvas.toDataURL('image/png', 1.0)
}

function getShotPosition(index: number, layout: BoothLayout) {
  if (layout.id === '2x2') {
    const col = index % 2
    const row = Math.floor(index / 2)
    return {
      x: OUTER_PAD + col * (SHOT_W + GAP),
      y: OUTER_PAD + row * (SHOT_H + GAP),
    }
  }
  return {
    x: OUTER_PAD,
    y: OUTER_PAD + index * (SHOT_H + GAP),
  }
}

function drawStripBackground(
  ctx: CanvasRenderingContext2D,
  theme: FrameTheme,
  w: number,
  h: number
) {
  const base = theme.backgroundColor
  const lighter = mixHex(base, { r: 255, g: 255, b: 255 }, isLightColor(base) ? 0.06 : 0.14)
  const darker = mixHex(base, { r: 0, g: 0, b: 0 }, isLightColor(base) ? 0.04 : 0.22)

  ctx.fillStyle = base
  ctx.fillRect(0, 0, w, h)

  const grad = ctx.createLinearGradient(0, 0, w, h)
  grad.addColorStop(0, lighter)
  grad.addColorStop(0.45, base)
  grad.addColorStop(1, darker)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  const glow = ctx.createRadialGradient(w * 0.5, h * 0.12, 0, w * 0.5, h * 0.35, w * 0.85)
  glow.addColorStop(0, rgbaFromHex(theme.accentColor, 0.12))
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)

  // Bingkai luar lembut
  roundRectPath(ctx, 12, 12, w - 24, h - 24, 20)
  ctx.strokeStyle = rgbaFromHex(theme.accentColor, 0.2)
  ctx.lineWidth = 1.5
  ctx.stroke()
}

function drawPhotoFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  filterCss: string,
  theme: FrameTheme,
  lightBg: boolean,
  frameStyle: FrameStyleId,
  index: number
) {
  const tilt = frameStyle === 'polaroid' ? ((index % 2 === 0 ? -1.2 : 1.2) * Math.PI) / 180 : 0
  const cx = x + w / 2
  const cy = y + h / 2

  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(tilt)
  ctx.translate(-cx, -cy)

  if (frameStyle === 'polaroid') {
    drawPolaroidFrame(ctx, img, x, y, w, h, filterCss, theme, lightBg)
  } else if (frameStyle === 'minimal') {
    drawMinimalFrame(ctx, img, x, y, w, h, filterCss, theme, lightBg)
  } else if (frameStyle === 'classic') {
    drawClassicFrame(ctx, img, x, y, w, h, filterCss, theme, lightBg)
  } else {
    drawSoftFrame(ctx, img, x, y, w, h, filterCss, theme, lightBg)
  }

  ctx.restore()
}

function drawPolaroidFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  filterCss: string,
  theme: FrameTheme,
  lightBg: boolean
) {
  const bottomPad = 44
  const pad = 10
  const fw = w + pad * 2
  const fh = h + bottomPad + pad

  ctx.shadowColor = 'rgba(0,0,0,0.35)'
  ctx.shadowBlur = 22
  ctx.shadowOffsetY = 8
  ctx.fillStyle = '#fafaf8'
  roundRectPath(ctx, x - pad, y - pad, fw, fh, 10)
  ctx.fill()
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0

  const imgH = h - 4
  roundRectPath(ctx, x, y, w, imgH, 8)
  ctx.save()
  ctx.clip()
  ctx.filter = filterCss !== 'none' ? filterCss : 'none'
  ctx.drawImage(img, x, y, w, imgH)
  ctx.filter = 'none'
  applyInnerVignette(ctx, x, y, w, imgH, lightBg)
  ctx.restore()

  ctx.strokeStyle = rgbaFromHex(theme.accentColor, 0.2)
  ctx.lineWidth = 1
  roundRectPath(ctx, x - pad, y - pad, fw, fh, 10)
  ctx.stroke()
}

function drawSoftFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  filterCss: string,
  theme: FrameTheme,
  lightBg: boolean
) {
  ctx.shadowColor = 'rgba(0,0,0,0.4)'
  ctx.shadowBlur = 26
  ctx.shadowOffsetY = 9
  ctx.fillStyle = lightBg ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.3)'
  roundRectPath(ctx, x, y, w, h, PHOTO_RADIUS)
  ctx.fill()
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0

  drawClippedPhoto(ctx, img, x, y, w, h, filterCss, PHOTO_RADIUS, lightBg)

  roundRectPath(ctx, x, y, w, h, PHOTO_RADIUS)
  ctx.strokeStyle = rgbaFromHex(theme.accentColor, 0.45)
  ctx.lineWidth = 2
  ctx.stroke()
}

function drawMinimalFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  filterCss: string,
  theme: FrameTheme,
  lightBg: boolean
) {
  drawClippedPhoto(ctx, img, x, y, w, h, filterCss, 14, lightBg)
  roundRectPath(ctx, x, y, w, h, 14)
  ctx.strokeStyle = rgbaFromHex(theme.accentColor, 0.35)
  ctx.lineWidth = 1.5
  ctx.stroke()
}

function drawClassicFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  filterCss: string,
  theme: FrameTheme,
  lightBg: boolean
) {
  ctx.shadowColor = 'rgba(0,0,0,0.38)'
  ctx.shadowBlur = 20
  ctx.shadowOffsetY = 7
  ctx.fillStyle = rgbaFromHex(theme.accentColor, 0.08)
  roundRectPath(ctx, x - 4, y - 4, w + 8, h + 8, PHOTO_RADIUS + 2)
  ctx.fill()
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0

  drawClippedPhoto(ctx, img, x, y, w, h, filterCss, PHOTO_RADIUS - 2, lightBg)

  roundRectPath(ctx, x, y, w, h, PHOTO_RADIUS)
  ctx.strokeStyle = rgbaFromHex(theme.accentColor, 0.7)
  ctx.lineWidth = 3
  ctx.stroke()
  roundRectPath(ctx, x + 5, y + 5, w - 10, h - 10, PHOTO_RADIUS - 6)
  ctx.strokeStyle = rgbaFromHex(theme.accentColor, 0.25)
  ctx.lineWidth = 1
  ctx.stroke()
}

function drawClippedPhoto(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  filterCss: string,
  radius: number,
  lightBg: boolean
) {
  roundRectPath(ctx, x, y, w, h, radius)
  ctx.save()
  ctx.clip()
  ctx.filter = filterCss !== 'none' ? filterCss : 'none'
  ctx.drawImage(img, x, y, w, h)
  ctx.filter = 'none'
  applyInnerVignette(ctx, x, y, w, h, lightBg)
  ctx.restore()
}

function applyInnerVignette(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  lightBg: boolean
) {
  const vig = ctx.createRadialGradient(x + w / 2, y + h / 2, w * 0.15, x + w / 2, y + h / 2, w * 0.75)
  vig.addColorStop(0, 'transparent')
  vig.addColorStop(1, lightBg ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.22)')
  ctx.fillStyle = vig
  ctx.fillRect(x, y, w, h)
}

const CAPTION_FONT: Record<CaptionSize, number> = { sm: 16, md: 22, lg: 28 }

function drawFooter(
  ctx: CanvasRenderingContext2D,
  theme: FrameTheme,
  canvasW: number,
  canvasH: number,
  footerH: number,
  caption?: string,
  captionColor?: string,
  captionSize: CaptionSize = 'md'
) {
  const top = canvasH - footerH
  const pad = OUTER_PAD
  const panelW = canvasW - pad * 2

  ctx.save()

  roundRectPath(ctx, pad, top + 6, panelW, footerH - 14, 14)
  ctx.fillStyle = rgbaFromHex(
    theme.accentColor,
    isLightColor(theme.backgroundColor) ? 0.06 : 0.1
  )
  ctx.fill()
  ctx.strokeStyle = rgbaFromHex(theme.accentColor, 0.18)
  ctx.lineWidth = 1
  ctx.stroke()

  const centerX = canvasW / 2
  const lineY = top + 22

  ctx.strokeStyle = rgbaFromHex(theme.accentColor, 0.35)
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(centerX - 48, lineY)
  ctx.lineTo(centerX + 48, lineY)
  ctx.stroke()

  ctx.fillStyle = rgbaFromHex(theme.textColor, 0.75)
  ctx.font = `600 11px ${FONT_DISPLAY}`
  ctx.textAlign = 'center'
  const watermark = (theme.watermark || 'SNAPBOOTH').replace(/[✦◈·▷❀]/g, '').trim() || 'SNAPBOOTH'
  ctx.fillText(watermark.toUpperCase(), centerX, top + 40)

  if (caption) {
    ctx.fillStyle = captionColor || theme.textColor
    ctx.font = `700 ${CAPTION_FONT[captionSize]}px ${FONT_DISPLAY}`
    ctx.fillText(caption, centerX, top + (captionSize === 'lg' ? 72 : captionSize === 'sm' ? 62 : 68))
  }

  const now = new Date()
  const dateStr = now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  ctx.font = `500 10px ${FONT_MONO}`
  ctx.textAlign = 'right'
  ctx.fillStyle = rgbaFromHex(theme.textColor, 0.35)
  ctx.fillText(dateStr, canvasW - pad - 4, canvasH - 14)

  ctx.restore()
}

function drawFilmGrain(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const dots = Math.floor((w * h) / 900)
  ctx.save()
  ctx.globalAlpha = 0.045
  for (let i = 0; i < dots; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000'
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
  }
  ctx.restore()
}

const EMOJI_FONT =
  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'

function drawStickerOnCanvas(
  ctx: CanvasRenderingContext2D,
  sticker: Sticker,
  canvasW: number,
  canvasH: number
) {
  const fontSize = Math.max(scaleStickerSize(sticker.size, canvasW), 20)
  const px = (sticker.x / 100) * canvasW
  const py = (sticker.y / 100) * canvasH

  ctx.save()
  ctx.translate(px, py)
  ctx.rotate((sticker.rotation * Math.PI) / 180)
  ctx.font = `${fontSize}px ${EMOJI_FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const outline = Math.max(2, fontSize * 0.07)
  ctx.lineJoin = 'round'
  ctx.lineWidth = outline
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'
  ctx.strokeText(sticker.emoji, 0, 0)
  ctx.lineWidth = outline * 0.5
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'
  ctx.strokeText(sticker.emoji, 0, 0)

  ctx.shadowColor = 'rgba(0,0,0,0.35)'
  ctx.shadowBlur = fontSize * 0.1
  ctx.shadowOffsetY = fontSize * 0.04
  ctx.fillStyle = '#000'
  ctx.fillText(sticker.emoji, 0, 0)

  ctx.restore()
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + w - radius, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
  ctx.lineTo(x + w, y + h - radius)
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
  ctx.lineTo(x + radius, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export function downloadDataUrl(dataUrl: string, filename = 'snapbooth.png') {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  a.click()
}

export async function shareImage(dataUrl: string, title = 'My SnapBooth Strip') {
  if (!navigator.share) return false
  try {
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    const file = new File([blob], 'snapbooth.png', { type: 'image/png' })
    await navigator.share({ title, files: [file] })
    return true
  } catch {
    return false
  }
}

export function generateSessionId(): string {
  return `sb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

/** Lebar kanvas vertikal standar — untuk skala stiker */
export function getVerticalStripCanvasWidth(): number {
  return SHOT_W + OUTER_PAD * 2
}

// Re-export ref width alignment
export { STICKER_REF_STRIP_WIDTH }
