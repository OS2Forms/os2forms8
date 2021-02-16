<?php

namespace Drupal\os2web_nemlogin\Plugin;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Plugin\PluginBase;
use Drupal\os2web_nemlogin\Form\AuthProviderBaseSettingsForm;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * NemloginAuth base class.
 */
abstract class AuthProviderBase extends PluginBase implements AuthProviderInterface {
  /**
   * Authorization values array.
   *
   * @var array
   */
  protected $values;

  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);

    $this->setConfiguration($configuration);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    // Swapping config with a values from config object.
    $configObject = $container->get('config.factory')->get(AuthProviderBaseSettingsForm::$configName);
    if ($configurationSerialized = $configObject->get($plugin_id)) {
      $configuration = unserialize($configurationSerialized);
    }

    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getLabel() {
    $definition = $this->getPluginDefinition();
    // Cast the admin label to a string since it is an object.
    // @see \Drupal\Core\StringTranslation\TranslationWrapper
    return (string) $definition['label'];
  }

  /**
   * {@inheritdoc}
   */
  public function getDescription() {
    return $this->pluginDefinition['description'];
  }

  /**
   * {@inheritdoc}
   */
  public function fetchValue($key) {
    return isset($this->values[$key]) ? $this->values[$key] : NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'plugin_id' => $this->pluginId,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getConfiguration() {
    return $this->configuration;
  }

  /**
   * {@inheritdoc}
   */
  public function setConfiguration(array $configuration) {
    $this->configuration = $configuration + $this->defaultConfiguration();
  }

  /**
   * {@inheritdoc}
   */
  public function validateConfigurationForm(array &$form, FormStateInterface $form_state) {
    // Making validate optional.
  }

  /**
   * Build return link based on data from current request.
   *
   * @return string
   *   Return link URL.
   */
  protected function getReturnUrl() {
    $destination = \Drupal::destination()->getAsArray();

    $request = \Drupal::request();
    if ($destination['destination'] == ltrim(\Drupal::request()->getRequestUri(), '/')) {
      $destination['destination'] = '';
    }

    return $request->getSchemeAndHttpHost() . '/' . $destination['destination'];
  }

}
