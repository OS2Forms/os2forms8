<?php

namespace Drupal\os2web_datalookup\Plugin\os2web\DataLookup;

use Drupal\Component\Plugin\ConfigurableInterface;
use Drupal\Component\Plugin\PluginInspectionInterface;
use Drupal\Core\Plugin\PluginFormInterface;

/**
 * DataLookupInterface plugin interface for providing some metadata inspection.
 *
 * This interface provides some simple tools for code receiving a plugin to
 * interact with the plugin system.
 *
 * @ingroup plugin_api
 */
interface DataLookupInterface extends PluginInspectionInterface, PluginFormInterface, ConfigurableInterface {

  /**
   * Get plugin status.
   */
  public function getStatus();

  /**
   * Get plugin readiness.
   */
  public function isReady();

}
