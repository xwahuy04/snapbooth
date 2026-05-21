import Link from 'next/link'
import { Camera, ImageIcon, Sparkles, Download, Smartphone, Palette } from 'lucide-react'

export default function HomePage() {
  const features = [
    { icon: <Camera size={20} />,     title: 'Live Camera',    desc: 'Langsung dari kamera perangkatmu dengan auto mirror effect' },
    { icon: <Palette size={20} />,    title: '8+ Tema Frame',  desc: 'Midnight, Sakura, Film 35mm, Retro 90s, dan tema aesthetic lainnya' },
    { icon: <Sparkles size={20} />,   title: 'Filter & Stiker',desc: '9 filter foto eksklusif dan puluhan stiker ekspresif' },
    { icon: <ImageIcon size={20} />,  title: 'Photo Strip',    desc: 'Layout strip vertikal klasik atau grid modern 2×2' },
    { icon: <Download size={20} />,   title: 'Download Gratis',desc: 'Ekspor hasil foto berkualitas tinggi secara instan dalam format PNG' },
    { icon: <Smartphone size={20} />, title: 'Mobile Friendly',desc: 'Didesain optimal untuk smartphone, tablet, maupun laptop' },
  ]

  const themes = [
    { bg: '#0a0a1a', accent: '#ff2d78', label: 'Midnight' },
    { bg: '#fce4ec', accent: '#e91e8c', label: 'Sakura' },
    { bg: '#1a1410', accent: '#d4a84b', label: 'Film' },
    { bg: '#1a0533', accent: '#00e5ff', label: 'Retro' },
    { bg: '#ffffff', accent: '#111111', label: 'Clean' },
  ]

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div className="glowing-orb orb-indigo" aria-hidden />
      <div className="glowing-orb orb-purple" aria-hidden />

      {/* ── Navbar ── */}
      <nav
        className="sticky top-0 z-50 w-full"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-header-rgba)', backdropFilter: 'blur(16px)' }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between" style={{ height: 64 }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-blue)', boxShadow: 'var(--shadow-blue)' }}>
              <Camera size={17} className="text-white" />
            </div>
            <span className="font-display font-extrabold text-xl" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              Snap<span style={{ color: 'var(--accent-blue-light)' }}>Booth</span>
            </span>
          </div>
          <Link href="/booth">
            <button className="btn-primary" style={{ padding: '9px 20px', fontSize: 13 }}>
              <Camera size={14} /> Mulai Foto
            </button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 w-full">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col items-center text-center" style={{ paddingTop: 88, paddingBottom: 80, gap: 28 }}>
          <div className="badge">
            <Sparkles size={12} style={{ color: 'var(--accent-blue-light)' }} />
            Photo Studio di Browser Kamu
          </div>

          <h1
            className="font-display font-extrabold w-full"
            style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)', letterSpacing: '-0.04em', color: 'var(--text-primary)', lineHeight: 1.15, maxWidth: 780 }}
          >
            Buat <span className="gradient-text">Foto Strip</span>
            <br />yang Memorable
          </h1>

          <p
            className="font-display"
            style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 500 }}
          >
            Buat photo strip keren langsung di browser. Pilih tema, ambil foto,
            tambahkan filter &amp; stiker — download dalam hitungan detik.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/booth">
              <button className="btn-primary" style={{ padding: '13px 32px', fontSize: 15 }}>
                <Camera size={17} /> Mulai Sekarang
              </button>
            </Link>
            <Link href="/gallery">
              <button className="btn-secondary" style={{ padding: '13px 32px', fontSize: 15 }}>
                <ImageIcon size={17} /> Lihat Galeri
              </button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 justify-center" style={{ marginTop: 4 }}>
            {themes.map((t) => (
              <div
                key={t.label}
                className="flex items-center gap-2 rounded-full font-display"
                style={{ padding: '7px 16px', fontSize: 12, fontWeight: 500, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                <span style={{ display: 'inline-block', width: 13, height: 13, borderRadius: '50%', background: t.bg, border: `2px solid ${t.accent}`, boxShadow: `0 0 7px ${t.accent}55`, flexShrink: 0 }} />
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: 'var(--border)', position: 'relative', zIndex: 10 }} />

      {/* ── Features ── */}
      <section className="relative z-10 w-full" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center" style={{ marginBottom: 52 }}>
            <div className="badge" style={{ marginBottom: 16 }}>Fitur Unggulan</div>
            <h2 className="font-display font-extrabold" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 12 }}>
              Semua yang kamu butuhkan
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Tanpa install, tanpa registrasi — langsung pakai di browser Anda
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {features.map((f) => (
              <div key={f.title} className="card" style={{ padding: 24 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-blue-50)', color: 'var(--accent-blue-light)', border: '1px solid rgba(99,102,241,0.15)', marginBottom: 16 }}>
                  {f.icon}
                </div>
                <h3 className="font-display font-bold" style={{ fontSize: 15, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.3 }}>
                  {f.title}
                </h3>
                <p className="word-break" style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="relative z-10 w-full text-center" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 540, margin: '0 auto' }}>
          <h3 className="font-display font-extrabold" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--text-primary)', letterSpacing: '-0.025em', lineHeight: 1.25, marginBottom: 12 }}>
            Siap untuk mencoba?
          </h3>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32 }}>
            Tidak perlu daftar. Tidak perlu install.<br />
            Langsung pakai dan abadikan momenmu.
          </p>
          <Link href="/booth">
            <button className="btn-primary" style={{ padding: '13px 36px', fontSize: 15 }}>
              <Sparkles size={17} /> Coba Gratis Sekarang
            </button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 w-full flex items-center justify-between flex-wrap gap-2" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-primary)', padding: '20px 32px' }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>© 2026 SnapBooth</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Built with Next.js & Tailwind CSS</span>
      </footer>
    </main>
  )
}