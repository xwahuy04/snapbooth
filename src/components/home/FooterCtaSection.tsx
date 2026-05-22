import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function FooterCtaSection() {
  return (
    <section className="relative z-10 w-full border-t border-border bg-surface-raised px-6 py-20 text-center sm:py-24">
      <div className="mx-auto max-w-lg">
        <h3 className="font-display mb-4 text-[clamp(1.5rem,3vw,2rem)] font-extrabold leading-tight tracking-tight text-foreground">
          Siap untuk mencoba?
        </h3>
        <p className="mb-9 text-[15px] leading-relaxed text-muted">
          Tidak perlu daftar. Tidak perlu install.
          <br />
          Langsung pakai dan abadikan momenmu.
        </p>
        <Link href="/booth">
          <button className="btn-primary px-10 py-3.5 text-[15px]">
            <Sparkles size={17} /> Coba Gratis Sekarang
          </button>
        </Link>
      </div>
    </section>
  )
}
