import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n, isValidLocale } from './lib/i18n/config'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Exclude API routes, static files, and studio
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/studio') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // If it's just the locale root (e.g., /fr or /en), redirect to /locale/home or /locale/accueil
  const localeRootMatch = i18n.locales.find((locale) => pathname === `/${locale}`)
  if (localeRootMatch) {
    const slug = localeRootMatch === 'fr' ? 'accueil' : 'home'
    const newUrl = new URL(`/${localeRootMatch}/${slug}`, request.url)
    return NextResponse.redirect(newUrl)
  }

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Detect locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  const locale = getLocaleFromHeader(acceptLanguage) || i18n.defaultLocale

  // Redirect to locale-prefixed URL
  const newUrl = new URL(`/${locale}${pathname}`, request.url)
  return NextResponse.redirect(newUrl)
}

function getLocaleFromHeader(acceptLanguage: string | null): string | null {
  if (!acceptLanguage) return null

  // Parse Accept-Language header
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [locale, q = 'q=1'] = lang.trim().split(';')
      const quality = parseFloat(q.replace('q=', ''))
      return { locale: locale.toLowerCase(), quality }
    })
    .sort((a, b) => b.quality - a.quality)

  // Find the first supported locale
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
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - studio (Sanity Studio)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|studio|.*\\..*).*)',
  ],
}
