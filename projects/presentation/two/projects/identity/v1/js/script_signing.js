$(document).ready(function() {
  window.setTimeout(function() {
    $("#progress-indicator").addClass("hide");
    $("#envelope-wrapper").css({"height": $(window).outerHeight()});

    var d = new Date();
    $(".field-date").text(d.toLocaleDateString());

    if($(".field-rb input").length > 0) {
      $(".field-rb input").prop("checked", false);
    }
  }, 2000);

  $("#disclosureAccepted, #disclosureAcceptedMobile").prop("checked", false);

  if($(window).outerWidth() < 769) {
    $("#action-bar-btn-continue").removeClass("disabled");
  } else {
    $("#action-bar-btn-continue").addClass("disabled");
  }

  $("#disclosureAccepted").on("click", function() {
    if($(this).prop("checked")) {
      $("#action-bar-btn-continue").removeClass("disabled");
    } else {
      $("#action-bar-btn-continue").addClass("disabled");
    }
  });
  $("#disclosureAcceptedMobile").on("click", function() {
    if($(this).prop("checked")) {
      $("#mobile-btn-continue").removeClass("disabled");
    } else {
      $("#mobile-btn-continue").addClass("disabled");
    }
  });
  $("#mobile-btn-continue").on("click", function() {
    $("#mobileConsent").addClass("hidden");
    // $("#action-bar-btn-continue").click();
    $("#documentOverlay").addClass("hidden");
    $("#disclosureAccepted, #disclosureAcceptedMobile").prop("checked", true);
  });

  $("#action-bar-btn-continue, #bottom-btn-finish").on("click", function() {
    if(all_completed) {
      $(".modal").removeClass("hidden");
    }
  });

  $("#action-bar-btn-continue").on("click", function() {
    $("#action-bar-consent-control").addClass("hidden");
    $("#action-bar-wrapper .right").css("margin-top", 0);
    $("#mobileConsent").addClass("hidden");

    $("#documentOverlay").addClass("hidden");
    $("#welcome-wrapper").addClass("hidden");
    $("#toolbar-wrapper").removeClass("hide");
    $(".btnOtherActions").parents(".drop-down").removeClass("open");

    $("#autonav").css("left", $(".document_page").offset().left);
    $(".disclosure_pages").css("left", $(".document_page").offset().left);
    $("#action-bar-wrapper").css("top", 0);
    $("#toolbar-wrapper").css("top", $("#action-bar-wrapper").outerHeight());
    $("#envelope-wrapper").css("top", $("#action-bar-wrapper").outerHeight() + $("#toolbar-wrapper").outerHeight());
    $("#envelope-wrapper").css({"height": $(window).outerHeight() - $("#action-bar-wrapper").outerHeight() - $("#footer-wrapper").outerHeight()});
    if($(window).width() > 768) {
      $("#envelope-wrapper").css({"height": $(window).outerHeight() - $("#toolbar-wrapper").outerHeight() - $("#action-bar-wrapper").outerHeight() - $("#footer-wrapper").outerHeight()});
    }

    if(!all_completed) {
      $("#autonav").removeClass("hide");
      $("#action-bar-btn-continue > .desktop").text("Finish");
      $("#action-bar-btn-continue > .mobile").text("Next");
      $(".action-bar-helpful-message.mobile").text("Tap next to continue");
    }

    window.setTimeout(function() {
      // if($(window).width() < 769) {
        $("#action-bar-btn-continue").addClass("autonav");
      // } else {
        // $("#action-bar-btn-continue").removeClass("autonav");
      // }
    }, 0);
  });

  $("body").on("click", "#action-bar-btn-continue.autonav:not(.finish)", function() {
    // $("#autonav").click();
    goToNextTarget();
  });

  $(window).on("resize", function() {
    // if($(window).width() < 769) {
      $("#action-bar-btn-continue").addClass("autonav");
    // } else {
      // $("#action-bar-btn-continue").removeClass("autonav");
    // }

    if($(window).outerWidth() < 769) {
      $("#action-bar-btn-continue").removeClass("disabled");
    } else if(!$("#disclosureAccepted").prop("checked")) {
      $("#action-bar-btn-continue").addClass("disabled");
    }

    $("#autonav").css("left", $(".document_page").offset().left);
    $(".disclosure_pages").css("left", $(".document_page").offset().left);
    $("#toolbar-wrapper").css("top", $("#action-bar-wrapper").outerHeight());
    $("#envelope-wrapper").css("top", $("#action-bar-wrapper").outerHeight() + $("#toolbar-wrapper").outerHeight());
    // $("#envelope-wrapper").css({"height": $(window).outerHeight() - $("#action-bar-wrapper").outerHeight() - $("#toolbar-wrapper").outerHeight() - $("#footer-wrapper").outerHeight()});
    $("#envelope-wrapper").css({"height": $(window).outerHeight() - $("#action-bar-wrapper").outerHeight() - $("#footer-wrapper").outerHeight()});
    if($(window).width() > 768) {
      $("#envelope-wrapper").css({"height": $(window).outerHeight() - $("#toolbar-wrapper").outerHeight() - $("#action-bar-wrapper").outerHeight() - $("#footer-wrapper").outerHeight()});
    }

  });

  $(".toolbar-btn-wrapper").on("mouseenter", function() {
    $(this).find(".tooltip").removeClass("hide");
  });
  $(".toolbar-btn-wrapper").on("mouseleave", function() {
    $(this).find(".tooltip").addClass("hide");
  });

  // var tag_targets = [$("#disclosure1"), $("#disclosure2"), $("#page1"), $("#field-1"), $("#field-2"), $("#disclosure3"), $("#page2"), $("#field-3"), $("#field-4")];
  var tag_targets = [$("#field-2")];
  var tag_target_index = 0;
  var tagsSigned = false,
      disViewed = false;
  var all_completed = false;

  $("body").on("click", "#autonav:not(.finish)", goToNextTarget);

  // function nextIncompleteTarget(tag_target_index) {
  //   var start_val = tag_target_index;
  //   tag_target_index++;
  //
  //   while (start_val != tag_target_index) {
  //     if(tag_targets[tag_target_index].hasClass("completed_action")) {
  //       tag_target_index++;
  //     } else {
  //       console.log(tag_target_index);
  //       break;
  //     }
  //     if(tag_target_index >= tag_targets.length) {
  //       tag_target_index = 0;
  //     }
  //   }
  // }

  function goToNextTarget() {
    var next_target = tag_targets[tag_target_index];
    var next_target_top = 0;
    var scrollTop_pos = 0;

    if(next_target.hasClass("completed_action") || next_target.hasClass("hide")) {
      var start_val = tag_target_index - 1;
      // tag_target_index++;

      while (start_val != tag_target_index && !all_completed) {
        if(tag_targets[tag_target_index].hasClass("completed_action") || tag_targets[tag_target_index].hasClass("hide")) {
          tag_target_index++;
        } else {
          console.log(tag_target_index);
          break;
        }
        if(tag_target_index >= tag_targets.length) {
          tag_target_index = 0;
        }
      }
    }

    next_target_top = parseInt(tag_targets[tag_target_index].offset().top);
    // console.log($("#envelope-wrapper").scrollTop());
    // console.log($(".documents-wrapper").scrollTop());

    // if(next_target_top < parseInt($(window).height()/2)) {
    //   $(this).css("top", next_target_top + 15);
    // } else {
      $("#autonav").css("top", $(window).height()/2);
      if(next_target_top < $(window).height()/2 && next_target_top > 0) {
        // console.log(tag_target_index);
        $("#autonav").css("top", next_target_top);
      }
      if(next_target_top > $(window).height()/2 + 50 && next_target_top < $(window).height()) {
        // $("#autonav").css("top", next_target_top);
      }
      scrollTop_pos = tag_targets[tag_target_index].offset().top + $(".documents-wrapper").scrollTop() - $(window).height()/2;

      $(".documents-wrapper").animate({
	      scrollTop: scrollTop_pos
	    }, 100);

      // $(this).css("top", next_target_top);
      window.setTimeout(function() {
        next_target_top = parseInt(tag_targets[tag_target_index==0?tag_targets.length-1:tag_target_index-1].offset().top);

        if(next_target_top < $(window).height()/2 && next_target_top > 0) {
          // console.log("up " + next_target_top);
          // console.log($("#autonav").position().top);
          $("#autonav").css("top", next_target_top);
        }
        if(next_target_top > $(window).height()/2 + 50 && next_target_top < $(window).height()) {
          // console.log("down" + next_target_top);
          $("#autonav").css("top", next_target_top);
        }
      }, 110);

      // console.log(tag_targets[tag_target_index].position().top / $(window).height() * $(window).height());

      // HARDCODED COZ I COULDN'T DEAL WITH THE LOGIC AT THE MOMENT
      // if(tag_target_index == tag_targets.length) {
        // $(this).css("top", tag_targets[tag_target_index].position().top - $(window).height()/2);
        // $(this).css("top", 470);
      // }

    // $(".field > img").removeClass("blink_field");
    // $(tag_targets[tag_target_index]).find("img").addClass("blink_field");
    $(tag_targets).each(function() {
      $(this).find("img").removeClass("blink_field");
      $(this).removeClass("blink_border blink_field_border");
    });
    setTimeout(function(){
      $(tag_targets[tag_target_index]).hasClass("field")?$(tag_targets[tag_target_index]).find("img:first-child").addClass("blink_field"):$(tag_targets[tag_target_index]).addClass("blink_border");
      $(tag_targets[tag_target_index]).hasClass("field-rb")?$(tag_targets[tag_target_index]).addClass("blink_field_border"):null;
    }, 100);


    if(++tag_target_index >= tag_targets.length) {
      tag_target_index = 0;
    }
  }

  $(".btn_view, .disclosure .title").on("click", function() {
    $(".disclosure_pages").scrollTop(0);
    $(".btnOtherActions").parents(".drop-down").removeClass("open");

    var parent = $(this).closest(".disclosure");
    var target = parent.next("." + parent.attr("id"));
    target.removeClass("hidden");
    // $(".disclosure_doc, .disclosure_doc > .overlay").css("top", 0);
    target.css("top", 0);
    target.find(".overlay").css("top", 0);

    parent.find(".btn_agree").removeClass("disabled");

    scrollTop = $(".documents-wrapper").scrollTop();
    $(".documents-wrapper").addClass("scrollLock");
  });

  var scrollTop = $(".documents-wrapper").scrollTop();

  $(".disclosure_tools .close_disclosure").on("click", function() {
    $(".disclosure_doc, .disclosure_doc > .overlay").css("top", "100%");
    $(".documents-wrapper").removeClass("scrollLock");

    // var mvp = ;
    $("#mobileviewport").attr("content","width=device-width,initial-scale=1.0,maximum-scale=1.0");
    setTimeout(function(){
      $("#mobileviewport").attr("content","width=device-width,initial-scale=1.0,maximum-scale=5.0");

      $("#envelope-wrapper").css({"height": $(window).outerHeight() - $("#action-bar-wrapper").outerHeight() - $("#footer-wrapper").outerHeight()});
      if($(window).width() > 768) {
        $("#envelope-wrapper").css({"height": $(window).outerHeight() - $("#toolbar-wrapper").outerHeight() - $("#action-bar-wrapper").outerHeight() - $("#footer-wrapper").outerHeight()});
      }
    }, 300);

  });


  $(".btn_agree").on("click", function() {
    var targets = $(this).closest(".disclosures").find(".btn_agree");
    targets.removeClass("btn-primary").addClass("btn-secondary").text("Accepted");
    $(".disclosure_tools .close_disclosure").click();

    // $("#action-bar-btn-continue").text("Finish");
    $(this).closest(".disclosures").find(".disclosure_footer").addClass("hidden");
    $(this).closest(".disclosures").addClass("disViewed");

    $(this).closest(".disclosures").find(".disclosure").addClass("completed_action");
  });

  $(".btnOtherActions").on("click", function() {
    $(this).parents(".drop-down").toggleClass("open");
  });

  $("body").on("keypress", function(e) {
    if (e.keyCode == 27 || e.which == 27) {
      $(".disclosure_tools .close_disclosure").click();
    }
  });


  $("#field-1, #field-3").on("click", function() {
    if($(this).find("input").prop("checked")) {
      $(this).next(".field-sign").removeClass("hide");
      $(this).addClass("completed_action");
    } else {
      $(this).next(".field-sign").addClass("hide");
      $(this).removeClass("completed_action");
    }
  });
  $("#field-2, #field-4").on("click", function() {
    // console.log($(this).find("img:first-child").hasClass("hide"));
    if(!$(this).find("img:first-child").hasClass("hide")) {
      $(this).addClass("tagsSigned completed_action");
      $(this).parents(".document_page").addClass("completed_action");
      // $(this).prev(".field-rb").addClass("completed_action");
    } else {
      $(this).removeClass("tagsSigned completed_action");
      $(this).parents(".document_page").removeClass("completed_action");
      // $(this).prev(".field-rb").removeClass("completed_action");
    }

    $(this).find("img").toggleClass("hide");
  });

  $("#field-2, #field-4, .btn_agree").on("click", function() {
    checkComplete();
  });

  function checkComplete() {
    tagsSigned = true;
    disViewed = true;
    $(".field-sign").each(function() {
      if(!$(this).hasClass("tagsSigned")) {
        tagsSigned = false;
      }
    });

    $(".disclosures").each(function() {
      if(!$(this).hasClass("disViewed")) {
        disViewed = false;
      }
    });
    // console.log(tagsSigned);
    // console.log(disViewed);
    if(tagsSigned && disViewed) {
      // $("#action-bar-btn-continue").text("Finish");
    }

    all_completed = true;
    tag_targets.forEach(function(item,idx) {
      if(!$(item).hasClass("completed_action")) {
        all_completed = false;
      }
    });

    if(all_completed) {
      $(".action-bar-helpful-message.mobile").text("Are you finished signing?");
      $("#action-bar-btn-continue > .mobile").text("Finish");
      $("#autonav").addClass("hide");
      $("#autonav, #action-bar-btn-continue").addClass("finish");
      $(".finish_button").removeClass("hidden");
      // $(".documents-wrapper").animate({
	    //   scrollTop: $(window).outerHeight() + 200
	    // }, 300);
    } else {
      $("#autonav").removeClass("hide");
      $(".action-bar-helpful-message.mobile").text("Tap next to continue");
      $("#action-bar-btn-continue > .mobile").text("Next");
      $("#autonav, #action-bar-btn-continue").removeClass("finish");
      $(".finish_button").addClass("hidden");
    }
  }

  $(".mobile-menu").on("click", function() {
    $(this).prev(".other-actions-mobile").toggleClass("hidden");
  });
  $(".modal_header").on("click", function() {
    $(".modal").addClass("hidden");
  });
});
