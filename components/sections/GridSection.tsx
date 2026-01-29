import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'
import type { GridSection as GridSectionType } from '@/types/sanity'

type GridSectionProps = Omit<GridSectionType, '_type' | '_key'>

export default function GridSection({
  heading,
  items,
  columns = 3,
}: GridSectionProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[columns] || 'md:grid-cols-3'

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {heading}
          </h2>
        )}

        <div className={`grid grid-cols-1 ${gridCols} gap-8`}>
          {items.map((item, index) => {
            const imageUrl = item.image
              ? urlForImage(item.image)?.width(600).height(400).url()
              : null

            return (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                {imageUrl && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={imageUrl}
                      alt={item.image?.alt || ''}
                      fill
                      className="object-cover"
                      sizes={`(max-width: 768px) 100vw, ${100 / columns}vw`}
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-600 mb-4">{item.description}</p>
                  )}
                  {item.link?.text && item.link?.url && (
                    <a
                      href={item.link.url}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {item.link.text} →
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
