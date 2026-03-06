import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function LocationsPage() {
  const payload = await getPayloadClient()
  const { docs: locations } = await payload.find({
    collection: 'locations',
    sort: 'name',
  })

  return (
    <div className="page locations-page">
      <h1>Find your workspace</h1>
      <p className="lead">Our London spaces</p>
      <ul className="location-list">
        {locations.map((location) => (
          <li key={location.id}>
            <Link href={`/location/${location.slug}`} className="location-card">
              <h2>{location.name}</h2>
              {location.tagline && <p>{location.tagline}</p>}
              {location.waitingListOnly && (
                <span className="badge">Waiting list only</span>
              )}
              <span className="card-link">View location</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
