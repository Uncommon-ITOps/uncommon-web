import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export default async function MembershipDetailPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'memberships',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (!docs[0]) return notFound()
  const membership = docs[0]

  return (
    <div className="page membership-detail">
      <nav className="breadcrumb">
        <Link href="/membership">Membership</Link>
        <span aria-hidden>/</span>
        <span>{membership.name}</span>
      </nav>
      <h1>{membership.name}</h1>
      {membership.tagline && <p className="tagline">{membership.tagline}</p>}
      {membership.priceFrom != null && (
        <p className="price">
          From £{membership.priceFrom}
          {membership.priceLabel ? ` ${membership.priceLabel}` : ''}
        </p>
      )}
      {membership.features && membership.features.length > 0 && (
        <ul>
          {membership.features.map((f, i) => (
            <li key={i}>{f.feature}</li>
          ))}
        </ul>
      )}
      {membership.cta?.url && (
        <a
          href={membership.cta.url}
          className="hero-cta"
        >
          {membership.cta.label ?? 'Enquire'}
        </a>
      )}
      <Link href="/membership" className="back-link">
        ← Back to membership
      </Link>
    </div>
  )
}

