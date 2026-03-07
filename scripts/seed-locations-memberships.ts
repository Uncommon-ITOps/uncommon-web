/**
 * Seed locations and memberships from WordPress ACF data,
 * and fix HTML entities in existing journal titles.
 *
 * Run: npm run seed:locations
 * Requires .env with PAYLOAD_SECRET and DATABASE_URI.
 */

import 'dotenv/config'
import { getPayloadClient } from '../src/lib/payload'

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8220;/g, '\u201C')
    .replace(/&#8221;/g, '\u201D')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
}

const LOCATIONS = [
  {
    name: 'Holborn',
    slug: 'holborn',
    tagline: 'Right in the thick of the action',
    description: "We've landed in Holborn, right in the thick of the action. Somerset House, the British Museum, Covent Garden Market – they could be your new neighbours. We're only two minutes from Holborn Underground station, making this one of the most connected spaces in London.",
    address: { street: '81-87 High Holborn', city: 'London', postcode: 'WC1V 6DF' },
    nearestTube: 'Holborn (3 min walk)',
    coordinates: { lat: 51.5180327, lng: -0.1174446 },
    amenities: [{ label: 'Sitting between the bustle of the City of London and the elegance of the West End.' }],
    waitingListOnly: false,
  },
  {
    name: 'Borough',
    slug: 'borough',
    tagline: 'Vibrant South London',
    description: 'Uncommon Borough is housed in the vibrant South London – just a few steps away from the Northern Line and a short walk from key area highlights like London Bridge, Borough Market and Bermondsey High Street.',
    address: { street: '1 Long Lane', city: 'London', postcode: 'SE1 4PG' },
    nearestTube: 'Borough (2 min walk)',
    coordinates: { lat: 51.50124700000001, lng: -0.09175889999999999 },
    amenities: [{ label: 'With Borough Market and London Bridge station just a few steps away.' }],
    waitingListOnly: false,
  },
  {
    name: 'Fulham',
    slug: 'fulham',
    tagline: 'Picturesque South-West London',
    description: "Uncommon Fulham is housed in the picturesque South-West London – just a short walk to King's Road, Parsons Green and key transport links. Fulham, with its endless greenery and riverside walks, independent cafes and boutique shops, is perfect for creatives and companies that really cherish wellness and work-life balance.",
    address: { street: "126 New King's Road", city: 'London', postcode: 'SW6 4LZ' },
    nearestTube: 'Putney Bridge (6 min walk)',
    coordinates: { lat: 51.4716414, lng: -0.206278 },
    amenities: [{ label: 'Explore riverside walks, independent cafes and boutique shops of West London.' }],
    waitingListOnly: false,
  },
  {
    name: 'Highbury & Islington',
    slug: 'highbury-islington',
    tagline: 'Fast-growing creative neighbourhood',
    description: 'As a fast-growing, up-and-coming neighbourhood, Highbury & Islington is perfect for creative businesses, start-ups and freelancers. Tucked within the beautiful residential area and surrounded by so much greenery both indoors and outdoors – you\'ll feel right at home at this Uncommon space.',
    address: { street: '25 Horsell Road', city: 'London', postcode: 'N5 1XL' },
    nearestTube: 'Highbury & Islington (7 min walk)',
    coordinates: { lat: 51.5504223, lng: -0.1080758 },
    amenities: [{ label: 'Surrounded by plenty of greenery in a fast-growing creative neighbourhood.' }],
    waitingListOnly: false,
  },
  {
    name: 'Liverpool Street',
    slug: 'liverpool-street',
    tagline: 'Energetic East London',
    description: "Uncommon Liverpool Street is housed in the energetic East London, just across the road from Liverpool Street station; it can't get any easier than that. With a bustle of food stops like Spitalfields Market, sky-high city bars and the best restaurants right outside its doorstep, Uncommon Liverpool Street is perfect for those wanting to try something new every day.",
    address: { street: '34-37 Liverpool Street', city: 'London', postcode: 'EC2M 7PP' },
    nearestTube: 'Liverpool Street (2 min walk)',
    coordinates: { lat: 51.51699730000001, lng: -0.08159 },
    amenities: [{ label: 'Located in the very heart of the City with everything you need at the doorstep.' }],
    waitingListOnly: false,
  },
]

