'use client'

import type { BoothStep } from '@/types'

const STEPS: { id: BoothStep; label: string; emoji: string }[] = [
  { id: 'theme',  label: 'Tema',   emoji: '🎨' },
  { id: 'camera', label: 'Foto',   emoji: '📷' },
  { id: 'editor', label: 'Edit',   emoji: '✏️' },
  { id: 'result', label: 'Hasil',  emoji: '🖼' },
]

const ORDER: BoothStep[] = ['theme', 'camera', 'editor', 'result']

interface StepIndicatorProps {
  currentStep: BoothStep
  accentColor?: string
}

export default function StepIndicator({
  currentStep,
  accentColor = '#ff2d78',
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
              style={{ minWidth: 60 }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  background: active
                    ? accentColor
                    : done
                    ? `${accentColor}33`
                    : 'rgba(255,255,255,0.06)',
                  border: active
                    ? `2px solid ${accentColor}`
                    : done
                    ? `2px solid ${accentColor}55`
                    : '2px solid rgba(255,255,255,0.1)',
                  color: active ? '#fff' : done ? accentColor : 'rgba(255,255,255,0.3)',
                  boxShadow: active ? `0 0 12px ${accentColor}66` : 'none',
                }}
              >
                {done ? '✓' : step.emoji}
              </div>
              <span
                className="font-mono text-[10px]"
                style={{
                  color: active
                    ? accentColor
                    : done
                    ? `${accentColor}88`
                    : 'rgba(255,255,255,0.2)',
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                className="h-0.5 w-8 mb-5 transition-all"
                style={{
                  background: i < currentIdx
                    ? accentColor
                    : 'rgba(255,255,255,0.08)',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
