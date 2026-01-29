import { definePlugin } from 'sanity'

const baseUrl =
  typeof window !== 'undefined'
    ? window.location.origin.replace('/studio', '')
    : process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000'

export const previewUrlPlugin = definePlugin({
  name: 'preview-url',
  document: {
    productionUrl: async (prev, { document }) => {
      console.log('🔍 productionUrl called for document:', document._type, document)

      // Only handle 'page' documents
      if (document._type !== 'page') {
        console.log('⏩ Not a page, returning prev:', prev)
        return prev
      }

      const slug = (document.slug as { current?: string })?.current
      const language = (document.language as string) || 'fr'

      console.log('📍 Slug:', slug, 'Language:', language)

      // If no slug, return a fallback
      if (!slug) {
        const defaultSlug = language === 'fr' ? 'accueil' : 'home'
        const fallback = `${baseUrl}/${language}/${defaultSlug}`
        console.log('⚠️  No slug, returning fallback:', fallback)
        return fallback
      }

      // Build the full URL
      const pathname = `/${language}/${slug}`
      const fullUrl = `${baseUrl}${pathname}`

      console.log('✅ Generated URL:', fullUrl)
      return fullUrl
    },
  },
})
