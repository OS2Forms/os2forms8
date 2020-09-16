<?php
/**
 * @file
 * Project sensitive configuration on multisite/subsite.
 */

// Loading general configuration.
require_once __DIR__ . '/../default/settings.php';

$databases['default']['default'] = array (
  'database' => '',
  'username' => '',
  'password' => '',
  'prefix' => '',
  'host' => '',
  'port' => '',
  'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql',
  'driver' => 'mysql',
);
$settings['hash_salt'] = '';
