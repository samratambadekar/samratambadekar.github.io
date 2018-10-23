var toast_msg_timer;
$("body").on("click", ".feature_unavailable", function(evt) {
  evt.preventDefault();
  evt.stopPropagation();
  showToastMessageOlive($(".message-error"), "Feature is not available in prototype", isPersistent=false);
});
$(".global-notifications").on("click", ".message_close", function(evt) {
  evt.preventDefault();
  hideToastMessageOlive($(this).closest(".message"));
});

function showToastMessageOlive(messageTargetType, messageText, isPersistent) {
  $(".global-notifications").removeClass("invisible");
  messageTargetType.find(".message_content").text(messageText);
  messageTargetType.addClass("show");
  // console.log(!isPersistent);
  if(!isPersistent) {
    window.clearTimeout(toast_msg_timer);
    toast_msg_timer = window.setTimeout(function() {
      $(".global-notifications").addClass("invisible");
      $(".global-notifications .message").removeClass("show");
    }, 3000);
  }
}

function hideToastMessageOlive(messageTarget) {
  messageTarget.removeClass("show");
}
