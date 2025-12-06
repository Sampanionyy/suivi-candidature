# Déploiement Kubernetes - Suivi Candidature

## 📋 Prérequis

- Kubernetes (Minikube, Docker Desktop, Kind, ou cluster cloud)
- kubectl installé et configuré
- Images Docker construites:
  - `suivi-candidature-api:latest`
  - `suivi-candidature-web:latest`

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                  LoadBalancer                    │
│                    (nginx)                       │
│                   Port 80                        │
└──────────────┬──────────────────┬────────────────┘
               │                  │
       ┌───────▼──────┐    ┌─────▼────────┐
       │     Web      │    │     API      │
       │  (React)     │    │  (Laravel)   │
       │  Port 5173   │    │  Port 8080   │
       └──────────────┘    └──────┬───────┘
                                  │
                           ┌──────▼──────┐
                           │    MySQL    │
                           │  Port 3306  │
                           └─────────────┘
```

## 📦 Structure des Fichiers

```
k8s/
├── api-deployment.yaml       # API + PVC storage + Job migrations
├── mysql-deployment.yaml     # Base de données + PVC
├── web-deployment.yaml       # Frontend React
├── nginx-deployment.yaml     # Reverse proxy
├── deploy.sh                 # Script de déploiement automatique
└── README-KUBERNETES.md      # Ce fichier
```

## 🚀 Déploiement Rapide

### Option 1: Script Automatique (Recommandé)

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Exécuter le déploiement
./deploy.sh
```

### Option 2: Déploiement Manuel

```bash
# 1. Charger les images (si Minikube)
eval $(minikube docker-env)
docker build -t suivi-candidature-api:latest ./api
docker build -t suivi-candidature-web:latest ./web

# OU (si images déjà construites)
minikube image load suivi-candidature-api:latest
minikube image load suivi-candidature-web:latest

# 2. Déployer MySQL
kubectl apply -f mysql-deployment.yaml
kubectl wait --for=condition=ready pod -l app=mysql --timeout=120s

# 3. Déployer l'API (avec migrations)
kubectl apply -f api-deployment.yaml
kubectl wait --for=condition=complete job/laravel-migration --timeout=120s
kubectl wait --for=condition=ready pod -l app=api --timeout=120s

# 4. Déployer le Web
kubectl apply -f web-deployment.yaml
kubectl wait --for=condition=ready pod -l app=web --timeout=120s

# 5. Déployer Nginx
kubectl apply -f nginx-deployment.yaml
kubectl wait --for=condition=ready pod -l app=nginx --timeout=120s

# 6. Accéder à l'application
minikube service nginx --url  # Pour Minikube
# OU
kubectl get svc nginx  # Utiliser l'EXTERNAL-IP
```

## 🔧 Configuration Importante

### 1. Endpoint de Santé Laravel

Les health checks Kubernetes nécessitent un endpoint `/api/health`. Créez-le dans votre API Laravel:

**Fichier: `app/Http/Controllers/HealthController.php`**
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    public function check()
    {
        try {
            DB::connection()->getPdo();
            return response()->json(['status' => 'healthy'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'unhealthy'], 503);
        }
    }
}
```

**Fichier: `routes/api.php`**
```php
Route::get('/health', [App\Http\Controllers\HealthController::class, 'check']);
```

### 2. Volumes Partagés

⚠️ **Important:** Si votre cluster ne supporte pas `ReadWriteMany`:

```yaml
# Dans api-deployment.yaml, modifiez:
spec:
  accessModes:
    - ReadWriteOnce  # Au lieu de ReadWriteMany
  
# ET réduisez les replicas à 1:
spec:
  replicas: 1  # Au lieu de 2
```

## 📊 Vérification du Déploiement

### Vérifier tous les pods
```bash
kubectl get pods

# Résultat attendu:
# NAME                     READY   STATUS      RESTARTS   AGE
# api-xxx                  1/1     Running     0          5m
# api-yyy                  1/1     Running     0          5m
# laravel-migration-zzz    0/1     Completed   0          6m
# mysql-aaa                1/1     Running     0          7m
# nginx-bbb                1/1     Running     0          4m
# nginx-ccc                1/1     Running     0          4m
# web-ddd                  1/1     Running     0          5m
# web-eee                  1/1     Running     0          5m
```

### Vérifier les services
```bash
kubectl get services

# NAME    TYPE           EXTERNAL-IP   PORT(S)        AGE
# api     ClusterIP      10.x.x.x      8080/TCP       5m
# mysql   ClusterIP      10.x.x.x      3306/TCP       7m
# nginx   LoadBalancer   localhost     80:30xxx/TCP   4m
# web     ClusterIP      10.x.x.x      5173/TCP       5m
```

### Vérifier les volumes
```bash
kubectl get pvc

