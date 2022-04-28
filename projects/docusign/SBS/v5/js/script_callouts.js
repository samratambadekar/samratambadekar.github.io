var calloutTargetIndex = 1;
var svgFillColor = "#ffe084";
var focussedTextBox;
var copiedOnce = false;
var generateBtnClicked = false;
var random_codes = ["8$UGCX","E1MZ$Y","R#XT5@","SHU%Y4","@D22M6","38PQ#Z","$ZEJ7$","D3UY6$","5C%8%#","P9RRZ$","UXDK8@","AEL1%9","%J2Z4L","$3FQJB","7S%W@I","8TP$3G","F@U%5C","W@3W@E","@#MFS1","@%5GE7","V%U1BD","3Z1$#4","BV$T1L","PKU#12","U7Y@#R"];

function updateCalloutText() {
  // console.log($(document).attr("title"));
}

$(".tooltip.callout").on("click", ".btn-primary, .icon-times", function(e) {
  e.stopPropagation();
  // console.log("btn");
  $(this).parents(".tooltip.callout").addClass("hidden");
});
$("body").on("click", function(e) {
  // e.stopPropagation();
  // if(!$(e.target).attr("callout-trigger")) {

  //ADDING DUMMY DELAY TO ALLOW USERS TO COPY ACCESSCODE
  window.setTimeout(function() {
    $(".tooltip.callout").addClass("hidden");
  },0);
  // }
});

$(".recipient_cards").on("focus", ".callout-target", function(e) {
  focussedTextBox = $(this);
  focussedTextBox.next(".icon-copy").addClass("hidden");

  $(".tooltip.callout .content-check").removeClass("hidden");
  $(".tooltip.callout .content-copied").addClass("hidden");

  showCallout(e, focussedTextBox, $(".tooltip.callout"));
  validateAccessCode();
  // $(".tooltip.callout button").focus();
});

$(".recipient_cards").on("click", function(e) {
  if(!$(e.target).attr("callout-trigger")) {
    $(".tooltip.callout").addClass("hidden");
  }
});
$(".recipient_cards").on("blur", ".callout-target", function(e) {
  // $(".tooltip.callout").addClass("hidden");
  // console.log(focussedTextBox);
  window.setTimeout(function() {
    if(validateAccessCode()) {
      focussedTextBox.removeClass("error_state");
      focussedTextBox.parents(".form_row").find(".AccessCode.text-alert").addClass("hidden");
      if(!generateBtnClicked) {
        focussedTextBox.next(".icon-copy").removeClass("hidden");
      }
      generateBtnClicked = false;
    } else {
      focussedTextBox.addClass("error_state");
      focussedTextBox.parents(".form_row").find(".AccessCode.text-alert").removeClass("hidden");
      if(focussedTextBox.val().length === 0) {
        focussedTextBox.parents(".form_row").find(".AccessCode.text-alert").text("Access code is required.");
      } else {
        focussedTextBox.parents(".form_row").find(".AccessCode.text-alert").text("Access code is invalid.");
      }
    }
  },150);
  // window.setTimeout(function() {
  //   if(validateAccessCode()) {
  //     focussedTextBox.next(".icon-copy").removeClass("hidden");
  //   } else {
  // },200);
});
$(".recipient_cards").on("mouseenter", ".icon-copy", function(e) {
  $(".tooltip.callout").addClass("hidden");
  $("#miniTooltipCopy > div").text("Copy to Clipboard");
  showCallout(e, $(this), $("#miniTooltipCopy"));
});
$(".recipient_cards").on("mouseleave", ".icon-copy", function(e) {
  $("#miniTooltipCopy").addClass("hidden");
});
$(".recipient_cards").on("click", ".icon-copy", function(e) {
  e.stopPropagation();
  $("#miniTooltipCopy").addClass("hidden");

  if(validateAccessCode() && !copiedOnce) {
    $(".tooltip.callout .content-check").addClass("hidden");
    $(".tooltip.callout .content-copied").removeClass("hidden");
    showCallout(e, $(this), $(".tooltip.callout"));

    copiedOnce = true;
  } else if(validateAccessCode()) {
    $("#miniTooltipCopy > div").text("Copied");
    showCallout(e, $(this), $("#miniTooltipCopy"));
  }

  focussedTextBox.select();
  document.execCommand('copy');
});

$(".tooltip.callout").on("click", ".btn_auto_generate", function(e) {
  generateBtnClicked = true;
  focussedTextBox.focus();
  e.stopPropagation();
  // console.log(focussedTextBox);
  // focussedTextBox.val("abc123@cba");
  focussedTextBox.val(randomCode());

  validateAccessCode();

  focussedTextBox.removeClass("error_state");
  focussedTextBox.parents(".form_row").find(".AccessCode.text-alert").addClass("hidden");
});

