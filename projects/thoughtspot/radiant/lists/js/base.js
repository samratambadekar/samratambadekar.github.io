$(document).ready(function() {
  $("body").on("click", function(evt) {
    $(".bk-select-body").removeClass("bk-dropdown-visible");
    // $(".search_results_list_item").removeClass("selected");
  });

  $("body").on("click", ".open_close", function(evt) {
    $(this).closest(".side_panel").toggleClass("closed");
  });

  $(".left_panel").resizable({
     handleSelector: ".splitter1",
     resizeHeight: false,
     resizeWidthFrom: 'right',
     onDragEnd: function (e, $el, opt) {
      // $el.attr("data-width", `${$el.width() + 1}px`);
      // if(parseInt($el[0].style.width) < 200) {
      if(parseInt($el[0].style.width) < (parseInt($el.css("min-width")) - 100)) {
        $el.addClass("closed");
      } else if(parseInt($el[0].style.width) > 50) {
        $el.removeClass("closed");
      }
    }
   });
  $(".right_panel").resizable({
     handleSelector: ".splitter2",
     resizeHeight: false,
     resizeWidthFrom: 'left',
     onDragEnd: function (e, $el, opt) {
      // $el.attr("data-width", `${$el.width() + 1}px`);
      // if(parseInt($el[0].style.width) < 200) {
      if(parseInt($el[0].style.width) < (parseInt($el.css("min-width")) - 100)) {
        $el.addClass("closed");
      } else if(parseInt($el[0].style.width) > 50) {
        $el.removeClass("closed");
      }
    }
   });

   $("body").on("click", ".toggle_element", function(evt) {
     $(this).find(".bk-toggle-switch").toggleClass("active");

     // checkToggleFunction($(this).find(".bk-toggle-switch"));
   });


  $("body").on("click", ".show_modal", function(evt) {
    $(".modal_v2_background").removeClass("hide fade_out").addClass("fade_in");
  });
  $("body").on("click", ".modal_v2_background", function(evt) {
    if($(evt.target).closest(".modal_v2").length <= 0 || $(evt.target).closest(".close_modal").length > 0) {
      $(this).removeClass("fade_in").addClass("fade_out");
      setTimeout(() => {
        $(this).addClass("hide");
      }, 500);
    }
  });

  // $("body").on("click", ".modal_size", function(evt) {
  //   $(".modal_v2").removeClass("small medium large xlarge");
  //   if($(this).hasClass("small")) {
  //     $(".modal_v2").addClass("small");
  //   } else if($(this).hasClass("medium")) {
  //     $(".modal_v2").addClass("medium");
  //   } else if($(this).hasClass("large")) {
  //     $(".modal_v2").addClass("large");
  //   } else if($(this).hasClass("xlarge")) {
  //     $(".modal_v2").addClass("xlarge");
  //   }
  // });

  $("body").on("click", ".rd-segmented-control-item", function(evt) {
    let parentEl = $(this).closest(".rd-segmented-control");
    let highlightEl = parentEl.find(".selected-highlight");

    parentEl.find(".rd-segmented-control-item").removeClass("selected");
    $(this).addClass("selected");
    highlightEl.css({
      transform: `translateX(${$(this).position().left}px)`,
      width: `${$(this).innerWidth() - 4}px`
    });
  });

  $("body").on("click", ".select-box .dropdown_head, .menu_button .dropdown_head", function(evt) {
    evt.stopPropagation()
    $(this).closest(".select-box, .menu_button").find(".bk-select-body").toggleClass("bk-dropdown-visible");
  });
  $("body").on("click", ".select-box .bk-dropdown-item", function(evt) {
    if(!!$(this).find(".bk-dropdown-text") && $(this).find(".bk-dropdown-text").text().trim().length > 0) {
      $(this).closest(".select-box").find(".facet_button_text, .dropdown_head_value").text($(this).find(".bk-dropdown-text").text().trim());
    }
  });
});
