export function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const raw = hex.replace('#', '').trim()
  if (raw.length === 3) {
    return {
      r: parseInt(raw[0] + raw[0], 16),
      g: parseInt(raw[1] + raw[1], 16),
      b: parseInt(raw[2] + raw[2], 16),
    }
  }
  if (raw.length >= 6) {
    return {
      r: parseInt(raw.slice(0, 2), 16),
      g: parseInt(raw.slice(2, 4), 16),
      b: parseInt(raw.slice(4, 6), 16),
    }
  }
  return null
}

export function luminance(hex: string): number {
  const c = parseHex(hex)
  if (!c) return 0
  return (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255
}

export function isLightColor(hex: string): boolean {
  return luminance(hex) > 0.55
}

export function mixHex(hex: string, mix: { r: number; g: number; b: number }, weight: number): string {
  const c = parseHex(hex)
  if (!c) return hex
  const w = Math.min(1, Math.max(0, weight))
  const r = Math.round(c.r + (mix.r - c.r) * w)
  const g = Math.round(c.g + (mix.g - c.g) * w)
  const b = Math.round(c.b + (mix.b - c.b) * w)
  return `rgb(${r}, ${g}, ${b})`
}

export function rgbaFromHex(hex: string, alpha: number): string {
  const c = parseHex(hex)
  if (!c) return `rgba(0,0,0,${alpha})`
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`
}