function randomCode() {
  // console.log(Math.round(Math.random() * random_codes.length));
  // console.log(random_codes[Math.round(Math.random() * random_codes.length)]);
  return(random_codes[Math.round(Math.random() * random_codes.length)]);
}

$(".recipient_cards").on("click", ".drawer_header .btn_cancel", function(e) {
  $(".tooltip.callout").addClass("hidden");
});

$(".recipient_cards").on("input", ".callout-target", validateAccessCode);

function validateAccessCode() {
  var value = focussedTextBox.val();
  var validationFlag = 0;
  // var accessCode = new RegExp(/^[ A-Za-z0-9_@./#&+-]*$/);
  var alphabets = /[A-z]/g;
  var numbers = /\d/g;
  var specialCharacters = /\W|_/;
  // console.log($(this).val().match(accessCode));
  // console.log(alphabets.test(value));
  // console.log(numbers.test(value));
  // console.log(specialCharacters.test(value));

  $(".accessCodeVal").text(value);

  if(value.length >= 6) {
    $(".tooltip.callout").find(".lengthCheck").removeClass("invisible");
    validationFlag++;
  } else {
    validationFlag--;
    $(".tooltip.callout").find(".lengthCheck").addClass("invisible");
  }
  if(alphabets.test(value)) {
    validationFlag++;
    $(".tooltip.callout").find(".alphabetCheck").removeClass("invisible");
  } else {
    validationFlag--;
    $(".tooltip.callout").find(".alphabetCheck").addClass("invisible");
  }
  if(numbers.test(value)) {
    validationFlag++;
    $(".tooltip.callout").find(".numberCheck").removeClass("invisible");
  } else {
    validationFlag--;
    $(".tooltip.callout").find(".numberCheck").addClass("invisible");
  }
  if(specialCharacters.test(value) && value.indexOf('<') == -1 && value.indexOf('>') == -1 && value.indexOf('&#') == -1) {
    validationFlag++;
    $(".tooltip.callout").find(".specialCharCheck").removeClass("invisible");
  } else {
    validationFlag--;
    $(".tooltip.callout").find(".specialCharCheck").addClass("invisible");
  }

  // if(value.length >= 6) {
  //   validationFlag++;
  // } else {
  //   validationFlag--;
  // }

  if(validationFlag == 4) {
    focussedTextBox.parents(".form_row").find(".input-text.AccessCode:hidden").removeClass("error_state");
    focussedTextBox.removeClass("error_state");
    focussedTextBox.parents(".form_row").find(".AccessCode.text-alert").addClass("hidden");

    // focussedTextBox.next(".icon-copy").removeClass("hidden");
    // $(".tooltip.callout .content-check").find(".tooltip-content").addClass("hidden");
  } else {
    // focussedTextBox.next(".icon-copy").addClass("hidden");
    // $(".tooltip.callout .content-check").find(".tooltip-content").removeClass("hidden");
  }

  window.setTimeout(function(e) {
    // showCallout(e, focussedTextBox, $(".tooltip.callout"));
  }, 0);
  // /^[ A-Za-z0-9_@./#&+-]*$/
  // $(".tooltip.callout button").focus();

  //SYNCING accessCode VALUES ACROSS TEXTBOXES
  $(".input-text.AccessCode:hidden").val(value);


  if(validationFlag == 4) {
    return true;
  } else {
    return false;
  }
}

