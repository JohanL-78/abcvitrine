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
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool(),
    visionTool(),
    previewUrlPlugin(),
    presentationTool({
      resolve: { locations, mainDocuments },
      previewUrl: {
        origin: process.env.NEXT_PUBLIC_VERCEL_URL
          ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
          : 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft',
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
})
