var toast_msg_timer;
$("body").on("click", ".feature_unavailable", function(evt) {
  evt.preventDefault();
  $(".msg_feature_unavailable").removeClass("hide");

  window.clearTimeout(toast_msg_timer);
  toast_msg_timer = window.setTimeout(function() {
    $(".msg_feature_unavailable").addClass("hide");
  }, 1100);
});

$("body").on("click", ".message .message_close", function(evt) {
  evt.preventDefault();
  hideMessage($(this).closest(".message"));
});

function showMessage(targetEl, message) {
  if(message && message.length > 0) {
    targetEl.find(".message_content").text(message);
  }
  targetEl.removeClass("invisible");
}
function hideMessage(targetEl, isTimed) {
  window.clearTimeout(toast_msg_timer);
  toast_msg_timer = window.setTimeout(function() {
    targetEl.addClass("invisible");
  }, (isTimed?1100:0));
}
