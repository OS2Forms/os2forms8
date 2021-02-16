# OS2Web Nemlogin Drupal module  [![Build Status](https://travis-ci.org/OS2web/os2web_nemlogin.svg?branch=8.x)](https://travis-ci.org/OS2web/os2web_nemlogin)

## Module purpose

The aim of this module is to provide authentication via Nemlogin.

## How does it work

In order to generate the login link plugin system has been implemented. Module is supplies with two plugins (IdP and SimpleSAML), but plugin system allows third parties to implements their own plugins.

Settings page: /admin/config/system/os2web-nemlogin

Test page: /admin/config/system/os2web-nemlogin/test

## Install

Module is available to download via composer.
```
composer require os2web/os2web_nemlogin
drush en os2web_nemlogin
```

## Update
Updating process for OS2Web Nemlogin module is similar to usual Drupal 8 module.
Use Composer's built-in command for listing packages that have updates available:

```
composer outdated os2web/os2web_nemlogin
```

## Automated testing and code quality
See [OS2Web testing and CI information](https://github.com/OS2Web/docs#testing-and-ci)

## Contribution

Project is opened for new features and os course bugfixes.
If you have any suggestion or you found a bug in project, you are very welcome
to create an issue in github repository issue tracker.
For issue description there is expected that you will provide clear and
sufficient information about your feature request or bug report.

### Code review policy
See [OS2Web code review policy](https://github.com/OS2Web/docs#code-review)

### Git name convention
See [OS2Web git name convention](https://github.com/OS2Web/docs#git-guideline)
