import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export default async function LocationPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'locations',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (!docs[0]) return notFound()
  const location = docs[0]
  const address = location.address

  return (
    <div className="page location-detail">
      <nav className="breadcrumb">
        <Link href="/locations">Locations</Link>
        <span aria-hidden>/</span>
        <span>{location.name}</span>
      </nav>
      <h1>{location.name}</h1>
      {location.tagline && <p className="tagline">{location.tagline}</p>}
      {location.waitingListOnly && (
        <p className="badge">Waiting list only</p>
      )}
      {address && (address.street || address.postcode) && (
        <p className="address">
          {[address.street, address.city, address.postcode].filter(Boolean).join(', ')}
        </p>
      )}
      {location.nearestTube && (
        <p>Nearest tube: {location.nearestTube}</p>
      )}
      <Link href="/locations" className="back-link">
        ← Back to locations
      </Link>
    </div>
  )
}

