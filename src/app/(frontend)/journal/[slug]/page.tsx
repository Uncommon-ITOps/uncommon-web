import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@payloadcms/richtext-lexical/react'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'journal',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (!docs[0]) return notFound()
  const post = docs[0]

  return (
    <article className="page journal-detail">
      <nav className="breadcrumb">
        <Link href="/journal">Journal</Link>
        <span aria-hidden>/</span>
        <span>{post.title}</span>
      </nav>
      <h1>{post.title}</h1>
      {post.publishedDate && (
        <time dateTime={post.publishedDate} className="date">
          {new Date(post.publishedDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </time>
      )}
      {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
      {post.body && (
        <div className="prose">
          <RichText data={post.body} />
        </div>
      )}
      <Link href="/journal" className="back-link">
        ← Back to journal
      </Link>
    </article>
  )
}

