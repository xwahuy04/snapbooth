import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site'

type PageSeoOptions = {
  title: string
  description?: string
  path?: string
  /** Halaman privat (booth, galeri) — jangan diindeks Google */
  noIndex?: boolean
}

/** Metadata per halaman; root layout menyediakan template title & defaults. */
export function pageMetadata({
  title,
  description = siteConfig.description,
  path = '',
  noIndex = false,
}: PageSeoOptions): Metadata {
  const canonical = `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`

  return {
    title,
    description,
    keywords: [...siteConfig.keywords],
    alternates: { canonical },
    ...(noIndex && { robots: { index: false, follow: false } }),
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteConfig.name}`,
      description,
    },
  }
}