function showCallout(e, target, callout) {
  // console.log(e.pageX/wWidth + " " + e.pageY/wHeight);
  // console.log($(e.target).offset().left/wWidth + " " + $(e.target).offset().top/wHeight);

  callout.removeClass("above below before after top middle bottom left center right hidden");

  updateCalloutText();

  if($(target).attr("callout-pos") === "" || !$(target).attr("callout-pos")) {
    var wWidth = $(window).outerWidth();
    var wHeight = $(window).outerHeight();
    var quadrant = 0;

    // var targetLocationX = $(e.target).offset().left/wWidth;
    // var targetLocationY = $(e.target).offset().top/wHeight;
    var targetLocationX = e.pageX/wWidth;
    var targetLocationY = e.pageY/wHeight;

    if(targetLocationX <= 0.25 && targetLocationY <= 0.10) {
      callout.addClass("below left");
      quadrant = 1;
    }
    else if(targetLocationX <= 0.25 && targetLocationY > 0.10 && targetLocationY <= 0.25) {
      callout.addClass("after top");
      quadrant = 1;
    } else if(targetLocationX <= 0.25 && targetLocationY > 0.25 && targetLocationY <= 0.75) {
      callout.addClass("after middle");
      quadrant = 2;
    } else if(targetLocationX <= 0.25 && targetLocationY > 0.75 && targetLocationY <= 0.93) {
      callout.addClass("after bottom");
      quadrant = 3;
    } else if(targetLocationX <= 0.25 && targetLocationY > 0.93) {
      callout.addClass("above left");
      quadrant = 3;
    } else if(targetLocationX > 0.25 && targetLocationX <= 0.75 && targetLocationY <= 0.25) {
      callout.addClass("below center");
      quadrant = 4;
    } else if(targetLocationX > 0.25 && targetLocationX <= 0.75 && targetLocationY > 0.25 && targetLocationY <= 0.75) {
      callout.addClass("after middle");
      quadrant = 5;
    } else if(targetLocationX > 0.25 && targetLocationX <= 0.75 && targetLocationY > 0.75) {
      callout.addClass("above center");
      quadrant = 6;
    } else if(targetLocationX > 0.75 && targetLocationY <= 0.10) {
      callout.addClass("below right");
      quadrant = 7;
    } else if(targetLocationX > 0.75 && targetLocationY > 0.10 && targetLocationY <= 0.25) {
      callout.addClass("before top");
      quadrant = 7;
    } else if(targetLocationX > 0.75 && targetLocationY > 0.25 && targetLocationY <= 0.75) {
      callout.addClass("before middle");
      quadrant = 8;
    } else if(targetLocationX > 0.75 && targetLocationY > 0.75 && targetLocationY <= 0.93) {
      callout.addClass("before bottom");
      quadrant = 9;
    } else if(targetLocationX > 0.75 && targetLocationY > 0.93) {
      callout.addClass("above right");
      quadrant = 9;
    }
  } else {
    callout.addClass($(target).attr("callout-pos"));
    // callout.css({top: $(target).offset().top});
  }

  // var tooltipWidth = 300 + 10;
  // var tooltipHeight = 177;
  var tooltipWidth = callout.outerWidth();
  var tooltipHeight = callout.outerHeight() + 5;
  // console.log("left: " + $(target).offset().left + " Top:" + $(target).offset().top);

  if(callout.hasClass("before")) {
    // console.log($(target).offset().left);
    callout.css({left: $(target).offset().left - tooltipWidth});
  }
  if(callout.hasClass("after")) {
    callout.css({left: $(target).offset().left + $(target).outerWidth() + 10});
  }
  if(callout.hasClass("left")) {
    callout.css({left: $(target).offset().left + $(target).outerWidth()/2 - 30});
    // callout.css({left: e.pageX - 30});
  }
  if(callout.hasClass("center")) {
    callout.css({left: $(target).offset().left + $(target).outerWidth()/2 - tooltipWidth/2});
    // callout.css({left: e.pageX - tooltipWidth/2});
  }
  if(callout.hasClass("right")) {
    callout.css({left: $(target).offset().left + $(target).outerWidth()/2 - tooltipWidth + 40});
    // callout.css({left: e.pageX - tooltipWidth + 40});
  }
  if(callout.hasClass("above")) {
    callout.css({top: $(target).offset().top - tooltipHeight});
  }
  if(callout.hasClass("below")) {
    callout.css({top: $(target).offset().top + $(target).outerHeight() + 10});
  }
  if(callout.hasClass("top")) {
    callout.css({top: $(target).offset().top + $(target).outerHeight()/2});
    // callout.css({top: e.pageY - 30});
  }
  if(callout.hasClass("middle")) {
    callout.css({top: $(target).offset().top + $(target).outerHeight()/2 - tooltipHeight/2});
    // callout.css({top: e.pageY - tooltipHeight/2});
  }
  if(callout.hasClass("bottom")) {
    callout.css({top: $(target).offset().top + $(target).outerHeight()/2 - tooltipHeight + 40});
    // callout.css({top: e.pageY - tooltipHeight + 40});
  }

  // $("#callout").css({left: e.pageX, top: e.pageY});
}

// $(".recipient_cards").on("click", "*", function(e) {
//   e.stopPropagation();
//   callout.addClass("hidden");
//
//   // HARDCODING SPECIAL CASE TO AVOID EXTRA EFFORT
//   console.log(calloutTargetIndex);
//   if($(document).attr("title") == "Send" && calloutTargetIndex == 4) {
//     callout.removeClass("hidden");
//     calloutTargetIndex++
//   }
// });