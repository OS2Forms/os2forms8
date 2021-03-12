<?php

function white_darkblue_form_system_theme_settings_alter(
  &$form,
  Drupal\Core\Form\FormStateInterface $form_state
) {
  $form['custom_settings'] = [
    '#type' => 'details',
    '#title' => t('Brugerdefinerede indstillinger '),
  ];
  $form['custom_settings']['front_page_url'] = [
    '#type' => 'url',
    '#title' => t('Forside URL'),
    '#default_value' => theme_get_setting('front_page_url'),
  ];
}
