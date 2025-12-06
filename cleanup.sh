#!/bin/bash

# Script de nettoyage de l'application sur Kubernetes

set -e

echo "🧹 Nettoyage de l'application Suivi Candidature sur Kubernetes"
echo "================================================================"

# Supprimer tous les déploiements
echo ""
echo "🗑️  Suppression des déploiements..."
kubectl delete -f k8s/nginx-deployment.yaml --ignore-not-found=true
kubectl delete -f k8s/web-deployment.yaml --ignore-not-found=true
kubectl delete -f k8s/api-deployment.yaml --ignore-not-found=true
kubectl delete -f k8s/mysql-deployment.yaml --ignore-not-found=true

echo ""
echo "⏳ Attente de la suppression complète..."
sleep 10

echo ""
echo "📊 État des ressources restantes:"
kubectl get all

echo ""
echo "✅ Nettoyage terminé!"
echo ""
echo "💡 Pour supprimer également les volumes persistants (ATTENTION: perte de données!):"
echo "   kubectl delete pvc --all"
echo ""
echo "💡 Pour arrêter Minikube complètement:"
echo "   minikube stop"
echo ""
echo "💡 Pour supprimer le cluster Minikube:"
echo "   minikube delete"