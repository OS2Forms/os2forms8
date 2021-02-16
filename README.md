# drupal_dockerized

Purpose of this project is to create a clean dockerized Drupal installation.


# Runnning the project - NOTE: this will take 10 minutes the first time you build
`docker-compose up -d`



# Running tests
`docker-compose -f docker-compose.yml -f docker-compose.tests.yml up`

# Composer dependencies

Installed dependencies are locked to specific versions using the `composer.lock` file. `composer install` will install every package specified in `composer.json` with respect to the pinned versions in `composer.lock`.

## Adding dependencies

Use `composer require` to add and install new packages. Alternatively add the requirement to `composer.json` and run `composer install`.

```
$ docker-compose exec drupal composer require "vendor/package:2.*"
```

## Updating dependencies

When a version update is needed, use `composer update vendor/package`. 

```
$ docker-compose exec -e COMPOSER_MEMORY_LIMIT=-1 drupal composer update vendor/package
```

On first run, the `composer.lock` file was generated using `composer update` without further parameters.

Check https://getcomposer.org/doc/03-cli.md#update-u for further details.
