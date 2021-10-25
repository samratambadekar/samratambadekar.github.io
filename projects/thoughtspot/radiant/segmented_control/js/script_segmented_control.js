$(document).ready(function() {
  $("body").on("click", ".segmented_control_item", function(evt) {
    $(this).closest(".segmented_control").find(".segmented_control_item").removeClass("selected");
    $(this).addClass("selected");
  });

  $("body").on("click", ".section4 .segmented_control_item", function(evt) {
    let targetEl = $(this).closest(".segmented_control").find(".selected_highlight");
    targetEl.css({
      width: $(this).outerWidth(),
      transform: `translateX(${$(this).position().left - 2}px)`
    });
  });

  setTimeout(() => {
    $(".segmented_control_item.selected").click();
  }, 10);
});
