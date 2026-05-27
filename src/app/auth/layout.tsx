import type { ReactNode } from 'react'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Masuk',
  path: '/auth',
  noIndex: true,
})

export default function AuthLayout({ children }: { children: ReactNode }) {
  return children
}
