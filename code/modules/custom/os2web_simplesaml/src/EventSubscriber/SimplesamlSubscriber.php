<?php

namespace Drupal\os2web_simplesaml\EventSubscriber;

use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Url;
use Drupal\simplesamlphp_auth\Service\SimplesamlphpAuthManager;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Event subscriber subscribing to KernelEvents::REQUEST.
 */
class SimplesamlSubscriber implements EventSubscriberInterface {

  /**
   * The SimpleSAML Authentication helper service.
   *
   * @var \Drupal\simplesamlphp_auth\Service\SimplesamlphpAuthManager
   */
  protected $simplesaml;

  /**
   * The current account.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $account;

  /**
   * {@inheritdoc}
   *
   * @param \Drupal\simplesamlphp_auth\Service\SimplesamlphpAuthManager $simplesaml
   *   The SimpleSAML Authentication helper service.
   * @param \Drupal\Core\Session\AccountInterface $account
   *   The current account.
   */
  public function __construct(SimplesamlphpAuthManager $simplesaml, AccountInterface $account) {
    $this->simplesaml = $simplesaml;
    $this->account = $account;
  }

  /**
   * Redirect anonymous user to SimpleSAML auth page if IP matches redirect IPs.
   *
   * @param \Symfony\Component\HttpKernel\Event\GetResponseEvent $event
   *   The subscribed event.
   */
  public function redirectToSimplesamlLogin(GetResponseEvent $event) {
    // If user is not anonymous, if SimpleSAML is not activated or if PHP_SAPI
    // is cli - don't do any redirects.
    if (!$this->account->isAnonymous() || !$this->simplesaml->isActivated() || PHP_SAPI === 'cli') {
      return;
    }

    $request = $event->getRequest();
    $config = \Drupal::config('os2web_simplesaml.settings');

    // Only redirect if we are on redirect triggering page.
    $patterns = str_replace(',', "\n", $config->get('redirect_trigger_path'));
    if (empty($patterns) || \Drupal::service('path.matcher')->matchPath($request->getRequestUri(), $patterns)) {
      // Killing cache for redirect triggering page.
      \Drupal::service('page_cache_kill_switch')->trigger();

      // Check has been already performed, wait for the cookies to expire.
      if ($request->cookies->has('os2web_simplesaml_redirect_to_saml')) {
        return;
      }

      $simplesamlRedirect = FALSE;
      $remoteIp = $request->getClientIp();

      $config = \Drupal::config('os2web_simplesaml.settings');
      $redirectIps = $config->get('redirect_ips');

      if (empty($redirectIps)) {
        // No redirect IPs set, then redirect for all IPs.
        $simplesamlRedirect = TRUE;
      }
      else {
        $customIps = explode(',', $redirectIps);

        // If the client request is from one of the IP's, login using
        // SimpleSAMLphp; otherwise use nemid login.
        //
        // Check performed on parts of the ip address.
        // This makes it possible to add only the beginning of the IP range.
        // F.ex. 192.168 will allow all ip addresses including 192.168 as part
        // of the it.
        foreach ($customIps as $customIp) {
          if (strpos($remoteIp, $customIp) !== FALSE) {
            $simplesamlRedirect = TRUE;
            break;
          }
        }
      }

      // Getting cookies time to live (TTL).
      $cookies_ttl = $config->get('redirect_cookies_ttl');

      if ($simplesamlRedirect) {
        // Get the path (default: '/saml_login') from the
        // 'simplesamlphp_auth.saml_login' route.
        $saml_login_path = Url::fromRoute('simplesamlphp_auth.saml_login', [], [
          'query' => \Drupal::service('redirect.destination')
            ->getAsArray(),
        ])->toString();

        // Set 5min cookies to prevent further checks and looping redirect.
        setrawcookie('os2web_simplesaml_redirect_to_saml', 'TRUE', time() + $cookies_ttl);

        // Redirect directly to the external IdP.
        $response = new RedirectResponse($saml_login_path, RedirectResponse::HTTP_FOUND);
        $event->setResponse($response);
        $event->stopPropagation();
      }
      else {
        // Set 5min cookies to prevent further checks and looping redirect.
        setrawcookie('os2web_simplesaml_redirect_to_saml', 'FALSE', time() + $cookies_ttl);
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events[KernelEvents::REQUEST][] = ['redirectToSimplesamlLogin'];
    return $events;
  }

}
