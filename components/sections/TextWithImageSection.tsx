import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { urlForImage } from '@/sanity/lib/image'
import type { TextWithImageSection as TextWithImageSectionType } from '@/types/sanity'

type TextWithImageSectionProps = Omit<TextWithImageSectionType, '_type' | '_key'>

const portableTextComponents = {
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-3xl font-bold mb-4">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-2xl font-bold mb-3">{children}</h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => <p className="mb-4">{children}</p>,
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }: { children?: React.ReactNode }) => <em className="italic">{children}</em>,
    link: ({ value, children }: { value?: { href?: string }; children?: React.ReactNode }) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      )
    },
  },
}

export default function TextWithImageSection({
  heading,
  text,
  image,
  imagePosition = 'right',
}: TextWithImageSectionProps) {
  const imageUrl = urlForImage(image)?.width(800).height(600).url()

  const imageElement = imageUrl && (
    <div className="relative h-full min-h-[400px]">
      <Image
        src={imageUrl}
        alt={image.alt || ''}
        fill
        className="object-cover rounded-lg"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  )

  const textElement = (
    <div className="flex flex-col justify-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
      <div className="prose prose-lg max-w-none">
        <PortableText value={text} components={portableTextComponents} />
      </div>
    </div>
  )

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {imagePosition === 'left' ? (
            <>
              {imageElement}
              {textElement}
            </>
          ) : (
            <>
              {textElement}
              {imageElement}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
