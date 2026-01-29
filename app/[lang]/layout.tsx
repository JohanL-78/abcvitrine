import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { i18n, type Locale } from '@/lib/i18n/config'
import { VisualEditing } from '@/components/VisualEditing'

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export const metadata: Metadata = {
  title: 'ABC Vitrine',
  description: 'Site vitrine haut de gamme',
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params as { lang: Locale }

  // Check if draft mode is enabled
  let isDraftMode = false
  try {
    isDraftMode = (await draftMode()).isEnabled
  } catch {
    isDraftMode = false
  }

  return (
    <html lang={lang}>
      <body className="flex flex-col min-h-screen">
        {children}
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  )
}
