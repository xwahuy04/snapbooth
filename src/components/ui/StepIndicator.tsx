'use client'

import { cn } from '@/lib/cn'
import type { BoothStep } from '@/types'

const STEPS: { id: BoothStep; label: string; number: number }[] = [
  { id: 'theme', label: 'Tema', number: 1 },
  { id: 'camera', label: 'Foto', number: 2 },
  { id: 'editor', label: 'Edit', number: 3 },
  { id: 'result', label: 'Hasil', number: 4 },
]

const ORDER: BoothStep[] = ['theme', 'camera', 'editor', 'result']

interface StepIndicatorProps {
  currentStep: BoothStep
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIdx = ORDER.indexOf(currentStep)

  return (
    <nav className="flex items-center justify-center" aria-label="Langkah booth">
      {STEPS.map((step, i) => {
        const done = i < currentIdx
        const active = i === currentIdx

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex min-w-[52px] flex-col items-center gap-1 sm:min-w-[56px]">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all',
                  active && 'bg-accent text-white shadow-glow ring-2 ring-accent-ring',
                  done && !active && 'border border-accent-ring bg-accent-soft text-accent-light',
                  !active && !done && 'border border-border bg-surface-muted text-subtle'
                )}
              >
                {done ? '✓' : step.number}
              </div>
              <span
                className={cn(
                  'text-[10px] font-semibold',
                  active || done ? 'text-accent-light' : 'text-subtle'
                )}
              >
                {step.label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'mb-5 h-0.5 w-4 rounded-full sm:w-6',
                  i < currentIdx ? 'bg-accent' : 'bg-border'
                )}
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}
