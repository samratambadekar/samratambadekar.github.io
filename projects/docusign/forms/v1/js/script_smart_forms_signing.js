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
  // userInformation.userTestingID = $(".preview_mode #userTestingID").val().replace(/"/g, "'");
  userInformation.userTestingID = $(".preview_mode .input-text[data-field-id='userTestingID']").val();
  userInformation.firstName = $(".preview_mode .input-text[data-field-id='firstName']").val();
  userInformation.middleInitial = $(".preview_mode .input-text[data-field-id='middleInitial']").val();
  userInformation.lastName = $(".preview_mode .input-text[data-field-id='lastName']").val();
  userInformation.otherLastName = $(".preview_mode .input-text[data-field-id='otherLastName']").val();
  userInformation.dateOfBirth = $(".preview_mode .input-text[data-field-id='dateOfBirth']").val();
  userInformation.emailAddress = $(".preview_mode .input-text[data-field-id='emailAddress']").val();
  userInformation.phoneNumber = $(".preview_mode .input-text[data-field-id='phoneNumber']").val();
  userInformation.physicalAddress = $(".preview_mode .input-text[data-field-id='physicalAddress']").val();
  userInformation.aptNumber = $(".preview_mode .input-text[data-field-id='aptNumber']").val();
  userInformation.residentCity = $(".preview_mode .input-text[data-field-id='residentCity']").val();
  userInformation.zipCode = $(".preview_mode .input-text[data-field-id='zipCode']").val();
  userInformation.documentTitle = $(".preview_mode .input-text[data-field-id='documentTitle']").val();
  userInformation.issuingAuthority = $(".preview_mode .input-text[data-field-id='issuingAuthority']").val();
  userInformation.documentNumber = $(".preview_mode .input-text[data-field-id='documentNumber']").val();
  userInformation.documentExpirationDate = $(".preview_mode .input-text[data-field-id='documentExpirationDate']").val();

  userInformation.residentState = $(".preview_mode select[data-field-select-id='residentState']").val();
  // userInformation.residentState = $(".preview_mode select[data-field-select-id='residentState'] option:selected").text();
  userInformation.SSN = "";
  $(".preview_mode .input-text[data-field-multiple-id='SSN']").each(function(i,el){
    if(i>0) {
      userInformation.SSN += "-";
    }
    userInformation.SSN += $(el).val();
  });
  // userInformation.checkboxSSN = $(".preview_mode .cb_input[data-field-checkbox-id='checkboxSSN']").prop("checked");
  userInformation.citizenshipStatus = $(".preview_mode ul.select-options[data-field-option-id='citizenshipStatus'] > .selected .option_info").text();
  userInformation.documentType = $(".preview_mode ul.select-options[data-field-option-id='documentType'] > .selected .option_info").text();
  // userInformation.userTestingID = $(".preview_mode .input-text[data-field-id='userTestingID']").val();

  // console.log(userInformation);
  localStorage.setItem('userInformation',JSON.stringify(userInformation));
  syncAllData();
}

