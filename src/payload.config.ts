import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Locations } from './collections/Locations'
import { Memberships } from './collections/Memberships'
import { Journal } from './collections/Journal'
import { MeetingRooms } from './collections/MeetingRooms'
import { EventSpaces } from './collections/EventSpaces'
import { Media } from './collections/Media'
import { Users } from './collections/Users'

import { Navigation } from './globals/Navigation'
import { Homepage } from './globals/Homepage'
import { Footer } from './globals/Footer'
import { SeoDefaults } from './globals/SeoDefaults'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: '— Uncommon CMS' },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Locations,
    Memberships,
    Journal,
    MeetingRooms,
    EventSpaces,
    Media,
    Users,
  ],
  globals: [Navigation, Homepage, Footer, SeoDefaults],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URI || process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
