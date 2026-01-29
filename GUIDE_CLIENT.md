# Guide d'Utilisation - Sanity Studio

Guide simple pour gérer le contenu de votre site vitrine.

## 🎯 Accéder au Studio

Une fois le site déployé, accédez au Studio via :
- En développement : `http://localhost:3000/studio`
- En production : `https://votre-site.com/studio`

## 📄 Créer une nouvelle page

### 1. Créer la page en Français

1. Dans le Studio, cliquez sur **"Page"** dans le menu
2. Cliquez sur le bouton **"+"** ou **"Create new document"**
3. Remplissez les champs :

#### Onglet "Content"
- **Title** : Le nom de votre page (ex: "À propos")
- **Slug** : L'URL de la page (ex: "a-propos")
  - Cliquez sur "Generate" pour générer automatiquement depuis le titre

#### Onglet "Settings"
- **Language** : Sélectionnez "Français"
- **Translations** : Laissez vide pour l'instant

4. Cliquez sur **"Publish"** pour publier

### 2. Créer la version Anglaise

1. Créez une nouvelle page
2. Remplissez avec la traduction anglaise
3. **Important** : Dans "Settings" > "Language", sélectionnez "English"
4. Dans **"Translations"**, sélectionnez la page française créée précédemment
5. Retournez sur la page française et ajoutez la page anglaise dans "Translations"
6. Publiez les deux pages

✅ Vos deux pages sont maintenant liées pour le SEO multilingue !

## 🏗️ Construire le contenu d'une page

Dans l'onglet **"Content"** de votre page, vous pouvez ajouter des sections :

### Hero Section (Bannière d'accueil)

Parfait pour la bannière principale de votre page.

**Champs :**
- **Title** : Titre principal (grand, visible)
- **Subtitle** : Sous-titre (optionnel)
- **Background Image** : Image de fond
  - Cliquez sur "Select" pour choisir une image
  - N'oubliez pas le champ "Alternative Text" (important pour l'accessibilité)
- **Call to Action** : Bouton d'action
  - **Button Text** : Texte du bouton (ex: "En savoir plus")
  - **URL** : Lien (ex: "/contact" ou "https://...")

### Text with Image

Section de texte avec une image à gauche ou à droite.

**Champs :**
- **Heading** : Titre de la section
- **Rich Text** : Votre contenu
  - Utilisez les boutons de formatage (gras, italique, liens, titres)
- **Image** : Choisissez votre image + texte alternatif
- **Image Position** : Gauche ou Droite

### Grid Section (Grille)

Affiche une grille d'éléments (produits, services, équipe, etc.)

**Champs :**
- **Section Heading** : Titre de la section (optionnel)
- **Number of Columns** : 2, 3 ou 4 colonnes
- **Grid Items** : Cliquez sur "Add item" pour ajouter des éléments
  - Chaque item a :
    - Title
    - Description
    - Image
    - Link (optionnel)

## 🔍 Optimiser pour le SEO

### Onglet "SEO" de votre page

Pour améliorer votre référencement Google :

1. **SEO Title** : Titre pour Google (50-60 caractères max)
   - Si vide, le titre de la page sera utilisé

2. **SEO Description** : Description pour Google (150-160 caractères)
   - C'est ce texte qui apparaît sous votre lien dans les résultats de recherche

3. **SEO Image** : Image pour les réseaux sociaux
   - S'affiche quand vous partagez la page sur Facebook, LinkedIn, etc.

4. **No Index** : Cochez pour cacher la page de Google
   - Utile pour les pages en construction ou privées

## 📸 Gestion des images

### Bonnes pratiques

1. **Format** : Utilisez JPG pour les photos, PNG pour les logos
2. **Taille** : Pas plus de 2 Mo par image
3. **Dimensions recommandées** :
   - Hero : 1920x1080 px
   - Text with Image : 800x600 px
   - Grid : 600x400 px
   - SEO Image : 1200x630 px

### Texte alternatif (Alt Text)

**Obligatoire** pour chaque image !
- Décrivez ce que montre l'image en une phrase courte
- Exemple : "Équipe ABC devant le bureau"
- Important pour :
  - Les personnes malvoyantes
  - Le référencement Google

## ✏️ Modifier une page existante

1. Dans le Studio, trouvez votre page dans la liste
2. Cliquez dessus pour l'ouvrir
3. Faites vos modifications
4. **Important** : Cliquez sur "Publish" pour appliquer les changements

### Brouillon vs Publié

- **Brouillon** (Draft) : Vos modifications non publiées
- **Publié** (Published) : Ce que voient les visiteurs du site
- Vous pouvez prévisualiser vos brouillons avant de publier

## 🗑️ Supprimer une page

1. Ouvrez la page
2. Cliquez sur le menu **"..."** (3 points) en haut à droite
3. Sélectionnez **"Delete"**
4. Confirmez

⚠️ Attention : Si la page est référencée dans les traductions d'une autre page, supprimez d'abord la référence.

## 🌍 Changer de langue

Dans le sélecteur de langue (en haut), vous pouvez filtrer les pages par langue pour ne voir que les pages FR ou EN.

## ❓ Questions Fréquentes

### Pourquoi mes changements ne s'affichent pas ?

Avez-vous cliqué sur **"Publish"** ? Les brouillons ne sont pas visibles sur le site public.

### Comment dupliquer une page ?

1. Ouvrez la page à dupliquer
2. Menu "..." > "Duplicate"
3. Modifiez le titre et le slug
4. Publiez

### Puis-je avoir des slugs différents en FR et EN ?

Oui ! C'est même recommandé.
- FR : `/fr/a-propos`
- EN : `/en/about-us`

C'est pour ça que chaque langue est une page séparée.

### Comment réorganiser les sections ?

Glissez-déposez les sections dans l'onglet "Content" pour les réordonner.

## 🆘 Support

Pour toute question technique, contactez votre développeur avec :
- Capture d'écran du problème
- Description de ce que vous essayez de faire
- Navigateur utilisé (Chrome, Firefox, Safari...)

---

💡 **Astuce** : Sauvegardez régulièrement en publiant vos modifications !
