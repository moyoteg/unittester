// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  
  $.get('/inputs', function(inputs) {
    inputs.forEach(function(input) {
      $('<li></li>').text(input).appendTo('ul#inputs');
    });
  });

  $('form').submit(function(event) {
    event.preventDefault();
    var input = $('input').val();
    $.post('/input?' + $.param({dream: input}), function() {
      $('<li></li>').text(input).appendTo('ul#inputs');
      $('input').val('');
      $('input').focus();
    });
  });

});
