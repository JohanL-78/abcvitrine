# ABC Vitrine - Site Vitrine Haut de Gamme

Site vitrine Next.js 15.5.9 avec Sanity CMS et internationalisation FR/EN.

## 🚀 Stack Technique

- **Framework**: Next.js 15.5.9 (App Router)
- **Language**: TypeScript (Strict)
- **CMS**: Sanity.io v3
- **Styling**: Tailwind CSS
- **I18n**: Middleware natif Next.js (`/fr/...`, `/en/...`)

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- Compte Sanity.io (gratuit)

## 🔧 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Créer un projet Sanity

Si vous n'avez pas encore de projet Sanity :

```bash
npm install -g @sanity/cli
sanity init
```

Suivez les instructions pour créer un nouveau projet. Notez votre **Project ID** et **Dataset**.

### 3. Configuration des variables d'environnement

Copiez le fichier exemple et remplissez vos valeurs :

```bash
cp .env.local.example .env.local
```

Éditez `.env.local` :

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=votre-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=votre-api-token
SANITY_API_READ_TOKEN=votre-read-token

# URL de base (pour le SEO et sitemap)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Comment obtenir les tokens Sanity :**
1. Allez sur [sanity.io/manage](https://sanity.io/manage)
2. Sélectionnez votre projet
3. Allez dans "API" > "Tokens"
4. Créez un token avec les permissions appropriées

### 4. Déployer le schéma Sanity

```bash
npx sanity schema deploy
```

## 🎯 Démarrage

### Mode développement

Lancez Next.js et le Studio Sanity simultanément :

```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Sanity Studio**: [http://localhost:3000/studio](http://localhost:3000/studio)

## 📁 Structure du Projet

```
abcvitrine/
├── app/                          # Next.js App Router
│   ├── [lang]/                   # Routes internationalisées
│   │   ├── [[...slug]]/          # Catch-all pour les pages dynamiques
│   │   │   └── page.tsx          # Page dynamique avec SEO
│   │   └── layout.tsx            # Layout avec lang
│   ├── api/                      # API Routes
│   │   ├── draft/                # Activer le Draft Mode
│   │   └── disable-draft/        # Désactiver le Draft Mode
│   ├── studio/                   # Sanity Studio embeddé
│   ├── sitemap.ts                # Sitemap dynamique
│   ├── robots.ts                 # Robots.txt
│   └── layout.tsx                # Root layout
├── components/                   # Composants React
│   ├── PageBuilder.tsx           # Switch des sections
│   └── sections/                 # Composants sections
│       ├── HeroSection.tsx
│       ├── TextWithImageSection.tsx
│       └── GridSection.tsx
├── lib/                          # Utilitaires
│   └── i18n/
│       └── config.ts             # Configuration i18n
├── sanity/                       # Configuration Sanity
│   ├── schemas/                  # Schémas Sanity
│   │   ├── documents/
│   │   │   └── page.ts           # Schéma Page
│   │   ├── sections/
│   │   │   ├── hero.ts
│   │   │   ├── textWithImage.ts
│   │   │   └── grid.ts
│   │   └── index.ts
│   ├── lib/
│   │   ├── client.ts             # Client Sanity
│   │   ├── fetch.ts              # Fetch avec Draft Mode
│   │   └── image.ts              # Helper images
│   └── env.ts                    # Variables d'environnement
├── middleware.ts                 # Middleware i18n
├── sanity.config.ts              # Config Sanity Studio
└── tailwind.config.ts            # Config Tailwind
```

## 🌍 Internationalisation

Le site utilise une stratégie **Document-Level Translation** :

- Chaque page existe en tant que document séparé dans Sanity
- Les pages sont liées via le champ `translations`
- Les slugs peuvent être différents par langue (`/fr/a-propos` vs `/en/about-us`)
- Les balises `hreflang` sont générées automatiquement

### Créer une page multilingue

1. Créez une page en français dans Sanity Studio
2. Créez une page en anglais avec le même contenu
3. Liez-les via le champ "Translations" dans chaque page

## 🎨 Page Builder

Le système de Page Builder permet au client de construire ses pages avec 3 types de blocs :

### Hero Section
- Titre, sous-titre
- Image de fond
- Call-to-Action (bouton)

### Text with Image
- Titre
- Contenu riche (Rich Text)
- Image (gauche ou droite)

### Grid Section
- Titre de section
- Grille d'items (2, 3 ou 4 colonnes)
- Chaque item : titre, description, image, lien

## 🔍 SEO

### Métadonnées dynamiques
- Title et description par page
- Open Graph (réseaux sociaux)
- Balises `hreflang` pour le multilingue
- Balises `canonical`
- Option `noIndex` par page

### Sitemap & Robots
- Sitemap.xml généré automatiquement
- Exclut les pages avec `noIndex`
- Robots.txt configuré

### Performance
- Images optimisées avec `next/image`
- SSG (Static Site Generation)
- ISR (Incremental Static Regeneration) avec revalidation

## 👁️ Visual Editing (Draft Mode)

Le Draft Mode permet de prévisualiser le contenu avant publication :

1. Dans Sanity Studio, cliquez sur "Preview" sur une page
2. Le contenu en brouillon s'affiche
3. Pour désactiver : `/api/disable-draft`

## 🚀 Déploiement

### Vercel (recommandé)

1. Push votre code sur GitHub
2. Connectez votre repo sur [vercel.com](https://vercel.com)
3. Configurez les variables d'environnement
4. Déployez !

### Variables d'environnement en production

N'oubliez pas de configurer :
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN`
- `NEXT_PUBLIC_BASE_URL` (votre domaine de production)

## 📝 Ajouter de nouveaux blocs

Pour ajouter un nouveau type de section au Page Builder :

### 1. Créer le schéma Sanity

Créez `sanity/schemas/sections/votreSection.ts` :

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'votreSection',
  title: 'Votre Section',
  type: 'object',
  fields: [
    defineField({
      name: 'titre',
      title: 'Titre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    // Autres champs...
  ],
})
```

### 2. Enregistrer le schéma

Dans `sanity/schemas/index.ts` :

```typescript
import votreSection from './sections/votreSection'

export const schemaTypes = [
  // ...
  votreSection,
]
```

### 3. Ajouter au schéma Page

Dans `sanity/schemas/documents/page.ts`, ajoutez le type dans le champ `content` :

```typescript
of: [
  { type: 'hero' },
  { type: 'textWithImage' },
  { type: 'grid' },
  { type: 'votreSection' }, // ⬅️ Nouveau
],
```

### 4. Créer le composant React

Créez `components/sections/VotreSectionComponent.tsx` :

```typescript
type VotreSectionProps = {
  titre: string
  // ...
}

export default function VotreSectionComponent({ titre }: VotreSectionProps) {
  return (
    <section className="py-16">
      <h2>{titre}</h2>
      {/* Votre contenu */}
    </section>
  )
}
```

### 5. Ajouter au PageBuilder

Dans `components/PageBuilder.tsx` :

```typescript
import VotreSectionComponent from './sections/VotreSectionComponent'

// Dans le switch
case 'votreSection':
  return <VotreSectionComponent key={section._key} {...section} />
```

## 🛠️ Scripts disponibles

```bash
npm run dev          # Développement
npm run build        # Build production
npm run start        # Serveur production
npm run lint         # Linter
```

## 📚 Documentation

- [Next.js](https://nextjs.org/docs)
- [Sanity](https://www.sanity.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🐛 Résolution des problèmes

### Erreur "Missing environment variable"

Vérifiez que votre fichier `.env.local` est bien configuré avec toutes les variables.

### Le Studio ne s'affiche pas

1. Vérifiez que vous avez bien configuré `NEXT_PUBLIC_SANITY_PROJECT_ID`
2. Essayez de supprimer `.next` et relancez `npm run dev`

### Les images ne s'affichent pas

1. Vérifiez que le domaine `cdn.sanity.io` est autorisé dans `next.config.ts`
2. Vérifiez que vos images ont bien un champ `alt` rempli

## 📄 Licence

Propriétaire - ABC Vitrine
