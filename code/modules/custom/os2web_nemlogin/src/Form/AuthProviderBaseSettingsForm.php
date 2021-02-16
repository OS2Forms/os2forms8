<?php

namespace Drupal\os2web_nemlogin\Form;

use Drupal\Component\Plugin\PluginManagerInterface;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Form or configuring AuthProvider plugin.
 */
class AuthProviderBaseSettingsForm extends ConfigFormBase {

  /**
   * Name of the config.
   *
   * @var string
   */
  public static $configName = 'os2web_nemlogin.settings';

  /**
   * The manager to be used for instantiating plugins.
   *
   * @var \Drupal\Component\Plugin\PluginManagerInterface
   */
  protected $authProviderManager;

  /**
   * Constructs a new AuthProviderBaseSettingsForm object.
   *
   * @param \Drupal\Component\Plugin\PluginManagerInterface $authProviderManager
   *   The manager to be used for instantiating plugins.
   */
  public function __construct(PluginManagerInterface $authProviderManager) {
    $this->authProviderManager = $authProviderManager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('plugin.manager.os2web_nemlogin.auth_provider')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'os2web_nemlogin_auth_provider_settings_form_' . $this->getPluginIdFromRequest();
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [AuthProviderBaseSettingsForm::$configName];
  }

  /**
   * Returns the value of the param _plugin_id for the current request.
   *
   * @see \Drupal\os2web_nemlogin\Routing\AuthProviderRoutes
   */
  protected function getPluginIdFromRequest() {
    $request = $this->getRequest();
    return $request->get('_plugin_id');
  }

  /**
   * Returns a AuthProvider plugin instance for a given plugin id.
   *
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   *
   * @return \Drupal\os2web_nemlogin\Plugin\AuthProviderInterface
   *   A AuthProvider plugin instance.
   *
   * @throws \Drupal\Component\Plugin\Exception\PluginException
   */
  public function getPluginInstance($plugin_id) {
    $instance = $this->authProviderManager->createInstance($plugin_id);
    return $instance;
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $plugin_id = $this->getPluginIdFromRequest();
    $instance = $this->getPluginInstance($plugin_id);

    $form = $instance->buildConfigurationForm($form, $form_state);

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    $plugin_id = $this->getPluginIdFromRequest();
    $instance = $this->getPluginInstance($plugin_id);
    $instance->validateConfigurationForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $plugin_id = $this->getPluginIdFromRequest();
    $instance = $this->getPluginInstance($plugin_id);

    $instance->submitConfigurationForm($form, $form_state);

    $config = $this->config(AuthProviderBaseSettingsForm::$configName);

    $instanceConfiguration = $instance->getConfiguration();
    $config->set($plugin_id, serialize($instanceConfiguration));
    $config->save();

    parent::submitForm($form, $form_state);
  }

}
