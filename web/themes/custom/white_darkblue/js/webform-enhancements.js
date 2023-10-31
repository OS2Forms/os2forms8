(function($) {
  $(document).ready(function() {
    $("label.option input[type='radio']").change(function() {
      // Only target the siblings in the same group or fieldset
      $(this).closest('fieldset').find('label.option').removeClass('active-label');

      if ($(this).prop('checked')) {
        // Add the active class to the parent label of the checked radio
        $(this).parent('label.option').addClass('active-label');
      }
    });
  });
})(jQuery);
