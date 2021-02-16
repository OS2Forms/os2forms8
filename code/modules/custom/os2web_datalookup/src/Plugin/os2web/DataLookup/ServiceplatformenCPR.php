<?php

namespace Drupal\os2web_datalookup\Plugin\os2web\DataLookup;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Messenger\MessengerInterface;
use Drupal\Core\Render\Markup;

/**
 * Defines a plugin for ServiceplatformenCPR.
 *
 * @DataLookup(
 *   id = "serviceplatformen_cpr",
 *   label = @Translation("Serviceplatformen CPR"),
 * )
 */
class ServiceplatformenCPR extends ServiceplatformenBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return array_merge(parent::defaultConfiguration(), [
      'test_mode_fixed_cpr' => '',
    ]);
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $form = parent::buildConfigurationForm($form, $form_state);
    $form['mode_fieldset']['test_mode_fixed_cpr'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Fixed test CPR'),
      '#default_value' => $this->configuration['test_mode_fixed_cpr'],
      '#description' => $this->t('Fixed CPR that will be used for all requests to the serviceplatformen instead of the provided CPR.'),
      '#states' => [
        // Hide the settings when the cancel notify checkbox is disabled.
        'visible' => [
          'input[name="mode_selector"]' => ['value' => 1],
        ],
      ],
    ];
    $form['test_cpr'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Test CPR nr.'),
      '#states' => [
        'invisible' => [
          'input[name="test_mode_fixed_cpr"]' => ['filled' => TRUE],
          'input[name="mode_selector"]' => ['value' => 1],
        ],
      ],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    if ($form_state->getValue('mode_selector') == 0) {
      $form_state->setValue('test_mode_fixed_cpr', '');
    }

    parent::submitConfigurationForm($form, $form_state);

    if (!empty($form_state->getValue('test_cpr'))) {
      $cpr = $form_state->getValue('test_cpr');
    }

    if ($this->configuration['mode_selector'] == 1 && $form_state->getValue('test_mode_fixed_cpr')) {
      $cpr = $form_state->getValue('test_mode_fixed_cpr');
    }

    if (!empty($cpr)) {
      $response = $this->cprBasicInformation($cpr);
      \Drupal::messenger()->addMessage(
        Markup::create('<pre>' . print_r($response, 1) . '</pre>'),
        $response['status'] ? MessengerInterface::TYPE_STATUS : MessengerInterface::TYPE_WARNING
      );
    }
  }

  /**
   * Implementation of callCPRBasicInformationService call.
   *
   * @param string $cpr
   *   Requested PSN (cpr) ([0-9]{6}\-[0-9]{4}).
   *
   * @return array
   *   [status] => TRUE/FALSE
   *   [error] => Descriptive text shown when CPR doesn't validate
   */
  public function cprBasicInformation($cpr) {
    $request = $this->prepareRequest();
    $request['PNR'] = str_replace('-', '', $cpr);
    return $this->query('callCPRBasicInformationService', $request);
  }

  /**
   * Validate cpr callback.
   *
   * @cpr String - PSN (cpr) ([0-9]{6}\-[0-9]{4})
   *
   * @return array
   *   [status] => TRUE/FALSE
   *   [error] => Descriptive text shown when CPR doesn't validate
   */
  public function validateCpr($cpr) {
    return $this->cprBasicInformation($cpr);
  }

  /**
   * Fetch address for the specified CPR.
   *
   * @cpr
   *  String - PSN (cpr) ([0-9]{6}\-[0-9]{4})
   *
   * @return array
   *   [status] => TRUE/FALSE
   *   [address] => Roadname 10
   *   [zipcode] => 1212
   *   [error] => Descriptive text if something goes wrong
   */
  public function getAddress($cpr) {
    $result = $this->cprBasicInformation($cpr);

    // If all goes well we return address array.
    if ($result['status']) {
      return [
        'status' => $result['status'],
        'name' => isset($result['adresseringsnavn']) ? $result['adresseringsnavn'] : '',
        'road' => isset($result['vejadresseringsnavn']) ? $result['vejadresseringsnavn'] : '',
        'road_no' => isset($result['husnummer']) ? $result['husnummer'] : '',
        'floor' => isset($result['etage']) ? $result['etage'] : '',
        'door' => isset($result['sidedoer']) ? $result['sidedoer'] : '',
        'zipcode' => isset($result['postnummer']) ? $result['postnummer'] : '',
        'city' => isset($result['postdistrikt']) ? $result['postdistrikt'] : '',
        'coname' => isset($result['conavn']) ? $result['conavn'] : '',
      ];
    }
    else {
      return $result;
    }
  }

}
