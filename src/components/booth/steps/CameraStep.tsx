'use client'

import CameraView from '@/components/booth/CameraView'
import ShotStrip from '@/components/booth/ShotStrip'
import StepHeader from '@/components/ui/StepHeader'
import { usePhotoBoothContext } from '@/providers/PhotoBoothProvider'
import { FILTERS, THEMES } from '@/lib/data'

export default function CameraStep() {
  const { editor, selectedLayout, addShot, removeShot } = usePhotoBoothContext()
  const theme = THEMES.find((t) => t.id === editor.activeTheme) ?? THEMES[0]
  const filter = FILTERS.find((f) => f.id === editor.activeFilter) ?? FILTERS[0]

  return (
    <div className="mx-auto flex w-full max-w-2xl animate-fade-in flex-col gap-8">
      <StepHeader
        title="Ambil Foto"
        description={
          <>
            Dibutuhkan <span className="font-bold text-accent-light">{selectedLayout.shotCount}</span> foto
            untuk layout <span className="font-semibold text-foreground">{selectedLayout.label}</span>
          </>
        }
      />

      <div className="panel panel-spacious">
        <CameraView
          filter={filter}
          onCapture={addShot}
          shotsTaken={editor.shots.length}
          shotsNeeded={selectedLayout.shotCount}
        />
      </div>

      <div className="panel">
        <ShotStrip
          shots={editor.shots}
          shotsNeeded={selectedLayout.shotCount}
          onRemove={removeShot}
        />
      </div>
    </div>
  )
}
