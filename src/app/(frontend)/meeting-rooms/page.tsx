import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function MeetingRoomsPage() {
  const payload = await getPayloadClient()
  const { docs: rooms } = await payload.find({
    collection: 'meeting-rooms',
    sort: 'name',
  })

  return (
    <div className="page meeting-rooms-page">
      <h1>Meeting rooms</h1>
      <p className="lead">Sleek, flexible and adaptable spaces for your needs.</p>
      <ul className="card-list">
        {rooms.map((room) => (
          <li key={room.id}>
            <Link href={`/meeting-rooms/${room.id}`} className="location-card">
              <h2>{room.name}</h2>
              {typeof room.location === 'object' && room.location && (
                <p>Location: {room.location.name}</p>
              )}
              {room.capacity != null && <p>Capacity: {room.capacity}</p>}
              {room.pricePerHour != null && (
                <p>From £{room.pricePerHour}/hour</p>
              )}
              <span className="card-link">View room</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
