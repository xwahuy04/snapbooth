'use client'

import type { BoothStep } from '@/types'

const STEPS: { id: BoothStep; label: string; number: number }[] = [
  { id: 'theme',  label: 'Tema',   number: 1 },
  { id: 'camera', label: 'Foto',   number: 2 },
  { id: 'editor', label: 'Edit',   number: 3 },
  { id: 'result', label: 'Hasil',  number: 4 },
]

const ORDER: BoothStep[] = ['theme', 'camera', 'editor', 'result']

interface StepIndicatorProps {
  currentStep: BoothStep
  accentColor?: string
}

export default function StepIndicator({
  currentStep,
}: StepIndicatorProps) {
  const currentIdx = ORDER.indexOf(currentStep)

  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, i) => {
        const done = i < currentIdx
        const active = i === currentIdx

        return (
          <div key={step.id} className="flex items-center">
            {/* Step bubble */}
            <div
              className="flex flex-col items-center gap-1"
              style={{ minWidth: 56 }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all"
                style={{
                  background: active
                    ? 'var(--accent-blue)'
                    : done
                    ? 'var(--accent-blue-50)'
                    : 'var(--bg-muted)',
                  border: active
                    ? '2px solid var(--accent-blue)'
                    : done
                    ? '2px solid var(--accent-blue-100)'
                    : '2px solid var(--border)',
                  color: active ? '#fff' : done ? 'var(--accent-blue)' : 'var(--text-muted)',
                  boxShadow: active ? 'var(--shadow-blue)' : 'none',
                }}
              >
                {done ? '✓' : step.number}
              </div>
              <span
                className="text-[10px] font-medium"
                style={{
                  color: active
                    ? 'var(--accent-blue)'
                    : done
                    ? 'var(--accent-blue)'
                    : 'var(--text-muted)',
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                className="h-0.5 w-6 mb-5 transition-all rounded-full"
                style={{
                  background: i < currentIdx
                    ? 'var(--accent-blue)'
                    : 'var(--border)',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
