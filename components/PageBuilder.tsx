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
