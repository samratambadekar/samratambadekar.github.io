var toast_msg_timer;
$("body").on("click", ".feature_unavailable", function(evt) {
  evt.preventDefault();
  $(".msg_feature_unavailable").removeClass("hide");

  window.clearTimeout(toast_msg_timer);
  toast_msg_timer = window.setTimeout(function() {
    $(".msg_feature_unavailable").addClass("hide");
  }, 1100);
});
