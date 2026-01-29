import { MetadataRoute } from 'next'
import { sanityFetch } from '@/sanity/lib/fetch'

type SitemapPage = {
  slug: string
  language: string
  _updatedAt: string
}

const SITEMAP_QUERY = `*[_type == "page" && !noIndex]{
  "slug": slug.current,
  language,
  _updatedAt
}`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  // Skip during build if no real Sanity project is configured
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'placeholder') {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
      },
    ]
  }

  try {
    const pages = await sanityFetch<SitemapPage[]>({
      query: SITEMAP_QUERY,
    })

    const pageUrls = pages.map((page) => ({
      url: `${baseUrl}/${page.language}/${page.slug === 'home' ? '' : page.slug}`,
      lastModified: new Date(page._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: page.slug === 'home' ? 1 : 0.8,
    }))

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
      },
      ...pageUrls,
    ]
  } catch (error) {
    console.warn('Failed to fetch pages for sitemap:', error)
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
      },
    ]
  }
}
