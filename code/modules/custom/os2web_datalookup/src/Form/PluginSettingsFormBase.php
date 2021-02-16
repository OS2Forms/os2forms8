<?php

namespace Drupal\os2web_datalookup\Form;

/**
 * @file
 * Abstract class for PluginSettingsForm implementation.
 */

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Abstract class for PluginSettingsForm implementation.
 */
abstract class PluginSettingsFormBase extends ConfigFormBase implements PluginSettingsFormInterface {

  /**
   * The manager to be used for instantiating plugins.
   *
   * @var \Drupal\Component\Plugin\PluginManagerInterface
   */
  protected $manager;

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [$this->getConfigId()];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return $this->getConfigName() . '_settings_form_' . $this->getPluginIdFromRequest();
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

    $config = $this->config($this->getConfigId());
    foreach ($instance->getConfiguration() as $key => $value) {
      $config->set($key, $value);
    }
    $config->save();

    parent::submitForm($form, $form_state);
  }

  /**
   * Returns the value of the param _plugin_id for the current request.
   */
  protected function getPluginIdFromRequest() {
    $request = $this->getRequest();
    return $request->get('_plugin_id');
  }

  /**
   * Returns plugin instance for a given plugin id.
   *
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   *
   * @return object
   *   Plugin instance.
   *
   * @throws PluginException
   */
  public function getPluginInstance($plugin_id) {
    $configuration = $this->config($this->getConfigId())->get();
    $instance = $this->manager->createInstance($plugin_id, $configuration);
    return $instance;
  }

  /**
   * Defines name of the configuration object.
   *
   * @return string
   *   Configuration object name.
   */
  protected function getConfigId() {
    return $this->getConfigName() . '.' . $this->getPluginIdFromRequest();
  }

}
