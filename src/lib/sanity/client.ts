import { createClient } from '@sanity/client'

const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const isValidProjectId = !!rawProjectId && /^[a-z0-9-]+$/.test(rawProjectId)

export const client = createClient({
  projectId: isValidProjectId ? rawProjectId : 'placeholder-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_READ_TOKEN,
})

/** true only when env vars are real (not placeholders) */
export const isSanityConfigured = isValidProjectId
