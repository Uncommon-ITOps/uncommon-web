/**
 * Seed event spaces and meeting rooms from WordPress ACF data.
 * Fetches directly from the WP REST API — requires WP_API_URL in .env.
 *
 * Run: npm run seed:rooms
 * Requires .env with PAYLOAD_SECRET, DATABASE_URI, and WP_API_URL.
 */

import 'dotenv/config'
import { getPayloadClient } from '../src/lib/payload'

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#[0-9]+;/g, (m) => String.fromCharCode(parseInt(m.slice(2, -1), 10)))
    .trim()
}

// Map WP district / subdomain strings → Payload location slug
const DISTRICT_TO_SLUG: Record<string, string> = {
  'Holborn': 'holborn',
  'Borough': 'borough',
  'Putney Bridge': 'fulham', // Fulham's nearest tube
  'Highbury & Islington': 'highbury-islington',
  'Liverpool Street': 'liverpool-street',
  'holborn': 'holborn',
  'borough': 'borough',
  'highbury': 'highbury-islington',
  'fulham': 'fulham',
  'liverpoolstreet': 'liverpool-street',
}

type WpAcfItem = { text?: string }

async function fetchWp(path: string) {
  const base = (process.env.WP_API_URL || 'https://uncommon.co.uk').replace(/\/$/, '')
  const res = await fetch(`${base}/wp-json/wp/v2/${path}?per_page=100`)
  if (!res.ok) throw new Error(`WP API ${path} → HTTP ${res.status}`)
  return res.json() as Promise<Record<string, unknown>[]>
}

async function getLocationIds(payload: Awaited<ReturnType<typeof getPayloadClient>>) {
  const { docs } = await payload.find({ collection: 'locations', limit: 100, depth: 0 })
  const map: Record<string, number> = {}
  for (const loc of docs) {
    map[loc.slug as string] = loc.id as number
  }
  return map
}

async function seedEventSpaces(payload: Awaited<ReturnType<typeof getPayloadClient>>, locationIds: Record<string, number>) {
  console.log('Fetching event spaces from WordPress...')
  const records = await fetchWp('event')
  console.log(`Found ${records.length} event spaces\n`)

  let created = 0
  let skipped = 0

  for (const rec of records) {
    const title = decodeHtmlEntities((rec.title as { rendered: string }).rendered)
    const slug = rec.slug as string
    const acf = (rec.acf || {}) as Record<string, unknown>
    const add = (acf.add || {}) as Record<string, unknown>
    const district = (add.district as string) || ''
    const features = ((add.list as WpAcfItem[]) || []).map((f) => ({ feature: f.text || '' })).filter(f => f.feature)

    // Skip obvious placeholder/test entries
    if (features.some((f) => f.feature.includes('Lorem ipsum'))) {
      console.log(`  skip (placeholder): ${title}`)
      skipped++
      continue
    }

    const locationSlug = DISTRICT_TO_SLUG[district]
    const locationId = locationSlug ? locationIds[locationSlug] : undefined

    if (!locationSlug || !locationId) {
      console.log(`  skip (no location match for district "${district}"): ${title}`)
      skipped++
      continue
    }

    // Check if already exists (by name + location)
    const existing = await payload.find({
      collection: 'event-spaces',
      where: { and: [{ name: { equals: title } }, { location: { equals: locationId } }] },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      console.log(`  skip (exists): ${title}`)
      skipped++
      continue
    }

    await payload.create({
      collection: 'event-spaces',
      data: {
        name: title,
        location: locationId,
        features,
      },
    })
    console.log(`  created: ${title} @ ${district}`)
    created++
  }

  console.log(`\nEvent spaces: ${created} created, ${skipped} skipped\n`)
}

async function seedMeetingRooms(payload: Awaited<ReturnType<typeof getPayloadClient>>, locationIds: Record<string, number>) {
  console.log('Fetching meeting rooms from WordPress...')
  const records = await fetchWp('meeting')
  console.log(`Found ${records.length} meeting rooms\n`)

  let created = 0
  let skipped = 0

  for (const rec of records) {
    const title = decodeHtmlEntities((rec.title as { rendered: string }).rendered)
    const slug = rec.slug as string
    const acf = (rec.acf || {}) as Record<string, unknown>
    const add = (acf.add || {}) as Record<string, unknown>
    const features = ((add.list as WpAcfItem[]) || []).map((f) => ({ feature: (f.text || '').trim() })).filter(f => f.feature)

    // Extract location from booking button URL subdomain
    const btn = (add.button || {}) as Record<string, string>
    const url = btn.url || ''
    const subdomainMatch = url.match(/https?:\/\/([^.]+)\.uncommon/)
    const subdomain = subdomainMatch ? subdomainMatch[1] : ''
    const locationSlug = DISTRICT_TO_SLUG[subdomain]
    const locationId = locationSlug ? locationIds[locationSlug] : undefined

    if (!locationSlug || !locationId) {
      console.log(`  skip (no location match for subdomain "${subdomain}"): ${title}`)
      skipped++
      continue
    }

    // Check if already exists (by name + location)
    const existing = await payload.find({
      collection: 'meeting-rooms',
      where: { and: [{ name: { equals: title } }, { location: { equals: locationId } }] },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      console.log(`  skip (exists): ${title}`)
      skipped++
      continue
    }

    await payload.create({
      collection: 'meeting-rooms',
      data: {
        name: title,
        location: locationId,
        features,
      },
    })
    console.log(`  created: ${title} @ ${locationSlug}`)
    created++
  }

  console.log(`\nMeeting rooms: ${created} created, ${skipped} skipped\n`)
}

async function run() {
  const payload = await getPayloadClient()

  const locationIds = await getLocationIds(payload)
  console.log('Locations found:', Object.keys(locationIds).join(', '), '\n')

  if (Object.keys(locationIds).length === 0) {
    console.error('No locations found. Run npm run seed:locations first.')
    process.exit(1)
  }

  await seedEventSpaces(payload, locationIds)
  await seedMeetingRooms(payload, locationIds)

  console.log('Done. Run npm run verify:migration to confirm.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
