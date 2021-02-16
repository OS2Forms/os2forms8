<?php

namespace Drupal\os2web_nemlogin\Service;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\os2web_nemlogin\Form\SettingsForm;

/**
 * Class AuthProviderService.
 *
 * @package Drupal\os2web_nemlogin\Service
 */
class AuthProviderService {

  /**
   * The Config Factory.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $config;

  /**
   * AuthProviderService constructor.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The configuration factory.
   */
  public function __construct(ConfigFactoryInterface $config_factory) {
    $this->config = $config_factory->get(SettingsForm::$configName);
  }

  /**
   * Returns active Nemlogin auth provider plugin ID.
   *
   * @return string
   *   Plugin ID.
   */
  public function getActivePluginId() {
    return $this->config->get('active_plugin_id');
  }

  /**
   * Returns active Nemlogin auth provider plugin.
   *
   * @return \Drupal\os2web_nemlogin\Plugin\AuthProviderInterface
   *   Plugin object.
   */
  public function getActivePlugin() {
    $authProviderPlugins = \Drupal::service('plugin.manager.os2web_nemlogin.auth_provider');
    return $authProviderPlugins->createInstance($this->getActivePluginId());
  }

  /**
   * Generates a NemID login URL.
   *
   * @param array $options
   *   Array of options, @see \Drupal\Core\Url::fromUri().
   *
   * @return \Drupal\Core\Url
   *   The generate URL.
   */
  public function getLoginUrl(array $options = []) {
    $options += ['absolute' => TRUE];

    if (empty($options['query']['destination'])) {
      $requestUri = \Drupal::request()->getRequestUri();
      $options['query']['destination'] = ltrim($requestUri, '/');
    }

    $url = Url::fromRoute('os2web_nemlogin.login', [], $options);

    return $url;
  }

  /**
   * Generates a NemID logout URL.
   *
   * @param array $options
   *   Array of options, @see \Drupal\Core\Url::fromUri().
   *
   * @return \Drupal\Core\Url
   *   The generate URL.
   */
  public function getLogoutUrl(array $options = []) {
    $options += ['absolute' => TRUE];

    if (empty($options['query']['destination'])) {
      $requestUri = \Drupal::request()->getRequestUri();
      $options['query']['destination'] = ltrim($requestUri, '/');
    }

    $url = Url::fromRoute('os2web_nemlogin.logout', [], $options);

    return $url;
  }

  /**
   * Generates a NemID link.
   *
   * @param string $login_text
   *   Login link text.
   * @param string $logout_text
   *   Logout link text.
   * @param array $options
   *   Array of options, @see \Drupal\Core\Url::fromUri().
   *
   * @return string
   *   Generated URL.
   */
  public function generateLink($login_text = NULL, $logout_text = NULL, array $options = []) {
    $login_text = isset($login_text) ? $login_text : t('Login with Nemlogin');
    $logout_text = isset($logout_text) ? $logout_text : t('Logout with Nemlogin');

    $plugin = $this->getActivePlugin();
    if (empty($plugin)) {
      \Drupal::logger('OS2Web Nemlogin')->warning(t('Nemlogin authorization object is empty'));
      return NULL;
    }

    if (!$plugin->isInitialized()) {
      \Drupal::logger('OS2Web Nemlogin')->warning(t("Nemlogin authorization object doesn't work properly"));
      return NULL;
    }

    return $plugin->isAuthenticated()
      ? Link::fromTextAndUrl($logout_text, $this->getLogoutUrl($options))
      : Link::fromTextAndUrl($login_text, $this->getLoginUrl($options));
  }

}
