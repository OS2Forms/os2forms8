(function($) {
  $(document).ready(function() {
    $("label.option input[type='radio']").change(function() {
      // Remove the active class from all labels
      $("label.option").removeClass('active-label');

      if ($(this).prop('checked')) {
        // Add the active class to the parent label of the checked radio
        $(this).parent('label.option').addClass('active-label');
      }
    });
  });
})(jQuery);
