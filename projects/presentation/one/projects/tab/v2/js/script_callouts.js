var calloutTargetIndex = 1;
var svgFillColor = "#ffe084";
//
// $(".new_doc").on("click", function() {
//   $("#menuNewDocument, #menuNew").toggleClass("invisible");
//   // console.log($(this).position().left+ parseInt($(this).css("margin-left")) + " " + $(this).offset().left);
//   $("#menuNewDocument, #menuNew").css({"opacity": 1, "top": $(this).position().top + $(this).outerHeight(), "left": $(this).position().left + parseInt($(this).css("margin-left"))});
// });

$(document).ready(function(e) {
  setTimeout(function() {
    // console.log("calloutTarget" + calloutTargetIndex);
    // $("#test11").click();
    if($("#calloutTarget" + calloutTargetIndex).length) {
      showCallout(e, $("#calloutTarget" + calloutTargetIndex));
    }
  },0);

});

$("#calloutTarget" + calloutTargetIndex).on("click", function(e) {
  if($(document).attr("title") != "Send") {
    calloutTargetIndex++;
  // if($("calloutTarget" + calloutTargetIndex).length == 1) {
    // console.log($("#calloutTarget" + calloutTargetIndex).length);
    if($("#calloutTarget" + calloutTargetIndex).length) {
      showCallout(e, $("#calloutTarget" + calloutTargetIndex));
    }
  // }
  }
});

function updateCalloutText() {
  // console.log($(document).attr("title"));
  // console.log(document.referrer);
  // console.log(calloutTargetIndex);
  if($(document).attr("title") == "SBS Sending") {
    if(calloutTargetIndex == 2) {
      $(".tooltip.callout .tooltip-content").html("Select <strong>Send</strong> if you want others to sign. Select <strong>Sign</strong> if you are the only signer.");
    }
    if(calloutTargetIndex > 2) {
      $(".tooltip").addClass("hidden");
    }
  }

  if($(document).attr("title") == "Send") {
    if(calloutTargetIndex === 2) {
      $(".tooltip.callout .tooltip-content").html("Add the people who will sign your document. <a target='_blank' href='https://support.docusign.com/en/guides/ndse-user-guide-add-recipients'>Learn more.</a>");
    }
    if(calloutTargetIndex === 3) {
      $(".tooltip.callout .tooltip-content").html("Select the <strong>signing order</strong> option to control the order in which recipients sign.");
    }
    if(calloutTargetIndex === 4) {
      $(".tooltip.callout .tooltip-content").html("Click <strong>NEXT</strong> and place fields to show your recipients where to sign and date your document.");
    }
    if(calloutTargetIndex > 4) {
      $(".tooltip").addClass("hidden");
    }
  }
  if($(document).attr("title") == "Send | DocuSign") {
    if(calloutTargetIndex === 2) {
      $(".tooltip.callout .tooltip-content").html("You add fields for each recipient. If you have multiple recipients, select a recipient from the list, and then add fields.");
    }
    if(calloutTargetIndex === 3) {
      $(".tooltip.callout .tooltip-content").html("When your document is ready to go, click <strong>SEND.</strong> Recipients will receive your document in the order specified.");
    }
  }
}

$(".upload_document").on("click", function(e) {
  // THIS OVERRIDES THE DEFAULT TRIGGER FOR RECIPIENT CARDS PAGE
  calloutTargetIndex++;
  if($("#calloutTarget" + calloutTargetIndex).length) {
    showCallout(e, $("#calloutTarget" + calloutTargetIndex));
  }
});
$(".recipient_cards").on("blur", ".recipient_info input", function(e) {
  var parent = $(this).parents(".recipient_content");
  if(parent.find(".recipient_info :not(.hidden) .name").val().length > 0 && parent.find(".recipient_info :not(.hidden) .email").val().length > 0) {
    //HARDCODING FOR IF USER CLICKS THE BUTTON BEFORE FILLING ALL DETAILS
    if(calloutTargetIndex == 3) {
      calloutTargetIndex++;
      if($("#calloutTarget" + calloutTargetIndex).length) {
        showCallout(e, $("#calloutTarget" + calloutTargetIndex));
      }
    }
    // console.log("blurred");
  }
});

