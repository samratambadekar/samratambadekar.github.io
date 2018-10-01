$(document).ready(function() {
  $("body").on("click", ".tab", function() {
    var parentEl = $(this).closest(".tabs-wrap");
    var target = parentEl.next(".section");
    parentEl.find(".tab").removeClass("on");
    $(this).addClass("on");

    target.children("div").addClass("hide");
    target.find("[olive-tab-id=" + $(this).attr("olive-tab-id") + "]").removeClass("hide");

  });
});
