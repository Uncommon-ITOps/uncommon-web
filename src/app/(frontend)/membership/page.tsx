import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function MembershipPage() {
  const payload = await getPayloadClient()
  const { docs: memberships } = await payload.find({
    collection: 'memberships',
    sort: 'name',
  })

  return (
    <div className="page membership-page">
      <h1>Explore membership</h1>
      <p className="lead">Private Office, Day Pass, Hot Desk, Dedicated Desk, Weekend Pass.</p>
      <ul className="membership-grid">
        {memberships.map((m) => (
          <li key={m.id} className="membership-card">
            <Link href={`/membership/${m.slug}`}>
              <h2>{m.name}</h2>
              {m.tagline && <p>{m.tagline}</p>}
              {m.priceFrom != null && (
                <p className="price">
                  From £{m.priceFrom}
                  {m.priceLabel ? ` ${m.priceLabel}` : ''}
                </p>
              )}
              <span className="card-link">
                {m.cta?.label ?? 'Explore'}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
