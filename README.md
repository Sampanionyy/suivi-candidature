# Suivi Candidature

Application de suivi des candidatures avec interface web moderne construite avec Laravel et React.

## 🏗️ Architecture

Le projet est organisé en deux submodules principaux :
- `api/` : API REST Laravel (PHP) - Gestion des candidatures, profils utilisateurs et documents
- `web/` : Interface utilisateur React + TypeScript avec Tailwind CSS

## 🚀 Méthodes de déploiement

### Option 1: Docker Compose (Développement local - Recommandé)
### Option 2: Kubernetes avec Minikube (Production-like)

---

## 🐳 Démarrage avec Docker Compose (Développement)

### Prérequis
- Docker
- Docker Compose

### Installation rapide

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

3. **Lancer l'application avec Docker Compose**
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
- L'application complète est disponible sur `http://localhost`
- L'API Laravel est accessible sur `http://localhost/api`
- L'interface React est servie par Nginx sur `http://localhost`
- Base de données MySQL sur le port `3307`

### Commandes Docker Compose utiles

```bash
# Voir les logs
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f api
docker-compose logs -f web

# Arrêter les services
docker-compose down

# Rebuild les images
docker-compose build --no-cache

# Accéder au conteneur API
docker-compose exec api bash

# Accéder au conteneur Web
docker-compose exec web sh

# Nettoyer les volumes (⚠️ supprime la base de données)
docker-compose down -v
```

---

## ☸️ Déploiement avec Kubernetes (Minikube)

### Prérequis
- Docker
- Minikube
- kubectl

### Installation de Minikube

**Linux/macOS :**
```bash
# Installation de Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Installation de kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

**Windows :**
```powershell
# Avec Chocolatey
choco install minikube kubernetes-cli

# Ou télécharger depuis https://minikube.sigs.k8s.io/docs/start/
```

### Déploiement sur Minikube

1. **Démarrer Minikube**
```bash
# Démarrer Minikube avec Docker comme driver
minikube start --driver=docker --memory=4096 --cpus=2

# Vérifier le statut
minikube status
```

2. **Configurer l'environnement Docker de Minikube**
```bash
# Configurer le shell pour utiliser le Docker de Minikube
eval $(minikube docker-env)

# Sur Windows PowerShell
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

3. **Construire les images Docker dans Minikube**
```bash
# Construire l'image de l'API
cd api
docker build -t suivi-candidature-api:latest .
cd ..

# Construire l'image du Web
cd web
docker build -t suivi-candidature-web:latest .
cd ..
```

4. **Déployer l'application**
```bash
# Déployer MySQL
kubectl apply -f k8s/mysql-deployment.yaml

# Attendre que MySQL soit prêt
kubectl wait --for=condition=ready pod -l app=mysql --timeout=120s

# Déployer l'API (inclut le Job de migration)
kubectl apply -f k8s/api-deployment.yaml

# Attendre que le Job de migration se termine
kubectl wait --for=condition=complete job/laravel-migration --timeout=120s

# Déployer le Web
kubectl apply -f k8s/web-deployment.yaml

# Déployer Nginx
kubectl apply -f k8s/nginx-deployment.yaml
```

5. **Accéder à l'application**
```bash
# Obtenir l'URL d'accès
minikube service nginx --url

# Ou ouvrir directement dans le navigateur
minikube service nginx
```

### Commandes Kubernetes utiles

```bash
# Voir tous les pods
kubectl get pods

# Voir tous les services
kubectl get services

# Voir les déploiements
kubectl get deployments

# Voir les logs d'un pod
kubectl logs <nom-du-pod>

# Voir les logs d'un pod en temps réel
kubectl logs -f <nom-du-pod>

# Voir les logs du Job de migration
kubectl logs job/laravel-migration

# Accéder à un pod
kubectl exec -it <nom-du-pod> -- /bin/bash

# Voir les détails d'un pod
kubectl describe pod <nom-du-pod>

# Redémarrer un déploiement
kubectl rollout restart deployment/api
kubectl rollout restart deployment/web
kubectl rollout restart deployment/nginx

# Supprimer toutes les ressources
kubectl delete -f k8s/

# Voir l'état du PVC (Persistent Volume Claim)
kubectl get pvc

# Voir les ConfigMaps et Secrets
kubectl get configmaps
kubectl get secrets
```

