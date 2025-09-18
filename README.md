# Suivi Candidature

Application de suivi des candidatures avec interface web moderne construite avec Laravel et React.

## 🏗️ Architecture

Le projet est organisé en deux submodules principaux :
- `api/` : API REST Laravel (PHP) - Gestion des candidatures, profils utilisateurs et documents
- `web/` : Interface utilisateur React + TypeScript avec Tailwind CSS

## 🚀 Démarrage rapide

### Prérequis
- Node.js (v18+)
- PHP (v8.1+)
- Composer
- Base de données (MySQL/PostgreSQL/SQLite)

### Installation

1. **Cloner le projet avec les submodules**
```bash
git clone --recurse-submodules https://github.com/Sampanionyy/suivi-candidature.git
cd suivi-candidature
```

*Ou si vous avez déjà cloné sans les submodules :*
```bash
git clone https://github.com/Sampanionyy/suivi-candidature.git
cd suivi-candidature
git submodule update --init --recursive
```

2. **Installer les dépendances**
```bash
# Dépendances du projet principal
npm install

# API Laravel (submodule)
cd api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate 
cd ..

# Interface web (submodule)
cd web
npm install
cd ..
```

3. **Configuration**
- Configurer la base de données dans `api/.env`
- Configurer l'URL de l'API dans `web/.env` (VITE_API_URL=http://localhost:8000/api)

### Lancement

```bash
npm start
```

Cette commande démarre simultanément :
- L'API Laravel sur `http://localhost:8000`
- L'interface web sur `http://localhost:5173`

## 📁 Structure du projet

```
suivi-candidature/
├── api/                 # Submodule - API Laravel
│   ├── app/
│   │   ├── Models/      # Application, Document, Profile, User
│   │   ├── Http/        # Controllers, Requests, Resources
│   │   └── Mail/        # InterviewReminder
│   ├── database/
│   │   ├── migrations/  # Tables users, applications, documents, profiles
│   │   └── seeders/     # ApplicationSeeder, DatabaseSeeder
│   └── routes/api.php   # Routes API
├── web/                 # Submodule - Interface React + TypeScript
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── pages/       # Pages de l'application
│   │   ├── contexts/    # Contexts React
│   │   ├── hooks/       # Hooks personnalisés
│   │   ├── services/    # Services API
│   │   ├── interfaces/  # Types TypeScript
│   │   └── utils/       # Utilitaires
│   ├── tailwind.config.js
│   └── vite.config.ts
├── package.json         # Configuration du projet principal
├── .gitmodules          # Configuration des submodules
└── README.md           # Ce fichier
```

## 🔧 Scripts disponibles

- `npm start` : Lance l'API et l'interface web simultanément avec concurrently
- `npm run start` : Alias pour `npm start`

## 🌟 Fonctionnalités

### API (Laravel)
- Gestion des utilisateurs et authentification
- CRUD des candidatures (applications)
- Gestion des profils utilisateurs
- Upload et gestion de documents
- Envoi d'emails de rappel d'entretien
- API REST avec Laravel Sanctum

### Interface Web (React + TypeScript)
- Interface moderne avec Tailwind CSS
- Composants UI avec Shadcn UI et Lucide React
- Formulaires avec Formik et Yup
- Graphiques avec Recharts
- Calendrier avec React Big Calendar
- Routing avec React Router

## 🔄 Gestion des submodules

### Mettre à jour les submodules
```bash
git submodule update --remote
```

### Mettre à jour un submodule spécifique
```bash
git submodule update --remote api
git submodule update --remote web
```

### Workflow de développement avec submodules
```bash
# 1. Travailler dans un submodule
cd api
git checkout -b feature/nouvelle-fonctionnalite
# ... développement ...
git add . && git commit -m "Ajout nouvelle fonctionnalité API"
git push origin feature/nouvelle-fonctionnalite

# 2. Mettre à jour la référence dans le projet principal
cd ..
git add api
git commit -m "Update API submodule to latest version"
git push
```

## 🛠️ Technologies utilisées

### Backend (API)
- Laravel 12 avec PHP 8.2
- Laravel Sanctum pour l'authentification API
- Migrations pour la base de données
- Mailer system pour les mails

### Frontend (Web)
- React 19 avec TypeScript
- Vite pour le build et le développement
- Tailwind CSS pour le styling
- Formik + Yup pour les formulaires
- Axios pour les appels API

## 🤝 Contribution

### Workflow avec submodules

1. **Fork des repositories**
   - Fork du projet principal : `suivi-candidature`
   - Fork des submodules `api` et `web` si nécessaire

2. **Développement**
   - Toujours commiter et pousser les submodules avant le projet principal
   - Utiliser des branches cohérentes entre le projet principal et les submodules

3. **Pull Request**
   - Créer une PR sur le repository du submodule modifié
   - Créer une PR sur le projet principal avec la référence du submodule mise à jour

### Bonnes pratiques
- Documenter les versions des submodules dans les commits
- Tester l'intégration complète avant de pusher
- Maintenir la cohérence entre les versions API/Web

## 🚦 Getting Started pour les développeurs

1. Suivez les étapes d'installation ci-dessus
2. Lancez `npm start` pour démarrer l'environnement de développement
3. L'API sera disponible sur http://localhost:8000
4. L'interface web sera disponible sur http://localhost:5173
5. Consultez les README des submodules pour des détails spécifiques

---

⭐ Si ce projet vous aide, n'hésitez pas à lui donner une étoile sur GitHub !
