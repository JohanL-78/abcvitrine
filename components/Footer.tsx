import Link from 'next/link'
import { type Locale } from '@/lib/i18n/config'

type FooterProps = {
  lang: Locale
}

export default function Footer({ lang }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    fr: {
      legal: [
        { label: 'Mentions légales', href: '/fr/mentions-legales' },
        { label: 'Politique de confidentialité', href: '/fr/politique-confidentialite' },
        { label: 'CGV', href: '/fr/cgv' },
      ],
      contact: {
        title: 'Contact',
        email: 'contact@abcvitrine.com',
        phone: '+33 1 23 45 67 89',
      },
    },
    en: {
      legal: [
        { label: 'Legal Notice', href: '/en/legal-notice' },
        { label: 'Privacy Policy', href: '/en/privacy-policy' },
        { label: 'Terms of Service', href: '/en/terms' },
      ],
      contact: {
        title: 'Contact',
        email: 'contact@abcvitrine.com',
        phone: '+33 1 23 45 67 89',
      },
    },
  }

  const content = footerLinks[lang]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">ABC Vitrine</h3>
            <p className="text-gray-400">
              {lang === 'fr'
                ? 'Site vitrine haut de gamme'
                : 'High-end showcase website'}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{content.contact.title}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href={`mailto:${content.contact.email}`}
                  className="hover:text-white transition-colors"
                >
                  {content.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${content.contact.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {content.contact.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {lang === 'fr' ? 'Légal' : 'Legal'}
            </h3>
            <ul className="space-y-2 text-gray-400">
              {content.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            © {currentYear} ABC Vitrine.{' '}
            {lang === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  )
}
