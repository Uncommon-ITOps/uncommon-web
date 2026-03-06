/**
 * Optional: migrate content from WordPress (uncommon.co.uk) into Payload.
 *
 * 1. Export from WordPress REST API, e.g.:
 *    curl "https://uncommon.co.uk/wp-json/wp/v2/posts?per_page=100" > scripts/wp-posts.json
 *    curl "https://uncommon.co.uk/wp-json/wp/v2/pages?per_page=100" > scripts/wp-pages.json
 *
 * 2. Run against dev first (with DATABASE_URI pointing to dev Postgres):
 *    npx tsx scripts/migrate-from-wp.ts
 *
 * 3. Verify in Payload admin, then run against production if desired.
 */

import { getPayloadClient } from '../src/lib/payload'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stripHtml(html: string): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

async function migrate() {
  const payload = await getPayloadClient()

  try {
    // Example: migrate posts to journal (place wp-posts.json in scripts/ or pass path)
    const path = await import('path')
    const fs = await import('fs')
    const wpPostsPath = path.join(process.cwd(), 'scripts', 'wp-posts.json')
    if (!fs.existsSync(wpPostsPath)) {
      console.log('No wp-posts.json found. Export first, e.g.:')
      console.log('  curl "https://uncommon.co.uk/wp-json/wp/v2/posts?per_page=100" > scripts/wp-posts.json')
      return
    }

    const raw = fs.readFileSync(wpPostsPath, 'utf-8')
    const posts = JSON.parse(raw) as Array<{
      title?: { rendered?: string }
      slug?: string
      excerpt?: { rendered?: string }
      content?: { rendered?: string }
      date?: string
    }>

    for (const post of posts) {
      const title = post.title?.rendered ?? post.slug ?? 'Untitled'
      const slug = post.slug ?? title.toLowerCase().replace(/\s+/g, '-')
      const excerpt = stripHtml(post.excerpt?.rendered ?? '')
      const bodyHtml = post.content?.rendered ?? ''

      await payload.create({
        collection: 'journal',
        data: {
          title,
          slug,
          excerpt: excerpt || undefined,
          publishedDate: post.date ?? undefined,
          // If you use a custom block or HTML-to-Lexical, map bodyHtml here; otherwise add body manually in admin.
        },
      })
      console.log('Migrated:', title)
    }

    console.log('Done.')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

migrate()
