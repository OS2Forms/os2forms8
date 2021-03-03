# OS2Forms Drupal 8 project

[![Build Status](https://travis-ci.org/OS2Forms/os2forms8.svg?branch=master)](https://travis-ci.org/OS2Forms/os2forms8)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Traditional

#### Installing

1. Clone the git repository
   ```sh
   git clone git@github.com:OS2Forms/os2forms8.git
   ```

2. Enter the newly created project directory
   ```sh
   cd os2forms8
   ```

3. Install dependencies
   ```sh
   composer install
   ```

4. Install drupal based on OS2Forms profile. Make sure you substitute the following variables:
   * db_pass
   * db_user
   * db_host
   * db_name
   * account_password
   * site_name
   ```sh
   drush si os2forms8 --db-url=mysql://db_pass:db_user@db_host/db_name --account-pass=account_password --site-name="site_name"
   ```

### With Docksal

#### Prerequisites

* [Docksal](https://docksal.io/)

#### Installing

1. Clone the git repository
   ```sh
   git clone git@github.com:OS2Forms/os2forms8.git
   ```

2. Enter the newly created project directory
   ```sh
   cd os2forms8
   ```

3. Start docksal environment
   ```sh
   fin start
   ```

4. Install dependencies and enable modules
   ```sh
   fin rebuild-test
   ```

5. Create local settings
   ```sh
   cp web/sites/example.settings.local.php web/sites/default/settings.local.php
   ```

6. Configure trusted hosts in settings.local.php (add the following if not present)
   ```php
   // web/sites/default/settings.local.php

   $settings['trusted_host_patterns'] = ['^os2forms8.docksal$', '^localhost$'];
   ```

You should now be able to browse to the application at `http://os2forms8.docksal`

## Deployment

These instructions will get you a copy of the project up and running on a live system.
For a more detailed description, you could look at the `web/core/INSTALL.txt` [here](./web/core/INSTALL.txt).

### Prerequisites

* A HTTP server such as [Apache](https://httpd.apache.org/) that supports PHP
* A database service such as [MySQL](https://www.mysql.com/)
* PHP 7 with the following extensions enabled:
  * gd
  * curl
  * simplexml
  * xml
  * dom
  * soap
  * mbstring
  * database specific extension such as the mysql extension
* [Composer](https://getcomposer.org/)

### Installing

1. Clone the git repository
```sh
git clone git@github.com:OS2Forms/os2forms8.git
```

2. Enter the newly created project directory
```sh
cd os2forms8
```

3. Install dependencies without development dependencies
```sh
composer install --no-dev
```

4. Generate a salt string and insert it in web/sites/default/settings.php
   ```sh
   # Generate salt string - this will output a new salt string
   ./vendor/bin/drush php-eval 'echo \Drupal\Component\Utility\Crypt::randomBytesBase64(55) . "\n";'
   ```

   ```php
   // web/sites/default/settings.php
   $settings['hash_salt'] = ''; // Insert the generated salt string here
   ```

5. Configure trusted hosts in web/sites/default/settings.php.
   For more information on how to write this, see the section for [Trusted Host settings](https://www.drupal.org/docs/installing-drupal/trusted-host-settings)
   in the official Drupal installation guide.
   ```php
   // web/sites/default/settings.php

   $settings['trusted_host_patterns'] = [''];
   ```
6. Visit the url for the os2forms application and follow the instructions
   * Select the os2forms install profile for a default os2forms installation

7. Enable OS2Forms modules
   ```sh
   ./vendor/bin/drush en os2forms, os2forms_nemid, os2forms_dawa, os2forms_sbsys
   ```

## Contributing

OS2Forms projects is open for new features and os course bugfixes. If you have any suggestion, or you found a bug in project, you are very welcome to create an issue in github repository issue tracker. For issue description there is expected that you will provide clear and sufficient information about your feature request or bug report.

### Code review policy
See [OS2Forms code review policy](https://github.com/OS2Forms/docs#code-review)

### Git name convention
See [OS2Forms git name convention](https://github.com/OS2Forms/docs#git-guideline)
