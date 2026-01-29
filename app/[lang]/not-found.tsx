import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
            <h2 className="text-2xl font-bold">Page introuvable</h2>
            <p>La page que vous cherchez n&apos;existe pas.</p>
            <Link
                href="/"
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
                Retour à l&apos;accueil
            </Link>
        </div>
    )
}
