import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@payloadcms/richtext-lexical/react'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string }> }

export default async function EventSpaceDetailPage({ params }: Props) {
  const { id } = await params
  const payload = await getPayloadClient()
  const doc = await payload.findByID({
    collection: 'event-spaces',
    id: Number(id),
  }).catch(() => null)

  if (!doc) return notFound()

  return (
    <div className="page event-space-detail">
      <nav className="breadcrumb">
        <Link href="/event-space">Event spaces</Link>
        <span aria-hidden>/</span>
        <span>{doc.name}</span>
      </nav>
      <h1>{doc.name}</h1>
      {typeof doc.location === 'object' && doc.location && (
        <p>
          <Link href={`/location/${doc.location.slug}`}>{doc.location.name}</Link>
        </p>
      )}
      {doc.capacity != null && <p>Capacity: {doc.capacity}</p>}
      {doc.pricePerHour != null && <p>From £{doc.pricePerHour}/hour</p>}
      {doc.description && (
        <div className="prose">
          <RichText data={doc.description} />
        </div>
      )}
      {doc.features && doc.features.length > 0 && (
        <ul>
          {doc.features.map((f, i) => (
            <li key={i}>{f.feature}</li>
          ))}
        </ul>
      )}
      <Link href="/event-space" className="back-link">
        ← Back to event spaces
      </Link>
    </div>
  )
}
