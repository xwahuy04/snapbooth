'use client'

import { useCallback, useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Wand2, RotateCcw, Copy, Check, Share2, Loader2, AlertCircle } from 'lucide-react'
import { usePhotoBooth } from '@/hooks/usePhotoBooth'
import { THEMES, FILTERS } from '@/lib/data'
import StepIndicator from '@/components/ui/StepIndicator'
import ThemeSelector from '@/components/booth/ThemeSelector'
import CameraView from '@/components/booth/CameraView'
import ShotStrip from '@/components/booth/ShotStrip'
import FilterPanel from '@/components/editor/FilterPanel'
import StickerPanel from '@/components/editor/StickerPanel'
import CaptionEditor from '@/components/editor/CaptionEditor'
import QRCode from 'qrcode'

export default function BoothPage() {
  const booth = usePhotoBooth()
  const theme = THEMES.find((t) => t.id === booth.editor.activeTheme) ?? THEMES[0]
  const filter = FILTERS.find((f) => f.id === booth.editor.activeFilter) ?? FILTERS[0]

  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (booth.shareUrl) {
      QRCode.toDataURL(booth.shareUrl, {
        width: 180,
        margin: 2,
        color: {
          dark: '#0a0a0f',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error('Failed to generate QR code:', err))
    }
  }, [booth.shareUrl])

  const handleCopyLink = async () => {
    if (!booth.shareUrl) return
    try {
      await navigator.clipboard.writeText(booth.shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const canAdvance = useCallback(() => {
    if (booth.step === 'camera') {
      return booth.editor.shots.length === booth.selectedLayout.shotCount
    }
    return true
  }, [booth.step, booth.editor.shots.length, booth.selectedLayout.shotCount])

  const handleNext = () => {
    if (booth.step === 'theme') booth.setStep('camera')
    else if (booth.step === 'camera') booth.setStep('editor')
    else if (booth.step === 'editor') booth.buildStrip()
  }

  const handleBack = () => {
    if (booth.step === 'camera') booth.setStep('theme')
    else if (booth.step === 'editor') booth.setStep('camera')
    else if (booth.step === 'result') booth.setStep('editor')
  }

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 py-3"
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'rgba(10,10,15,0.9)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <button
          onClick={booth.resetSession}
          className="font-display font-black text-xl tracking-tight"
          style={{
            background: `linear-gradient(135deg, ${theme.accentColor}, var(--accent-purple))`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          SnapBooth
        </button>
        <StepIndicator currentStep={booth.step} accentColor={theme.accentColor} />
        <button
          className="btn-ghost text-xs flex items-center gap-1"
          onClick={booth.resetSession}
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">

        {/* ── STEP: THEME ── */}
        {booth.step === 'theme' && (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="font-display font-black text-2xl mb-1">Pilih Gaya Foto</h1>
              <p className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                Tema dan layout akan diterapkan pada semua foto
              </p>
            </div>
            <ThemeSelector
              selectedThemeId={booth.editor.activeTheme}
              selectedLayout={booth.selectedLayout}
              onSelectTheme={booth.setTheme}
              onSelectLayout={booth.setLayout}
            />
          </div>
        )}

        {/* ── STEP: CAMERA ── */}
        {booth.step === 'camera' && (
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="font-display font-black text-2xl mb-1">Ambil Foto</h1>
              <p className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                Butuh {booth.selectedLayout.shotCount} foto untuk layout {booth.selectedLayout.label}
              </p>
            </div>
            <CameraView
              theme={theme}
              filter={filter}
              onCapture={booth.addShot}
              shotsTaken={booth.editor.shots.length}
              shotsNeeded={booth.selectedLayout.shotCount}
            />
            <ShotStrip
              shots={booth.editor.shots}
              shotsNeeded={booth.selectedLayout.shotCount}
              theme={theme}
              onRemove={booth.removeShot}
            />
          </div>
        )}

        {/* ── STEP: EDITOR ── */}
        {booth.step === 'editor' && (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="font-display font-black text-2xl mb-1">Edit Strip</h1>
              <p className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                Tambahkan filter, stiker, dan caption
              </p>
            </div>

            {/* Preview strip */}
            <div
              className="rounded-xl overflow-hidden p-3 flex gap-2"
              style={{
                background: theme.backgroundColor,
                border: `2px solid ${theme.accentColor}44`,
              }}
            >
              {booth.editor.shots.map((shot, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={shot.id}
                  src={shot.dataUrl}
                  alt={`Shot ${i + 1}`}
                  className="flex-1 rounded object-cover"
                  style={{
                    filter: filter.css !== 'none' ? filter.css : undefined,
                    aspectRatio: '4/3',
                    border: `2px solid ${theme.accentColor}66`,
                  }}
                />
              ))}
            </div>

            {/* Filter panel */}
            <FilterPanel
              activeFilterId={booth.editor.activeFilter}
              theme={theme}
              previewDataUrl={booth.editor.shots[0]?.dataUrl}
              onSelect={booth.setFilter}
            />

            {/* Sticker panel */}
            <StickerPanel theme={theme} onAdd={booth.addSticker} />

            {/* Caption */}
            <CaptionEditor
              caption={booth.editor.caption}
              captionColor={booth.editor.captionColor}
              theme={theme}
              onChange={booth.setCaption}
              onColorChange={booth.setCaptionColor}
            />
          </div>
        )}

        {/* ── STEP: RESULT ── */}
        {booth.step === 'result' && booth.stripDataUrl && (
          <div className="flex flex-col gap-8 items-center">
            <div className="text-center">
              <h1 className="font-display font-black text-2xl mb-1">Foto Strip Siap! 🎉</h1>
              <p className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                Download atau bagikan hasil foto kamu
              </p>
            </div>

            {/* Dynamic Status / Upload Notification */}
            {booth.isUploading && (
              <div
                className="w-full max-w-sm px-4 py-3 rounded-lg flex items-center gap-3 border text-xs font-mono animate-pulse"
                style={{
                  borderColor: `${theme.accentColor}44`,
                  background: `${theme.accentColor}10`,
                  color: theme.textColor || 'var(--text-primary)',
                }}
              >
                <Loader2 size={16} className="animate-spin" />
                <span>Menyimpan ke cloud untuk link sharing...</span>
              </div>
            )}

            {booth.uploadError && (
              <div
                className="w-full max-w-sm px-4 py-3 rounded-lg flex items-center gap-3 border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono"
              >
                <AlertCircle size={16} />
                <span>{booth.uploadError} (Anda masih bisa download lokal)</span>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-6 w-full items-center md:items-start justify-center">
              {/* Left Column: Final strip preview */}
              <div
                className="rounded-xl overflow-hidden p-2 flex-1 w-full max-w-[280px]"
                style={{
                  background: theme.backgroundColor,
                  border: `2px solid ${theme.accentColor}44`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={booth.stripDataUrl}
                  alt="Photo strip"
                  className="w-full h-auto rounded"
                />
              </div>

              {/* Right Column: Actions & QR Code */}
              <div className="flex flex-col gap-4 flex-1 w-full max-w-[280px]">
                {/* QR Code Block */}
                {booth.shareUrl && qrCodeUrl && (
                  <div
                    className="card p-4 flex flex-col items-center gap-2 border"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <span className="font-mono text-[10px] text-center" style={{ color: 'var(--text-secondary)' }}>
                      SCAN UNTUK DOWNLOAD DI HP 📱
                    </span>
                    <div className="p-2 bg-white rounded-lg overflow-hidden w-[160px] h-[160px] flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qrCodeUrl} alt="QR Code Share" className="w-[144px] h-[144px]" />
                    </div>
                    
                    {/* Copy Link Button */}
                    <button
                      onClick={handleCopyLink}
                      className="btn-secondary w-full text-xs py-2 px-3 mt-2 flex items-center justify-center gap-1.5"
                    >
                      {copied ? (
                        <><Check size={14} className="text-emerald-400" /> Disalin!</>
                      ) : (
                        <><Copy size={14} /> Salin Link Share</>
                      )}
                    </button>
                  </div>
                )}

                {/* Local Action buttons */}
                <div className="flex flex-col gap-2.5">
                  <button
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-xs"
                    style={{ background: `linear-gradient(135deg, ${theme.accentColor}, var(--accent-purple))` }}
                    onClick={booth.downloadStrip}
                  >
                    ⬇ Download PNG
                  </button>
                  
                  {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                    <button
                      className="btn-secondary w-full text-xs py-2.5"
                      onClick={booth.shareStrip}
                    >
                      ↗ Bagikan Sistem
                    </button>
                  )}

                  <button
                    className="btn-ghost w-full flex items-center justify-center gap-1.5 text-xs py-2"
                    onClick={booth.resetSession}
                  >
                    <RotateCcw size={13} />
                    Foto Lagi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Composing state */}
        {booth.isComposing && (
          <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
            <div
              className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin mb-4"
              style={{ borderColor: theme.accentColor, borderTopColor: 'transparent' }}
            />
            <p className="font-mono text-sm" style={{ color: theme.accentColor }}>
              Menyusun strip foto...
            </p>
          </div>
        )}
      </div>

      {/* Navigation bar */}
      {booth.step !== 'result' && (
        <div
          className="sticky bottom-0 flex items-center justify-between px-4 py-3 gap-3"
          style={{
            borderTop: '1px solid var(--border)',
            background: 'rgba(10,10,15,0.95)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {booth.step !== 'theme' ? (
            <button className="btn-secondary flex items-center gap-2" onClick={handleBack}>
              <ArrowLeft size={15} />
              Kembali
            </button>
          ) : (
            <div />
          )}

          <button
            className="btn-primary flex items-center gap-2 flex-1 justify-center max-w-xs"
            style={{
              background: `linear-gradient(135deg, ${theme.accentColor}, var(--accent-purple))`,
              opacity: canAdvance() ? 1 : 0.4,
              cursor: canAdvance() ? 'pointer' : 'not-allowed',
            }}
            onClick={handleNext}
            disabled={!canAdvance()}
          >
            {booth.step === 'editor' ? (
              <><Wand2 size={15} /> Buat Strip</>
            ) : (
              <>Lanjut <ArrowRight size={15} /></>
            )}
          </button>
        </div>
      )}
    </main>
  )
}
