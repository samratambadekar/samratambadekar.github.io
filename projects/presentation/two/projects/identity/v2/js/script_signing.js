var autoNavCalloutShown = false;
var autoNavHiddenOnce = true;
var dontHighlightErrors = false;
var signatureAdopted = false;
var signatureAdoptedTarget = null;
var everythingFilled = false;
var numbersPopulated = false;
var trackedTargetEl = null;

// $("#mixPanelOverlay").load("userTesting1.html", function() {
//   $(this).trigger("pagecreate");
// });

$(document).ready(function() {

  var targetPinchEl = $(".documents-wrapper")[0];
  var mc = new Hammer.Manager(targetPinchEl, {
      touchAction: "pan-x pan-y",
    });
  var pinch = new Hammer.Pinch();
  mc.add([pinch]);
  mc.on("pinchin", function(evt) {
    if(evt.scale > 1) {
      $(targetPinchEl).css({"transform": "scale(" + evt.scale + ") translateX(0%)"});
    }
  });
  mc.on("pinchout", function(evt) {
    if(evt.scale < 3) {
      $(targetPinchEl).css({"transform": "scale(" + evt.scale + ") translate(20%)"});
    }
  });



  var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
  };

  window.setTimeout(function() {
    everythingFilled = getUrlParameter("everythingFilled");
    if(everythingFilled) {
      signatureAdopted = true;
      autoNavCalloutShown = true;
      $("#documentOverlay").addClass("hide");
      // $("#mixPanelOverlay").addClass("hide");
      $(".btn-start-signing").first().click();
      $(".prototype_b #modal-btn-continue").click();
      $(".documents-wrapper").scrollTop(0);
      // $(".field").each(function() {
      //   if(!$(this).hasClass("optionalTag") && !$(this).hasClass("other_user_field")) {
      //     $(this).click();
      //   }
      // });
      // $(".field-text input").val("test fill").change();
    }
  }, 100);
  window.setTimeout(function() {
    $("#progress-indicator").addClass("hide");
    // $("#envelope-wrapper").css({"height": $(window).outerHeight()});

    var d = new Date();
    $(".field-date").text(d.toLocaleDateString());

    // if($(".field-rb input").length > 0) {
      $(".field input").prop("checked", false).val("");
    // }

    // $(".document_page").panzoom({
    //   panOnlyWhenZoomed: true
    // });
    alignAutonavToPage();
  }, 10);

  $("#disclosureAccepted, #disclosureAcceptedMobile, #disclosureAcceptedModal").prop("checked", false);
  localStorage.setItem("highlight_errors", false);

  // if($("body").hasClass("prototype_b")) {
  //   dontHighlightErrors = false;
  // }

  // $(".prototype_a #autonav").addClass("pointer");
  $(".prototype_c #autonav").addClass("pointer");
  // if($(window).outerWidth() < 769) {
  //   $("#action-bar-btn-continue").removeClass("disabled");
  // } else {
  //   $("#action-bar-btn-continue").addClass("disabled");
  // }

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
  $("#disclosureAcceptedModal").on("click", function() {
    if($(this).prop("checked")) {
      $(".modal-btn-continue").removeClass("disabled");
    } else {
      $(".modal-btn-continue").addClass("disabled");
    }
  });
  $("body").on("click", "#mobile-btn-continue", function() {
    $("#mobileConsent").addClass("hidden");
    $("#documentOverlay").addClass("hide");
    $("#disclosureAccepted, #disclosureAcceptedMobile", "#disclosureAcceptedModal").prop("checked", true);
    $(".prototype_a .progress-bar-wrap").removeClass("invisible");
    $("#welcome-wrapper .wrapper").addClass("hidden");
  });

  $("#action-bar-btn-continue, #bottom-btn-finish, #action-bar-btn-continue-mobile, #bottom-bar-btn-continue-mobile").on("click", function(evt) {
    if(all_completed) {
      showModal($(".modal-save-copy"));

      // mixpanelUserInformation.totalTimeSpent = String((Date.now() - mixpanelStartTime)/1000);
      // mixpanel.track("End", mixpanelUserInformation);
      // console.log(String((Date.now() - mixpanelStartTime)/1000));
    }
  });
  $("#action-bar-btn-continue, #bottom-btn-finish").on("click", function(evt) {
    if(localStorage.getItem("highlight_errors") == true || localStorage.getItem("highlight_errors") == "true") {
      if($("body").hasClass("prototype_b") && !autoNavCalloutShown) {
        goToFirstReqdTag();
        // showAutonavCallout(evt);
      } else if(!dontHighlightErrors && ($(".autonavHighlight").length != $(".autonavHighlight.completed_action").length)) {
        $(".field.autonavHighlight:not(.completed_action), .disclosure.autonavHighlight:not(.completed_action)").addClass("errorHighlight");
        goToFirstReqdTag();
      }

      if($("body").hasClass("prototype_c")) {
        goToFirstReqdTag();
      }

      dontHighlightErrors = false;

    }
    $("#action-bar-btn-continue").text("Finish");
    $(".prototype_a .progress-bar-wrap").removeClass("invisible");
  });

  function showAutonavCallout(evt) {
    window.setTimeout(function() {
      autoNavCalloutShown = true;
      $(".callout > div").addClass("callout-invisible");
      $(".callout .callout-use-autonav").removeClass("callout-invisible");
      if(($("#autonav").offset().top * 100 / $(window).height()) > 60) {
        $("#autonav").attr("callout-pos", "above left start");
      } else {
        $("#autonav").attr("callout-pos", "below left start");
      }
      showCallout(evt, $("#autonav"));
    }, 1000);
  }

  $("body").on("click", ".btn-start-signing, #modal-btn-continue-mobile", function(evt) {
    if($("body").hasClass("prototype_b") && !numbersPopulated) {
      populateReqdNumbers(tag_count);
      animateReqdNumber(tag_count);
      numbersPopulated = true;
    }
  });
  $("body").on("click", "#mobile-btn-continue, #modal-btn-continue-mobile", function(evt) {
    $(".documents-wrapper").scrollTop(0);
    $("body").scrollTop(0);
  });
  $("body").on("click", ".btn-start-signing", function(evt) {
    $(".action-bar-consent-message").addClass("hidden");
    $("#action-bar-wrapper .right").css("margin-top", 0);
    $("#mobileConsent").addClass("hidden");

    $("#documentOverlay").addClass("hide");
    $("#welcome-wrapper .wrapper").addClass("hidden");
    localStorage.setItem("highlight_errors", true);

    $("#toolbar-wrapper").removeClass("hide");
    $(".btnOtherActions").closest(".drop-down").removeClass("open");

    $("#autonav").css("left", $(".document_page").offset().left);
    $(".disclosure_pages").css("left", $(".document_page").offset().left);
    $("#action-bar-wrapper").css("top", 0);
    // $("#toolbar-wrapper").css("top", $("#action-bar-wrapper").outerHeight());
    // $("#envelope-wrapper").css("top", $("#action-bar-wrapper").outerHeight() + $("#toolbar-wrapper").outerHeight());
    // $("#envelope-wrapper").css({"height": $(window).outerHeight() - $("#action-bar-wrapper").outerHeight() - $("#footer-wrapper").outerHeight()});
    if($(window).width() > 768) {
      // $("#envelope-wrapper").css({"height": $(window).outerHeight() - $("#toolbar-wrapper").outerHeight() - $("#action-bar-wrapper").outerHeight() - $("#footer-wrapper").outerHeight()});
    }

    if(!all_completed) {
      $("#autonav").removeClass("hide");
      if(autoNavHiddenOnce) {
        // $(".prototype_a #autonav").addClass("hide");
        $(".prototype_c #autonav").addClass("hide");
        autoNavHiddenOnce = false;
      }
      // $("#action-bar-btn-continue").text("Finish");
      $(".btn-continue-mobile").text("Next");
      $(".action-bar-helpful-message.mobile").text("Tap next to continue");
    }

    // window.setTimeout(function() {
      // if($(window).width() < 769) {
        // $("#action-bar-btn-continue").addClass("autonav");
      // } else {
        // $("#action-bar-btn-continue").removeClass("autonav");
      // }
    // }, 100);
    window.setTimeout(function() {
      if($("body").hasClass("prototype_b") && !autoNavCalloutShown) {
        showAutonavCallout();
      }
    }, 15000);

    $(".prototype_a .progress-bar-wrap .num_of_fields_reqd").text(tag_count);
  });

  // $("body").on("click", "#action-bar-btn-continue.autonav:not(.finish)", function() {
  //   // $("#autonav").click();
  //   goToNextTarget();
  // });

  $(window).on("resize", function() {
    alignAutonavToPage();
  });

  function alignAutonavToPage() {
    $("#autonav").css("left", $(".document_page").offset().left);
    $(".disclosure_pages").css("left", $(".document_page").offset().left);
  }

  $(".toolbar-btn-wrapper").on("mouseenter", function() {
    $(this).find(".tooltip").removeClass("hide");
  });
  $(".toolbar-btn-wrapper").on("mouseleave", function() {
    $(this).find(".tooltip").addClass("hide");
  });

  // var tag_targets = [$("#disclosure1"), $("#disclosure2"), $("#page1"), $("#field-1"), $("#field-2"), $("#disclosure3"), $("#page2"), $("#field-3"), $("#field-4")];
  var tag_targets = [];
  var tag_target_index = 0;
  var tagsSigned = false,
      disViewed = false;
  var all_completed = false;
  var tag_count = 0;

  $("body .autonavHighlight").each(function(idx, elem) {
    tag_targets.push($(elem));
    if(!$(elem).hasClass("hide") && !$(elem).hasClass("completed_action")) {
      tag_count++;
    }
  });

  function populateReqdNumbers(tag_count) {
    $(".prototype_b .progress-bar-wrap .num_of_fields_reqd").html("");
    for(var i=0; i<tag_count+1; i++) {
      $(".prototype_b .progress-bar-wrap .num_of_fields_reqd").append('<div class="remaining_seq_num" data-remaining-num="' + i + '">' + i + '</div>');
    }
    // $(".prototype_b .progress-bar-wrap .num_of_fields_reqd .remaining_seq_num[data-remaining-num='0']").addClass("selected");
  }
  function animateReqdNumber(tag_count) {
    $(".prototype_b .progress-bar-wrap .num_of_fields_reqd").animate({
      scrollTop: $(".prototype_b .progress-bar-wrap .num_of_fields_reqd").scrollTop() + $(".prototype_b .progress-bar-wrap .num_of_fields_reqd .remaining_seq_num[data-remaining-num='" + tag_count + "']").position().top
    }, 250);
  }
  // function animateReqdNumber(tag_count) {
  //   // console.log($(.prototype_b ".progress-bar-wrap .num_of_fields_reqd").scrollTop() + $(".prototype_b .progress-bar-wrap .num_of_fields_reqd .remaining_seq_num[data-remaining-num='" + tag_count + "']").position().top);
  //   $(".prototype_b .progress-bar-wrap .num_of_fields_reqd .remaining_seq_num").removeClass("selected");
  //   $(".prototype_b .progress-bar-wrap .num_of_fields_reqd .remaining_seq_num[data-remaining-num='" + tag_count + "']").addClass("selected");
  //
  // }
  console.log(tag_count);
  $(".prototype_a .progress-bar-wrap .num_of_fields_reqd").text(tag_count);

  $("body").on("click", ".autonav:not(.finish)", goToNextTarget);
  $("body").on("click", "#autonav", function(evt) {
    autoNavCalloutShown = true;
  });

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

  function goToFirstReqdTag() {
    tag_target_index = 0;
    goToNextTarget();
  }

  function goToNextTarget() {
    var next_target = tag_targets[tag_target_index];
    var next_target_top = 0;
    var scrollTop_pos = 0;
    var scrollLeft_pos = 0;

    // $(".prototype_a #autonav").addClass("secondary");
    $(".prototype_b #action-bar-btn-continue").removeClass("disabled");
    $(".prototype_b #bottom-btn-finish").removeClass("disabled");

    $("#autonav").addClass("pointer");
    $("#autonav p").text("Next");
    $("#action-bar-btn-continue").text("Finish");

    if(next_target.hasClass("completed_action") || next_target.hasClass("hide")) {
      var start_val = tag_target_index - 1;
      // tag_target_index++;

      while (start_val != tag_target_index && !all_completed) {
        if(tag_targets[tag_target_index].hasClass("completed_action") || tag_targets[tag_target_index].hasClass("hide")) {
          tag_target_index++;
        } else {
          // console.log(tag_target_index);
          break;
        }
        if(tag_target_index >= tag_targets.length) {
          tag_target_index = 0;
        }
      }
    }

    next_target_top = parseInt(tag_targets[tag_target_index].offset().top);

    $("#autonav").css("top", $(window).height()/2);
    if(next_target_top < $(window).height()/2 && next_target_top > 0) {
      // console.log(tag_target_index);
      // $("#autonav").css("top", next_target_top);
    }
    if(next_target_top > $(window).height()/2 + 50 && next_target_top < $(window).height()) {
      // $("#autonav").css("top", next_target_top);
    }
    scrollTop_pos = tag_targets[tag_target_index].offset().top + $(".documents-wrapper").scrollTop() - $(window).height()/2;
    scrollLeft_pos = tag_targets[tag_target_index].offset().left + $(".documents-wrapper").scrollLeft() - 100;

    $(".documents-wrapper").animate({
      scrollTop: scrollTop_pos,
      scrollLeft: scrollLeft_pos
    }, 500);

    // $(this).css("top", next_target_top);
    window.setTimeout(function() {
      var next_target_element = tag_targets[tag_target_index==0?tag_targets.length-1:tag_target_index-1];
      next_target_top = parseInt(next_target_element.offset().top) + next_target_element.height()/2 - ($("#autonav").height()/2);

      if(next_target_top < $(window).height()/2 && next_target_top > 0) {
        // console.log("up " + next_target_top);
        // console.log($("#autonav").position().top);
        $("#autonav").css("top", next_target_top);
      }
      if(next_target_top > $(window).height()/2 + 50 && next_target_top < $(window).height()) {
        // console.log("down" + next_target_top);
        $("#autonav").css("top", next_target_top);
      }
    }, 550);

    $(".prototype_a0 .action-bar-helpful-message.desktop").text(tag_targets[tag_target_index].attr("data-helpful-action"));

    if(tag_targets[tag_target_index].attr("data-autonav-text") &&
      tag_targets[tag_target_index].attr("data-autonav-text").trim().length > 0) {
      $(".prototype_a0 #autonav p").text(tag_targets[tag_target_index].attr("data-autonav-text"));
    }

    $(".field, .disclosure").removeClass("highlight_field");
    $(tag_targets[tag_target_index]).addClass("highlight_field");
    autoNavTrackTarget($(tag_targets[tag_target_index]));

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

      // $("#envelope-wrapper").css({"height": $(window).outerHeight() - $("#action-bar-wrapper").outerHeight() - $("#footer-wrapper").outerHeight()});
      if($(window).width() > 768) {
        // $("#envelope-wrapper").css({"height": $(window).outerHeight() - $("#toolbar-wrapper").outerHeight() - $("#action-bar-wrapper").outerHeight() - $("#footer-wrapper").outerHeight()});
      }
    }, 300);

  });


  $("body").on("click", ".btn_agree", function() {
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

  $("body").on("click", ".field-sign, .field-initial", function() {
    var _this = this;
    signatureAdoptedTarget = $(this);
    if(signatureAdopted) {
      window.setTimeout(function() {
        // console.log($(this).find("img:first-child").hasClass("hide"));
        if(!$(_this).find("img:first-child").hasClass("hide")) {
          $(_this).addClass("tagsSigned completed_action");
          $(_this).parents(".document_page").addClass("completed_action");
          // $(_this).prev(".field-rb").addClass("completed_action");
        } else {
          $(_this).removeClass("tagsSigned completed_action");
          $(_this).parents(".document_page").removeClass("completed_action");
          // $(_this).prev(".field-rb").removeClass("completed_action");
        }
        $(_this).find("img").toggleClass("hide");
      }, 0);
    } else {
      if($(this).hasClass("field-sign")) {
        $(".modal-adopt-signature [data-group='tagType']").removeAttr("data-selected");
        $(".modal-adopt-signature [data-group='tagType'][data-group-item='signature']").attr("data-selected", true);
      } else if($(this).hasClass("field-initial")) {
        $(".modal-adopt-signature [data-group='tagType']").removeAttr("data-selected");
        $(".modal-adopt-signature [data-group='tagType'][data-group-item='initials']").attr("data-selected", true);
      }
      showModal($(".modal-adopt-signature"));
    }
  });

  $("body").on("click", ".adopt_signature_initial", function(evt) {
    window.setTimeout(function() {
      signatureAdopted = true;
      signatureAdoptedTarget.click();
    }, 500);

  });
  $(".modal-adopt-signature").on("click", ".modal_footer button, .modal_footer .btn", function(evt) {
    hideModal($(".modal-adopt-signature"));
  });

  $("body").on("click", ".field, .btn_agree", function(evt) {
    if(signatureAdopted) {
      // $("#autonav").removeClass("pointer");
      evt.preventDefault();
      evt.stopPropagation();
      if($("body").hasClass("prototype_b") && !autoNavCalloutShown) {
        // goToFirstReqdTag();
        // showAutonavCallout(evt);
      } else {
        $(".callout").addClass("callout-invisible");
      }
      $("#autonav p").text("Next");
      $("#autonav").removeClass("pointer");
      $(".prototype_b #action-bar-btn-continue").removeClass("disabled");
      $(".prototype_b #bottom-btn-finish").removeClass("disabled");
      $(this).removeClass("highlight_field errorHighlight");
      $(this).closest(".disclosures").find(".disclosure").removeClass("highlight_field errorHighlight");

      $("#action-bar-btn-continue").text("Finish");
      dontHighlightErrors = false;

      if($(this).hasClass("field")) {
        $("#autonav").css("top", $(this).offset().top);
      }

      window.setTimeout(function() {
        checkComplete();
      }, 10);
      if($("body").hasClass("prototype_a") && !$(this).hasClass("completed_action") && !$(this).hasClass("field-text") && !everythingFilled) {
        goToNextTarget();
      }
    }
    if($(this).hasClass("field")) {
      autoNavTrackTarget($(this));
    }
  });
  $("body").on("input change", ".field-text input", function() {
    if($(this).val().length > 0) {
      $(this).closest(".field-text").addClass("completed_action");
    } else {
      $(this).closest(".field-text").removeClass("completed_action");
    }
    checkComplete();
  });

  function checkComplete() {
    tagsSigned = true;
    disViewed = true;
    $(".field-sign, .field-initial").each(function() {
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
      if(!$(item).hasClass("hide") && !$(item).hasClass("completed_action")) {
        all_completed = false;
      }
    });

    if(all_completed) {
      $(".action-bar-helpful-message.mobile").text("Are you finished signing?");
      $(".action-bar-helpful-message.desktop").text("Done! Select Finish to send the completed document.");
      $(".btn-continue-mobile").text("Finish");
      $("#autonav").addClass("hide");
      $("#autonav, #action-bar-btn-continue").addClass("finish");
      // $(".prototype_a #action-bar-btn-continue").text("Finish");
      $(".prototype_a #action-bar-btn-continue-mobile").removeClass("autonav");
      $(".prototype_b #action-bar-wrapper").removeClass("not_blue");
      $(".prototype_c #action-bar-btn-continue").removeClass("secondary");
      $(".prototype_c #bottom-btn-finish").removeClass("secondary");
      $(".prototype_c #action-bar-wrapper .progress-bar-wrap .progress-bar").addClass("hide");
      // $(".documents-wrapper").animate({
	    //   scrollTop: $(window).outerHeight() + 200
	    // }, 300);
    } else {
      $("#autonav").removeClass("hide");
      $(".action-bar-helpful-message.mobile").text("Tap next to continue");
      if($(".documents-wrapper").find(".highlight_field").length <= 0) {
        $(".action-bar-helpful-message.desktop").text("");
      }
      $(".btn-continue-mobile").text("Next");
      $("#autonav, #action-bar-btn-continue").removeClass("finish");
      // $(".prototype_a #action-bar-btn-continue").text("Finish");
      $(".prototype_a #action-bar-btn-continue-mobile").addClass("autonav");
      $(".prototype_b #action-bar-wrapper").addClass("not_blue");
      $(".prototype_c #action-bar-btn-continue").addClass("secondary");
      $(".prototype_c #bottom-btn-finish").addClass("secondary");
      $(".prototype_c #action-bar-wrapper .progress-bar-wrap .progress-bar").removeClass("hide");
    }

    var completedTagCount = parseInt($("body").find(".autonavHighlight.completed_action").length);
    window.setTimeout(function() {

      if($("body").hasClass("prototype_b")) {
        animateReqdNumber(tag_count - completedTagCount);
      }
    }, 100);

    $(".prototype_a .progress-bar-wrap .num_of_fields_reqd").text(tag_count - completedTagCount);
    $(".progress-bar-wrap .progress-bar .fill").css({"width": (100*(completedTagCount/tag_count)) + "%"});

    if((tag_count - completedTagCount) <= 0) {
      $(".progress-bar-wrap .progress-bar-label-remaining").addClass("hide");
      $(".progress-bar-wrap .progress-bar-label-completed").removeClass("hide");
    } else {
      $(".progress-bar-wrap .progress-bar-label-remaining").removeClass("hide");
      $(".progress-bar-wrap .progress-bar-label-completed").addClass("hide");
    }
  }

  $(".mobile-menu").on("click", function() {
    $(this).prev(".other-actions-mobile").toggleClass("hidden");
  });

  $("body").on("click", ".show_page_thumbnails", function(evt) {
    $(".documents-wrapper").toggleClass("thumbnail-docs-drawer-open");
    alignAutonavToPage();
  });
  $(".thumbnail-drawer").on("click", ".thumbnails-page-btn", function(evt) {
    $(this).closest(".thumbnail-drawer").find(".thumbnails-page-btn").removeClass("selected");
    $(this).addClass("selected");
    var pageTop_pos = $("#" + $(this).attr("data-target-page")).offset().top + $(".documents-wrapper").scrollTop() - 100;
    $(".documents-wrapper").animate({
      scrollTop: pageTop_pos
    }, 250);
  });

  $(".documents-wrapper").on("scroll", function(evt) {
    // if($("#field-1").offset().top < $(".documents-wrapper").scrollTop() && !autoNavCalloutShown) {
    //   showAutonavCallout();
    // }
    if(!trackedTargetEl && tag_targets[tag_target_index - 1]) {
      autoNavTrackTarget(tag_targets[tag_target_index - 1]);
    } else if (trackedTargetEl) {
      autoNavTrackTarget(trackedTargetEl);
    }
  });

  function autoNavTrackTarget(targetTagEl) {
    trackedTargetEl = targetTagEl;
    if($("body").hasClass("prototype_b") && $(window).width() < 769) {
      $("#autonav").css({"top": targetTagEl.offset().top});
      // $("#autonav").css({"transition-duration": "0s"});
    }
  }
});
