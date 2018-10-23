var sortableItems = [];
var sortableSections = [];
var sortableSectionsMap = [];
var showCalloutNextUser = false;
var showCalloutReferenceDoc = false;

$(document).ready(function() {
  $("#createForm").attr("data-recipient", "recipient-1");
  $(".container").removeClass("hidden");
  $(".container:not(.recipient-1)").addClass("hidden");


  $(".preview_form").load("signing_preview/index.html", function() {
    $(this).trigger("pagecreate");
    $.getScript("js/script_smart_forms_signing.js", function() {
      console.log("Signer script loaded");

      // HARDCODING FOR INITIATION
      $(".preview_mode [data-preview-id]").text("Label");
      $(".preview_mode [data-preview-id='Main Description']").text("");
      $(".preview_mode [data-preview-id='documentListA']").text("Radio Button");
      $(".preview_mode [data-preview-id='documentListBC']").text("Radio Button");
      $("body .input-text.disabled, .radio_option .input-rb").attr("tabindex", -1);
    });
  });


  // $("#createForm .card, #createForm .cards").addClass("hideStaggerLeft");
  sectionsToMap();

  setTimeout(function() {
    createSortables();
  }, 100);

  allTheDancingAround();

  // checkLinkedFields();
  checkFilledFields();
  // loadData();

  $("#createForm .uneditable-card").each(function(idx, elem) {
    $(elem).find(".field-input").html($(elem).find(".field-name").text() + " will be prefilled");
  });

  $("body").on("mousedown", function() {
    $(".card").removeClass("selected");
    // $("[data-ignore-sortable]").each(function(idx, elem) {
    //   // console.log(idx);
    //   $(this).addClass("ignore-sortable");
    // });
  });
  $("#sortableSections").on("mousedown touchstart", ".card, .sender_profile", function(evt) {
    evt.stopPropagation();
    // sortableItems.option("disabled", false);
    $(".card").removeClass("selected");
    $(this).addClass("selected");

    attachBlockItem($(this));
    createSortables();
    syncSectionHeights();
  });
  $("#sortableSections").on("mouseenter", ".card", function(evt) {
    if($("#createForm > div.card").length > 0) {
      $(this).addClass("showPlaceholder");
    } else {
      $(this).removeClass("showPlaceholder");
    }
  });
  $("#sortableSections").on("mouseleave", ".card", function(evt) {
    $(this).removeClass("showPlaceholder");
  });
  $("#sortableSections").on("mousedown", "[contentEditable=true]", function(evt) {
    evt.stopImmediatePropagation();
    $(".card").removeClass("selected");
    $(this).closest(".card").addClass("selected");
  });
  $("#sortableSections").on("focus", "[contentEditable=true], [type='text']", function(evt) {
    // evt.stopImmediatePropagation();
    for(var i=0;i<sortableItems.length;i++) {
      sortableItems[i].option("disabled", true);
    }
    sortableSections.option("disabled", true);
    sortableSectionsMap.option("disabled", true);

    if($(this).closest(".card").length > 0) {
      // console.log($(this).closest(".card"));
      $(this).closest(".card").mousedown().click();
      // $("#sortableSections").animate({scrollTop: $("#sortableSections").scrollTop() + $(this).closest(".card").offset().top - 200});
    }
  });
  $("#sortableSections").on("focus", "[contentEditable='true']", function(evt) {
    // evt.stopPropagation();
    $(this).removeClass("empty");

    if($(this).text().trim() === $(this).attr("placeholder")) {
      $(this).html("");
    } else {
      // $(this).addClass("empty");
    }
  });
  $("#sortableSections").on("blur", "[contentEditable=true], [type='text']", function(evt) {
    // evt.stopImmediatePropagation();
    for(var i=0;i<sortableItems.length;i++) {
      sortableItems[i].option("disabled", false);
    }
    sortableSections.option("disabled", false);
    sortableSectionsMap.option("disabled", false);
  });
  $("#sortableSections").on("blur", "[contentEditable='true']", function(evt) {
    // evt.stopPropagation();
    // if($(this).text().trim() === "" && $(this).hasClass("optional")) {
    //   $(this).html("Label (optional)");
    //   $(this).addClass("empty");
    // } else
    if($(this).text().trim() === "") {
      $(this).html($(this).attr("placeholder"));
      $(this).addClass("empty");
    }

    var prevFilledFields = $(".fields_status .filledFields").text();

    checkFilledFields();
    if(prevFilledFields != $(".fields_status .filledFields").text() && !showCalloutReferenceDoc) {
      showCalloutReferenceDoc = true;
      var targetEl = $(".tagger_top_toolbar .btn-preview-document");
      // $(".slider").click();

      setTimeout(function() {
        $(".tooltip.callout > div").addClass("hidden");
        $(".tooltip.callout > .callout-add-label").removeClass("hidden");

        calloutInverse(true);
        // targetEl.attr("callout-pos", "before middle");
        targetEl.attr("callout-pos", "below right");
        $(".tooltip.callout .callout-add-label .header").text("REFERENCE DOCUMENT");
        $(".tooltip.callout .callout-add-label .tooltip-content").text("Reference the document at any time.");
        // $(".tooltip.callout .btn").attr("callout-trigger", true).text("Next");
        showCallout(evt, targetEl);
      }, 500);
    }
  });
  // $("#sortableSections").on("change", "[contentEditable='true']", function(evt) {
  //   console.log("change??");
  //   if(!showCalloutReferenceDoc) {
  //     showCalloutReferenceDoc = true;
  //     var targetEl = $(".tagger_top_toolbar .btn-preview-document");
  //     // $(".slider").click();
  //
  //     setTimeout(function() {
  //       $(".tooltip.callout > div").addClass("hidden");
  //       $(".tooltip.callout > .callout-add-label").removeClass("hidden");
  //
  //       calloutInverse(true);
  //       // targetEl.attr("callout-pos", "before middle");
  //       targetEl.attr("callout-pos", "below left");
  //       $(".tooltip.callout .callout-add-label .header").text("REFERENCE DOCUMENT");
  //       $(".tooltip.callout .callout-add-label .tooltip-content").text("Reference the document at any time.");
  //       $(".tooltip.callout .btn").attr("callout-trigger", true).text("Next");
  //       showCallout(evt, targetEl);
  //     }, 500);
  //   }
  // });
  // $("#sortableSections").on("mousedown", ".ignore-sortable, .dummy", function(evt) {
  //   evt.stopPropagation();
  //   sortableItems.option("disabled", true);
  // });

  $("body").on("click", ".select-wrap", function(evt) {
    evt.stopPropagation();
  });
  // $("#sortableSections").on("blur", "[contentEditable=true]", function(evt) {
  // });

  $(".content_sidebar-left").on("click", ".sidebarTabs_tab", function() {
    $(".sidebarTabs_tab").removeClass("sidebarTabs_tab-on");
    $(this).addClass("sidebarTabs_tab-on");

    $(".sidebar-tab-option").addClass("hide");
    $(".sidebar-tab-option[data-tab-name='" + $(this).attr("data-qa") + "']").removeClass("hide");
  });

  $(".toolbar_smart_form .toolbar_right").on("click", ".icon", function() {
    $(this).toggleClass("on");

    if($(this).hasClass("on")) {
      $("#sidebarRight").removeClass("hide hideRight");
      setTimeout(function() {
        $("#sidebarRight").removeClass("hideRight");
      }, 500);
    } else {
      $("#sidebarRight").addClass("hideRight");
      setTimeout(function() {
        $("#sidebarRight").addClass("hide");
      }, 500);
    }
  });

  // $(".slider").on("dragstart click", function(evt) {
  //   evt.stopPropagation();
  //   evt.preventDefault();
  //   // console.log("drag");
  //   // $(this).toggleClass("show left relative");
  //   $(this).toggleClass("left");
  //   $("#createForm").toggleClass("showAsSideBarRight showAsFullPage");
  //   $(".blocks").toggleClass("minimized expanded");
  //   $(".section_blocks").toggleClass("hide_vertical");
  //   // $("#sidebarRight").toggleClass("newMinWidth hide");
  //   // $("#taggerDocument").toggleClass("hideLeft hide");
  // });

  $("#sortableSections").on("mousedown", ".add-section", function(evt) {
    // evt.stopPropagation();
    var parent = $(this).closest(".container");
    // console.log(getNewSectionNumber());
    var newSection = $('<div class="container ' + getRecipientNumber() + ' fadeInAnim" data-section-number="' + getNewSectionNumber() + '"><div class="collapse"><div class="icon icon-menu-triangle-down"></div><div class="icon icon-trash"></div></div><div class="item title_card" data-ignore-sortable="true"><div class="header" contentEditable="true" placeholder="Section Title">Untitled Section</div><div class="empty field-name" contentEditable="true" placeholder="Add Description">Add Description</div><div class="cards sortableItems"><div class="card item dummy show"><div>Drag and Drop Blocks or Fields to this Section</div></div></div></div><div class="card-bottom"><div class="add-section"><div class="divider-line"></div> <div><i class="icon icon-add"></i> Add Section</div> <div class="divider-line"></div></div></div></div>');
    console.log(newSection[0]);
    parent.after(newSection[0]);

    setTimeout(function() {
      $("#sortableSections .container, #sortableSections .card").removeClass("fadeInAnim");
    }, 1000);
    refreshSectionNumbers();
    sectionsToMap();
    createSortables();
  });

  $(".section_blocks").on("click", ".section_add_item", function(evt) {
    // evt.stopPropagation();
    var parent = $("#sortableSections");
    // console.log(getNewSectionNumber());
    var newSection = $('<div class="container ' + getRecipientNumber() + ' fadeInAnim" data-section-number="' + getNewSectionNumber() + '"><div class="collapse"><div class="icon icon-menu-triangle-down"></div><div class="icon icon-trash"></div></div><div class="item title_card" data-ignore-sortable="true"><div class="header" contentEditable="true" placeholder="Section Title">Untitled Section</div><div class="empty field-name" contentEditable="true" placeholder="Add Description">Add Description</div><div class="cards sortableItems"><div class="card item dummy show"><div>Drag and Drop Blocks or Fields to this Section</div></div></div></div><div class="card-bottom"><div class="add-section"><div class="divider-line"></div> <div><i class="icon icon-add"></i> Add Section</div> <div class="divider-line"></div></div></div></div>');
    console.log(newSection[0]);
    parent.append(newSection[0]);
    parent.animate({scrollTop: parent[0].scrollHeight});

    setTimeout(function() {
      $("#sortableSections .container, #sortableSections .card").removeClass("fadeInAnim");
    }, 1000);
    refreshSectionNumbers();
    sectionsToMap();
    createSortables();
  });

  $(".blocks").on("mousedown", ".menu_listItem", function(evt) {
    evt.stopPropagation();
    if($(this).attr("title") == "Paragraph") {
      // console.log("new");
      var newItem = $('<div class="card item" style=""><span class="handle"><i class="icon icon-handle"></i></span><div class="field-name empty" contenteditable="true" placeholder="Add Text">Add Text</div></div>');
      $("#createForm").append(newItem);
      moveNewBlock(evt);
    }
    if($(this).attr("title") == "Image") {
      // console.log("new");
      var newItem = $('<div class="card item image_placeholder"><span class="handle"><i class="icon icon-handle"></i></span><div class="file_input_label">Add Image</div><input type="file" /><img src="images/block_image_background.png"/></div>');
      $("#createForm").append(newItem);
      moveNewBlock(evt);
    }
  });

  $(".section_items").on("click", ".section_item", function(evt) {
    // evt.stopPropagation();
    var parentEl = $(this).closest(".section_items");
    parentEl.find(".section_item").removeClass("selected");
    $(this).addClass("selected");

    // console.log($(".container[data-section-number=" + $(this).attr("data-section-number") + "]").position().top);
    // console.log($(".container[data-section-number=" + $(this).attr("data-section-number") + "]").offset().top);
    $("#sortableSections").animate({scrollTop: $("#sortableSections").scrollTop() + $(".container:not(.hidden)[data-section-number=" + $(this).attr("data-section-number") + "]").position().top}, 150);
    // $("#sortableSections").scrollTop($(".container[data-section-number=" + $(this).attr("data-section-number") + "]").position().top);
  });

  $("#sortableSections").on("click", ".collapse .icon-menu-triangle-down", function(evt) {
    // evt.stopPropagation();
    $(this).closest(".container").toggleClass("minimized");
  });
  $("#sortableSections").on("click", ".collapse_all", function(evt) {
    // evt.stopPropagation();
    // $(".container .cards").each(function(idx, elem) {
    //   $(this).css("height", $(this).height());
    // });
    $(".container").addClass("minimized");
  });
  $("#sortableSections").on("click", ".icon-trash", function(evt) {
    var targets = $("[data-section-number='" + $(this).closest(".container").attr("data-section-number") + "']");
    setTimeout(function() {
      targets.addClass("hideLeft");
      targets.addClass("minimized");
    },100);
    setTimeout(function() {
      targets.remove();
    },500);
  });

  $("#sortableSections").on("click", ".file_input_label", function(evt) {
    // console.log("img");
    $(this).next("input[type='file']").click();
  });

  $("#sortableSections").on("change", "input[type='file']", function () {
    var parent = $(this).parent(".image_placeholder");
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onloadend = function () {
        parent.find(".file_input_label").text("Change Image");
        parent.find("img").attr("src", reader.result);
        parent.find("img").panzoom({
          disableXAxis: true,
          // contain: true,
          disableZoom: true
        });
        parent.addClass("image_full");
      }
      reader.readAsDataURL(this.files[0]);
    }
  });

  $(".tabs").on("click", ".tab", function(evt) {
    $(this).closest(".tabs").find(".tab").removeClass("on");
    $(this).addClass("on");

    $(".preview_mode").removeClass("desktop tablet phone print").addClass($(this).attr("data-preview"));

  });

  $(".site_toolbar").on("click", ".btn-recipients", function(evt) {
    $(this).next(".toolbarRecipientsMenu").toggleClass("invisible");
  });
  $("body").on("click", ".toolbarRecipientsMenu button.item", function(e) {
    e.stopPropagation();
    $(".toolbarRecipientsMenu").addClass("invisible");

    if($(this).parent().hasClass("feature_unavailable")) {
      return
    }

    var target = $(".toolbarRecipientsMenu").prev("button.btn-recipients");
    $(".toolbarRecipientsMenu button.item").removeClass("on");
    $(this).addClass("on");
    // console.log($(this).find(".ng-binding").text());
    target.find(".ng-binding").text($(this).find(".ng-binding").text());
    // target.find(".swatch-recipient").removeClass().addClass("swatch-recipient");
    target.find(".swatch-recipient").removeClass().addClass("swatch-recipient swatch-sm").addClass($(this).find(".swatch-recipient").attr("class"));

    $("#sidebarLeft .sidebar-flex").find(".swatch-recipient").removeClass().addClass("swatch-recipient swatch-lg").addClass($(this).find(".swatch-recipient").attr("class")).removeClass("swatch-round");
    // $("#sidebarLeft .sidebar-flex").find(".sidebarTabs_tab-on .icon").css("color", svgFillColor);
    // $(".btn-recipients").click();
    switchRecipient($(this).closest("li").attr("data-qa"));
    refreshSectionNumbers();
    setTimeout(function() {
      sectionsToMap();
    }, 350);
    // createSortables();
  });

  $("body").on("click", ".switch", function(evt) {
    console.log(!$(this).find("input").prop("checked"));
    if(!$(this).find("input").prop("checked")) {
      $(this).find("input").prop("checked", true);
    } else {
      $(this).find("input").removeAttr("checked")
    }
  });

  $("body").on("click", ".btn_preview", function(evt) {
    $(".preview_mode").toggleClass("hide");
    if(!$(".preview_mode .toolbarRecipientsMenu li[data-qa='recipient-1'] button.item").hasClass("on")) {
      $(".preview_mode .toolbarRecipientsMenu li[data-qa='recipient-1'] button.item").click();
    }
  });
  $("body").on("click", ".field-tag", function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    $(".field-tag").removeClass("selected");
    $(this).addClass("selected");
  });

  // $("body").on("mouseenter", "[data-link-id]", function(evt) {
  //   evt.stopPropagation();
  //   $("[data-link-id='" + $(this).attr("data-link-id") + "']").addClass("highlightTarget");
  // });
  // $("body").on("mouseleave", "[data-link-id]", function(evt) {
  //   evt.stopPropagation();
  //   $("[data-link-id='" + $(this).attr("data-link-id") + "']").removeClass("highlightTarget");
  // });
  // $("body").on("click", "[data-link-id]", function(evt) {
  //   evt.stopPropagation();
  //   // $("[data-link-id='" + $(this).attr("data-link-id") + "']").addClass("highlightTarget");
  //   // console.log($(this).closest(".DocView").length);
  //   if($(this).closest("#taggerDocument").length == 0) {
  //     $("#taggerDocument .field-tag").removeClass("selected");
  //     $("#taggerDocument [data-link-id='" + $(this).attr("data-link-id") + "']").addClass("selected");
  //     $("#taggerDocument").animate({scrollTop: $("#taggerDocument").scrollTop() + $("#taggerDocument [data-link-id='" + $(this).attr("data-link-id") + "']").offset().top - 200});
  //   }
  //   if($(this).closest("#sortableSections").length == 0) {
  //     $("#sortableSections .card, #sortableSections").removeClass("selected");
  //     $("#sortableSections [data-link-id='" + $(this).attr("data-link-id") + "']").addClass("selected");
  //     $("#sortableSections").animate({scrollTop: $("#sortableSections").scrollTop() + $("#sortableSections [data-link-id='" + $(this).attr("data-link-id") + "']").offset().top - 200});
  //   }
  // });
  $(".action-header").on("click", ".btn-trigger", function() {
    $(".menuOtherActions").toggleClass("invisible");
  });
  $(".menuOtherActions").on("click", "li", function() {
    $(".menuOtherActions").toggleClass("invisible");
  });

  $("body").on("click", ".btn-activate-gf", function() {
    $(".ds-modal-background").removeClass("invisible");
    $(".modal-activate-gf").removeClass("hide_modal");

    setTimeout(function() {
      $(".checkmark__circle, .checkmark, .checkmark__check").addClass("animate");
    }, 500);
    setTimeout(function() {
      $(".modal-activate-gf .stars_shapes").addClass("show");
    }, 1500);
    setTimeout(function() {
      localStorage.setItem("guidedFormActive", true);
      localStorage.setItem("firstTime", false);
      window.location.href = "templates.html";
    }, 3500);
  });

  // $("body").on("click", ".btn-conditional-logic", function() {
  //   $(".conditional-workflow").height($("#sortableSections")[0].scrollHeight);
  //
  //   $(".previewWorkflow").toggleClass("hideTop");
  //   $(".tagger_top_toolbar").toggleClass("hide");
  //   if($("#createForm").hasClass("showAsSideBarRight")) {
  //     $(".slider").click();
  //     $(".modal_close.btn-conditional-logic").addClass("wasMinimized");
  //   }
  //   $("#createForm .section_blocks, .slider").toggleClass("hideLeft");
  //   $("#createForm .blocks").toggleClass("hideRight");
  //
  //   // $("#sortableSections").animate({scrollTop: "0px"});
  //   setTimeout(function() {
  //     $(".conditional-workflow").toggleClass("fadeOut");
  //     showVisualization();
  //   }, 700);
  // });
  // $("body").on("click", ".wasMinimized", function() {
  //   $(this).removeClass("wasMinimized");
  //   setTimeout(function() {
  //     $(".slider").click();
  //   }, 300);
  // });

  $("body").on("click", ".get_started", function(evt) {
    $(".ds-modal-background").removeClass("invisible");
    $(".modal-scanned-fields").removeClass("hide_modal");
  });
  $("body").on("click", ".start-editing-labels", function(evt) {
    // var parentEl = $(".card[data-link-id='field-101']");
    var targetEl = $(".card[data-link-id='field-101'] .field-name");
    $("#sortableSections").animate({scrollTop: $("#sortableSections").scrollTop() + targetEl.offset().top - 200});
    targetEl.focus();

    // $(".slider").click();

    setTimeout(function() {
      $(".tooltip.callout > div").addClass("hidden");
      $(".tooltip.callout > .callout-add-label").removeClass("hidden");

      calloutInverse(true);
      // targetEl.attr("callout-pos", "before middle");
      targetEl.attr("callout-pos", "above center");
      $(".tooltip.callout .callout-add-label .header").text("Edit Labels");
      $(".tooltip.callout .btn").attr("callout-trigger", true).text("Next");
      showCallout(evt, targetEl);
    }, 500);
  });

  $(".tooltip.callout").on("click", ".btn[callout-trigger='true']", function(evt) {
    var targetEl = $(".card[data-link-id='field-103'] .field-name");
    $("#sortableSections").animate({scrollTop: $("#sortableSections").scrollTop() + targetEl.offset().top - 200});
    targetEl.focus();

    // $(".slider").click();

    setTimeout(function() {
      $(".tooltip.callout > div").addClass("hidden");
      $(".tooltip.callout > .callout-add-label").removeClass("hidden");

      calloutInverse(true);
      // targetEl.attr("callout-pos", "before middle");
      targetEl.attr("callout-pos", "above center");
      $(".tooltip.callout .callout-add-label .header").text("Add Labels");
      $(".tooltip.callout .callout-add-label .tooltip-content").text("Complete all labels for each field so the user understands what they are filling out.");
      showCallout(evt, targetEl);
    }, 500);
  });

  $("body").on("click", ".callout-target[data-callout='blocks_info']", function(evt) {
    $(".tooltip.callout > div").addClass("hidden");
    $(".tooltip.callout > .callout-block-info").removeClass("hidden");
    calloutInverse(true);
    $(this).attr("callout-pos", "after top");
    showCallout(evt, $(this));
  });

  $("body").on("click", ".card[data-link-id] .field-name", function(evt) {
    $(".tooltip.callout > div").addClass("hidden");
    $(".tooltip.callout > .callout-field-image").removeClass("hidden");
    $(".tooltip.callout > .callout-field-image img").attr("src", "images/tooltip_images/" + $(this).closest(".card").attr("data-link-id") + ".png");

    calloutInverse(false);
    var targetEl = $(this);
    targetEl.attr("callout-trigger", true);
    targetEl.attr("callout-pos", "above center");
    setTimeout(function() {
      showCallout(evt, targetEl);
    }, 350);
  });

  $("#sortableSections").on("blur", "[data-preview-id]", function(evt) {
    $(".preview_mode [data-preview-id='" + $(this).attr("data-preview-id") + "']").text($(this).text().trim());
  });

  $("body").on("click", ".btn-preview-document", function(evt) {
    $(".preview_document").toggleClass("hideBottom");
  });

    // setTimeout(function() {
    //   $(".container:not(.hidden) .card[data-link-id] .field-name").text("djakjs");
    // }, 5000);
});





