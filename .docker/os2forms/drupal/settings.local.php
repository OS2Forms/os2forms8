<?php

$databases['default']['default'] = [
  'database' => getenv('MYSQL_DATABASE'),
  'driver' => 'mysql',
  'host' => getenv('MYSQL_HOSTNAME'),
  'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql',
  'password' => getenv('MYSQL_PASSWORD'),
  'port' => getenv('MYSQL_PORT'),
  'prefix' => '',
  'username' => getenv('MYSQL_USER'),
];

$settings['hash_salt'] = getenv('DRUPAL_HASH_SALT');
$settings['trusted_host_patterns'] = empty(getenv('DRUPAL_TRUSTED_HOST')) ? NULL : ['^'.getenv('DRUPAL_TRUSTED_HOST').'$'];

$settings['config_sync_directory'] = '../config/sync';
$settings['file_temp_path'] = '../tmp';
$settings['file_private_path'] = '../private';
