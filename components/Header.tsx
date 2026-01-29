import Link from 'next/link'
import { type Locale, localeNames } from '@/lib/i18n/config'

type HeaderProps = {
  lang: Locale
  currentSlug?: string
  translations?: Array<{
    language: string
    slug: { current: string }
  }>
}

export default function Header({ lang, translations }: HeaderProps) {
  // Navigation items - À personnaliser selon vos besoins
  const navItems = {
    fr: [
      { label: 'Accueil', href: '/fr/home' },
      { label: 'À propos', href: '/fr/a-propos' },
      { label: 'Services', href: '/fr/services' },
      { label: 'Contact', href: '/fr/contact' },
    ],
    en: [
      { label: 'Home', href: '/en/home' },
      { label: 'About', href: '/en/about' },
      { label: 'Services', href: '/en/services' },
      { label: 'Contact', href: '/en/contact' },
    ],
  }

  const otherLang: Locale = lang === 'fr' ? 'en' : 'fr'

  // Trouver l'URL de la page traduite
  const translatedPage = translations?.find((t) => t.language === otherLang)
  const translatedUrl = translatedPage
    ? `/${otherLang}/${translatedPage.slug.current}`
    : `/${otherLang}`

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href={`/${lang}/home`} className="text-2xl font-bold">
            ABC Vitrine
          </Link>

          {/* Navigation */}
          <ul className="hidden md:flex space-x-8">
            {navItems[lang].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Language Switcher */}
          <div className="flex items-center space-x-4">
            <Link
              href={translatedUrl}
              className="text-sm hover:text-blue-600 transition-colors"
            >
              {localeNames[otherLang]}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
