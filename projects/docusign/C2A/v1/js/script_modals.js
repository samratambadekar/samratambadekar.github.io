$(document).ready(function() {
  $("body").on("click", ".modal_close, .btn-cancel", function(evt) {
    // evt.stopPropagation();
    var flagHideModalOnly = false;
    if($(this).hasClass("modal_close_only")) {
      flagHideModalOnly = true;
    }
    hideModal($(this).closest(".modal"), flagHideModalOnly);
    // $(".ds-modal-background").addClass("invisible");
    // $(this).closest(".modal").addClass("hide_modal");
  });
});

function showModal(targetModal, flagHideModalOnly) {
  if(flagHideModalOnly) {
    targetModal.find(".modal_close").addClass("modal_close_only");
  } else {
    targetModal.find(".modal_close").removeClass("modal_close_only");
  }
  $(".ds-modal-background").removeClass("invisible");
  targetModal.removeClass("hide_modal");
}
function hideModal(targetModal, flagHideModalOnly) {
  if(!flagHideModalOnly) {
    $(".ds-modal-background").addClass("invisible");
  }
  targetModal.addClass("hide_modal");
  // $("body").find(".modal").removeClass("transition_from_above");
}