function syncAllData() {
  $(".preview_mode [data-field-id='userTestingID']").text(userInformation.userTestingID?userInformation.userTestingID:"-");
  $(".preview_mode [data-field-id='firstName']").text(userInformation.firstName?userInformation.firstName:"-");
  $(".preview_mode [data-field-id='middleInitial']").text(userInformation.middleInitial?userInformation.middleInitial:"-");
  $(".preview_mode [data-field-id='lastName']").text(userInformation.lastName?userInformation.lastName:"-");
  $(".preview_mode [data-field-id='otherLastName']").text(userInformation.otherLastName?userInformation.otherLastName:"-");
  $(".preview_mode [data-field-id='dateOfBirth']").text(userInformation.dateOfBirth?userInformation.dateOfBirth:"-");
  $(".preview_mode [data-field-id='emailAddress']").text(userInformation.emailAddress?userInformation.emailAddress:"-");
  $(".preview_mode [data-field-id='phoneNumber']").text(userInformation.phoneNumber?userInformation.phoneNumber:"-");
  $(".preview_mode [data-field-id='physicalAddress']").text(userInformation.physicalAddress?userInformation.physicalAddress:"-");
  $(".preview_mode [data-field-id='aptNumber']").text(userInformation.aptNumber?userInformation.aptNumber:"-");
  $(".preview_mode [data-field-id='residentCity']").text(userInformation.residentCity?userInformation.residentCity:"-");
  $(".preview_mode [data-field-id='zipCode']").text(userInformation.zipCode?userInformation.zipCode:"-");
  $(".preview_mode [data-field-id='documentTitle']").text(userInformation.documentTitle?userInformation.documentTitle:"-");
  $(".preview_mode [data-field-id='issuingAuthority']").text(userInformation.issuingAuthority?userInformation.issuingAuthority:"-");
  $(".preview_mode [data-field-id='documentNumber']").text(userInformation.documentNumber?userInformation.documentNumber:"-");
  $(".preview_mode [data-field-id='documentExpirationDate']").text(userInformation.documentExpirationDate?userInformation.documentExpirationDate:"-");

  $(".preview_mode div[data-field-id='residentState']").text(userInformation.residentState?userInformation.residentState:"-");
  // KEEP THIS FIRST TO AVOID OVERWRITE
  $(".preview_mode div[data-field-id='SSN']").text(userInformation.SSN?userInformation.SSN:"-");
  $(".preview_mode .input-text[data-field-multiple-id='SSN']").each(function(i,el) {
    $(el).val(userInformation.SSN.split('-')[i]);
  });
  // $(".preview_mode div[data-field-id='checkboxSSN']").text(userInformation.checkboxSSN?userInformation.checkboxSSN:"-");
  $(".preview_mode div[data-field-id='citizenshipStatus']").text(userInformation.citizenshipStatus?userInformation.citizenshipStatus:"-");
  $(".preview_mode .filled_data[data-field-id='citizenshipStatus']").text(userInformation.citizenshipStatus?"x":"-");
  $(".preview_mode div[data-field-id='documentType']").text(userInformation.documentType?userInformation.documentType:"-");
  $(".preview_mode .filled_data[data-field-id='documentType']").text(userInformation.documentType?"x":"-");
}

function reloadAllData() {
  var userInformation1 = JSON.parse(localStorage.getItem('userInformation'));
  console.log(userInformation1);
  if(userInformation1 != null || userInformation1 != undefined) {
    $(".preview_mode [data-field-id='userTestingID']").val(userInformation1.userTestingID?userInformation1.userTestingID:"");
    $(".preview_mode [data-field-id='firstName']").val(userInformation1.firstName?userInformation1.firstName:"");
    $(".preview_mode [data-field-id='middleInitial']").val(userInformation1.middleInitial?userInformation1.middleInitial:"");
    $(".preview_mode [data-field-id='lastName']").val(userInformation1.lastName?userInformation1.lastName:"");
    $(".preview_mode [data-field-id='otherLastName']").val(userInformation1.otherLastName?userInformation1.otherLastName:"");
    $(".preview_mode [data-field-id='dateOfBirth']").val(userInformation1.dateOfBirth?userInformation1.dateOfBirth:"");
    $(".preview_mode [data-field-id='emailAddress']").val(userInformation1.emailAddress?userInformation1.emailAddress:"");
    $(".preview_mode [data-field-id='phoneNumber']").val(userInformation1.phoneNumber?userInformation1.phoneNumber:"");
    $(".preview_mode [data-field-id='physicalAddress']").val(userInformation1.physicalAddress?userInformation1.physicalAddress:"");
    $(".preview_mode [data-field-id='aptNumber']").val(userInformation1.aptNumber?userInformation1.aptNumber:"");
    $(".preview_mode [data-field-id='residentCity']").val(userInformation1.residentCity?userInformation1.residentCity:"");
    $(".preview_mode [data-field-id='zipCode']").val(userInformation1.zipCode?userInformation1.zipCode:"");
    $(".preview_mode [data-field-id='documentTitle']").val(userInformation1.documentTitle?userInformation1.documentTitle:"");
    $(".preview_mode [data-field-id='issuingAuthority']").val(userInformation1.issuingAuthority?userInformation1.issuingAuthority:"");
    $(".preview_mode [data-field-id='documentNumber']").val(userInformation1.documentNumber?userInformation1.documentNumber:"");
    $(".preview_mode [data-field-id='documentExpirationDate']").val(userInformation1.documentExpirationDate?userInformation1.documentExpirationDate:"");

    // $(".preview_mode div[data-field-id='residentState']").text(userInformation1.residentState?userInformation1.residentState:"");
    $(".preview_mode select[data-field-select-id='residentState']").val(userInformation1.residentState);

    // $(".preview_mode div[data-field-id='SSN']").text(userInformation1.SSN?userInformation1.SSN:"");
    $(".preview_mode .input-text[data-field-multiple-id='SSN']").each(function(i,el) {
      $(el).val(userInformation1.SSN.split('-')[i]);
    });
    // $(".preview_mode div[data-field-id='checkboxSSN']").text(userInformation1.checkboxSSN?userInformation1.checkboxSSN:"");
    $(".preview_mode .select-options[data-field-option-id='citizenshipStatus'] li:first-child").addClass("selected");
    // $(".preview_mode .filled_data[data-field-id='citizenshipStatus']").text(userInformation1.citizenshipStatus?"x":"-");
    $(".preview_mode .select-options[data-field-option-id='documentType'] li:first-child").addClass("selected");
    // $(".preview_mode .filled_data[data-field-id='documentType']").text(userInformation1.documentType?"x":"-");
  }
}

