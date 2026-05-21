'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import type { CameraState, CameraFacing } from '@/types'

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>
  state: CameraState
  startCamera: (facing?: CameraFacing) => Promise<void>
  stopCamera: () => void
  switchCamera: () => Promise<void>
  startCountdown: (seconds: number, onCapture: () => void) => void
  cancelCountdown: () => void
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [state, setState] = useState<CameraState>({
    isReady: false,
    isCapturing: false,
    isMirrored: true,
    countdown: null,
    facing: 'user',
    error: null,
  })

  const startCamera = useCallback(async (facing: CameraFacing = 'user') => {
    try {
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }

      setState((s) => ({ ...s, error: null, isReady: false }))

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          setState((s) => ({ ...s, isReady: true, facing, error: null }))
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kamera tidak dapat diakses'
      setState((s) => ({
        ...s,
        isReady: false,
        error: msg.includes('Permission')
          ? 'Izin kamera ditolak. Silakan izinkan akses kamera di browser.'
          : 'Gagal mengakses kamera. Pastikan kamera terhubung.',
      }))
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setState((s) => ({ ...s, isReady: false }))
  }, [])

  const switchCamera = useCallback(async () => {
    const newFacing: CameraFacing = state.facing === 'user' ? 'environment' : 'user'
    await startCamera(newFacing)
    setState((s) => ({ ...s, isMirrored: newFacing === 'user' }))
  }, [state.facing, startCamera])

  const startCountdown = useCallback(
    (seconds: number, onCapture: () => void) => {
      if (state.isCapturing) return

      setState((s) => ({ ...s, isCapturing: true, countdown: seconds }))
      let current = seconds

      countdownRef.current = setInterval(() => {
        current -= 1
        if (current <= 0) {
          clearInterval(countdownRef.current!)
          setState((s) => ({ ...s, isCapturing: false, countdown: null }))
          onCapture()
        } else {
          setState((s) => ({ ...s, countdown: current }))
        }
      }, 1000)
    },
    [state.isCapturing]
  )

  const cancelCountdown = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current)
    setState((s) => ({ ...s, isCapturing: false, countdown: null }))
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [stopCamera])

  return {
    videoRef,
    state,
    startCamera,
    stopCamera,
    switchCamera,
    startCountdown,
    cancelCountdown,
  }
}
