<?php

namespace Drupal\os2web_datalookup\Controller;

use Drupal\Component\Plugin\PluginManagerInterface;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Link;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class DatalookupController.
 *
 * @package Drupal\os2web_datalookup\Controller
 */
class DatalookupController extends ControllerBase {

  /**
   * The manager to be used for instantiating plugins.
   *
   * @var \Drupal\Component\Plugin\PluginManagerInterface
   */
  protected $manager;

  /**
   * {@inheritdoc}
   */
  public function __construct(PluginManagerInterface $manager) {
    $this->manager = $manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('plugin.manager.os2web_datalookup')
    );
  }

  /**
   * Status list callback.
   */
  public function statusList() {
    $headers = [
      'title' => $this
        ->t('Title'),
      'status' => $this
        ->t('Status'),
      'action' => $this
        ->t('Actions'),
    ];

    $rows = [];
    foreach ($this->manager->getDefinitions() as $id => $plugin_definition) {
      $plugin = $this->manager->createInstance($id);
      $status = $plugin->getStatus();
      $rows[$id] = [
        'title' => $plugin_definition['label'],
        'status' => ($plugin->isReady() ? $this->t('READY') : $this->t('ERROR')) . ': ' . $status,
        'action' => Link::createFromRoute($this->t('Settings'), "os2web_datalookup.$id"),
      ];
    }

    return [
      '#theme' => 'table',
      '#header' => $headers,
      '#rows' => $rows,
    ];
  }

}
