<?php

namespace Drupal\os2web_nemlogin\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Class NemloginController.
 *
 * @package Drupal\os2web_nemlogin\Controller
 */
class NemloginController extends ControllerBase {

  /**
   * Nemlogin Auth Provider Login callback.
   */
  public function login() {
    /** @var \Drupal\os2web_nemlogin\Service\AuthProviderService $authProviderService */
    $authProviderService = \Drupal::service('os2web_nemlogin.auth_provider');

    /** @var \Drupal\os2web_nemlogin\Plugin\AuthProviderInterface $plugin */
    $plugin = $authProviderService->getActivePlugin();
    return $plugin->login();
  }

  /**
   * Nemlogin Auth Provider Logout callback.
   */
  public function logout() {
    /** @var \Drupal\os2web_nemlogin\Service\AuthProviderService $authProviderService */
    $authProviderService = \Drupal::service('os2web_nemlogin.auth_provider');

    /** @var \Drupal\os2web_nemlogin\Plugin\AuthProviderInterface $plugin */
    $plugin = $authProviderService->getActivePlugin();
    return $plugin->logout();
  }

  /**
   * Test page callback.
   */
  public function testPage() {
    /** @var \Drupal\os2web_nemlogin\Service\AuthProviderService $authProviderService */
    $authProviderService = \Drupal::service('os2web_nemlogin.auth_provider');

    /** @var \Drupal\os2web_nemlogin\Plugin\AuthProviderInterface $plugin */
    $plugin = $authProviderService->getActivePlugin();
    if ($plugin->isAuthenticated()) {
      $cpr = $plugin->fetchValue('cpr');
      $cvr = $plugin->fetchValue('cvr');

      if ($cpr) {
        $build[] = [
          '#markup' => '<p>' . 'You are logged in with CPR: ' . $cpr . '</p>',
        ];
      }
      if ($cvr) {
        $build[] = [
          '#markup' => '<p>' . 'You are logged in with CVR: ' . $cvr . '</p>',
        ];
      }
    }

    if ($plugin->isInitialized()) {
      $build[] = [
        '#markup' => '<p>' . $authProviderService->generateLink()->toString() . '</p>',
      ];
    }
    else {
      $build[] = [
        '#markup' => '<p>' . 'No plugin select, or selected plugin cannot be initialized' . '</p>',
      ];
    }

    return $build;
  }

}
