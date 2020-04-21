
$(document).ready(function(evt) {
  $("body").on("click", "table .btn-combo .btn-icon.btn-secondary", function(evt) {
    evt.stopPropagation();
    $(this).next(".menu").toggleClass("invisible");
  });

  $("body").on("click", ".tab", function(evt) {
    if($(this).attr("olive-tab-id") == "manage_c2a_list") {
      $(this).closest(".content_wrap").addClass("switch-to-manage-c2a");
    } else if($(this).attr("olive-tab-id") == "manage_envelope_list") {
      $(this).closest(".content_wrap").removeClass("switch-to-manage-c2a");
    }
  });

  setTimeout(function() {
    if($(".ndse_home-manage.show_c2a_callout").length > 0) {
      showCallout(evt, $(".main-nav .item[href='clickwraps.html']"));
    }
  }, 1500);
});
