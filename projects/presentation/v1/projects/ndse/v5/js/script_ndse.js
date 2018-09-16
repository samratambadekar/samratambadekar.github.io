var firstTimeTagger = true;
var firstTimeSendToRecipient = true;
var firstRecipientAdded = false;
var firstTimeSwitchRecipient = true;
var iWantNoTags = false;

$(document).ready(function() {
  var mixpanelStartTime = localStorage.getItem("mixpanelStartTime");
  var userTestingId = localStorage.getItem("userTestingId");
  var mixpanelUserInformation = {};
  mixpanelUserInformation.userTestingId = userTestingId;

  if(!window.location.href.split("#")[1]) {
    window.location.href = window.location.href + "#1";
  } else {
    hashChangeEvent();
  }
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
      $(".action-flow .flow-state").removeClass("selected").addClass("complete");
    }, 100);
    // setTimeout(function() {
    //   $(".flow-line-progress").css({"width": "100%"});
    // }, 600);
    setTimeout(function() {
      window.location.href = "finish.html";
    }, 500);
  });

  $(".modal-no-fields").on("click", ".iWantNoTags", function(evt) {
    // evt.stopPropagation();
    iWantNoTags = true;
    $("#bottomNav .btn-next").click();
  });
  $("body").on("click", ".btn-next", function(evt) {
    evt.preventDefault();

    if($(this).hasClass("feature_unavailable")) {
      return;
    }

    // console.log($(".taggerDocument .newTagDraggable").length < 1 &&  iWantNoTags == false);
    // var allUsersList = [];
    $(".taggerDocument .site_toolbar.toolbar_tagger .toolbarRecipientsMenu .ng-binding").each(function(idx, elem) {
      // console.log($(elem).text());
      // allUsersList.push($(elem).text());

      if($(".taggerDocument .newTagDraggable[data-tag-for='" + $(elem).text() + "']").length > 0) {
        $(".modal-no-fields .modal_content [data-tag-for='" + $(elem).text() + "']").removeClass("text-alert").closest("li").addClass("hidden");
      } else if($(".taggerDocument .newTagDraggable[data-tag-for='" + $(elem).text() + "']").length <= 0) {
        $(".modal-no-fields .modal_content [data-tag-for='" + $(elem).text() + "']").addClass("text-alert").closest("li").removeClass("hidden");
      }
    });




    if(($(".ndse_page.selected").hasClass("taggerDocument") && !$(".taggerDocument").hasClass("signReturn")) && iWantNoTags == false) {
      if($(".ndse_page.selected").hasClass("taggerDocument") && ($(".taggerDocument .newTagDraggable").length < 1 && iWantNoTags == false)) {
        $(".ds-modal-background").removeClass("invisible");
        $(".modal-no-fields").removeClass("hide_modal");
        return;
      } else if($(".ndse_page.selected").hasClass("taggerDocument") && $(".taggerDocument .newTagDraggable").length > 0) {
        var tagsForAllUsers = true;
        $(".modal-no-fields .modal_content [data-tag-for]").each(function(idx, elem) {
          if($(this).hasClass("text-alert")) {
            tagsForAllUsers = false;
            // return;
          }
        });
        if(!tagsForAllUsers) {
          $(".ds-modal-background").removeClass("invisible");
          $(".modal-no-fields").removeClass("hide_modal");
          return;
        }
      }
    }

    mixpanelUserInformation.totalTimeSpent = String((Date.now() - mixpanelStartTime)/1000);
    localStorage.setItem("mixpanelUserInformation", mixpanelUserInformation);
    mixpanel.track($(".ndse_page_nav.selected").attr("data-step-name") + $(".ndse_page_nav.selected").attr("data-step-num"), mixpanelUserInformation);

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

      window.location.href = window.location.href.split("#")[0] + "#" + $(".ndse_page.selected").attr("data-step-num");
    }

    flowProgressIndicator();

    if($(".card_for_me").hasClass("selected")) {
      localStorage.setItem("signedByMe", true);
      $(".recipient_me").removeClass("hidden");
      sortRecipients();
    } else {
      localStorage.setItem("signedByMe", false);
      $(".recipient_me").addClass("hidden");
      sortRecipients();
    }

    if($(".taggerDocument").hasClass("selected")) {
      $(".recipient_info_sync").text("");
      var syncedRecipient;
      var recipientNames = [];
      $("#sortableRecipients .recipient:not(.hidden)").each(function(idx, elem) {
        syncedRecipient = $('<div class="recipients_summary"><div class="recipient_number color">' + $(elem).find(".recipient_number").text() + '</div><div class="strong">' + $(elem).find(".recipient_name input").val() + '</div><div class="">' + $(elem).find(".recipient_email input").val() + '</div><div class="">' + $(elem).find(".recipient_task .btn-trigger .ng-binding").text() + '</div></div>');
        $(".recipient_info_sync").append(syncedRecipient);
        
        if(!$(this).hasClass("dontAddToTagger")) {
          recipientNames.push($(elem).find(".recipient_name input").val());
        }
      });

      if(recipientNames.length > 0) {
        localStorage.setItem("recipientNames", recipientNames);
      } else {
        localStorage.removeItem("recipientNames");
      }

      updateRecipientsListInTagger();
    }

    if($(".selectRecipients").hasClass("selected") && $(".card_for_me").hasClass("selected") && !$(".card_for_others").hasClass("selected")) {
      $(".selectRecipients, .sendToRecipients").addClass("hidden");
      $(".taggerDocument").addClass("signReturn");
      window.location.href = window.location.href.split("#")[0] + "#4";
    } else {
      $(".selectRecipients, .sendToRecipients").removeClass("hidden");
      $(".taggerDocument").removeClass("signReturn");
    }

    if($(".sendToRecipients").hasClass("selected") && $(".card_for_me").hasClass("selected") && !$(".card_for_others").hasClass("selected")) {
      localStorage.setItem("signReturn", true);
      window.location.href = "finish.html";
      // $(".navigate_home").click();
    } else {
      localStorage.setItem("signReturn", false);
    }
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
    window.location.href = window.location.href.split("#")[0] + "#" + $(".ndse_page.selected").attr("data-step-num");
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
    stickNavButtonsToBottom(evt);
  });

  $("body").on("focus", "[data-field-id]", function(evt) {
    evt.preventDefault();
    $(this).next(".icon").addClass("hidden");
  });
  $("body").on("change blur", "[data-field-id]", function(evt) {
    evt.preventDefault();
    if($(this).text().trim() == "") {
      $(this).text("Untitled Envelope");
    }
    localStorage.setItem("envelopeName", $(this).text());
    $("body").find("[data-field-id='" + $(this).attr("data-field-id") + "']").text($(this).text());
    $(".input-subject-line").attr("placeholder", "Please DocuSign: " + $(this).text());
    $(".input-subject-line").val("Please DocuSign: " + $(this).text());

    $(this).next(".icon").removeClass("hidden");
  });

  $(".action-header_title .title").on("click", ".icon-editpen", function(evt) {
    evt.preventDefault();
    $(".action-header_title [data-field-id='Envelope Name']").focus();
  });

  $(".taggerDocument").on("mouseenter", function(evt) {
    evt.preventDefault();
    if($(".taggerDocument").hasClass("selected") && firstTimeTagger == true) {
      setTimeout(function() {
        firstTimeTagger = false;
        $(".callout > div").addClass("hidden");
        $(".callout .callout-drag-n-drop").removeClass("hidden");
        if($(".sidebar-sign-return").css("display") !== "none") {
          $(".sidebar-sign-return .menu_listItem[title='Signature']").attr("callout-pos", "after top");
          showCallout(evt, $(".sidebar-sign-return .menu_listItem[title='Signature']"));
        } else {
          $(".sidebar-regular-tags .menu_listItem[title='Signature']").attr("callout-pos", "after top");
          showCallout(evt, $(".sidebar-regular-tags .menu_listItem[title='Signature']"));
        }
      }, 1000);
    }
  });

  $(".sendToRecipients").on("mouseenter", function(evt) {
    evt.preventDefault();
    if($(".sendToRecipients").hasClass("selected") && firstTimeSendToRecipient == true) {
      setTimeout(function() {
        firstTimeSendToRecipient = false;
        $(".callout > div").addClass("hidden");
        $(".callout .callout-preview-mode").removeClass("hidden");
        $(".sendToRecipients .nav-buttons .btn-preview").attr("callout-pos", "below left");
        // showCallout(evt, $(".sendToRecipients .nav-buttons .btn-preview"));
      }, 1000);
      setTimeout(function() {
        $(".callout > div").addClass("hidden");
        $(".callout .callout-sample-document").removeClass("hidden");
        $(".envelope_section_name > [data-field-id='Envelope Name']").attr("callout-pos", "below right");
        showCallout(evt, $(".envelope_section_name > [data-field-id='Envelope Name']"));
      }, 2000);
    }
  });

  $(".modal-no-fields").on("click", ".switch_recipient_callout", function(evt) {
    evt.preventDefault();
    if($(".taggerDocument").hasClass("selected") && firstTimeSwitchRecipient == true) {
      setTimeout(function() {
        firstTimeSwitchRecipient = false;
        $(".callout > div").addClass("hidden");
        $(".callout .callout-switch-recipient").removeClass("hidden");
        $(".site_toolbar.toolbar_tagger .btn-recipients").attr("callout-pos", "below left");
        showCallout(evt, $(".site_toolbar.toolbar_tagger .btn-recipients"));
      }, 1000);
    }
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

  $(".action-flow").on("click", ".flow-state", function(evt) {
    evt.stopPropagation();

    if($(this).hasClass("selected") || $(this).hasClass("complete")) {
      $(".ndse_page").removeClass("selected");
      $(".ndse_page[data-step-name='" + $(this).attr("data-step-name") + "']").first().addClass("selected");
      goToSelectedPage(0);
      // flowProgressIndicator();
      window.location.href = window.location.href.split("#")[0] + "#" + $(".ndse_page.selected").attr("data-step-num");
    }
  });

  $(window).on("hashchange", hashChangeEvent);


  $(".ndse_steps .ndse_page").on("scroll", stickNavButtonsToBottom);
});

