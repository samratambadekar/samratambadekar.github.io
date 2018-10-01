$(document).ready(function() {
  $("body").on("click", ".modal_close, .btn-cancel", function(evt) {
    // evt.stopPropagation();
    $(".ds-modal-background").addClass("invisible");
    // $(".modal-guided-forms").toggleClass("hide_modal");
    $(this).closest(".modal").addClass("hide_modal");
    
    $(".ndse_home").removeClass("invisible");
  });
});
