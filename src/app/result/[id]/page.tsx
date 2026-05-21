import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { THEMES } from '@/lib/data'
import { ArrowLeft, Download, RotateCcw } from 'lucide-react'

interface ResultPageProps {
  params: Promise<{ id: string }>
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params

  // Fetch session details from Supabase using Prisma
  const session = await prisma.session.findUnique({
    where: { id },
  })

  if (!session) {
    notFound()
  }

  // Find theme styling or fallback to default
  const theme = THEMES.find((t) => t.id === session.themeId) ?? THEMES[0]

  // Format date
  const dateStr = new Date(session.createdAt).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <main
      className="min-h-screen flex flex-col transition-colors duration-500"
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
          <button className="btn-secondary text-xs flex items-center gap-1.5 py-2 px-4">
            <RotateCcw size={13} />
            Foto Baru
          </button>
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-4 py-8">
        <div className="text-center mb-8">
          <div
            className="font-mono text-xs px-3 py-1 rounded-full inline-block mb-3"
            style={{
              border: `1px solid ${theme.accentColor}55`,
              background: `${theme.accentColor}10`,
              color: theme.accentColor,
            }}
          >
            ✦ Foto Strip Kamu Tersimpan!
          </div>
          <h1 className="font-display font-black text-3xl mb-1">Preview Hasil Foto</h1>
          <p className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
            Diambil pada {dateStr}
          </p>
        </div>

        {/* Dynamic Theme Photo Strip Container */}
        <div
          className="rounded-2xl overflow-hidden p-4 mb-8 shadow-2xl transition-all duration-300 w-full max-w-sm mx-auto"
          style={{
            background: theme.backgroundColor,
            border: `2px solid ${theme.accentColor}44`,
            boxShadow: `0 20px 40px -15px ${theme.accentColor}33`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={session.imageUrl}
            alt="SnapBooth Photo Strip"
            className="w-full h-auto rounded-lg"
            style={{
              border: `1px solid ${theme.accentColor}22`,
            }}
          />
        </div>

        {/* Share & Download Actions */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <a
            href={session.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={`snapbooth_${id}.png`}
            className="btn-primary w-full flex items-center justify-center gap-2 text-center"
            style={{
              background: `linear-gradient(135deg, ${theme.accentColor}, var(--accent-purple))`,
            }}
          >
            <Download size={16} />
            Unduh Resolusi Penuh
          </a>
          
          <div className="text-center mt-4">
            <p className="font-mono text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Tips: Di HP, kamu juga bisa tap dan tahan gambar di atas untuk menyimpannya langsung ke galeri foto.
            </p>
          </div>

          <div className="flex justify-center mt-6">
            <Link
              href="/booth"
              className="text-sm font-semibold flex items-center gap-2 hover:underline"
              style={{ color: theme.accentColor }}
            >
              <ArrowLeft size={16} />
              Kembali ke Photo Booth
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
