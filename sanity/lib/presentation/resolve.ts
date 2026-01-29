// @ts-nocheck
// Map URLs to documents
export const mainDocuments = [
  {
    route: '/:language/:slug',
    filter: `_type == "page" && language == $language && slug.current == $slug`,
  },
]

// Map documents to URLs
export const locations = {
  page: {
    select: {
      title: 'title',
      slug: 'slug.current',
      language: 'language',
    },
    resolve: (doc: any) => {
      if (!doc?.slug || !doc?.language) {
        return { locations: [] }
      }

      return {
        locations: [
          {
            title: doc.title || 'Page',
            href: `/${doc.language}/${doc.slug}`,
          },
        ],
      }
    },
  },
}
