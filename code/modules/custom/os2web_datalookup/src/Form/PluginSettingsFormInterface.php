<?php

namespace Drupal\os2web_datalookup\Form;

/**
 * Provides an interface for a Plugin Settings Form.
 *
 * @ingroup form_api
 */
interface PluginSettingsFormInterface {

  /**
   * Name of the configuration.
   *
   * @return string
   *   Configuration name for plugins.
   */
  public static function getConfigName();

}
