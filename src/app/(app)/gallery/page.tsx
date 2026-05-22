import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Camera, Image, LogOut } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import PageContainer from '@/components/ui/PageContainer'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { THEMES } from '@/lib/data'
import { signOut } from 'next-auth/react'

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

  async function handleSignOut() {
    'use server'
    await signOut({ redirect: true, callbackUrl: '/auth/login' })
  }

  return (
    <AppShell
      headerAction={
        <div className="flex items-center gap-2">
          <Link href="/booth">
            <button className="btn-primary text-xs">
              <Camera size={13} /> Mulai Foto
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

        {sessions.length === 0 ? <EmptyGallery /> : <GalleryGrid sessions={sessions} />}
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

interface GallerySession {
  id: string
  imageUrl: string
  themeId: string
  createdAt: Date
}

function GalleryGrid({ sessions }: { sessions: GallerySession[] }) {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
      {sessions.map((session) => {
        const theme = THEMES.find((t) => t.id === session.themeId) ?? THEMES[0]
        return (
          <Link key={session.id} href={`/result/${session.id}`} className="group flex flex-col">
            <div
              className="overflow-hidden rounded-xl border border-border p-3 shadow-sm transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg"
              style={{ background: theme.backgroundColor }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={session.imageUrl}
                alt="Saved Photo Strip"
                className="h-auto w-full rounded-lg object-cover"
                loading="lazy"
              />
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
