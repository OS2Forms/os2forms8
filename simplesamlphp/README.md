# SimplesamlPHP configuration

Purpose of this directory to store SimplesamlPHP configuration.

SimplesamlPHP library code manages via composer and stored in `vendor/simplesamlphp`

Configuration from this directory attached to application via vhost settings in apache server
like:

```
  SetEnv SIMPLESAMLPHP_CONFIG_DIR /var/www/html/simplesamlphp/config
  Alias /simplesaml /var/www/vendor/simplesamlphp/simplesamlphp/www
```

In example above is assumes that your project installed in `/var/www` directory.

## Recommended

Recommended directories configuration in `simplesamlphp/config/config.php` file:
```
    'certdir' => '/project/root/path/simplesamlphp/cert/',
    'loggingdir' => '/project/root/path/logs/simplesamlphp/',
    'datadir' => '/project/root/path/simplesamlphp/data/',
    'tempdir' => '/project/root/path/tmp/simplesamlphp',
```
