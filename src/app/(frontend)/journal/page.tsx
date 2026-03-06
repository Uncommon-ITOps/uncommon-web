import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function JournalPage() {
  const payload = await getPayloadClient()
  const { docs: posts } = await payload.find({
    collection: 'journal',
    sort: '-publishedDate',
    limit: 20,
  })

  return (
    <div className="page journal-page">
      <h1>Journal</h1>
      <p className="lead">News, guides and community stories.</p>
      <ul className="journal-list">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/journal/${post.slug}`} className="journal-card">
              <h2>{post.title}</h2>
              {post.publishedDate && (
                <time dateTime={post.publishedDate}>
                  {new Date(post.publishedDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              )}
              {post.excerpt && <p>{post.excerpt}</p>}
              <span className="card-link">Read more</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
