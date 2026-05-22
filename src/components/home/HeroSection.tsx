import Link from 'next/link'
import { Camera, ImageIcon, Sparkles } from 'lucide-react'
import ThemeChips from '@/components/home/ThemeChips'

export default function HeroSection() {
  return (
    <section className="relative z-10 w-full">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-5 pb-24 pt-24 text-center sm:px-8 sm:pt-28">
        <div className="badge">
          <Sparkles size={12} className="text-accent-light" />
          Photo Studio di Browser Kamu
        </div>

        <h1 className="font-display w-full max-w-[780px] text-[clamp(2.25rem,5.5vw,4.5rem)] font-extrabold leading-[1.12] tracking-tight text-foreground">
          Buat <span className="gradient-text">Foto Strip</span>
          <br />
          yang Memorable
        </h1>

        <p className="max-w-[520px] text-[clamp(1rem,2vw,1.125rem)] leading-relaxed text-muted">
          Buat photo strip keren langsung di browser. Pilih tema, ambil foto,
          tambahkan filter & stiker — download dalam hitungan detik.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/booth">
            <button className="btn-primary px-9 py-3.5 text-[15px]">
              <Camera size={17} /> Mulai Sekarang
            </button>
          </Link>
          <Link href="/gallery">
            <button className="btn-secondary px-9 py-3.5 text-[15px]">
              <ImageIcon size={17} /> Lihat Galeri
            </button>
          </Link>
        </div>

        <ThemeChips />
      </div>
    </section>
  )
}
