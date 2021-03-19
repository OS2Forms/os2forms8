FROM drupal:8-apache-buster

# Installing additional dependencies.
RUN set -eux; \
	apt update; \
	apt install -qq -y \
		libxml2-dev \
		libldap2-dev \
		git \
		wget \
		zip \
		mariadb-client-10.3 \
		cron; \
	docker-php-ext-configure ldap --with-libdir=lib/x86_64-linux-gnu/ && \
	docker-php-ext-install soap ldap

# Removing standard Drupal core and loading OS2Web project.
WORKDIR /opt
# Getting recent state of master branch.
ARG OS2FORMS8_TAG
RUN set -eux; \
	rm -rf drupal; \
#	PRODUCTION SETTINGS
#	Loading OS2Forms via tags.
#	wget https://github.com/os2forms/os2forms8/archive/$OS2FORMS8_TAG.tar.gz; \
#	tar -xzvf $OS2FORMS8_TAG.tar.gz; \
#	rm $OS2FORMS8_TAG.tar.gz; \
#	mv os2forms8-$OS2FORMS8_TAG drupal
#	DEVELOPMENT SETTINGS
#	Loading OS2Forms from branch to avoid development releases.
	wget https://github.com/OS2Forms/os2forms8/archive/docker.zip; \
	unzip docker.zip; \
	rm docker.zip; \
	mv os2forms8-docker drupal
WORKDIR /opt/drupal

# Loading composer dependencies and configuring project folders.
RUN set -eux; \
	composer self-update --1; \
	export COMPOSER_HOME="$(mktemp -d)"; \
	composer global require hirak/prestissimo;\
	COMPOSER_MEMORY_LIMIT=-1 composer install; \
	chown -R www-data:www-data web/sites web/modules web/themes; \
	# delete composer cache.
	rm -rf "$COMPOSER_HOME"

# Adding further site specific data to image.
RUN mkdir -p files; \
	mkdir -p private; \
	mkdir -p config/sync; \
	mkdir -p tmp; \
	rm -rf /opt/drupal/web/sites/default/files; \
	ln -sf /opt/drupal/files /opt/drupal/web/sites/default/files; \
	# Adjusting ownership
	chown -R www-data:www-data /opt/drupal/private /opt/drupal/files /opt/drupal/config/sync /opt/drupal/tmp /opt/drupal/logs; \
	chmod g+s -R /opt/drupal/private /opt/drupal/files /opt/drupal/config/sync

# Adding custom apache configuration with PHP value and log settings.
COPY apache/000-default.conf /etc/apache2/sites-enabled/000-default.conf

# Adding Drupal settings.
COPY drupal/settings.local.php /opt/drupal/web/sites/default/