function loadData() {
  var data = {'field-220': 'Employment Start Date','field-223': 'Title','field-224': 'Last Name','field-225': 'First Name','field-226': 'Company','field-227': 'Company Address','field-228': 'City','field-229': 'State','field-230': 'Zip Code','field-221': 'Signature','field-101': 'Last Name','field-102': 'First Name','field-103': 'Middle Initial','field-104': 'Other Last Names','field-105': 'Address','field-106': 'Apt Number','field-107': 'City','field-108': 'State','field-109': 'Zip Code','field-110': 'Date of Birth','field-111': 'SSN','field-112': 'Email (optional)','field-113': 'Telephone (optional)','field-114': 'Citizenship Status','field-118': 'USCIS Number','field-119': 'Expiration Date','field-120': 'USCIS Number','field-121': 'I-94 Admission Number','field-122': 'Passport Number','field-123': 'Country of Issuance','field-201': 'First Name','field-202': 'Last Name','field-203': 'Middle Initial','field-204': 'Citizenship / Immigration Status','field-205': 'Document Type','field-207': 'Document Title','field-208': 'Issuing Authority','field-209': 'Document Number','field-210': 'Expiration Date','field-211': 'Document Title','field-212': 'Issuing Authority','field-213': 'Document Number','field-214': 'Expiration Date','field-215': 'Document Title','field-216': 'Issuing Authority','field-217': 'Document Number','field-218': 'Expiration Date','field-219': 'Attachment','field-124': 'Signature'};

  $("[data-link-id]").each(function(idx, elem) {
    // console.log(data[$(elem).attr("data-link-id")]);
    $(elem).find(".field-name").removeClass("empty").text(data[$(elem).attr("data-link-id")]);
  });
}


