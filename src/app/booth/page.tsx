import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import BoothWorkspace from '@/components/booth/BoothWorkspace'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Studio Foto',
  description: 'Ambil foto dan edit strip Anda di booth SnapBooth.',
  path: '/booth',
  noIndex: true,
})

export default async function BoothPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  return <BoothWorkspace />
}
