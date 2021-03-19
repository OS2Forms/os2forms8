<?php

/**
 * @file
 * The PHP page that using as liveness probe.
 *
 * Environment that needs indication on project liveness can use this page.
 */

use Drupal\Core\DrupalKernel;
use Symfony\Component\HttpFoundation\Request;

$autoloader = require_once 'autoload.php';

// Sending error code by default.
http_response_code(500);

try {
  // Loading standard Drupal Kernel process.
  $kernel = new DrupalKernel('prod', $autoloader);
  $server = $_SERVER;
  // Requesting user/login page.
  $server['REQUEST_URI'] = '/user/login';
  $request = new Request($_GET, $_POST, [], $_COOKIE, $_FILES, $server);
  $response = $kernel->handle($request);
  $result = 'NOK';
  // Only 200 response code is allowed for valid health check.
  if ($response->getStatusCode() == 200) {
    http_response_code($response->getStatusCode());
    $result = 'OK';
  }
  else {
    print_r($response);
    fwrite(STDERR, print_r($response, 1) . PHP_EOL);
  }
}
catch (\Exception $exception) {
  $result = 'NOK' . PHP_EOL;
  $result = $exception->getMessage();
  print_r($result);
  fwrite(STDERR, print_r($result, 1) . PHP_EOL);
}

print $result;
