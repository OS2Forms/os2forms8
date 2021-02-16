Feature('Test drupal loads');
Scenario('Testing drupal startup', (I) => {
    I.amOnPage('/');
    I.saveScreenshot("01_01_drupal_installed.png");
    I.see('Velkommen til OS2forms');
    I.saveScreenshot("01_02_drupal_welcome.png");
});
Scenario('Testing drupal login', (I) => {
    I.amOnPage('/user/login');
    I.saveScreenshot("01_03_drupal_login.png");
    I.fillField('name','admin');
    I.fillField('pass','admin');
    I.click('op');
    I.saveScreenshot("01_04_admin_logged_in_drupal.png");
    I.see('admin');
});
Scenario('Checking for drupal modules', (I) => {
    I.amOnPage('/user/login');
    I.saveScreenshot("01_05_drupal_login.png");
    I.fillField('name','admin');
    I.fillField('pass','admin');
    I.click('op');
    I.saveScreenshot("01_06_admin_logged_in_drupal.png");
    I.see('admin');
    I.amOnPage('/admin/modules');
    I.saveScreenshot("01_07_drupal_modules.png");
    locate('#edit-modules-os2forms');
    locate('#edit-modules-webform');
    locate('#edit-modules-maestro');
});
