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

  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!booth.shareUrl) return
    QRCode.toDataURL(booth.shareUrl, {
      width: 180, margin: 2,
      color: { dark: '#09080f', light: '#ffffff' },
    })
      .then(setQrCodeUrl)
      .catch(console.error)
  }, [booth.shareUrl])

  const handleCopyLink = async () => {
    if (!booth.shareUrl) return
    try {
      await navigator.clipboard.writeText(booth.shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
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

  const editorPreviewSlots = Array.from({ length: booth.selectedLayout.shotCount }, (_, i) => booth.editor.shots[i] ?? null)
  const editorPreviewGrid = booth.selectedLayout.id === '2x2' ? 'grid-cols-2' : 'grid-cols-1'

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Decorative background orbs */}
      <div className="glowing-orb orb-indigo opacity-15" />
      <div className="glowing-orb orb-purple opacity-15" />

      {/* Header - Balanced 3-column Layout */}
      <header className="sticky top-0 z-50 grid grid-cols-3 items-center px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-header-rgba)] backdrop-blur-md">
        <div className="flex justify-start">
          <button onClick={booth.resetSession} className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--accent-blue)] shadow-[var(--shadow-blue)] transition-transform duration-300 group-hover:rotate-12">
              <Camera size={18} className="text-white" />
            </div>
            <span className="font-display font-black text-xl tracking-tight hidden sm:block">
              Snap<span className="text-[var(--accent-blue-light)]">Booth</span>
            </span>
          </button>
        </div>

        <div className="flex justify-center">
          <StepIndicator currentStep={booth.step} accentColor={theme.accentColor} />
        </div>

        <div className="flex justify-end">
          <button className="btn-ghost text-xs font-semibold cursor-pointer" onClick={booth.resetSession}>
            <RotateCcw size={13} className="mr-1.5" /> Reset
          </button>
        </div>
      </header>

      {/* Main Content Workspace */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 z-10 flex flex-col justify-center">
        
        {/* ── STEP 1: THEME & LAYOUT (SPLIT 2 COLUMN) ── */}
        {booth.step === 'theme' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full animate-fade-in">
            {/* Left Column: Selectors */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              <div>
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight leading-none bg-gradient-to-r from-white to-[var(--text-secondary)] bg-clip-text text-transparent">
                  Pilih Gaya Foto
                </h1>
                <p className="text-sm mt-3 text-[var(--text-secondary)] max-w-md leading-relaxed">
                  Tema warna dan susunan layout akan diterapkan langsung ke seluruh lembar hasil foto jadimu.
                </p>
              </div>
              
              <div className="bg-[var(--bg-secondary)]/50 border border-[var(--border)] p-6 rounded-2xl backdrop-blur-sm shadow-inner">
                <ThemeSelector
                  selectedThemeId={booth.editor.activeTheme}
                  selectedLayout={booth.selectedLayout}
                  onSelectTheme={booth.setTheme}
                  onSelectLayout={booth.setLayout}
                />
              </div>
            </div>

            {/* Right Column: Live Mockup Preview (Mengisi Kekosongan) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center bg-[var(--bg-card)]/40 border border-[var(--border)] rounded-2xl p-8 shadow-xl min-h-[450px] relative overflow-hidden group">
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">Live Theme Preview</span>
              </div>

              {/* Dynamic Empty Frame Strip Mockup */}
              <div 
                className="w-48 p-3 rounded-xl shadow-2xl flex flex-col gap-3 transition-all duration-500 transform group-hover:scale-105"
                style={{ backgroundColor: theme.backgroundColor || 'var(--bg-secondary)', border: `1px solid var(--border)` }}
              >
                {Array.from({ length: Math.min(booth.selectedLayout.shotCount, 4) }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-full aspect-[4/3] rounded-md flex flex-col items-center justify-center border border-dashed transition-colors duration-300 bg-black/20"
                    style={{ borderColor: `${theme.accentColor}44` }}
                  >
                    <Camera size={20} style={{ color: theme.accentColor }} className="opacity-40 animate-pulse" />
                  </div>
                ))}
                <div className="text-center py-1 mt-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest opacity-60" style={{ color: theme.accentColor }}>
                    {theme.name} • {booth.selectedLayout.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: CAMERA (CENTERED FOCUS) ── */}
        {booth.step === 'camera' && (
          <div className="max-w-2xl mx-auto w-full flex flex-col gap-6 animate-fade-in">
            <div className="text-center sm:text-left">
              <h1 className="font-display font-extrabold text-3xl tracking-tight">Ambil Foto</h1>
              <p className="text-sm mt-2 text-[var(--text-secondary)]">
                Dibutuhkan <span className="font-bold text-[var(--accent-blue-light)]">{booth.selectedLayout.shotCount}</span> foto untuk layout {booth.selectedLayout.label}
              </p>
            </div>
            <CameraView
              theme={theme} filter={filter}
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

        {/* ── STEP 3: EDITOR (CENTERED FULL PANEL) ── */}
        {booth.step === 'editor' && (
          <div className="max-w-3xl mx-auto w-full flex flex-col gap-6 animate-fade-in">
            <div>
              <h1 className="font-display font-extrabold text-3xl tracking-tight">Edit Strip</h1>
              <p className="text-sm mt-2 text-[var(--text-secondary)]">Tambahkan filter, stiker, dan caption menarik</p>
            </div>

            <div className={`rounded-2xl overflow-hidden p-4 border border-[var(--border)] bg-black/20 backdrop-blur-sm grid gap-3 ${editorPreviewGrid}`} style={{ background: theme.backgroundColor }}>
              {editorPreviewSlots.map((shot, i) => (
                <div
                  key={shot?.id ?? `preview-${i}`}
                  className="overflow-hidden rounded-3xl border border-[var(--border)] bg-black/10 aspect-[4/3]"
                  style={{ boxShadow: shot ? 'var(--shadow-sm)' : 'none' }}
                >
                  {shot ? (
                    <img
                      src={shot.dataUrl} alt={`Shot ${i + 1}`}
                      className="w-full h-full object-cover"
                      style={{ filter: filter.css !== 'none' ? filter.css : undefined }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[13px] text-[var(--text-secondary)]">
                      Foto {i + 1}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <FilterPanel activeFilterId={booth.editor.activeFilter} theme={theme} previewDataUrl={booth.editor.shots[0]?.dataUrl} onSelect={booth.setFilter} />
            <StickerPanel theme={theme} onAdd={booth.addSticker} />
            <CaptionEditor caption={booth.editor.caption} captionColor={booth.editor.captionColor} theme={theme} onChange={booth.setCaption} onColorChange={booth.setCaptionColor} />
          </div>
        )}

        {/* ── STEP 4: RESULT (BALANCED COLUMNS) ── */}
        {booth.step === 'result' && booth.stripDataUrl && (
          <div className="max-w-3xl mx-auto w-full flex flex-col gap-8 items-center animate-fade-in">
            <div className="text-center">
              <h1 className="font-display font-extrabold text-4xl tracking-tight">Foto Strip Siap! 🎉</h1>
              <p className="text-sm mt-2 text-[var(--text-secondary)]">Download atau bagikan hasil foto kamu ke teman-teman</p>
            </div>

            {booth.isUploading && (
              <div className="w-full max-w-sm px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold bg-[var(--accent-blue-50)] text-[var(--accent-blue-light)] border border-[var(--accent-blue-100)] shadow-lg">
                <Loader2 size={15} className="animate-spin flex-shrink-0" /> Menyimpan ke cloud untuk link sharing...
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-10 w-full items-center justify-center mt-4">
              <div className="rounded-2xl p-4 border border-[var(--border)] shadow-2xl max-w-[260px] w-full transition-transform duration-300 hover:scale-[1.02]" style={{ background: theme.backgroundColor }}>
                <img src={booth.stripDataUrl} alt="Photo strip" className="w-full h-auto rounded-xl" />
              </div>

              <div className="flex flex-col gap-4 max-w-[280px] w-full">
                {booth.shareUrl && qrCodeUrl && (
                  <div className="p-5 flex flex-col items-center gap-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-md">
                    <span className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)]">SCAN TO DOWNLOAD 📱</span>
                    <div className="p-2.5 bg-white rounded-xl shadow-inner"><img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" /></div>
                    <button className="btn-secondary w-full text-xs py-2 px-4 cursor-pointer" onClick={handleCopyLink}>
                      {copied ? <><Check size={13} className="text-emerald-400" /> Disalin!</> : <><Copy size={13} /> Salin Link</>}
                    </button>
                  </div>
                )}
                <button className="btn-primary w-full py-3 px-5 cursor-pointer" onClick={booth.downloadStrip}><Download size={16} /> Download PNG</button>
                <button className="btn-ghost w-full text-sm py-2" onClick={booth.resetSession}><RotateCcw size={13} /> Foto Lagi</button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Persistent Bottom Bar - Fixed Layout Balance */}
      {booth.step !== 'result' && (
        <div className="sticky bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--bg-footer-rgba)] backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <div className="w-32"> {/* Fixed spacer for symmetry */}
              {booth.step !== 'theme' && (
                <button className="btn-secondary text-sm py-2.5 px-5 cursor-pointer" onClick={handleBack}>
                  <ArrowLeft size={15} className="mr-1 inline" /> Kembali
                </button>
              )}
            </div>

            <button
              className={`btn-primary text-sm py-3 px-8 w-full max-w-[240px] shadow-lg cursor-pointer ${canAdvance() ? 'opacity-100' : 'opacity-40 !cursor-not-allowed'}`}
              onClick={handleNext}
              disabled={!canAdvance()}
            >
              {booth.step === 'editor' ? <><Wand2 size={15} /> Buat Strip</> : <>Lanjut <ArrowRight size={15} className="ml-1 inline" /></>}
            </button>

            <div className="w-32 hidden sm:block" /> {/* Dummy spacer right */}
          </div>
        </div>
      )}
    </main>
  )
}