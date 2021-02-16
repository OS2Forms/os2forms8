<?php

namespace Drupal\os2web_nemlogin\Annotation;

use Drupal\Component\Annotation\Plugin;

/**
 * Defines a AuthProvider annotation object.
 *
 * Plugin Namespace: Plugin/os2web/NemloginAuthProvider.
 *
 * @see hook_os2web_nemlogin_auth_provider_info_alter()
 * @see \Drupal\os2web_nemlogin\Plugin\AuthProviderInterface
 * @see \Drupal\os2web_nemlogin\Plugin\AuthProviderBase
 * @see \Drupal\os2web_nemlogin\Plugin\AuthProviderManager
 * @see plugin_api
 *
 * @Annotation
 */
class AuthProvider extends Plugin {

  /**
   * The plugin ID.
   *
   * @var string
   */
  public $id;

  /**
   * The human-readable name of the consent storage.
   *
   * @var \Drupal\Core\Annotation\Translation
   *
   * @ingroup plugin_translatable
   */
  public $label;

  /**
   * A brief description of the consent storage.
   *
   * This will be shown when adding or configuring this consent storage.
   *
   * @var \Drupal\Core\Annotation\Translation
   *
   * @ingroup plugin_translatable
   */
  public $description = '';

}
