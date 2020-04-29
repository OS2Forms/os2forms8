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
* Follow the regular install process, select ```OS2Web``` as install profile.
* After installation is done, enable OS2Forms by:
    ```
    drush en os2forms, os2forms_nemid, os2forms_dawa, os2forms_sbsys
    ```
* Enable `Custom theme` for project. This is recommended theme that has minimum settings,
 so you will need to add all required blocks into proper regions afterwards.


## Contribution

OS2Forms projects is opened for new features and os course bugfixes.
If you have any suggestion or you found a bug in project, you are very welcome
to create an issue in github repository issue tracker.
For issue description there is expected that you will provide clear and
sufficient information about your feature request or bug report.

### Code review policy
See [OS2Forms code review policy](https://github.com/OS2Forms/docs#code-review)

### Git name convention
See [OS2Forms git name convention](https://github.com/OS2Forms/docs#git-guideline)
