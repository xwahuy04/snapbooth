'use client'

import { useEffect } from 'react'
import { RotateCcw, FlipHorizontal, ZapOff } from 'lucide-react'
import type { FrameTheme, PhotoFilter } from '@/types'
import { useCamera } from '@/hooks/useCamera'
import { captureFrameFromVideo } from '@/lib/canvas'

interface CameraViewProps {
  theme: FrameTheme
  filter: PhotoFilter
  onCapture: (dataUrl: string) => void
  shotsTaken: number
  shotsNeeded: number
}

export default function CameraView({
  theme, filter, onCapture, shotsTaken, shotsNeeded,
}: CameraViewProps) {
  const { videoRef, state, startCamera, switchCamera, startCountdown } = useCamera()

  useEffect(() => { startCamera('user') }, [startCamera])

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
    <div className="flex flex-col gap-4">
      <div className="camera-container scanlines relative" style={{ aspectRatio: '4/3' }}>
        <div id="camera-flash" className="absolute inset-0 bg-white pointer-events-none z-30 opacity-0" />
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"
          style={{ filter: filter.css !== 'none' ? filter.css : undefined, transform: 'scaleX(-1)' }} />

        {!state.isReady && !state.error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 z-20">
            <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mb-4"
              style={{ borderColor: 'var(--accent-blue)', borderTopColor: 'transparent' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--accent-blue)' }}>Menghidupkan kamera...</p>
          </div>
        )}

        {state.error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 z-20 p-6 text-center">
            <ZapOff size={36} className="mb-3 text-red-400" />
            <p className="text-sm text-white/70 mb-4">{state.error}</p>
            <button className="btn-primary text-xs" onClick={() => startCamera('user')}>Coba Lagi</button>
          </div>
        )}

        {state.countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-sm">
            <span className="countdown-number font-display font-black text-8xl text-white"
              style={{ textShadow: '0 0 40px rgba(37,99,235,0.6)' }} key={state.countdown}>
              {state.countdown}
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3 z-10 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: 'var(--accent-blue)', color: '#fff', boxShadow: 'var(--shadow-md)' }}>
          {shotsTaken}/{shotsNeeded}
        </div>

        {state.isReady && (
          <>
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 z-10 rounded-tl-sm opacity-50" style={{ borderColor: 'white' }} />
            <div className="absolute top-3 right-12 w-5 h-5 border-t-2 border-r-2 z-10 rounded-tr-sm opacity-50" style={{ borderColor: 'white' }} />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 z-10 rounded-bl-sm opacity-50" style={{ borderColor: 'white' }} />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 z-10 rounded-br-sm opacity-50" style={{ borderColor: 'white' }} />
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button className="btn-ghost text-sm" onClick={switchCamera} disabled={!state.isReady}>
          <RotateCcw size={16} /> Balik
        </button>
        <button onClick={handleCapture} disabled={!state.isReady || state.isCapturing || remaining === 0}
          className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all disabled:opacity-40 hover:scale-105 active:scale-95"
          style={{ background: 'var(--accent-blue)', boxShadow: state.isReady && remaining > 0 ? '0 0 0 4px rgba(37,99,235,0.2), var(--shadow-blue-lg)' : 'none' }}
          aria-label="Ambil foto">
          <div className="w-14 h-14 rounded-full border-[3px] border-white/40 flex items-center justify-center">
            {state.isCapturing
              ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <div className="w-8 h-8 rounded-full bg-white/90" />}
          </div>
        </button>
        <button className="btn-ghost text-sm opacity-50" disabled>
          <FlipHorizontal size={16} /> Mirror
        </button>
      </div>

      {remaining > 0 && (
        <div className="text-xs text-center font-medium px-4 py-2.5 rounded-lg"
          style={{ background: 'var(--accent-blue-50)', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue-100)' }}>
          {remaining} foto lagi untuk dilengkapi
        </div>
      )}
      {remaining === 0 && (
        <div className="text-xs text-center font-medium px-4 py-2.5 rounded-lg"
          style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
          ✓ Semua foto sudah diambil — lanjut ke editor!
        </div>
      )}
    </div>
  )
}
