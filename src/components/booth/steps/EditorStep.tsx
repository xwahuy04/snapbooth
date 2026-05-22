'use client'

import CaptionEditor from '@/components/editor/CaptionEditor'
import FilterPanel from '@/components/editor/FilterPanel'
import StickerPanel from '@/components/editor/StickerPanel'
import Panel from '@/components/ui/Panel'
import StepHeader from '@/components/ui/StepHeader'
import { buildPreviewSlots, getPreviewGridClass } from '@/lib/layout-utils'
import { cn } from '@/lib/cn'
import { usePhotoBoothContext } from '@/providers/PhotoBoothProvider'
import { FILTERS, THEMES } from '@/lib/data'

export default function EditorStep() {
  const booth = usePhotoBoothContext()
  const theme = THEMES.find((t) => t.id === booth.editor.activeTheme) ?? THEMES[0]
  const filter = FILTERS.find((f) => f.id === booth.editor.activeFilter) ?? FILTERS[0]
  const previewSlots = buildPreviewSlots(booth.editor.shots, booth.selectedLayout.shotCount)
  const gridClass = getPreviewGridClass(booth.selectedLayout.id)

  return (
    <div className="flex w-full animate-fade-in flex-col gap-8 lg:gap-10">
      <StepHeader
        title="Edit Strip"
        description="Sesuaikan filter, stiker, dan caption. Ruang kerja luas agar mudah dipilih."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
        <aside className="lg:col-span-5 xl:col-span-4">
          <div className="panel panel-spacious lg:sticky lg:top-24">
            <p className="section-label mb-4">Pratinjau Strip</p>
            <div
              className={cn('grid gap-4 rounded-2xl p-5 sm:p-6', gridClass)}
              style={{ background: theme.backgroundColor }}
            >
              {previewSlots.map((shot, i) => (
                <div
                  key={shot?.id ?? `preview-${i}`}
                  className="aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-black/15 shadow-sm"
                >
                  {shot ? (
                    <img
                      src={shot.dataUrl}
                      alt={`Shot ${i + 1}`}
                      className="h-full w-full object-cover"
                      style={{ filter: filter.css !== 'none' ? filter.css : undefined }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted">
                      Foto {i + 1}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex flex-col gap-6 pb-28 sm:gap-8 lg:col-span-7 xl:col-span-8">
          <Panel spacious title="Filter Foto" description="Pilih gaya warna untuk seluruh strip">
            <FilterPanel
              activeFilterId={booth.editor.activeFilter}
              previewDataUrl={booth.editor.shots[0]?.dataUrl}
              onSelect={booth.setFilter}
              spacious
            />
          </Panel>

          <Panel spacious title="Stiker" description="Ketuk emoji untuk menambahkan ke strip">
            <StickerPanel onAdd={booth.addSticker} spacious />
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
    </div>
  )
}