const MEMBERSHIPS = [
  {
    name: 'Hot Desk',
    slug: 'hot-desk',
    tagline: 'Flexible coworking at any location',
    priceLabel: 'From £X/month',
    features: [
      { feature: 'Access to any Uncommon location' },
      { feature: 'High-speed Wi-Fi' },
      { feature: 'Unlimited tea & coffee' },
      { feature: 'Access to events and community' },
    ],
    cta: { label: 'Get in touch', url: '/contact' },
  },
  {
    name: 'Dedicated Desk',
    slug: 'dedicated-desk',
    tagline: 'Your own reserved desk, every day',
    priceLabel: 'From £X/month',
    features: [
      { feature: 'Your own reserved desk' },
      { feature: 'Lockable storage' },
      { feature: 'High-speed Wi-Fi' },
      { feature: 'Unlimited tea & coffee' },
      { feature: 'Access to events and community' },
    ],
    cta: { label: 'Get in touch', url: '/contact' },
  },
  {
    name: 'Day Pass',
    slug: 'day-passes',
    tagline: 'Drop in when you need it',
    priceLabel: 'Pay as you go',
    features: [
      { feature: 'Flexible drop-in access' },
      { feature: 'High-speed Wi-Fi' },
      { feature: 'Unlimited tea & coffee' },
    ],
    cta: { label: 'Buy now', url: '/membership/day-passes' },
  },
  {
    name: 'Weekend Pass',
    slug: 'weekend-pass',
    tagline: 'Work at the weekend, your way',
    priceLabel: 'From £X/month',
    features: [
      { feature: 'Saturday and Sunday access' },
      { feature: 'High-speed Wi-Fi' },
      { feature: 'Unlimited tea & coffee' },
    ],
    cta: { label: 'Get in touch', url: '/contact' },
  },
  {
    name: 'Private Office',
    slug: 'private-office',
    tagline: 'Your own private space to call home',
    priceLabel: 'POA',
    features: [
      { feature: 'Fully private office' },
      { feature: 'Dedicated broadband' },
      { feature: 'Meeting room credits' },
      { feature: 'Brand your space' },
      { feature: 'Full reception services' },
      { feature: 'Unlimited tea & coffee' },
    ],
    cta: { label: 'Enquire now', url: '/contact' },
  },
]

async function seedLocations(payload: Awaited<ReturnType<typeof getPayloadClient>>) {
  console.log('Seeding locations...\n')
  for (const loc of LOCATIONS) {
    // Check if already exists
    const existing = await payload.find({
      collection: 'locations',
      where: { slug: { equals: loc.slug } },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      console.log(`  skip (exists): ${loc.name}`)
      continue
    }
    await payload.create({ collection: 'locations', data: loc })
    console.log(`  created: ${loc.name}`)
  }
  console.log()
}

async function seedMemberships(payload: Awaited<ReturnType<typeof getPayloadClient>>) {
  console.log('Seeding memberships...\n')
  for (const mem of MEMBERSHIPS) {
    const existing = await payload.find({
      collection: 'memberships',
      where: { slug: { equals: mem.slug } },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      console.log(`  skip (exists): ${mem.name}`)
      continue
    }
    await payload.create({ collection: 'memberships', data: mem })
    console.log(`  created: ${mem.name}`)
  }
  console.log()
}

async function fixJournalTitles(payload: Awaited<ReturnType<typeof getPayloadClient>>) {
  console.log('Fixing HTML entities in journal titles...\n')
  let page = 1
  let fixed = 0
  while (true) {
    const { docs, totalPages } = await payload.find({
      collection: 'journal',
      limit: 50,
      page,
      depth: 0,
    })
    for (const doc of docs) {
      const decoded = decodeHtmlEntities(doc.title)
      if (decoded !== doc.title) {
        await payload.update({
          collection: 'journal',
          id: doc.id,
          data: { title: decoded },
        })
        console.log(`  fixed: ${decoded}`)
        fixed++
      }
    }
    if (page >= totalPages) break
    page++
  }
  if (fixed === 0) console.log('  All titles already clean.')
  console.log()
}

async function run() {
  const payload = await getPayloadClient()
  await seedLocations(payload)
  await seedMemberships(payload)
  await fixJournalTitles(payload)
  console.log('Done. Run npm run verify:migration to confirm.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
