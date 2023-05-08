# OS2Forms Drupal module

## Install

To install OS2Forms Drupal 9.
```
drush en os2forms
```

If you don't have Drupal installed on you server, you will to need install it first.
Read more about [how to install drupal core](https://www.drupal.org/docs/8/install).

We are recommending to install drupal via composer by using
[OS2Forms composer project](https://github.com/OS2Forms/composer-project).
By this way you will get standalone project with OS2Forms module on board, plus
all the other contrib modules you will probably need to configure OS2Forms to
your specific demands.
```
composer create-project os2forms/composer-project:8.x-dev some-dir --no-interaction
```

## Automated testing and code quality
See [OS2Forms testing and CI information](https://github.com/OS2Forms/docs#testing-and-ci)

## Contribution

OS2Forms project is opened for new features and os course bugfixes.
If you have any suggestion or you found a bug in project, you are very welcome
to create an issue in github repository issue tracker.
For issue description there is expected that you will provide clear and
sufficient information about your feature request or bug report.

### Code review policy
See [OS2Forms code review policy](https://github.com/OS2Forms/docs#code-review)

### Git name convention
See [OS2Forms git name convention](https://github.com/OS2Forms/docs#git-guideline)

## Important notes
### Webforms
Each webform, including all its settings, is stored as configuration in db and
will(could) be exported as `yml` file via Drupal configuration management
system. And afterwards could be tracked by `git`.

It means that all webform settings from drupal database will
be syncronized (exported/imported) with state stored in `yml` files from
configuration folder stored in git repository. Without proper actions webforms
could be deleted or reverted to state in `yml` during synchronization.

To avoid/prevent this behavior we recommend use `Config ignore` module, where
you can add all settings you do not want to export/import via configuration
management system.

### Serviceplatformen plugins
Settings for CPR and CVR serviceplantormen plugins are storing as configuration
in db and will(could) be exported as `yml` file via Drupal configuration
management system. And afterwards could be tracked by `git`.

If case you have public access to your git repository all setting from plugins
will be exposed for third persons.

To avoid/prevent this behavior we recommend use `Config ignore` module, where
you can add all settings you do not want to export/import via configuration
management system.

## Unstable features
### Export submissions to Word
This feature is still not part of Webform and Entity print modules stable versions
due to following issues:
* [[Webform] Unlock possibility of using Entity print module export to Word feature](https://www.drupal.org/project/webform/issues/3096552)
* [[Entity Print] Add Export to Word Support](https://www.drupal.org/project/entity_print/issues/2733781)

To get this functionality on drupal project there will be applied patches from issues above via Composer.

NOTE: If you are downloading os2forms module without using composer, be aware that you have apply those patches by yourself.
