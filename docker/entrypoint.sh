#!/bin/bash
true "${SITE_NAME:?SITE_NAME is unset. Error.}"
true "${SITE_MAIL:?SITE_MAIL is unset. Error.}"

true "${ACCOUNT_MAIL:?ACCOUNT_MAIL is unset. Error.}"
true "${ACCOUNT_NAME:?ACCOUNT_NAME is unset. Error.}"
true "${ACCOUNT_PASS:?ACCOUNT_PASS is unset. Error.}"

true "${MYSQL_USER:?MYSQL_USER is unset. Error.}"
true "${MYSQL_PASSWORD:?MYSQL_PASSWORD is unset. Error.}"
true "${MYSQL_HOST:?MYSQL_HOST is unset. Error.}"
true "${MYSQL_DATABASE:?MYSQL_DATABASE is unset. Error.}"

true "${SMTP_HOST:?SMTP_HOST is unset. Error.}"
true "${SMTP_PORT:?SMTP_PORT is unset. Error.}"

php docker/database_test.php
EXITCODE=$?
if [ $EXITCODE -ne 0 ]; then
    echo "Could not connect to database"
    exit 1
fi

# Configure SMTP
sed -i "s/\$SMTP_HOST/$SMTP_HOST/g" /etc/msmtp/msmtp.conf
sed -i "s/\$SMTP_PORT/$SMTP_PORT/g" /etc/msmtp/msmtp.conf
sed -i "s/\$SMTP_AUTH/$SMTP_AUTH/g" /etc/msmtp/msmtp.conf
sed -i "s/\$SMTP_TLS/$SMTP_TLS/g" /etc/msmtp/msmtp.conf
sed -i "s/\$SMTP_USER/$SMTP_USER/g" /etc/msmtp/msmtp.conf
sed -i "s/\$SMTP_PASSWORD/$SMTP_PASSWORD/g" /etc/msmtp/msmtp.conf

chown www-data: /etc/msmtp/msmtp.conf && chmod 600 /etc/msmtp/msmtp.conf

# Re-run composer install in case of possible differences in image vs. mounted dependencies
composer install

if ! drush status bootstrap | grep -q Successful ; then
    echo "Drupal not bootstrapped - starting site-install"
    drush site-install os2forms8 -y --verbose \
    --db-url=mysql://$MYSQL_USER:$MYSQL_PASSWORD@$MYSQL_HOST:3306/$MYSQL_DATABASE \
    --db-prefix="forms" \
    --site-name=$SITE_NAME \
    --site-mail=$SITE_MAIL \
    --account-mail=$ACCOUNT_MAIL \
    --account-name=$ACCOUNT_NAME \
    --account-pass=$ACCOUNT_PASS
else
    echo "Drupal already bootstrapped - skipping install"
fi

# Creating demo-users - BEGIN

drush ucrt forloeb-designer --mail="os2forms-forloeb-designer@magenta.dk" --password="forloeb-designer"
drush urol "forloeb_designer" forloeb-designer

drush ucrt flow-designer --mail="os2forms-flow-designer@magenta.dk" --password="flow-designer"
drush urol "flow_designer" flow-designer

drush ucrt medarbejder --mail="os2forms-medarbejder@magenta.dk" --password="medarbejder"
drush urol "medarbejder" medarbejder

drush ucrt sagsbehandler --mail="os2forms-sagsbehandler@magenta.dk" --password="sagsbehandler"
drush urol "sagsbehandler" sagsbehandler

drush ucrt leder --mail="os2forms-leder@magenta.dk" --password="leder"
drush urol "leder" leder

# Creating demo-users - END

chown www-data:www-data /var/www/html/drupal/web/sites/default/settings.php
chown www-data:www-data /var/www/html/drupal/web/sites/default/files
chmod 755 /var/www/html/drupal/web/sites/default
chmod 775 /var/www/html/drupal/web/sites/default/files

#Import of user interface translations. Never check for updates. Only use local translation source. Only overwrite imported translations.
drush locale-check
drush locale-update
drush locale-import da /var/www/html/drupal/web/sites/default/files/translations/os2forms-8.x.da.po --type=customized --override=all

drush updb -y
drush cr

exec "$@"
