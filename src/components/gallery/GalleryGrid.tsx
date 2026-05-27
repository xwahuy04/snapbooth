'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trash2, Loader2 } from 'lucide-react'
import { THEMES } from '@/lib/data'
import { deleteSession } from '@/app/actions/deleteSession'

interface GallerySession {
  id: string
  imageUrl: string
  themeId: string
  createdAt: string
}

interface GalleryGridProps {
  sessions: GallerySession[]
}

export default function GalleryGrid({ sessions }: GalleryGridProps) {
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault() // Prevent navigation to detail view
    e.stopPropagation() // Prevent event bubbling

    if (confirm('Apakah Anda yakin ingin menghapus foto strip ini?')) {
      setIsDeletingId(id)
      try {
        const res = await deleteSession(id)
        if (res.error) {
          alert(res.error)
        }
      } catch (err) {
        console.error('Delete error:', err)
        alert('Terjadi kesalahan saat menghapus foto')
      } finally {
        setIsDeletingId(null)
      }
    }
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
      {sessions.map((session) => {
        const theme = THEMES.find((t) => t.id === session.themeId) ?? THEMES[0]
        return (
          <Link
            key={session.id}
            href={`/result/${session.id}`}
            className="group relative flex flex-col"
          >
            <div
              className="relative overflow-hidden rounded-xl border border-border p-3 shadow-sm transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg"
              style={{ background: theme.backgroundColor }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={session.imageUrl}
                alt="Saved Photo Strip"
                className="h-auto w-full rounded-lg object-cover"
                loading="lazy"
              />

              {/* Trash/Delete button overlay */}
              <button
                type="button"
                onClick={(e) => handleDelete(e, session.id)}
                disabled={isDeletingId === session.id}
                className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 text-white backdrop-blur-md transition-all hover:bg-red-600 hover:scale-105 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
                title="Hapus Foto"
              >
                {isDeletingId === session.id ? (
                  <Loader2 size={14} className="animate-spin text-white" />
                ) : (
                  <Trash2 size={14} className="text-white" />
                )}
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between px-0.5">
              <span className="text-[11px] font-medium text-subtle">
                {new Date(session.createdAt).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                })}
              </span>
              <span className="text-sm opacity-60 transition-opacity group-hover:opacity-100">
                {theme.emoji ?? '✨'}
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
