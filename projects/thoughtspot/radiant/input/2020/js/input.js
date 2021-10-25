$(document).ready(() => {
  $("body").on("focus", ".rd-input", function(evt) {
    $(this).closest(".input-container").addClass("is-editing");
  });
  $("body").on("blur", ".rd-input", function(evt) {
    $(this).closest(".input-container").removeClass("is-editing");
  });

  $("body").on("focus", ".rd-textarea", function(evt) {
    $(this).closest(".textarea-container").addClass("is-editing");
  });
  $("body").on("blur", ".rd-textarea", function(evt) {
    $(this).closest(".textarea-container").removeClass("is-editing");
  });
});
