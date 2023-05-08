<?php

namespace Drupal\os2forms_autocomplete\Plugin\WebformElement;

use Drupal\Core\Form\FormStateInterface;
use Drupal\webform\Plugin\WebformElement\WebformAutocomplete;
use Drupal\webform\WebformSubmissionInterface;

/**
 * Provides a 'os2forms_autocomplete' element.
 *
 * @WebformElement(
 *   id = "os2forms_autocomplete",
 *   label = @Translation("OS2Forms Autocomplete"),
 *   description = @Translation("Provides a customer OS2Forms Autocomplete element."),
 *   category = @Translation("OS2Forms"),
 * )
 */
class AutocompleteElement extends WebformAutocomplete {

  /**
   * {@inheritdoc}
   */
  protected function defineDefaultProperties() {
    $properties = parent::defineDefaultProperties();

    // Adding OS2Forms autocomplete properties.
    $properties['autocomplete_api_url'] = '';

    // Remove properties which is not applicable to
    // OS2Forms autocomplete element.
    unset($properties['autocomplete_existing']);
    unset($properties['autocomplete_items']);

    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public function prepare(array &$element, WebformSubmissionInterface $webform_submission = NULL) {
    parent::prepare($element, $webform_submission);

    if (isset($element['#webform_key'])) {
      $element['#autocomplete_route_name'] = 'os2forms_autocomplete.element.autocomplete';
      $element['#autocomplete_route_parameters'] = [
        'webform' => $webform_submission->getWebform()->id(),
        'key' => $element['#webform_key'],
      ];

      if ($webform_submission->isNew() && isset($element['#default_value'])) {
        /** @var \Drupal\os2forms_autocomplete\Service\AutocompleteService $acService */
        $acService = \Drupal::service('os2forms_autocomplete.service');
        $autocompleteDefaultValue = $acService->getFirstMatchingValue($element['#autocomplete_api_url'], $element['#default_value']);

        if ($autocompleteDefaultValue) {
          $element['#default_value'] = $autocompleteDefaultValue;
        }
      }
    }
  }

  /**
   * Override of default getValue.
   *
   * When value is requested, we check if it should be supplemented with the
   * values from autocomplete webservice instead.
   *
   * @param array $element
   *   An element.
   * @param \Drupal\webform\WebformSubmissionInterface $webform_submission
   *   A webform submission.
   * @param array $options
   *   An array of options.
   *
   * @return array|string
   *   The element's submission value.
   *
   * @see \Drupal\webform\Plugin\WebformElementBase::getValue()
   */
  public function getValue(array $element, WebformSubmissionInterface $webform_submission, array $options = []) {
    $value = parent::getValue($element, $webform_submission, $options);

    if ($webform_submission->isNew()) {
      /** @var \Drupal\os2forms_autocomplete\Service\AutocompleteService $acService */
      $acService = \Drupal::service('os2forms_autocomplete.service');
      $autocompleteDefaultValue = $acService->getFirstMatchingValue($element['#autocomplete_api_url'], $value);

      if ($autocompleteDefaultValue) {
        $value = $autocompleteDefaultValue;
      }
    }

    return $value;
  }

  /**
   * {@inheritdoc}
   */
  public function form(array $form, FormStateInterface $form_state) {
    $form = parent::form($form, $form_state);

    // Unsetting the parametes that we are not using.
    unset($form['autocomplete']['autocomplete_items']);
    unset($form['autocomplete']['autocomplete_existing']);

    $form['autocomplete']['autocomplete_api_url'] = [
      '#type' => 'textfield',
      '#title' => $this->t('API Url where the autocomplete values are coming from'),
      '#description' => $this->t('The returned result must be in JSON format. Values from multiple keys will be combined'),
    ];

    return $form;
  }

}
