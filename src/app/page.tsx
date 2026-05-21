import Link from 'next/link'

export default function HomePage() {
  const features = [
    { emoji: '📷', title: 'Live Camera', desc: 'Langsung dari kamera perangkatmu, mirror effect otomatis' },
    { emoji: '🎨', title: '8+ Tema Frame', desc: 'Midnight, Sakura, Film 35mm, Retro 90s, dan banyak lagi' },
    { emoji: '✨', title: 'Filter & Stiker', desc: '9 filter foto dan puluhan stiker emoji ekspresif' },
    { emoji: '🖼', title: 'Photo Strip', desc: 'Layout 1, 2, 4 foto vertikal atau grid 2×2' },
    { emoji: '⬇️', title: 'Download Gratis', desc: 'Export langsung sebagai PNG resolusi penuh' },
    { emoji: '📱', title: 'Mobile Friendly', desc: 'Kerja sempurna di HP, tablet, dan laptop' },
  ]

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <span
          className="font-display font-black text-2xl"
          style={{
            background: 'linear-gradient(135deg, #ff2d78, #9b59ff, #00e5ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          SnapBooth
        </span>
        <Link href="/booth">
          <button className="btn-primary text-sm">Mulai Foto →</button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-4xl mx-auto w-full gap-8">
        {/* Badge */}
        <div
          className="font-mono text-xs px-3 py-1.5 rounded-full"
          style={{
            border: '1px solid rgba(255,45,120,0.4)',
            background: 'rgba(255,45,120,0.08)',
            color: '#ff2d78',
          }}
        >
          ✦ Photo Studio di Browser Kamu
        </div>

        {/* Headline */}
        <h1
          className="font-display font-black leading-tight"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}
        >
          <span className="gradient-text">Foto Strip</span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>yang</span>{' '}
          <span
            style={{
              color: 'transparent',
              WebkitTextStroke: '2px var(--accent-cyan)',
            }}
          >
            Memorable
          </span>
        </h1>

        <p
          className="font-display text-lg max-w-xl"
          style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}
        >
          Buat photo strip keren langsung di browser. Pilih tema, ambil foto,
          tambahkan filter & stiker — download dalam hitungan detik.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/booth">
            <button
              className="btn-primary text-base px-8 py-4"
              style={{ background: 'linear-gradient(135deg, #ff2d78, #9b59ff)' }}
            >
              📷 Mulai Sekarang
            </button>
          </Link>
          <Link href="/gallery">
            <button className="btn-secondary text-base px-8 py-4">
              🖼 Lihat Galeri
            </button>
          </Link>
        </div>

        {/* Theme previews */}
        <div className="flex gap-3 justify-center flex-wrap mt-4">
          {[
            { bg: '#0a0a1a', border: '#ff2d78', name: '🌙' },
            { bg: '#fce4ec', border: '#e91e8c', name: '🌸' },
            { bg: '#1a1410', border: '#d4a84b', name: '🎞️' },
            { bg: '#1a0533', border: '#00e5ff', name: '📺' },
            { bg: '#fff',    border: '#111',    name: '◻️' },
          ].map((t, i) => (
            <div
              key={i}
              className="w-14 h-20 rounded-lg flex items-end justify-center pb-2 text-lg transition-transform hover:scale-110 cursor-pointer"
              style={{ background: t.bg, border: `3px solid ${t.border}` }}
            >
              {t.name}
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-5xl mx-auto w-full px-6 py-16">
        <h2
          className="font-mono text-xs mb-8 text-center"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
        >
          FITUR UNGGULAN
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="card p-5 flex flex-col gap-2"
              style={{ borderColor: 'var(--border)' }}
            >
              <span className="text-2xl">{f.emoji}</span>
              <h3 className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                {f.title}
              </h3>
              <p className="font-mono text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section
        className="text-center py-16 px-6"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <p className="font-display text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
          Tidak perlu daftar. Tidak perlu install. Langsung pakai.
        </p>
        <Link href="/booth">
          <button
            className="btn-primary text-base px-10 py-4"
            style={{ background: 'linear-gradient(135deg, #ff2d78, #9b59ff, #00e5ff)' }}
          >
            ✦ Coba Gratis Sekarang
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
          © 2025 SnapBooth
        </span>
        <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
          Built with Next.js
        </span>
      </footer>
    </main>
  )
}
