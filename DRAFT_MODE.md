# Draft Mode / Visual Editing

Ce projet est configuré avec le **Draft Mode** (mode prévisualisation) de Next.js et le **Presentation Tool** de Sanity pour permettre la prévisualisation en temps réel du contenu en cours d'édition.

## <¯ Fonctionnalités

- Prévisualisation des brouillons directement depuis Sanity Studio
- Bandeau visuel indiquant le mode prévisualisation
- Possibilité de quitter le mode preview facilement
- Système de token sécurisé pour éviter les accès non autorisés

## =' Configuration

### Variables d'environnement

Assurez-vous d'avoir ces variables dans votre `.env.local` :

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=dd2las0t
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token_here
```

Le `SANITY_API_READ_TOKEN` est **requis** pour le Draft Mode car il permet de lire les brouillons depuis l'API Sanity.

### Obtenir un token de lecture

1. Allez sur [sanity.io/manage](https://sanity.io/manage)
2. Sélectionnez votre projet
3. Allez dans **API** > **Tokens**
4. Créez un nouveau token avec les permissions **Viewer** (lecture seule)
5. Copiez le token et ajoutez-le dans `.env.local`

## =Ö Utilisation

### Depuis Sanity Studio

1. Ouvrez le Studio sur `/studio`
2. Créez ou modifiez une page
3. Cliquez sur l'icône **Presentation** dans la barre latérale (icône d'Sil)
4. Le Studio affichera votre page en mode preview à côté de l'éditeur
5. Les modifications s'affichent en temps réel

### Manuellement via URL

Vous pouvez aussi activer le Draft Mode manuellement :

```
http://localhost:3000/api/draft?slug=accueil&lang=fr
```

Paramètres :
- `slug` : Le slug de la page à prévisualiser
- `lang` : La langue (`fr` ou `en`)

### Quitter le Draft Mode

Deux méthodes :

1. **Via le bandeau jaune** : Cliquez sur "Quitter le mode preview"
2. **Via URL directe** :
   ```
   http://localhost:3000/api/disable-draft?redirect=/fr/accueil
   ```

## =à Fonctionnement technique

### Architecture

1. **API Routes** :
   - `/api/draft` : Active le Draft Mode et redirige vers la page
   - `/api/disable-draft` : Désactive le Draft Mode

2. **Clients Sanity** :
   - `client` : Client normal, lit uniquement le contenu publié
   - `previewClient` : Client avec token, lit les brouillons

3. **sanityFetch** :
   - Détecte automatiquement si Draft Mode est actif
   - Utilise `previewClient` si actif, sinon `client`
   - Désactive le cache Next.js en mode draft

4. **Composants** :
   - `DraftModeNotice` : Bandeau jaune affiché en mode preview
   - `PageLayout` : Gère l'affichage conditionnel du bandeau

### Flux de données

```
Sanity Studio (Presentation Tool)
    “
/api/draft?slug=...&lang=...
    “
Draft Mode activé (cookie Next.js)
    “
Page chargée avec sanityFetch
    “
previewClient utilisé (lit les brouillons)
    “
Bandeau de preview affiché
```

## = Sécurité

- Le token API n'est **jamais exposé** côté client
- Seul le serveur Next.js peut lire les brouillons
- Le Draft Mode utilise des cookies sécurisés
- La validation de token est effectuée à chaque requête

## =€ En production

Pour déployer sur Vercel :

1. Ajoutez les variables d'environnement dans les settings Vercel
2. Le `NEXT_PUBLIC_VERCEL_URL` sera automatiquement défini
3. Le Presentation Tool utilisera automatiquement l'URL de production

## = Troubleshooting

### Les brouillons ne s'affichent pas

- Vérifiez que `SANITY_API_READ_TOKEN` est bien défini
- Vérifiez que le token a les bonnes permissions (Viewer minimum)
- Consultez les logs dans la console

### Le bandeau ne s'affiche pas

- Vérifiez que vous êtes passé par `/api/draft`
- Vérifiez que `isDraftMode` est bien passé à `PageLayout`

### Erreur "Invalid secret"

- Ce serait normal si vous utilisez `validatePreviewUrl` sans configurer le secret
- Pour l'instant, la route `/api/draft` fonctionne sans validation de secret (à sécuriser en production)
