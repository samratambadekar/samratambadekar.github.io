$(document).ready(function() {
  $("body").on("click", ".primary-nav-item", function(evt) {
    $(this).closest(".primary-nav-items").find(".primary-nav-item").removeClass("selected");
    $(this).addClass("selected");

    $(".section-nav-tab").addClass("hide");
    $(`.section-nav-tab[data-nav-id='${$(this).attr("data-nav-id")}']`).removeClass("hide");

  });

  $("body").on("click", ".toggle_element", function(evt) {
    console.log("asjn");
     $(this).find(".bk-toggle-switch").toggleClass("active");

     checkToggleFunction($(this).find(".bk-toggle-switch"));
  });

  $("body").on("mouseover", ".enable_annotation .typography", function(evt) {
    if(!!$(this).attr("data-typography-type") && $(this).attr("data-typography-type").length > 0) {
      $(this).addClass("pulsate");
      $(".tooltip .tooltip-content").text(typographyObject[$(this).attr("data-typography-type")]);
      setTimeout(() => {
        $(".tooltip").css({
          // left: evt.pageX>$(".tooltip").outerWidth()/2 ? evt.pageX : evt.pageX+$(".tooltip").width()/2,
          bottom: $(window).height() - evt.pageY + 30 > 20 ? $(window).height() - evt.pageY + 30 : 0,
          left: $(evt.target).offset().left + $(".tooltip").width()/2,
          // bottom: $(window).height() - $(evt.target).offset().top + 10 > 20 ? $(window).height() - $(evt.target).offset().top + 10 : 0
          // top: $(evt.target).offset().top - $(".tooltip").outerHeight() - 20 >= 0 ? $(evt.target).offset().top - $(".tooltip").outerHeight() - 20 : 0
        });
        $(".tooltip").addClass("show");
      }, 50);
    }
  });
  $("body").on("mouseout", ".enable_annotation .typography", function(evt) {
    $(".tooltip").removeClass("show");
    // $(this).removeClass("pulsate");
  });

  $("body").on("focus", ".bk-input-field", function(evt) {
    $(this).closest(".bk-input").addClass("is-editing");
  });
  $("body").on("blur", ".bk-input-field", function(evt) {
    $(this).closest(".bk-input").removeClass("is-editing");
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

  $("body").on("click", ".font_weight", function(evt) {
    $(".section:not(.dont_toggle)").removeClass("typography-bold-regular typography-medium-regular");

    if($(this).hasClass("bold")) {
      $(".section:not(.dont_toggle)").addClass("typography-bold-regular");
    } else if($(this).hasClass("medium")) {
      $(".section:not(.dont_toggle)").addClass("typography-medium-regular");
    }
  });


  // console.log(typographyObject["typography-h1"]);
  $(".section-list").load("list.html");
  $(".section-answer").load("answer.html");
  $(".section-pinboard").load("pinboard.html");

  // setTimeout(() => {
  //   $(".section").each(function() {
  //     if($(this).find(".font_weight_control").length <= 0) {
  //       $(this).prepend(`<div class="rd-segmented-control font_weight_control">
  //         <a class="rd-segmented-control-item font_weight bold">
  //           <span class="inner-text">Bold</span>
  //         </a>
  //         <a class="rd-segmented-control-item font_weight medium selected">
  //           <span class="inner-text">Medium</span>
  //         </a>
  //         <div class="selected-highlight"></div>
  //       </div>`);
  //     }
  //   }, 5000);
  // });

  initTypography();
});

let typographyObject = {
  "typography-h1": "Large Title, Plain-Medium 36/44",
  "typography-h2": "Page Headline, Plain-Medium 24/32",
  "typography-h3": "Modal Headline, Plain-Medium 20/28",
  "typography-h4": "Section Headline, Plain-Medium 18/24",
  "typography-h5": "Content Header, Plain-Medium 16/24",
  "typography-h6": "Content Subhead, Plain-Medium 14/20",
  "typography-large": "Large Plain-Regular, 16/24",
  "typography-normal": "Normal Plain-Regular, 14/20",
  "typography-footnote": "Plain-Regular 400, 12/18"
}


function initTypography() {
  setTimeout(() => {
    $(".font_weight_control .rd-segmented-control-item.medium").click();
  }, 300);
}

function checkToggleFunction(targetEl) {
  if(targetEl.hasClass("toggle_typography_elements")) {
    if(targetEl.hasClass("active")) {
      $(".section-hierarchy").addClass("enable_annotation");

      $(".section-hierarchy .typography").each((idx, elem) => {
        setTimeout(() => {
          $(elem).addClass("pulsate");
        }, idx*150);
      });
      // setTimeout(() => {
      //   $(".section-hierarchy .typography").removeClass("pulsate");
      // }, 3000);
    } else {
      $(".section-hierarchy").removeClass("enable_annotation");
      $(".section-hierarchy .typography").removeClass("pulsate");
    }
  }
}