function stickNavButtonsToBottom(evt) {
  var targetEl = $(".ndse_page.selected");
  if(targetEl.hasClass("selected") && !targetEl.hasClass("taggerDocument")) {
    // console.log(targetEl.find(".nav-buttons").offset().top);
    // console.log(targetEl.height());
    window.setTimeout(function() {
      if(targetEl.find(".nav-buttons").offset().top > (targetEl.height() + 55)) {
        targetEl.find(".nav-buttons").addClass("invisible");
        $("#bottomNav").removeClass("hide_bottom_nav");
      } else {
        targetEl.find(".nav-buttons").removeClass("invisible");
        $("#bottomNav").addClass("hide_bottom_nav");
      }
    }, 150);
  }
}

function hashChangeEvent(evt) {
  // console.log(evt.originalEvent.oldURL);
  // console.log(evt.originalEvent.newURL);
  var pageNum = window.location.href.split("#")[1];
  var nextIndex = 0;
  if(pageNum) {
    nextIndex = parseInt(pageNum) - 1;
  }

  if(!$(".preview_mode").hasClass("hide")) {
    $(".preview_mode").addClass("hide");
    window.location.href = window.location.href.split("#")[0] + "#" + $(".ndse_page.selected").attr("data-step-num");
  } else {
    var nextPage = $(".ndse_page_nav").get(nextIndex);
    $(".ndse_page_nav.selected").removeClass("selected");
    $(nextPage).addClass("selected");
    checkButtonVisibility(nextIndex);
    goToSelectedPage(500);
    flowProgressIndicator();
  }
}

