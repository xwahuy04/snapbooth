import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, RotateCcw, LogOut } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import PageContainer from '@/components/ui/PageContainer'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { THEMES } from '@/lib/data'
import { signOut } from 'next-auth/react'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Hasil Foto',
  path: '/result',
  noIndex: true,
})

interface ResultPageProps {
  params: Promise<{ id: string }>
}

export default async function SavedResultPage({ params }: ResultPageProps) {
  // Check authentication
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const { id } = await params
  const dbSession = await prisma.session.findUnique({ where: { id } })
  
  // Session not found
  if (!dbSession) notFound()

  // Verify ownership
  if (dbSession.userId !== session.user.id) {
    notFound()
  }

  const theme = THEMES.find((t) => t.id === dbSession.themeId) ?? THEMES[0]
  const dateStr = new Date(dbSession.createdAt).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  async function handleSignOut() {
    'use server'
    await signOut({ redirect: true, callbackUrl: '/auth/login' })
  }

  return (
    <AppShell
      headerAction={
        <div className="flex items-center gap-2">
          <Link href="/booth">
            <button className="btn-secondary text-xs">
              <RotateCcw size={13} /> Foto Baru
            </button>
          </Link>
          <form action={handleSignOut}>
            <button className="btn-secondary text-xs" title="Keluar">
              <LogOut size={13} />
            </button>
          </form>
        </div>
      }
    >
      <PageContainer size="narrow" center className="flex-1 items-center justify-center">
        <header className="mb-10 w-full text-center">
          <div className="badge mb-4">✦ Foto Strip Pribadi</div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Preview Hasil Foto
          </h1>
          <p className="mt-3 text-sm text-muted md:text-base">Diambil pada {dateStr}</p>
        </header>

        <div
          className="mb-10 w-full max-w-sm overflow-hidden rounded-2xl border border-border p-5 shadow-xl"
          style={{
            background: theme.backgroundColor,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dbSession.imageUrl}
            alt="SnapBooth Photo Strip"
            className="h-auto w-full rounded-xl"
            style={{ border: `1px solid ${theme.accentColor}22` }}
          />
        </div>

        <div className="flex w-full max-w-xs flex-col gap-4">
          <a
            href={dbSession.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={`snapbooth_${id}.png`}
            className="btn-primary w-full py-3.5 text-center"
          >
            <Download size={16} /> Unduh Resolusi Penuh
          </a>

          <p className="text-center text-xs leading-relaxed text-muted md:text-sm">
            Tips: Di HP, tap dan tahan gambar di atas untuk menyimpan ke galeri.
          </p>

          <div className="flex justify-center gap-3 pt-2">
            <Link
              href="/gallery"
              className="flex items-center gap-2 text-sm font-semibold text-accent-light hover:underline"
            >
              <ArrowLeft size={16} /> Ke Galeri
            </Link>
            <Link
              href="/booth"
              className="flex items-center gap-2 text-sm font-semibold text-accent-light hover:underline"
            >
              <RotateCcw size={16} /> Foto Baru
            </Link>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
