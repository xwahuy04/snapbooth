'use client'

import type { BoothLayout } from '@/types'
import LayoutPicker from '@/components/booth/LayoutPicker'
import ThemePicker from '@/components/booth/ThemePicker'

interface ThemeSelectorProps {
  selectedThemeId: string
  selectedLayout: BoothLayout
  onSelectTheme: (id: string) => void
  onSelectLayout: (layout: BoothLayout) => void
}

/** @deprecated Prefer LayoutPicker + ThemePicker directly */
export default function ThemeSelector({
  selectedThemeId,
  selectedLayout,
  onSelectTheme,
  onSelectLayout,
}: ThemeSelectorProps) {
  return (
    <div className="flex flex-col gap-10">
      <LayoutPicker selectedLayout={selectedLayout} onSelectLayout={onSelectLayout} />
      <ThemePicker selectedThemeId={selectedThemeId} onSelectTheme={onSelectTheme} />
    </div>
  )
}
