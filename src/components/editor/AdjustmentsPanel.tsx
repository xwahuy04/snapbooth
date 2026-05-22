'use client'

import { RotateCcw } from 'lucide-react'
import type { EditorAdjustments } from '@/types'

interface AdjustmentsPanelProps {
  adjustments: EditorAdjustments
  onChange: (partial: Partial<EditorAdjustments>) => void
  onReset: () => void
}

function SliderRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <label className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-muted">{label}</span>
        <span className="font-mono text-foreground">{value}%</span>
      </div>
      <input
        type="range"
        min={50}
        max={150}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-accent h-2 w-full cursor-pointer"
      />
    </label>
  )
}

export default function AdjustmentsPanel({ adjustments, onChange, onReset }: AdjustmentsPanelProps) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs leading-relaxed text-muted">
        Haluskan foto sebelum export — perubahan langsung terlihat di kanvas.
      </p>
      <SliderRow
        label="Kecerahan"
        value={adjustments.brightness}
        onChange={(brightness) => onChange({ brightness })}
      />
      <SliderRow
        label="Kontras"
        value={adjustments.contrast}
        onChange={(contrast) => onChange({ contrast })}
      />
      <SliderRow
        label="Saturasi"
        value={adjustments.saturation}
        onChange={(saturation) => onChange({ saturation })}
      />
      <button type="button" className="btn-ghost w-fit text-xs" onClick={onReset}>
        <RotateCcw size={13} /> Reset ke default
      </button>
    </div>
  )
}
