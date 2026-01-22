#!/bin/bash

echo "🧹 Début du nettoyage complet de l'application..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# 1. Supprimer tous les déploiements Kubernetes
log_info "Suppression des déploiements Kubernetes..."
kubectl delete deployment --all 2>/dev/null || log_warn "Aucun déploiement à supprimer"

# 2. Supprimer tous les services
log_info "Suppression des services Kubernetes..."
kubectl delete service --all 2>/dev/null || log_warn "Aucun service à supprimer"

# 3. Supprimer tous les jobs
log_info "Suppression des jobs Kubernetes..."
kubectl delete job --all 2>/dev/null || log_warn "Aucun job à supprimer"

# 4. Supprimer tous les ConfigMaps
log_info "Suppression des ConfigMaps..."
kubectl delete configmap --all 2>/dev/null || log_warn "Aucun ConfigMap à supprimer"

# 5. Supprimer tous les Secrets
log_info "Suppression des Secrets..."
kubectl delete secret --all 2>/dev/null || log_warn "Aucun Secret à supprimer"

# 6. Supprimer tous les PVC (Persistent Volume Claims)
log_info "Suppression des PVC..."
kubectl delete pvc --all 2>/dev/null || log_warn "Aucun PVC à supprimer"

# 7. Supprimer tous les PV (Persistent Volumes)
log_info "Suppression des PV..."
kubectl delete pv --all 2>/dev/null || log_warn "Aucun PV à supprimer"

# 8. Attendre que tous les pods soient terminés
log_info "Attente de la terminaison de tous les pods..."
kubectl wait --for=delete pod --all --timeout=60s 2>/dev/null || log_warn "Timeout ou aucun pod à attendre"

# 9. Supprimer les images Docker (optionnel, décommenter si nécessaire)
log_warn "Suppression des images Docker locales..."
read -p "Voulez-vous supprimer les images Docker ? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker rmi suivi-candidature-api:latest 2>/dev/null || log_warn "Image API non trouvée"
    docker rmi suivi-candidature-web:latest 2>/dev/null || log_warn "Image Web non trouvée"
    log_info "Images Docker supprimées"
else
    log_info "Images Docker conservées"
fi

# 10. Nettoyer les volumes Docker non utilisés (optionnel)
log_warn "Nettoyage des volumes Docker non utilisés..."
read -p "Voulez-vous nettoyer les volumes Docker non utilisés ? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker volume prune -f 2>/dev/null || log_warn "Erreur lors du nettoyage des volumes"
    log_info "Volumes Docker nettoyés"
else
    log_info "Volumes Docker conservés"
fi

# 11. Vérification finale
log_info "Vérification de l'état du cluster..."
echo ""
echo "📊 État actuel du cluster :"
echo "─────────────────────────────"
echo "Pods restants :"
kubectl get pods 2>/dev/null || echo "Aucun pod"
echo ""
echo "Services restants :"
kubectl get services 2>/dev/null || echo "Aucun service"
echo ""
echo "PVC restants :"
kubectl get pvc 2>/dev/null || echo "Aucun PVC"

echo ""
log_info "✅ Nettoyage terminé !"
echo ""
echo "💡 Conseils :"
echo "   - Pour démarrer l'application, utilisez : ./deploy.sh"
echo "   - Pour voir l'état du cluster : kubectl get all"
echo "   - Pour voir les logs : kubectl logs <pod-name>"