function checkFilledFields(evt) {
  var totalFields = 0;
  var filledFields = 0;
  totalFields = $(".container:not(.hidden) .card[data-link-id]").length;
  $(".container:not(.hidden) .card[data-link-id] .field-name").each(function(idx, elem) {
    if($(elem).text().trim() === $(elem).attr("placeholder") || $(elem).text().trim() === "") {

    } else {
      // console.log($(elem).text());
      filledFields++;
    }
  });
  $(".fields_status .totalFields").text(totalFields);
  $(".fields_status .filledFields").text(filledFields);

  if(filledFields == totalFields) {
    $(".btn-activate-gf").removeClass("disabled");
  } else {
    $(".btn-activate-gf").addClass("disabled");
  }

  if(filledFields == totalFields && !showCalloutNextUser) {
    showCalloutNextUser = true;

    var targetEl = $(".tagger_top_toolbar .btn-recipients");
    // $(".slider").click();

    setTimeout(function() {
      $(".tooltip.callout > div").addClass("hidden");
      $(".tooltip.callout > .callout-add-label").removeClass("hidden");

      calloutInverse(true);
      // targetEl.attr("callout-pos", "before middle");
      targetEl.attr("callout-pos", "below left");
      $(".tooltip.callout .callout-add-label .header").text("CREATE NEXT GUIDED FORM");
      $(".tooltip.callout .callout-add-label .tooltip-content").text("Each role has a unique Guided Form. Switch your user to start creating their Guided Form.");
      showCallout(evt, targetEl);
    }, 300);
  }
}

