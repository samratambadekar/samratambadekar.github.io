var calloutTargetIndex = 1;
var svgFillColor = "#ffe084";
//
// $(".new_doc").on("click", function() {
//   $("#menuNewDocument, #menuNew").toggleClass("invisible");
//   // console.log($(this).position().left+ parseInt($(this).css("margin-left")) + " " + $(this).offset().left);
//   $("#menuNewDocument, #menuNew").css({"opacity": 1, "top": $(this).position().top + $(this).outerHeight(), "left": $(this).position().left + parseInt($(this).css("margin-left"))});
// });


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



$(".callout").on("click", ".btn-primary, .icon-times", function(e) {
  // console.log("btn");
  $(this).closest(".callout").addClass("callout-invisible");

  if($(document).attr("title") == "Send | DocuSign") {
    calloutTargetIndex++;
    if($("#calloutTarget" + calloutTargetIndex).length) {
      showCallout(e, $("#calloutTarget" + calloutTargetIndex));
      $(".callout .stepNum").text(calloutTargetIndex);
    }
    if(calloutTargetIndex == 3) {
      $(".callout .btn-primary").text("Done");
    }
  }
});
$("body").on("click", function(evt) {
  // evt.stopPropagation();
  if(!$(".callout").hasClass("callout-invisible") && !$(evt.target).attr("callout-trigger")) {
    $(".callout").addClass("callout-invisible");
  }
});
$("body").on("click", "*:not(.callout,.callout *)", function(e) {
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

  $(".callout").removeClass("above below before after top middle bottom left center right callout-invisible");

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
      $(".callout").addClass("below left");
      quadrant = 1;
    }
    else if(targetLocationX <= pageHorizontalLeft && targetLocationY > 0.10 && targetLocationY <= 0.25) {
      $(".callout").addClass("after top");
      quadrant = 1;
    } else if(targetLocationX <= pageHorizontalLeft && targetLocationY > 0.25 && targetLocationY <= 0.75) {
      $(".callout").addClass("after middle");
      quadrant = 2;
    } else if(targetLocationX <= pageHorizontalLeft && targetLocationY > 0.75 && targetLocationY <= 0.93) {
      $(".callout").addClass("after bottom");
      quadrant = 3;
    } else if(targetLocationX <= pageHorizontalLeft && targetLocationY > 0.93) {
      $(".callout").addClass("above left");
      quadrant = 3;
    } else if(targetLocationX > pageHorizontalLeft && targetLocationX <= pageHorizontalRight && targetLocationY <= 0.25) {
      $(".callout").addClass("below center");
      quadrant = 4;
    } else if(targetLocationX > pageHorizontalLeft && targetLocationX <= pageHorizontalRight && targetLocationY > 0.25 && targetLocationY <= 0.75) {
      $(".callout").addClass("after middle");
      quadrant = 5;
    } else if(targetLocationX > pageHorizontalLeft && targetLocationX <= pageHorizontalRight && targetLocationY > 0.75) {
      $(".callout").addClass("above center");
      quadrant = 6;
    } else if(targetLocationX > pageHorizontalRight && targetLocationY <= 0.10) {
      $(".callout").addClass("below right");
      quadrant = 7;
    } else if(targetLocationX > pageHorizontalRight && targetLocationY > 0.10 && targetLocationY <= 0.25) {
      $(".callout").addClass("before top");
      quadrant = 7;
    } else if(targetLocationX > pageHorizontalRight && targetLocationY > 0.25 && targetLocationY <= 0.75) {
      $(".callout").addClass("before middle");
      quadrant = 8;
    } else if(targetLocationX > pageHorizontalRight && targetLocationY > 0.75 && targetLocationY <= 0.93) {
      $(".callout").addClass("before bottom");
      quadrant = 9;
    } else if(targetLocationX > pageHorizontalRight && targetLocationY > 0.93) {
      $(".callout").addClass("above right");
      quadrant = 9;
    }
  } else {
    $(".callout").addClass($(target).attr("callout-pos"));
    // $(".callout").css({top: $(target).offset().top});
  }

  // var tooltipWidth = 300 + 10;
  // var tooltipHeight = 177;
  var tooltipWidth = $(".callout").outerWidth();
  var tooltipHeight = $(".callout").outerHeight() + 5;
  // console.log("left: " + $(target).offset().left + " Top:" + $(target).offset().top);

  if($(".callout").hasClass("before")) {
    // console.log($(target).offset().left);
    $(".callout").css({left: $(target).offset().left - tooltipWidth - $(target).outerWidth()/2});
  }
  if($(".callout").hasClass("after")) {
    $(".callout").css({left: $(target).offset().left + $(target).outerWidth() + 10});
  }
  if($(".callout").hasClass("left")) {
    $(".callout").css({left: $(target).offset().left + $(target).outerWidth()/2 - 34});
    // $(".callout").css({left: e.pageX - 30});
  }
  if($(".callout").hasClass("center")) {
    $(".callout").css({left: $(target).offset().left + $(target).outerWidth()/2 - tooltipWidth/2});
    // $(".callout").css({left: e.pageX - tooltipWidth/2});
  }
  if($(".callout").hasClass("right")) {
    $(".callout").css({left: $(target).offset().left + $(target).outerWidth()/2 - tooltipWidth + 26});
    // $(".callout").css({left: e.pageX - tooltipWidth + 40});
  }
  if($(".callout").hasClass("above")) {
    $(".callout").css({top: $(target).offset().top - tooltipHeight - 5});
  }
  if($(".callout").hasClass("below")) {
    $(".callout").css({top: $(target).offset().top + $(target).outerHeight() + 10});
  }
  if($(".callout").hasClass("top")) {
    $(".callout").css({top: $(target).offset().top + $(target).outerHeight()/2 - 30});
    // $(".callout").css({top: e.pageY - 30});
  }
  if($(".callout").hasClass("middle")) {
    $(".callout").css({top: $(target).offset().top + $(target).outerHeight()/2 - tooltipHeight/2});
    // $(".callout").css({top: e.pageY - tooltipHeight/2});
  }
  if($(".callout").hasClass("bottom")) {
    $(".callout").css({top: $(target).offset().top + $(target).outerHeight()/2 - tooltipHeight + 40});
    // $(".callout").css({top: e.pageY - tooltipHeight + 40});
  }

  // $("#callout").css({left: e.pageX, top: e.pageY});
}
