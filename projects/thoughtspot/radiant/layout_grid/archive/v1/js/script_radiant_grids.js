$(document).ready(function() {
  $("body").on("click", ".open_close", function(evt) {
    $(this).closest(".side_panel").toggleClass("closed");
  });

  // $(window).resize(function(evt) {
  //   $(".side_panel").each(function() {
  //     $(this).attr("data-width", $(this).width());
  //   });
  // });

  $(".left_panel").resizable({
     handleSelector: ".splitter1",
     resizeHeight: false,
     resizeWidthFrom: 'right',
     onDrag: function (e, $el, opt) {
        $el.attr("data-width", `${$el.width() + 1}px`);
    }
   });
  $(".right_panel").resizable({
     handleSelector: ".splitter2",
     resizeHeight: false,
     resizeWidthFrom: 'left',
     onDrag: function (e, $el, opt) {
        $el.attr("data-width", `${$el.width() + 1}px`);
    }
   });
});
