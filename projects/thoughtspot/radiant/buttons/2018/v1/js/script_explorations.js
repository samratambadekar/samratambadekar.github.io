
$(".exploration2").on("click", ".bk-button", function(evt) {
  evt.stopPropagation();
  // evt.preventDefault();

  $(this).removeClass("bk-button-sync");
  $(this).addClass("ripple");
  setTimeout(() => {
    $(this).removeClass("ripple");
  }, 500);
});


$("body").on("mouseup", ".bk-button", function(evt) {
  $(this).blur();
});