function initialize() {
  $(".preview_mode .library_pic").removeClass("selected");
  // $(".preview_mode .input-text").val("");
  $(".preview_mode .cb_input").prop("checked", false);
  $(".preview_mode select[data-field-select-id='residentState']").val("-1");

  // window.setTimeout(function() {
  //   $(".preview_mode").css('height',($(window).height()));
  // },300);
}

$(document).ready(function() {
  initialize();
  // reloadAllData();

  // $(".preview_mode .page").css("max-height", $(window).height());

  // console.log("smart forms");
  var TOTAL_PAGES = $(".preview_mode .pages").children().length;

  $(".preview_mode").on("click", ".btn-begin", function() {
    $(".preview_mode .bottom-bar").removeClass("fixed");

    $(this).closest(".overlay_page").removeClass("showing");
    $(".preview_mode article, .preview_mode nav").removeClass("hide");
    saveAllData();

    startTime = Date.now();
    pageTime = Date.now();
    userInformation.startTime = String(new Date());
    userInformation.totalTimeSpent = String((Date.now() - startTime)/1000);
    // mixpanel.track("Begin", userInformation);
  });

  function validatePageFilled() {
    $(".preview_mode .btn-next").addClass("disabled");
    // console.log($(".preview_mode .btn-next"));
    var target = $(".preview_mode .page.showing");

    var selectSelected = true;
    if(target.find("select").val() !== undefined && target.find("select").val() == "-1") {
      selectSelected = false;
    } else {
      selectSelected = true;
    }

    var textFilled = checkInputEmpty(target);
    // console.log(textFilled);

    if(textFilled && selectSelected) {
      $(".preview_mode .btn-next, .preview_mode .btn-begin").removeClass("disabled");
    } else {
      $(".preview_mode .btn-next, .preview_mode .btn-begin").addClass("disabled");
    }

  }

  $(".preview_mode").on("change", "select[data-field-select-id='residentState']", function() {
    validatePageFilled();
  });

  $(".preview_mode").on("input", ".tab_next", function() {
    var nextInput = $(".preview_mode .input-text[data-field-multiple-id='SSN']").get($(".preview_mode .input-text[data-field-multiple-id='SSN']").index(this) + 1);
    if($(this).val().trim().length == $(this).attr("maxlength")) {
      // console.log("max");
      nextInput.focus();
    }
  });

  $(".preview_mode").on("input", ".page .input-text", function() {
    // var infoFilled = checkInputEmpty($(this).closest(".page"));
    validatePageFilled();

    if($(".preview_mode .btn-next").hasClass("disabled")) {
      // $(".preview_mode,html").css('height',($(window).height())+'px');
      $(".preview_mode .bottom-bar").removeClass("fixed");
    } else {
      // $(".preview_mode,html").css('height',"auto");
      $(".preview_mode .bottom-bar").addClass("fixed");
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

  $(".preview_mode .bottom-bar").on("click", ".btn-next", function() {
    var target = $(".preview_mode .page.showing");
    var nextTarget = target.next();
    var currentPage = parseInt(target.attr("data-page-num"));
    var nextPage = currentPage + 1;

    $(".preview_mode .btn-next").addClass("disabled");
    $(".preview_mode .bottom-bar").removeClass("fixed");

    $(".preview_mode .btn-next").text("Next");
    $(".preview_mode .btn-next").addClass("btn-primary").removeClass("btn-main");
    $(".preview_mode .bottom-bar > div").removeClass("hide");
    if(nextPage <= TOTAL_PAGES) {
      $(".preview_mode .page").removeClass("showing");
      $(".preview_mode .page[data-page-num=" + nextPage + "]").addClass("showing");
      $(".preview_mode .pages").css("transform", "translateX(" + (currentPage * -100) + "%)");
    }

    $(".preview_mode .edit_form").addClass("hidden");

    if(nextTarget.attr("data-page-name") === "page_pre_sign") {
      $(".preview_mode .btn-next").text("Sign");
    } else if(nextTarget.attr("data-page-name") === "page_upload_image") {
      if($(".preview_mode .passport_img").hasClass("hidden")) {
        $(".preview_mode .btn-next").text("Upload");
      } else {
        $(".preview_mode .btn-next").removeClass("disabled");
      }
    } else if(nextTarget.attr("data-page-name") === "page_signature") {
      $(".preview_mode .btn-next").text("Adopt & Sign");
      $(".preview_mode .bottom-bar > div").addClass("hide");
      $(".preview_mode .btn-next").removeClass("hide");

      // console.log($(".preview_mode img.signature").hasClass("hidden"));
      // if($(".preview_mode img.signature").hasClass("hidden")) {
      //   $(".preview_mode .btn-next").addClass("disabled");
      // } else {
      //   $(".preview_mode .btn-next").removeClass("disabled");
      // }
    } else if(nextTarget.attr("data-page-name") === "page_info_filled") {
      $(".preview_mode .btn-next").removeClass("btn-primary").addClass("btn-main").text("Finish");
      $(".preview_mode .bottom-bar > div").addClass("hide");
      $(".preview_mode .btn-next").removeClass("hide");

      $(".preview_mode .edit_form").removeClass("hidden");
    } else if(target.attr("data-page-name") === "page_info_filled") {
      $(".preview_mode .overlay_page.document_completed").addClass("showing");
      window.setTimeout(function() {
        $(".preview_mode .overlay_page.document_completed").removeClass("showing");
      }, 2500);

      $(".preview_mode .bottom-bar > .progress-indicator").addClass("hide");
      $(".preview_mode .btn-next").removeClass("hide btn-next disabled").addClass("btn-share").text("Share");
      $(".preview_mode .btn-prev").removeClass("hide btn-prev").addClass("btn-close").text("Close");

      $(".preview_mode nav .menu .menu-item").addClass("hidden");
      $(".preview_mode nav .menu .post_finish_menu").removeClass("hidden");
    }

    // console.log(nextTarget.attr("data-page-name"));
    if(nextTarget.attr("data-page-name") == "review_page" ||
    nextTarget.attr("data-page-name") === "page_pre_sign" ||
    nextTarget.attr("data-page-name") === "page_info_filled") {
      $(".preview_mode .btn-next").removeClass("disabled");
    }

    if(nextTarget.attr("data-page-title") && nextTarget.attr("data-page-title") != "") {
      $(".preview_mode nav .document-title").text(nextTarget.attr("data-page-title"));
    } else if(target.attr("data-page-title") == "Submit I-9 Form") {
      $(".preview_mode nav .document-title").text("Completed I-9 Form");
    } else {
      $(".preview_mode nav .document-title").text("I-9 Form");
    }

    animateNumber($(".preview_mode .progress-indicator .number"), parseInt($(".preview_mode .progress-indicator .number").text()), (nextPage/TOTAL_PAGES)*100);

    saveAllData();

    // console.log(isPageFilled(nextTarget));
    if(isPageFilled(nextTarget)) {
      $(".preview_mode .btn-next").removeClass("disabled");
    }

    timeSpentOnPage(currentPage, String((Date.now() - pageTime)/1000));
    pageTime = Date.now();

    userInformation.pageNumber = currentPage;
    userInformation.totalTimeSpent = String((Date.now() - startTime)/1000);
    // mixpanel.track("Page " + currentPage, userInformation);

    if(target.attr("data-page-name") === "page_info_filled") {
      userInformation.finishTime = String(new Date());
      userInformation.totalTimeSpent = String((Date.now() - startTime)/1000);
      // mixpanel.track("End", userInformation);
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
      // $(".preview_mode .page").css("height", newHeight - 90);
      $(".preview_mode .bottom-bar").css("top", newHeight - 45);
    } else {
      newWidth = "auto";
      newHeight = "auto";
      // $(".preview_mode .page").css("height", "auto");
      $(".preview_mode .bottom-bar").css("top", "auto");
    }
    elem.width(newWidth);
    // elem.height($(".preview_mode nav").height() + $(".preview_mode article").height());

    // console.log($(".preview_mode").scrollTop());
    // $(".preview_mode").scrollLeft("1000px");
    $('html').scrollLeft(1000);
    // elem.scrollTop("0px");
  }

  $(".preview_mode .bottom-bar").on("click", ".btn", function() {
    $(".preview_mode, article, .page").scrollTop(0);
    $(window).scrollTop(0);
  });
  $(".preview_mode").on("click", ".edit_form", function() {
    var target = $(".preview_mode .page.showing");

    if(target.attr("data-page-name") === "page_info_filled") {
      // CLICK PREV 3 TIMES TO GO TO EDIT PAGE
      $(".preview_mode .btn-prev").click();
      $(".preview_mode .btn-prev").click();
      $(".preview_mode .btn-prev").click();
    }
  });

  $(".preview_mode .bottom-bar").on("click", ".btn-prev", function() {
    var target = $(".preview_mode .page.showing");
    var currentPage = parseInt(target.attr("data-page-num"));
    var prevPage = currentPage - 1;
    var prevTarget = target.prev();

    // if(currentPage == 2) {
    //   $(".preview_mode .bottom-bar > div").addClass("hide");
    //   $(".preview_mode .btn-next").removeClass("hide").text("Start I-9");
    // }
    if(prevPage > 0) {
      $(".preview_mode .page").removeClass("showing");
      $(".preview_mode .page[data-page-num=" + prevPage + "]").addClass("showing");
      $(".preview_mode .pages").css("transform", "translateX(" + ((prevPage - 1) * -100) + "%)");
    }

    if(prevTarget.attr("data-page-title") && prevTarget.attr("data-page-title") != "") {
      $(".preview_mode nav .document-title").text(prevTarget.attr("data-page-title"));
    } else {
      $(".preview_mode nav .document-title").text("I-9 Form");
    }

    $(".preview_mode .btn-next").removeClass("disabled");
    $(".preview_mode .btn-next").addClass("btn-primary").removeClass("btn-main");
    // console.log(prevTarget.attr("data-page-name"));

    if(prevTarget.attr("data-page-name") === "page_pre_sign") {
      $(".preview_mode .btn-next").text("Sign");
    } else if(prevTarget.attr("data-page-name") === "page_signature") {
      $(".preview_mode .btn-next").text("Adopt & Sign");
      $(".preview_mode .bottom-bar > div").addClass("hide");
      $(".preview_mode .btn-next").removeClass("hide");

      if($(".preview_mode img.signature").hasClass("hidden")) {
        $(".preview_mode .btn-next").addClass("disabled");
      } else {
        $(".preview_mode .btn-next").removeClass("disabled");
      }
    } else if(prevTarget.attr("data-page-name") === "page_info_filled") {
      // $(".preview_mode .btn-next").removeClass("btn-primary").addClass("btn-main").text("Finish");
      $(".preview_mode .bottom-bar > div").addClass("hide");
      $(".preview_mode .btn-next").removeClass("hide");
    } else if(prevTarget.attr("data-page-name") === "page_upload_image") {
      $(".preview_mode .btn-next").removeClass("disabled");
    } else if(prevTarget.attr("data-page-name") === "page_start") {
      $(".preview_mode .bottom-bar > div").addClass("hide");
      $(".preview_mode .btn-next").removeClass("hide").text("Start I-9");
    } else {
      $(".preview_mode .bottom-bar > div").removeClass("hide");
      $(".preview_mode .btn-next").text("Next");
    }

    animateNumber($(".preview_mode .progress-indicator .number"), parseInt($(".preview_mode .progress-indicator .number").text()), (prevPage/TOTAL_PAGES)*100);
  });

  // $(".preview_mode article").on("click", ".input-text", function() {
  //   var element = $(this);
  //   setTimeout(function() {
  //     // $(".preview_mode .page").scrollTop(element.position().top - 20);
  //   }, 300);
  // });
  $(".preview_mode article").on("click", ".signature_placeholder", function() {
    $(".preview_mode .btn-next").click();
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

  $(".preview_mode .select-options").on("click", "li", function() {
    var element = $(this);
    var parentEl = $(this).closest(".select-options");
    parentEl.find("li").removeClass("selected");
    if(!element.hasClass("feature_unavailable")) {
      element.addClass("selected");
      $(".preview_mode .btn-next").removeClass("disabled");
    } else {
      $(".preview_mode .btn-next").addClass("disabled");
    }
  });

  $(".preview_mode").on("click", ".library_pic", function() {
    var element = $(this);
    $(".preview_mode .library_pic").removeClass("selected");
    element.addClass("selected");
    $(".preview_mode .btn-use-photo").removeClass("hidden");
  });

  function round5(x) {
    return Math.floor(x/5)*5
    // return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5;
  }

  $(".preview_mode .pages").on("click", ".upload_file", function() {
    $(".preview_mode .camera_library").addClass("showing");
  });
  $(".preview_mode .overlay_page").on("click", ".close_overlay", function() {
    $(this).closest(".overlay_page").removeClass("showing");
  });
  $(".preview_mode .overlay_page").on("click", ".btn-use-photo", function() {
    $(".preview_mode .upload_img_placeholder").addClass("hidden");
    $(".preview_mode .passport_img").removeClass("hidden");

    $(".preview_mode .btn.upload-image").text("Upload New Image");
    $(".preview_mode .btn-next").removeClass("disabled");
  });

  $(".preview_mode").on("click", ".document-comment", function() {
    // JUST MAKING IT FOOLPROOF
    $(".preview_mode .document-comment").toggleClass("selected");
    if($(this).hasClass("selected")) {
      $(".preview_mode .overlay_comments").addClass("showing");
    } else {
      $(".preview_mode .overlay_comments").removeClass("showing");
    }
  });
  $(".preview_mode").on("click", ".overlay_comments .icon-times", function() {
    // $(".preview_mode .overlay_comments").removeClass("showing");
    $(".preview_mode .document-comment").click();
  });

  $(".preview_mode").on("click", ".disclosure_link", function() {
    $(".preview_mode .overlay_disclosure").addClass("showing");
  });
  $(".preview_mode").on("click", ".overlay_disclosure .icon-times", function() {
    $(this).closest(".overlay_page").removeClass("showing");
  });
  $(".preview_mode").on("click", ".document_completed", function() {
    $(this).removeClass("showing").addClass("hidden");
  });

  $(".preview_mode").on("touchstart click", ".sign_pad", function() {
    $(".preview_mode .signature_page .signature").removeClass("hidden");
    $(".preview_mode .sign_pad_clear").removeClass("hidden");
    $(".preview_mode .sign_pad_instruction").addClass("hidden");
    $(".preview_mode .btn-next").removeClass("disabled");
  });
  $(".preview_mode").on("click", ".sign_pad_clear", function() {
    $(".preview_mode .signature_page .signature").addClass("hidden");
    $(".preview_mode .sign_pad_clear").addClass("hidden");
    $(".preview_mode .sign_pad_instruction").removeClass("hidden");
    $(".preview_mode .btn-next").addClass("disabled");
  });

  $(".preview_mode nav").on("click", ".document-menu, .menu-item", function() {
    $(".preview_mode .menu_options").toggleClass("hidden");
  });

  $(".preview_mode").on("click", ".btn-share", function() {
    if(!$(".preview_mode .document_completed").hasClass("showing")) {
      $(".preview_mode .overlay_share").addClass("showing");
    }
  });
  $(".preview_mode").on("click", ".overlay_share", function() {
    $(".preview_mode .overlay_share").removeClass("showing");
  });

  // $(".preview_mode .overlay_share").on("click", ".icon", function() {
  //   $(".preview_mode .overlay_page").removeClass("showing");
  //   $(".preview_mode .end_of_prototype").removeClass("hidden");
  //   $(".preview_mode article, .preview_mode nav, .preview_mode .bottom-bar").addClass("hidden");
  // });
  $(".preview_mode").on("click", ".btn-close, .overlay_share .icon", function() {
    $(".preview_mode .overlay_page").removeClass("showing");
    $(".preview_mode .end_of_prototype").removeClass("hidden");
    $(".preview_mode article, .preview_mode nav, .preview_mode .bottom-bar").addClass("hidden");
  });

  var toast_msg_timer;
  $(".preview_mode").on("click", ".feature_unavailable", function() {
    $(".preview_mode .msg_feature_unavailable").removeClass("hide");

    window.clearTimeout(toast_msg_timer);
    toast_msg_timer = window.setTimeout(function() {
      $(".preview_mode .msg_feature_unavailable").addClass("hide");
    }, 1100);
  });

  $(".preview_mode").on("click", ".disclosure_link, .btn-prev, .feature_unavailable, .document-comment, .document-menu", function() {
    // console.log($(this).attr("data-feature-code"));
    userInformation.otherClicks.push($(this).attr("data-feature-code"));
    // var currentPage = $(".preview_mode .page.showing").attr("data-page-num");
    // userInformation.otherClicks.push({$(this).attr("data-feature-code"): currentPage.toString()});
  });

  $(".preview_mode .input-text").on("keydown", function(event) {
    var targets = $(".preview_mode .page.showing .input-text");
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
