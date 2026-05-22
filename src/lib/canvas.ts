import type { PhotoShot, FrameTheme, BoothLayout } from '@/types'

// ─── Shot Capture ─────────────────────────────────────────────
/**
 * Capture a single frame from a <video> element onto a canvas.
 * Returns base64 PNG data URL.
 */
export function captureFrameFromVideo(
  video: HTMLVideoElement,
  filterCSS: string
): string {
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

  // Mirror (selfie cam)
  ctx.translate(canvas.width, 0)
  ctx.scale(-1, 1)

  // Apply filter
  ctx.filter = filterCSS === 'none' ? 'none' : filterCSS
  ctx.drawImage(video, srcX, srcY, srcWidth, srcHeight, 0, 0, srcWidth, srcHeight)

  return canvas.toDataURL('image/png')
}

// ─── Strip Composer ───────────────────────────────────────────
interface ComposeOptions {
  shots: PhotoShot[]
  theme: FrameTheme
  layout: BoothLayout
  caption?: string
  captionColor?: string
}

/**
 * Compose all shots into a final photo strip canvas.
 * Returns base64 PNG data URL of the final strip.
 */
export async function composeStrip(options: ComposeOptions): Promise<string> {
  const { shots, theme, layout, caption, captionColor } = options

  const SHOT_W = 480
  const SHOT_H = 360
  const PADDING = 20
  const BORDER = 6
  const FOOTER_H = caption ? 60 : 40

  let canvasW: number
  let canvasH: number

  if (layout.id === '2x2') {
    canvasW = SHOT_W * 2 + PADDING * 3
    canvasH = SHOT_H * 2 + PADDING * 3 + FOOTER_H
  } else {
    // vertical strip
    canvasW = SHOT_W + PADDING * 2
    canvasH = SHOT_H * shots.length + PADDING * (shots.length + 1) + FOOTER_H
  }

  const canvas = document.createElement('canvas')
  canvas.width = canvasW
  canvas.height = canvasH
  const ctx = canvas.getContext('2d')!

  // Background
  ctx.fillStyle = theme.backgroundColor
  ctx.fillRect(0, 0, canvasW, canvasH)

  // Draw each shot
  const imagePromises = shots.map((shot) => loadImage(shot.dataUrl))
  const images = await Promise.all(imagePromises)

  images.forEach((img, i) => {
    let x: number, y: number

    if (layout.id === '2x2') {
      const col = i % 2
      const row = Math.floor(i / 2)
      x = PADDING + col * (SHOT_W + PADDING)
      y = PADDING + row * (SHOT_H + PADDING)
    } else {
      x = PADDING
      y = PADDING + i * (SHOT_H + PADDING)
    }

    // Shot background / inner border
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.fillRect(x - 2, y - 2, SHOT_W + 4, SHOT_H + 4)

    // Draw photo
    ctx.drawImage(img, x, y, SHOT_W, SHOT_H)

    // Border frame around each shot
    const borderColor = theme.accentColor
    ctx.strokeStyle = borderColor
    ctx.lineWidth = BORDER
    ctx.strokeRect(x + BORDER / 2, y + BORDER / 2, SHOT_W - BORDER, SHOT_H - BORDER)
  })

  // Watermark / footer
  const footerY = canvasH - FOOTER_H + 10
  ctx.fillStyle = theme.textColor
  ctx.font = `bold 14px 'Space Mono', monospace`
  ctx.textAlign = 'center'
  ctx.globalAlpha = 0.7
  ctx.fillText(theme.watermark || '✦ SNAPBOOTH', canvasW / 2, footerY + 10)
  ctx.globalAlpha = 1

  // Custom caption
  if (caption) {
    ctx.fillStyle = captionColor || theme.textColor
    ctx.font = `bold 18px 'Syne', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText(caption, canvasW / 2, footerY + 32)
  }

  // Date stamp (bottom right)
  const now = new Date()
  const dateStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  ctx.fillStyle = theme.textColor
  ctx.font = `11px 'Space Mono', monospace`
  ctx.textAlign = 'right'
  ctx.globalAlpha = 0.4
  ctx.fillText(dateStr, canvasW - PADDING, canvasH - 8)
  ctx.globalAlpha = 1

  return canvas.toDataURL('image/png', 1.0)
}

// ─── Helper ───────────────────────────────────────────────────
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// ─── Download ─────────────────────────────────────────────────
export function downloadDataUrl(dataUrl: string, filename = 'snapbooth.png') {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  a.click()
}

// ─── Share ────────────────────────────────────────────────────
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

// ─── Session ID generator ─────────────────────────────────────
export function generateSessionId(): string {
  return `sb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}