function calloutInverse(state) {
  $(".tooltip.callout .btn").removeAttr("callout-trigger").text("Got It");
  if(state === true) {
    $(".tooltip.callout").addClass("inverse");
    $(".tooltip.callout .btn-primary").addClass("hidden");
    $(".tooltip.callout .btn-inverse-secondary").removeClass("hidden");
  } else {
    $(".tooltip.callout").removeClass("inverse");
    $(".tooltip.callout .btn-primary").removeClass("hidden");
    $(".tooltip.callout .btn-inverse-secondary").addClass("hidden");
  }
}

function showVisualization() {
  // $(".conditional-viz").html("");
  // $("[data-conditional='source']").each(function(idx, elem) {
  //   $(".conditional-viz").append($('<g id=""><circle cx="50%" cy="100" r="8" fill="#F3F3F3"></circle><circle cx="50%" cy="100" r="6" fill="none" stroke="#FFD65B"></circle></g>'));
  // });
  // $(".conditional-workflow").html($(".conditional-workflow").html());

  if(!$(".conditional-workflow").hasClass("fadeOut")) {
    $("#sortableSections").animate({scrollTop: $("#sortableSections").scrollTop() + $("[data-conditional='conditionalSource1']").offset().top - 200});
  }

  $("#conditionalSource1 circle").attr({"cy": $("#sortableSections").scrollTop() + $("[data-conditional='conditionalSource1']").offset().top - 30, "stroke-width": "3"});
  $("#conditionalSource2 circle").attr({"cy": $("#sortableSections").scrollTop() + $("[data-conditional='conditionalSource2']").offset().top - 30, "stroke-width": "3"});
  $("#conditionalSource3 circle").attr({"cy": $("#sortableSections").scrollTop() + $("[data-conditional='conditionalSource3']").offset().top - 30, "stroke-width": "3"});
  $("#conditionalSource4 circle").attr({"cy": $("#sortableSections").scrollTop() + $("[data-conditional='conditionalSource4']").offset().top - 30, "stroke-width": "3"});

  $("#conditionalTarget1 circle").attr({"cy": $("#sortableSections").scrollTop() + $("[data-conditional='conditionalTarget1']").position().top + 30, "stroke-width": "3"});
  $("#conditionalTarget2 circle").attr({"cy": $("#sortableSections").scrollTop() + $("[data-conditional='conditionalTarget2']").position().top + 30, "stroke-width": "3"});
  $("#conditionalTarget3 circle").attr({"cy": $("#sortableSections").scrollTop() + $("[data-conditional='conditionalTarget3']").position().top + 30, "stroke-width": "3"});
  $("#conditionalTarget4 circle").attr({"cy": $("#sortableSections").scrollTop() + $("[data-conditional='conditionalTarget4']").position().top + 30, "stroke-width": "3"});

  $("#conditionalLine1").attr({
    "x1": $("#conditionalSource1 circle").attr("cx"),
    "x2": $("#conditionalTarget1 circle").attr("cx"),
    "y1": $("#conditionalSource1 circle").attr("cy"),
    "y2": $("#conditionalTarget1 circle").attr("cy"),
    "stroke-width": "3"
  });
  $("#conditionalLine2").attr({
    "x1": $("#conditionalSource2 circle").attr("cx"),
    "x2": $("#conditionalTarget2 circle").attr("cx"),
    "y1": $("#conditionalSource2 circle").attr("cy"),
    "y2": $("#conditionalTarget2 circle").attr("cy"),
    "stroke-width": "3"
  });
  $("#conditionalLine3").attr({
    "x1": $("#conditionalSource3 circle").attr("cx"),
    "x2": $("#conditionalTarget3 circle").attr("cx"),
    "y1": $("#conditionalSource3 circle").attr("cy"),
    "y2": $("#conditionalTarget3 circle").attr("cy"),
    "stroke-width": "3"
  });
  $("#conditionalLine4").attr({
    "x1": $("#conditionalSource4 circle").attr("cx"),
    "x2": $("#conditionalTarget4 circle").attr("cx"),
    "y1": $("#conditionalSource4 circle").attr("cy"),
    "y2": $("#conditionalTarget4 circle").attr("cy"),
    "stroke-width": "3"
  });
}

