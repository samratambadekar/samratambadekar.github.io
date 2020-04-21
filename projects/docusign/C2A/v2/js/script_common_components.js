$(document).ready(function() {
  $("body").on("click", ".tab", function() {
    var parentEl = $(this).closest(".tabs-wrap");
    var target = parentEl.next(".tabs-wrap-target");
    parentEl.find(".tab").removeClass("on");
    $(this).addClass("on");

    target.children().addClass("hide");
    target.find("[olive-tab-id=" + $(this).attr("olive-tab-id") + "]").removeClass("hide");
  });

  $("body").on("click", ".tile", function(evt) {
    $(this).closest(".tile-section").find(".tile").removeClass("tile-selected");
    $(this).addClass("tile-selected");
  });

  $("body").on("click", ".btn-trigger", function(evt) {
    evt.stopPropagation();
    $(this).next(".menu").toggleClass("invisible");
  });

  $("body").on("click", ".select-menu .item", function(evt) {
    evt.stopPropagation();
    var parentEl = $(this).closest(".menu");
    parentEl.addClass("invisible").find(".item").removeClass("on");
    $(this).addClass("on");

    parentEl.prev(".btn-trigger").text($(this).text().trim());
  });
});
