var userInformation = {
  userTestingID: null,
  startTime: null,
  finishTime: null,
  firstName: null,
  middleInitial: null,
  lastName: null,
  otherLastName: null,
  dateOfBirth: null,
  emailAddress: null,
  phoneNumber: null,
  physicalAddress: null,
  aptNumber: null,
  residentCity: null,
  residentState: null,
  zipCode: null,
  SSN: null,
  citizenshipStatus: null,
  documentType: null,
  documentTitle: null,
  issuingAuthority: null,
  documentNumber: null,
  documentExpirationDate: null,
  documentImageBlob: null,
  pageNumber: null,
  totalTimeSpent: null,
  otherClicks: []
};

var startTime;
var pageTime;

function saveAllData() {
  // userInformation.userTestingID = $("#userTestingID").val().replace(/"/g, "'");
  userInformation.userTestingID = $(".input-text[data-field-id='userTestingID']").val();
  userInformation.firstName = $(".input-text[data-field-id='firstName']").val();
  userInformation.middleInitial = $(".input-text[data-field-id='middleInitial']").val();
  userInformation.lastName = $(".input-text[data-field-id='lastName']").val();
  userInformation.otherLastName = $(".input-text[data-field-id='otherLastName']").val();
  userInformation.dateOfBirth = $(".input-text[data-field-id='dateOfBirth']").val();
  userInformation.emailAddress = $(".input-text[data-field-id='emailAddress']").val();
  userInformation.phoneNumber = $(".input-text[data-field-id='phoneNumber']").val();
  userInformation.physicalAddress = $(".input-text[data-field-id='physicalAddress']").val();
  userInformation.aptNumber = $(".input-text[data-field-id='aptNumber']").val();
  userInformation.residentCity = $(".input-text[data-field-id='residentCity']").val();
  userInformation.zipCode = $(".input-text[data-field-id='zipCode']").val();
  userInformation.documentTitle = $(".input-text[data-field-id='documentTitle']").val();
  userInformation.issuingAuthority = $(".input-text[data-field-id='issuingAuthority']").val();
  userInformation.documentNumber = $(".input-text[data-field-id='documentNumber']").val();
  userInformation.documentExpirationDate = $(".input-text[data-field-id='documentExpirationDate']").val();

  userInformation.residentState = $("select[data-field-select-id='residentState']").val();
  // userInformation.residentState = $("select[data-field-select-id='residentState'] option:selected").text();
  userInformation.SSN = "";
  $(".input-text[data-field-multiple-id='SSN']").each(function(i,el){
    if(i>0) {
      userInformation.SSN += "-";
    }
    userInformation.SSN += $(el).val();
  });
  // userInformation.checkboxSSN = $(".cb_input[data-field-checkbox-id='checkboxSSN']").prop("checked");
  userInformation.citizenshipStatus = $("ul.select-options[data-field-option-id='citizenshipStatus'] > .selected .option_info").text();
  userInformation.documentType = $("ul.select-options[data-field-option-id='documentType'] > .selected .option_info").text();
  // userInformation.userTestingID = $(".input-text[data-field-id='userTestingID']").val();

  // console.log(userInformation);
  localStorage.setItem('userInformation',JSON.stringify(userInformation));
  syncAllData();
}

