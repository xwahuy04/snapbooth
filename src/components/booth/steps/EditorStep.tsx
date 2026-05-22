'use client'

import { useState } from 'react'
import AdjustmentsPanel from '@/components/editor/AdjustmentsPanel'
import CaptionEditor from '@/components/editor/CaptionEditor'
import EditorToolTabs, { type EditorTabId } from '@/components/editor/EditorToolTabs'
import FilterPanel from '@/components/editor/FilterPanel'
import FrameStylePanel from '@/components/editor/FrameStylePanel'
import StickerPanel from '@/components/editor/StickerPanel'
import StripPreviewEditor from '@/components/editor/StripPreviewEditor'
import Panel from '@/components/ui/Panel'
import StepHeader from '@/components/ui/StepHeader'
import { buildPhotoFilterCss } from '@/lib/filter-utils'
import { usePhotoBoothContext } from '@/providers/PhotoBoothProvider'
import { THEMES } from '@/lib/data'

export default function EditorStep() {
  const booth = usePhotoBoothContext()
  const theme = THEMES.find((t) => t.id === booth.editor.activeTheme) ?? THEMES[0]
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<EditorTabId>('filter')

  const previewFilter = buildPhotoFilterCss(booth.editor.activeFilter, booth.editor.adjustments)

  const handleAddSticker = (emoji: string) => {
    const id = booth.addSticker(emoji)
    setSelectedStickerId(id)
    setActiveTab('sticker')
  }

  const handleRemoveSticker = (id: string) => {
    booth.removeSticker(id)
    if (selectedStickerId === id) setSelectedStickerId(null)
  }

  return (
    <div className="flex w-full animate-fade-in flex-col gap-8 lg:gap-10">
      <StepHeader
        title="Studio Edit"
        description="20 tema · 16 filter · atur cahaya, bingkai, stiker & teks. Semua langsung terlihat di kanvas."
      />

      <section className="panel panel-spacious">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="section-label">Kanvas Strip</p>
            <p className="mt-1 text-sm text-muted">Hasil export mengikuti pengaturan di bawah</p>
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
          filterCss={previewFilter}
          frameStyle={booth.editor.frameStyle}
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

      <div className="panel panel-spacious flex flex-col gap-6 pb-32">
        <EditorToolTabs active={activeTab} onChange={setActiveTab} />

        {activeTab === 'filter' && (
          <FilterPanel
            activeFilterId={booth.editor.activeFilter}
            previewDataUrl={booth.editor.shots[0]?.dataUrl}
            adjustments={booth.editor.adjustments}
            onSelect={booth.setFilter}
            spacious
          />
        )}

        {activeTab === 'adjust' && (
          <AdjustmentsPanel
            adjustments={booth.editor.adjustments}
            onChange={booth.setAdjustments}
            onReset={booth.resetAdjustments}
          />
        )}

        {activeTab === 'frame' && (
          <FrameStylePanel activeStyle={booth.editor.frameStyle} onSelect={booth.setFrameStyle} />
        )}

        {activeTab === 'sticker' && (
          <StickerPanel
            stickers={booth.editor.stickers}
            selectedStickerId={selectedStickerId}
            onAdd={handleAddSticker}
            onSelect={setSelectedStickerId}
            onRemove={handleRemoveSticker}
            onClearAll={booth.clearStickers}
            spacious
          />
        )}

        {activeTab === 'text' && (
          <CaptionEditor
            caption={booth.editor.caption}
            captionColor={booth.editor.captionColor}
            captionSize={booth.editor.captionSize}
            theme={theme}
            onChange={booth.setCaption}
            onColorChange={booth.setCaptionColor}
            onSizeChange={booth.setCaptionSize}
            spacious
          />
        )}
      </div>
    </div>
  )
}
