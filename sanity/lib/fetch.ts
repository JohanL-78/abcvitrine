import 'server-only'
import { draftMode } from 'next/headers'
import { client, previewClient } from './client'
import type { QueryParams } from 'next-sanity'

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
}: {
  query: string
  params?: QueryParams
  tags?: string[]
}): Promise<QueryResponse> {
  // During build time or static generation, draftMode is not available
  let isDraftMode = false
  try {
    isDraftMode = (await draftMode()).isEnabled
  } catch {
    // Ignore error during build time
    isDraftMode = false
  }

  if (isDraftMode && !process.env.SANITY_API_READ_TOKEN) {
    throw new Error(
      'The `SANITY_API_READ_TOKEN` environment variable is required in Draft Mode.'
    )
  }

  const currentClient = isDraftMode ? previewClient : client

  return currentClient.fetch<QueryResponse>(query, params, {
    next: {
      revalidate: isDraftMode ? 0 : false,
      tags,
    },
  })
}
