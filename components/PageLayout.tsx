import Header from './Header'
import Footer from './Footer'
import { DraftModeNotice } from './DraftModeNotice'
import { type Locale } from '@/lib/i18n/config'

type PageLayoutProps = {
  lang: Locale
  translations?: Array<{
    language: string
    slug: { current: string }
  }>
  children: React.ReactNode
  isDraftMode?: boolean
}

export default function PageLayout({
  lang,
  translations,
  children,
  isDraftMode = false,
}: PageLayoutProps) {
  return (
    <>
      {isDraftMode && <DraftModeNotice />}
      <Header lang={lang} translations={translations} />
      <main className="flex-grow">{children}</main>
      <Footer lang={lang} />
    </>
  )
}
