$(document).ready(function() {
  goToSelectedPage(0);
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
    window.location.href = "finish.html";
  });

  $("body").on("click", ".btn-next", function(evt) {
    if(!$(this).hasClass("navigate_home")) {
      $(".ndse_page.selected").removeClass("selected").next(".ndse_page").addClass("selected");
      goToSelectedPage(300);
    }

    if($(".ndse_page").last().hasClass("selected")) {
      $(this).addClass("navigate_home");
    }
    flowProgressIndicator();
  });
  $("body").on("click", ".btn-prev", function(evt) {
    evt.preventDefault();
    if(!$(".ndse_page").first().hasClass("selected")) {
      $(".ndse_page.selected").removeClass("selected").prev(".ndse_page").addClass("selected");
      goToSelectedPage(300);
    }

    $(".btn-next").removeClass("navigate_home");
    flowProgressIndicator();
  });
});

function flowProgressIndicator() {
  var targetEl = $(".action-flow .flow-state[data-step-name='" + $(".ndse_page.selected").attr("data-step-name") + "']");
  $(".action-flow .flow-state").removeClass("selected complete");
  targetEl.addClass("selected");
  targetEl.prevAll(".flow-state").addClass("complete");
}

function goToSelectedPage(animationDuration) {
  $(".ndse_steps").animate({scrollTop: $(".ndse_steps").scrollTop() + $(".ndse_page.selected").position().top - 40, scrollLeft: $(".ndse_steps").scrollLeft() + $(".ndse_page.selected").position().left}, (animationDuration));
}
