#!/bin/bash

echo "🚀 Début du déploiement de l'application..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Fonction pour vérifier si une commande existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Vérification des prérequis
log_step "Vérification des prérequis..."
if ! command_exists kubectl; then
    log_error "kubectl n'est pas installé !"
    exit 1
fi

if ! command_exists docker; then
    log_error "docker n'est pas installé !"
    exit 1
fi

log_info "Tous les outils nécessaires sont installés ✓"

# 1. Construction des images Docker
log_step "Construction des images Docker..."

# Image API
log_info "Construction de l'image API..."
if [ -d "api" ]; then
    cd api
    docker build -t suivi-candidature-api:latest . || { log_error "Échec de la construction de l'image API"; exit 1; }
    cd ..
    log_info "Image API construite avec succès ✓"
else
    log_error "Le dossier 'api' n'existe pas !"
    exit 1
fi

# Image Web
log_info "Construction de l'image Web..."
if [ -d "web" ]; then
    cd web
    docker build -t suivi-candidature-web:latest . || { log_error "Échec de la construction de l'image Web"; exit 1; }
    cd ..
    log_info "Image Web construite avec succès ✓"
else
    log_error "Le dossier 'web' n'existe pas !"
    exit 1
fi

# 2. Chargement des images dans Minikube (si utilisé)
if command_exists minikube; then
    log_step "Détection de Minikube..."
    if minikube status >/dev/null 2>&1; then
        log_info "Chargement des images dans Minikube..."
        minikube image load suivi-candidature-api:latest
        minikube image load suivi-candidature-web:latest
        log_info "Images chargées dans Minikube ✓"
    else
        log_warn "Minikube n'est pas démarré, utilisation du registry Docker local"
    fi
fi

# 3. Déploiement de MySQL
log_step "Déploiement de MySQL..."
kubectl apply -f k8s/mysql-deployment.yaml || { log_error "Échec du déploiement MySQL"; exit 1; }
log_info "MySQL déployé ✓"

# Attendre que MySQL soit prêt
log_info "Attente du démarrage de MySQL (30 secondes)..."
sleep 30

# 4. Déploiement de l'API
log_step "Déploiement de l'API..."
kubectl apply -f k8s/api-deployment.yaml || { log_error "Échec du déploiement API"; exit 1; }
log_info "API déployée ✓"

# Attendre que le job de migration soit terminé
log_info "Attente de la fin des migrations..."
kubectl wait --for=condition=complete --timeout=120s job/laravel-migration 2>/dev/null || log_warn "Timeout sur les migrations, vérifiez les logs"

# Attendre que l'API soit prête
log_info "Attente du démarrage de l'API (60 secondes)..."
sleep 60

# 5. Déploiement du Frontend Web
log_step "Déploiement du Frontend Web..."
kubectl apply -f k8s/web-deployment.yaml || { log_error "Échec du déploiement Web"; exit 1; }
log_info "Frontend Web déployé ✓"

# 6. Déploiement de Nginx
log_step "Déploiement de Nginx..."
kubectl apply -f k8s/nginx-deployment.yaml || { log_error "Échec du déploiement Nginx"; exit 1; }
log_info "Nginx déployé ✓"

# 7. Attendre que tous les pods soient prêts
log_step "Attente du démarrage de tous les services..."
log_info "Cela peut prendre quelques minutes..."

# Fonction pour vérifier l'état des pods
check_pods_status() {
    local ready_count=$(kubectl get pods --no-headers 2>/dev/null | grep -c "Running")
    local total_count=$(kubectl get pods --no-headers 2>/dev/null | wc -l)
    echo "$ready_count/$total_count pods en cours d'exécution"
}

# Attendre 90 secondes avec affichage de la progression
for i in {1..18}; do
    echo -ne "\rProgression : $((i*5))% - $(check_pods_status)"
    sleep 5
done
echo ""

# 8. Affichage de l'état final
log_step "État du déploiement :"
echo ""
echo "📊 Pods :"
kubectl get pods
echo ""
echo "🌐 Services :"
kubectl get services
echo ""
echo "💾 PVC :"
kubectl get pvc

# 9. Récupération de l'URL d'accès
log_step "Récupération de l'URL d'accès..."
if command_exists minikube; then
    if minikube status >/dev/null 2>&1; then
        NGINX_URL=$(minikube service nginx --url)
        log_info "URL d'accès : $NGINX_URL"
        echo ""
        echo "🎉 Déploiement terminé avec succès !"
        echo ""
        echo "📝 Pour accéder à l'application :"
        echo "   $NGINX_URL"
        echo ""
    else
        log_warn "Impossible de récupérer l'URL, Minikube n'est pas démarré"
    fi
else
    NGINX_PORT=$(kubectl get service nginx -o jsonpath='{.spec.ports[0].nodePort}' 2>/dev/null)
    if [ -n "$NGINX_PORT" ]; then
        log_info "Port Nginx : $NGINX_PORT"
        echo ""
        echo "🎉 Déploiement terminé avec succès !"
        echo ""
        echo "📝 Pour accéder à l'application :"
        echo "   http://localhost:$NGINX_PORT"
        echo ""
    else
        log_warn "Impossible de récupérer le port d'accès"
    fi
fi

echo "💡 Commandes utiles :"
echo "   - Voir les logs de l'API     : kubectl logs -f deployment/api"
echo "   - Voir les logs du Web       : kubectl logs -f deployment/web"
echo "   - Voir les logs de MySQL     : kubectl logs -f deployment/mysql"
echo "   - Voir les logs de Nginx     : kubectl logs -f deployment/nginx"
echo "   - Voir tous les pods         : kubectl get pods"
echo "   - Nettoyer le déploiement    : ./cleanup.sh"
echo ""
echo "🔍 Pour déboguer les problèmes :"
echo "   - kubectl describe pod <pod-name>"
echo "   - kubectl logs <pod-name>"
echo "   - kubectl get events --sort-by='.lastTimestamp'"