$("body").on("click", ".btn-add-recipient", function(e) {
  if(calloutTargetIndex >= 2) {
    calloutTargetIndex++;
    if($("#calloutTarget" + calloutTargetIndex).length) {
      showCallout(e, $("#calloutTarget" + calloutTargetIndex));
    }
  }
});


$(".tooltip").on("click", ".btn-primary, .icon-times", function(e) {
  // console.log("btn");
  $(this).closest(".tooltip").addClass("hidden");

  if($(document).attr("title") == "Send | DocuSign") {
    calloutTargetIndex++;
    if($("#calloutTarget" + calloutTargetIndex).length) {
      showCallout(e, $("#calloutTarget" + calloutTargetIndex));
      $(".tooltip .stepNum").text(calloutTargetIndex);
    }
    if(calloutTargetIndex == 3) {
      $(".tooltip .btn-primary").text("Done");
    }
  }
});
$("body").on("click", function(e) {
  // e.stopPropagation();
  if(!$(".tooltip").hasClass("hidden") && !$(e.target).attr("callout-trigger")) {
    $(".tooltip").addClass("hidden");
  }
});
$("body").on("click", "*:not(.tooltip,.tooltip *)", function(e) {
  // e.stopPropagation();
  // console.log($(this).width() + " " + $(this).height());
  // console.log(e.pageY);
  // $(this).addClass("callout-target");
});
$("body").on("click", ".callout-target", function(e) {
  e.stopPropagation();
  showCallout(e, $(this));
});

