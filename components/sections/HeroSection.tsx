import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'
import type { HeroSection as HeroSectionType } from '@/types/sanity'

type HeroSectionProps = Omit<HeroSectionType, '_type' | '_key'>

export default function HeroSection({
  title,
  subtitle,
  image,
  cta,
}: HeroSectionProps) {
  const imageUrl = image ? urlForImage(image)?.width(1920).height(1080).url() : null

  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {imageUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            alt={image?.alt || ''}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-4xl mx-auto">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
            {subtitle}
          </p>
        )}
        {cta?.text && cta?.url && (
          <a
            href={cta.url}
            className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {cta.text}
          </a>
        )}
      </div>
    </section>
  )
}
