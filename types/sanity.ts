import type { Image, PortableTextBlock } from 'sanity'

export type SanityImage = Image & {
  alt?: string
}

export type Link = {
  text?: string
  url?: string
}

export type HeroSection = {
  _type: 'hero'
  _key: string
  title: string
  subtitle?: string
  image?: SanityImage
  cta?: Link
}

export type TextWithImageSection = {
  _type: 'textWithImage'
  _key: string
  heading: string
  text: PortableTextBlock[]
  image: SanityImage
  imagePosition?: 'left' | 'right'
}

export type GridItem = {
  title: string
  description?: string
  image?: SanityImage
  link?: Link
}

export type GridSection = {
  _type: 'grid'
  _key: string
  heading?: string
  items: GridItem[]
  columns?: 2 | 3 | 4
}

export type PageSection = HeroSection | TextWithImageSection | GridSection

export type Page = {
  _id: string
  _type: 'page'
  title: string
  slug: {
    current: string
  }
  language: 'fr' | 'en'
  content?: PageSection[]
  seoTitle?: string
  seoDescription?: string
  seoImage?: SanityImage
  noIndex?: boolean
  translations?: Array<{
    _id: string
    language: string
    slug: {
      current: string
    }
  }>
}
