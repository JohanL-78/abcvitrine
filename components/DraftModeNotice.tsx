'use client'

import { usePathname } from 'next/navigation'

export function DraftModeNotice() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-yellow-400 text-black px-4 py-3 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold">Mode Previsualisation</span>
          <span className="text-sm opacity-75">
            Vous voyez le contenu en brouillon
          </span>
        </div>
        <a
          href={`/api/disable-draft?redirect=${pathname}`}
          className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Quitter le mode preview
        </a>
      </div>
    </div>
  )
}
