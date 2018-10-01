var svgFillColor = "#ffe084";
var selectedTag;

$(document).ready(function(e) {
  setDocumentHeight();

  // console.log($(".content_main")[0].scrollHeight);
  // console.log($("#documentTags").height());
});


function setDocumentHeight() {
  // ADDING TIMEOUT FOR CHROME TO LOAD / RENDER EVERYTHING PROPERLY
  window.setTimeout(function() {
    $("#documentTags").attr("height", $(".content_main")[0].scrollHeight);
  }, 200);
}

$(".content_sidebar-right").on("click", ".btn-utility[data-qa='properties-panel-delete']", function() {
  deleteTag(selectedTag);
});
$(".content_sidebar-left").on("mousedown", "button.item.btn,button.menu_item", function(evt) {
  var newTag;
  var tagForRecipient = $(".site_toolbar.toolbar_tagger .btn-recipients .ng-binding").text();

  // $(".content_main").scrollTop($("#documentTags").height() - $("#documentTags").height()/5);
  if($(this).attr("data-qa") == "Signature") {
    newTag = $('<div class="newTagDraggable draggable SignatureTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="background-color: ' + svgFillColor + '"><img style="cursor: auto;" src="images/svg/SignHereActive150.svg"/></div><img class="tag_settings" style="cursor:pointer;" src="images/svg/gear_icon.svg"/></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Initial") {
    newTag = $('<div class="newTagDraggable draggable InitialsTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="background-color: ' + svgFillColor + '"><img src="images/svg/InitialHereActive150.svg" style="pointer-events: none;" width="34" height="40"/></div><img class="tag_settings" style="cursor:pointer;" src="images/svg/gear_icon.svg"/></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Date Signed") {
    newTag = $('<div class="newTagDraggable draggable DateSignedTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="background-color: ' + svgFillColor + '"><span>Date Signed</span></div><img class="tag_settings" style="cursor:pointer;" src="images/svg/gear_icon.svg"/></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Name") {
    newTag = $('<div class="newTagDraggable draggable NameTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="background-color: ' + svgFillColor + '"><span>Full Name</span></div><img class="tag_settings" style="cursor:pointer;" src="images/svg/gear_icon.svg"/></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Email") {
    newTag = $('<div class="newTagDraggable draggable EmailTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="background-color: ' + svgFillColor + '"><span>Email</span></div><img class="tag_settings" style="cursor:pointer;" src="images/svg/gear_icon.svg"/></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Company") {
    newTag = $('<div class="newTagDraggable draggable CompanyTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="background-color: ' + svgFillColor + '"><span>Company</span></div><img class="tag_settings" style="cursor:pointer;" src="images/svg/gear_icon.svg"/></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Title") {
    newTag = $('<div class="newTagDraggable draggable TitleTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="background-color: ' + svgFillColor + '"><span>Title</span></div><img class="tag_settings" style="cursor:pointer;" src="images/svg/gear_icon.svg"/></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Text") {
    newTag = $('<div class="newTagDraggable draggable DataTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="background-color: ' + svgFillColor + '"><span>Text</span></div><img class="tag_settings" style="cursor:pointer;" src="images/svg/gear_icon.svg"/></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Checkbox") {
    newTag = $('<div class="newTagDraggable draggable CheckboxTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="background-color: ' + svgFillColor + '"><input type="checkbox" class="input-cb"/></div><img class="tag_settings" style="cursor:pointer;" src="images/svg/gear_icon.svg"/></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Dropdown") {
    newTag = $('<div class="newTagDraggable draggable DropdownTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="background-color: ' + svgFillColor + '"><span>Select</span><img src="images/svg/uE062-triangle.svg" style="pointer-events: none;"/></div><img class="tag_settings" style="cursor:pointer;" src="images/svg/gear_icon.svg"/></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Radio") {
    newTag = $('<div class="newTagDraggable draggable RadioTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="background-color: ' + svgFillColor + '"><input type="radio" class="input-rb"/></div><div style="background-color: ' + svgFillColor + '"><input type="radio" class="input-rb"/></div><div style="background-color: ' + svgFillColor + '"><input type="radio" class="input-rb"/></div><div style="background-color: ' + svgFillColor + '"><input type="radio" class="input-rb"/></div><div style="background-color: ' + svgFillColor + '"><input type="radio" class="input-rb"/></div><img class="tag_settings" style="cursor:pointer;" src="images/svg/gear_icon.svg"/></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Attachment") {
    newTag = $('<div class="newTagDraggable draggable AttachmentTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="background-color: ' + svgFillColor + '"><img src="images/svg/tag-attachment.svg"/></div><img class="tag_settings" style="cursor:pointer;" src="images/svg/gear_icon.svg"/></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Note") {
    newTag = $('<div class="newTagDraggable draggable NoteTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="background-color: ' + svgFillColor + '"><img src="images/svg/field-note.svg" style="pointer-events: none;" width="12" height="12" x="2" y="2"/></div><img class="tag_settings" style="cursor:pointer;" src="images/svg/gear_icon.svg"/></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Approve") {
    newTag = $('<div class="newTagDraggable draggable ApproveTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="background-color: ' + svgFillColor + '"><span>Approve</span></div><img class="tag_settings" style="cursor:pointer;" src="images/svg/gear_icon.svg"/></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Decline") {
    newTag = $('<div class="newTagDraggable draggable DeclineTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="background-color: ' + svgFillColor + '"><span>Decline</span></div><img class="tag_settings" style="cursor:pointer;" src="images/svg/gear_icon.svg"/></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Formula") {
    newTag = $('<div class="newTagDraggable draggable FormulaTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="background-color: ' + svgFillColor + '"><img src="images/svg/tag-formula.svg" style="pointer-events: none;" width="9" height="8.031048387096773" x="3" y="1"/></div><img class="tag_settings" style="cursor:pointer;" src="images/svg/gear_icon.svg"/></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Payment") {
    newTag = $('<div class="newTagDraggable draggable PaymentTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="background-color: ' + svgFillColor + '"><span>$0.00</span></div><img class="tag_settings" style="cursor:pointer;" src="images/svg/gear_icon.svg"/></div>');

    if(isPaymentGatewayAdded) {
      // $("#documentTags").append(newTag);
      $(".tagger_content").append(newTag);
      moveNewTag(evt);
    } else {
      // addPaymentGateway();
    }
  } else if($(this).attr("data-qa") == "SignReturn Signature") {
    newTag = $('<div class="newTagDraggable draggable" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div><img src="images/alex_freeform_sign.gif" style="pointer-events: none;"/></div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);
  } else if($(this).attr("data-qa") == "SignReturn Initial") {
    newTag = $('<div class="newTagDraggable draggable" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div><img src="images/alex_freeform_initial.gif" style="pointer-events: none;"/></div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);
  } else if($(this).attr("data-qa") == "SignReturn Date Signed") {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    newTag = $('<div class="newTagDraggable draggable" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div>' + mm+'/'+dd+'/'+yyyy + '</div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);
  } else if($(this).attr("data-qa") == "SignReturn Name") {
    newTag = $('<div class="newTagDraggable draggable" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div>Alex Edwards</div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);
  } else if($(this).attr("data-qa") == "SignReturn First Name") {
    newTag = $('<div class="newTagDraggable draggable" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div>Alex</div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);
  } else if($(this).attr("data-qa") == "SignReturn Last Name") {
    newTag = $('<div class="newTagDraggable draggable" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div>Edwards</div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);
  }  else if($(this).attr("data-qa") == "SignReturn Email") {
    newTag = $('<div class="newTagDraggable draggable" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div>alexedwards@edwardsconsulting.com</div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);
  } else if($(this).attr("data-qa") == "SignReturn Company") {
    newTag = $('<div class="newTagDraggable draggable" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div>Edwards Consulting</div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);
  } else if($(this).attr("data-qa") == "SignReturn Title") {
    newTag = $('<div class="newTagDraggable draggable" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div>Consultant</div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);
  } else if($(this).attr("data-qa") == "SignReturn Text") {
    newTag = $('<div class="newTagDraggable draggable" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div><input type="text" class="input-text" value=""/></div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);
  } else if($(this).attr("data-qa") == "SignReturn Checkbox") {
    newTag = $('<div class="newTagDraggable draggable" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div><div class="cb disabled"><input id="signReturnCB1" name="checkbox_group1" type="checkbox" class="cb_input" checked /><label for="signReturnCB1" class="cb_label"></label></div></div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);
  }

  // $("#documentTags").append(newTag);
  // $(".tagger_content").append(newTag);
  // moveNewTag(evt);
  $(".content_main").html($(".content_main").html());

  // $(".content_main").html($(".content_main").html());
});
//
// function addPaymentGateway() {
//   $("#addPaymentGateway").removeClass("hide hidden");
// }

$(window).on("resize", function() {
  // console.log($(".content_main").find(".draggable").attr("width"));
  $(".content_main").find(".draggable").each(function() {
    if(!$(this).attr("data-x")) {
      // $(this).attr("data-x", this.getCTM().e);
      // $(this).attr("data-y", this.getCTM().f);
      $(this).attr("data-x", $(this).position().left);
      $(this).attr("data-y", $(this).position().top);
      // console.log(this.getCTM().e);
      // console.log($(this).attr("transform"));
    }
    // var yPos = $(this).attr("data-y");
    var xPos = (100 * ($(this).attr("data-x") / $(".PageView").outerWidth()));
    var yPos = (100 * ($(this).attr("data-y") / $(".PageView").outerHeight()));
    $(this).attr("data-x", xPos + "%");
    $(this).attr("data-y", yPos + "%");
    console.log(xPos);
    console.log(yPos);
    // $(this).attr("transform", "scale(" + scaleVal + ")");
    // $(this).css("transform", "translate(" + xPos + "px, " + yPos + "px)");
    $(this).css({"left": xPos + "%", "top": yPos + "%"});
  });
});

interact('.draggable').draggable({
  // enable inertial throwing
  // inertia: true,
  // keep the element within the area of it's parent
  restrict: {
    restriction: "parent",
    endOnly: true
  },
  // enable autoScroll
  autoScroll: true,

  onstart: function(event) {
    $(event.target).mouseup();
  },
  // call this function on every dragmove event
  onmove: dragMoveListener,
  // call this function on every dragend event
  onend: function (event) {
  }
});

function dragMoveListener (event) {
  var parentOffset = $(event.target).closest(".PageView").offset();
  //or $(this).offset(); if you really just want the current element's offset
  var relX = event.pageX - parentOffset.left;
  var relY = event.pageY - parentOffset.top;

  var target = event.target,
      target1 = $(event.target),
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
      // x =  relX - parseFloat(target1[0].getBBox().width)/2,
      // y =  relY - parseFloat(target1[0].getBBox().height)/2;
      // console.log(parseFloat(target1.width())/2);
      // console.log(parseFloat(target1.height())/2);

  // translate the element
  target.style.webkitTransform =
  target.style.transform =
    'translate(' + x + 'px, ' + y + 'px)';
  target.style.transition = 'none';
  // target1.attr("transform", "matrix(1.25,0,0,1.25," + x + "," + y + ")");

  // update the posiion attributes
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;


$("body").on("click", function(evt) {
  evt.stopPropagation();
  $(".content_main .draggable").removeClass("selected");

  $(".drawer-properties").find(".drawer-content").removeClass("showing");
  $(".content_sidebar-right").css({"overflow": "auto"});
});
$("body").on("click", ".content_sidebar-right", function(e) {
  e.stopPropagation();
  $(".draggable").removeClass("selected");
});

$("body").on("mouseup", ".draggable", function(evt) {
  evt.preventDefault();
  // console.log($(this));
  // evt.stopPropagation();
  showOptions($(this));
});

function resetTags() {
  $("body").find(".draggable").each(function() {
    deleteTag($(this));
  });
}

function showOptions(element) {
  $(".content_main .draggable").removeClass("selected");
  element.addClass("selected");
  selectedTag = element;

  $(".drawer-properties").find(".drawer-content").addClass("showing");

  $(".drawer-properties").find(".drawer-properties_header .icon img").remove();
  $(".drawer-properties").find(".drawer-properties_header .icon").removeClass().addClass("icon icon-palette-field-" + (element.attr("data-name")=="Signature"?"sign":element.attr("data-name").toLowerCase()) + "");

  $(".drawer-properties").find(".drawer-properties_header .ng-binding").text(element.attr("data-name")=="Disclosure"?"Supplement":element.attr("data-name"));
  $(".content_sidebar-right").css({"overflow": "hidden"});

  $(".drawer-properties_main > .tag_option").addClass("hidden");
  $(".drawer-properties_footer").removeClass("hidden");
  if(element.attr("data-name")=="Signature") {
    $(".drawer-properties_main > .drawer-properties_section > [data-qa='read-only-checkbox']").addClass("hidden");

    $(".drawer-properties_main > .tag_option[data-qa='data-label-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='anchor-tabs-properties-accordion']").removeClass("hidden");
  }
  if(element.attr("data-name")=="Payment") {
    $(".drawer-properties").find(".drawer-properties_header .icon").removeClass().addClass("icon").html("<img class='icon payment_icon' src='images/svg/tag-payment.svg'>");

    $(".drawer-properties_main > .drawer-properties_section > [data-qa='read-only-checkbox']").addClass("hidden");

    $(".drawer-properties_main > .tag_option[data-qa='pay-provider-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='pay-amount-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='pay-description-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='formatting-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='data-label-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='tooltip-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='anchor-tabs-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='collab-properties-accordion']").removeClass("hidden");
  }
  if(element.attr("data-name")=="Disclosure") {
    $(".drawer-properties").find(".drawer-properties_header .icon").removeClass().addClass("icon icon-documents");

    $(".drawer-properties_main > .drawer-properties_section > [data-qa='read-only-checkbox']").addClass("hidden");
    $(".drawer-properties_footer").addClass("hidden");

    var documentNum = element.attr("id").slice(10, element.attr("id").length);
    // console.log(documentNum);
    $(".drawer-properties_main > .tag_option.document" + documentNum + "[data-qa='disclosure-options']").removeClass("hidden");
    // $(".drawer-properties_main > .tag_option." + document1 + "[data-qa='disclosure-options']").removeClass("hidden");
  }
}

$("body").on("keydown", function(evt) {
  // DELETE TAG
  if(evt.keyCode == 8) {
  }

  if(evt.keyCode == 8 && $(".draggable").hasClass("selected")) {
    evt.preventDefault();
    deleteTag(selectedTag);
  }
});

function deleteTag(tagElem) {
  // console.log($("#documentTags").find(".draggable.selected").closest("svg").remove());
  tagElem.remove();

  // $(".drawer-properties").find(".drawer-content").removeClass("showing");
  // $(".content_sidebar-right").css({"overflow": "auto"});
}

$("body").on("click", ".btn-recipients", function(evt) {
  evt.stopPropagation();
  $(".toolbarRecipientsMenu").toggleClass("invisible");
  $(".toolbarRecipientsMenu").css({top: $(this).offset().top + $(this).outerHeight(), left: $(this).offset().left});
});

$("body").on("click", ".toolbarRecipientsMenu button.item", function(e) {
  var target = $(".toolbarRecipientsMenu").prev("button.btn-recipients");
  $(".toolbarRecipientsMenu button.item").removeClass("on");
  $(this).addClass("on");
  // console.log($(this).find(".ng-binding").text());
  target.find(".ng-binding").text($(this).find(".ng-binding").text());
  // target.find(".swatch-recipient").removeClass().addClass("swatch-recipient");
  target.find(".swatch-recipient").removeClass().addClass("swatch-recipient swatch-sm").addClass($(this).find(".swatch-recipient").attr("class"));

  target.attr("data-recipient-num", $(this).attr("data-recipient-num"));


  if(target.find(".swatch-recipient").hasClass("swatch-ext-0")) {
    svgFillColor = "#ffe084";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-1")) {
    svgFillColor = "#c0dcec";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-2")) {
    svgFillColor = "#F8CAC1";
  }

  $("#sidebarLeft").find(".swatch-recipient").removeClass().addClass("swatch-recipient swatch-lg").addClass($(this).find(".swatch-recipient").attr("class")).removeClass("swatch-round");
  $("#sidebarLeft").find(".icon-fields-standard").css("color", svgFillColor);
});

$(".content_sidebar-right").on("click", ".accordion", function(e) {
  if($(this).hasClass("open")) {
    $(this).removeClass("open").addClass("closed");
    // $(this).next(".drawer").removeClass("full open").addClass("down closed").css("height", 0);
    $(this).next(".drawer").css("height", 0);
  } else {
    $(this).addClass("open").removeClass("closed");
    // $(this).next(".drawer").removeClass("down closed").addClass("full open").css("height", "auto");
    $(this).next(".drawer").css("height", "auto");
  }
});

$("input").on("keydown", function(e) {
  e.stopPropagation();
});
$("input[data-qa='pay-amount-text']").on("keyup", function(e) {
  e.stopPropagation();
  selectedTag.find("span").text("$" + $(this).val());
});



// MOVE TO SEPERATE disclosure JS FILE
$(".singleDocument").on("click", function(e) {
// $(".content_main").scrollTop(1000);
// console.log($("." + $(this).attr("data-doc-num")).position().top);
  $(".content_main").scrollTop(0);
  // $(".content_main").animate({scrollTop: $("." + $(this).attr("data-doc-num")).position().top}, 200);
  $(".content_main").scrollTop($("." + $(this).attr("data-doc-num")).position().top);
});

$(".singleDocument").on("click", ".more_options", function(e) {
  e.stopPropagation();
  $(this).closest(".accordion").find(".menu").toggleClass("invisible");
});

$(".menu li").on("click", function(e) {
  $(this).closest(".menu").addClass("invisible");
});

$(".menu li[role='set_as_supplement']").on("click", function(e) {
  e.stopPropagation();
  var target = $(this).closest(".singleDocument");
  target.toggleClass("supplement");
  target.find(".accordion").click();
  // setDocumentHeight();

  if(target.hasClass("supplement")) {
    $(this).find(".item").text("Reset as Document");
    setDocumentAsSupplement(target.attr("data-doc-num"));
  } else {
    $(this).find(".item").text("Set as Supplement");
    setSupplementAsDocument(target.attr("data-doc-num"));
  }

  $(".disclosure").removeClass("selected");
});

function setDocumentAsSupplement(documentNum) {
  console.log(documentNum);
  $("." + documentNum).find(".PageView").addClass("hide_transition");
  $("." + documentNum).find(".disclosures").removeClass("hide_transition");
}
function setSupplementAsDocument(documentNum) {
  // console.log("")
  $("." + documentNum).find(".PageView").removeClass("hide_transition");
  $("." + documentNum).find(".disclosures").addClass("hide_transition");
}

$("body").on("click", function(e) {
  $(this).find(".disclosure").removeClass("selected");
  // $(this).find(".menu").addClass("invisible");
});
$("#taggerDocument").on("click", ".disclosure", function(e) {
  e.stopPropagation();
  $("#taggerDocument").find(".disclosure").removeClass("selected");
  $(this).addClass("selected");
  // console.log("disc");
  showOptions($(this));
  showSignerTabOptions();
});
$("#topNav").on("click", ".btn-trigger.action", function(e) {
  $("#menuOtherActions").toggleClass("invisible").css({"top": "50px", "left": $(this).offset().left - 30});
});

function showSignerTabOptions() {
  $(".drawer-properties .accordion").removeClass("open").addClass("closed");
  $(".drawer-properties .accordion").next(".drawer").css("height", 0);

  $(".drawer-properties .accordion[data-recipient-num=" + $("#btnRecipients").attr("data-recipient-num") + "]").click();
  // console.log($("#btnRecipients").attr("data-recipient-num"));
}

$("#topNav").on("click", ".btn-back", function() {
  window.location = "prepare.html"
});

$(".drawer-properties").on("click", ".btn-apply-all-signers", function() {
  var parent = $(this).closest(".drawer-content");

  parent.closest("div[data-qa='disclosure-options']").find(".cb_input.discMustOpen").prop("checked", parent.find(".cb_input.discMustOpen").prop("checked")).change();
  parent.closest("div[data-qa='disclosure-options']").find(".cb_input.discMustRead").prop("checked", parent.find(".cb_input.discMustRead").prop("checked"));
  parent.closest("div[data-qa='disclosure-options']").find(".cb_input.discMustAccept").prop("checked", parent.find(".cb_input.discMustAccept").prop("checked")).change();
});

$(".section").on("click", ".cb_label", function(e) {
  // console.log($(this).prev());
  var target=$(this).prev();
  target.prop("checked", (target.prop("checked")?false:true));
  target.change();
});

$(".section").on("change", ".cb_input", function(e) {
    // console.log(target.hasClass("discMustOpen"));
  var target=$(this);

  if(target.prop("checked") && target.hasClass("discMustOpen")) {
    target.closest(".section").next(".section").removeClass("hide_transition");
  } else if(!target.prop("checked") && target.hasClass("discMustOpen")) {
    target.closest(".section").next(".section").addClass("hide_transition");
    target.closest(".section").next(".section").find(".discMustRead").prop("checked", false);
  }

  if(target.prop("checked") && target.hasClass("discMustRead")) {
    target.closest(".section").next(".section").find(".discMustAccept").prop("checked", true);
  }

  if(!target.prop("checked") && target.hasClass("discMustAccept")) {
    target.closest(".section").prev(".section").find(".discMustRead").prop("checked", false);
  }

  var parent = $(this).closest(".drawer-properties_section");
  if(parent.find(".discMustOpen").prop("checked")) {
    parent.find(".disclosure-options-checked").text("viewed");
    // parent.prev().find(".disclosure-options-sub-head").text("Must view");
    parent.prev().find(".disclosure-options-sub-head").text("Must be " + parent.find(".disclosure-options-checked").text());
  }
  if(parent.find(".discMustAccept").prop("checked")) {
    parent.find(".disclosure-options-checked").text("accepted");
    // parent.prev().find(".disclosure-options-sub-head").text("Must accept");
    parent.prev().find(".disclosure-options-sub-head").text("Must be " + parent.find(".disclosure-options-checked").text());
  }
  if(parent.find(".discMustOpen").prop("checked") && parent.find(".discMustAccept").prop("checked")) {
    parent.find(".disclosure-options-checked").text("viewed and accepted");
    // parent.prev().find(".disclosure-options-sub-head").text("Must view & Must accept");
    parent.prev().find(".disclosure-options-sub-head").text("Must be " + parent.find(".disclosure-options-checked").text());
  }
  if(parent.find(".discMustOpen").prop("checked") && parent.find(".discMustRead").prop("checked") && parent.find(".discMustAccept").prop("checked")) {
    parent.find(".disclosure-options-checked").text("viewed, scrolled to end, and accepted");
    // parent.prev().find(".disclosure-options-sub-head").text("Must view, scroll & accept");
    parent.prev().find(".disclosure-options-sub-head").text("Must be " + parent.find(".disclosure-options-checked").text());
  }
  if(!parent.find(".discMustOpen").prop("checked") && !parent.find(".discMustAccept").prop("checked")) {
    parent.find(".disclosure-options-text-info").addClass("hidden");
    parent.find(".disclosure-options-text-info2").removeClass("hidden");
    parent.prev().find(".disclosure-options-sub-head").text("For information only");
  } else {
    parent.find(".disclosure-options-text-info").removeClass("hidden");
    parent.find(".disclosure-options-text-info2").addClass("hidden");
  }
});

$(".menu li[role='edit-documents']").on("click", function(e) {
  $("#modal_edit_docs, #modal_edit_docs .modal").addClass("modal-visible");
});
$("#modal_edit_docs").on("click", "button[data-qa='modal-confirm-btn']", function(e) {
  $("#modal_edit_docs, #modal_edit_docs .modal").removeClass("modal-visible");
  window.location = 'tagger.html';
});


$("#taggerDocument").on("click", ".btn_view", function() {
  $(".disclosure_pages").scrollTop(0);
  $(".btnOtherActions").parents(".drop-down").removeClass("open");

  var parent = $(this).closest(".disclosure");
  // parent.css({"transform": "rotateX(180deg)"});
  var target = parent.next("." + parent.attr("id"));
  target.removeClass("hidden");
  // $(".disclosure_doc, .disclosure_doc > .overlay").css("top", 0);
  target.css({"top": 0, "left": 0});
  target.find(".overlay").css({"top": 0, "left": 0});

  parent.find(".btn_agree").removeClass("disabled");

  scrollTop = $(".documents-wrapper").scrollTop();
  $(".content_main").addClass("scrollLock");
});

var scrollTop = $(".documents-wrapper").scrollTop();

$(".disclosure_tools .close_disclosure").on("click", function() {
  $(".disclosure_doc, .disclosure_doc > .overlay").css("top", "100%");
  $(".content_main").removeClass("scrollLock");

  // var mvp = ;
  $("#mobileviewport").attr("content","width=device-width,initial-scale=1.0,maximum-scale=1.0");
  setTimeout(function(){
    $("#mobileviewport").attr("content","width=device-width,initial-scale=1.0,maximum-scale=5.0");

    $("#envelope-wrapper").css({"height": $(window).outerHeight() - $("#action-bar-wrapper").outerHeight() - $("#footer-wrapper").outerHeight()});
    if($(window).width() > 768) {
      $("#envelope-wrapper").css({"height": $(window).outerHeight() - $("#toolbar-wrapper").outerHeight() - $("#action-bar-wrapper").outerHeight() - $("#footer-wrapper").outerHeight()});
    }
  }, 300);

});

$(".actions").on("click", ".action", function() {
  window.location = "create_form.html"
});

$(".content_main").on("click", ".PageView", function(evt) {
  evt.stopPropagation();
  var tagElem = $(".tagger_content > div.newTagDraggable");
  attachTagItem($(this), evt.pageX - $(this).offset().left - tagElem.width()/2, evt.pageY - $(this).offset().top - tagElem.height()/2);
});

function moveNewTag(event) {
  var target = $(".tagger_content > div.newTagDraggable");
  target.css({left: event.pageX - target.width()/2, top: event.pageY - target.height()/2}).addClass("dragAlong");
  $(".tagger_content").on("mousemove", dragTagAlong);
}
function dragTagAlong(event) {
  var target = $(".tagger_content > div.newTagDraggable");
  target.css({left: event.pageX - target.width()/2, top: event.pageY - target.height()/2});
}
function attachTagItem(target, posLeft, posTop) {
  // var target = $(".tagger_content > div.newTagDraggable");
  $(".tagger_content > div.newTagDraggable").removeClass("dragAlong").css({"position": "absolute", "left": posLeft, "top": posTop});
  if($(".tagger_content > div.newTagDraggable").length > 0) {
    target.append($(".tagger_content > div.newTagDraggable"));
    $(".tagger_content > div.newTagDraggable").remove();
  }
  // target.css({left: event.pageX - target.width()/3, top: event.pageY - 51 - target.height()/2,transition: "none"});
}


$(".content_main").on("click", ".newTagDraggable .tag_settings", function(evt) {
  evt.stopPropagation();
  console.log("settings");
  $(".feature_unavailable").first().click();
});
