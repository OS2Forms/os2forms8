<?php

namespace Drupal\os2web_datalookup\Routing;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Component\Plugin\PluginManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Routing\Route;

/**
 * Provides dynamic routes for AuthProvider.
 */
class DataLookupRoutes implements ContainerInjectionInterface {

  /**
   * The manager to be used for instantiating plugins.
   *
   * @var \Drupal\Component\Plugin\PluginManagerInterface
   */
  protected $manager;

  /**
   * Constructs a new AuthProvider route subscriber.
   *
   * @param \Drupal\Component\Plugin\PluginManagerInterface $manager
   *   The AuthProviderManager.
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
   * Provides route definition for AuthProvider plugins settings form.
   *
   * @return array
   *   Array with route definitions.
   */
  public function routes() {
    $pluginDefinitions = $this->manager->getDefinitions();
    $routes = [];
    foreach ($pluginDefinitions as $id => $plugin) {
      $routes["os2web_datalookup.$id"] = new Route(
        "/admin/config/system/os2web-datalookup/" . str_replace('_', '-', $plugin['id']), [
          '_form' => '\Drupal\os2web_datalookup\Form\DataLookupPluginSettingsForm',
          '_title' => t("Configure :label", [':label' => $plugin['label']->__toString()])->__toString(),
          '_plugin_id' => $id,
        ],
        [
          '_permission' => 'administer os2web datalookup configuration',
        ]
      );
    }

    return $routes;
  }

}
