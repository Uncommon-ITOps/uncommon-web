import configPromise from '@payload-config'
import { getPayload } from 'payload'

/**
 * Get a Payload instance for use in server components, route handlers, and scripts.
 * Use this instead of calling getPayload directly so config is loaded in one place.
 */
export async function getPayloadClient() {
  const config = await configPromise
  return getPayload({ config })
}
