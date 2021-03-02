# OS2Forms Drupal 8 project [![Build Status](https://travis-ci.org/OS2Forms/os2forms8.svg?branch=master)](https://travis-ci.org/OS2Forms/os2forms8)

## Usage

* Clone the repository

    ```
    git clone git@github.com:OS2Forms/os2forms8.git
    ```
* Rename your project folder if needed (default is os2forms8)

* Install Docksal if not yet installed:

    ```
    curl -fsSL https://get.docksal.io | bash
    ```
* Check Docksal version (optional check): 

    ```
    fin version
    ```
* Check system info (optional check):

    ```
    fin sysinfo
    ```
* Initialize the OS2forms8 project:

    ```
    fin init
    ```
* Script to reinstall drupal from scratch based in os2forms8 profile:

    ```
    fin rebuild-test
    ```
* Add trusted host to settings.php:

    ```
    $settings['trusted_host_patterns'] = ['^os2forms8\.docksal$'];
    ```
    
* The installation should now be available on url: `http://os2forms8.docksal` and ready for further development, 
eg. by adding a `custom` folder to `web/modules`, `web/themes` and `web/profiles`.

### Drupal settings

Main Drupal setting file `web/sites/default/settings.php` has been added to git index.
By this way all os2forms projects are getting default settings, like temporary
directory, private directory, sync directory.

All project's sensitive configuration should be stored in `settings.local.php`
file. This file will be included from main `settings.php` settings.

#### Multisite/Subsite configuration.

On multisite solution main Drupal setting file`web/sites/default/settings.php`
should be included into subsite's `settings.php` file. The easiest way to get
the new configuration on a subsite is to copy prepared template
`web/sites/subsite.settings.php` and add DB configuration, salt.

Hint to generate salt string:
```
drush php-eval 'echo \Drupal\Component\Utility\Crypt::randomBytesBase64(55) . "\n";'
```

## Contribution

OS2Forms projects is an opened for new features and os course bugfixes.
If you have any suggestion, or you found a bug in project, you are very welcome
to create an issue in github repository issue tracker.
For issue description there is expected that you will provide clear and
sufficient information about your feature request or bug report.

### Development environment

For development purposes there has been included development environment driven
by [Docksal](https://docksal.io/). You can find all settings related to in
`/.docksal` folder.

See official manual on [how to install docksal](https://docksal.io/installation) on your local
development machine.

Since you have installed docksal it's easy to get installed default installation.
Use following commands:
```
# Clone project if you didn't do it yet
git clone git@github.com:OS2Forms/os2forms8.git os2forms8-dev
cd os2forms8-dev
# Start docksal environment
fin start
```
As result, you will get URL like `http://os2forms8-dev.docksal` that is going to
 be used for access os2forms application.

Run `fin help` to see commands you may need. You see [more information about docksal `fin` command](https://docs.docksal.io/fin/fin/)

Most useful commands:
- `fin start/stop/restart` - start/stop/restart environment
- `fin bash` - get ssh access in CLI container
- `fin drush [comnnand]` - run drush command from host mashine in CLI container
- `fin composer [comnnand]` - run composer command from host mashine in CLI container
- `fin exec 'command'` - run any command from host machine in CLI container

### Install default installation

To get default installation just run `fin rebuild-test` command. Docksal will
create default os2forms installation for you.

Before start using it you need to add trusted hosts settings. See next section.

### Upload existing db
If you have existing database you want to upload and use, then you have to
configure Drupal settings (see section above). NOTE: It's recommended to add
settings `settings.local.php` file.

Default db service credentials:

```
$databases['default']['default'] = array (
  'database' => 'default',
  'username' => 'root',
  'password' => 'root',
  'prefix' => '',
  'host' => 'db',
  'port' => '',
  'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql',
  'driver' => 'mysql',
);
```

Use `fin bash` or `fin drush [command]` to upload your database

You also need to add the rest drupal settings such as salt, sync/tmp folders,
trusted hosts
```
$settings['trusted_host_patterns'] = ['^os2forms8-dev.docksal$', '^localhost$'];
```

### Code review policy
See [OS2Forms code review policy](https://github.com/OS2Forms/docs#code-review)

### Git name convention
See [OS2Forms git name convention](https://github.com/OS2Forms/docs#git-guideline)
