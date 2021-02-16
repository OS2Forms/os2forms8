# OS2Web SimpleSAML Drupal module  [![Build Status](https://travis-ci.org/OS2web/os2web_simplesaml.svg?branch=8.x)](https://travis-ci.org/OS2web/os2web_simplesaml)

## Module purpose

The aim of this module is to enhance integration with **simplesamlphp_auth** module, by force triggering **SimpleSAML auth page** redirect when certain criteria are met. 

## How does it work

Module performs checks on a single redirect triggering page. In order for it to work the cache for anonymous user for that page response is programmatically killed.

The redirect check cannot be done on all pages. Reason for that is the performance. The redirect only works properly when page response cache is killed (otherwise response is cached for all anonymous users), so in order for it to work on all pages anonymous page response caches must be killed (which is the same as disabling page cache entirely).

As a compromise between the functionality and performance it has been decided to use a single page to trigger redirect check.

If the request passes all the criteria (meaning user is anonymous and the IP is within whitelist), request is redirected to **SimpleSAML auth page**.

To improve the performance, the redirect decision is stored in cookies to a limited time.

Additionally module provides a special field for user entity, called **SimpleSAML UID** that allows to create a **SimpleSAML mapping** with the existing Drupal users.

## Additional setings

- **IP's whitelist**
Comma separate values of IP or IP ranges that will be redirected to SimpleSAML auth page. 
- **Redirect triggering page**
A certain page that triggers the redirect to SimpleSAML auth page if the criteria pass (_defaults: front page "/"_).
- **Cookies TTL**
Stores the redirect response in the cookies for a certain period of time (_defaults: 5min_).

## Install

Module is available to download via composer.
```
composer require os2web/os2web_simplesaml
drush en os2web_simplesaml
```

## Update
Updating process for OS2Web SimpleSAML module is similar to usual Drupal 8 module.
Use Composer's built-in command for listing packages that have updates available:

```
composer outdated os2web/os2web_simplesaml
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
