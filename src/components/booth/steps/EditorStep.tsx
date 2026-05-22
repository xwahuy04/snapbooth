'use client'

import { useState } from 'react'
import CaptionEditor from '@/components/editor/CaptionEditor'
import FilterPanel from '@/components/editor/FilterPanel'
import StickerPanel from '@/components/editor/StickerPanel'
import StripPreviewEditor from '@/components/editor/StripPreviewEditor'
import Panel from '@/components/ui/Panel'
import StepHeader from '@/components/ui/StepHeader'
import { usePhotoBoothContext } from '@/providers/PhotoBoothProvider'
import { FILTERS, THEMES } from '@/lib/data'

export default function EditorStep() {
  const booth = usePhotoBoothContext()
  const theme = THEMES.find((t) => t.id === booth.editor.activeTheme) ?? THEMES[0]
  const filter = FILTERS.find((f) => f.id === booth.editor.activeFilter) ?? FILTERS[0]
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null)

  const handleAddSticker = (emoji: string) => {
    const id = booth.addSticker(emoji)
    setSelectedStickerId(id)
  }

  const handleRemoveSticker = (id: string) => {
    booth.removeSticker(id)
    if (selectedStickerId === id) setSelectedStickerId(null)
  }

  return (
    <div className="flex w-full animate-fade-in flex-col gap-8 lg:gap-12">
      <StepHeader
        title="Edit Strip"
        description="Atur filter & caption, tambah stiker lalu seret di pratinjau. Hasil akhir menyertakan semua stiker."
      />

      {/* Kanvas utama — lebar penuh */}
      <section className="panel panel-spacious">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="section-label">Kanvas Strip</p>
            <p className="mt-1 text-sm text-muted">
              Ketuk emoji stiker, lalu <strong className="text-foreground">seret</strong> di pratinjau untuk menempatkan
            </p>
          </div>
          {booth.editor.stickers.length > 0 && (
            <span className="rounded-full border border-accent-ring bg-accent-soft px-3 py-1 text-xs font-bold text-accent-light">
              {booth.editor.stickers.length} stiker
            </span>
          )}
        </div>

        <StripPreviewEditor
          shots={booth.editor.shots}
          layout={booth.selectedLayout}
          theme={theme}
          filter={filter}
          stickers={booth.editor.stickers}
          selectedStickerId={selectedStickerId}
          onSelectSticker={setSelectedStickerId}
          onMoveSticker={booth.moveSticker}
          onRemoveSticker={handleRemoveSticker}
          onResizeSticker={booth.resizeSticker}
          onRotateSticker={booth.rotateSticker}
          className="w-full"
        />
      </section>

      {/* Alat edit — 3 kolom di layar besar */}
      <div className="grid grid-cols-1 gap-6 pb-32 md:gap-8 xl:grid-cols-3">
        <Panel spacious title="Filter Foto" description="Gaya warna untuk seluruh strip">
          <FilterPanel
            activeFilterId={booth.editor.activeFilter}
            previewDataUrl={booth.editor.shots[0]?.dataUrl}
            onSelect={booth.setFilter}
            spacious
          />
        </Panel>

        <Panel spacious title="Stiker" description="Ketuk emoji — muncul di kanvas, seret untuk atur posisi">
          <StickerPanel
            stickers={booth.editor.stickers}
            selectedStickerId={selectedStickerId}
            onAdd={handleAddSticker}
            onSelect={setSelectedStickerId}
            onRemove={handleRemoveSticker}
            spacious
          />
        </Panel>

        <Panel spacious title="Caption" description="Teks di bagian bawah strip (maks. 40 karakter)">
          <CaptionEditor
            caption={booth.editor.caption}
            captionColor={booth.editor.captionColor}
            theme={theme}
            onChange={booth.setCaption}
            onColorChange={booth.setCaptionColor}
            spacious
          />
        </Panel>
      </div>
    </div>
  )
}
