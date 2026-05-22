import { HOME_FEATURES } from '@/lib/constants/home'

export default function FeaturesSection() {
  return (
    <section className="relative z-10 w-full py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <header className="mb-14 text-center">
          <div className="badge mb-5">Fitur Unggulan</div>
          <h2 className="font-display mb-4 text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-tight tracking-tight text-foreground">
            Semua yang kamu butuhkan
          </h2>
          <p className="mx-auto max-w-lg text-[15px] leading-relaxed text-muted">
            Tanpa install, tanpa registrasi — langsung pakai di browser Anda
          </p>
        </header>

        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          {HOME_FEATURES.map(({ icon: Icon, title, desc }) => (
            <article key={title} className="card p-6 sm:p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-accent-ring bg-accent-soft text-accent-light">
                <Icon size={22} />
              </div>
              <h3 className="font-display mb-2.5 text-base font-bold leading-snug text-foreground">
                {title}
              </h3>
              <p className="word-break text-sm leading-relaxed text-muted">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
