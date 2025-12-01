# gutdil

[![Vite](https://img.shields.io/badge/Vite-%5E4.0.0-blueviolet)]()
[![React](https://img.shields.io/badge/React-%5E18-blue)]()
[![Node](https://img.shields.io/badge/Node-%3E=%2016-brightgreen)]()
[![Licence](https://img.shields.io/badge/licence-%C3%A0%20pr%C3%A9ciser-lightgrey)]()

Application front-end développée avec React et Vite, le back est fait avec Firebase. Ce README explique comment installer le projet localement, le lancer en développement, le builder pour la production et le déployer. Il contient aussi des recommandations pour la qualité du code, les variables d'environnement et les bonnes pratiques.

Table des matières
- [Résumé](#r%C3%A9sum%C3%A9)
- [Fonctionnalités](#fonctionnalit%C3%A9s)
- [Prérequis](#pr%C3%A9requis)
- [Installation](#installation)
- [Scripts utiles](#scripts-utiles)
- [Variables d'environnement](#variables-denvironnement)
- [Build & preview production](#build--preview-production)
- [Tests, linting et qualité](#tests-linting-et-qualit%C3%A9)
- [Déploiement](#d%C3%A9ploiement)
- [Structure recommandée du projet](#structure-recommand%C3%A9e-du-projet)
- [Fichiers recommandés à ajouter](#fichiers-recommand%C3%A9s-%C3%A0-ajouter)
- [Contribuer](#contribuer)
- [Licence & contact](#licence--contact)


Résumé
Cette application a pour but de repertorier et centraliser tous les bons plans pour les jeunes étudiants. Cette application va aider la communauté estudiantine et vulgariser les bons plans afin que le plus grand nombre puisse en profiter 

Fonctionnalités
- Interface utilisateur React (composants, routage client-side si nécessaire).
- Build rapide et hot-reload avec Vite.
- (Préciser ici les fonctionnalités principales du projet : pages, formulaires, appels API, authentification, etc.)

Prérequis
- Node.js v22+
- npm (ou yarn / pnpm)

Installation
1. Cloner le dépôt :
```bash
git clone https://github.com/thierrykmr/gutdil.git
cd gutdil
```

2. Installer les dépendances :
```bash
npm install
# ou
# yarn
# pnpm install
```

3. Lancer en mode développement :
```bash
npm run dev
# par défaut Vite démarre sur http://localhost:5173
```

Scripts utiles
(Vérifier la section "scripts" de ton package.json pour confirmer les noms exacts)
- npm run dev — démarrage en développement (hot-reload)
- npm run build — build production (génère le dossier `dist/`)
- npm run preview — prévisualisation du build localement (utilise vite preview)
- npm run lint — lancer ESLint (si configuré)
- npm run test — lancer les tests (Vitest / Jest si présents)

Variables d'environnement
- Vite n'expose aux clients que les variables commençant par VITE_.  
- Exemple de `.env` (ne jamais committer `.env` contenant des secrets) :
```env
VITE_API_BASE_URL=https://api.exemple.com
VITE_APP_TITLE="Gutdil"
```
- Fournis un fichier `.env.example` avec les clés sans valeurs pour faciliter l'installation par d'autres.

Build & preview production
```bash
# build production
npm run build

# prévisualiser le build localement
npm run preview
# puis ouvrir http://localhost:4173 (ou le port indiqué)
```

Tests, linting et qualité
- Recommande d'ajouter/configurer :
  - Vitest pour les tests unitaires : https://vitest.dev
  - ESLint + Prettier pour la qualité & formatage
  - Husky + lint-staged pour les hooks pre-commit
- Exemple pour lancer les tests (si présents) :
```bash
npm run test
```

Déploiement
- Déploiement très simple sur des services statiques (Vercel, Netlify, Cloudflare Pages, Surge...) :
  - Déposer le dossier `dist/` (build) ou connecter le repo pour un déploiement continu.
- Sur Vercel : sélectionner le repo, définir la commande de build `npm run build` et le dossier de sortie `dist`.

Structure recommandée du projet
- src/
  - assets/
  - components/
  - pages/ ou routes/
  - hooks/
  - services/ (API)
  - styles/
  - main.jsx / main.tsx
- public/
- index.html
- vite.config.js / vite.config.ts
- package.json
- .env.example

Fichiers recommandés à ajouter
- `.env.example` — liste des variables d'environnement attendues
- `README.md` (celui-ci)
- `LICENSE` — ex : MIT si je veux autoriser la réutilisation
- `.gitignore` — exclure node_modules, dist, .env, etc.
- `CONTRIBUTING.md` — guide rapide pour contributeurs
- `package-lock.json` ou `pnpm-lock.yaml` (selon gestionnaire), si je veux verrouiller les versions

Exemple de `.gitignore` recommandé
```
node_modules/
dist/
.env
.vscode/
.DS_Store
```

Bonnes pratiques
- Rendre les composants petits et réutilisables.
- Isoler la logique d'appel réseau dans `services/api`.
- Écrire des tests unitaires pour les composants critiques.
- Utiliser des variables VITE_ pour les urls et clés non sensibles côté client.
- Ne pas mettre de secrets dans le front-end (clés secrètes côté serveur uniquement).

Contribuer
- Fork -> créer une branche `feature/ma-fonctionnalite` -> PR
- Respecter le style de code (ESLint/Prettier)
- Ajouter des tests pour les nouvelles fonctionnalités

Licence & contact
- Aucune licence — ajouter un fichier `LICENSE` (par ex. MIT) pour autoriser explicitement la réutilisation.
- Auteur / contact : Thierry — @thierrykmr
