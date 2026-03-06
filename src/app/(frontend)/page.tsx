import Image from 'next/image'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import type { Media } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayloadClient()
  const homepage = await payload.findGlobal({
    slug: 'homepage',
  })
  const { docs: locations } = await payload.find({
    collection: 'locations',
    sort: 'name',
    limit: 6,
  })

  const hero = homepage?.hero
  const whyChooseUs = homepage?.whyChooseUs
  const featuredLocations = homepage?.featuredLocations ?? []
  const displayLocations =
    featuredLocations.length > 0
      ? featuredLocations
          .map((f) => (typeof f.location === 'object' && f.location ? f.location : null))
          .filter((loc): loc is NonNullable<typeof loc> => loc != null)
      : locations

  return (
    <div className="home">
      {hero && (
        <section className="hero">
          {hero.backgroundImage && typeof hero.backgroundImage === 'object' && (
            <div className="hero-bg">
              <Image
                src={(hero.backgroundImage as Media).url ?? ''}
                alt=""
                fill
                priority
                className="hero-bg-img"
              />
            </div>
          )}
          <div className="hero-content">
            <h1>{hero.headline ?? 'Exceptional spaces for work.'}</h1>
            {hero.subheadline && <p className="hero-sub">{hero.subheadline}</p>}
            <Link href="/locations" className="hero-cta">
              Find your space
            </Link>
          </div>
        </section>
      )}
      {!hero && (
        <section className="hero">
          <div className="hero-content">
            <h1>Exceptional spaces for work.</h1>
            <p className="hero-sub">Coworking &amp; flexible office space in London.</p>
            <Link href="/locations" className="hero-cta">
              Find your space
            </Link>
          </div>
        </section>
      )}

      {whyChooseUs && whyChooseUs.items && whyChooseUs.items.length > 0 && (
        <section className="why-section">
          <h2>{whyChooseUs.heading ?? 'Why choose us'}</h2>
          <ul className="why-grid">
            {whyChooseUs.items.map((item) => (
              <li key={item.id ?? ''}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="locations-preview">
        <h2>Our locations</h2>
        <ul className="location-cards">
          {displayLocations.slice(0, 5).map((loc) => (
            <li key={loc.id}>
              <Link href={`/location/${loc.slug}`} className="location-card">
                <h3>{loc.name}</h3>
                {loc.tagline && <p>{loc.tagline}</p>}
                <span className="card-link">View location</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/locations" className="see-all">
          View all locations
        </Link>
      </section>

      <section className="membership-cta">
        <h2>Membership options</h2>
        <p>Private Office, Day Pass, Hot Desk, Dedicated Desk, Weekend Pass.</p>
        <Link href="/membership" className="hero-cta">
          Explore membership
        </Link>
      </section>
    </div>
  )
}
