import type { LucideIcon } from 'lucide-react'
import { Camera, Download, ImageIcon, Palette, Smartphone, Sparkles } from 'lucide-react'

export interface HomeFeature {
  icon: LucideIcon
  title: string
  desc: string
}

export interface HomeThemeChip {
  bg: string
  accent: string
  label: string
}

export const HOME_FEATURES: HomeFeature[] = [
  { icon: Camera, title: 'Live Camera', desc: 'Langsung dari kamera perangkatmu dengan auto mirror effect' },
  { icon: Palette, title: '8+ Tema Frame', desc: 'Midnight, Sakura, Film 35mm, Retro 90s, dan tema aesthetic lainnya' },
  { icon: Sparkles, title: 'Filter & Stiker', desc: '9 filter foto eksklusif dan puluhan stiker ekspresif' },
  { icon: ImageIcon, title: 'Photo Strip', desc: 'Layout strip vertikal klasik atau grid modern 2×2' },
  { icon: Download, title: 'Download Gratis', desc: 'Ekspor hasil foto berkualitas tinggi secara instan dalam format PNG' },
  { icon: Smartphone, title: 'Mobile Friendly', desc: 'Didesain optimal untuk smartphone, tablet, maupun laptop' },
]

export const HOME_THEME_CHIPS: HomeThemeChip[] = [
  { bg: '#0a0a1a', accent: '#ff2d78', label: 'Midnight' },
  { bg: '#fce4ec', accent: '#e91e8c', label: 'Sakura' },
  { bg: '#1a1410', accent: '#d4a84b', label: 'Film' },
  { bg: '#1a0533', accent: '#00e5ff', label: 'Retro' },
  { bg: '#ffffff', accent: '#111111', label: 'Clean' },
]
