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
  theme,
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
        // Flash effect
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
      {/* Camera Box */}
      <div
        className="camera-container scanlines relative"
        style={{
          aspectRatio: '4/3',
          border: state.isReady ? theme.borderStyle : '2px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Flash overlay */}
        <div
          id="camera-flash"
          className="absolute inset-0 bg-white pointer-events-none z-30 opacity-0"
        />

        {/* Video element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{
            filter: filter.css !== 'none' ? filter.css : undefined,
            transform: 'scaleX(-1)',
          }}
        />

        {/* Not ready state */}
        {!state.isReady && !state.error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
            <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mb-4"
              style={{ borderColor: theme.accentColor, borderTopColor: 'transparent' }}
            />
            <p className="font-mono text-sm" style={{ color: theme.accentColor }}>
              Menghidupkan kamera...
            </p>
          </div>
        )}

        {/* Error state */}
        {state.error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 p-6 text-center">
            <ZapOff size={36} className="mb-3" style={{ color: theme.accentColor }} />
            <p className="font-mono text-sm text-white/70">{state.error}</p>
            <button
              className="btn-primary mt-4 text-xs"
              style={{ background: theme.accentColor }}
              onClick={() => startCamera('user')}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Countdown overlay */}
        {state.countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/30">
            <span
              className="countdown-number font-display font-black text-9xl"
              style={{ color: theme.accentColor, textShadow: `0 0 40px ${theme.accentColor}` }}
              key={state.countdown}
            >
              {state.countdown}
            </span>
          </div>
        )}

        {/* Shot counter badge */}
        <div
          className="absolute top-3 right-3 z-10 font-mono text-xs px-2 py-1 rounded-full"
          style={{ background: theme.accentColor + 'cc', color: '#fff' }}
        >
          {shotsTaken}/{shotsNeeded}
        </div>

        {/* Guide corners */}
        {state.isReady && (
          <>
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 z-10 rounded-tl-sm opacity-60"
              style={{ borderColor: theme.accentColor }} />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 z-10 rounded-tr-sm opacity-60"
              style={{ borderColor: theme.accentColor }} />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 z-10 rounded-bl-sm opacity-60"
              style={{ borderColor: theme.accentColor }} />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 z-10 rounded-br-sm opacity-60"
              style={{ borderColor: theme.accentColor }} />
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3">
        {/* Switch camera */}
        <button
          className="btn-ghost flex items-center gap-2 text-sm"
          onClick={switchCamera}
          disabled={!state.isReady}
        >
          <RotateCcw size={16} />
          Balik
        </button>

        {/* Capture button */}
        <button
          onClick={handleCapture}
          disabled={!state.isReady || state.isCapturing || remaining === 0}
          className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all disabled:opacity-40 hover:scale-105 active:scale-95"
          style={{
            background: `radial-gradient(circle, ${theme.accentColor}, ${theme.accentColor}88)`,
            boxShadow: state.isReady && remaining > 0
              ? `0 0 0 4px ${theme.accentColor}33, 0 0 30px ${theme.accentColor}44`
              : 'none',
          }}
          aria-label="Ambil foto"
        >
          <div
            className="w-14 h-14 rounded-full border-4 border-white/40 flex items-center justify-center"
          >
            {state.isCapturing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/90" />
            )}
          </div>
        </button>

        {/* Mirror toggle (decorative info) */}
        <button className="btn-ghost flex items-center gap-2 text-sm opacity-50" disabled>
          <FlipHorizontal size={16} />
          Mirror
        </button>
      </div>

      {/* Remaining shots info */}
      {remaining > 0 && (
        <p className="font-mono text-xs text-center" style={{ color: theme.accentColor + 'aa' }}>
          {remaining} foto lagi untuk dilengkapi
        </p>
      )}
      {remaining === 0 && (
        <p className="font-mono text-xs text-center text-green-400">
          ✓ Semua foto sudah diambil — lanjut ke editor!
        </p>
      )}
    </div>
  )
}
