<?php

namespace Drupal\os2forms_nemid\Plugin\WebformElement;

/**
 * Provides a 'os2forms_nemid_company_cvr' element.
 *
 * @WebformElement(
 *   id = "os2forms_nemid_company_address",
 *   label = @Translation("NemID Company Address"),
 *   description = @Translation("Provides a NemID Company Address element."),
 *   category = @Translation("NemID"),
 * )
 *
 * @see \Drupal\os2forms_nemid\Plugin\NemidElementBase
 * @see \Drupal\os2forms_nemid\Element\NemidCompanyAddress
 */
class NemidCompanyAddress extends ServiceplatformenCvrElementBase implements NemidElementCompanyInterface {

  /**
   * {@inheritdoc}
   */
  public function getPrepopulateFieldFieldKey() {
    return 'company_address';
  }

}
