'use client'

import { useState, useCallback } from 'react'
import type { PhotoShot, EditorState, BoothStep, BoothLayout, Sticker } from '@/types'
import { THEMES, LAYOUTS, FILTERS } from '@/lib/data'
import { generateSessionId, composeStrip, downloadDataUrl, shareImage } from '@/lib/canvas'

export interface UsePhotoBoothReturn {
  step: BoothStep
  setStep: (s: BoothStep) => void
  editor: EditorState
  selectedLayout: BoothLayout
  stripDataUrl: string | null
  isComposing: boolean
  isUploading: boolean
  uploadError: string | null
  shareUrl: string | null
  sessionId: string
  setLayout: (l: BoothLayout) => void
  setTheme: (id: string) => void
  setFilter: (id: string) => void
  setCaption: (c: string) => void
  setCaptionColor: (c: string) => void
  addShot: (dataUrl: string) => void
  removeShot: (id: string) => void
  addSticker: (emoji: string) => void
  removeSticker: (id: string) => void
  moveSticker: (id: string, x: number, y: number) => void
  buildStrip: () => Promise<void>
  downloadStrip: () => void
  shareStrip: () => Promise<boolean>
  resetSession: () => void
}

function makeShot(dataUrl: string, filterId: string): PhotoShot {
  return { id: generateSessionId(), dataUrl, takenAt: Date.now(), filterId }
}

const DEFAULT_EDITOR: EditorState = {
  shots: [],
  activeFilter: 'none',
  activeTheme: 'midnight',
  stickers: [],
  caption: '',
  captionColor: '#ffffff',
}

export function usePhotoBooth(): UsePhotoBoothReturn {
  const [step, setStep] = useState<BoothStep>('theme')
  const [editor, setEditor] = useState<EditorState>(DEFAULT_EDITOR)
  const [selectedLayout, setSelectedLayout] = useState<BoothLayout>(LAYOUTS[2])
  const [stripDataUrl, setStripDataUrl] = useState<string | null>(null)
  const [isComposing, setIsComposing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [sessionId] = useState(generateSessionId)

  const setTheme = useCallback((id: string) => setEditor((e) => ({ ...e, activeTheme: id })), [])
  const setFilter = useCallback((id: string) => setEditor((e) => ({ ...e, activeFilter: id })), [])
  const setCaption = useCallback((caption: string) => setEditor((e) => ({ ...e, caption })), [])
  const setCaptionColor = useCallback((captionColor: string) => setEditor((e) => ({ ...e, captionColor })), [])

  const setLayout = useCallback((layout: BoothLayout) => {
    setSelectedLayout(layout)
    setEditor((e) => ({ ...e, shots: [] }))
  }, [])

  const addShot = useCallback(
    (dataUrl: string) => {
      const shot = makeShot(dataUrl, editor.activeFilter)
      setEditor((e) => ({ ...e, shots: [...e.shots, shot].slice(0, selectedLayout.shotCount) }))
    },
    [editor.activeFilter, selectedLayout.shotCount]
  )

  const removeShot = useCallback((id: string) => {
    setEditor((e) => ({ ...e, shots: e.shots.filter((s) => s.id !== id) }))
  }, [])

  const addSticker = useCallback((emoji: string) => {
    const sticker: Sticker = {
      id: generateSessionId(), emoji,
      x: 40 + Math.random() * 20, y: 40 + Math.random() * 20,
      size: 32, rotation: (Math.random() - 0.5) * 30,
    }
    setEditor((e) => ({ ...e, stickers: [...e.stickers, sticker] }))
  }, [])

  const removeSticker = useCallback((id: string) => {
    setEditor((e) => ({ ...e, stickers: e.stickers.filter((s) => s.id !== id) }))
  }, [])

  const moveSticker = useCallback((id: string, x: number, y: number) => {
    setEditor((e) => ({ ...e, stickers: e.stickers.map((s) => (s.id === id ? { ...s, x, y } : s)) }))
  }, [])

  const buildStrip = useCallback(async () => {
    const theme = THEMES.find((t) => t.id === editor.activeTheme) ?? THEMES[0]
    const filter = FILTERS.find((f) => f.id === editor.activeFilter) ?? FILTERS[0]
    const shots = editor.shots.map((s) => ({ ...s, filterId: filter.id }))

    setIsComposing(true)
    setUploadError(null)
    try {
      const url = await composeStrip({ shots, theme, layout: selectedLayout, caption: editor.caption, captionColor: editor.captionColor })
      setStripDataUrl(url)
      setStep('result')

      // Upload to get share URL
      setIsUploading(true)
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl: url, sessionId, themeId: editor.activeTheme }),
        })
        const data = await res.json()
        if (data.shareUrl) setShareUrl(data.shareUrl)
      } catch {
        setUploadError('Gagal menyimpan ke cloud')
      } finally {
        setIsUploading(false)
      }
    } finally {
      setIsComposing(false)
    }
  }, [editor, selectedLayout, sessionId])

  const downloadStrip = useCallback(() => {
    if (stripDataUrl) {
      const date = new Date().toISOString().slice(0, 10)
      downloadDataUrl(stripDataUrl, `snapbooth_${date}.png`)
    }
  }, [stripDataUrl])

  const shareStrip = useCallback(async () => {
    if (!stripDataUrl) return false
    return shareImage(stripDataUrl, 'My SnapBooth Strip 📸')
  }, [stripDataUrl])

  const resetSession = useCallback(() => {
    setEditor(DEFAULT_EDITOR)
    setStripDataUrl(null)
    setShareUrl(null)
    setUploadError(null)
    setStep('theme')
  }, [])

  return {
    step, setStep,
    editor, selectedLayout,
    stripDataUrl, isComposing,
    isUploading, uploadError, shareUrl,
    sessionId,
    setLayout, setTheme, setFilter,
    setCaption, setCaptionColor,
    addShot, removeShot,
    addSticker, removeSticker, moveSticker,
    buildStrip, downloadStrip, shareStrip,
    resetSession,
  }
}