function checkLinkedFields() {
  $(".recipient-1 .card[data-linked-field='head']").each(function(idx, headElem) {
    // console.log($(headElem).attr("data-linked-id"));
    // console.log($(".recipient-1 [data-linked-field='element'][data-linked-id='" + $(elem).attr("data-linked-id") + "']"));
    $(".recipient-1 [data-linked-field='element'][data-linked-id='" + $(headElem).attr("data-linked-id") + "']").each(function(jdx, linkedElem) {
      $(linkedElem).addClass("isLinked hide");
      $("#createForm .isCloned[data-linked-id='" + $(headElem).attr("data-linked-id") + "']").remove();
      $(headElem).find(".isCloned.isLinked").remove();
      // $(linkedElem).clone().addClass("isCloned ignore-sortable").insertAfter($(headElem));
      // console.log($(linkedElem));
      $(headElem).append("<div class='isLinked isCloned link' data-link-id='" + $(linkedElem).attr("data-link-id") + "'>Linked to another instance</div>");
    });
  });
}

function getRecipientNumber() {
  // $("#createForm").removeClass("recipient-1 recipient-2");
  return $("#createForm").attr("data-recipient");
}
function switchRecipient(recipientId) {
  // $("#createForm").removeClass("recipient-1 recipient-2");
  $("#sortableSections").addClass("fadeOut");
  // setTimeout(function() {
  //   $(".section_blocks").addClass("fadeOut");
  // },300);
  setTimeout(function() {
    $("#createForm").attr("data-recipient", recipientId);
    $("#createForm").find(".container").removeClass("hidden");
    $("#createForm").find(".container:not(." + recipientId + ")").addClass("hidden");
  },500);
  setTimeout(function() {
    $("#sortableSections").removeClass("fadeOut");

    checkFilledFields();
  },700);
}

