
$("body").on("click", ".rd-button", function(evt) {
  evt.stopPropagation();

  $(this).removeClass("rd-button-sync");
});
$(".exploration2").on("click", ".rd-button", function(evt) {
  evt.stopPropagation();
  // evt.preventDefault();

  $(this).removeClass("rd-button-sync");
  $(this).addClass("ripple");
  setTimeout(() => {
    $(this).removeClass("ripple");
  }, 500);
});


$("body").on("mouseup", ".rd-button", function(evt) {
  $(this).blur();
});
