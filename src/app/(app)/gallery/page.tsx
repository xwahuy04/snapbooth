import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Camera, Image, LogOut } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import PageContainer from '@/components/ui/PageContainer'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { pageMetadata } from '@/lib/seo'
import SignOutButton from '@/components/auth/SignOutButton'
import GalleryGrid from '@/components/gallery/GalleryGrid'

export const metadata = pageMetadata({
  title: 'Galeri Saya',
  path: '/gallery',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

export default async function GalleryPage() {
  // Check authentication
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  // Fetch only user's sessions
  const sessions = await prisma.session.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <AppShell
      headerAction={
        <div className="flex items-center gap-2">
          <Link href="/booth">
            <button className="btn-primary text-xs">
              <Camera size={13} /> Mulai Foto
            </button>
          </Link>
          <SignOutButton
            callbackUrl="/"
            className="btn-secondary text-xs"
            title="Keluar"
          >
            <LogOut size={13} />
          </SignOutButton>
        </div>
      }
    >
      <PageContainer size="wide" className="flex-1">
        <header className="mb-10">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft size={12} /> Kembali ke Home
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Galeri Foto Strip Saya
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
                Menampilkan {sessions.length} foto Anda
              </p>
            </div>
            <div className="text-right text-sm text-muted">
              <p>Terlogin sebagai:</p>
              <p className="font-semibold text-foreground">{session.user.email}</p>
            </div>
          </div>
        </header>

        {sessions.length === 0 ? (
          <EmptyGallery />
        ) : (
          <GalleryGrid
            sessions={sessions.map((s) => ({
              ...s,
              createdAt: s.createdAt.toISOString(),
            }))}
          />
        )}
      </PageContainer>
    </AppShell>
  )
}

function EmptyGallery() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface-raised py-24 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-accent">
        <Image size={28} />
      </div>
      <h3 className="font-display mb-2 text-lg font-semibold text-foreground">Belum ada foto strip</h3>
      <p className="mb-8 max-w-xs text-sm leading-relaxed text-muted">
        Mulai ambil foto sekarang dan simpan ke galeri pribadi Anda!
      </p>
      <Link href="/booth">
        <button className="btn-primary text-sm">
          <Camera size={15} /> Mulai Foto Sekarang
        </button>
      </Link>
    </div>
  )
}
