'use client'

import { useCallback } from 'react'
import { ArrowLeft, ArrowRight, Wand2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePhotoBoothContext } from '@/providers/PhotoBoothProvider'

export default function BoothNavBar() {
  const booth = usePhotoBoothContext()

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

  if (booth.step === 'result') return null

  const advanceEnabled = canAdvance()
  const isEditor = booth.step === 'editor'

  return (
    <footer className="booth-footer">
      <div
        className={cn(
          'mx-auto flex items-center justify-between gap-4 px-5 py-4 sm:px-8',
          isEditor ? 'max-w-[90rem]' : 'max-w-6xl'
        )}
      >
        <div className="w-28 sm:w-32">
          {booth.step !== 'theme' && (
            <button type="button" className="btn-secondary cursor-pointer px-4 py-2.5 text-sm" onClick={handleBack}>
              <ArrowLeft size={15} className="mr-1 inline" /> Kembali
            </button>
          )}
        </div>

        <button
          type="button"
          className={cn(
            'btn-primary w-full max-w-[260px] cursor-pointer px-8 py-3 text-sm shadow-lg',
            !advanceEnabled && 'cursor-not-allowed opacity-40'
          )}
          onClick={handleNext}
          disabled={!advanceEnabled}
        >
          {isEditor ? (
            <>
              <Wand2 size={15} /> Buat Strip
            </>
          ) : (
            <>
              Lanjut <ArrowRight size={15} className="ml-1 inline" />
            </>
          )}
        </button>

        <div className="hidden w-28 sm:block sm:w-32" aria-hidden />
      </div>
    </footer>
  )
}
