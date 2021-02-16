<?php

namespace Drupal\os2web_datalookup\Form;

use Drupal\Component\Plugin\PluginManagerInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Form or configuring DataLookup plugins.
 */
class DataLookupPluginSettingsForm extends PluginSettingsFormBase {

  /**
   * {@inheritdoc}
   */
  public function __construct(ConfigFactoryInterface $config_factory, PluginManagerInterface $manager) {
    parent::__construct($config_factory);
    $this->manager = $manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('plugin.manager.os2web_datalookup')
    );
  }

  /**
   * {@inheritdoc}
   */
  public static function getConfigName() {
    return 'os2web_datalookup';
  }

}
