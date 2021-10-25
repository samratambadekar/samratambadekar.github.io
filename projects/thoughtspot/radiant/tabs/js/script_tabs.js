$(document).ready(function() {
  $("body").on("click", ".bk-category-tab", function(evt) {
    evt.stopPropagation();
    $(this).closest(".bk-top-menu-filters").find(".bk-category-tab").removeClass("bk-selected");
    $(this).addClass("bk-selected");
  })
});