function syncAllData() {
  $("[data-field-id='userTestingID']").text(userInformation.userTestingID?userInformation.userTestingID:"-");
  $("[data-field-id='firstName']").text(userInformation.firstName?userInformation.firstName:"-");
  $("[data-field-id='middleInitial']").text(userInformation.middleInitial?userInformation.middleInitial:"-");
  $("[data-field-id='lastName']").text(userInformation.lastName?userInformation.lastName:"-");
  $("[data-field-id='otherLastName']").text(userInformation.otherLastName?userInformation.otherLastName:"-");
  $("[data-field-id='dateOfBirth']").text(userInformation.dateOfBirth?userInformation.dateOfBirth:"-");
  $("[data-field-id='emailAddress']").text(userInformation.emailAddress?userInformation.emailAddress:"-");
  $("[data-field-id='phoneNumber']").text(userInformation.phoneNumber?userInformation.phoneNumber:"-");
  $("[data-field-id='physicalAddress']").text(userInformation.physicalAddress?userInformation.physicalAddress:"-");
  $("[data-field-id='aptNumber']").text(userInformation.aptNumber?userInformation.aptNumber:"-");
  $("[data-field-id='residentCity']").text(userInformation.residentCity?userInformation.residentCity:"-");
  $("[data-field-id='zipCode']").text(userInformation.zipCode?userInformation.zipCode:"-");
  $("[data-field-id='documentTitle']").text(userInformation.documentTitle?userInformation.documentTitle:"-");
  $("[data-field-id='issuingAuthority']").text(userInformation.issuingAuthority?userInformation.issuingAuthority:"-");
  $("[data-field-id='documentNumber']").text(userInformation.documentNumber?userInformation.documentNumber:"-");
  $("[data-field-id='documentExpirationDate']").text(userInformation.documentExpirationDate?userInformation.documentExpirationDate:"-");

  $("div[data-field-id='residentState']").text(userInformation.residentState?userInformation.residentState:"-");
  // KEEP THIS FIRST TO AVOID OVERWRITE
  $("div[data-field-id='SSN']").text(userInformation.SSN?userInformation.SSN:"-");
  $(".input-text[data-field-multiple-id='SSN']").each(function(i,el) {
    $(el).val(userInformation.SSN.split('-')[i]);
  });
  // $("div[data-field-id='checkboxSSN']").text(userInformation.checkboxSSN?userInformation.checkboxSSN:"-");
  $("div[data-field-id='citizenshipStatus']").text(userInformation.citizenshipStatus?userInformation.citizenshipStatus:"-");
  $(".filled_data[data-field-id='citizenshipStatus']").text(userInformation.citizenshipStatus?"x":"-");
  $("div[data-field-id='documentType']").text(userInformation.documentType?userInformation.documentType:"-");
  $(".filled_data[data-field-id='documentType']").text(userInformation.documentType?"x":"-");
}

function reloadAllData() {
  var userInformation1 = JSON.parse(localStorage.getItem('userInformation'));
  console.log(userInformation1);
  if(userInformation1 != null || userInformation1 != undefined) {
    $("[data-field-id='userTestingID']").val(userInformation1.userTestingID?userInformation1.userTestingID:"");
    $("[data-field-id='firstName']").val(userInformation1.firstName?userInformation1.firstName:"");
    $("[data-field-id='middleInitial']").val(userInformation1.middleInitial?userInformation1.middleInitial:"");
    $("[data-field-id='lastName']").val(userInformation1.lastName?userInformation1.lastName:"");
    $("[data-field-id='otherLastName']").val(userInformation1.otherLastName?userInformation1.otherLastName:"");
    $("[data-field-id='dateOfBirth']").val(userInformation1.dateOfBirth?userInformation1.dateOfBirth:"");
    $("[data-field-id='emailAddress']").val(userInformation1.emailAddress?userInformation1.emailAddress:"");
    $("[data-field-id='phoneNumber']").val(userInformation1.phoneNumber?userInformation1.phoneNumber:"");
    $("[data-field-id='physicalAddress']").val(userInformation1.physicalAddress?userInformation1.physicalAddress:"");
    $("[data-field-id='aptNumber']").val(userInformation1.aptNumber?userInformation1.aptNumber:"");
    $("[data-field-id='residentCity']").val(userInformation1.residentCity?userInformation1.residentCity:"");
    $("[data-field-id='zipCode']").val(userInformation1.zipCode?userInformation1.zipCode:"");
    $("[data-field-id='documentTitle']").val(userInformation1.documentTitle?userInformation1.documentTitle:"");
    $("[data-field-id='issuingAuthority']").val(userInformation1.issuingAuthority?userInformation1.issuingAuthority:"");
    $("[data-field-id='documentNumber']").val(userInformation1.documentNumber?userInformation1.documentNumber:"");
    $("[data-field-id='documentExpirationDate']").val(userInformation1.documentExpirationDate?userInformation1.documentExpirationDate:"");

    // $("div[data-field-id='residentState']").text(userInformation1.residentState?userInformation1.residentState:"");
    $("select[data-field-select-id='residentState']").val(userInformation1.residentState);

    // $("div[data-field-id='SSN']").text(userInformation1.SSN?userInformation1.SSN:"");
    $(".input-text[data-field-multiple-id='SSN']").each(function(i,el) {
      $(el).val(userInformation1.SSN.split('-')[i]);
    });
    // $("div[data-field-id='checkboxSSN']").text(userInformation1.checkboxSSN?userInformation1.checkboxSSN:"");
    $(".select-options[data-field-option-id='citizenshipStatus'] li:first-child").addClass("selected");
    // $(".filled_data[data-field-id='citizenshipStatus']").text(userInformation1.citizenshipStatus?"x":"-");
    $(".select-options[data-field-option-id='documentType'] li:first-child").addClass("selected");
    // $(".filled_data[data-field-id='documentType']").text(userInformation1.documentType?"x":"-");
  }
}

