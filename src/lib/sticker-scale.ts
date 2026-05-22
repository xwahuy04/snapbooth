/**
 * Ukuran stiker disimpan untuk lebar strip referensi (strip vertikal 1 kolom).
 * Pratinjau & export memakai skala yang sama agar WYSIWYG.
 */
export const STICKER_REF_STRIP_WIDTH = 520

/** Skala px stiker ke lebar kontainer/kanvas aktual */
export function scaleStickerSize(editorSize: number, containerWidth: number): number {
  if (containerWidth <= 0) return editorSize
  return Math.round((editorSize / STICKER_REF_STRIP_WIDTH) * containerWidth)
}
