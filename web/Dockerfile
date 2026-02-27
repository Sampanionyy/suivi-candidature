FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production || npm install

# Copier le code source
COPY . .

# Créer le répertoire node_modules s'il n'existe pas
RUN mkdir -p node_modules

# Exposer le port Vite
EXPOSE 5173

# Variables d'environnement pour Vite
ENV HOST=0.0.0.0
ENV PORT=5173

# Healthcheck pour vérifier que Vite répond
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5173/ || exit 1

# Démarrer Vite en mode dev avec les bons paramètres
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]