function initialize() {
  $(".library_pic").removeClass("selected");
  $(".input-text").val("");
  $(".cb_input").prop("checked", false);
  $("select[data-field-select-id='residentState']").val("-1");

  window.setTimeout(function() {
    $("body,html").css('height',($(window).height()));
  },300);
}

$(document).ready(function() {
  initialize();
  // reloadAllData();

  // $(".page").css("max-height", $(window).height());

  // console.log("smart forms");
  var TOTAL_PAGES = $(".pages").children().length;

  $("body").on("click", ".btn-begin", function() {
    $(".bottom-bar").removeClass("fixed");

    $(this).closest(".overlay_page").removeClass("showing");
    $("article, nav").removeClass("hide");
    saveAllData();

    startTime = Date.now();
    pageTime = Date.now();
    userInformation.startTime = String(new Date());
    userInformation.totalTimeSpent = String((Date.now() - startTime)/1000);
    mixpanel.track("Begin", userInformation);
  });

  function validatePageFilled() {
    $(".btn-next").addClass("disabled");
    // console.log($(".btn-next"));
    var target = $(".page.showing");

    var selectSelected = true;
    if(target.find("select").val() !== undefined && target.find("select").val() == "-1") {
      selectSelected = false;
    } else {
      selectSelected = true;
    }

    var textFilled = checkInputEmpty(target);
    // console.log(textFilled);

    if(textFilled && selectSelected) {
      $(".btn-next, .btn-begin").removeClass("disabled");
    } else {
      $(".btn-next, .btn-begin").addClass("disabled");
    }

  }

  $("body").on("change", "select[data-field-select-id='residentState']", function() {
    validatePageFilled();
  });

  $("body").on("input", ".tab_next", function() {
    var nextInput = $(".input-text[data-field-multiple-id='SSN']").get($(".input-text[data-field-multiple-id='SSN']").index(this) + 1);
    if($(this).val().trim().length == $(this).attr("maxlength")) {
      // console.log("max");
      nextInput.focus();
    }
  });

  $("body").on("input", ".page .input-text", function() {
    // var infoFilled = checkInputEmpty($(this).closest(".page"));
    validatePageFilled();

    if($(".btn-next").hasClass("disabled")) {
      // $("body,html").css('height',($(window).height())+'px');
      $(".bottom-bar").removeClass("fixed");
    } else {
      // $("body,html").css('height',"auto");
      $(".bottom-bar").addClass("fixed");
    }
  });

  function checkInputEmpty(parentEl) {
    var infoFilled = true;
    parentEl.find(".input-text:not(.optional_field)").each(function(i, d) {
      // console.log($(d).val());
      if($(d).val().trim() == "") {
        infoFilled = false;
      }
    });

    return infoFilled;
  }

  function isPageFilled(parentEl) {
    var pageFilled = true;
    parentEl.find(".input-text:not(.optional_field)").each(function(i, d) {
      // console.log($(d).val());
      if($(d).val().trim() == "") {
        pageFilled = false;
      }
    });

    var selectSelected = true;
    if(parentEl.find("select").val() !== undefined && parentEl.find("select").val() == "-1") {
      selectSelected = false;
    } else {
      selectSelected = true;
    }

    var element = parentEl.find(".select-options");
    var optionSelected = false;
    if(element.find("li").hasClass("selected")) {
      optionSelected = true;
    }

    if(parentEl.attr("data-page-name") === "page_upload_image" || parentEl.attr("data-page-name") === "page_signature") {
      return false;
    } else if(parentEl.attr("data-page-name") === "page_citizenship_status" ||
              parentEl.attr("data-page-name") === "page_employment_auth" ) {
      return optionSelected;
    } else {
      return (pageFilled && selectSelected);
    }
  }

  $(".bottom-bar").on("click", ".btn-next", function() {
    var target = $(".page.showing");
    var nextTarget = target.next();
    var currentPage = parseInt(target.attr("data-page-num"));
    var nextPage = currentPage + 1;

    $(".btn-next").addClass("disabled");
    $(".bottom-bar").removeClass("fixed");

    $(".btn-next").text("Next");
    $(".btn-next").addClass("btn-primary").removeClass("btn-main");
    $(".bottom-bar > div").removeClass("hide");
    if(nextPage <= TOTAL_PAGES) {
      $(".page").removeClass("showing");
      $(".page[data-page-num=" + nextPage + "]").addClass("showing");
      $(".pages").css("transform", "translateX(" + (currentPage * -100) + "%)");
    }

    $(".edit_form").addClass("hidden");

    if(nextTarget.attr("data-page-name") === "page_pre_sign") {
      $(".btn-next").text("Sign");
    } else if(nextTarget.attr("data-page-name") === "page_upload_image") {
      if($(".passport_img").hasClass("hidden")) {
        $(".btn-next").text("Upload");
      } else {
        $(".btn-next").removeClass("disabled");
      }
    } else if(nextTarget.attr("data-page-name") === "page_signature") {
      $(".btn-next").text("Adopt & Sign");
      $(".bottom-bar > div").addClass("hide");
      $(".btn-next").removeClass("hide");

      // console.log($("img.signature").hasClass("hidden"));
      // if($("img.signature").hasClass("hidden")) {
      //   $(".btn-next").addClass("disabled");
      // } else {
      //   $(".btn-next").removeClass("disabled");
      // }
    } else if(nextTarget.attr("data-page-name") === "page_info_filled") {
      $(".btn-next").removeClass("btn-primary").addClass("btn-main").text("Finish");
      $(".bottom-bar > div").addClass("hide");
      $(".btn-next").removeClass("hide");

      $(".edit_form").removeClass("hidden");
    } else if(target.attr("data-page-name") === "page_info_filled") {
      $(".overlay_page.document_completed").addClass("showing");
      window.setTimeout(function() {
        $(".overlay_page.document_completed").removeClass("showing");
      }, 2500);

      $(".bottom-bar > .progress-indicator").addClass("hide");
      $(".btn-next").removeClass("hide btn-next disabled").addClass("btn-share").text("Share");
      $(".btn-prev").removeClass("hide btn-prev").addClass("btn-close").text("Close");

      $("nav .menu .menu-item").addClass("hidden");
      $("nav .menu .post_finish_menu").removeClass("hidden");
    }

    // console.log(nextTarget.attr("data-page-name"));
    if(nextTarget.attr("data-page-name") == "review_page" ||
    nextTarget.attr("data-page-name") === "page_pre_sign" ||
    nextTarget.attr("data-page-name") === "page_info_filled") {
      $(".btn-next").removeClass("disabled");
    }

    if(nextTarget.attr("data-page-title") && nextTarget.attr("data-page-title") != "") {
      $("nav .document-title").text(nextTarget.attr("data-page-title"));
    } else if(target.attr("data-page-title") == "Submit I-9 Form") {
      $("nav .document-title").text("Completed I-9 Form");
    } else {
      $("nav .document-title").text("I-9 Form");
    }

    animateNumber($(".progress-indicator .number"), parseInt($(".progress-indicator .number").text()), (nextPage/TOTAL_PAGES)*100);

    saveAllData();

    // console.log(isPageFilled(nextTarget));
    if(isPageFilled(nextTarget)) {
      $(".btn-next").removeClass("disabled");
    }

    timeSpentOnPage(currentPage, String((Date.now() - pageTime)/1000));
    pageTime = Date.now();

    userInformation.pageNumber = currentPage;
    userInformation.totalTimeSpent = String((Date.now() - startTime)/1000);
    mixpanel.track("Page " + currentPage, userInformation);

    if(target.attr("data-page-name") === "page_info_filled") {
      userInformation.finishTime = String(new Date());
      userInformation.totalTimeSpent = String((Date.now() - startTime)/1000);
      mixpanel.track("End", userInformation);
    }
  });

  function timeSpentOnPage(pageNumber, pageTime) {
    userInformation["timeOnPage" + pageNumber] = pageTime;
  }

  function swapWidthHeight(elem) {
    var newWidth, newHeight;
    // console.log($(window).height());
    if(elem.hasClass("landscape")) {
      newWidth = elem.height();
      newHeight = elem.width();
      // $(".page").css("height", newHeight - 90);
      $(".bottom-bar").css("top", newHeight - 45);
    } else {
      newWidth = "auto";
      newHeight = "auto";
      // $(".page").css("height", "auto");
      $(".bottom-bar").css("top", "auto");
    }
    elem.width(newWidth);
    // elem.height($("nav").height() + $("article").height());

    // console.log($("body").scrollTop());
    // $("body").scrollLeft("1000px");
    $('html').scrollLeft(1000);
    // elem.scrollTop("0px");
  }

  $(".bottom-bar").on("click", ".btn", function() {
    $("body, article, .page").scrollTop(0);
    $(window).scrollTop(0);
  });
  $("body").on("click", ".edit_form", function() {
    var target = $(".page.showing");

    if(target.attr("data-page-name") === "page_info_filled") {
      // CLICK PREV 3 TIMES TO GO TO EDIT PAGE
      $(".btn-prev").click();
      $(".btn-prev").click();
      $(".btn-prev").click();
    }
  });

  $(".bottom-bar").on("click", ".btn-prev", function() {
    var target = $(".page.showing");
    var currentPage = parseInt(target.attr("data-page-num"));
    var prevPage = currentPage - 1;
    var prevTarget = target.prev();

    // if(currentPage == 2) {
    //   $(".bottom-bar > div").addClass("hide");
    //   $(".btn-next").removeClass("hide").text("Start I-9");
    // }
    if(prevPage > 0) {
      $(".page").removeClass("showing");
      $(".page[data-page-num=" + prevPage + "]").addClass("showing");
      $(".pages").css("transform", "translateX(" + ((prevPage - 1) * -100) + "%)");
    }

    if(prevTarget.attr("data-page-title") && prevTarget.attr("data-page-title") != "") {
      $("nav .document-title").text(prevTarget.attr("data-page-title"));
    } else {
      $("nav .document-title").text("I-9 Form");
    }

    $(".btn-next").removeClass("disabled");
    $(".btn-next").addClass("btn-primary").removeClass("btn-main");
    // console.log(prevTarget.attr("data-page-name"));

    if(prevTarget.attr("data-page-name") === "page_pre_sign") {
      $(".btn-next").text("Sign");
    } else if(prevTarget.attr("data-page-name") === "page_signature") {
      $(".btn-next").text("Adopt & Sign");
      $(".bottom-bar > div").addClass("hide");
      $(".btn-next").removeClass("hide");

      if($("img.signature").hasClass("hidden")) {
        $(".btn-next").addClass("disabled");
      } else {
        $(".btn-next").removeClass("disabled");
      }
    } else if(prevTarget.attr("data-page-name") === "page_info_filled") {
      // $(".btn-next").removeClass("btn-primary").addClass("btn-main").text("Finish");
      $(".bottom-bar > div").addClass("hide");
      $(".btn-next").removeClass("hide");
    } else if(prevTarget.attr("data-page-name") === "page_upload_image") {
      $(".btn-next").removeClass("disabled");
    } else if(prevTarget.attr("data-page-name") === "page_start") {
      $(".bottom-bar > div").addClass("hide");
      $(".btn-next").removeClass("hide").text("Start I-9");
    } else {
      $(".bottom-bar > div").removeClass("hide");
      $(".btn-next").text("Next");
    }

    animateNumber($(".progress-indicator .number"), parseInt($(".progress-indicator .number").text()), (prevPage/TOTAL_PAGES)*100);
  });

  // $("article").on("click", ".input-text", function() {
  //   var element = $(this);
  //   setTimeout(function() {
  //     // $(".page").scrollTop(element.position().top - 20);
  //   }, 300);
  // });
  $("article").on("click", ".signature_placeholder", function() {
    $(".btn-next").click();
  });


  function animateNumber(element, fromNumber1, toNumber1) {
    var fromNumber = parseInt(fromNumber1);
    var toNumber = parseInt(toNumber1);
  	element.text(fromNumber);

  	if(toNumber > fromNumber) {
  		animateNumber(element, fromNumber, toNumber-1);
  		window.setTimeout(function() {
  			element.text(round5(toNumber));
  		}, toNumber * 500/(fromNumber+20));
  	}

  	if(toNumber < fromNumber) {
      animateNumber(element, fromNumber, toNumber+1);
  		window.setTimeout(function() {
  			element.text(round5(toNumber));
  		}, (500 * fromNumber) / toNumber);
  	}
  };

  $(".select-options").on("click", "li", function() {
    var element = $(this);
    var parentEl = $(this).closest(".select-options");
    parentEl.find("li").removeClass("selected");
    if(!element.hasClass("feature_unavailable")) {
      element.addClass("selected");
      $(".btn-next").removeClass("disabled");
    } else {
      $(".btn-next").addClass("disabled");
    }
  });

  $("body").on("click", ".library_pic", function() {
    var element = $(this);
    $(".library_pic").removeClass("selected");
    element.addClass("selected");
    $(".btn-use-photo").removeClass("hidden");
  });

  function round5(x) {
    return Math.floor(x/5)*5
    // return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5;
  }

  $(".pages").on("click", ".upload_file", function() {
    $(".camera_library").addClass("showing");
  });
  $(".overlay_page").on("click", ".close_overlay", function() {
    $(this).closest(".overlay_page").removeClass("showing");
  });
  $(".overlay_page").on("click", ".btn-use-photo", function() {
    $(".upload_img_placeholder").addClass("hidden");
    $(".passport_img").removeClass("hidden");

    $(".btn.upload-image").text("Upload New Image");
    $(".btn-next").removeClass("disabled");
  });

  $("body").on("click", ".document-comment", function() {
    // JUST MAKING IT FOOLPROOF
    $(".document-comment").toggleClass("selected");
    if($(this).hasClass("selected")) {
      $(".overlay_comments").addClass("showing");
    } else {
      $(".overlay_comments").removeClass("showing");
    }
  });
  $("body").on("click", ".overlay_comments .icon-times", function() {
    // $(".overlay_comments").removeClass("showing");
    $(".document-comment").click();
  });

  $("body").on("click", ".disclosure_link", function() {
    $(".overlay_disclosure").addClass("showing");
  });
  $("body").on("click", ".overlay_disclosure .icon-times", function() {
    $(this).closest(".overlay_page").removeClass("showing");
  });
  $("body").on("click", ".document_completed", function() {
    $(this).removeClass("showing").addClass("hidden");
  });

  $("body").on("touchstart click", ".sign_pad", function() {
    $(".signature_page .signature").removeClass("hidden");
    $(".sign_pad_clear").removeClass("hidden");
    $(".sign_pad_instruction").addClass("hidden");
    $(".btn-next").removeClass("disabled");
  });
  $("body").on("click", ".sign_pad_clear", function() {
    $(".signature_page .signature").addClass("hidden");
    $(".sign_pad_clear").addClass("hidden");
    $(".sign_pad_instruction").removeClass("hidden");
    $(".btn-next").addClass("disabled");
  });

  $("nav").on("click", ".document-menu, .menu-item", function() {
    $(".menu_options").toggleClass("hidden");
  });

  $("body").on("click", ".btn-share", function() {
    if(!$(".document_completed").hasClass("showing")) {
      $(".overlay_share").addClass("showing");
    }
  });
  $("body").on("click", ".overlay_share", function() {
    $(".overlay_share").removeClass("showing");
  });

  // $(".overlay_share").on("click", ".icon", function() {
  //   $(".overlay_page").removeClass("showing");
  //   $(".end_of_prototype").removeClass("hidden");
  //   $("article, nav, .bottom-bar").addClass("hidden");
  // });
  $("body").on("click", ".btn-close, .overlay_share .icon", function() {
    $(".overlay_page").removeClass("showing");
    $(".end_of_prototype").removeClass("hidden");
    $("article, nav, .bottom-bar").addClass("hidden");
  });

  var toast_msg_timer;
  $("body").on("click", ".feature_unavailable", function() {
    $(".msg_feature_unavailable").removeClass("hide");

    window.clearTimeout(toast_msg_timer);
    toast_msg_timer = window.setTimeout(function() {
      $(".msg_feature_unavailable").addClass("hide");
    }, 1100);
  });

  $("body").on("click", ".disclosure_link, .btn-prev, .feature_unavailable, .document-comment, .document-menu", function() {
    // console.log($(this).attr("data-feature-code"));
    userInformation.otherClicks.push($(this).attr("data-feature-code"));
    // var currentPage = $(".page.showing").attr("data-page-num");
    // userInformation.otherClicks.push({$(this).attr("data-feature-code"): currentPage.toString()});
  });

  $(".input-text").on("keydown", function(event) {
    var targets = $(".page.showing .input-text");
    var nextInput = targets.get(targets.index(this) + 1);

    if (event.which == 13) {
      event.preventDefault();
      nextInput.focus();

      // console.log($(nextInput).attr("data-field-select-id"));
      // console.log($(nextInput).attr("type"));
      // if($(nextInput).attr("data-field-select-id") == "residentState" || $(nextInput).attr("type") == "date") {
      //   $(nextInput).click();
      // }
    }
  });

  // $('.review_information').slick({
  //   arrows: false,
  //   dots: true,
  //   infinite: false
  // });
});
