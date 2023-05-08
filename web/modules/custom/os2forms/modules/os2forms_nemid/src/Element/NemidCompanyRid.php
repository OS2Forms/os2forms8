<?php

namespace Drupal\os2forms_nemid\Element;

use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'os2forms_nemid_company_rid'.
 *
 * @FormElement("os2forms_nemid_company_rid")
 *
 * @see \Drupal\Core\Render\Element\FormElement
 * @see https://api.drupal.org/api/drupal/core%21lib%21Drupal%21Core%21Render%21Element%21FormElement.php/class/FormElement
 * @see \Drupal\Core\Render\Element\RenderElement
 * @see https://api.drupal.org/api/drupal/namespace/Drupal%21Core%21Render%21Element
 * @see \Drupal\os2forms_nemid\Element\NemidCompanyRid
 */
class NemidCompanyRid extends NemidElementBase {

  /**
   * {@inheritdoc}
   */
  public function getInfo() {
    $class = get_class($this);
    return parent::getInfo() + [
      '#process' => [
        [$class, 'processNemidCompanyRid'],
        [$class, 'processAjaxForm'],
      ],
      '#element_validate' => [
        [$class, 'validateNemidCompanyRid'],
      ],
      '#pre_render' => [
        [$class, 'preRenderNemidCompanyRid'],
      ],
      '#theme' => 'input__os2forms_nemid_company_rid',
    ];
  }

  /**
   * Processes a 'os2forms_nemid_company_rid' element.
   */
  public static function processNemidCompanyRid(&$element, FormStateInterface $form_state, &$complete_form) {
    // Here you can add and manipulate your element's properties and callbacks.
    return $element;
  }

  /**
   * Webform element validation handler for #type 'os2forms_nemid_company_rid'.
   */
  public static function validateNemidCompanyRid(&$element, FormStateInterface $form_state, &$complete_form) {
    // Here you can add custom validation logic.
  }

  /**
   * {@inheritdoc}
   */
  public static function preRenderNemidCompanyRid(array $element) {
    $element = parent::prerenderNemidElementBase($element);
    static::setAttributes($element, [
      'form-text',
      'os2forms-nemid-company-rid',
    ]);
    return $element;
  }

}