function moveNewBlock(event) {
  var target = $("#createForm > div.card");
  target.css({left: event.pageX - target.width()/2, top: event.pageY - target.height()/2}).addClass("dragAlong");
  $("#createForm").on("mousemove", dragBlockAlong);
}
function dragBlockAlong(event) {
  var target = $("#createForm > div.card");
  target.css({left: event.pageX - target.width()/2, top: event.pageY - target.height()/2});
}
function attachBlockItem(target) {
  // var target = $("#createForm > div.card");
  $("#createForm > div.card").removeClass("dragAlong").addClass("fadeInAnim").css({"left": "auto", "top": "auto"});
  if($("#createForm > div.card").length > 0) {
    target.after($("#createForm > div.card")).removeClass("showPlaceholder show");
    $("#createForm > div.card").remove();
  }
  // target.css({left: event.pageX - target.width()/3, top: event.pageY - 51 - target.height()/2,transition: "none"});

  setTimeout(function() {
    $("#sortableSections .container, #sortableSections .card").removeClass("fadeInAnim");
  }, 1000);
}

function getNewSectionNumber() {
  // console.log($("#sortableSections > .container:not(.hidden)").length);
  return $("#sortableSections .container:not(.hidden)").length + 1;
}

function allTheDancingAround() {
  setTimeout(function() {
    // $("#createForm").addClass("show");

    setToastMessage("Scanning Form Fields for Template Roles");
  }, 1000);
  setTimeout(function() {
    $("#topNav").removeClass("hideTop");
    $("#createForm .cards").each(function(idx, elem) {
      // console.log(idx);
      // setTimeout(function() {
        // $(elem).removeClass("hideStaggerLeft");
      // }, idx * 100);
    });
    $("#createForm .card").each(function(idx, elem) {
      // console.log(idx);
      // setTimeout(function() {
        // $(elem).removeClass("hideStaggerLeft");
      // }, idx * 100);
    });
  }, 2000);
  setTimeout(function() {
    $("#sortableSections").addClass("overflow");
    $(".spinner").addClass("hide");
    $(".toolbar_smart_form").removeClass("hideTop");
  }, 2500);

  setTimeout(function() {
    // $(".slider").addClass("show");

    $(".ds-modal-background").removeClass("invisible");
    $(".modal-edit-form").removeClass("hide_modal");
    // $(".modal-scanned-fields").removeClass("hide_modal");
  }, 3000);
}

