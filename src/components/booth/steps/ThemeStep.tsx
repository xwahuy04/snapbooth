'use client'

import LayoutPicker from '@/components/booth/LayoutPicker'
import ThemePicker from '@/components/booth/ThemePicker'
import ThemePreview from '@/components/booth/ThemePreview'
import StepHeader from '@/components/ui/StepHeader'
import { usePhotoBoothContext } from '@/providers/PhotoBoothProvider'
import { THEMES } from '@/lib/data'

export default function ThemeStep() {
  const { editor, selectedLayout, setTheme, setLayout } = usePhotoBoothContext()
  const theme = THEMES.find((t) => t.id === editor.activeTheme) ?? THEMES[0]

  return (
    <div className="grid w-full animate-fade-in grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="flex flex-col gap-8 lg:col-span-7">
        <StepHeader
          title="Pilih Gaya Foto"
          description="20 tema aesthetic — filter per kategori. Pilih layout strip di bawah."
        />

        <div className="panel-inset flex flex-col gap-10 p-6 sm:p-8">
          <LayoutPicker selectedLayout={selectedLayout} onSelectLayout={setLayout} />
          <div className="h-px bg-border" />
          <ThemePicker selectedThemeId={editor.activeTheme} onSelectTheme={setTheme} />
        </div>
      </div>

      <div className="lg:col-span-5">
        <ThemePreview theme={theme} layout={selectedLayout} />
      </div>
    </div>
  )
}
