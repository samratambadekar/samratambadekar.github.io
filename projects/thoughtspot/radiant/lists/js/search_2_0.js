$(document).ready(function() {
  $(".main_page, .side_panel .inner_container").overlayScrollbars({
    sizeAutoCapable: false,
    scrollbars: {
      autoHide: 'leave',
      autoHideDelay: 300
    }
  });

  $("body").on("click", function(evt) {
    // $(".main_input").removeClass("show_menu");
  });

  $("body").on("click", ".open_close", function(evt) {
    $(this).closest(".side_panel").toggleClass("closed");
  });

  $("body").on("click", ".carousel_nav_left", function(evt) {
    evt.stopPropagation();
    let newScrollVal = $(this).closest(".card_carousel").find(".card_carousel_inner").scrollLeft() - getScrollDifferential($(this).closest(".card_carousel"), $(this).closest(".card_carousel").find(".card").first().outerWidth());
    $(this).closest(".card_carousel").find(".card_carousel_inner").scrollLeft(newScrollVal);
  });
  $("body").on("click", ".carousel_nav_right", function(evt) {
    evt.stopPropagation();
    let newScrollVal = $(this).closest(".card_carousel").find(".card_carousel_inner").scrollLeft() + getScrollDifferential($(this).closest(".card_carousel"), $(this).closest(".card_carousel").find(".card").first().outerWidth());
    $(this).closest(".card_carousel").find(".card_carousel_inner").scrollLeft(newScrollVal);
  });
  $(".card_carousel_inner").on("scroll", function(evt) {
    let halfWidth = 100;
    $(this).closest(".card_carousel").find(".carousel_nav").removeClass("scale_show");
    if($(this).scrollLeft() > halfWidth) {
      $(this).closest(".card_carousel").find(".carousel_nav_left").addClass("scale_show");
    // } else if((this.scrollWidth - $(this).scrollLeft()) >= $(this).width()) {
    }
    if((this.scrollWidth - $(this).scrollLeft()) > ($(this).width() + halfWidth)) {
      $(this).closest(".card_carousel").find(".carousel_nav_right").addClass("scale_show");
    }
  });

  $("body").on("click keydown", ".table_header_cell", function(evt) {
    // console.log(evt.type);
    if(evt.type === "click" || (evt.type === "keydown" && evt.keyCode === 13)) {
      let initialClick = $(this).find(".rd-icon").hasClass("invisible");
      $(this).closest("thead").find(".rd-icon").addClass("invisible");
      $(this).find(".rd-icon").removeClass("invisible");
      if(!initialClick) {
        $(this).toggleClass("sort_recent");
      }
    }
  });
  $("body").on("click", ".table_row_cell .bk-checkbox", function(evt) {
    evt.stopPropagation();
    // $(this).focus(); //hack

    if($(this).prop("checked")) {
      $(this).closest(".rd_list_item").addClass("selected");
    } else {
      $(this).closest(".rd_list_item").removeClass("selected");
    }

    let parentEl = $(this).closest("table");
    let allChecked = true;
    let noneChecked = true;
    parentEl.find(".table_row_cell .bk-checkbox").each((idx, elem) => {
      if($(elem).prop("checked")) {
        noneChecked = false;
      } else {
        allChecked = false;
      }
    });

    if(!allChecked && !noneChecked) {
      parentEl.find(".table_header_cell .bk-checkbox").prop("checked", false);
      parentEl.find(".table_header_cell .bk-checkbox").prop("indeterminate", true);
      $(".filter_controls").addClass("hide");
      $(".rd_list_bulk_actions").removeClass("hide");
    } else if(allChecked && !noneChecked) {
      parentEl.find(".table_header_cell .bk-checkbox").prop("indeterminate", false);
      parentEl.find(".table_header_cell .bk-checkbox").prop("checked", true);
      $(".filter_controls").addClass("hide");
      $(".rd_list_bulk_actions").removeClass("hide");
    } else if(!allChecked && noneChecked) {
      parentEl.find(".table_header_cell .bk-checkbox").prop("checked", false);
      parentEl.find(".table_header_cell .bk-checkbox").prop("indeterminate", false);
      $(".filter_controls").removeClass("hide");
      $(".rd_list_bulk_actions").addClass("hide");
    }
  });
  $("body").on("click", ".table_header_cell .bk-checkbox", function(evt) {
    let parentEl = $(this).closest("table");

    if($(this).prop("checked")) {
      // parentEl.find(".table_row_cell .bk-checkbox").prop("checked", true);
      parentEl.find(".table_row_cell .bk-checkbox").each((idx, elem) => {
        setTimeout(() => {
          $(elem).prop("checked", true);
          $(elem).closest(".rd_list_item").addClass("selected");
        }, idx * 25);
      });

      $(".filter_controls").addClass("hide");
      $(".rd_list_bulk_actions").removeClass("hide");
    } else {
      // parentEl.find(".table_row_cell .bk-checkbox").prop("checked", false);
      parentEl.find(".table_row_cell .bk-checkbox").each((idx, elem) => {
        setTimeout(() => {
          $(elem).prop("checked", false);
          $(elem).closest(".rd_list_item").removeClass("selected");
        }, idx * 25);
      });

      $(".filter_controls").removeClass("hide");
      $(".rd_list_bulk_actions").addClass("hide");
    }
  });

  $("body").on("click", ".list_pb_ans_control .rd-segmented-control-item", function(evt) {
    $(".pb_ans_table .table_row").removeClass("hide");
    if($(this).hasClass("answers")) {
      $(".pb_ans_table .table_row.is_pinboard").addClass("hide");
    } else if($(this).hasClass("pinboards")) {
      $(".pb_ans_table .table_row.is_answer").addClass("hide");
    }
  });

  $("body").on("click", ".search_results_list_item", function(evt) {
    evt.stopPropagation();
    $(".search_results_list_item").removeClass("selected");
    $(this).addClass("selected");

    $(".right_panel").removeClass("closed");
    $(".right_panel .side_nav_section").addClass("hide");
    $(".right_panel .object_details").removeClass("hide");
    $("[data-object-name]").text($(this).find(".object_name").text().trim());
    $("[data-object-description]").text($(this).find(".object_description").attr("data-details-text"));

    $(".object_details .tokens_group").addClass("hide");
    $(".object_details .tokens_group .tokens").empty();

    $(".object_details .tweak_answer_info_section").addClass("hide");
    if($(this).hasClass("is_answer")) {
      $(".object_details .tweak_answer_info_section").removeClass("hide");
    }

    if($(this).find(".object_token:not(.show_more_tokens)").length > 0) {
      $(this).find(".object_token:not(.show_more_tokens)").each((idx, elem) => {
        if($(elem).hasClass("measure")) {
          $(".object_details .tokens_group_measures").removeClass("hide");
          $(".object_details .tokens_group_measures .tokens").append(`<span class="token measure">${$(elem).text().trim()}</span>`);
        } else if($(elem).hasClass("attribute")) {
          $(".object_details .tokens_group_attributes").removeClass("hide");
          $(".object_details .tokens_group_attributes .tokens").append(`<span class="token attribute">${$(elem).text().trim()}</span>`);
        } else if($(elem).hasClass("filter")) {
          $(".object_details .tokens_group_filters").removeClass("hide");
          $(".object_details .tokens_group_filters .tokens").append(`<span class="token filter">${$(elem).text().trim()}</span>`);
        }
      });
    }

    $(".object_description_text").each((idx, elem) => {
      $(elem).removeClass("show_all_text");

      if(elem.scrollHeight > 250) {
        $(elem).closest(".object_description").find(".button_show_more").removeClass("hide");
      } else {
        $(elem).closest(".object_description").find(".button_show_more").addClass("hide");
      }
      // button_show_more
    });
  });

  $("body").on("keydown", ".splitter", function(evt) {
    if(evt.keyCode === 37 || evt.which === 37 || evt.keyCode === 39 || evt.which === 39) {
      let parentEl = $(this).closest(".side_panel");
      let newWidth = parentEl.width();

      if(evt.keyCode === 37 || evt.which === 37) {
        // left
        if($(this).closest(".side_panel").hasClass("left_panel")) {
          newWidth -= 50;
        } else {
          newWidth += 50;
        }
      }
      if(evt.keyCode === 39 || evt.which === 39) {
        // right
        if($(this).closest(".side_panel").hasClass("right_panel")) {
          newWidth -= 50;
        } else {
          newWidth += 50;
        }
      }

      parentEl.width(newWidth);
    }
  });

  $("body").on("dblclick", ".main_input", function(evt) {
    evt.stopPropagation();
  });
  $("body").on("keypress", ".main_input .input_text", function(evt) {
    if(evt.keyCode === 13 || evt.which === 13) {
      router("search");
    }
  });
  $("body").on("input change click focus", ".main_input .input_text", function(evt) {
    evt.stopPropagation();
    let parentEl = $(this).closest(".main_input");
    // parentEl.addClass("show_menu");

    filterMainInputMenu(parentEl, this);

    parentEl.find(".input_placeholder").text(parentEl.find(".main_input_menu_item:visible .item_text").first().text().trim());


    if(evt.type === "change") {
      $("[data-search-string]").text($(this).val().trim());

      // if($(this).val().trim().length === 0) {
      //   $(".search_results_list").addClass("hide");
      // }
    }
  });
  $("body").on("click keydown", ".main_input .main_input_menu_item", function(evt) {
    if(evt.keyCode === 8 || evt.which === 8) {
      evt.preventDefault();
      $(".main_input .input_text").focus();
    }
    if(evt.type === "click" || evt.keyCode === 13 || evt.which === 13) {
      $(this).closest(".main_input").find(".input_text").val($(this).find(".item_text").text().trim()).change().focus().blur();
      router("search");
    }
  });
  $("body").on("focus", ".main_input .main_input_menu_item", function(evt) {
    if($(this).closest(".main_input").find(".input_text").val().trim().length === 0) {
      $(this).closest(".main_input").find(".input_placeholder").text($(this).find(".item_text").text().trim());
    }
  });

  $("body").on("click", ".go_home", function(evt) {
    router("home");
  });
  $("body").on("click", ".go_search", function(evt) {
    $(".main_input .input_text").val("");
    router("search");
  });

  $("body").on("click", ".datasource_dropdown .bk-dropdown-item", function(evt) {
    $("[data-datasource]").text($(this).text().trim());
  });

  $("body").on("click", ".bk-dropdown-item.show_more_elements", function(evt) {
    evt.stopPropagation();
    $(this).find(".button_show_more").addClass("is_loading");
    setTimeout(() => {
      let addMoreArray = ["Administrator", "Scott Eyler", "Dave Holden", "Administrator", "Scott Eyler", "Dave Holden Dave Holden Dave Holden Dave Holden Dave Holden Dave Holden Dave Holden"];

      // let prevClones = $(this).closest(".bk-dropdown-item-container").prevUntil(".prev_until_stop").clone();
      // console.log($(this).closest(".bk-dropdown-item-container").prevAll(".bk-dropdown-item-container"));
      addMoreArray.forEach((elem) => {
        $(this).closest(".bk-dropdown-item-container").before(`
          <div class="bk-dropdown-item-container" >
            <div class="bk-dropdown-item " tabindex="0">
              <div class="bk-dropdown-item-info">
                <div class="bk-dropdown-text">
                  ${elem}
                </div>
              </div>
            </div>
          </div>
        `);
      });
      // $(this).closest(".bk-dropdown-item-container").before(Array.prototype.reverse.call(prevClones));

      $(this).closest(".bk-select-body").scrollTop($(this).closest(".bk-action-menu").outerHeight());

      $(this).find(".button_show_more").removeClass("is_loading");
    }, 1500);
  });

  $("body").on("click", ".tweak_button", function(evt) {
    router("tweak_answer")
  });

  $("body").on("click", ".toggle_element", function(evt) {
   checkToggleFunction($(this).find(".bk-toggle-switch"));
  });

  $("body").on("dblclick", ".toggle_stick", function(evt) {
    $(this).toggleClass("is_sticky");
  });

  $("body").on("click", ".object_description .button_show_more", function(evt) {
    $(this).closest(".object_description").find(".object_description_text").toggleClass("show_all_text");
    // $(this).closest(".object_description").toggleClass("show_all_text");

    if($(this).closest(".object_description").find(".object_description_text").hasClass("show_all_text")) {
    // if($(this).closest(".object_description").hasClass("show_all_text")) {
      $(this).find(".rd-button-text").text("Show less");
    } else {
      $(this).find(".rd-button-text").text("Show more");
    }
  });

  $("body").on("dblclick", ".pagination", function(evt) {
    if($(evt.target).hasClass("pagination")) {
      if($(this).hasClass("type_a")) {
        $(this).removeClass("type_a");
        $(this).addClass("type_b");
      } else if($(this).hasClass("type_b")) {
        $(this).removeClass("type_b");
        $(this).addClass("type_c");
      } else if($(this).hasClass("type_c")) {
        $(this).removeClass("type_c");
        $(this).addClass("type_d");
      } else if($(this).hasClass("type_d")) {
        $(this).removeClass("type_d");
        $(this).addClass("type_a");
      }
      // $(this).toggleClass("type_a type_c");
      $(".pagination_page_numbers .pagination_page_number.selected").click();


      if(!$(this).hasClass("type_a") && !$(this).hasClass("type_b") &&
         !$(this).hasClass("type_c") && !$(this).hasClass("type_d")) {
           $(this).addClass("type_a");
           // console.log("here too");
       }
     }
  });
  $("body").on("click", ".pagination .button_left", function(evt) {
    if($(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number.selected").prev().length > 0) {
      let newScrollVal = $(this).closest(".pagination").find(".pagination_page_numbers").scrollLeft() -
                         $(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number").first().outerWidth(true);

      if($(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number.selected").index() <
        ($(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number").length - 3)) {
        $(this).closest(".pagination").find(".pagination_page_numbers").scrollLeft(newScrollVal);
      }
      $(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number.selected").removeClass("selected").prev  ().addClass("selected");
      $(this).closest(".pagination").find(".button_right").removeClass("disabled");

      if($(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number").first().hasClass("selected")) {
        $(this).addClass("disabled");
      }

      $(".current_page_number").text($(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number.selected").index() + 1);
    }

    if($(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number.selected").length === 0) {
      $(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number").first().addClass("selected");
      $(this).addClass("disabled");
      $(".current_page_number").text(1);
    }
  });
  $("body").on("click", ".pagination .button_right", function(evt) {
    if($(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number.selected").next().length > 0) {
      let newScrollVal = $(this).closest(".pagination").find(".pagination_page_numbers").scrollLeft() +
                         $(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number").first().outerWidth(true);

      if($(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number.selected").index() > 2) {
        $(this).closest(".pagination").find(".pagination_page_numbers").scrollLeft(newScrollVal);
      }
      $(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number.selected").removeClass("selected").next().addClass("selected");
      $(this).closest(".pagination").find(".button_left").removeClass("disabled");

      if($(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number").last().hasClass("selected")) {
        $(this).addClass("disabled");
      }

      $(".current_page_number").text($(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number.selected").index() + 1);
    }

    if($(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number.selected").length === 0) {
      $(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number").first().addClass("selected");
      $(".current_page_number").text(1);
    }
  });
  $("body").on("click", ".pagination .pagination_page_numbers .pagination_page_number", function(evt) {
    let totalCount = $(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number").length;
    let newScrollVal = $(this).outerWidth(true) * ($(this).index() - 3);

    $(".current_page_number").text($(this).index() + 1);

    if($(this).index() <= 3) {
      $(this).closest(".pagination").find(".pagination_page_numbers").scrollLeft(0);
    } else if($(this).index() >= (totalCount - 3)) {
      $(this).closest(".pagination").find(".pagination_page_numbers").scrollLeft(
        $(this).outerWidth() * totalCount
      );
    } else {
      $(this).closest(".pagination").find(".pagination_page_numbers").scrollLeft(newScrollVal);
    }
    $(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number").removeClass("selected");
    $(this).addClass("selected");

    $(this).closest(".pagination").find(".button_left, .button_right").removeClass("disabled");
    if($(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number").last().hasClass("selected")) {
      $(this).closest(".pagination").find(".button_right").addClass("disabled");
    } else if($(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number").first().hasClass("selected")) {
      $(this).closest(".pagination").find(".button_left").addClass("disabled");
    }
  });
  $("body").on("click", ".pagination .pagination_start", function(evt) {
    $(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number").first().click();
  });
  $("body").on("click", ".pagination .pagination_end", function(evt) {
    $(this).closest(".pagination").find(".pagination_page_numbers .pagination_page_number").last().click();
  });



  $("body").on("click", ".table_object_name", function(evt) {
    evt.stopPropagation();
  });
  $("body").on("click", ".default_check_checkbox", function(evt) {
    if($(evt.target).hasClass("table_row_cell")) {
      $(this).find(".bk-checkbox").click();
    }
  });
  $("body").on("click", ".default_show_right_panel", function(evt) {
    console.log(evt.target);
    if($(evt.target).hasClass("table_row_cell")) {
      // $(this).find(".bk-checkbox").click();
      $(".right_panel").removeClass("closed");
      $(".right_panel .side_nav_empty").removeClass("hide");
    }
  });
  $("body").on("click", ".default_open_new_page", function(evt) {
    if($(evt.target).hasClass("table_row_cell")) {
      // $(this).find(".table_object_name").click();
      location.href = $(this).find(".table_object_name").attr("href");
      // window.open(
      //   $(this).find(".table_object_name").attr("href"),
      //   '_blank'
      // );
    }
  });

  init();
});

function init() {
  // router("home");

  $(".card_carousel_inner").scroll();
  // $(".card_carousel_inner").scrollLeft(0);
  $(".card_carousel .headline_card").each((idx, elem) => {
    setTimeout(() => {
      $(elem).removeClass("load_card");
    }, idx * 150);
  });

  initSegmentedControls();
  // $(".list_pb_ans_control .rd-segmented-control-item.all").click();

  $(".right_panel .side_nav_section").addClass("hide");
  $(".right_panel .news_feed").removeClass("hide");
  $(".main_input .input_text").val("");

  $(".pagination .total_page_count").text($(".pagination .pagination_page_numbers .pagination_page_number").length);
  $(".pagination_page_numbers").scrollLeft(0);

}

function initSegmentedControls() {
  $(".rd-segmented-control .rd-segmented-control-item:first-child").click();
}

function getScrollDifferential(parentEl, cardWidth) {
  // let differentialVal = 200;
  // if(parentEl.width() > 1280)
  return cardWidth * parseInt(parentEl.width() / cardWidth);
}

function router(page = "home") {
  // $(".left_panel, .right_panel").removeClass("hide");
  $(".right_panel").removeClass("hide");
  $(".hero_section").removeClass("hide");
  $(".list_view").removeClass("hide");
  $(".list_view_controls").removeClass("hide");

  $(".hero_message_line, .headlines_section").addClass("hide");
  $(".list_view_controls_right .rd-segmented-control, .list_view_controls_right .sort_by_selector").addClass("hide");
  $(".pb_ans_table, .search_results_list, .answer_preview").addClass("hide");
  $(".right_panel .side_nav_section").addClass("hide");
  // $(".right_panel").removeClass("closed");
  $(".right_panel").width(200);

  if(page === "home") {
    $(".hero_welcome_message").removeClass("hide");
    $(".hero_login_timestamp").removeClass("hide");
    $(".headlines_section").removeClass("hide");
    $(".list_view_controls_right .rd-segmented-control").removeClass("hide");
    $(".pb_ans_table").removeClass("hide");
    $(".right_panel .news_feed").removeClass("hide");
  } else if(page === "search") {
    if($(".main_input .input_text").val().trim().length > 0) {
      $(".hero_results_message").removeClass("hide");
      $(".hero_results_count").removeClass("hide");
      $(".search_results_list").removeClass("hide");
      $(".list_view_controls_right .sort_by_selector").removeClass("hide");
      $(".right_panel .side_nav_empty").removeClass("hide");
      $(".card_carousel_inner").scroll();
    } else {
      $(".hero_section").addClass("hide");
      $(".list_view_controls").addClass("hide");
      $(".right_panel .side_nav_empty").removeClass("hide");
      // $(".right_panel").addClass("closed");
    }
  } else if(page === "tweak_answer") {
    $(".left_panel").addClass("hide");
    $(".hero_section").addClass("hide");
    $(".list_view").addClass("hide");
    $(".answer_preview").removeClass("hide");
    $(".right_panel").width(350);

    setTimeout(() => {
      $(".right_panel .tweak_answer_guidance").removeClass("hide");
      initSegmentedControls();
      loadTweakSteps();
    }, 500);
  }


}

function filterMainInputMenu(parentEl, _this) {
  parentEl.find(".main_input_menu_item").addClass("hide");
  parentEl.find(".main_input_menu_item .item_text").each((idx, elem) => {
    if($(elem).text().trim().indexOf($(_this).val().trim()) === 0) {
      $(elem).closest(".main_input_menu_item").removeClass("hide");
    }
  });
}

function loadTweakSteps() {
  $(".tweak_answer_guidance .guidance_section_step").removeClass("has_next_step");

  $(".tweak_answer_guidance .guidance_section_step").each((idx, elem) => {
    setTimeout(() => {
      $(elem).find(".number").text(idx+1);
      $(elem).removeClass("hide");
      if($(elem).next(".guidance_section_step").length > 0) {
        $(elem).addClass("has_next_step");
      }
    }, (idx+1) * 100);
  });
}


function checkToggleFunction(targetEl) {
 if(targetEl.hasClass("toggle_sticky_headers")) {
   if(targetEl.hasClass("active")) {
     $(".main_page").addClass("sticky_elements");
   } else {
     $(".main_page").removeClass("sticky_elements");
   }
 }
}