function setToastMessage(message) {
  $(".toast .toast-message").text(message);
  $(".toast").removeClass("show").addClass("show");
}

function sectionsToMap() {
  var totalHeight = $("#sortableSections")[0].scrollHeight;
  var currentScrollTop = $(".section_blocks").scrollTop();
  // console.log(currentScrollTop);
  $(".section_items").html("");
  $("#sortableSections .container:not(.hidden)").each(function(idx, elem) {
    var sectionNumber = $(elem).attr("data-section-number");

    // var newSectionMap = $('<div class="section_item" data-section-number="' + sectionNumber + '"><div class="section_number">' + sectionNumber + '</div></div>');
    var newSectionMap = $('<div class="section_item" data-section-number="' + sectionNumber + '"><div class="section_header">' + $(".container:not(.hidden)[data-section-number='" + sectionNumber + "'] .title_card .header").text().trim() + '</div><div class="section_snapshot"></div></div>');
    $(".section_items").append(newSectionMap);
    $(".section_item[data-section-number=" + sectionNumber + "]").height(700 * $(elem).height()/totalHeight);
    $(".section_item[data-section-number=" + sectionNumber + "] .section_snapshot").removeClass("text radio attachment signature");
    $(".section_item[data-section-number=" + sectionNumber + "] .section_snapshot").addClass(sectionSnapshotType(sectionNumber));
  });
  $(".section_item[data-section-number=1]").addClass("ignore-sortable").css("height", "80px");
  $(".section_item[data-section-number=1] .section_snapshot").addClass("circle");
  $(".section_blocks").scrollTop(currentScrollTop);
  $(".sections_count").text(getNewSectionNumber() - 1);
  // console.log($(".section_items").children().length);
}

function sectionSnapshotType(sectionNumber) {
  // console.log($(".container:not(.hidden)[data-section-number='" + sectionNumber + "']").find(".radio_option").length);
  if($(".container:not(.hidden)[data-section-number='" + sectionNumber + "']").find(".radio_option").length > 0) {
    return "radio";
  } else if($(".container:not(.hidden)[data-section-number='" + sectionNumber + "']").find(".signature_placeholder").length > 0) {
    return "signature";
  } else if($(".container:not(.hidden)[data-section-number='" + sectionNumber + "']").find(".attachment").length > 0) {
    return "attachment";
  } else {
    return "text";
  }
}

