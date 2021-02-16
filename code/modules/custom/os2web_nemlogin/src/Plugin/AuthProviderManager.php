<?php

namespace Drupal\os2web_nemlogin\Plugin;

use Drupal\Component\Plugin\FallbackPluginManagerInterface;
use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Plugin\DefaultPluginManager;

/**
 * Provides an AuthProvider plugin manager.
 *
 * @see \Drupal\os2web_nemlogin\Annotation\AuthProvider
 * @see \Drupal\os2web_nemlogin\Plugin\AuthProviderInterface
 * @see plugin_api
 */
class AuthProviderManager extends DefaultPluginManager implements FallbackPluginManagerInterface {

  /**
   * Constructs a AuthProviderManager object.
   *
   * @param \Traversable $namespaces
   *   An object that implements \Traversable which contains the root paths
   *   keyed by the corresponding namespace to look for plugin implementations.
   * @param \Drupal\Core\Cache\CacheBackendInterface $cache_backend
   *   Cache backend instance to use.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler to invoke the alter hook with.
   */
  public function __construct(\Traversable $namespaces, CacheBackendInterface $cache_backend, ModuleHandlerInterface $module_handler) {
    parent::__construct(
      'Plugin/os2web/NemloginAuthProvider',
      $namespaces,
      $module_handler,
      'Drupal\os2web_nemlogin\Plugin\AuthProviderInterface',
      'Drupal\os2web_nemlogin\Annotation\AuthProvider'
    );
    $this->alterInfo('os2web_nemlogin_auth_provider_info');
    $this->setCacheBackend($cache_backend, 'os2web_nemlogin_auth_provider_info_plugins');
  }

  /**
   * {@inheritdoc}
   */
  public function getFallbackPluginId($plugin_id, array $configuration = []) {
    return 'idp';
  }

}
