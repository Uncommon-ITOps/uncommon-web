/**
 * Migrate content from WordPress (uncommon.co.uk) into Payload, and seed globals if empty.
 *
 * Option A – Export files (scripts/):
 *   curl "https://uncommon.co.uk/wp-json/wp/v2/posts?per_page=100" > scripts/wp-posts.json
 *   curl "https://uncommon.co.uk/wp-json/wp/v2/pages?per_page=100" > scripts/wp-pages.json
 *
 * Option B – Fetch from API (set in .env):
 *   WP_API_URL=https://uncommon.co.uk
 *
 * Then run (with DATABASE_URI and PAYLOAD_SECRET in .env):
 *   npm run migrate:wp
 *
 * If no wp-posts.json and no WP_API_URL, this script only seeds globals so content is not empty.
 */

import 'dotenv/config'
import path from 'path'
import fs from 'fs'
import { getPayloadClient } from '../src/lib/payload'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stripHtml(html: string): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

type WpPost = {
  title?: { rendered?: string }
  slug?: string
  excerpt?: { rendered?: string }
  content?: { rendered?: string }
  date?: string
}

function normalizeToPostsArray(raw: unknown): WpPost[] {
  if (Array.isArray(raw)) return raw as WpPost[]
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    if (Array.isArray(obj.posts)) return obj.posts as WpPost[]
    if (Array.isArray(obj.data)) return obj.data as WpPost[]
    const first = Object.values(obj).find(Array.isArray)
    if (Array.isArray(first)) return first as WpPost[]
  }
  return []
}

async function seedGlobals(payload: Awaited<ReturnType<typeof getPayloadClient>>) {
  console.log('Seeding globals (Navigation, Homepage, Footer, Seo Defaults)...')
  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      primaryLinks: [
        { label: 'Locations', url: '/locations' },
        { label: 'Membership', url: '/membership' },
        { label: 'Journal', url: '/journal' },
        { label: 'Contact', url: '/contact' },
      ],
      ctaLabel: 'Get in touch',
      ctaUrl: '/contact',
    },
  })
  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      hero: {
        headline: 'Exceptional spaces for work.',
        subheadline: 'Coworking & flexible office space in London.',
      },
      whyChooseUs: {
        heading: 'Why choose us',
        items: [
          { title: 'Flexible membership', description: 'No long-term commitment. Scale up or down as you need.' },
          { title: 'Prime locations', description: 'Spaces in central London, well connected and professional.' },
          { title: 'Community', description: 'Events and networking for members.' },
        ],
      },
      featuredLocations: [],
    },
  })
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      links: [
        { label: 'Locations', url: '/locations' },
        { label: 'Membership', url: '/membership' },
        { label: 'Journal', url: '/journal' },
        { label: 'Contact', url: '/contact' },
      ],
      socialLinks: [],
      legalText: '© Uncommon. All rights reserved.',
    },
  })
  await payload.updateGlobal({
    slug: 'seo-defaults',
    data: {
      title: 'Uncommon – Coworking & flexible office space in London',
      description: 'Exceptional spaces for work. Coworking, dedicated desks and private offices in London.',
    },
  })
  console.log('Globals seeded.\n')
}

async function migrate() {
  const payload = await getPayloadClient()

  const wpPostsPath = path.join(process.cwd(), 'scripts', 'wp-posts.json')
  const wpApiUrl = process.env.WP_API_URL?.replace(/\/$/, '') // e.g. https://uncommon.co.uk

  let posts: WpPost[] = []

  if (fs.existsSync(wpPostsPath)) {
    console.log('Using scripts/wp-posts.json\n')
    const raw = JSON.parse(fs.readFileSync(wpPostsPath, 'utf-8'))
    posts = normalizeToPostsArray(raw)
    if (posts.length === 0) {
      console.log('File is empty or not an array of posts. Seeding globals only.')
      await seedGlobals(payload)
      return
    }
  } else if (wpApiUrl) {
    console.log(`Fetching posts from ${wpApiUrl}/wp-json/wp/v2/posts ...\n`)
    try {
      const res = await fetch(`${wpApiUrl}/wp-json/wp/v2/posts?per_page=100`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const raw = await res.json()
      posts = normalizeToPostsArray(raw)
    } catch (err) {
      console.error('Fetch failed:', err)
      console.log('Seeding globals only.')
      await seedGlobals(payload)
      return
    }
  } else {
    console.log('No wp-posts.json and no WP_API_URL in .env.')
    console.log('To migrate posts: export from WP or set WP_API_URL=https://uncommon.co.uk')
    console.log('Seeding globals so the site is not empty.\n')
    await seedGlobals(payload)
    return
  }

  console.log(`Migrating ${posts.length} post(s) to Journal...\n`)

  for (const post of posts) {
    const title = post.title?.rendered ?? post.slug ?? 'Untitled'
    const slug = post.slug ?? title.toLowerCase().replace(/\s+/g, '-')
    const excerpt = stripHtml(post.excerpt?.rendered ?? '')
    await payload.create({
      collection: 'journal',
      data: {
        title,
        slug,
        excerpt: excerpt || undefined,
        publishedDate: post.date ?? undefined,
      },
    })
    console.log('  Migrated:', title)
  }

  console.log('\nSeeding globals so Navigation/Homepage/Footer/Seo have content...')
  await seedGlobals(payload)
  console.log('Done. Run npm run verify:migration to confirm.')
}

migrate().catch((err) => {
  console.error(err)
  process.exit(1)
})
