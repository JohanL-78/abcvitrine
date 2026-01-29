# 🚀 Quick Start - ABC Vitrine

## Installation en 5 minutes

### 1. Vérifier les prérequis

```bash
node --version  # >= 18.x
npm --version   # >= 9.x
```

### 2. Les dépendances sont déjà installées !

Le projet a déjà toutes les dépendances installées :
- Next.js 15.5.9
- Sanity v3
- Tailwind CSS
- TypeScript
- Et tous les packages nécessaires

### 3. Configurer Sanity

#### Option A : Créer un nouveau projet Sanity

```bash
# 1. Installer Sanity CLI globalement
npm install -g @sanity/cli

# 2. Initialiser Sanity (cela créera un projet sur sanity.io)
npx sanity init --project-plan free

# Suivez les instructions :
# - Login/Signup sur Sanity
# - Nom du projet : "ABC Vitrine"
# - Dataset : "production"
# - Schéma : Skip (nous avons déjà les schémas)

# 3. Notez le PROJECT_ID qui s'affiche
```

#### Option B : Utiliser un projet Sanity existant

Si vous avez déjà un compte Sanity :
1. Allez sur https://sanity.io/manage
2. Créez un nouveau projet
3. Notez le Project ID

### 4. Créer un token API

1. Allez sur https://sanity.io/manage
2. Sélectionnez votre projet
3. Menu "API" > "Tokens"
4. "Add API token"
   - Name: "Production Read"
   - Permissions: **Viewer**
5. Copiez le token généré

### 5. Configurer les variables d'environnement

Éditez le fichier `.env.local` :

```bash
# Remplacez ces valeurs par les vôtres
NEXT_PUBLIC_SANITY_PROJECT_ID=votre-project-id-ici
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-16
SANITY_API_READ_TOKEN=votre-token-ici

# Gardez cette valeur pour le développement local
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 6. Déployer les schémas Sanity

```bash
npx sanity schema deploy
```

Cela envoie les schémas (Page, Hero, TextWithImage, Grid) vers Sanity Cloud.

### 7. Lancer le projet !

```bash
npm run dev
```

Ouvrez :
- **Frontend** : http://localhost:3000
- **Sanity Studio** : http://localhost:3000/studio

## 📝 Première utilisation

### Créer votre première page

1. Allez sur http://localhost:3000/studio
2. Vous serez redirigé vers Sanity pour vous connecter
3. Une fois connecté, vous verrez le Studio
4. Cliquez sur **"Page"** dans le menu
5. Cliquez sur le bouton **"+"** (Create)

### Configurer la page

**Onglet Content** :
- Title: `Accueil`
- Slug: Cliquez sur "Generate" → `accueil` (ou `home`)

**Onglet Settings** :
- Language: `Français`

### Ajouter du contenu

Dans **"Page Content"**, cliquez sur **"Add item"** :

#### Hero Section
1. Sélectionnez "Hero Section"
2. Title: `Bienvenue sur ABC Vitrine`
3. Subtitle: `Site vitrine haut de gamme avec Next.js et Sanity`
4. Background Image: Cliquez "Select" > Upload une image
   - Alt text: `Bannière d'accueil`
5. CTA:
   - Button Text: `Découvrir`
   - URL: `/fr/services`

#### Text with Image
1. Ajoutez une nouvelle section "Text with Image"
2. Heading: `À propos de nous`
3. Rich Text: Écrivez quelques paragraphes
4. Image: Uploadez une image + alt text
5. Image Position: `Right` (droite)

#### Grid Section
1. Ajoutez "Grid Section"
2. Section Heading: `Nos services`
3. Columns: `3`
4. Items: Cliquez "Add item" 3 fois
   - Pour chaque item:
     - Title: `Service 1`, `Service 2`, `Service 3`
     - Description: Description du service
     - Image: Upload + alt text

### Publier

Cliquez sur **"Publish"** en haut à droite.

### Voir votre page

Allez sur : http://localhost:3000/fr/home

🎉 Votre première page est en ligne !

## 🌍 Créer la version anglaise

1. Créez une nouvelle page
2. Title: `Home`
3. Slug: `home`
4. Language: **English**
5. Ajoutez le même contenu (traduit en anglais)
6. Dans **Translations**, sélectionnez la page française
7. Revenez sur la page française et ajoutez la page anglaise dans **Translations**
8. Publiez les deux pages

Vos URLs seront :
- Français : http://localhost:3000/fr/home
- Anglais : http://localhost:3000/en/home

Les balises hreflang seront automatiques !

## 🔧 Commandes utiles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Serveur de production
npm run start

# Linter
npm run lint

# Déployer les schémas Sanity
npx sanity schema deploy
```

## 🐛 Problèmes courants

### Le Studio ne charge pas

**Solution** :
```bash
# Vérifiez vos variables d'environnement
cat .env.local

# Redémarrez le serveur
# Ctrl+C puis npm run dev
```

### "Dataset not found"

**Solution** :
- Vérifiez que `NEXT_PUBLIC_SANITY_PROJECT_ID` est correct
- Vérifiez que le dataset existe (généralement "production")
- Sur https://sanity.io/manage > votre projet > Datasets

### Les images ne s'affichent pas

**Solution** :
- Vérifiez que chaque image a un **Alt text** (obligatoire)
- Vérifiez `next.config.ts` : `cdn.sanity.io` doit être autorisé

### Erreur lors du build

**Solution** :
```bash
# Supprimez le cache
rm -rf .next

# Relancez le build
npm run build
```

## 📚 Documentation complète

- **README.md** : Documentation technique complète
- **INSTALLATION.md** : Guide d'installation détaillé
- **GUIDE_CLIENT.md** : Manuel pour le client final
- **PROJET_RECAP.md** : Récapitulatif du projet

## 🚀 Déployer en production

### Sur Vercel (recommandé)

1. Push votre code sur GitHub
2. Allez sur [vercel.com](https://vercel.com)
3. "New Project" > Import votre repo GitHub
4. Configurez les variables d'environnement :
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
   - `SANITY_API_READ_TOKEN`
   - `NEXT_PUBLIC_BASE_URL` (votre domaine final)
5. Cliquez "Deploy"

### Configurer CORS Sanity

Pour que le Studio fonctionne en production :

1. https://sanity.io/manage
2. Votre projet > API > CORS origins
3. "Add CORS origin"
4. Origin: `https://votre-domaine.vercel.app`
5. Allow credentials: ✅

## ✅ Checklist avant déploiement

- [ ] `.env.local` configuré avec de vraies valeurs
- [ ] Schémas déployés : `npx sanity schema deploy`
- [ ] Au moins une page créée et publiée
- [ ] Build réussit : `npm run build`
- [ ] CORS configuré sur Sanity pour votre domaine
- [ ] Variables d'environnement configurées sur Vercel
- [ ] `NEXT_PUBLIC_BASE_URL` pointe vers votre domaine de production

---

**Besoin d'aide ?** Consultez les fichiers de documentation ou créez une issue GitHub.

**Bon développement ! 🎉**
