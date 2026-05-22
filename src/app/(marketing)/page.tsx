import Link from 'next/link'
import { Camera, LogOut } from 'lucide-react'
import FeaturesSection from '@/components/home/FeaturesSection'
import FooterCtaSection from '@/components/home/FooterCtaSection'
import HeroSection from '@/components/home/HeroSection'
import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import { auth } from '@/lib/auth'
import { signOut } from 'next-auth/react'

export default async function HomePage() {
  const session = await auth()

  async function handleSignOut() {
    'use server'
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  return (
    <main className="page-shell">
      <SiteHeader
        action={
          session?.user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted">Halo, {session.user.email}</span>
              <Link href="/gallery">
                <button className="btn-secondary px-5 py-2.5 text-[13px]">
                  <Camera size={14} /> Galeri Saya
                </button>
              </Link>
              <form action={handleSignOut}>
                <button className="btn-ghost px-3 py-2.5 text-[13px]" title="Keluar">
                  <LogOut size={14} />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <button className="btn-ghost px-5 py-2.5 text-[13px]">
                  Masuk
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="btn-primary px-5 py-2.5 text-[13px]">
                  <Camera size={14} /> Daftar
                </button>
              </Link>
            </div>
          )
        }
      />

      <HeroSection />
      <div className="relative z-10 h-px bg-border" />
      <FeaturesSection />
      <FooterCtaSection />
      <SiteFooter />
    </main>
  )
}