### Surveillance et Debugging

```bash
# Dashboard Kubernetes
minikube dashboard

# Voir les événements du cluster
kubectl get events --sort-by=.metadata.creationTimestamp

# Vérifier l'état de tous les pods
kubectl get pods -o wide

# Vérifier les ressources utilisées
kubectl top pods
kubectl top nodes

# Port forwarding pour débugger
kubectl port-forward service/api 8080:8080
kubectl port-forward service/web 5173:5173
```

### Mise à jour de l'application

```bash
# 1. Reconstruire les images
eval $(minikube docker-env)
docker build -t suivi-candidature-api:latest ./api
docker build -t suivi-candidature-web:latest ./web

# 2. Redémarrer les déploiements
kubectl rollout restart deployment/api
kubectl rollout restart deployment/web

# 3. Vérifier le statut du déploiement
kubectl rollout status deployment/api
kubectl rollout status deployment/web
```

### Nettoyage

```bash
# Supprimer toutes les ressources Kubernetes
kubectl delete -f k8s/

# Arrêter Minikube
minikube stop

# Supprimer le cluster Minikube
minikube delete

# Réinitialiser l'environnement Docker
eval $(minikube docker-env -u)
```

---

## 📁 Structure du projet

```
suivi-candidature/
├── api/                          # Submodule - API Laravel
│   ├── app/
│   │   ├── Models/               # Application, Document, Profile, User
│   │   ├── Http/                 # Controllers, Requests, Resources
│   │   └── Mail/                 # InterviewReminder
│   ├── database/
│   │   ├── migrations/           # Tables users, applications, documents, profiles
│   │   └── seeders/              # ApplicationSeeder, DatabaseSeeder
│   ├── routes/api.php            # Routes API
│   └── Dockerfile                # Image Docker pour l'API
├── web/                          # Submodule - Interface React + TypeScript
│   ├── src/
│   │   ├── components/           # Composants réutilisables
│   │   ├── pages/                # Pages de l'application
│   │   ├── contexts/             # Contexts React
│   │   ├── hooks/                # Hooks personnalisés
│   │   ├── services/             # Services API
│   │   ├── interfaces/           # Types TypeScript
│   │   └── utils/                # Utilitaires
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── Dockerfile                # Image Docker pour le Web
├── k8s/                          # Configurations Kubernetes
│   ├── mysql-deployment.yaml     # Déploiement MySQL
│   ├── api-deployment.yaml       # Déploiement API + Job de migration
│   ├── web-deployment.yaml       # Déploiement Web
│   └── nginx-deployment.yaml     # Déploiement Nginx + ConfigMap
├── docker-compose.yml            # Configuration Docker Compose
├── nginx.conf                    # Configuration Nginx pour Docker Compose
├── package.json                  # Configuration du projet principal
├── .gitmodules                   # Configuration des submodules
└── README.md                     # Ce fichier
```

## 🌟 Fonctionnalités

### API (Laravel)
- Gestion des utilisateurs et authentification
- CRUD des candidatures (applications)
- Gestion des profils utilisateurs avec photos
- Upload et gestion de documents (CV, lettres de motivation)
- Envoi d'emails de rappel d'entretien
- API REST avec Laravel Sanctum
- Health check endpoint (`/api/health`)

### Interface Web (React + TypeScript)
- Interface moderne avec Tailwind CSS
- Composants UI avec Shadcn UI et Lucide React
- Formulaires avec Formik et Yup
- Graphiques avec Recharts
- Calendrier avec React Big Calendar
- Routing avec React Router