# NAME          STATUS   VOLUME    CAPACITY   ACCESS MODES
# mysql-pvc     Bound    pvc-xxx   5Gi        RWO
# storage-pvc   Bound    pvc-yyy   2Gi        RWX (ou RWO)
```

## 🌐 Accéder à l'Application

### Minikube
```bash
# Option 1: URL directe
minikube service nginx --url

# Option 2: Ouvrir dans le navigateur
minikube service nginx

# Option 3: Tunnel (dans un terminal séparé)
minikube tunnel
# Puis accéder à: http://localhost
```

### Docker Desktop
```bash
# L'application devrait être accessible sur:
http://localhost
```

### Cluster Cloud (AWS, GCP, Azure)
```bash
# Récupérer l'IP externe
kubectl get svc nginx

# Accéder à: http://<EXTERNAL-IP>
```

## 📝 Commandes Utiles

### Logs
```bash
# Logs en temps réel
kubectl logs -l app=api -f
kubectl logs -l app=web -f
kubectl logs -l app=nginx -f
kubectl logs -l app=mysql -f

# Logs du job de migration
kubectl logs job/laravel-migration

# Logs d'un pod spécifique
kubectl logs <pod-name> --tail=100
```

### Debug
```bash
# Accéder à un shell dans un pod
kubectl exec -it deployment/api -- bash
kubectl exec -it deployment/mysql -- bash

# Tester la connectivité
kubectl exec -it deployment/api -- nc -zv mysql 3306
kubectl exec -it deployment/nginx -- wget -O- http://api:8080/api/health

# Voir les événements
kubectl get events --sort-by='.lastTimestamp'

# Détails d'un pod
kubectl describe pod <pod-name>
```

### Mise à jour
```bash
# Après avoir modifié le code et reconstruit les images:

# Pour Minikube:
eval $(minikube docker-env)
docker build -t suivi-candidature-api:latest ./api
docker build -t suivi-candidature-web:latest ./web

# Redémarrer les déploiements
kubectl rollout restart deployment/api
kubectl rollout restart deployment/web

# Vérifier le statut
kubectl rollout status deployment/api
kubectl rollout status deployment/web
```

### Scaling
```bash
# Augmenter le nombre de replicas
kubectl scale deployment api --replicas=3
kubectl scale deployment web --replicas=3
kubectl scale deployment nginx --replicas=3

# Vérifier
kubectl get pods -l app=api
```

## 🗑️ Nettoyage

### Supprimer tous les déploiements (conserver les données)
```bash
kubectl delete -f nginx-deployment.yaml
kubectl delete -f web-deployment.yaml
kubectl delete -f api-deployment.yaml
kubectl delete -f mysql-deployment.yaml
```

### Supprimer tout (y compris les données)
```bash
# Supprimer les déploiements
kubectl delete -f .

# Supprimer les PVCs (perte de données!)
kubectl delete pvc storage-pvc mysql-pvc

# Supprimer le job de migration
kubectl delete job laravel-migration
```

## 🔒 Sécurité

⚠️ **Pour la production:**

1. **Ne jamais** mettre les mots de passe en clair dans les fichiers YAML
2. Utiliser des Secrets Kubernetes externes (comme Sealed Secrets ou Vault)
3. Activer HTTPS avec des certificats (cert-manager + Let's Encrypt)
4. Restreindre les permissions avec RBAC
5. Utiliser des NetworkPolicies pour limiter la communication entre pods

### Exemple avec Secrets externes
```bash
# Créer un secret depuis la ligne de commande
kubectl create secret generic api-secret \
  --from-literal=DB_USERNAME=mon_user \
  --from-literal=DB_PASSWORD=mon_password_securise
```

## 📈 Monitoring (Optionnel)

### Installer Metrics Server
```bash
# Pour Minikube
minikube addons enable metrics-server

# Pour les autres clusters
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

### Voir l'utilisation des ressources
```bash
kubectl top nodes
kubectl top pods
```

## 🐛 Problèmes Courants

Voir le fichier `TROUBLESHOOTING.md` pour une liste complète des problèmes et solutions.

### Quick fixes:

**ImagePullBackOff:**
```bash
minikube image load suivi-candidature-api:latest
minikube image load suivi-candidature-web:latest
```

**CrashLoopBackOff sur l'API:**
```bash
# Vérifier les logs
kubectl logs -l app=api --tail=50

# Vérifier que MySQL est prêt
kubectl get pods -l app=mysql
```

**LoadBalancer en pending:**
```bash
# Pour Minikube
minikube tunnel

# OU changer en NodePort
kubectl patch svc nginx -p '{"spec":{"type":"NodePort"}}'
```

## 📚 Ressources

- [Documentation Kubernetes](https://kubernetes.io/docs/)
- [Documentation Minikube](https://minikube.sigs.k8s.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

## 🤝 Support

En cas de problème:
1. Consulter `TROUBLESHOOTING.md`
2. Vérifier les logs: `kubectl logs -l app=<service>`
3. Vérifier les événements: `kubectl get events --sort-by='.lastTimestamp'`