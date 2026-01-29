// This file is used to provide a token for preview/draft mode
// It should NEVER be exposed to the client-side bundle

export const token = process.env.SANITY_API_READ_TOKEN

if (!token) {
  console.warn('Missing SANITY_API_READ_TOKEN - preview mode will not work')
}
