/**
 * Exemples de requêtes GROQ utiles pour le projet
 * Documentation GROQ : https://www.sanity.io/docs/groq
 */

// Récupérer toutes les pages d'une langue
export const ALL_PAGES_BY_LANG = `*[_type == "page" && language == $language]{
  _id,
  title,
  "slug": slug.current,
  language
}`

// Récupérer une page par slug et langue
export const PAGE_BY_SLUG = `*[_type == "page" && slug.current == $slug && language == $language][0]{
  _id,
  title,
  "slug": slug.current,
  language,
  content,
  seoTitle,
  seoDescription,
  seoImage,
  noIndex,
  translations[]->{
    _id,
    language,
    "slug": slug.current
  }
}`

// Récupérer uniquement les pages publiées (pas de drafts)
export const PUBLISHED_PAGES = `*[_type == "page" && !(_id in path("drafts.**"))]{
  _id,
  title,
  "slug": slug.current,
  language
}`

// Récupérer les pages pour le sitemap
export const SITEMAP_PAGES = `*[_type == "page" && !noIndex]{
  "slug": slug.current,
  language,
  _updatedAt
}`

// Récupérer la page d'accueil pour une langue
export const HOME_PAGE = `*[_type == "page" && slug.current == "home" && language == $language][0]{
  _id,
  title,
  content,
  seoTitle,
  seoDescription,
  seoImage
}`

// Récupérer toutes les traductions d'une page
export const PAGE_TRANSLATIONS = `*[_type == "page" && _id == $pageId][0]{
  _id,
  language,
  translations[]->{
    _id,
    title,
    "slug": slug.current,
    language
  }
}`

// Compter le nombre de pages par langue
export const COUNT_PAGES_BY_LANGUAGE = `{
  "fr": count(*[_type == "page" && language == "fr"]),
  "en": count(*[_type == "page" && language == "en"])
}`

// Récupérer les pages récemment modifiées
export const RECENT_PAGES = `*[_type == "page"] | order(_updatedAt desc)[0...5]{
  _id,
  title,
  "slug": slug.current,
  language,
  _updatedAt
}`

// Récupérer les pages sans traduction
export const PAGES_WITHOUT_TRANSLATION = `*[_type == "page" && !defined(translations)]{
  _id,
  title,
  "slug": slug.current,
  language
}`

// Rechercher des pages par titre
export const SEARCH_PAGES = `*[_type == "page" && title match $searchTerm]{
  _id,
  title,
  "slug": slug.current,
  language
}`

// Récupérer les pages avec une section spécifique (ex: hero)
export const PAGES_WITH_HERO = `*[_type == "page" && "hero" in content[]._type]{
  _id,
  title,
  "slug": slug.current,
  language
}`

// Récupérer uniquement les sections hero d'une page
export const PAGE_HERO_SECTIONS = `*[_type == "page" && _id == $pageId][0]{
  "heroSections": content[_type == "hero"]
}`

/**
 * Exemples d'utilisation avec sanityFetch
 */

/*
// Récupérer toutes les pages françaises
const frPages = await sanityFetch({
  query: ALL_PAGES_BY_LANG,
  params: { language: 'fr' }
})

// Récupérer une page spécifique
const page = await sanityFetch({
  query: PAGE_BY_SLUG,
  params: { slug: 'a-propos', language: 'fr' }
})

// Rechercher des pages
const results = await sanityFetch({
  query: SEARCH_PAGES,
  params: { searchTerm: 'contact*' }
})

// Compter les pages
const counts = await sanityFetch({
  query: COUNT_PAGES_BY_LANGUAGE
})
*/
