<?php

namespace Drupal\os2web_datalookup\Plugin\os2web\DataLookup;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Plugin\PluginBase;

/**
 * Provides a base class for image effects.
 *
 * @see \Drupal\image\Annotation\ImageEffect
 * @see \Drupal\image\ImageEffectInterface
 * @see \Drupal\image\ConfigurableImageEffectInterface
 * @see \Drupal\image\ConfigurableImageEffectBase
 * @see \Drupal\image\ImageEffectManager
 * @see plugin_api
 */
abstract class DataLookupBase extends PluginBase implements DataLookupInterface {

  /**
   * Plugin readiness flag.
   *
   * @var bool
   */
  protected $isReady = TRUE;

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
  public function label() {
    return $this->pluginDefinition['label'];
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
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function validateConfigurationForm(array &$form, FormStateInterface $form_state) {
    // Making validate optional.
  }

  /**
   * {@inheritdoc}
   */
  public function getStatus() {
    return 'N/A';
  }

  /**
   * {@inheritdoc}
   */
  public function isReady() {
    return $this->isReady;
  }

}
