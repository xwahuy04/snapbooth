import Link from 'next/link'
import { Camera } from 'lucide-react'
import FeaturesSection from '@/components/home/FeaturesSection'
import FooterCtaSection from '@/components/home/FooterCtaSection'
import HeroSection from '@/components/home/HeroSection'
import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'

export default function HomePage() {
  return (
    <main className="page-shell">
      <SiteHeader
        action={
          <Link href="/booth">
            <button className="btn-primary px-5 py-2.5 text-[13px]">
              <Camera size={14} /> Mulai Foto
            </button>
          </Link>
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
