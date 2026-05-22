'use client'

import { cn } from '@/lib/cn'

export type EditorTabId = 'filter' | 'adjust' | 'frame' | 'background' | 'sticker' | 'text'

const TABS: { id: EditorTabId; label: string; emoji: string }[] = [
  { id: 'filter', label: 'Filter', emoji: '🎨' },
  { id: 'adjust', label: 'Atur', emoji: '☀️' },
  { id: 'frame', label: 'Bingkai', emoji: '🖼️' },
  { id: 'background', label: 'Latar', emoji: '🎭' },
  { id: 'sticker', label: 'Stiker', emoji: '✨' },
  { id: 'text', label: 'Teks', emoji: '✍️' },
]

interface EditorToolTabsProps {
  active: EditorTabId
  onChange: (tab: EditorTabId) => void
}

export default function EditorToolTabs({ active, onChange }: EditorToolTabsProps) {
  return (
    <div className="flex border-b border-border overflow-x-auto scrollbar-thin">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn('editor-tab shrink-0', active === tab.id && 'editor-tab-active')}
        >
          <span>{tab.emoji}</span>
          {tab.label}
        </button>
      ))}
    </div>
  )
}
