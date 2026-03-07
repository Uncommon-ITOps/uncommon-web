/**
 * Seed globals (Navigation, Homepage, Footer, Seo Defaults) with minimal content
 * so the admin and frontend are not empty. Safe to run multiple times (upserts).
 *
 * Run: npm run seed  (requires .env with PAYLOAD_SECRET and DATABASE_URI)
 */

import 'dotenv/config'
import { getPayloadClient } from '../src/lib/payload'

async function seed() {
  const payload = await getPayloadClient()

  console.log('Seeding globals...\n')

  try {
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
    console.log('  navigation: OK')
  } catch (e) {
    console.error('  navigation:', e)
    throw e
  }

  try {
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
    console.log('  homepage: OK')
  } catch (e) {
    console.error('  homepage:', e)
    throw e
  }

  try {
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
    console.log('  footer: OK')
  } catch (e) {
    console.error('  footer:', e)
    throw e
  }

  try {
    await payload.updateGlobal({
      slug: 'seo-defaults',
      data: {
        title: 'Uncommon – Coworking & flexible office space in London',
        description: 'Exceptional spaces for work. Coworking, dedicated desks and private offices in London.',
      },
    })
    console.log('  seo-defaults: OK')
  } catch (e) {
    console.error('  seo-defaults:', e)
    throw e
  }

  console.log('\nGlobals seeded. Run verify:migration to confirm.')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
