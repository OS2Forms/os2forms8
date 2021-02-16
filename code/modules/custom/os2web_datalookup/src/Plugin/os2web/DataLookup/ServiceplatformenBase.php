<?php

namespace Drupal\os2web_datalookup\Plugin\os2web\DataLookup;

use Drupal\Core\Form\FormStateInterface;

/**
 * Defines base plugin class for Serviceplatformen plugins.
 */
abstract class ServiceplatformenBase extends DataLookupBase implements DataLookupInterface {

  /**
   * Plugin status string.
   *
   * @var string
   */
  protected $status;

  /**
   * Service object.
   *
   * @var \SoapClient
   */
  protected $client;

  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->init();
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'mode_selector' => 0,
      'serviceagreementuuid' => '',
      'serviceuuid' => '',
      'wsdl' => '',
      'location' => '',
      'location_test' => '',
      'usersystemuuid' => '',
      'useruuid' => '',
      'accountinginfo' => '',
      'certfile_passphrase' => '',
      'certfile' => '',
      'certfile_test' => '',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $form['mode_fieldset'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Mode'),
    ];

    $form['mode_fieldset']['mode_selector'] = [
      '#type' => 'radios',
      '#default_value' => $this->configuration['mode_selector'],
      '#options' => [0 => $this->t('Live'), 1 => $this->t('Test')],
    ];

    $form['serviceagreementuuid'] = [
      '#type' => 'textfield',
      '#title' => 'Serviceaftale UUID',
      '#default_value' => $this->configuration['serviceagreementuuid'],
    ];

    $form['serviceuuid'] = [
      '#type' => 'textfield',
      '#title' => 'Service UUID',
      '#default_value' => $this->configuration['serviceuuid'],
      '#description' => $this->t('ex. c0daecde-e278-43b7-84fd-477bfeeea027'),
    ];

    $form['wsdl'] = [
      '#type' => 'textfield',
      '#maxlength' => 500,
      '#title' => 'Service WSDL location',
      '#default_value' => $this->configuration['wsdl'],
      '#description' => $this->t('ex. CVROnline-SF1530/wsdl/token/OnlineService.wsdl, relative path would be automatically converted to absolute path'),
    ];

    $form['location'] = [
      '#type' => 'textfield',
      '#title' => 'Service location (live)',
      '#default_value' => $this->configuration['location'],
      '#description' => $this->t('ex. https://prod.serviceplatformen.dk/service/CVR/Online/2'),
    ];

    $form['location_test'] = [
      '#type' => 'textfield',
      '#title' => 'Service location (test)',
      '#default_value' => $this->configuration['location_test'],
      '#description' => $this->t('ex. https://exttest.serviceplatformen.dk/service/CVR/Online/2'),
    ];

    $form['usersystemuuid'] = [
      '#type' => 'textfield',
      '#title' => 'System UUID',
      '#default_value' => $this->configuration['usersystemuuid'],
    ];

    $form['useruuid'] = [
      '#type' => 'textfield',
      '#title' => 'Kommune UUID',
      '#default_value' => $this->configuration['useruuid'],
    ];

    $form['accountinginfo'] = [
      '#type' => 'textfield',
      '#title' => 'AccountingInfo',
      '#default_value' => $this->configuration['accountinginfo'],
    ];

    $form['certfile_passphrase'] = [
      '#type' => 'password',
      '#title' => 'Certfile passphrase',
      '#default_value' => $this->configuration['certfile_passphrase'],
    ];

    $form['certfile'] = [
      '#type' => 'textfield',
      '#title' => 'Certfile (live)',
      '#default_value' => $this->configuration['certfile'],
    ];

    $form['certfile_test'] = [
      '#type' => 'textfield',
      '#title' => 'Certfile (test)',
      '#default_value' => $this->configuration['certfile_test'],
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    if ($form_state->getValue('certfile_passphrase') == '') {
      $form_state->unsetValue('certfile_passphrase');
    }

    $keys = array_keys($this->defaultConfiguration());
    $configuration = $this->getConfiguration();
    foreach ($keys as $key) {
      $configuration[$key] = $form_state->getValue($key);
    }
    $this->setConfiguration($configuration);
  }

