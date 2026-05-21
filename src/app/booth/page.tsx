'use client'

import { useCallback, useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Wand2, RotateCcw, Copy, Check, Share2, Loader2, AlertCircle, Camera, Download } from 'lucide-react'
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
      QRCode.toDataURL(booth.shareUrl, { width: 180, margin: 2, color: { dark: '#09080f', light: '#ffffff' } })
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
    } catch (err) { console.error('Failed to copy text:', err) }
  }

  const canAdvance = useCallback(() => {
    if (booth.step === 'camera') return booth.editor.shots.length === booth.selectedLayout.shotCount
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
    <main className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Decorative background gradients */}
      <div className="glowing-orb orb-indigo opacity-20" />
      <div className="glowing-orb orb-purple opacity-20" />

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-header-rgba)', backdropFilter: 'blur(12px)' }}>
        <button onClick={booth.resetSession} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform hover:rotate-12 duration-200"
            style={{ background: 'var(--accent-blue)', boxShadow: 'var(--shadow-blue)' }}>
            <Camera size={16} className="text-white" />
          </div>
          <span className="font-display font-extrabold text-lg" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Snap<span className="text-[#818cf8]">Booth</span>
          </span>
        </button>
        <StepIndicator currentStep={booth.step} accentColor={theme.accentColor} />
        <button className="btn-ghost text-xs font-semibold flex items-center gap-1.5" onClick={booth.resetSession}>
          <RotateCcw size={13} /> Reset
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 w-full px-6 py-8 z-10 flex flex-col justify-center">
        <div className="max-w-2xl mx-auto w-full flex flex-col">

        {/* STEP: THEME */}
        {booth.step === 'theme' && (
          <div className="flex flex-col gap-7 animate-fade-in w-full">
            <div>
              <h1
                className="font-display font-extrabold text-2xl md:text-3xl tracking-tight"
                style={{ letterSpacing: "-0.03em", lineHeight: 1.2 }}
              >
                Pilih Gaya Foto
              </h1>
              <p
                className="text-sm md:text-base mt-1.5"
                style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
              >
                Tema dan layout akan diterapkan pada semua foto Anda
              </p>
            </div>
            <ThemeSelector selectedThemeId={booth.editor.activeTheme} selectedLayout={booth.selectedLayout}
              onSelectTheme={booth.setTheme} onSelectLayout={booth.setLayout} />
          </div>
        )}

        {/* STEP: CAMERA */}
        {booth.step === 'camera' && (
          <div className="flex flex-col gap-6 animate-fade-in w-full">
            <div>
              <h1
                className="font-display font-extrabold text-2xl md:text-3xl tracking-tight"
                style={{ letterSpacing: "-0.03em", lineHeight: 1.2 }}
              >
                Ambil Foto
              </h1>
              <p
                className="text-sm md:text-base mt-1.5"
                style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
              >
                Dibutuhkan {booth.selectedLayout.shotCount} foto untuk layout{" "}
                {booth.selectedLayout.label}
              </p>
            </div>
            <CameraView theme={theme} filter={filter} onCapture={booth.addShot}
              shotsTaken={booth.editor.shots.length} shotsNeeded={booth.selectedLayout.shotCount} />
            <ShotStrip shots={booth.editor.shots} shotsNeeded={booth.selectedLayout.shotCount}
              theme={theme} onRemove={booth.removeShot} />
          </div>
        )}

        {/* STEP: EDITOR */}
        {booth.step === 'editor' && (
          <div className="flex flex-col gap-6 animate-fade-in w-full">
            <div>
              <h1
                className="font-display font-extrabold text-2xl md:text-3xl tracking-tight"
                style={{ letterSpacing: "-0.03em", lineHeight: 1.2 }}
              >
                Edit Strip
              </h1>
              <p
                className="text-sm md:text-base mt-1.5"
                style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
              >
                Tambahkan filter, stiker, dan caption menarik
              </p>
            </div>
            <div className="rounded-xl overflow-hidden p-4 flex gap-3"
              style={{ background: theme.backgroundColor, border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
              {booth.editor.shots.map((shot, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={shot.id} src={shot.dataUrl} alt={`Shot ${i + 1}`} className="flex-1 rounded-lg object-cover transition-all"
                  style={{ filter: filter.css !== 'none' ? filter.css : undefined, aspectRatio: '4/3', border: `2px solid ${theme.accentColor}33` }} />
              ))}
            </div>
            <FilterPanel activeFilterId={booth.editor.activeFilter} theme={theme}
              previewDataUrl={booth.editor.shots[0]?.dataUrl} onSelect={booth.setFilter} />
            <StickerPanel theme={theme} onAdd={booth.addSticker} />
            <CaptionEditor caption={booth.editor.caption} captionColor={booth.editor.captionColor}
              theme={theme} onChange={booth.setCaption} onColorChange={booth.setCaptionColor} />
          </div>
        )}

        {/* STEP: RESULT */}
        {booth.step === 'result' && booth.stripDataUrl && (
          <div className="flex flex-col gap-7 items-center animate-fade-in w-full">
            <div className="text-center">
              <h1
                className="font-display font-extrabold text-3xl md:text-4xl tracking-tight"
                style={{ letterSpacing: "-0.03em", lineHeight: 1.2 }}
              >
                Foto Strip Siap! 🎉
              </h1>
              <p
                className="text-sm md:text-base mt-2"
                style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
              >
                Download atau bagikan hasil foto kamu ke teman-teman
              </p>
            </div>

            {booth.isUploading && (
              <div className="w-full max-w-sm px-4 py-3.5 rounded-xl flex items-center gap-3 text-xs md:text-sm font-semibold animate-pulse"
                style={{ background: 'var(--accent-blue-50)', color: 'var(--accent-blue-light)', border: '1px solid var(--accent-blue-100)' }}>
                <Loader2 size={15} className="animate-spin" />
                <span>Menyimpan ke cloud untuk link sharing...</span>
              </div>
            )}

            {booth.uploadError && (
              <div className="w-full max-w-sm px-4 py-3.5 rounded-xl flex items-center gap-3 text-xs md:text-sm font-semibold"
                style={{ background: 'var(--bg-error)', color: 'var(--text-error)', border: '1px solid var(--border-error)' }}>
                <AlertCircle size={15} />
                <span>{booth.uploadError} (Anda masih bisa download lokal)</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-8 w-full items-center sm:items-start justify-center mt-2">
              <div className="rounded-xl overflow-hidden p-3.5 w-full max-w-[280px] transition-transform hover:scale-[1.02] duration-300"
                style={{ background: theme.backgroundColor, border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={booth.stripDataUrl} alt="Photo strip" className="w-full h-auto rounded-lg" />
              </div>

              <div className="flex flex-col gap-5 w-full max-w-[280px]">
                {booth.shareUrl && qrCodeUrl && (
                  <div className="p-5 flex flex-col items-center gap-4 rounded-2xl"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <span className="text-xs md:text-sm font-bold text-center tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                      SCAN DENGAN HP UNTUK DOWNLOAD 📱
                    </span>
                    <div className="p-3 bg-white rounded-xl overflow-hidden w-[160px] h-[160px] flex items-center justify-center shadow-inner"
                      style={{ border: '1px solid var(--border)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qrCodeUrl} alt="QR Code Share" className="w-[136px] h-[136px]" />
                    </div>
                    <button onClick={handleCopyLink} className="btn-secondary w-full text-xs py-2.5 font-semibold">
                      {copied ? <><Check size={14} className="text-green-500" /> Disalin!</> : <><Copy size={14} /> Salin Link Share</>}
                    </button>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <button className="btn-primary w-full py-4 text-sm font-semibold shadow-lg" onClick={booth.downloadStrip}>
                    <Download size={16} /> Download PNG
                  </button>
                  {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                    <button className="btn-secondary w-full text-sm py-3 font-semibold" onClick={booth.shareStrip}>
                      <Share2 size={15} /> Bagikan
                    </button>
                  )}
                  <button className="btn-ghost w-full text-sm py-2.5 font-semibold" onClick={booth.resetSession}>
                    <RotateCcw size={13} /> Foto Lagi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Composing state */}
        {booth.isComposing && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-fade-in">
            <div className="w-12 h-12 border-3 border-t-transparent rounded-full animate-spin mb-4"
              style={{ borderColor: 'var(--accent-blue)', borderTopColor: 'transparent' }} />
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Menyusun strip foto...</p>
          </div>
        )}
        </div>
      </div>

      {/* Navigation bar */}
      {booth.step !== 'result' && (
        <div className="sticky bottom-0 flex items-center justify-between px-6 py-4 gap-4 z-20"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-footer-rgba)', backdropFilter: 'blur(12px)' }}>
          {booth.step !== 'theme' ? (
            <button className="btn-secondary flex items-center gap-2 py-3 px-5 text-sm font-semibold" onClick={handleBack}>
              <ArrowLeft size={15} /> Kembali
            </button>
          ) : <div />}
          <button
            className="btn-primary flex items-center gap-2 flex-1 justify-center max-w-xs py-3.5 text-sm font-semibold"
            style={{ opacity: canAdvance() ? 1 : 0.4, cursor: canAdvance() ? 'pointer' : 'not-allowed' }}
            onClick={handleNext} disabled={!canAdvance()}>
            {booth.step === 'editor'
              ? <><Wand2 size={15} /> Buat Strip</>
              : <>Lanjut <ArrowRight size={15} /></>}
          </button>
        </div>
      )}
    </main>
  )
}
