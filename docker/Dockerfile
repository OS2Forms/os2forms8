FROM php:7.4.7-apache
# mysql client needed by drush + ssmtp for forwarding email
RUN apt-get update && apt-get install -y mariadb-client msmtp && \
apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/man/?? /usr/share/man/??_*

# Install mysqli
RUN docker-php-ext-install mysqli pdo pdo_mysql > /dev/null

# Install PHP extensions - using this github.com/mlocati/docker-php-extension-installer
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

# Installing SOAP-PHP, GIT and Unzip extensions
RUN rm /etc/apt/preferences.d/no-debian-php && \
    apt-get update && apt-get install -y php-soap git unzip

# Enable php extensions
RUN chmod uga+x /usr/local/bin/install-php-extensions && sync && \
    install-php-extensions zip gd opcache soap apcu

# Enable Apache Rewrite module
RUN a2enmod rewrite

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer

# Install Drush with Composer (installs for the root user currently...)
RUN composer global require drush/drush:9.* && \
    ln -s /root/.composer/vendor/bin/drush /usr/local/bin/drush

# Install composer packages, and set permissions on/in Drupal folder
WORKDIR /var/www/html/drupal/
COPY --chown=www-data:www-data ./docker/composer.lock composer.lock
COPY --chown=www-data:www-data ./docker/composer.json composer.json
RUN composer install && \
    chown -R www-data:www-data /var/www/html/drupal/

# Configuration of system requirements for Drupal with proper file owner
WORKDIR /var/www/html/drupal/
COPY --chown=www-data:www-data ./docker/entrypoint.sh docker/
COPY --chown=www-data:www-data ./docker/database_test.php docker/
COPY --chown=www-data:www-data ./docker/httpd.conf /etc/apache2/sites-available/000-default.conf

# Copy custom modules, contrib modules, custom themes, profiles, vendor and translations with proper file owner
COPY --chown=www-data:www-data ./code/modules/contrib /var/www/html/drupal/web/modules/contrib/
COPY --chown=www-data:www-data ./code/modules/custom /var/www/html/drupal/web/modules/custom/
COPY --chown=www-data:www-data ./code/themes/custom /var/www/html/drupal/web/themes/custom/
COPY --chown=www-data:www-data ./code/profiles /var/www/html/drupal/web/profiles/
COPY --chown=www-data:www-data ./code/vendor /var/www/html/drupal/vendor/
COPY --chown=www-data:www-data ./code/profiles/custom/os2forms8/config/translations /var/www/html/drupal/web/sites/default/files/translations/

# Copy production php.ini to ini dir and set custom vars
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
# Set custom variables and limits for PHP
COPY ./docker/custom-php.ini "$PHP_INI_DIR/conf.d/"
# Add smtp config template
COPY --chown=www-data:www-data ./docker/msmtp.conf /etc/msmtp/msmtp.conf

ENTRYPOINT ["docker/entrypoint.sh"]

CMD ["apache2-foreground"]
