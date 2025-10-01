# Suivi Candidature

Application de suivi des candidatures avec interface web moderne construite avec Laravel et React.

## 🏗️ Architecture

Le projet est organisé en deux submodules principaux :
- `api/` : API REST Laravel (PHP) - Gestion des candidatures, profils utilisateurs et documents
- `web/` : Interface utilisateur React + TypeScript avec Tailwind CSS

## 🐳 Démarrage avec Docker (Recommandé)

### Prérequis
- Docker
- Docker Compose

### Installation rapide avec Docker

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

2. **Créer les fichiers d'environnement**
```bash
# Copier le fichier .env pour l'API
cp api/.env.example api/.env

# Copier le fichier .env pour l'interface web
cp web/.env.example web/.env
```

3. **Lancer l'application avec Docker**
```bash
docker-compose up -d
```

4. **Configuration initiale (première utilisation uniquement)**
```bash
# Générer la clé Laravel
docker-compose exec api php artisan key:generate

# Exécuter les migrations
docker-compose exec api php artisan migrate
```

**C'est tout ! 🎉** 
- L'API Laravel est disponible sur `http://localhost:8000`
- L'interface React est disponible sur `http://localhost:5173`
- Base de données MySQL sur le port `3306`

### Commandes Docker utiles

```bash
# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down

# Rebuild les images
docker-compose build --no-cache

# Accéder au conteneur API
docker-compose exec api bash

# Accéder au conteneur Web
docker-compose exec web bash

# Nettoyer les volumes (⚠️ supprime la base de données)
docker-compose down -v
```

## 🚀 Installation manuelle (Alternative)

<details>
<summary>Cliquez ici pour voir les instructions d'installation manuelle</summary>

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

2. **Créer les fichiers d'environnement**
```bash
# API Laravel
cd api
cp .env.example .env
cd ..

# Interface web
cd web
cp .env.example .env
cd ..
```

3. **Installer les dépendances**
```bash
# Dépendances du projet principal
npm install

# API Laravel (submodule)
cd api
composer install
php artisan key:generate
php artisan migrate 
cd ..

# Interface web (submodule)
cd web
npm install
cd ..
```

4. **Configuration**
- Configurer la base de données dans `api/.env`
- Configurer l'URL de l'API dans `web/.env` (VITE_API_URL=http://localhost:8000/api)

### Lancement manuel

```bash
npm start
```

Cette commande démarre simultanément :
- L'API Laravel sur `http://localhost:8000`
- L'interface web sur `http://localhost:5173`

</details>

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
├── docker-compose.yml   # Configuration Docker
├── Dockerfile.api       # Image Docker pour l'API
├── Dockerfile.web       # Image Docker pour l'interface
├── package.json         # Configuration du projet principal
├── .gitmodules          # Configuration des submodules
└── README.md           # Ce fichier
```

## 🔧 Scripts disponibles

### Avec Docker (Recommandé)
- `docker-compose up -d` : Lance tous les services en arrière-plan
- `docker-compose logs -f` : Affiche les logs en temps réel
- `docker-compose down` : Arrête tous les services

### Sans Docker
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

### DevOps
- Docker & Docker Compose pour la containerisation
- MySQL 8.0 pour la base de données
- Nginx pour le reverse proxy (en production)

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

### Avec Docker (Méthode recommandée)
1. Suivez les étapes d'installation Docker ci-dessus
2. Créez les fichiers `.env` à partir des `.env.example`
3. Lancez `docker-compose up -d`
4. L'API sera disponible sur http://localhost:8000
5. L'interface web sera disponible sur http://localhost:5173
6. Consultez les logs avec `docker-compose logs -f`

### Sans Docker
1. Suivez les étapes d'installation manuelle
2. Créez les fichiers `.env` à partir des `.env.example`
3. Lancez `npm start` pour démarrer l'environnement de développement
4. L'API sera disponible sur http://localhost:8000
5. L'interface web sera disponible sur http://localhost:5173
6. Consultez les README des submodules pour des détails spécifiques

## 🔍 Dépannage

### Problèmes courants avec Docker

**Services qui ne démarrent pas :**
```bash
# Vérifier le statut
docker-compose ps

# Reconstruire les images
docker-compose build --no-cache
docker-compose up -d
```

**Problèmes de base de données :**
```bash
# Réinitialiser la base de données
docker-compose down -v
docker-compose up -d
docker-compose exec api php artisan migrate
```

**Problèmes de permissions :**
```bash
# Ajuster les permissions Laravel
docker-compose exec api chown -R www-data:www-data /var/www/html/storage
docker-compose exec api chmod -R 775 /var/www/html/storage
```

**Fichiers .env manquants :**
```bash
# Si vous avez oublié de créer les fichiers .env
cp api/.env.example api/.env
cp web/.env.example web/.env
docker-compose restart
```

---

⭐ Si ce projet vous aide, n'hésitez pas à lui donner une étoile sur GitHub !
