import type { CollectionConfig } from 'payload'

export const MeetingRooms: CollectionConfig = {
  slug: 'meeting-rooms',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'location', type: 'relationship', relationTo: 'locations' },
    { name: 'capacity', type: 'number' },
    { name: 'pricePerHour', type: 'number' },
    { name: 'description', type: 'richText' },
    {
      name: 'features',
      type: 'array',
      fields: [{ name: 'feature', type: 'text' }],
    },
    {
      name: 'images',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
    },
  ],
}
