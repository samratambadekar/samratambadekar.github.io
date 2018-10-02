$(document).ready(function() {
  $("body").on("click", ".modal_close, .btn-cancel, .new_guided_modal", function(evt) {
    // evt.stopPropagation();
    $(".ds-modal-background").addClass("invisible");
    // $(".modal-guided-forms").toggleClass("hide_modal");
    $(this).closest(".modal").addClass("hide_modal");
  });
  $("body").on("click", ".new_guided_modal", function(evt) {
    // evt.stopPropagation();
    $(".ds-modal-background").removeClass("invisible");
    $(".modal-guided-forms").removeClass("hide_modal");
  });
});
