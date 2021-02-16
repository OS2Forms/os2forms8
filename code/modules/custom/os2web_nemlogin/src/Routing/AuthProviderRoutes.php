<?php

namespace Drupal\os2web_nemlogin\Routing;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Component\Plugin\PluginManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Routing\Route;

/**
 * Provides dynamic routes for AuthProvider.
 */
class AuthProviderRoutes implements ContainerInjectionInterface {

  /**
   * Constructs a new AuthProvider route subscriber.
   *
   * @param \Drupal\Component\Plugin\PluginManagerInterface $authProviderManager
   *   The AuthProviderManager.
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
   * Provides route definition for AuthProvider plugins settings form.
   *
   * @return array
   *   Array with route definitions.
   */
  public function routes() {
    $pluginDefinitions = $this->authProviderManager->getDefinitions();

    $routes = [];
    foreach ($pluginDefinitions as $id => $plugin) {
      $label = $plugin['label'];
      $pluginUrl = str_replace('_', '-', $plugin['id']);
      $routes["os2web_nemlogin.auth_provider.$id"] = new Route(
        "admin/config/system/os2web-nemlogin/$pluginUrl",
        [
          '_form' => '\Drupal\os2web_nemlogin\Form\AuthProviderBaseSettingsForm',
          '_title' => "Configure $label",
          '_plugin_id' => $id,
        ],
        [
          '_permission' => 'administer nemlogin configuration',
        ]
      );
    }

    return $routes;
  }

}
