# Étape 1 : Build React
FROM node:18 AS build-frontend
WORKDIR /app
COPY ./web ./web
WORKDIR /app/web
RUN npm install && npm run build

# Étape 2 : Laravel + Apache
FROM php:8.3-apache

# Installe extensions PHP nécessaires à Laravel + MySQL
RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libonig-dev libzip-dev zip \
    && docker-php-ext-install pdo pdo_mysql mysqli

# Active mod_rewrite pour Laravel
RUN a2enmod rewrite

# Copie Laravel dans /var/www/html
WORKDIR /var/www/html
COPY ./api /var/www/html

# Copie du build React dans Laravel/public
COPY --from=build-frontend /app/web/dist /var/www/html/public

# Installer Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Installer les dépendances Laravel
RUN composer install --no-dev --optimize-autoloader

# Configuration des permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Génération de la clé d'application Laravel (si nécessaire)
RUN php artisan key:generate --no-interaction --force || true

# Clear des caches
RUN php artisan config:clear || true
RUN php artisan cache:clear || true

# Exposer Apache
EXPOSE 80

CMD ["apache2-foreground"]