# Suivi Candidature

Application de suivi de candidatures construite avec Laravel et React, conteneurisée avec Docker.

## Stack technique

**Backend** — Laravel 12 · PHP 8.2 · Apache · Laravel Sanctum · Laravel Reverb (WebSocket)  
**Frontend** — React 19 · TypeScript · Vite · Tailwind CSS · Shadcn UI  
**Infrastructure** — Docker · nginx · MySQL 8.0 · Redis 7

---

## Architecture

```
Client
  └── :80
       └── nginx (reverse proxy)
             ├── /api/broadcasting/  →  api:8080  (+ header Authorization)
             ├── /api/              →  api:8080
             ├── /app/              →  reverb:6001  (WebSocket)
             ├── /storage/          →  volume storage_data (fichiers uploadés)
             └── /                  →  web:5173  (Vite dev server)
```

**Containers** (7 au total) :

| Service | Rôle |
|---|---|
| `nginx` | Reverse proxy — point d'entrée unique, aucun service directement exposé |
| `api` | Laravel · Apache :8080 · migrations au démarrage |
| `scheduler` | `schedule:run` toutes les 60 secondes |
| `queue` | `queue:work redis` — traitement des jobs asynchrones |
| `reverb` | Serveur WebSocket temps réel (`reverb:start`) |
| `web` | Frontend Vite/React :5173 |
| `mysql` | MySQL 8.0 · volume persistant |
| `redis` | Redis 7 · persistance AOF · volume persistant |

> `api`, `scheduler`, `queue` et `reverb` partagent la même image Laravel. Leur comportement est différencié via leur `entrypoint` et leur `command`.

**Volumes nommés** :

- `mysql_data` — données MySQL
- `redis_data` — données Redis
- `storage_data` — fichiers uploadés, partagé entre `api` (rw) et `nginx` (ro)

**Réseau** : `suivi_candidature_network` (bridge) — les containers communiquent par nom de service, aucun port n'est exposé sur l'hôte sauf le :80 de nginx.

---

## Prérequis

- Docker
- Docker Compose

---

## Installation

```bash
# 1. Cloner le projet
git clone https://github.com/Sampanionyy/suivi-candidature.git
cd suivi-candidature

# 2. Créer les fichiers d'environnement
cp api/.env.example api/.env
cp web/.env.example web/.env

# 3. Lancer
docker compose up -d

# 4. Première utilisation uniquement
docker compose exec api php artisan key:generate
```

Les migrations sont exécutées automatiquement au démarrage du container `api`.

L'application est accessible sur `http://localhost`.

---

## Commandes utiles

```bash
# Logs
docker compose logs -f
docker compose logs -f api

# Accéder à un container
docker compose exec api bash
docker compose exec web sh

# Rebuild
docker compose build --no-cache
docker compose up -d

# Arrêter
docker compose down

# Supprimer les volumes (⚠️ efface la base de données)
docker compose down -v

# Permissions Laravel (si besoin)
docker compose exec api chown -R www-data:www-data /var/www/html/storage
docker compose exec api chmod -R 775 /var/www/html/storage
```

---

## Fonctionnalités

- Authentification via Laravel Sanctum
- CRUD des candidatures
- Gestion de profil avec photo
- Upload de documents (CV, lettres de motivation)
- Rappels d'entretien par email
- Notifications temps réel via WebSocket (Laravel Reverb)
- Dashboard avec graphiques (Recharts)
- Calendrier des entretiens (React Big Calendar)

---

## Dépannage

**Les services ne démarrent pas**
```bash
docker compose ps
docker compose logs -f
docker compose build --no-cache && docker compose up -d
```

**Problème de base de données**
```bash
# Réinitialiser complètement
docker compose down -v
docker compose up -d
```

**Les migrations échouent**
```bash
docker compose logs api
# MySQL met quelques secondes à être prêt au premier démarrage
# Attendre puis relancer :
docker compose restart api
```

**Fichiers uploadés inaccessibles**
```bash
docker compose exec api php artisan storage:link --force
```
