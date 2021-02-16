<?php

namespace Drupal\os2web_nemlogin\Plugin\os2web\NemloginAuthProvider;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Routing\TrustedRedirectResponse;
use Drupal\os2web_nemlogin\Plugin\AuthProviderBase;

define('OS2WEB_NEMLOGIN_SIMPLESAML_INSTALLDIR', '/var/simplesaml');
define('OS2WEB_NEMLOGIN_SIMPLESAML_AUTH_METHOD', 'default-sp');

/**
 * Defines a plugin for Nemlogin auth via SimpleSAML.
 *
 * @AuthProvider(
 *   id = "simplesaml",
 *   label = @Translation("SimpleSAML Nemlogin auth provider"),
 * )
 */
class SimpleSaml extends AuthProviderBase {

  /**
   * Authorization values array.
   *
   * @var SimpleSAML_Auth_Simple
   */
  private $as;

  /**
   * SimpleSaml constructor.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);

    $simplesaml_installdir = $this->configuration['nemlogin_simplesaml_installdir'];
    if (file_exists($simplesaml_installdir . '/lib/_autoload.php')) {
      require_once $simplesaml_installdir . '/lib/_autoload.php';
      try {
        $this->as = new SimpleSAML_Auth_Simple($this->configuration['nemlogin_simplesaml_default_auth']);
      }
      catch (\Exception $e) {
        \Drupal::logger('OS2Web Nemlogin SimpleSAML')
          ->error(t('Cannot initialize simplesaml request: @message', ['@message' => $e->getMessage()]));
      }
    }
    else {
      \Drupal::logger('OS2Web Nemlogin SimpleSAML')
        ->warning(t('Simplesaml installtion not found'));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function isInitialized() {
    return $this->as instanceof SimpleSAML_Auth_Simple;
  }

  /**
   * {@inheritdoc}
   */
  public function isAuthenticated() {
    if (!$this->isInitialized()) {
      return NULL;
    }

    return $this->as->isAuthenticated();
  }

  /**
   * {@inheritdoc}
   */
  public function isAuthenticatedPerson() {
    if (!empty($this->fetchValue('cpr'))) {
      return TRUE;
    }

    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function isAuthenticatedCompany() {
    if (!empty($this->fetchValue('cvr'))) {
      return TRUE;
    }

    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function login() {
    $return_to_url = $this->getReturnUrl();
    if ($this->isInitialized()) {
      $this->as->requireAuth(
        [
          'ReturnTo' => $return_to_url,
        ]
      );
    }
    else {
      $redirect = new TrustedRedirectResponse($return_to_url);
      $redirect->send();
      return $redirect;
    }
  }

  /**
   * {@inheritdoc}
   */
  public function logout() {
    $return_to_url = $this->getReturnURL();
    if ($this->isInitialized()) {
      $url = $this->as->getLogoutURL($return_to_url);
      $redirect = new TrustedRedirectResponse($url);
      $redirect->send();
      return $redirect;
    }
    else {
      $redirect = new TrustedRedirectResponse($return_to_url);
      $redirect->send();
      return $redirect;
    }
  }

  /**
   * {@inheritdoc}
   */
  public function fetchValue($key) {
    if (empty($this->as) || !$this->as->isAuthenticated()) {
      return NULL;
    }

    // Make first char uppercase and suffixing with NumberIdentifier.
    $key = ucfirst(strtolower($key));
    $key .= 'NumberIdentifier';

    $attrs = $this->as->getAttributes();
    $value = NULL;

    if (is_array($attrs) && isset($attrs["dk:gov:saml:attribute:$key"])) {
      if (is_array($attrs["dk:gov:saml:attribute:$key"]) && isset($attrs["dk:gov:saml:attribute:$key"][0])) {
        $value = $attrs["dk:gov:saml:attribute:$key"][0];
      }
    }

    return $value;
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return parent::defaultConfiguration() + [
      'nemlogin_simplesaml_installdir' => OS2WEB_NEMLOGIN_SIMPLESAML_INSTALLDIR,
      'nemlogin_simplesaml_default_auth' => OS2WEB_NEMLOGIN_SIMPLESAML_AUTH_METHOD,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $form['nemlogin_simplesaml_installdir'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Full path to simplesaml installation'),
      '#description' => $this->t('Absolute path to simplesaml installation. Example: /var/simplesaml'),
      '#default_value' => $this->configuration['nemlogin_simplesaml_installdir'],
      '#required' => TRUE,
    ];

    $form['nemlogin_simplesaml_default_auth'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Simplesaml default auth method'),
      '#description' => $this->t('Default auth method for simplesaml. Example: default-sp'),
      '#default_value' => $this->configuration['nemlogin_simplesaml_default_auth'],
      '#required' => TRUE,
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateConfigurationForm(array &$form, FormStateInterface $form_state) {
    $nemlogin_simplesaml_installdir = $form_state->getValue('nemlogin_simplesaml_installdir');
    if (!file_exists($nemlogin_simplesaml_installdir)) {
      $form_state->setErrorByName('nemlogin_simplesaml_installdir', $this->t("Path %path doesn't exist", ['%path' => $nemlogin_simplesaml_installdir]));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    $configuration = $this->getConfiguration();

    $configuration['nemlogin_simplesaml_installdir'] = $form_state->getValue('nemlogin_simplesaml_installdir');
    $configuration['nemlogin_simplesaml_default_auth'] = $form_state->getValue('nemlogin_simplesaml_default_auth');

    $this->setConfiguration($configuration);
  }

}