function showCallout(e, target) {
  // console.log(e.pageX/wWidth + " " + e.pageY/wHeight);
  // console.log($(e.target).offset().left/wWidth + " " + $(e.target).offset().top/wHeight);

  $(".tooltip").removeClass("above below before after top middle bottom left center right hidden");

  // updateCalloutText();

  if($(target).attr("callout-pos") === "" || !$(target).attr("callout-pos")) {
    var wWidth = window.innerWidth;
    var wHeight = window.innerHeight;
    var quadrant = 0;
    var pageHorizontalLeft = 0.25;
    var pageHorizontalRight = 0.50;
    var pageVerticalTop = 0.25;
    var pageVerticalBottom = 0.75;

    // console.log(e.pageX);
    // console.log(e.clientX);
    // var targetLocationX = $(e.target).offset().left/wWidth;
    // var targetLocationY = $(e.target).offset().top/wHeight;
    var targetLocationX = e.clientX/wWidth;
    var targetLocationY = e.clientY/wHeight;

    if(targetLocationX <= 0.25 && targetLocationY <= 0.10) {
      $(".tooltip").addClass("below left");
      quadrant = 1;
    }
    else if(targetLocationX <= pageHorizontalLeft && targetLocationY > 0.10 && targetLocationY <= 0.25) {
      $(".tooltip").addClass("after top");
      quadrant = 1;
    } else if(targetLocationX <= pageHorizontalLeft && targetLocationY > 0.25 && targetLocationY <= 0.75) {
      $(".tooltip").addClass("after middle");
      quadrant = 2;
    } else if(targetLocationX <= pageHorizontalLeft && targetLocationY > 0.75 && targetLocationY <= 0.93) {
      $(".tooltip").addClass("after bottom");
      quadrant = 3;
    } else if(targetLocationX <= pageHorizontalLeft && targetLocationY > 0.93) {
      $(".tooltip").addClass("above left");
      quadrant = 3;
    } else if(targetLocationX > pageHorizontalLeft && targetLocationX <= pageHorizontalRight && targetLocationY <= 0.25) {
      $(".tooltip").addClass("below center");
      quadrant = 4;
    } else if(targetLocationX > pageHorizontalLeft && targetLocationX <= pageHorizontalRight && targetLocationY > 0.25 && targetLocationY <= 0.75) {
      $(".tooltip").addClass("after middle");
      quadrant = 5;
    } else if(targetLocationX > pageHorizontalLeft && targetLocationX <= pageHorizontalRight && targetLocationY > 0.75) {
      $(".tooltip").addClass("above center");
      quadrant = 6;
    } else if(targetLocationX > pageHorizontalRight && targetLocationY <= 0.10) {
      $(".tooltip").addClass("below right");
      quadrant = 7;
    } else if(targetLocationX > pageHorizontalRight && targetLocationY > 0.10 && targetLocationY <= 0.25) {
      $(".tooltip").addClass("before top");
      quadrant = 7;
    } else if(targetLocationX > pageHorizontalRight && targetLocationY > 0.25 && targetLocationY <= 0.75) {
      $(".tooltip").addClass("before middle");
      quadrant = 8;
    } else if(targetLocationX > pageHorizontalRight && targetLocationY > 0.75 && targetLocationY <= 0.93) {
      $(".tooltip").addClass("before bottom");
      quadrant = 9;
    } else if(targetLocationX > pageHorizontalRight && targetLocationY > 0.93) {
      $(".tooltip").addClass("above right");
      quadrant = 9;
    }
  } else {
    $(".tooltip").addClass($(target).attr("callout-pos"));
    // $(".tooltip").css({top: $(target).offset().top});
  }

  // var tooltipWidth = 300 + 10;
  // var tooltipHeight = 177;
  var tooltipWidth = $(".tooltip").outerWidth();
  var tooltipHeight = $(".tooltip").outerHeight() + 5;
  // console.log("left: " + $(target).offset().left + " Top:" + $(target).offset().top);

  if($(".tooltip").hasClass("before")) {
    // console.log($(target).offset().left);
    $(".tooltip").css({left: $(target).offset().left - tooltipWidth - $(target).outerWidth()/2});
  }
  if($(".tooltip").hasClass("after")) {
    $(".tooltip").css({left: $(target).offset().left + $(target).outerWidth() + 10});
  }
  if($(".tooltip").hasClass("left")) {
    $(".tooltip").css({left: $(target).offset().left + $(target).outerWidth()/2 - 34});
    // $(".tooltip").css({left: e.pageX - 30});
  }
  if($(".tooltip").hasClass("center")) {
    $(".tooltip").css({left: $(target).offset().left + $(target).outerWidth()/2 - tooltipWidth/2});
    // $(".tooltip").css({left: e.pageX - tooltipWidth/2});
  }
  if($(".tooltip").hasClass("right")) {
    $(".tooltip").css({left: $(target).offset().left + $(target).outerWidth()/2 - tooltipWidth + 26});
    // $(".tooltip").css({left: e.pageX - tooltipWidth + 40});
  }
  if($(".tooltip").hasClass("above")) {
    $(".tooltip").css({top: $(target).offset().top - tooltipHeight - 5});
  }
  if($(".tooltip").hasClass("below")) {
    $(".tooltip").css({top: $(target).offset().top + $(target).outerHeight() + 10});
  }
  if($(".tooltip").hasClass("top")) {
    $(".tooltip").css({top: $(target).offset().top + $(target).outerHeight()/2 - 30});
    // $(".tooltip").css({top: e.pageY - 30});
  }
  if($(".tooltip").hasClass("middle")) {
    $(".tooltip").css({top: $(target).offset().top + $(target).outerHeight()/2 - tooltipHeight/2});
    // $(".tooltip").css({top: e.pageY - tooltipHeight/2});
  }
  if($(".tooltip").hasClass("bottom")) {
    $(".tooltip").css({top: $(target).offset().top + $(target).outerHeight()/2 - tooltipHeight + 40});
    // $(".tooltip").css({top: e.pageY - tooltipHeight + 40});
  }

  // $("#callout").css({left: e.pageX, top: e.pageY});
}
