# OS2Web SimpleSAML checklist Drupal module  [![Build Status](https://travis-ci.org/OS2web/os2web_simplesaml_checklist.svg?branch=8.x)](https://travis-ci.org/OS2web/os2web_simplesaml_checklist)

## Module purpose

The aim of this module is to provide a checklist that simplifies the integration with **simplesamlphp_auth** and **os2web_simplesaml** modules.

## How does it work

Administrator is supposed to go to the location **/admin/config/people/os2web-simplesaml-checklist** and mark the checkboxes next to the steps that are already done.

Each time checklist is opened, it will attempt to check if any tasks have already been completed. For example, if you already have HTTPS enabled then that item will be checked. You still need to click **"Save"** to save the progress.

Please note, that not all of the checkboxes are checked automatically, meaning that if a task has been done by you and tested, it's your responsibility to mark the checkbox as done. The checkboxes that support autocheck are marked with <i>(auto)</i> suffix 

## Important warning
Clicking the checkboxes does not make your site SimpleSAML ready, instead it helps to set it up by providing step by step guidelines. Follow each step carefully and only mark it done when you tested it.

## Install

Module is available to download via composer.
```
composer require os2web/os2web_simplesaml_checklist
drush en os2web_simplesaml_checklist
```

## Update
Updating process for OS2Web SimpleSAML Checklist module is similar to usual Drupal 8 module.
Use Composer's built-in command for listing packages that have updates available:

```
composer outdated os2web/os2web_simplesaml_checklist
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
