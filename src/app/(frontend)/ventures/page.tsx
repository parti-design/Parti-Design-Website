import { VenturesPage } from '@/components/VenturesPage'
import { queryAllVentures } from '@/lib/payload-queries'

export default async function Page() {
  const ventures = await queryAllVentures()
  return <VenturesPage ventures={ventures} />
}

export const metadata = {
  title: 'Ventures — Parti Design',
  description:
    'Alongside client work, Parti Design incubates its own projects: Massvis, Umeå Kallbad, and DIT Egnahem.',
}
