<?php

namespace Drupal\os2web_nemlogin\Form;

/**
 * @file
 * Contains \Drupal\os2web_nemlogin\Form\SettingsForm.
 */

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Link;

/**
 * OS2Web Nemlogin settings form.
 */
class SettingsForm extends ConfigFormBase {

  /**
   * Name of the config.
   *
   * @var string
   */
  public static $configName = 'os2web_nemlogin.settings';

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'os2web_nemlogin_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [SettingsForm::$configName];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    /** @var \Drupal\os2web_nemlogin\Service\AuthProviderService $authProviderService */
    $authProviderService = \Drupal::service('os2web_nemlogin.auth_provider');

    $header = [
      'title' => $this
        ->t('Title'),
      'status' => $this
        ->t('Status'),
      'action' => $this
        ->t('Actions'),
    ];

    $authProviderPlugins = \Drupal::service('plugin.manager.os2web_nemlogin.auth_provider');
    $plugin_definitions = $authProviderPlugins->getDefinitions();

    $options = [];
    foreach ($plugin_definitions as $id => $plugin_definition) {
      /** @var \Drupal\os2web_nemlogin\Plugin\AuthProviderBase $plugin */
      $plugin = $authProviderPlugins->createInstance($id);

      $options[$plugin_definition['id']] = [
        'title' => $plugin_definition['label'],
        'status' => $plugin->isInitialized() ? $this->t('OK') : $this->t('Auth object initialization failed'),
        'action' => Link::createFromRoute('settings', "os2web_nemlogin.auth_provider.$id"),
      ];
    }

    $form['active_plugin'] = [
      '#type' => 'tableselect',
      '#header' => $header,
      '#options' => $options,
      '#multiple' => FALSE,
      '#default_value' => $authProviderService->getActivePluginId() ? $authProviderService->getActivePluginId() : NULL,
      '#empty' => $this
        ->t('No plugins found'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $this->config(SettingsForm::$configName);

    // Set the value.
    $config->set('active_plugin_id', $form_state->getValue(['active_plugin']));

    // Finally save the configuration.
    $config->save();
    parent::submitForm($form, $form_state);
  }

}