### Infrastructure
- **Docker Compose** : Environnement de développement complet
- **Kubernetes** : Déploiement scalable avec Minikube
- **Nginx** : Reverse proxy et serveur de fichiers statiques
- **MySQL 8.0** : Base de données relationnelle
- **Persistent Volumes** : Stockage persistant pour les uploads

## 🛠️ Technologies utilisées

### Backend (API)
- Laravel 12 avec PHP 8.2
- Laravel Sanctum pour l'authentification API
- Migrations pour la base de données
- Mailer system pour les mails
- Apache 2.4 comme serveur web

### Frontend (Web)
- React 19 avec TypeScript
- Vite pour le build et le développement
- Tailwind CSS pour le styling
- Formik + Yup pour les formulaires
- Axios pour les appels API

### DevOps
- Docker & Docker Compose pour le développement local
- Kubernetes (Minikube) pour le déploiement production-like
- MySQL 8.0 pour la base de données
- Nginx pour le reverse proxy
- Persistent Volumes pour le stockage

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

## 🔍 Dépannage

### Docker Compose

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

### Kubernetes (Minikube)

**Les pods ne démarrent pas :**
```bash
# Vérifier les événements
kubectl get events --sort-by=.metadata.creationTimestamp

# Vérifier les logs du pod
kubectl logs <nom-du-pod>

# Décrire le pod pour voir les erreurs
kubectl describe pod <nom-du-pod>
```

**Images Docker non trouvées :**
```bash
# S'assurer d'être dans l'environnement Docker de Minikube
eval $(minikube docker-env)

# Reconstruire les images
docker build -t suivi-candidature-api:latest ./api
docker build -t suivi-candidature-web:latest ./web

# Vérifier que les images existent
docker images | grep suivi-candidature
```

**Le Job de migration échoue :**
```bash
# Voir les logs du Job
kubectl logs job/laravel-migration

# Supprimer et recréer le Job
kubectl delete job laravel-migration
kubectl apply -f k8s/api-deployment.yaml
```

**Problèmes de PVC :**
```bash
# Vérifier l'état du PVC
kubectl get pvc

# Si le PVC est en Pending
kubectl describe pvc storage-pvc

# Supprimer et recréer
kubectl delete pvc storage-pvc
kubectl apply -f k8s/api-deployment.yaml
```

**Accès à l'application :**
```bash
# Si minikube service ne fonctionne pas
kubectl port-forward service/nginx 8080:80

# Puis accéder à http://localhost:8080
```

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
- Tester sur Docker Compose ET Kubernetes avant de merger

## 📊 Comparaison des méthodes de déploiement

| Caractéristique | Docker Compose | Kubernetes (Minikube) |
|----------------|----------------|----------------------|
| **Complexité** | Simple | Moyenne |
| **Setup** | Rapide (5 min) | Moyen (15 min) |
| **Scalabilité** | Limitée | Excellente |
| **Production-ready** | Non | Oui |
| **Ressources** | Faibles | Moyennes |
| **Monitoring** | Limité | Avancé |
| **Recommandé pour** | Développement local | Staging/Production |

## 📝 Notes importantes

### Sécurité
- **Ne jamais** commiter les fichiers `.env` avec les vraies credentials
- Changer les mots de passe par défaut en production
- Utiliser des Secrets Kubernetes pour les données sensibles

### Performance
- Les ressources par défaut sont adaptées au développement
- Ajuster les `resources.requests` et `resources.limits` en production
- Augmenter le nombre de replicas selon la charge

### Stockage
- Le PVC utilise le stockage local de Minikube (limité à 2Gi par défaut)
- En production, utiliser un StorageClass adapté (NFS, Ceph, etc.)
- Les fichiers uploadés (photos, CV) sont stockés dans le PVC

---

⭐ Si ce projet vous aide, n'hésitez pas à lui donner une étoile sur GitHub !

## 📞 Support

Pour toute question ou problème :
1. Regarder la section `Dépannage`
2. Consultez les logs avec `docker-compose logs` ou `kubectl logs`
3. Contactez-moi directement
