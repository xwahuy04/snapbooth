import BoothWorkspace from '@/components/booth/BoothWorkspace'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Studio Foto',
  description: 'Ambil foto dan edit strip Anda di booth SnapBooth.',
  path: '/booth',
  noIndex: true,
})

export default function BoothPage() {
  return <BoothWorkspace />
}