function flowProgressIndicator() {
  var targetEl = $(".action-flow .flow-state[data-step-name='" + $(".ndse_page.selected").attr("data-step-name") + "']");
  $(".action-flow .flow-state").removeClass("selected complete");
  targetEl.addClass("selected");
  targetEl.prevAll(".flow-state").addClass("complete");

  // $(".flow-line-progress").css({"width": $(".flow-state.selected").offset().left + targetEl.width() + 53});
  // if($(".flow-state:last-of-type").hasClass("selected")) {
  //   $(".flow-line-progress").css({"width": $(".flow-state.selected").offset().left + targetEl.width() + 60});
  // }
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
    $(".btn-next").removeClass("navigate_home");
  }
}

function updateRecipientsListInTagger() {
  var recipientNames = localStorage.getItem("recipientNames");
  if(!recipientNames || recipientNames.length <= 0) {
    recipientNames = ["Alex Edwards", "Corey Kimel"];
  } else {
    recipientNames = localStorage.getItem("recipientNames").split(",");
  }

  $(".taggerDocument .toolbar_tagger .toolbarRecipientsMenu ul:first-child").html("");
  $(".modal-no-fields .modal_content .modal_recipients_list").html("");
  $.each(recipientNames, function(idx, elem) {
    // console.log(elem);
    $(".taggerDocument .toolbar_tagger .toolbarRecipientsMenu ul:first-child").append('<li data-qa="recipient-' + (idx + 1) + '" class="ng-scope" role="menuitem"><button class="item"><span class="swatch swatch-round swatch-recipient swatch-ext-' + idx + '" data-qa="recipient-list-name-' + (idx + 1) + '"></span><span class="ng-binding">' + elem + '</span></button></li>');

    $(".modal-no-fields .modal_content .modal_recipients_list").append('<li><span class="text-alert" data-tag-for="' + elem + '">' + elem + '</span></li>');
  });
  $(".taggerDocument .toolbar_tagger .toolbarRecipientsMenu ul:first-child li:first-child button.item").click();
}