function syncSectionHeights() {
  var totalHeight = $("#sortableSections")[0].scrollHeight;
  $("#sortableSections .container:not(.minimized, .hidden)").each(function(idx, elem) {
    var sectionNumber = $(elem).attr("data-section-number");
    // console.log(1000 * $(elem).height()/totalHeight);
    $(".section_item[data-section-number=" + sectionNumber + "]").height(700 * $(elem).height()/totalHeight);
    $(".section_item[data-section-number=" + sectionNumber + "] .section_snapshot").removeClass("text radio attachment signature");
    $(".section_item[data-section-number=" + sectionNumber + "] .section_snapshot").addClass(sectionSnapshotType(sectionNumber));

    $(".section_item[data-section-number='1']").css("height", "80px");
  });
}

function refreshSectionNumbers() {
  $("#sortableSections .container:not(.hidden)").each(function(idx, elem) {
    $(elem).attr("data-section-number", idx+1);
  });
  $(".section_items .section_item:not(.hidden)").each(function(idx, elem) {
    $(elem).attr("data-section-number", idx+1);
    $(elem).find(".section_number").text(idx+1);
  });
}
function refreshSectionSequence(item) {
  var prevSectionNum = -1;
  var currSectionNum = -1;
  if($(item).closest(".section_items").length > 0) {
    prevSectionNum = $(item).prevAll(":visible").attr("data-section-number");
    currSectionNum = $(item).attr("data-section-number");
    $(".container:not(.hidden)[data-section-number='" + currSectionNum + "']").insertAfter(".container:not(.hidden)[data-section-number='" + prevSectionNum + "']");
  } else {
    prevSectionNum = $(item).prevAll(":visible").attr("data-section-number");
    currSectionNum = $(item).attr("data-section-number");
    $(".section_item:not(.hidden)[data-section-number='" + currSectionNum + "']").insertAfter(".section_item:not(.hidden)[data-section-number='" + prevSectionNum + "']");
  }
}

function checkEmptyContainers() {
  // console.log("in");
  $(".sortableItems").each(function(idx, elem) {
    // evt.stopPropagation();
    // console.log($(elem).children().length);
    if($(elem).children().length <= 1) {
      $(elem).find(".item.dummy").addClass("show");
      $(elem).closest(".container").find(".collapse .icon-trash").removeClass("hidden");
    } else {
      $(elem).find(".item.dummy").removeClass("show");
      $(elem).closest(".container").find(".collapse .icon-trash").addClass("hidden");
    }
  });
}

function createSortables() {
  $(".sortableItems").each(function(id, elem) {
    // if($(elem).children().length <= 2) {
    //   $(".item.dummy").addClass("show");
    // }
    sortableItems[id] = Sortable.create(elem, {
      filter: ".ignore-sortable, .dummy",
      preventOnFilter: false,
      animation: 250,
      handle: ".item",
      dragClass: "sortable-drag",
      ghostClass: "sortable-ghost",
      forceFallback: true,
      onSort: function (/**Event*/evt) {

        if(!(evt.from === evt.to || evt.item.className.indexOf('restrict-sortable') === -1)) {
          // console.log(evt);
          $(evt.from).find(".item").eq(evt.oldIndex - 1).after(evt.item);
          // modal-restrict-field
          $(".ds-modal-background").removeClass("invisible");
          $(".modal-restrict-field").removeClass("hide_modal");
        }
      },
      onMove: function (evt) {
        // $(evt.dragged).css("width", "22px");

        // return evt.related.className.indexOf('ignore-sortable') === -1 && (evt.from === evt.to || evt.dragged.className.indexOf('restrict-sortable') === -1);
        return evt.related.className.indexOf('ignore-sortable') === -1;
      },
      group: {
        name: "fields"
      },
      onEnd: function(evt) {
        // checkLinkedFields();
        checkEmptyContainers();
        syncSectionHeights();
        showVisualization();
      }
      // onClone: function (/**Event*/evt) {
      //   var origEl = evt.item;
      //   var cloneEl = evt.clone;
      //   // var ghostEl = evt.clone;
      //   $(origEl).insertBefore(cloneEl);
      //   // console.log(origEl);
      //   // $(origEl).children().css("opacity", 1);
      // }
    });
  });

  $(".section_items").each(function(id, elem) {
    sortableSectionsMap = Sortable.create(elem, {
      filter: ".ignore-sortable",
      preventOnFilter: false,
      animation: 250,
      handle: ".section_item",
      dragClass: "sortable-drag",
      ghostClass: "sortable-ghost",
      forceFallback: true,
      onMove: function (evt) {
        // $(evt.dragged).css("width", "22px");
        return evt.related.className.indexOf('ignore-sortable') === -1;
      },
      onEnd: function(evt) {
        // checkLinkedFields();
        refreshSectionSequence(evt.item);
        refreshSectionNumbers();
        syncSectionHeights();
      }
    });
  });

  $(".sortableSections").each(function(id, elem) {
    sortableSections = Sortable.create(elem, {
      filter: ".ignore-sortable",
      preventOnFilter: false,
      animation: 250,
      handle: ".container",
      dragClass: "sortable-drag",
      ghostClass: "sortable-ghost",
      forceFallback: true,
      onMove: function (evt) {
        // $(evt.dragged).css("width", "22px");
        return evt.related.className.indexOf('ignore-sortable') === -1;
      },
      onEnd: function(evt) {
        // checkLinkedFields();
        refreshSectionSequence(evt.item);
        refreshSectionNumbers();
        syncSectionHeights();
      }
      // group: {
      //   name: "documents",
      //   pull: "clone"
      // }
    });
  });
}
