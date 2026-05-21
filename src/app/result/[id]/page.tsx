import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { THEMES } from '@/lib/data'
import { ArrowLeft, Download, RotateCcw, Camera } from 'lucide-react'

interface ResultPageProps {
  params: Promise<{ id: string }>
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params

  const session = await prisma.session.findUnique({ where: { id } })
  if (!session) notFound()

  const theme = THEMES.find((t) => t.id === session.themeId) ?? THEMES[0]

  const dateStr = new Date(session.createdAt).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <main className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-header-rgba)', backdropFilter: 'blur(12px)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-blue)', boxShadow: 'var(--shadow-blue)' }}>
            <Camera size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            SnapBooth
          </span>
        </Link>
        <Link href="/booth">
          <button className="btn-secondary text-xs">
            <RotateCcw size={13} /> Foto Baru
          </button>
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-4 py-8">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
          <div className="text-center mb-8">
            <div className="badge mb-3">✦ Foto Strip Kamu Tersimpan!</div>
            <h1
              className="font-display font-bold text-3xl md:text-4xl mt-3"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.2 }}
            >
              Preview Hasil Foto
            </h1>
            <p
              className="text-sm md:text-base mt-2"
              style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
            >
              Diambil pada {dateStr}
            </p>
          </div>

          {/* Photo strip container */}
          <div className="rounded-2xl overflow-hidden p-4 mb-8 w-full max-w-sm"
            style={{
              background: theme.backgroundColor,
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-xl)',
            }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={session.imageUrl} alt="SnapBooth Photo Strip" className="w-full h-auto rounded-lg"
              style={{ border: `1px solid ${theme.accentColor}22` }} />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full max-w-xs">
          <a href={session.imageUrl} target="_blank" rel="noopener noreferrer"
            download={`snapbooth_${id}.png`} className="btn-primary w-full text-center py-3">
            <Download size={16} /> Unduh Resolusi Penuh
          </a>

          <div className="text-center mt-4">
            <p className="text-xs md:text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Tips: Di HP, kamu juga bisa tap dan tahan gambar di atas untuk menyimpannya langsung ke galeri foto.
            </p>
          </div>

          <div className="flex justify-center mt-4">
            <Link href="/booth" className="text-sm font-semibold flex items-center gap-2 hover:underline"
              style={{ color: 'var(--accent-blue)' }}>
              <ArrowLeft size={16} /> Kembali ke Photo Booth
            </Link>
          </div>
          </div>
        </div>
      </div>
    </main>
  )
}
