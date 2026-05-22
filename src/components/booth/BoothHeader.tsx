'use client'

import { Camera, RotateCcw } from 'lucide-react'
import StepIndicator from '@/components/ui/StepIndicator'
import { usePhotoBoothContext } from '@/providers/PhotoBoothProvider'

export default function BoothHeader() {
  const { step, resetSession } = usePhotoBoothContext()

  return (
    <header className="site-header">
      <div className="mx-auto grid h-[4.25rem] max-w-[90rem] grid-cols-3 items-center px-5 sm:px-8">
        <div className="flex justify-start">
          <button type="button" onClick={resetSession} className="group flex cursor-pointer items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent shadow-glow transition-transform duration-300 group-hover:rotate-12">
              <Camera size={18} className="text-white" />
            </div>
            <span className="font-display hidden text-xl font-black tracking-tight sm:block">
              Snap<span className="text-accent-light">Booth</span>
            </span>
          </button>
        </div>

        <div className="flex justify-center">
          <StepIndicator currentStep={step} />
        </div>

        <div className="flex justify-end">
          <button type="button" className="btn-ghost cursor-pointer text-xs font-semibold" onClick={resetSession}>
            <RotateCcw size={13} className="mr-1.5" /> Reset
          </button>
        </div>
      </div>
    </header>
  )
}
