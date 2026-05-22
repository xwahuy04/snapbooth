'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Check, Copy, Download, Loader2, RotateCcw, Sparkles } from 'lucide-react'
import { rgbaFromHex } from '@/lib/color-utils'
import StepHeader from '@/components/ui/StepHeader'
import { usePhotoBoothContext } from '@/providers/PhotoBoothProvider'
import { THEMES } from '@/lib/data'

export default function ResultStep() {
  const booth = usePhotoBoothContext()
  const theme = THEMES.find((t) => t.id === booth.editor.activeTheme) ?? THEMES[0]
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!booth.shareUrl) return
    QRCode.toDataURL(booth.shareUrl, {
      width: 180,
      margin: 2,
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
    } catch {
      /* clipboard unavailable */
    }
  }

  if (!booth.stripDataUrl) return null

  return (
    <div className="flex w-full animate-fade-in flex-col items-center gap-10">
      <StepHeader
        align="center"
        title="Foto Strip Siap!"
        description="Hasil strip dengan frame halus, filter, dan stiker — siap dibagikan"
      />

      {booth.isUploading && (
        <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-accent-ring bg-accent-soft px-5 py-3.5 text-sm font-semibold text-accent-light shadow-lg">
          <Loader2 size={16} className="shrink-0 animate-spin" />
          Menyimpan ke cloud untuk link sharing...
        </div>
      )}

      <div className="flex w-full flex-col items-stretch justify-center gap-10 lg:flex-row lg:items-start lg:gap-14">
        <div className="relative mx-auto w-full max-w-[300px] lg:mx-0 lg:max-w-[320px]">
          <div
            className="absolute -inset-3 rounded-[1.75rem] opacity-60 blur-2xl"
            style={{ background: rgbaFromHex(theme.accentColor, 0.35) }}
            aria-hidden
          />
          <div
            className="relative overflow-hidden rounded-3xl p-3 shadow-2xl"
            style={{
              background: `linear-gradient(160deg, ${theme.backgroundColor}, ${rgbaFromHex(theme.accentColor, 0.12)})`,
              boxShadow: `0 28px 56px -16px rgba(0,0,0,0.65), 0 0 0 1px ${rgbaFromHex(theme.accentColor, 0.2)}`,
            }}
          >
            <img
              src={booth.stripDataUrl}
              alt="Photo strip"
              className="h-auto w-full rounded-2xl"
            />
          </div>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
            <Sparkles size={12} className="text-accent-light" />
            Kualitas penuh saat diunduh
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-col gap-4 lg:mx-0 lg:pt-6">
          {booth.shareUrl && qrCodeUrl && (
            <div className="panel flex flex-col items-center gap-5 text-center">
              <span className="text-[10px] font-bold tracking-widest text-muted">
                SCAN UNTUK DOWNLOAD
              </span>
              <div className="rounded-2xl bg-white p-3 shadow-inner">
                <img src={qrCodeUrl} alt="QR Code" className="h-36 w-36" />
              </div>
              <button type="button" className="btn-secondary w-full text-sm" onClick={handleCopyLink}>
                {copied ? (
                  <>
                    <Check size={14} className="text-success" /> Disalin!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Salin Link
                  </>
                )}
              </button>
            </div>
          )}
          <button type="button" className="btn-primary w-full py-3.5" onClick={booth.downloadStrip}>
            <Download size={17} /> Download PNG
          </button>
          <button type="button" className="btn-ghost w-full py-2.5 text-sm" onClick={booth.resetSession}>
            <RotateCcw size={14} /> Foto Lagi
          </button>
        </div>
      </div>
    </div>
  )
}
