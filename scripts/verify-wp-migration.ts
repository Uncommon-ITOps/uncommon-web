/**
 * Verify WordPress → Payload migration: counts, globals, and basic integrity.
 * Run: npm run verify:migration  (or npx tsx scripts/verify-wp-migration.ts)
 * Requires .env with PAYLOAD_SECRET and DATABASE_URI (or DATABASE_URL).
 */

import 'dotenv/config'
import { getPayloadClient } from '../src/lib/payload'

const COLLECTIONS = [
  'locations',
  'event-spaces',
  'memberships',
  'journal',
  'meeting-rooms',
  'media',
  'users',
] as const

const GLOBALS = ['navigation', 'homepage', 'footer', 'seo-defaults'] as const

async function verify() {
  const payload = await getPayloadClient()
  const issues: string[] = []

  console.log('\n--- Collections (counts) ---\n')

  for (const slug of COLLECTIONS) {
    try {
      const { totalDocs } = await payload.find({
        collection: slug,
        limit: 0,
        depth: 0,
      })
      console.log(`  ${slug}: ${totalDocs}`)
    } catch (err) {
      const msg = `  ${slug}: ERROR - ${err instanceof Error ? err.message : String(err)}`
      console.log(msg)
      issues.push(msg)
    }
  }

  console.log('\n--- Globals (exists + keys) ---\n')

  for (const slug of GLOBALS) {
    try {
      const globalData = await payload.findGlobal({
        slug,
        depth: 0,
      })
      const keys = globalData ? Object.keys(globalData).filter((k) => !k.startsWith('_')) : []
      console.log(`  ${slug}: OK (keys: ${keys.join(', ') || 'none'})`)
    } catch (err) {
      const msg = `  ${slug}: ERROR - ${err instanceof Error ? err.message : String(err)}`
      console.log(msg)
      issues.push(msg)
    }
  }

  console.log('\n--- Journal sample (WP posts) ---\n')

  try {
    const { docs, totalDocs } = await payload.find({
      collection: 'journal',
      limit: 5,
      depth: 0,
      sort: '-publishedDate',
    })
    if (totalDocs === 0) {
      console.log('  No journal entries. If you migrated WP posts, run migrate-from-wp.ts with wp-posts.json in scripts/.')
      issues.push('Journal is empty; expected if WP posts were not migrated yet.')
    } else {
      for (const doc of docs) {
        const bodyEmpty = !doc.body || (typeof doc.body === 'object' && !('root' in doc.body))
        const bodyNote = bodyEmpty ? ' (body not set – migration script does not map HTML to Lexical)' : ''
        console.log(`  - ${doc.title ?? 'Untitled'} | slug: ${doc.slug ?? '—'}${bodyNote}`)
      }
      if (totalDocs > 5) console.log(`  ... and ${totalDocs - 5} more`)
    }
  } catch (err) {
    issues.push(`Journal sample: ${err instanceof Error ? err.message : String(err)}`)
    console.log('  Error:', err)
  }

  console.log('\n--- Media (upload refs) ---\n')

  try {
    const { totalDocs } = await payload.find({ collection: 'media', limit: 0, depth: 0 })
    console.log(`  media: ${totalDocs} file(s)`)
    if (totalDocs === 0) {
      console.log('  No media. Uploads in WP were not migrated by the example script; add media import if needed.')
    }
  } catch (err) {
    console.log('  Error:', err)
    issues.push(`Media count: ${err instanceof Error ? err.message : String(err)}`)
  }

  console.log('\n--- Summary ---\n')
  if (issues.length > 0) {
    console.log('Issues / notes:')
    issues.forEach((i) => console.log('  -', i))
    console.log('')
    process.exitCode = 1
  } else {
    console.log('All checks passed. Content structure looks good.')
  }
}

verify().catch((err) => {
  console.error(err)
  process.exit(1)
})
