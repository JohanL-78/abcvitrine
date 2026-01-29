# Documentation Technique - Site Next.js + Sanity

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture du projet](#architecture-du-projet)
3. [Configuration Next.js](#configuration-nextjs)
4. [Configuration Sanity](#configuration-sanity)
5. [Système de routing et i18n](#système-de-routing-et-i18n)
6. [Schémas Sanity](#schémas-sanity)
7. [Récupération des données](#récupération-des-données)
8. [Rendu des pages](#rendu-des-pages)
9. [Draft Mode (Aperçu en temps réel)](#draft-mode)
10. [SEO et métadonnées](#seo-et-métadonnées)

---

## Vue d'ensemble

Ce projet est un site web multilingue (français/anglais) construit avec :

- **Next.js 15** (App Router) : Framework React pour le rendu côté serveur et la génération statique
- **Sanity CMS** : Headless CMS pour la gestion du contenu
- **TypeScript** : Pour la sécurité des types
- **Tailwind CSS** : Pour le styling

### Flux de données

```
Sanity Studio (Studio de gestion de contenu)
    ↓
Sanity API (GROQ queries)
    ↓
Next.js Pages (App Router)
    ↓
React Components (Affichage)
```

---

## Architecture du projet

```
abcvitrine/
├── app/                          # App Router de Next.js 15
│   ├── [lang]/                  # Routes dynamiques multilingues
│   │   ├── [[...slug]]/         # Catch-all route pour toutes les pages
│   │   │   └── page.tsx         # Page principale avec génération statique
│   │   ├── layout.tsx           # Layout spécifique à la langue
│   │   └── not-found.tsx        # Page 404
│   ├── api/                     # API Routes
│   │   ├── draft/               # Activation du draft mode
│   │   └── disable-draft/       # Désactivation du draft mode
│   ├── studio/                  # Sanity Studio intégré
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Styles globaux
│
├── sanity/                       # Configuration Sanity
│   ├── schemas/                 # Schémas de contenu
│   │   ├── documents/           # Types de documents
│   │   │   └── page.ts          # Schéma "page"
│   │   └── sections/            # Sections réutilisables
│   │       ├── hero.ts
│   │       ├── textWithImage.ts
│   │       └── grid.ts
│   ├── lib/                     # Utilitaires Sanity
│   │   ├── client.ts            # Clients Sanity
│   │   ├── fetch.ts             # Fonction de fetch avec cache
│   │   └── image.ts             # Helper pour les images
│   └── env.ts                   # Variables d'environnement
│
├── components/                   # Composants React
│   ├── PageBuilder.tsx          # Composant qui assemble les sections
│   ├── PageLayout.tsx           # Layout de page
│   └── sections/                # Composants de sections
│       ├── HeroSection.tsx
│       ├── TextWithImageSection.tsx
│       └── GridSection.tsx
│
├── lib/                         # Bibliothèques utilitaires
│   └── i18n/
│       └── config.ts            # Configuration i18n
│
├── types/                       # Types TypeScript
│   └── sanity.ts                # Types pour les données Sanity
│
├── middleware.ts                # Middleware Next.js pour i18n
├── next.config.ts               # Configuration Next.js
└── sanity.config.ts             # Configuration Sanity Studio
```

---

## Configuration Next.js

### `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',  // Autorise les images de Sanity CDN
      },
    ],
  },
};

export default nextConfig;
```

**Explication** :
- `images.remotePatterns` : Configure Next.js Image Optimization pour accepter les images hébergées sur le CDN de Sanity
- Permet d'utiliser `next/image` avec les images Sanity pour un chargement optimisé

---

## Configuration Sanity

### `sanity.config.ts`

```typescript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from './sanity/schemas'
import { previewUrlPlugin } from './sanity/plugins/previewUrl'
import { locations, mainDocuments } from './sanity/lib/presentation/resolve'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dd2las0t'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'ABC Vitrine',
  projectId,                      // ID unique du projet Sanity
  dataset,                        // Dataset (production, staging, etc.)
  basePath: '/studio',            // Le studio sera accessible à /studio

  plugins: [
    structureTool(),              // Interface de gestion du contenu
    visionTool(),                 // Outil pour tester les requêtes GROQ
    previewUrlPlugin(),           // Plugin personnalisé pour les URLs de prévisualisation
    presentationTool({            // Aperçu visuel en temps réel
      resolve: { locations, mainDocuments },
      previewUrl: {
        origin: process.env.NEXT_PUBLIC_VERCEL_URL
          ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
          : 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft',   // Route pour activer le draft mode
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,           // Tous les schémas de contenu
  },
})
```

**Explication des plugins** :
- **structureTool** : Fournit l'interface principale du Studio (liste des documents, éditeur, etc.)
- **visionTool** : Console interactive pour tester des requêtes GROQ en direct
- **previewUrlPlugin** : Permet de prévisualiser les pages directement depuis le Studio
- **presentationTool** : Affiche un aperçu en temps réel à côté de l'éditeur

---

## Système de routing et i18n

### `middleware.ts`

Ce fichier gère automatiquement la redirection vers la langue appropriée.

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n, isValidLocale } from './lib/i18n/config'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Exclure les routes API, fichiers statiques et studio
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/studio') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // Vérifier si le pathname a déjà une locale
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Si c'est juste la racine de la locale (ex: /fr ou /en), rediriger vers /locale/home
  const localeRootMatch = i18n.locales.find((locale) => pathname === `/${locale}`)
  if (localeRootMatch) {
    const slug = localeRootMatch === 'fr' ? 'accueil' : 'home'
    const newUrl = new URL(`/${localeRootMatch}/${slug}`, request.url)
    return NextResponse.redirect(newUrl)
  }

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Détecter la locale depuis l'en-tête Accept-Language
  const acceptLanguage = request.headers.get('accept-language')
  const locale = getLocaleFromHeader(acceptLanguage) || i18n.defaultLocale

  // Rediriger vers l'URL préfixée avec la locale
  const newUrl = new URL(`/${locale}${pathname}`, request.url)
  return NextResponse.redirect(newUrl)
}

function getLocaleFromHeader(acceptLanguage: string | null): string | null {
  if (!acceptLanguage) return null

  // Parser l'en-tête Accept-Language
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [locale, q = 'q=1'] = lang.trim().split(';')
      const quality = parseFloat(q.replace('q=', ''))
      return { locale: locale.toLowerCase(), quality }
    })
    .sort((a, b) => b.quality - a.quality)

  // Trouver la première locale supportée
  for (const { locale } of languages) {
    const langCode = locale.split('-')[0]
    if (isValidLocale(langCode)) {
      return langCode
    }
  }

  return null
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|studio|.*\\..*).*)',
  ],
}
```

**Fonctionnement** :
1. Intercepte toutes les requêtes sauf `/api`, `/studio`, fichiers statiques
2. Vérifie si l'URL contient déjà une locale (`/fr/`, `/en/`)
3. Si non, détecte la langue du navigateur via `Accept-Language`
4. Redirige vers l'URL avec le préfixe de langue approprié (`/fr/accueil`, `/en/home`)

### Configuration i18n (`lib/i18n/config.ts`)

```typescript
export const i18n = {
  defaultLocale: 'fr',
  locales: ['fr', 'en'],
} as const

export type Locale = (typeof i18n)['locales'][number]

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
}

export function isValidLocale(locale: string): locale is Locale {
  return i18n.locales.includes(locale as Locale)
}
```

**Explication** :
- Définit les langues supportées (`fr`, `en`)
- Fournit des helpers pour valider les locales
- Utilise TypeScript pour garantir la sécurité des types

---

## Schémas Sanity

### Document `page` (`sanity/schemas/documents/page.ts`)

Le schéma principal pour les pages du site.

```typescript
import { defineType, defineField } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,

  // Organisation en onglets dans le Studio
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'settings',
      title: 'Settings',
    },
  ],

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',        // Génère automatiquement depuis le titre
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: 'Français', value: 'fr' },
          { title: 'English', value: 'en' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      group: 'settings',
      initialValue: 'fr',
    }),
    defineField({
      name: 'translations',
      title: 'Translations',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'page' }],
          options: {
            filter: ({ document }) => {
              const currentLang = (document as { language?: string })?.language
              return {
                filter: 'language != $currentLang',
                params: { currentLang },
              }
            },
          },
        },
      ],
      description: 'Link to translated versions of this page for proper hreflang tags',
      group: 'settings',
    }),
    defineField({
      name: 'content',
      title: 'Page Content',
      type: 'array',
      of: [
        { type: 'hero' },
        { type: 'textWithImage' },
        { type: 'grid' },
      ],
      group: 'content',
    }),
    // Champs SEO
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Override the page title for SEO purposes (recommended: 50-60 characters)',
      validation: (Rule) => Rule.max(60),
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description: 'Meta description for search engines (recommended: 150-160 characters)',
      validation: (Rule) => Rule.max(160),
      group: 'seo',
    }),
    defineField({
      name: 'seoImage',
      title: 'SEO Image',
      type: 'image',
      description: 'Image for social media sharing (Open Graph)',
      options: {
        hotspot: true,
      },
      group: 'seo',
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      description: 'Prevent search engines from indexing this page',
      initialValue: false,
      group: 'seo',
    }),
  ],

  // Aperçu dans le Studio
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      language: 'language',
    },
    prepare({ title, slug, language }) {
      return {
        title: title,
        subtitle: `/${language}/${slug || ''}`,
      }
    },
  },

  options: {
    previewUrl: {
      previewMode: {
        enable: '/api/draft',
      },
    },
  },
})
```

**Points clés** :
- **groups** : Organise les champs en onglets dans l'interface
- **translations** : Référence vers les versions traduites (pour hreflang)
- **content** : Tableau de sections modulaires (hero, textWithImage, grid)
- **Validation** : Règles de validation (champs requis, longueur max)
- **preview** : Configure l'affichage dans la liste des documents

### Section `hero` (`sanity/schemas/sections/hero.ts`)

Une section réutilisable pour les bannières.

```typescript
import { defineType, defineField } from 'sanity'
import { BlockElementIcon } from '@sanity/icons'

export default defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'object',              // Type 'object' car c'est une sous-section, pas un document
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,         // Permet de définir un point focal pour le recadrage
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Call to Action',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Button Text',
          type: 'string',
        },
        {
          name: 'url',
          title: 'URL',
          type: 'string',
          description: 'Can be an internal path (/about) or external URL',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Hero',
        subtitle: subtitle,
        media,
      }
    },
  },
})
```

**Caractéristiques** :
- Type `object` (pas `document`) car c'est une section, pas une entité indépendante
- **hotspot** : Permet de choisir le point focal de l'image pour un recadrage intelligent
- **fields** sur l'image : Ajoute un champ `alt` pour l'accessibilité
- Objet imbriqué `cta` pour le bouton d'action

---

## Récupération des données

### Client Sanity (`sanity/lib/client.ts`)

Crée deux clients : un pour les données publiées, un pour les brouillons.

```typescript
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,                  // Utilise le CDN pour de meilleures performances
  perspective: 'published',      // Ne retourne que les documents publiés
})

export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,                 // Pas de cache pour les aperçus
  perspective: 'drafts',         // Retourne les brouillons
  token: process.env.SANITY_API_READ_TOKEN,  // Token pour accéder aux brouillons
})
```

**Différences clés** :
- **client** : Pour le contenu public (utilise CDN, rapide)
- **previewClient** : Pour les aperçus (pas de cache, nécessite un token)

### Fonction de fetch (`sanity/lib/fetch.ts`)

Wrapper intelligent qui choisit le bon client selon le mode.

```typescript
import 'server-only'               // Garantit que ce code ne s'exécute que côté serveur
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
  // Vérifier si le draft mode est activé
  let isDraftMode = false
  try {
    isDraftMode = (await draftMode()).isEnabled
  } catch {
    // Ignorer l'erreur pendant la génération statique
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
      revalidate: isDraftMode ? 0 : false,  // Pas de cache en draft mode
      tags,                                  // Tags pour la revalidation
    },
  })
}
```

**Fonctionnement** :
1. Détecte si le "draft mode" est activé (aperçu des brouillons)
2. Choisit le client approprié (`previewClient` si draft mode)
3. Configure le cache Next.js :
   - `revalidate: false` : Cache permanent en production
   - `revalidate: 0` : Pas de cache en draft mode
4. **tags** : Permet de révalider des pages spécifiques quand le contenu change

---

## Rendu des pages

### Page principale (`app/[lang]/[[...slug]]/page.tsx`)

Cette page gère toutes les routes dynamiques du site.

```typescript
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/fetch'
import { urlForImage } from '@/sanity/lib/image'
import { type Locale } from '@/lib/i18n/config'
import PageBuilder from '@/components/PageBuilder'
import PageLayout from '@/components/PageLayout'
import type { Page } from '@/types/sanity'

// Requête GROQ pour récupérer une page
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

// Requête pour obtenir toutes les pages (génération statique)
const PAGES_QUERY = `*[_type == "page"]{
  "slug": slug.current,
  language
}`

type PageData = Page

// Génération statique des paramètres de route
export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'placeholder') {
    return []
  }

  try {
    const pages = await sanityFetch<Array<{ slug: string; language: string }>>({
      query: PAGES_QUERY,
    })

    // Transforme les pages en paramètres de route
    return pages.map((page) => ({
      lang: page.language,
      slug: page.slug === 'home' ? [] : page.slug.split('/'),
    }))
  } catch (error) {
    console.warn('Failed to fetch pages for static generation:', error)
    return []
  }
}

// Génération des métadonnées (SEO)
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

  // Construction des liens hreflang pour le multilingue
  const languages: Record<string, string> = {}

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  languages[lang] = `${baseUrl}/${lang}/${slugString === 'home' ? '' : slugString}`

  // Ajouter les traductions
  if (page.translations) {
    page.translations.forEach((translation) => {
      const translationSlug = translation.slug.current
      languages[translation.language] = `${baseUrl}/${translation.language}/${
        translationSlug === 'home' ? '' : translationSlug
      }`
    })
  }

  // Générer l'URL de l'image Open Graph
  const ogImageUrl = page.seoImage
    ? urlForImage(page.seoImage)?.width(1200).height(630).url()
    : undefined

  return {
    title,
    description,
    alternates: {
      canonical: languages[lang],
      languages,                      // hreflang tags
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

// Composant de la page
export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>
}) {
  const { lang, slug } = await params as { lang: Locale; slug?: string[] }
  const slugString = slug?.join('/') || 'home'

  // Vérifier si le draft mode est activé
  let isDraftMode = false
  try {
    isDraftMode = (await draftMode()).isEnabled
  } catch {
    isDraftMode = false
  }

  const page = await sanityFetch<PageData>({
    query: PAGE_QUERY,
    params: { slug: slugString, language: lang },
    tags: [`page:${slugString}:${lang}`],  // Tag pour la revalidation ciblée
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
```

**Points importants** :

#### 1. Routing dynamique avec `[[...slug]]`
- `[lang]` : Segment dynamique pour la langue (fr/en)
- `[[...slug]]` : Catch-all optionnel pour le reste du chemin
- Exemples de routes :
  - `/fr/accueil` → `{ lang: 'fr', slug: ['accueil'] }`
  - `/en/about/team` → `{ lang: 'en', slug: ['about', 'team'] }`
  - `/fr` → `{ lang: 'fr', slug: undefined }`

#### 2. Requête GROQ
```groq
*[_type == "page" && slug.current == $slug && language == $language][0]{...}
```
- `*[...]` : Filtre tous les documents
- `_type == "page"` : Seulement les documents de type "page"
- `slug.current == $slug` : Correspond au slug demandé
- `language == $language` : Correspond à la langue demandée
- `[0]` : Retourne le premier résultat (ou null)
- Projections conditionnelles :
  ```groq
  _type == "hero" => { title, subtitle, image, cta }
  ```
  Retourne certains champs seulement si le type correspond

#### 3. Génération statique (`generateStaticParams`)
- Appelée au build pour pré-générer toutes les pages
- Récupère toutes les pages depuis Sanity
- Retourne un tableau de paramètres de route
- Next.js génère alors une page HTML statique pour chaque combinaison

#### 4. SEO avec `generateMetadata`
- Génère automatiquement les balises meta
- Gère les hreflang tags pour le multilingue
- Configure Open Graph pour les réseaux sociaux
- Gère le `noIndex` pour les pages privées

#### 5. Tags de cache
```typescript
tags: [`page:${slugString}:${lang}`]
```
Permet de révalider une page spécifique quand son contenu change dans Sanity (via webhook)

### PageBuilder (`components/PageBuilder.tsx`)

Composant qui assemble dynamiquement les sections.

```typescript
import HeroSection from './sections/HeroSection'
import TextWithImageSection from './sections/TextWithImageSection'
import GridSection from './sections/GridSection'
import type { PageSection } from '@/types/sanity'

type PageBuilderProps = {
  sections: PageSection[]
}

export default function PageBuilder({ sections }: PageBuilderProps) {
  if (!sections || sections.length === 0) {
    return null
  }

  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case 'hero':
            return <HeroSection key={section._key} {...section} />
          case 'textWithImage':
            return <TextWithImageSection key={section._key} {...section} />
          case 'grid':
            return <GridSection key={section._key} {...section} />
          default: {
            const unknownSection = section as { _type: string; _key: string }
            console.warn(`Unknown section type: ${unknownSection._type}`)
            return null
          }
        }
      })}
    </>
  )
}
```

**Fonctionnement** :
- Reçoit un tableau de sections depuis Sanity
- Utilise `switch` pour rendre le bon composant selon `_type`
- Passe toutes les props avec le spread operator `{...section}`
- Utilise `_key` comme clé unique React (généré automatiquement par Sanity)

**Pattern modulaire** :
Ce système permet d'ajouter facilement de nouvelles sections :
1. Créer un nouveau schéma dans `sanity/schemas/sections/`
2. L'ajouter au champ `content` du schéma `page`
3. Créer le composant React correspondant
4. L'ajouter au switch du PageBuilder

---

## Draft Mode

Le Draft Mode permet de prévisualiser les brouillons Sanity sans les publier.

### Activation (`app/api/draft/route.ts`)

```typescript
import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { client } from '@/sanity/lib/client'

const clientWithToken = client.withConfig({ token: process.env.SANITY_API_READ_TOKEN })

export async function GET(request: Request) {
  // Valide l'URL de prévisualisation avec un secret
  const { isValid, redirectTo = '/' } = await validatePreviewUrl(clientWithToken, request.url)

  if (!isValid) {
    return new Response('Invalid secret', { status: 401 })
  }

  // Active le draft mode
  ;(await draftMode()).enable()

  // Redirige vers la page validée
  redirect(redirectTo)
}
```

**Flux** :
1. Depuis le Studio Sanity, cliquer sur "Preview"
2. Sanity génère une URL sécurisée : `/api/draft?secret=XXX&slug=/fr/accueil`
3. La route API valide le secret
4. Active le draft mode (cookie Next.js)
5. Redirige vers la page
6. La page affiche les brouillons au lieu du contenu publié

**Sécurité** :
- Utilise un secret partagé entre Sanity et Next.js
- Empêche l'accès non autorisé aux brouillons
- Le token `SANITY_API_READ_TOKEN` est nécessaire

### Désactivation (`app/api/disable-draft/route.ts`)

Simple route pour désactiver le draft mode.

```typescript
import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  (await draftMode()).disable()
  return NextResponse.redirect(new URL('/', request.url))
}
```

---

## SEO et métadonnées

### Structure des métadonnées

Le site génère automatiquement :

1. **Title et Description** : Depuis `seoTitle` et `seoDescription`
2. **Canonical URL** : URL principale de la page
3. **Hreflang tags** : Pour indiquer les versions traduites
   ```html
   <link rel="alternate" hreflang="fr" href="https://example.com/fr/accueil" />
   <link rel="alternate" hreflang="en" href="https://example.com/en/home" />
   ```
4. **Open Graph** : Pour Facebook, LinkedIn, etc.
   ```html
   <meta property="og:title" content="..." />
   <meta property="og:description" content="..." />
   <meta property="og:image" content="https://cdn.sanity.io/..." />
   ```
5. **Robots** : Contrôle l'indexation
   ```html
   <meta name="robots" content="noindex, nofollow" />
   ```

### Optimisation des images Sanity

Le helper `urlForImage` optimise automatiquement les images :

```typescript
import createImageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from '../env'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const urlForImage = (source: any) => {
  return imageBuilder?.image(source).auto('format').fit('max')
}
```

**Utilisation** :
```typescript
const ogImageUrl = urlForImage(page.seoImage)
  ?.width(1200)
  .height(630)
  .url()
```

**Avantages** :
- Format automatique (WebP si supporté)
- Redimensionnement à la volée
- CDN global pour des performances optimales
- Cache agressif

---

## Fonctionnalités Next.js utilisées

### 1. App Router
- Routing basé sur le système de fichiers
- Server Components par défaut (meilleure performance)
- Nested layouts
- API Routes intégrées

### 2. Server Components
```typescript
// Par défaut, tous les composants sont des Server Components
export default async function Page() {
  const data = await fetch(...)  // Fetch directement dans le composant
  return <div>{data}</div>
}
```

**Avantages** :
- Pas de JavaScript client pour ces composants
- Accès direct aux APIs et bases de données
- Meilleure performance

### 3. Static Site Generation (SSG)
```typescript
export async function generateStaticParams() {
  // Génère toutes les routes au build
  return pages.map(page => ({ lang: page.language, slug: page.slug }))
}
```

### 4. Cache Next.js
```typescript
next: {
  revalidate: false,  // Cache permanent
  tags: ['page:accueil:fr'],  // Tags pour revalidation ciblée
}
```

---

## Fonctionnalités Sanity utilisées

### 1. GROQ (Graph-Relational Object Queries)
Langage de requête puissant :
```groq
*[_type == "page" && slug.current == $slug][0]{
  title,
  content[]{
    _type,
    _type == "hero" => { title, subtitle }
  },
  translations[]->{ language, slug }
}
```

### 2. Content Lake
- Stockage structuré du contenu
- Versionning automatique
- Relations entre documents (références)

### 3. Sanity Studio
- Interface de gestion de contenu
- Personnalisable (plugins, prévisualisations)
- Hébergé dans votre app Next.js (`/studio`)

### 4. CDN d'images
- Transformation d'images à la volée
- Formats modernes (WebP, AVIF)
- Optimisation automatique

---

## Workflow de développement

### Ajouter une nouvelle page

1. **Dans Sanity Studio** (`/studio`)
   - Créer un nouveau document "Page"
   - Renseigner titre, slug, langue
   - Ajouter des sections (Hero, TextWithImage, etc.)
   - Configurer le SEO
   - Publier

2. **Rebuild Next.js** (pour SSG)
   ```bash
   npm run build
   ```

3. **La page est disponible** à l'URL `/[lang]/[slug]`

### Ajouter un nouveau type de section

1. **Créer le schéma Sanity**
   ```typescript
   // sanity/schemas/sections/newSection.ts
   export default defineType({
     name: 'newSection',
     title: 'New Section',
     type: 'object',
     fields: [...]
   })
   ```

2. **L'ajouter au schéma page**
   ```typescript
   // sanity/schemas/documents/page.ts
   content: {
     type: 'array',
     of: [
       { type: 'hero' },
       { type: 'newSection' },  // Ajout
     ]
   }
   ```

3. **Créer le composant React**
   ```typescript
   // components/sections/NewSection.tsx
   export default function NewSection({ title, ...props }) {
     return <section>...</section>
   }
   ```

4. **L'ajouter au PageBuilder**
   ```typescript
   case 'newSection':
     return <NewSection key={section._key} {...section} />
   ```

---

## Déploiement

### Variables d'environnement nécessaires

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=dd2las0t
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=sk...           # Pour le draft mode

# Next.js
NEXT_PUBLIC_BASE_URL=https://votresite.com

# Vercel (automatique)
NEXT_PUBLIC_VERCEL_URL=votresite.vercel.app
```

### Build de production

```bash
npm run build    # Génère les pages statiques
npm start        # Démarre le serveur de production
```

### Revalidation

Pour mettre à jour le contenu sans rebuild :

1. **Revalidation par tags** (recommandé)
   - Configurer un webhook Sanity
   - Appeler l'API Next.js :
     ```typescript
     revalidateTag('page:accueil:fr')
     ```

2. **On-demand Revalidation**
   ```typescript
   revalidatePath('/fr/accueil')
   ```

3. **Time-based Revalidation**
   ```typescript
   next: { revalidate: 3600 }  // Toutes les heures
   ```

---

## Résumé des fichiers principaux

| Fichier | Rôle |
|---------|------|
| `app/[lang]/[[...slug]]/page.tsx` | Page dynamique principale, gère toutes les routes |
| `middleware.ts` | Redirection automatique vers la bonne langue |
| `sanity.config.ts` | Configuration du Studio Sanity |
| `next.config.ts` | Configuration Next.js (images, etc.) |
| `sanity/lib/client.ts` | Clients Sanity (published/drafts) |
| `sanity/lib/fetch.ts` | Fonction de fetch avec cache intelligent |
| `sanity/schemas/documents/page.ts` | Schéma principal des pages |
| `sanity/schemas/sections/*.ts` | Schémas des sections réutilisables |
| `components/PageBuilder.tsx` | Assemble dynamiquement les sections |
| `app/api/draft/route.ts` | Active le mode aperçu |

---

## Concepts clés à retenir

1. **Headless CMS** : Sanity gère le contenu, Next.js gère l'affichage
2. **Server Components** : Rendu côté serveur par défaut (performances)
3. **Static Generation** : Pages pré-générées au build (ultra rapide)
4. **GROQ** : Langage de requête flexible et puissant
5. **Draft Mode** : Prévisualisation des brouillons sans publication
6. **Modularité** : Sections réutilisables et combinables
7. **i18n** : Gestion multilingue via middleware et champs Sanity
8. **SEO** : Métadonnées générées automatiquement
9. **TypeScript** : Sécurité des types pour éviter les bugs
10. **Cache Next.js** : Performances optimales avec tags de revalidation

---

Cette architecture permet de créer un site performant, maintenable et évolutif, où les éditeurs peuvent gérer le contenu facilement via Sanity Studio sans toucher au code.
