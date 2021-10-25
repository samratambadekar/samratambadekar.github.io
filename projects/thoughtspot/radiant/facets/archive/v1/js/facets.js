$(document).ready(function() {
  $("body").on("click", function(evt) {
    $(".facet_body").addClass("hide");
  });

  $("body").on("click", ".rd_facet .facet_head", function(evt) {
    evt.stopPropagation()
    $(this).closest(".rd_facet").find(".facet_body").toggleClass("hide");
  });

  $("body").on("click", ".rd_facet .facet_item", function(evt) {
    if(!!$(this).find(".facet_item_value") && $(this).find(".facet_item_value").text().trim().length > 0) {
      $(this).closest(".rd_facet").find(".facet_item").removeClass("selected");
      $(this).addClass("selected");
      $(this).closest(".rd_facet").find(".facet_head_value").text($(this).find(".facet_item_value").text().trim());
    }
  });
  $("body").on("click", ".rd_facet .facet_item.show_more", function(evt) {
    evt.stopPropagation();
    $(this).prevAll(".facet_item").removeClass("hide");
  });
});
