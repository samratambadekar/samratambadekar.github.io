$(document).ready(() => {
  $("body").on("click", ".save-animation .rd-button", function(evt) {
    evt.stopPropagation();

    $(this).blur();
    $(this).addClass("rd-button-is-loading");
    setTimeout(() => {
      $(this).find(".checkmark").removeClass("hide-checkmark");
      $(this).removeClass("rd-button-is-loading").addClass("hide-text");
    }, 2000);
    setTimeout(() => {
      $(this).find(".checkmark").addClass("hide-checkmark");
    }, 3900);
    setTimeout(() => {
      $(this).removeClass("hide-text");
      $(this).removeClass("rd-button-is-loading");
    }, 4000);
  });

  $("body").on("click", ".rd-button.disabled", function(evt) {
    evt.stopPropagation();
    $(this).removeClass("shake-animation");
    $(this).addClass("shake-animation");

    setTimeout(() => {
      $(this).removeClass("shake-animation");
    }, 1000);
  });

  $("body").on("mousedown", ".rd-button", function(evt) {
    if($(this).find(".loader").length <= 0 &&
      !$(this).hasClass("disabled") &&
      (evt.which === 3 || evt.keyCode === 3)) {
      evt.target.oncontextmenu = () => {evt.preventDefault();return false;};
      $(this).toggleClass("highlighted");
    }
  });
});
