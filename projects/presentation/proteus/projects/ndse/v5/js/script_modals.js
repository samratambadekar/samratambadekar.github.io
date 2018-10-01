$(document).ready(function() {
  $("body").on("click", ".modal_close, .btn-cancel", function(evt) {
    // evt.stopPropagation();
    $(".ds-modal-background").addClass("invisible");
    // $(".modal-guided-forms").toggleClass("hide_modal");
    $(this).closest(".modal").addClass("hide_modal");

    // $(".ndse_home").removeClass("invisible");
  });
  $("body").on("click", ".modal_close", function(evt) {
    // evt.stopPropagation();
    $(".ndse_home, .upgrade_banner").removeClass("invisible");
  });
  $(".modal-ndse-intro").on("click", ".modal_close, .show_sample_doc", function(evt) {
    // evt.stopPropagation();
    localStorage.setItem("firstTimeModal", false);
  });
});
