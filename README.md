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

### Code review policy
See [OS2Forms code review policy](https://github.com/OS2Forms/docs#code-review)

### Git name convention
See [OS2Forms git name convention](https://github.com/OS2Forms/docs#git-guideline)
