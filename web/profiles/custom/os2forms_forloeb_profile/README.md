# OS2forms med Forløb installation profile for Drupal 8

This is a Drupal 8 installation profile for OS2forms project.

### Create a new drupal project
```
composer create-project drupal/recommended-project os2forms
```

### Setup your local settings file

web/sites/default/settings.local.php
```
/**
 * Database connection.
 */
$databases['default']['default'] = [
  'database' => '',
  'username' => '',
  'password' => '',
  'host' => '',
  'port' => '',
  'driver' => '',
  'prefix' => '',
];

/**
 * Config directory.
 */
$settings['config_sync_directory'] = '../config/sync';

/**
 * Hash salt.
 */
$settings['hash_salt'] = '';
```

### Setup settings.php
```
cp web/sites/default/default.settings.php web/sites/default/settings.php
```

Add local settings reference to web/sites/default/settings.php
```
if (file_exists($app_root . '/' . $site_path . '/settings.local.php')) {
   include $app_root . '/' . $site_path . '/settings.local.php';
}
```

### Require drush for your project
```
composer require drush/drush
```

### Install site with this installation profile
```
vendor/bin/drush -y site-install os2forms_forloeb_profile
```

## Usage
It's not supposed to use this profile outside https://github.com/os2forms/os2forms8 project.
