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
