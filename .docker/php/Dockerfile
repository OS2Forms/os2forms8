FROM php:7.4-apache-buster

WORKDIR "/var/www"

ARG DEBIAN_FRONTEND=noninteractive

# Essentials and php modules.
# Yarn issue: https://github.com/yarnpkg/yarn/issues/2821
RUN apt-get update \
    && apt-get remove cmdtest \
    && apt-get install -qq -y \
        build-essential \
        git wget cron \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
        mariadb-client-10.3 \
        libzip-dev zip unzip \
        libicu-dev \
        libxml2-dev \
#    && npm install -g yarn \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-configure zip \
    && docker-php-ext-install zip \
    && docker-php-ext-install pdo pdo_mysql \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl \
    && docker-php-ext-install soap \
    && docker-php-ext-install xml \
    && docker-php-ext-install opcache

# pecl extensions
#RUN pecl install redis-5.1.1 \
#    && pecl install xdebug-2.8.1 \
#    && docker-php-ext-enable redis xdebug

# Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Cache tool
# https://github.com/gordalina/cachetool
#RUN curl -sO https://github.com/gordalina/cachetool/releases/latest/download/cachetool.phar \
#    && chmod +x cachetool.phar \
#    && mv cachetool.phar /usr/local/bin/cachetool
