var toast_msg_timer;
$("body").on("click", ".feature_unavailable", function(evt) {
  evt.preventDefault();
  evt.stopPropagation();
  showToastMessageOlive($(".msg_feature_unavailable"));
});
$(".global-notifications").on("click", ".message_close", function(evt) {
  evt.preventDefault();
  $(this).closest(".message").removeClass("show");
});

function showToastMessageOlive(messageTargetType, messageText) {
  $(".global-notifications").removeClass("invisible");
  messageTargetType.find(".message_content").text(messageText);
  messageTargetType.addClass("show");

  window.clearTimeout(toast_msg_timer);
  toast_msg_timer = window.setTimeout(function() {
    $(".global-notifications").addClass("invisible");
    $(".global-notifications .message").removeClass("show");
  }, 1800);
}
