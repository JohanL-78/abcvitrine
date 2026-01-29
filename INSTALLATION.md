# Installation Rapide - ABC Vitrine

Guide d'installation étape par étape pour les développeurs.

## ⚡ Installation en 5 minutes

### 1. Prérequis

```bash
node --version  # Doit être >= 18
npm --version   # Doit être >= 9
```

Si vous n'avez pas Node.js : [Télécharger Node.js](https://nodejs.org/)

### 2. Clone et Installation

```bash
cd abcvitrine
npm install
```

### 3. Configuration Sanity

#### Option A : Nouveau projet Sanity

```bash
# Installer Sanity CLI globalement
npm install -g @sanity/cli

# Initialiser un nouveau projet
sanity init

# Suivez les instructions :
# - Créez un compte ou connectez-vous
# - Créez un nouveau projet
# - Choisissez un nom
# - Dataset: production
# - Schema: Skip (nous avons déjà les schémas)
```

Notez votre **Project ID** affiché à la fin.

#### Option B : Projet Sanity existant

Si vous avez déjà un projet Sanity, récupérez simplement votre Project ID depuis [sanity.io/manage](https://sanity.io/manage).

### 4. Créer les tokens API

1. Allez sur [sanity.io/manage](https://sanity.io/manage)
2. Sélectionnez votre projet
3. Menu "API" > "Tokens"
4. Créez un token avec les permissions :
   - **Viewer** (pour SANITY_API_READ_TOKEN)
   - Ou **Editor** si vous voulez aussi écrire depuis le frontend

### 5. Configuration .env.local

Le fichier `.env.local` existe déjà, remplissez-le :

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=votre-project-id-ici
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-16
SANITY_API_READ_TOKEN=votre-token-ici

NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 6. Déployer le schéma sur Sanity

```bash
npx sanity schema deploy
```

Cette commande envoie vos schémas (Page, Hero, etc.) vers Sanity Cloud.

### 7. Lancer le projet

```bash
npm run dev
```

Ouvrez :
- Frontend : [http://localhost:3000](http://localhost:3000)
- Studio : [http://localhost:3000/studio](http://localhost:3000/studio)

## ✅ Vérification

### Le Studio fonctionne ?

1. Allez sur [http://localhost:3000/studio](http://localhost:3000/studio)
2. Vous devriez voir l'interface Sanity
3. Dans le menu, vous devriez voir "Page"

### Créer votre première page

1. Dans le Studio, cliquez sur "Page"
2. Créez une nouvelle page :
   - Title: "Accueil"
   - Slug: "home"
   - Language: "Français"
3. Ajoutez une section Hero :
   - Title: "Bienvenue sur ABC Vitrine"
   - Subtitle: "Site vitrine haut de gamme"
4. Publiez avec le bouton "Publish"

### Voir la page

Allez sur [http://localhost:3000/fr/home](http://localhost:3000/fr/home)

Vous devriez voir votre Hero Section !

## 🚨 Problèmes courants

### Erreur "Missing environment variable"

➡️ Vérifiez que `.env.local` est bien rempli avec toutes les variables.

### Le Studio affiche une erreur

➡️ Vérifiez votre `NEXT_PUBLIC_SANITY_PROJECT_ID` :

```bash
# Vérifier le Project ID
cat .env.local | grep PROJECT_ID
```

➡️ Supprimez le cache et relancez :

```bash
rm -rf .next
npm run dev
```

### "Schema not found"

➡️ Déployez le schéma :

```bash
npx sanity schema deploy
```

### Les images ne s'affichent pas

➡️ Vérifiez que `cdn.sanity.io` est dans `next.config.ts` :

```typescript
remotePatterns: [
  {
    protocol: 'https',
    hostname: 'cdn.sanity.io',
  },
]
```

### Port 3000 déjà utilisé

➡️ Utilisez un autre port :

```bash
PORT=3001 npm run dev
```

## 🔄 Workflow de développement

### 1. Développer

```bash
npm run dev
```

### 2. Modifier le schéma

Si vous modifiez les fichiers dans `sanity/schemas/` :

```bash
# Redéployer le schéma
npx sanity schema deploy

# Redémarrer le serveur
# Ctrl+C puis npm run dev
```

### 3. Builder pour la production

```bash
npm run build
npm run start
```

## 📦 Déploiement

### Vercel (recommandé)

1. Push votre code sur GitHub
2. Connectez-vous sur [vercel.com](https://vercel.com)
3. "Import Project" > Sélectionnez votre repo
4. Configurez les variables d'environnement (les mêmes que `.env.local`)
5. Déployez !

### Autres plateformes

Le projet est compatible avec :
- Netlify
- Railway
- Render
- DigitalOcean App Platform

Assurez-vous de :
1. Configurer les variables d'environnement
2. Build command : `npm run build`
3. Output directory : `.next`

## 🛠️ Scripts npm disponibles

```bash
npm run dev          # Développement local
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Vérifier le code
```

## 📚 Prochaines étapes

1. ✅ Installation terminée
2. ➡️ Lisez [README.md](./README.md) pour comprendre l'architecture
3. ➡️ Consultez [GUIDE_CLIENT.md](./GUIDE_CLIENT.md) à donner au client
4. ➡️ Créez vos pages de contenu dans le Studio
5. ➡️ Personnalisez les styles dans Tailwind

## 🆘 Besoin d'aide ?

- Documentation Next.js : [nextjs.org/docs](https://nextjs.org/docs)
- Documentation Sanity : [sanity.io/docs](https://www.sanity.io/docs)
- GitHub Issues : Créez une issue sur le repo

---

**Bon développement ! 🚀**
