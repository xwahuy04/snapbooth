'use client'

import { useEffect } from 'react'
import { RotateCcw, FlipHorizontal, ZapOff } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { PhotoFilter } from '@/types'
import { useCamera } from '@/hooks/useCamera'
import { captureFrameFromVideo } from '@/lib/canvas'

interface CameraViewProps {
  filter: PhotoFilter
  onCapture: (dataUrl: string) => void
  shotsTaken: number
  shotsNeeded: number
}

export default function CameraView({
  filter,
  onCapture,
  shotsTaken,
  shotsNeeded,
}: CameraViewProps) {
  const { videoRef, state, startCamera, switchCamera, startCountdown } = useCamera()

  useEffect(() => {
    startCamera('user')
  }, [startCamera])

  const handleCapture = () => {
    if (!state.isReady || state.isCapturing) return
    startCountdown(3, () => {
      if (videoRef.current) {
        const dataUrl = captureFrameFromVideo(videoRef.current, filter.css)
        onCapture(dataUrl)
        const flash = document.getElementById('camera-flash')
        if (flash) {
          flash.classList.add('flash-overlay')
          setTimeout(() => flash.classList.remove('flash-overlay'), 500)
        }
      }
    })
  }

  const remaining = shotsNeeded - shotsTaken

  return (
    <div className="flex flex-col gap-5">
      <div className="camera-container scanlines relative aspect-[4/3]">
        <div id="camera-flash" className="pointer-events-none absolute inset-0 z-30 bg-white opacity-0" />
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
          style={{ filter: filter.css !== 'none' ? filter.css : undefined, transform: 'scaleX(-1)' }}
        />

        {!state.isReady && !state.error && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/90">
            <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="text-sm font-medium text-accent-light">Menghidupkan kamera...</p>
          </div>
        )}

        {state.error && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/95 p-6 text-center">
            <ZapOff size={36} className="mb-3 text-red-400" />
            <p className="mb-4 text-sm text-white/70">{state.error}</p>
            <button type="button" className="btn-primary text-xs" onClick={() => startCamera('user')}>
              Coba Lagi
            </button>
          </div>
        )}

        {state.countdown !== null && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <span
              className="countdown-number font-display text-8xl font-black text-white"
              style={{ textShadow: '0 0 40px rgb(99 102 241 / 0.6)' }}
              key={state.countdown}
            >
              {state.countdown}
            </span>
          </div>
        )}

        <div className="absolute right-3 top-3 z-10 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-white shadow-md">
          {shotsTaken}/{shotsNeeded}
        </div>

        {state.isReady && (
          <>
            <div className="absolute left-3 top-3 z-10 h-5 w-5 rounded-tl-sm border-l-2 border-t-2 border-white/50" />
            <div className="absolute right-12 top-3 z-10 h-5 w-5 rounded-tr-sm border-r-2 border-t-2 border-white/50" />
            <div className="absolute bottom-3 left-3 z-10 h-5 w-5 rounded-bl-sm border-b-2 border-l-2 border-white/50" />
            <div className="absolute bottom-3 right-3 z-10 h-5 w-5 rounded-br-sm border-b-2 border-r-2 border-white/50" />
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        <button type="button" className="btn-ghost text-sm" onClick={switchCamera} disabled={!state.isReady}>
          <RotateCcw size={16} /> Balik
        </button>
        <button
          type="button"
          onClick={handleCapture}
          disabled={!state.isReady || state.isCapturing || remaining === 0}
          className={cn(
            'relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-40',
            state.isReady && remaining > 0 && 'bg-accent shadow-glow-lg ring-4 ring-accent-soft'
          )}
          aria-label="Ambil foto"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-white/40">
            {state.isCapturing ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-white/90" />
            )}
          </div>
        </button>
        <button type="button" className="btn-ghost text-sm opacity-50" disabled>
          <FlipHorizontal size={16} /> Mirror
        </button>
      </div>

      {remaining > 0 ? (
        <p className="rounded-xl border border-accent-ring bg-accent-soft px-4 py-3 text-center text-xs font-semibold text-accent-light">
          {remaining} foto lagi untuk dilengkapi
        </p>
      ) : (
        <p className="rounded-xl border border-green-500/30 bg-success-soft px-4 py-3 text-center text-xs font-semibold text-success">
          ✓ Semua foto sudah diambil — lanjut ke editor!
        </p>
      )}
    </div>
  )
}
