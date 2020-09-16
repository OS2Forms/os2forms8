# OS2Forms Drupal 8 project [![Build Status](https://travis-ci.org/OS2Forms/os2forms8.svg?branch=master)](https://travis-ci.org/OS2Forms/os2forms8)

## Usage

* Clone the repository

    ```
    git clone git@github.com:OS2Forms/os2forms8.git
    ```
* Rename your installation if needed

* Go to the installation and start composer
    ```
    composer install
    ```
* Follow the regular install process, select ```OS2Forms8``` as install profile.
* After installation is done, enable OS2Forms by:
    ```
    drush en os2forms, os2forms_nemid, os2forms_dawa, os2forms_sbsys
    ```
* Enable `Custom theme` for project. This is a recommended theme that has minimum settings,
 so you will need to add all required blocks into proper regions afterwards.

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
