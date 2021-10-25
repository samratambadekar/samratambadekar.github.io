$(document).ready(function() {

  $("body").on("click", ".open_close", function(evt) {
    $(this).closest(".side_panel").toggleClass("closed");
  });

  $(window).resize(function(evt) {
    $("body").attr("data-width", `Browser width: ${$(this).width()}px`);
  });
  $(window).resize(); // to init on load

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

   $("body").on("click", ".toggle_element", function(evt) {
     $(this).find(".bk-toggle-switch").toggleClass("active");

     checkToggleFunction($(this).find(".bk-toggle-switch"));
   });

   function checkToggleFunction(targetEl) {
     if(targetEl.hasClass("fixed_right_panel")) {
       if(targetEl.hasClass("active")) {
         $(".right_panel").addClass("fixed");
       } else {
         $(".right_panel").removeClass("fixed");
       }
     }

     if(targetEl.hasClass("fixed_left_panel")) {
       if(targetEl.hasClass("active")) {
         $(".left_panel").addClass("fixed");
       } else {
         $(".left_panel").removeClass("fixed");
       }
     }

     if(targetEl.hasClass("grid_max_width")) {
       if(targetEl.hasClass("active")) {
         $(".grid_stripes").addClass("max_width");
       } else {
         $(".grid_stripes").removeClass("max_width");
       }
     }

     if(targetEl.hasClass("grid_card_toggle")) {
       if(!targetEl.hasClass("active")) {
         $(".grid_cards").addClass("hide");
       } else {
         $(".grid_cards").removeClass("hide");
       }
     }
   }

  $("body").on("click", ".show_modal", function(evt) {
    $(".modal_v2_background").removeClass("hide fade_out").addClass("fade_in");

    setTimeout(() => {
      initModalSize();
    }, 550);

  });
  $("body").on("click", ".modal_v2_background", function(evt) {
    if($(evt.target).closest(".modal_v2").length <= 0 || $(evt.target).closest(".close_modal").length > 0) {
      $(this).removeClass("fade_in").addClass("fade_out");
      setTimeout(() => {
        $(this).addClass("hide");
      }, 500);
    }
  });

  $("body").on("click", ".modal_size", function(evt) {
    $(".modal_v2").removeClass("small medium large xlarge");
    if($(this).hasClass("small")) {
      $(".modal_v2").addClass("small");
    } else if($(this).hasClass("medium")) {
      $(".modal_v2").addClass("medium");
    } else if($(this).hasClass("large")) {
      $(".modal_v2").addClass("large");
    } else if($(this).hasClass("xlarge")) {
      $(".modal_v2").addClass("xlarge");
    }
  });

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

  function initModalSize() {
    $(".rd-segmented-control.modal_size_control").each((idx, elem) => {
      if($(elem).find(".rd-segmented-control-item.selected").length <= 0) {
        $(elem).find(".rd-segmented-control-item").first().next().click();
      }
    });
  }

  function initStepperSize() {
    $(".rd-segmented-control.stepper_size_control").each((idx, elem) => {
      if($(elem).find(".rd-segmented-control-item.selected").length <= 0) {
        $(elem).find(".rd-segmented-control-item").first().click();
      }
    });
  }

  function initStepperOrientation() {
    $(".rd-segmented-control.stepper_orientation_control").each((idx, elem) => {
      if($(elem).find(".rd-segmented-control-item.selected").length <= 0) {
        $(elem).find(".rd-segmented-control-item").first().click();
      }
    });
  }


  $("body").on("click", ".show_stepper", function(evt) {
    $(".stepper_background").removeClass("hide fade_out").addClass("fade_in");

    // setTimeout(() => {
      currentStep = 1;
      animateStepNumber(currentStep);
      initStepperSize();
      initStepperOrientation();
    // }, 550);
  });

  $("body").on("click", ".stepper_background", function(evt) {
    if($(evt.target).closest(".stepper_background").length <= 0 || $(evt.target).closest(".stepper_close").length > 0) {
      $(this).removeClass("fade_in").addClass("fade_out");
      setTimeout(() => {
        $(this).addClass("hide");
      }, 500);
    }
    // $(".stepper_background").addClass("hide");
  });
  $("body").on("click", ".stepper_size", function(evt) {
    $(".stepper_page").removeClass("small medium large xlarge");
    $(".stepper_orientation_control").removeClass("hide");
    $(".stepper_buttons").removeClass("hide");
    $(".stepper_buttons_alternate").addClass("hide");

    if($(this).hasClass("small")) {
      $(".stepper_page").addClass("small");
    } else if($(this).hasClass("medium")) {
      $(".stepper_page").addClass("medium");
    } else if($(this).hasClass("large")) {
      $(".stepper_page").addClass("large");
    } else if($(this).hasClass("xlarge")) {
      $(".stepper_orientation.top").click();
      $(".stepper_orientation_control").addClass("hide");
      $(".stepper_buttons").addClass("hide");
      $(".stepper_buttons_alternate").removeClass("hide");
      $(".stepper_page").addClass("xlarge");
    }
  });

  let currentStep = 1;
  $("body").on("click", ".next_step", function(evt) {
    // if(parseInt($(".stepper_current_step").text().trim()) < parseInt($(".stepper_total_steps").text().trim())) {
    if(currentStep < 4) {
      // $(".stepper_current_step").text(parseInt($(".stepper_current_step").text().trim()) + 1);
      currentStep++;
      animateStepNumber(currentStep);
      $(`.stepper_side_step[data-step-num='${currentStep}']`).addClass("selected");

      // let tempStepNum = currentStep;
      // while (tempStepNum > 0) {
      //   $(`.stepper_side_step[data-step-num='${tempStepNum}']`).addClass("selected");
      //   tempStepNum--;
      // }
    }
  });
  $("body").on("click", ".stepper_back", function(evt) {
    // if(parseInt($(".stepper_current_step").text().trim()) > 1) {
    if(currentStep > 1) {
      // $(".stepper_current_step").text(parseInt($(".stepper_current_step").text().trim()) - 1);
      currentStep--;
      animateStepNumber(currentStep);
      $(`.stepper_side_step[data-step-num='${currentStep + 1}']`).removeClass("selected");
    }
  });
  $("body").on("click", ".stepper_side_step", function(evt) {
    currentStep = parseInt($(this).attr("data-step-num"));
    animateStepNumber(currentStep);

    $(`.stepper_side_step`).removeClass("selected");

    let tempStepNum = currentStep;
    while (tempStepNum > 0) {
      $(`.stepper_side_step[data-step-num='${tempStepNum}']`).addClass("selected");
      tempStepNum--;
    }
  });

  function animateStepNumber(step_num) {
    $(`.stepper_side_step[data-step-num='${step_num}']`).addClass("selected");
    $(".stepper_current_step").each(function() {
      $(this).animate({
        scrollTop: $(this).scrollTop() +
          $(this).find(`[data-step-num='${step_num}']`).position().top
      }, 250);
    });
  }

  $("body").on("click", ".stepper_orientation", function(evt) {
    $(".stepper_content").removeClass("animate");
    setTimeout(() => {
      $(".stepper_content").addClass("animate");
    }, 100);

    $(".stepper_background").removeClass("left top right");
    if($(this).hasClass("left")) {
      $(".stepper_background").addClass("left");
    } else if($(this).hasClass("top")) {
      $(".stepper_background").addClass("top");
    } else if($(this).hasClass("right")) {
      $(".stepper_background").addClass("right");
    }
  });

  // $(".grid_row").sortable();
  $(".grid_row").each(function() {
    new Sortable(this, {
      animation: 150,
      group: 'shared',
      // swap: true,
      // multiDrag: true,
      onEnd: function (/**Event*/evt, /**Event*/originalEvent) {
    		// Example: https://jsbin.com/nawahef/edit?js,output
    		// evt.dragged; // dragged HTMLElement
    		// evt.draggedRect; // DOMRect {left, top, right, bottom}
    		// evt.related; // HTMLElement on which have guided
    		// evt.relatedRect; // DOMRect
    		// evt.willInsertAfter; // Boolean that is true if Sortable will insert drag element after target by default
    		// originalEvent.clientY; // mouse position
    		// return false; — for cancel
    		// return -1; — insert before target
    		// return 1; — insert after target

        // console.log(evt.to.offsetWidth);
        // $(evt.to).each((idx, elem) => {
        $(".grid_row").each((idx, elem) => {
          let totalChildWidth = 0;
          $(elem).children().each(function() {
            totalChildWidth += Math.ceil($(this).outerWidth(true));
          });
          console.log(totalChildWidth);
          // console.log(elem.scrollWidth);
          console.log(elem.offsetWidth);
          console.log(totalChildWidth > elem.offsetWidth);

          // if(elem.scrollWidth > elem.offsetWidth) {
          if(totalChildWidth > elem.offsetWidth + 10) {
            $(elem).addClass("error");
            // return false;
          } else {
            $(elem).removeClass("error");
          }
        });
    	}
      // ghostClass: 'blue-background-class'
    });
  });
});
