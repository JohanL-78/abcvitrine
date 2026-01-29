import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/fetch'
import { urlForImage } from '@/sanity/lib/image'
import { type Locale } from '@/lib/i18n/config'
import PageBuilder from '@/components/PageBuilder'
import PageLayout from '@/components/PageLayout'
import type { Page } from '@/types/sanity'

// GROQ query to fetch page data
const PAGE_QUERY = `*[_type == "page" && slug.current == $slug && language == $language][0]{
  _id,
  title,
  slug,
  language,
  content[]{
    _type,
    _key,
    _type == "hero" => {
      title,
      subtitle,
      image{
        asset,
        alt
      },
      cta
    },
    _type == "textWithImage" => {
      heading,
      text,
      image{
        asset,
        alt
      },
      imagePosition
    },
    _type == "grid" => {
      heading,
      items[]{
        title,
        description,
        image{
          asset,
          alt
        },
        link
      },
      columns
    }
  },
  seoTitle,
  seoDescription,
  seoImage{
    asset->
  },
  noIndex,
  translations[]->{
    _id,
    language,
    slug
  }
}`

// Query for all pages (for generateStaticParams)
const PAGES_QUERY = `*[_type == "page"]{
  "slug": slug.current,
  language
}`

type PageData = Page

export async function generateStaticParams() {
  // Skip during build if no real Sanity project is configured
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'placeholder') {
    return []
  }

  try {
    const pages = await sanityFetch<Array<{ slug: string; language: string }>>({
      query: PAGES_QUERY,
    })

    return pages.map((page) => ({
      lang: page.language,
      slug: page.slug === 'home' ? [] : page.slug.split('/'),
    }))
  } catch (error) {
    console.warn('Failed to fetch pages for static generation:', error)
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>
}): Promise<Metadata> {
  const { lang, slug } = await params as { lang: Locale; slug?: string[] }
  const slugString = slug?.join('/') || 'home'

  const page = await sanityFetch<PageData>({
    query: PAGE_QUERY,
    params: { slug: slugString, language: lang },
  })

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  const title = page.seoTitle || page.title
  const description = page.seoDescription

  // Build alternate languages for hreflang
  const languages: Record<string, string> = {}

  // Add current page
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  languages[lang] = `${baseUrl}/${lang}/${slugString === 'home' ? '' : slugString}`

  // Add translations
  if (page.translations) {
    page.translations.forEach((translation) => {
      const translationSlug = translation.slug.current
      languages[translation.language] = `${baseUrl}/${translation.language}/${
        translationSlug === 'home' ? '' : translationSlug
      }`
    })
  }

  // Generate OG image URL
  const ogImageUrl = page.seoImage
    ? urlForImage(page.seoImage)?.width(1200).height(630).url()
    : undefined

  return {
    title,
    description,
    alternates: {
      canonical: languages[lang],
      languages,
    },
    robots: page.noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
    openGraph: {
      title,
      description,
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>
}) {
  const { lang, slug } = await params as { lang: Locale; slug?: string[] }
  const slugString = slug?.join('/') || 'home'

  // Check if draft mode is enabled
  let isDraftMode = false
  try {
    isDraftMode = (await draftMode()).isEnabled
  } catch {
    isDraftMode = false
  }

  const page = await sanityFetch<PageData>({
    query: PAGE_QUERY,
    params: { slug: slugString, language: lang },
    tags: [`page:${slugString}:${lang}`],
  })

  if (!page) {
    notFound()
  }

  return (
    <PageLayout
      lang={lang}
      translations={page.translations}
      isDraftMode={isDraftMode}
    >
      <PageBuilder sections={page.content || []} />
    </PageLayout>
  )
}
