var firstTimeTagger = true;
var firstRecipientAdded = false;

$(document).ready(function() {
  goToSelectedPage(0);
  flowProgressIndicator();
  $(".profile_status .completion").addClass("completion_value");

  $("#selectDocument").load("selectDocument.html", function() {
    $(this).trigger("pagecreate");
    $.getScript("js/script_upload_document.js", function() {
    });
  });
  $("#selectSigners").load("selectSigners.html", function() {
    $(this).trigger("pagecreate");
    $.getScript("js/script_select_signers.js", function() {
    });
  });
  $("#selectRecipients").load("selectRecipients.html", function() {
    $(this).trigger("pagecreate");
    $.getScript("js/script_select_recipients.js", function() {
    });
  });
  $("#taggerDocument").load("tagger.html", function() {
    $(this).trigger("pagecreate");
    $.getScript("js/script_tagger.js", function() {
    });
  });
  $("#sendToRecipients").load("sendToRecipients.html", function() {
    $(this).trigger("pagecreate");
    $.getScript("js/script_sendToRecipients.js", function() {
    });
  });

  $("body").on("click", ".navigate_home", function(evt) {
    // evt.stopImmediatePropogation();
    localStorage.setItem("show_activity", true);
    setTimeout(function() {
      $(".action-flow .flow-state").addClass("complete");
    }, 100);
    setTimeout(function() {
      $(".flow-line-progress").css({"width": "100%"});
    }, 600);
    setTimeout(function() {
      window.location.href = "finish.html";
    }, 1500);
  });

  $("body").on("click", ".btn-next", function(evt) {
    evt.preventDefault();

    if($(this).hasClass("feature_unavailable")) {
      return;
    }

    var nextIndex = -1;
    $(".ndse_page_nav").each(function(idx, elem) {
      if($(elem).hasClass("selected")) {
        nextIndex = idx+1;
      }
    });

    // console.log(nextIndex);
    if(!$(this).hasClass("navigate_home")) {
      // console.log(nextIndex);
      // console.log($(".ndse_page_nav.selected").index() + 1);
      var nextPage = $(".ndse_page_nav").get(nextIndex);

      $(".ndse_page_nav.selected").removeClass("selected");
      $(nextPage).addClass("selected");
      checkButtonVisibility(nextIndex);
      goToSelectedPage(500);

      // window.location.href = window.location.href + "#" + $(".ndse_page.selected").attr("data-step-name");
    }

    flowProgressIndicator();
  });
  $("body").on("click", ".btn-prev", function(evt) {
    evt.preventDefault();


    var prevIndex = -1;
    $(".ndse_page_nav").each(function(idx, elem) {
      if($(elem).hasClass("selected")) {
        prevIndex = idx - 1;
      }
    });
    if(!$(".ndse_page_nav").first().hasClass("selected")) {
      var prevPage = $(".ndse_page_nav").get(prevIndex);
      $(".ndse_page_nav.selected").removeClass("selected");
      $(prevPage).addClass("selected");
      checkButtonVisibility(prevIndex);
      goToSelectedPage(500);
    }

    $(".btn-next").removeClass("navigate_home");
    flowProgressIndicator();
  });


  $("body").on("click", ".btn-close-flow", function(evt) {
    evt.stopPropagation();

    $(".ds-modal-background").removeClass("invisible");
    $(".modal-save-envolope").removeClass("hide_modal");
    localStorage.setItem("firstTimeModal", false);
  });

  $(window).on("resize", function(evt) {
    goToSelectedPage(0);
    flowProgressIndicator();
  });

  $("body").on("focus", "[data-field-id]", function(evt) {
    evt.preventDefault();
    $(this).next(".icon").addClass("hidden");
  });
  $("body").on("blur", "[data-field-id]", function(evt) {
    evt.preventDefault();
    if($(this).text().trim() == "") {
      $(this).text("Untitled Envelope");
    }
    localStorage.setItem("envelopeName", $(this).text());
    $("body").find("[data-field-id='" + $(this).attr("data-field-id") + "']").text($(this).text());
    $(".input-subject-line").attr("placeholder", "Please DocuSign: " + $(this).text());
    // $(".input-subject-line").val("Please DocuSign: " + $(this).text());
    $(this).next(".icon").removeClass("hidden");
  });

  $(".action-header_title .title").on("click", ".icon-editpen", function(evt) {
    evt.preventDefault();
    $(".action-header_title [data-field-id='Envelope Name']").focus();
  });

  $(".taggerDocument").on("mouseenter", function(evt) {
    evt.preventDefault();
    if(firstTimeTagger == true) {
      setTimeout(function() {
        firstTimeTagger = false;
        $(".callout > div").addClass("hidden");
        $(".callout .callout-drag-n-drop").removeClass("hidden");
        $(".menu_listItem[title='Signature']").attr("callout-pos", "after top");
        showCallout(evt, $(".menu_listItem[title='Signature']"));
      }, 1000);
    }
  });

  var toast_msg_timer;
  $("body").on("click", ".feature_unavailable", function() {
    $(".msg_feature_unavailable").removeClass("hide");

    window.clearTimeout(toast_msg_timer);
    toast_msg_timer = window.setTimeout(function() {
      $(".msg_feature_unavailable").addClass("hide");
    }, 1100);
  });

  $("body").on("click", ".btn-menu", function(evt) {
    evt.stopPropagation();
    var targetEl = $(this).next(".menu");
    var isVisible = !(targetEl.hasClass("invisible"));
    $("body .menu").addClass("invisible");

    if(isVisible) {
      targetEl.addClass("invisible");
    } else {
      targetEl.removeClass("invisible");
    }
  });
  $("body").on("click", function(evt) {
    evt.stopPropagation();
    $("body .menu").addClass("invisible");
  });
});

function flowProgressIndicator() {
  var targetEl = $(".action-flow .flow-state[data-step-name='" + $(".ndse_page.selected").attr("data-step-name") + "']");
  $(".action-flow .flow-state").removeClass("selected complete");
  targetEl.addClass("selected");
  targetEl.prevAll(".flow-state").addClass("complete");

  $(".flow-line-progress").css({"width": $(".flow-state.selected").offset().left + targetEl.width() + 53});
  if($(".flow-state:last-of-type").hasClass("selected")) {
    $(".flow-line-progress").css({"width": $(".flow-state.selected").offset().left + targetEl.width() + 60});
  }
}

function goToSelectedPage(animationDuration) {
  $(".ndse_steps").animate({scrollTop: $(".ndse_steps").scrollTop() + $(".ndse_page.selected").position().top - 67, scrollLeft: $(".ndse_steps").scrollLeft() + $(".ndse_page.selected").position().left}, (animationDuration));
}

function checkButtonVisibility(currentIndex) {
  if($(".ndse_page.selected").hasClass("taggerDocument")) {
    setTimeout(function() {
      $("#bottomNav").removeClass("hide_bottom_nav");
    }, 300);
  } else {
    $("#bottomNav").addClass("hide_bottom_nav");
  }
  if($(".ndse_page.selected").hasClass("selectRecipients") && !firstRecipientAdded) {
    firstRecipientAdded = true;
    setTimeout(function() {
      $(".selectRecipients .add_recipient").click();
    }, 500);
  }

  // console.log(currentIndex);
  if(currentIndex == 0) {
    $(".btn-prev").addClass("invisible");
  } else {
    $(".btn-prev").removeClass("invisible");
  }

  if(currentIndex == 4) {
    $(".btn-next").text("Send");
    $(".btn-next").addClass("navigate_home");
  } else {
    $(".btn-next").text("Next");
  }
}