  /**
   * {@inheritdoc}
   */
  public function getStatus() {
    return $this->status;
  }

  /**
   * Plugin init method.
   */
  private function init() {
    ini_set('soap.wsdl_cache_enabled', 0);
    ini_set('soap.wsdl_cache_ttl', 0);
    $this->status = $this->t('Plugin is ready to work')->__toString();

    $required_configuration = [
      0 => [
        'serviceagreementuuid',
        'serviceuuid',
        'wsdl',
        'location',
        'usersystemuuid',
        'useruuid',
        'accountinginfo',
        'certfile',
      ],
      1 => [
        'serviceagreementuuid',
        'serviceuuid',
        'wsdl',
        'location_test',
        'usersystemuuid',
        'useruuid',
        'accountinginfo',
        'certfile_test',
      ],
    ];
    $this->isReady = TRUE;
    foreach ($required_configuration[$this->configuration['mode_selector']] as $key) {
      if (empty($this->configuration[$key])) {
        $this->isReady = FALSE;
        $this->status = $this->t('Configuration is not completed.')->__toString();
        return;
      }
    }

    try {
      switch ($this->configuration['mode_selector']) {
        case 0:
          $ws_config = [
            'location' => $this->configuration['location'],
            'local_cert' => $this->configuration['certfile'],
            'passphrase' => $this->configuration['certfile_passphrase'],
            'trace' => TRUE,
          ];
          break;

        case 1:
          $ws_config = [
            'location' => $this->configuration['location_test'],
            'local_cert' => $this->configuration['certfile_test'],
            'trace' => TRUE,
          ];
          break;
      }
      $this->client = new \SoapClient($this->getWsdlUrl(), $ws_config);
    }
    catch (\SoapFault $e) {
      $this->isReady = FALSE;
      $this->status = $e->faultstring;
    }
  }

  /**
   * Get wsdl URL method.
   *
   * @return string
   *   WSDL URL.
   */
  protected function getWsdlUrl() {
    $wsdl = $this->configuration['wsdl'];
    // If it is relative URL make is absolute.
    if (substr($wsdl, 0, 4) !== "http") {
      global $base_url, $base_path;
      $wsdl = $base_url . $base_path . drupal_get_path('module', 'os2web_datalookup') . '/' . $wsdl;
    }
    return $wsdl;
  }

  /**
   * Webservice general request array prepare method.
   *
   * @return array
   *   Prepared request with general info.
   */
  protected function prepareRequest() {
    /** @var \Drupal\Core\Session\AccountProxyInterface $user */
    $user = \Drupal::currentUser();
    return [
      'InvocationContext' => [
        'ServiceAgreementUUID' => $this->configuration['serviceagreementuuid'],
        'UserSystemUUID' => $this->configuration['usersystemuuid'],
        'UserUUID' => $this->configuration['useruuid'],
        'ServiceUUID' => $this->configuration['serviceuuid'],
        'AccountingInfo' => $this->configuration['accountinginfo'],
        'OnBehalfOfUser' => $user->getAccountName(),
      ],
    ];
  }

  /**
   * Main service request query method.
   *
   * @param string $method
   *   Method name to call.
   * @param array $request
   *   Request array to call method.
   *
   * @return array
   *   Method response or FALSE.
   */
  protected function query($method, array $request) {
    if (!$this->isReady()) {
      return [
        'status' => FALSE,
        'text' => $this->getStatus(),
      ];
    }

    try {
      $response = (array) $this->client->$method($request);
      $response['status'] = TRUE;
    }
    catch (\SoapFault $e) {
      $response = [
        'status' => FALSE,
        'error' => $e->faultstring,
      ];
    }

    return $response;
  }

}
