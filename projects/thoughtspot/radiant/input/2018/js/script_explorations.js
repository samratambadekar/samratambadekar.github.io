
$("body").on("click", ".rd-button", function(evt) {
  evt.stopPropagation();
  // $(this).blur();

  if(($(this).closest(".exploration5").length <= 0 && $(this).closest(".exploration6").length <= 0 && $(this).closest(".exploration7").length <= 0) || !$(this).hasClass("rd-button-primary")) {
    $(this).removeClass("rd-button-sync");
  }

  if($(this).closest(".exploration5").length > 0) {
    $(this).blur();
    setTimeout(() => {
      $(this).find(".checkmark").removeClass("hide-checkmark");
      $(this).removeClass("rd-button-sync").addClass("hide-text");
    }, 3000);
    setTimeout(() => {
      $(this).find(".checkmark").addClass("hide-checkmark");
    }, 4900);
    setTimeout(() => {
      $(this).removeClass("hide-text");
    }, 5000);
  }

  if($(this).find(".bk-loading-spinner").length > 0 &&
    ($(this).closest(".exploration6").length > 0 || $(this).closest(".exploration7").length > 0)) {
    $(this).blur();
    setTimeout(() => {
      $(this).find(".bk-loading-spinner").addClass("hide-checkmark");
      $(this).find(".checkmark").removeClass("hide-checkmark");
      $(this).addClass("hide-text").removeClass("rd-button-sync");
    }, 3000);
    setTimeout(() => {
      $(this).find(".checkmark").addClass("hide-checkmark");
    }, 4900);
    setTimeout(() => {
      $(this).removeClass("hide-text");
      $(this).find(".bk-loading-spinner").removeClass("hide-checkmark");
    }, 5000);
  }
});
$("body").on("click", ".rd-button", function(evt) {
  evt.stopPropagation();
  // evt.preventDefault();

  $(this).addClass("ripple");
  setTimeout(() => {
    $(this).removeClass("ripple");
  }, 500);
});

$("body").on("click", ".rd-button.disabled", function(evt) {
  evt.stopPropagation();
  $(this).removeClass("shake-animation");
  $(this).addClass("shake-animation");

  setTimeout(() => {
    $(this).removeClass("shake-animation");
  }, 1000);
});
