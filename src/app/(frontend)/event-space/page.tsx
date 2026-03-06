import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function EventSpacePage() {
  const payload = await getPayloadClient()
  const { docs: spaces } = await payload.find({
    collection: 'event-spaces',
    sort: 'name',
  })

  return (
    <div className="page event-space-page">
      <h1>Event spaces</h1>
      <p className="lead">Unique, flexible spaces for parties, launches and workshops.</p>
      <ul className="card-list">
        {spaces.map((space) => (
          <li key={space.id}>
            <Link href={`/event-space/${space.id}`} className="location-card">
              <h2>{space.name}</h2>
              {typeof space.location === 'object' && space.location && (
                <p>Location: {space.location.name}</p>
              )}
              {space.capacity != null && <p>Capacity: {space.capacity}</p>}
              {space.pricePerHour != null && (
                <p>From £{space.pricePerHour}/hour</p>
              )}
              <span className="card-link">View space</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
