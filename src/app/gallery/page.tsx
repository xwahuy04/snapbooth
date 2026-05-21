import { prisma } from '@/lib/prisma'
import { THEMES } from '@/lib/data'
import Link from 'next/link'
import { ArrowLeft, Camera } from 'lucide-react'

// Force dynamic rendering so the page fetches the latest data on every request
export const dynamic = 'force-dynamic'

export default async function GalleryPage() {
  // Fetch all saved sessions from Supabase, sorted by newest first
  const sessions = await prisma.session.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'rgba(10,10,15,0.95)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Link href="/" className="font-display font-black text-2xl tracking-tight">
          <span className="gradient-text">SnapBooth</span>
        </Link>
        <Link href="/booth">
          <button className="btn-primary text-xs flex items-center gap-1.5 py-2 px-4">
            <Camera size={13} />
            Mulai Foto
          </button>
        </Link>
      </header>

      {/* Content Container */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 flex flex-col">
        <div className="mb-8">
          <Link
            href="/"
            className="text-xs font-mono flex items-center gap-1 hover:underline mb-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft size={12} /> Kembali ke Home
          </Link>
          <h1 className="font-display font-black text-3xl mb-1">Galeri Foto Strip</h1>
          <p className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
            Menampilkan {sessions.length} hasil karya foto dari studio
          </p>
        </div>

        {sessions.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20 border border-dashed rounded-2xl"
               style={{ borderColor: 'var(--border)' }}>
            <span className="text-4xl mb-4">🖼️</span>
            <h3 className="font-display font-bold text-lg mb-1">Belum ada foto strip</h3>
            <p className="font-mono text-xs max-w-xs mb-6" style={{ color: 'var(--text-secondary)' }}>
              Jadilah orang pertama yang mengabadikan momen di SnapBooth!
            </p>
            <Link href="/booth">
              <button className="btn-primary text-xs">📷 Mulai Foto Sekarang</button>
            </Link>
          </div>
        ) : (
          /* Photos Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {sessions.map((session) => {
              const theme = THEMES.find((t) => t.id === session.themeId) ?? THEMES[0]
              return (
                <Link
                  key={session.id}
                  href={`/result/${session.id}`}
                  className="group flex flex-col"
                >
                  <div
                    className="rounded-xl overflow-hidden p-2.5 transition-all duration-300 group-hover:scale-[1.02]"
                    style={{
                      background: theme.backgroundColor,
                      border: `1px solid ${theme.accentColor}33`,
                      boxShadow: `0 4px 20px -5px ${theme.accentColor}11`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={session.imageUrl}
                      alt="Saved Photo Strip"
                      className="w-full h-auto rounded-lg object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-2.5 px-1 flex items-center justify-between">
                    <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {new Date(session.createdAt).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                    <span className="text-xs filter grayscale group-hover:grayscale-0 transition-all">
                      {theme.emoji || '✨'}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
