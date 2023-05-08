<?php

namespace Drupal\os2forms_nemid\Element;

/**
 * Provides a 'os2forms_nemid_cpr_fetch_data'.
 *
 * @FormElement("os2forms_nemid_cpr_fetch_data")
 */
class NemidCprFetchData extends CompositeFetchDataBase {

  /**
   * {@inheritdoc}
   */
  public static function getFormElementId() {
    return 'os2forms_nemid_cpr_fetch_data';
  }

  /**
   * {@inheritdoc}
   */
  public static function getValueElementName() {
    return 'cpr_fetch_data_value';
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubmitElementName() {
    return 'cpr_fetch_data_submit';
  }

}
