$(document).ready(function(evt) {
  $(".shareC2A").on("click", ".btn-test-connection", function(evt) {
    var _this = this;
    var targetEl = $(this).closest(".test_connection").find(".loading-overlay");
    var targetEl2 = $(this).closest(".test_connection").find(".tc_status");
    targetEl.removeClass("hidden");
    window.setTimeout(function() {
      targetEl.addClass("hidden");

      if(targetEl2.hasClass("active")) {
        targetEl2.removeClass("active").addClass("inactive");
        $(_this).text("Activate");
      } else {
        targetEl2.removeClass("inactive").addClass("active");
        $(_this).text("Deactivate");
      }
    }, 2500);

  });
});
