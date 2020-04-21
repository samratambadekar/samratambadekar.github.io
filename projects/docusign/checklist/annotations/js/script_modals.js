$(document).ready(function() {
  $("body").on("click", ".modal_close, .btn-cancel", function(evt) {
    // evt.stopPropagation();
    hideModal($(this).closest(".modal"));
    // $(".ds-modal-background").addClass("invisible");
    // $(this).closest(".modal").addClass("hide_modal");
  });
});

function showModal(targetModal) {
  $(".ds-modal-background").removeClass("invisible");
  targetModal.removeClass("hide_modal");

  // window.setTimeout(function() {
  //   if(targetModal.hasClass("transition_from_above")) {
  //     $("body").find(".modal.hide_modal").removeClass("transition_from_above");
  //   } else {
  //     $("body").find(".modal.hide_modal").addClass("transition_from_above");
  //   }
  // }, 100);
}
function hideModal(targetModal) {
  $(".ds-modal-background").addClass("invisible");
  targetModal.addClass("hide_modal");
  // $("body").find(".modal").removeClass("transition_from_above");
}
