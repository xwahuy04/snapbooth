/** Konfigurasi situs untuk SEO, Open Graph, sitemap, dan robots. */
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? 'SnapBooth',
  url: (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  description:
    'Buat photo strip digital dengan frame, filter, dan stiker. Photobooth online gratis — langsung dari browser.',
  locale: 'id_ID',
  keywords: [
    'photobooth online',
    'photo strip',
    'foto booth',
    'filter foto',
    'frame foto',
    'selfie strip',
  ],
} as const
