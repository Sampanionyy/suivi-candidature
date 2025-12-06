#!/bin/bash

# Script de déploiement Kubernetes - Suivi Candidature
# ================================================

set -e  # Arrêter en cas d'erreur

echo "🚀 Déploiement de l'application Suivi Candidature sur Kubernetes..."

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_step() {
    echo -e "${GREEN}[ÉTAPE]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[ATTENTION]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERREUR]${NC} $1"
}

# 1. Vérifier que les images Docker existent
print_step "Vérification des images Docker..."
if ! docker images | grep -q "suivi-candidature-api"; then
    print_error "L'image 'suivi-candidature-api:latest' n'existe pas. Construisez-la d'abord avec Docker."
    exit 1
fi

if ! docker images | grep -q "suivi-candidature-web"; then
    print_error "L'image 'suivi-candidature-web:latest' n'existe pas. Construisez-la d'abord avec Docker."
    exit 1
fi

print_step "✅ Images Docker trouvées"

# 2. Nettoyer les déploiements existants (optionnel)
read -p "Voulez-vous nettoyer les déploiements existants? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_step "Nettoyage des déploiements existants..."
    kubectl delete -f k8s/nginx-deployment.yaml --ignore-not-found=true
    kubectl delete -f k8s/web-deployment.yaml --ignore-not-found=true
    kubectl delete -f k8s/api-deployment.yaml --ignore-not-found=true
    kubectl delete -f k8s/mysql-deployment.yaml --ignore-not-found=true
    sleep 5
fi

# 3. Déployer MySQL
print_step "Déploiement de MySQL..."
kubectl apply -f k8s/mysql-deployment.yaml

# 4. Attendre que MySQL soit prêt
print_step "Attente que MySQL soit prêt (peut prendre jusqu'à 2 minutes)..."
kubectl wait --for=condition=ready pod -l app=mysql --timeout=120s || {
    print_error "MySQL n'est pas devenu prêt à temps"
    print_warning "Vérifiez les logs avec: kubectl logs -l app=mysql"
    exit 1
}

print_step "✅ MySQL est prêt"

# 5. Déployer l'API (avec le Job de migration)
print_step "Déploiement de l'API et exécution des migrations..."
kubectl apply -f k8s/api-deployment.yaml

# 6. Attendre la fin du job de migration
print_step "Attente de la fin des migrations (peut prendre jusqu'à 2 minutes)..."
kubectl wait --for=condition=complete job/laravel-migration --timeout=120s || {
    print_error "Le job de migration a échoué ou a dépassé le délai"
    print_warning "Vérifiez les logs avec: kubectl logs job/laravel-migration"
    exit 1
}

print_step "✅ Migrations terminées avec succès"

# 7. Attendre que l'API soit prête
print_step "Attente que l'API soit prête..."
kubectl wait --for=condition=ready pod -l app=api --timeout=120s || {
    print_error "L'API n'est pas devenue prête à temps"
    print_warning "Vérifiez les logs avec: kubectl logs -l app=api"
    exit 1
}

print_step "✅ API prête"

# 8. Déployer le frontend Web
print_step "Déploiement du frontend Web..."
kubectl apply -f k8s/web-deployment.yaml

# 9. Attendre que le Web soit prêt
print_step "Attente que le frontend soit prêt..."
kubectl wait --for=condition=ready pod -l app=web --timeout=120s || {
    print_error "Le frontend n'est pas devenu prêt à temps"
    print_warning "Vérifiez les logs avec: kubectl logs -l app=web"
    exit 1
}

print_step "✅ Frontend prêt"

# 10. Déployer Nginx
print_step "Déploiement de Nginx (reverse proxy)..."
kubectl apply -f k8s/nginx-deployment.yaml

# 11. Attendre que Nginx soit prêt
print_step "Attente que Nginx soit prêt..."
kubectl wait --for=condition=ready pod -l app=nginx --timeout=120s || {
    print_error "Nginx n'est pas devenu prêt à temps"
    print_warning "Vérifiez les logs avec: kubectl logs -l app=nginx"
    exit 1
}

print_step "✅ Nginx prêt"

# 12. Afficher les informations de connexion
echo ""
echo "=========================================="
echo "🎉 Déploiement terminé avec succès! 🎉"
echo "=========================================="
echo ""

# Récupérer l'URL d'accès
print_step "Récupération de l'URL d'accès..."
if command -v minikube &> /dev/null; then
    echo "Pour accéder à l'application sur Minikube:"
    echo "  minikube service nginx --url"
    echo ""
    echo "Ou exécutez: minikube service nginx"
else
    kubectl get service nginx
    echo ""
    echo "Attendez que le LoadBalancer obtienne une EXTERNAL-IP"
    echo "Puis accédez à: http://<EXTERNAL-IP>"
fi

echo ""
print_step "Commandes utiles:"
echo "  - Voir tous les pods:           kubectl get pods"
echo "  - Voir tous les services:       kubectl get services"
echo "  - Voir les logs de l'API:       kubectl logs -l app=api -f"
echo "  - Voir les logs du frontend:    kubectl logs -l app=web -f"
echo "  - Voir les logs de Nginx:       kubectl logs -l app=nginx -f"
echo "  - Voir les logs de MySQL:       kubectl logs -l app=mysql -f"
echo "  - Supprimer tout:               kubectl delete -f k8s/."
echo ""