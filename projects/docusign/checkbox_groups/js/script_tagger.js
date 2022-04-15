var svgFillColor = "#ffe084";
var selectedTag;
var selectedRecipientId = "recipient-1";
var firstTagDrop = true;
var deleteTagAllowed = true;
var joinNextKey = false;
var keyCharacters = "";
var lastPaymentAmount = 0;
var lastTextValue = "";
var acclerationUnitDirection = 15;

$(document).ready(function(e) {
  setDocumentHeight();

  // console.log($(".content_main")[0].scrollHeight);
  // console.log($("#documentTags").height());
});


function setDocumentHeight() {
  // ADDING TIMEOUT FOR CHROME TO LOAD / RENDER EVERYTHING PROPERLY
  window.setTimeout(function() {
    // $("#documentTags").attr("height", $(".content_main")[0].scrollHeight);
  }, 200);
}

$(".content_sidebar-right").on("click", ".btn-utility[data-qa='properties-panel-delete']", function() {
  deleteTag(selectedTag);
});

$(".content_main").on("click", ".tag_settings_options .tag_actions .deleteTag", function() {
  deleteTag($(this).closest(".newTagDraggable"));
});
$(".content_main").on("click", ".tag_settings_options .tag_actions .link", function() {
  $(".feature_unavailable").first().click();
});
$(".content_sidebar-left").on("mousedown", "button.item.btn,button.menu_item", function(evt) {
  var newTag;
  var tagForRecipient = $(".site_toolbar.toolbar_tagger .btn-recipients .ng-binding").text();

  // $(".content_main").scrollTop($("#documentTags").height() - $("#documentTags").height()/5);
  if($(this).attr("data-qa") == "Signature") {
    newTag = $('<div class="newTagDraggable draggable SignatureTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="display: flex"><div class="the_tag" style="background-color: ' + svgFillColor + '"><img style="cursor: auto;" src="images/svg/SignHereActive150.svg"/></div></div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Initial") {
    newTag = $('<div class="newTagDraggable draggable InitialsTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="display: flex"><div class="the_tag" style="background-color: ' + svgFillColor + '"><img src="images/svg/InitialHereActive150.svg" style="pointer-events: none;" width="34" height="40"/></div></div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Date Signed") {
    newTag = $('<div class="newTagDraggable draggable DateSignedTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="display: flex"><div class="the_tag" style="background-color: ' + svgFillColor + '"><span>Date Signed</span></div></div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Name") {
    newTag = $('<div class="newTagDraggable draggable NameTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="display: flex"><div class="the_tag" style="background-color: ' + svgFillColor + '"><span>Full Name</span></div></div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Email") {
    newTag = $('<div class="newTagDraggable draggable EmailTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="display: flex"><div class="the_tag" style="background-color: ' + svgFillColor + '"><span>Email</span></div></div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Company") {
    newTag = $('<div class="newTagDraggable draggable CompanyTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="display: flex"><div class="the_tag" style="background-color: ' + svgFillColor + '"><span>Company</span></div></div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Title") {
    newTag = $('<div class="newTagDraggable draggable TitleTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="display: flex"><div class="the_tag" style="background-color: ' + svgFillColor + '"><span>Title</span></div></div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Text") {
    newTag = $('<div class="newTagDraggable draggable DataTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="display: flex"><div class="the_tag" style="background-color: ' + svgFillColor + '"><textarea class="input-textarea" rows="1" placeholder="Text"></textarea></div></div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Checkbox") {
    // newTag = $('<div class="newTagDraggable draggable CheckboxTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="display: flex"><div class="the_tag" style="background-color: ' + svgFillColor + '"><input type="checkbox" class="input-cb"/></div></div></div>');
    newTag = $('<div class="newTagDraggable  CheckboxTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="display: flex" class="checkbox_radio_sub draggable"><div class="the_tag" style="background-color: ' + svgFillColor + '"><input type="checkbox" class="input-cb"/></div></div><div class="add_new_option">+</div><div class="overlay_tags_border"></div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Dropdown") {
    // newTag = $('<div class="newTagDraggable draggable DropdownTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="display: flex"><div class="the_tag" style="background-color: ' + svgFillColor + '"><div><select><option>One</option><option>two</option><option>three</option><option>four</option><option>five</option></select></div></div></div></div>');

    newTag = $('<div class="newTagDraggable draggable DropdownTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="display: flex"><div class="the_tag" style="background-color: ' + svgFillColor + '"><div class="dropdown_menu"><button type="button" class="btn btn-select btn-block btn-trigger u-ellipsis ng-scope"><span class="ng-binding">One</span></button><div class="menu select-menu invisible"><ul role="menu" aria-labelledby=""><li class="item ng-binding ng-scope on" role="menuitem">One</li><li class="item ng-binding ng-scope" role="menuitem">Two</li><li class="item ng-binding ng-scope" role="menuitem">Three</li><li class="item ng-binding ng-scope" role="menuitem">Four</li><li class="item ng-binding ng-scope" role="menuitem">Five</li><li class="item ng-binding ng-scope" role="menuitem">Six</li><li class="item ng-binding ng-scope" role="menuitem">Seven</li><li class="item ng-binding ng-scope" role="menuitem">Eight</li><li class="item ng-binding ng-scope" role="menuitem">Nine</li><li class="item ng-binding ng-scope" role="menuitem">Ten</li></ul></div></div></div></div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Radio") {
    var radio_grp_num = Math.round(Math.random() * Math.random() * 1000);
    // newTag = $('<div class="newTagDraggable draggable RadioTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="display: flex" class="checkbox_radio_sub"><div class="the_tag" style="background-color: ' + svgFillColor + '"><input type="radio" class="input-rb" name="radio_grp_' + radio_grp_num + '"/></div></div><div style="display: flex" class="checkbox_radio_sub"><div class="the_tag" style="background-color: ' + svgFillColor + '"><input type="radio" class="input-rb" name="radio_grp_' + radio_grp_num + '"/></div></div><div class="add_new_option">+</div></div>');
    newTag = $('<div class="newTagDraggable RadioTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="display: flex" class="checkbox_radio_sub draggable"><div class="the_tag" style="background-color: ' + svgFillColor + '"><input type="radio" class="input-rb" name="radio_grp_' + radio_grp_num + '"/></div></div><div style="display: flex" class="checkbox_radio_sub draggable"><div class="the_tag" style="background-color: ' + svgFillColor + '"><input type="radio" class="input-rb" name="radio_grp_' + radio_grp_num + '"/></div></div><div class="add_new_option">+</div><div class="overlay_tags_border"></div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Attachment") {
    newTag = $('<div class="newTagDraggable draggable AttachmentTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="display: flex"><div class="the_tag" style="background-color: ' + svgFillColor + '"><img src="images/svg/tag-attachment.svg"/></div></div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Note") {
    newTag = $('<div class="newTagDraggable draggable NoteTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="display: flex"><div class="the_tag" style="background-color: ' + svgFillColor + '"><img src="images/svg/field-note.svg" style="pointer-events: none;" width="12" height="12" x="2" y="2"/><textarea class="input-textarea" rows="4" placeholder="Note"></textarea></div></div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Approve") {
    newTag = $('<div class="newTagDraggable draggable ApproveTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="display: flex"><div class="the_tag" style="background-color: ' + svgFillColor + '"><span>Approve</span></div></div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Decline") {
    newTag = $('<div class="newTagDraggable draggable DeclineTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="display: flex"><div class="the_tag" style="background-color: ' + svgFillColor + '"><span>Decline</span></div></div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Formula") {
    newTag = $('<div class="newTagDraggable draggable FormulaTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="display: flex"><div class="the_tag" style="background-color: ' + svgFillColor + '"><img src="images/svg/tag-formula.svg" style="pointer-events: none;" width="9" height="8.031048387096773" x="3" y="1"/></div></div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);

  } else if($(this).attr("data-qa") == "Payment") {
    newTag = $('<div class="newTagDraggable draggable PaymentTabView" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="display: flex"><div class="the_tag" style="background-color: ' + svgFillColor + '">$ <input type="number" placeholder="0.00" /></div></div></div>');

    // if(isPaymentGatewayAdded) {
      // $("#documentTags").append(newTag);
      $(".tagger_content").append(newTag);
      moveNewTag(evt);
    // } else {
      // addPaymentGateway();
    // }
  } else if($(this).attr("data-qa") == "SignReturn Signature") {
    newTag = $('<div class="newTagDraggable draggable" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="width: 120px; height: 50px;"><img src="images/alex_freeform_sign.gif" style="pointer-events: none;"/></div></div>');
    // $("#documentTags").append(newTag);
    $(".tagger_content").append(newTag);
    moveNewTag(evt);
  } else if($(this).attr("data-qa") == "SignReturn Initial") {
    newTag = $('<div class="newTagDraggable draggable" data-name="' + $(this).attr("data-qa") + '" data-tag-for="' + tagForRecipient + '"><div style="width: 50px; height: 50px;"><img src="images/alex_freeform_initial.gif" style="pointer-events: none;"/></div></div>');
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
  // $(".content_main").html($(".content_main").html());

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
    // console.log(xPos);
    // console.log(yPos);
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
    // restriction: "parent",
    endOnly: true
  },
  // enable autoScroll
  autoScroll: true,

  onstart: function(event) {
    // $(event.target).find(".the_tag input, .the_tag textarea").blur();
  },
  // call this function on every dragmove event
  onmove: dragMoveListener,
  // call this function on every dragend event
  onend: function (event) {
    // $(event.target).find(".the_tag input[type='text'], .the_tag input[type='number'], .the_tag textarea").focus();

    // $(event.target).css("left", parseInt($(event.target).css("left")) + parseInt($(event.target).attr("data-x")));
    // $(event.target).css("top", parseInt($(event.target).css("top")) + parseInt($(event.target).attr("data-y")));
    //
    // event.target.style.webkitTransform =
    // event.target.style.transform = 'none';
    // event.target.style.transition = 'none';

    resizeBoundingBox(event.target);
  }
});

function resizeBoundingBox(targetEl) {
  if($(targetEl).closest(".CheckboxTabView") && $(targetEl).closest(".CheckboxTabView").length > 0) {
    var boundingArray = [];
    // $(targetEl).closest(".CheckboxTabView").css({"width": })
    $(targetEl).closest(".CheckboxTabView").find(".checkbox_radio_sub").each(function() {
      // console.log($(this).position().left);
      // console.log($(this).width());
      boundingArray.push($(this));
    });
    // console.log(boundingArray[boundingArray.length-1]);
    boundingArray.sort(getBoundsLeftWidth);
    // console.log(boundingArray[0].position().left);
    // console.log(boundingArray[boundingArray.length-1].position().left);

    $(targetEl).closest(".CheckboxTabView").find(".overlay_tags_border").css({
      "left": boundingArray[0].position().left - 1 + "px",
      "width":  boundingArray[boundingArray.length-1].position().left - boundingArray[0].position().left + 22 + "px"
    });
    boundingArray.sort(getBoundsTopHeight);
    $(targetEl).closest(".CheckboxTabView").find(".overlay_tags_border").css({
      "top": boundingArray[0].position().top - 1 + "px",
      "height":  boundingArray[boundingArray.length-1].position().top - boundingArray[0].position().top + 22 + "px"
    });

    // $(targetEl).closest(".CheckboxTabView").find(".add_new_option").css({"top": boundingArray[boundingArray.length-1].position().top - boundingArray[0].position().top + 22 + "px"});
  }

  if($(targetEl).closest(".RadioTabView") && $(targetEl).closest(".RadioTabView").length > 0) {
    var boundingArray = [];
    // $(targetEl).closest(".RadioTabView").css({"width": })
    $(targetEl).closest(".RadioTabView").find(".checkbox_radio_sub").each(function() {
      // console.log($(this).position().left);
      // console.log($(this).width());
      boundingArray.push($(this));
    });
    // console.log(boundingArray[boundingArray.length-1]);
    boundingArray.sort(getBoundsLeftWidth);
    // console.log(boundingArray[0].position().left);
    // console.log(boundingArray[boundingArray.length-1].position().left);

    $(targetEl).closest(".RadioTabView").find(".overlay_tags_border").css({
      "left": boundingArray[0].position().left - 1 + "px",
      "width":  boundingArray[boundingArray.length-1].position().left - boundingArray[0].position().left + 22 + "px"
    });
    boundingArray.sort(getBoundsTopHeight);
    $(targetEl).closest(".RadioTabView").find(".overlay_tags_border").css({
      "top": boundingArray[0].position().top - 1 + "px",
      "height":  boundingArray[boundingArray.length-1].position().top - boundingArray[0].position().top + 22 + "px"
    });
  }

  window.setTimeout(function() {
    $(targetEl).closest(".newTagDraggable").find(".add_new_option").css({"top": parseInt($(targetEl).closest(".newTagDraggable").find(".overlay_tags_border").css("top")) + parseInt($(targetEl).closest(".newTagDraggable").find(".overlay_tags_border").height()) + 2 + "px",
    "left": parseInt($(targetEl).closest(".newTagDraggable").find(".overlay_tags_border").css("left")) + parseInt($(targetEl).closest(".newTagDraggable").find(".overlay_tags_border").width())/2 - 8 + "px"});

    // $(targetEl).closest(".newTagDraggable").find(".draggable").removeClass("checkbox_radio_selected");
    // $(targetEl).addClass("checkbox_radio_selected");
  }, 150);
}

function getBoundsLeftWidth(a, b) {
  if (a.offset().left > b.offset().left) {
    return 1;
  } else if (a.offset().left < b.offset().left) {
    return -1;
  } else {
    return 0;
  }
}
function getBoundsTopHeight(a, b) {
  if (a.offset().top > b.offset().top) {
    return 1;
  } else if (a.offset().top < b.offset().top) {
    return -1;
  } else {
    return 0;
  }
}

function dragMoveListener (event) {
  var parentOffset = $(event.target).closest(".PageView").offset();
  //or $(this).offset(); if you really just want the current element's offset
  var relX = event.pageX - parentOffset.left;
  var relY = event.pageY - parentOffset.top;

  // $(event.target).find(".the_tag input[type='text'], .the_tag input[type='number'], .the_tag textarea").blur();
  if(!$(event.target).find("textarea").is(':focus')) {
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
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;


$("body").on("click", function(evt) {
  evt.stopPropagation();
  $(".content_main .draggable, .content_main .newTagDraggable").removeClass("selected");
  selectedTag = null;
  $(".content_main .tag_settings_options").addClass("hidden");

  $(".drawer-properties").find(".drawer-content").removeClass("showing");
  $(".content_sidebar-right").css({"overflow": "auto"});
});
$("body").on("click", ".content_sidebar-right", function(evt) {
  evt.stopPropagation();
  // $(".draggable").removeClass("selected");
  // selectedTag = null;
});

$(".content_main").on("click", ".newTagDraggable", function(evt) {
  // evt.preventDefault();
  evt.stopPropagation();
  if(!$(this).hasClass("RadioTabView") && !$(this).hasClass("CheckboxTabView")) {
    showOptions($(this), false);
  }
});
$(".content_main").on("click", ".newTagDraggable .draggable", function(evt) {
  // evt.preventDefault();
  evt.stopPropagation();
  if($(this).closest(".newTagDraggable").hasClass("RadioTabView") || $(this).closest(".newTagDraggable").hasClass("CheckboxTabView")) {
    showOptions($(this).closest(".newTagDraggable"), false, $(this));
  }
});
$(".content_main").on("dblclick", ".newTagDraggable", function(evt) {
  // evt.preventDefault();
  evt.stopPropagation();
  if($(this).find(".the_tag textarea, .the_tag input[type='text'], .the_tag input[type='number']").length > 0) {
    $(this).addClass("isEditing");
    $(this).find(".the_tag textarea, .the_tag input[type='text'], .the_tag input[type='number']").focus();
  }
});

function resetTags() {
  $("body").find(".draggable").each(function() {
    deleteTag($(this));
  });
}

function showOptions(element, isShiftPressed, sub_element) {
  $(".content_main .draggable, .content_main .newTagDraggable").removeClass("selected");
  if(!element.is(selectedTag)) {
    $(".content_main .draggable, .content_main .newTagDraggable").find(".the_tag textarea, .the_tag input, .the_tag select").blur();
  }
  element.addClass("selected");
  selectedTag = element;
  if(selectedTag.hasClass("RadioTabView")) {
    if(isShiftPressed) {
      selectedTag.children(".checkbox_radio_sub").removeClass("checkbox_radio_selected").last().addClass("checkbox_radio_selected");
    } else {
      selectedTag.children(".checkbox_radio_sub").removeClass("checkbox_radio_selected").first().addClass("checkbox_radio_selected");
    }
  }
  if(selectedTag.hasClass("CheckboxTabView")) {
    if(isShiftPressed) {
      selectedTag.children(".checkbox_radio_sub").removeClass("checkbox_radio_selected").last().addClass("checkbox_radio_selected");
    } else {
      selectedTag.children(".checkbox_radio_sub").removeClass("checkbox_radio_selected").first().addClass("checkbox_radio_selected");
    }
  }
  if(sub_element && sub_element.length == 1) {
    selectedTag.find(".draggable").removeClass("checkbox_radio_selected");
    sub_element.addClass("checkbox_radio_selected");
  }
  if(selectedTag.hasClass("isEditing")) {
    selectedTag.find(".the_tag textarea, .the_tag input[type='text'], .the_tag input[type='number'], .the_tag select").first().focus();
  }

  $(".drawer-properties").find(".drawer-content").addClass("showing");

  $(".drawer-properties").find(".drawer-properties_header .icon img").remove();
  $(".drawer-properties").find(".drawer-properties_header .icon").removeClass().addClass("icon icon-palette-field-" + (element.attr("data-name")=="Signature"?"sign":element.attr("data-name").toLowerCase()) + "");

  $(".drawer-properties").find(".drawer-properties_header .ng-binding").text(element.attr("data-name")=="Disclosure"?"Supplement":element.attr("data-name"));
  $(".content_sidebar-right").css({"overflow": "hidden"});

  $(".drawer-properties_main > .tag_option").addClass("hidden");
  $(".drawer-properties_footer").removeClass("hidden");
  if(element.attr("data-name")=="Signature") {
    // $(".drawer-properties_main > .drawer-properties_section > [data-qa='read-only-checkbox']").addClass("hidden");
    $(".drawer-properties_main > .drawer-properties_section > [data-qa='read-only-checkbox']").removeClass("hidden");

    $(".drawer-properties_main > .tag_option[data-qa='data-label-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='anchor-tabs-properties-accordion']").removeClass("hidden");
  }
  if(element.attr("data-name")=="Payment") {
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
  if(element.attr("data-name")=="Text") {
    $(".drawer-properties_main > .drawer-properties_section > [data-qa='read-only-checkbox']").addClass("hidden");

    // $(".drawer-properties_main > .tag_option[data-qa='pay-provider-properties-accordion']").removeClass("hidden");
    // $(".drawer-properties_main > .tag_option[data-qa='pay-amount-properties-accordion']").removeClass("hidden");
    // $(".drawer-properties_main > .tag_option[data-qa='pay-description-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='add-text-accordion']").removeClass("hidden");
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
  if(element.attr("data-name")=="Checkbox") {
    $(".drawer-properties").find(".drawer-properties_header .ng-binding").text("Checkbox Group");
    $(".drawer-properties_main > .drawer-properties_section [data-qa='required-field-checkbox']").addClass("hidden");


    $(".drawer-properties_main > .tag_option[data-qa='group-data-label-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='checkbox-group-values-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='tooltip-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='checkbox-group-validation-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='anchor-tabs-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='collab-property-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='conditional-logic-properties-accordion']").removeClass("hidden");
  }
}

$("body").on("keydown", function(evt) {
  // KEYCODES
  // DEL   = 8
  // TAB   = 9
  // DOWN  = 40
  // UP    = 38
  // ENTER = 13
  // SPACE = 32
  // ESC   = 27
  // NUMS  = 48 - 57
  // ALPHA = 65 - 90


  if(evt.keyCode == 9 && !selectedTag && $(".sidebar-fields[data-tab-name='Standard Fields'] .menu_listItem .menu_item").last().is(":focus")) {
    evt.preventDefault();
    $(".sidebar_main .sidebarTabs .sidebarTabs_tab[data-qa='Standard Fields']").focus();
  }
  if(evt.keyCode == 9 && selectedTag && !$(".RadioTabView").hasClass("selected") && !$(".CheckboxTabView").hasClass("selected")) {
    evt.preventDefault();
    if(evt.shiftKey) {
      tabToPrevTag();
    } else {
      tabToNextTag();
    }
  } else if(evt.keyCode == 9 && selectedTag && $(".RadioTabView").hasClass("selected")) {
    evt.preventDefault();
    if(!evt.shiftKey && selectedTag.find(".checkbox_radio_sub.checkbox_radio_selected").next(".checkbox_radio_sub").length > 0) {
      selectedTag.find(".checkbox_radio_sub.checkbox_radio_selected").removeClass("checkbox_radio_selected").next(".checkbox_radio_sub").addClass("checkbox_radio_selected");
    } else if(evt.shiftKey && selectedTag.find(".checkbox_radio_sub.checkbox_radio_selected").prev(".checkbox_radio_sub").length > 0) {
      selectedTag.find(".checkbox_radio_sub.checkbox_radio_selected").removeClass("checkbox_radio_selected").prev(".checkbox_radio_sub").addClass("checkbox_radio_selected");
    } else {
      if(evt.shiftKey) {
        tabToPrevTag();
      } else {
        tabToNextTag();
      }
    }
  } else if(evt.keyCode == 9 && selectedTag && $(".CheckboxTabView").hasClass("selected") && !$(".drawer-properties_main input").is(":focus")) {
    evt.preventDefault();
    if(!evt.shiftKey && selectedTag.find(".checkbox_radio_sub.checkbox_radio_selected").next(".checkbox_radio_sub").length > 0) {
      selectedTag.find(".checkbox_radio_sub.checkbox_radio_selected").removeClass("checkbox_radio_selected").next(".checkbox_radio_sub").addClass("checkbox_radio_selected");
    } else if(evt.shiftKey && selectedTag.find(".checkbox_radio_sub.checkbox_radio_selected").prev(".checkbox_radio_sub").length > 0) {
      selectedTag.find(".checkbox_radio_sub.checkbox_radio_selected").removeClass("checkbox_radio_selected").prev(".checkbox_radio_sub").addClass("checkbox_radio_selected");
    } else {
      if(evt.shiftKey) {
        tabToPrevTag();
      } else {
        tabToNextTag();
      }
    }
  }

  if(evt.keyCode == 27) {
    evt.preventDefault();
    if($(".PaymentTabView").hasClass("selected")) {
      selectedTag.find(".the_tag input[type='text'], .the_tag input[type='number']").val(lastPaymentAmount);
    }
    if($(".DataTabView").hasClass("selected") || $(".NoteTabView").hasClass("selected")) {
      selectedTag.find(".the_tag textarea").val(lastTextValue);
    }
    selectedTag.find(".the_tag input, .the_tag textarea").blur();
  }


  if(evt.keyCode == 40 && $(".RadioTabView").hasClass("selected")) {
    evt.preventDefault();
    if(selectedTag.find(".checkbox_radio_sub.checkbox_radio_selected").next(".checkbox_radio_sub").length > 0) {
      selectedTag.find(".checkbox_radio_sub.checkbox_radio_selected").removeClass("checkbox_radio_selected").next(".checkbox_radio_sub").addClass("checkbox_radio_selected");
    }
  }
  if(evt.keyCode == 38 && $(".RadioTabView").hasClass("selected")) {
    evt.preventDefault();
    if(selectedTag.find(".checkbox_radio_sub.checkbox_radio_selected").prev(".checkbox_radio_sub").length > 0) {
      selectedTag.find(".checkbox_radio_sub.checkbox_radio_selected").removeClass("checkbox_radio_selected").prev(".checkbox_radio_sub").addClass("checkbox_radio_selected");
    }
  }
  if(evt.keyCode == 40 && $(".CheckboxTabView").hasClass("selected")) {
    evt.preventDefault();
    if(selectedTag.find(".checkbox_radio_sub.checkbox_radio_selected").next(".checkbox_radio_sub").length > 0) {
      selectedTag.find(".checkbox_radio_sub.checkbox_radio_selected").removeClass("checkbox_radio_selected").next(".checkbox_radio_sub").addClass("checkbox_radio_selected");
    }
  }
  if(evt.keyCode == 38 && $(".CheckboxTabView").hasClass("selected")) {
    evt.preventDefault();
    if(selectedTag.find(".checkbox_radio_sub.checkbox_radio_selected").prev(".checkbox_radio_sub").length > 0) {
      selectedTag.find(".checkbox_radio_sub.checkbox_radio_selected").removeClass("checkbox_radio_selected").prev(".checkbox_radio_sub").addClass("checkbox_radio_selected");
    }
  }

  if((evt.keyCode == 13 || evt.keyCode == 32) && $(".RadioTabView").hasClass("selected")) {
    evt.preventDefault();
    selectedTag.find(".checkbox_radio_sub.checkbox_radio_selected input").prop("checked", true);
  }
  if((evt.keyCode == 13 || evt.keyCode == 32) && $(".CheckboxTabView").hasClass("selected")) {
    evt.preventDefault();
    // selectedTag.find(".the_tag input").prop("checked", !selectedTag.find(".the_tag input").prop("checked"));
    selectedTag.find(".checkbox_radio_sub.checkbox_radio_selected input").prop("checked", !selectedTag.find(".checkbox_radio_sub.checkbox_radio_selected input").prop("checked"));
  }

  if((evt.keyCode == 32 || evt.keyCode == 13) && $(".DropdownTabView").hasClass("selected")) {
    evt.preventDefault();
    selectedTag.addClass("isEditing");
    // console.log(selectedTag.find(".the_tag select"));
    selectedTag.find(".the_tag .btn-trigger").click();
    if(!selectedTag.find(".dropdown_menu .select-menu").hasClass("invisible")) {
      selectedTag.find(".dropdown_menu .select-menu .item").first().addClass("pseudo_hover");
    } else if(selectedTag.find(".dropdown_menu .select-menu").hasClass("invisible")) {
      selectedTag.find(".dropdown_menu .select-menu .pseudo_hover.item").click();
    }
  }

  if(evt.keyCode == 27 && $(".DropdownTabView").hasClass("selected")) {
    evt.preventDefault();
    selectedTag.find(".dropdown_menu .select-menu").addClass("invisible");
    selectedTag.removeClass("isEditing");
  }
  if(evt.keyCode == 40 && $(".DropdownTabView").hasClass("selected")) {
    if(selectedTag.hasClass("isEditing")) {
      evt.preventDefault();
      if(!selectedTag.find(".dropdown_menu .select-menu").hasClass("invisible") && selectedTag.find(".dropdown_menu .select-menu .item.pseudo_hover").next(".item").length > 0) {
        selectedTag.find(".dropdown_menu .select-menu .item.pseudo_hover").removeClass("pseudo_hover").next(".item").addClass("pseudo_hover");
      } else if(selectedTag.find(".dropdown_menu .select-menu .item.pseudo_hover").length <= 0) {
        selectedTag.find(".dropdown_menu .select-menu .item").first().addClass("pseudo_hover");
      }
    }
  }
  if(evt.keyCode == 38 && $(".DropdownTabView").hasClass("selected")) {
    if(selectedTag.hasClass("isEditing")) {
      evt.preventDefault();
      if(!selectedTag.find(".dropdown_menu .select-menu").hasClass("invisible") && selectedTag.find(".dropdown_menu .select-menu .item.pseudo_hover").prev(".item").length > 0) {
        selectedTag.find(".dropdown_menu .select-menu .item.pseudo_hover").removeClass("pseudo_hover").prev(".item").addClass("pseudo_hover");
      } else if(selectedTag.find(".dropdown_menu .select-menu .item.pseudo_hover").length <= 0) {
        selectedTag.find(".dropdown_menu .select-menu .item").last().addClass("pseudo_hover");
      }
    }
  }

  if(((evt.keyCode >= 48 && evt.keyCode <= 57) || (evt.keyCode >= 65 && evt.keyCode <= 90)) && $(".DropdownTabView").hasClass("selected")) {
    evt.preventDefault();
    // var value = this.value + String.fromCharCode(evt.keyCode);
    // console.log(String.fromCharCode(evt.keyCode));
    if(!selectedTag.find(".dropdown_menu .select-menu").hasClass("invisible")) {
      dropdownKeySearch(String.fromCharCode(evt.keyCode).toLowerCase() + "");
    } else if (selectedTag.find(".dropdown_menu .select-menu").hasClass("invisible")) {
      var searchAndSelect = true;
      dropdownKeySearch(String.fromCharCode(evt.keyCode).toLowerCase() + "", searchAndSelect);
    }
  }
  if(selectedTag && ((evt.keyCode >= 48 && evt.keyCode <= 57) || (evt.keyCode >= 65 && evt.keyCode <= 90))) {
    // evt.preventDefault();
    if(!selectedTag.find(".the_tag input[type='text'], .the_tag input[type='number'], .the_tag textarea").is(":focus")) {
      selectedTag.find(".the_tag input[type='text'], .the_tag input[type='number'], .the_tag textarea").focus();
    }
  }

  if(selectedTag != null && evt.keyCode == 69 && (evt.ctrlKey || evt.metaKey)) {
    // console.log('dakskaks');
    $("#tagDetailRequired").focus();
  }
  if(evt.keyCode == 76 && (evt.ctrlKey || evt.metaKey)) {
    // console.log('dakskaks');
    evt.preventDefault();
    $(".sidebar_main .sidebarTabs .sidebarTabs_tab[data-qa='Standard Fields']").click();
    $(".sidebar-fields[data-tab-name='Standard Fields'] .menu_listItem .menu_item[data-qa='Signature']").focus();
  }
  if((evt.keyCode == 13) && !selectedTag && $(".sidebar_main .sidebar-fields .menu_list button.menu_item").is(":focus")) {
    evt.preventDefault();
    $(".sidebar_main .sidebar-fields .menu_list button.menu_item:focus").mousedown().blur();

    var fakeClickEvt = new jQuery.Event("mouseup");
    fakeClickEvt.pageX = $(".content_sidebar-left").innerWidth() + $(".content_main").innerWidth()/2;
    fakeClickEvt.pageY = $(".content_main").scrollTop() + 350;
    $(".content_main .PageView").first().trigger(fakeClickEvt);

    $(".content_main .PageView .newTagDraggable").last().click();
  }

  if(evt.keyCode == 37 && selectedTag && !selectedTag.find(".the_tag textarea, .the_tag input[type='number']").is(":focus")) {
    evt.preventDefault();
    if(parseInt(selectedTag.css("left")) > 0) {
      selectedTag.css("left", parseInt(selectedTag.css("left")) - (1 * acclerationUnitDirection));
      console.log(selectedTag.css("left"));
      if(parseInt(selectedTag.css("left")) < $(".content_main").scrollLeft()) {
        $(".content_main").animate({ scrollLeft: $(".content_main").scrollLeft() - 100 }, 250);
      }
    }
  }
  if(evt.keyCode == 38 && selectedTag && !selectedTag.find(".the_tag textarea, .the_tag input[type='number']").is(":focus")) {
    evt.preventDefault();
    if(!selectedTag.hasClass("isEditing")) {
      if(parseInt(selectedTag.css("top")) > 0) {
        selectedTag.css("top", parseInt(selectedTag.css("top")) - (1 * acclerationUnitDirection));
        console.log(selectedTag.css("top"));
        if(parseInt(selectedTag.css("top")) < $(".content_main").scrollTop()) {
          $(".content_main").animate({ scrollTop: $(".content_main").scrollTop() - 100 }, 250);
        }
      }
    } else if(selectedTag.hasClass("isEditing")) {
      if(selectedTag.find(".dropdown_menu .menu .item.on").prev().length >= 0 && selectedTag.find(".dropdown_menu .menu").hasClass("invisible")) {
        selectedTag.find(".the_tag .btn-trigger").click();
        selectedTag.find(".dropdown_menu .menu .item.on").addClass("pseudo_hover");
      }
    }
  }
  if(evt.keyCode == 39 && selectedTag && !selectedTag.find(".the_tag textarea, .the_tag input[type='number']").is(":focus")) {
    evt.preventDefault();
    if(selectedTag.closest(".PageView").innerWidth() - (parseInt(selectedTag.css("left")) + parseInt(selectedTag.css("width"))) > 2) {
      selectedTag.css("left", parseInt(selectedTag.css("left")) + (1 * acclerationUnitDirection));
      console.log(selectedTag.css("left"));
      if((parseInt(selectedTag.css("left")) + selectedTag.width()) > ($(".content_main").scrollLeft() + $(".content_main").width())) {
        $(".content_main").animate({ scrollLeft: $(".content_main").scrollLeft() + 100 }, 250);
      }
    }
  }
  if(evt.keyCode == 40 && selectedTag && !selectedTag.find(".the_tag textarea, .the_tag input[type='number']").is(":focus")) {
    evt.preventDefault();
    // console.log(selectedTag.closest(".PageView").innerHeight() - (parseInt(selectedTag.css("top")) + parseInt(selectedTag.css("height"))));
    if(!selectedTag.hasClass("isEditing")) {
      if(selectedTag.closest(".PageView").innerHeight() - (parseInt(selectedTag.css("top")) + parseInt(selectedTag.css("height"))) > 2) {
        selectedTag.css("top", parseInt(selectedTag.css("top")) + (1 * acclerationUnitDirection));
        console.log(selectedTag.css("top"));
        console.log($(".content_main").height());
        if((parseInt(selectedTag.css("top")) + selectedTag.height()) > ($(".content_main").scrollTop() + $(".content_main").height())) {
          $(".content_main").animate({ scrollTop: $(".content_main").scrollTop() + 100 }, 250);
        }
      }
    } else if(selectedTag.hasClass("isEditing")) {
      if(selectedTag.find(".dropdown_menu .menu .item.on").next().length >= 0 && selectedTag.find(".dropdown_menu .menu").hasClass("invisible")) {
        selectedTag.find(".the_tag .btn-trigger").click();
        selectedTag.find(".dropdown_menu .menu .item.on").addClass("pseudo_hover");
      }
    }
  }

  if((evt.keyCode == 13) && evt.altKey) {
    selectedTag.find(".the_tag textarea, .the_tag input[type='number']").val(selectedTag.find(".the_tag textarea, .the_tag input[type='number']").val() + '\n').blur().focus();
  }
  if((evt.keyCode == 13) && !evt.altKey && selectedTag && selectedTag.find(".the_tag textarea, .the_tag input[type='number']").is(":focus")) {
    evt.preventDefault();
    if(selectedTag.find(".the_tag textarea, .the_tag input[type='number']").is(":focus")) {
      lastTextValue = selectedTag.find(".the_tag textarea, .the_tag input[type='number']").val();
      selectedTag.find(".the_tag textarea, .the_tag input[type='number']").blur();
    }
  } else if((evt.keyCode == 13) && !evt.altKey && selectedTag && !selectedTag.find(".the_tag textarea, .the_tag input[type='number']").is(":focus")) {
    evt.preventDefault();
    selectedTag.find(".the_tag textarea, .the_tag input[type='number']").focus();
  }

  if(evt.keyCode == 8 && selectedTag.hasClass("selected") && deleteTagAllowed) {
    if(!$(".drawer-properties_main input[type='text']").is(":focus")) {
      evt.preventDefault();
      deleteTag(selectedTag);
    }
  }
});

function dropdownKeySearch(keyCode, searchAndSelect) {
  if(!joinNextKey) {
    keyCharacters = keyCode;
    joinNextKey = true;
  } else {
    keyCharacters += keyCode;
    clearTimeout(nextKeyTimer);
  }
  nextKeyTimer = setTimeout(function() {
    joinNextKey = false;
  }, 900);

  var foundItemsDropdown = [];
  selectedTag.find(".dropdown_menu .select-menu .item").each(function(idx, item) {
    var itemText = $(item).text().toLowerCase();
    // console.log(itemText.substr(0, keyCharacters.length));
    if(itemText.substr(0, keyCharacters.length) == keyCharacters) {
      // console.log(keyCharacters);
      foundItemsDropdown.push($(item));
    }
  });
  if(foundItemsDropdown.length > 0) {
    selectedTag.find(".dropdown_menu .select-menu .item").removeClass("pseudo_hover")
    foundItemsDropdown[0].addClass("pseudo_hover");
    if(searchAndSelect) {
      foundItemsDropdown[0].click();
    }
  }
  // console.log(nextKeyTimer);
}

function tabToNextTag() {
  // console.log(selectedTag.position().top);
  // console.log($(".content_main").scrollTop());
  // console.log(selectedTag.closest(".PageView").position().top + selectedTag.position().top - $(".content_main").scrollTop());
  if(selectedTag.next(".newTagDraggable").length) {
    showOptions(selectedTag.next(".newTagDraggable"));
    if(selectedTag.hasClass("DataTabView")) {
      selectedTag.find(".the_tag textarea").focus();
    }
    $(".content_main").animate({ scrollTop: $(".content_main").scrollTop() + selectedTag.offset().top - 200 }, 250);
  } else {
    if(selectedTag.closest(".PageView").next(".PageView").length && selectedTag.closest(".PageView").next(".PageView").find(".newTagDraggable").length > 0) {
      showOptions(selectedTag.closest(".PageView").next(".PageView").find(".newTagDraggable").first());
      if(selectedTag.hasClass("DataTabView")) {
        selectedTag.find(".the_tag textarea").focus();
      }
      $(".content_main").animate({ scrollTop: $(".content_main").scrollTop() + selectedTag.offset().top - 200 }, 250);
    } else {
      showOptions($(".PageView").first().find(".newTagDraggable").first());
      if(selectedTag.hasClass("DataTabView")) {
        selectedTag.find(".the_tag textarea").focus();
      }
      $(".content_main").animate({ scrollTop: $(".content_main").scrollTop() + selectedTag.offset().top - 200 }, 250);
    }
  }
}
function tabToPrevTag() {
  // console.log(selectedTag.position().top);
  // console.log($(".content_main").scrollTop());
  // console.log(selectedTag.closest(".PageView").position().top + selectedTag.position().top - $(".content_main").scrollTop());
  var isShiftPressed = true;
  if(selectedTag.prev(".newTagDraggable").length) {
    showOptions(selectedTag.prev(".newTagDraggable"), isShiftPressed);
    $(".content_main").animate({ scrollTop: $(".content_main").scrollTop() + selectedTag.offset().top - 200 }, 250);
  } else {
    if(selectedTag.closest(".PageView").prev(".PageView").length && selectedTag.closest(".PageView").prev(".PageView").find(".newTagDraggable").length > 0) {
      showOptions(selectedTag.closest(".PageView").prev(".PageView").find(".newTagDraggable").last(), isShiftPressed);
      $(".content_main").animate({ scrollTop: $(".content_main").scrollTop() + selectedTag.offset().top - 200 }, 250);
    } else {
      showOptions($(".PageView").last().find(".newTagDraggable").last(), isShiftPressed);
      $(".content_main").animate({ scrollTop: $(".content_main").scrollTop() + selectedTag.offset().top - 200 }, 250);
    }
  }
}

function deleteTag(tagElem) {
  // console.log($("#documentTags").find(".draggable.selected").closest("svg").remove());
  if(!tagElem.hasClass("draggable") &&
  (tagElem.hasClass("RadioTabView") || tagElem.hasClass("CheckboxTabView")) &&
  tagElem.find(".draggable").length > 1) {
    tagElem.find(".draggable.checkbox_radio_selected").remove();
    syncSubElementsWithRightPanel(tagElem);
    resizeBoundingBox(tagElem.find(".draggable").first());
  } else {
    tagElem.remove();
  }

  // $(".drawer-properties").find(".drawer-content").removeClass("showing");
  // $(".content_sidebar-right").css({"overflow": "auto"});
}

$("body").on("click", ".btn-recipients", function(evt) {
  evt.stopPropagation();
  $(this).next(".toolbarRecipientsMenu").toggleClass("invisible");
  $(this).next(".toolbarRecipientsMenu").css({top: $(this).offset().top + $(this).outerHeight(), left: $(this).offset().left});
});
$(".content_main").on("click", ".newTagDraggable .btn-recipients", function(evt) {
  evt.stopPropagation();
  // console.log($(this).next(".toolbarRecipientsMenu"));
  $(this).next(".toolbarRecipientsMenu").toggleClass("invisible");
  // $(this).next(".toolbarRecipientsMenu").css({top: $(this).offset().top + $(this).outerHeight(), left: $(this).offset().left});
});

$(".toolbar_tagger").on("click", ".toolbarRecipientsMenu button.item", function(e) {
  var target = $(this).closest(".toolbarRecipientsMenu").prev("button.btn-recipients");
  $(this).closest(".toolbarRecipientsMenu").find("button.item").removeClass("on");
  $(this).addClass("on");
  selectedRecipientId = $(this).parent().attr("data-qa");
  // console.log($(this).find(".ng-binding").text());
  target.find(".ng-binding").text($(this).find(".ng-binding").text());
  // target.find(".swatch-recipient").removeClass().addClass("swatch-recipient");
  target.find(".swatch-recipient").removeClass().addClass("swatch-recipient swatch-sm").addClass($(this).find(".swatch-recipient").attr("class"));

  target.attr("data-recipient-num", $(this).attr("data-recipient-num"));

  if(target.find(".swatch-recipient").hasClass("swatch-ext-0")) {
    svgFillColor = "#ffd65b";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-1")) {
    svgFillColor = "#abd0e6";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-2")) {
    svgFillColor = "#f6b8ac";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-3")) {
    svgFillColor = "#b9e4a0";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-4")) {
    svgFillColor = "#ffa366";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-5")) {
    svgFillColor = "#b0c1e1";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-6")) {
    svgFillColor = "#e6d19d";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-7")) {
    svgFillColor = "#bdccb7";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-8")) {
    svgFillColor = "#acdde0";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-9")) {
    svgFillColor = "#ffcc7f";
  } else {
    svgFillColor = "#ffd65b";
  }

  $("#sidebarLeft").find(".swatch-recipient").removeClass().addClass("swatch-recipient swatch-lg").addClass($(this).find(".swatch-recipient").attr("class")).removeClass("swatch-round");
  $("#sidebarLeft").find(".icon-fields-standard").css("color", svgFillColor);
});

$(".content_main").on("click", ".toolbarRecipientsMenu button.item", function(e) {
  var target = $(this).closest(".toolbarRecipientsMenu").prev("button.btn-recipients");
  $(this).closest(".toolbarRecipientsMenu").find("button.item").removeClass("on");
  $(this).addClass("on");
  // console.log($(this).find(".ng-binding").text());
  target.find(".ng-binding").text($(this).find(".ng-binding").text());
  // target.find(".swatch-recipient").removeClass().addClass("swatch-recipient");
  target.find(".swatch-recipient").removeClass().addClass("swatch-recipient swatch-sm").addClass($(this).find(".swatch-recipient").attr("class"));

  // target.attr("data-recipient-num", $(this).attr("data-recipient-num"));
  var selectedTagFillColor = "#ffd65b";
  if(target.find(".swatch-recipient").hasClass("swatch-ext-0")) {
    selectedTagFillColor = "#ffd65b";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-1")) {
    selectedTagFillColor = "#abd0e6";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-2")) {
    selectedTagFillColor = "#f6b8ac";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-3")) {
    selectedTagFillColor = "#b9e4a0";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-4")) {
    selectedTagFillColor = "#ffa366";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-5")) {
    selectedTagFillColor = "#b0c1e1";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-6")) {
    selectedTagFillColor = "#e6d19d";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-7")) {
    selectedTagFillColor = "#bdccb7";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-8")) {
    selectedTagFillColor = "#acdde0";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-9")) {
    selectedTagFillColor = "#ffcc7f";
  } else {
    selectedTagFillColor = "#ffd65b";
  }

  $(this).closest(".newTagDraggable").attr("data-tag-for", $(this).find(".ng-binding").text());
  $(this).closest(".newTagDraggable").find(".the_tag").css("background-color", selectedTagFillColor);
  $(this).closest(".toolbarRecipientsMenu").addClass("invisible");
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

$("input, .form-group *, .drawer-properties_footer *").on("keydown", function(evt) {
  evt.stopPropagation();

  if(evt.keyCode == 27) {
    $(this).blur();
    selectedTag.find(".the_tag input[type='text'], .the_tag input[type='number'], .the_tag textarea").focus();
  }
});
$("input[data-qa='pay-amount-text']").on("keyup", function(e) {
  e.stopPropagation();
  selectedTag.find("span").text("$" + $(this).val());
});


// $("body").on("focus", ".DataTabView.newTagDraggable.selected .the_tag textarea, .NoteTabView.newTagDraggable.selected .the_tag textarea", function(evt) {
//   // evt.stopPropagation();
//   // lastTextValue = $(this).val();
//   // $("#addTextTextArea").val(lastTextValue);
// });

$("body").on("input blur", ".DataTabView.newTagDraggable.selected .the_tag textarea", function(evt) {
  $("#addTextTextArea").val($(this).val());
  $(this).css("height", "auto").css("height", this.scrollHeight);
});
$("body").on("input blur", "#addTextTextArea", function(evt) {
  selectedTag.find(".the_tag textarea").val($(this).val());
});

// $(".content_main").on("focus", ".newTagDraggable .the_tag input[type='text'], .the_tag input[type='number'], .newTagDraggable .the_tag textarea", function(evt) {
//   // evt.stopPropagation();
// });
// $(".content_main").on("blur", ".newTagDraggable .the_tag input[type='text'], .the_tag input[type='number'], .newTagDraggable .the_tag textarea", function(evt) {
// });

$(".content_main").on("focus", ".PaymentTabView.newTagDraggable.selected .the_tag input[type='text'], .the_tag input[type='number']", function(evt) {
  evt.stopPropagation();
  lastPaymentAmount = $(this).val();
});
$(".content_main").on("focus", ".newTagDraggable .the_tag input[type='text'], .the_tag input[type='number'], .newTagDraggable .the_tag textarea", function(evt) {
  evt.stopPropagation();
  $(this).closest(".newTagDraggable").addClass("selected isEditing");
  deleteTagAllowed = false;

  lastTextValue = $(this).val();
  $("#addTextTextArea").val(lastTextValue);
});
$(".content_main").on("blur", ".newTagDraggable .the_tag input[type='text'], .the_tag input[type='number'], .newTagDraggable .the_tag textarea", function(evt) {
  $(this).closest(".newTagDraggable").removeClass("isEditing");
  deleteTagAllowed = true;
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
  // target.prop("checked", (target.prop("checked")?false:true));
  // target.change();
});

$(".section.disclosure_options_section").on("change", ".cb_input", function(e) {
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

$(".content_main").on("mouseup", ".PageView", function(evt) {
  // evt.stopPropagation();
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
  var targetTagElement = $(".tagger_content > div.newTagDraggable");

  targetTagElement.removeClass("dragAlong").css({"position": "absolute", "left": posLeft, "top": posTop});
  if(targetTagElement.length > 0) {
    updateRecipientsListInTarget(targetTagElement);
    // console.log(selectedRecipientId);
    // console.log(targetTagElement.find(".toolbarRecipientsMenu li[data-qa='" + selectedRecipientId + "'] button.item"));

    target.append(targetTagElement);
    $(".tagger_content > div.newTagDraggable").remove();

    targetTagElement.find(".toolbarRecipientsMenu li[data-qa='" + selectedRecipientId + "'] button.item").addClass("on").click();

    window.setTimeout(function(evt) {
      if(firstTagDrop) {
        console.log("firstTagDrop");
        firstTagDrop = false;
        targetTagElement.find(".tag_settings").click();

        window.setTimeout(function(evt) {
          $(".callout > div").addClass("hidden");
          $(".callout .callout-first-tag-drop").removeClass("hidden");
          targetTagElement.find(".tag_settings_options .btn-recipients").attr("callout-pos", "after middle");
          // showCallout(evt, targetTagElement.find(".tag_settings_options .btn-recipients"));
        }, 100);
      }

      targetTagElement.click();
    }, 100);
  }
  // target.css({left: event.pageX - target.width()/3, top: event.pageY - 51 - target.height()/2,transition: "none"});
}


$(".content_main").on("click", ".newTagDraggable .btn-prev, .newTagDraggable [data-qa='edit-recipients-swatch']", function(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  $("#bottomNav .btn-prev").click();
});

$(".content_main").on("click", ".newTagDraggable .tag_settings", function(evt) {
  evt.stopPropagation();
  // console.log("settings");
  // $(".feature_unavailable").first().click();
  showOptions($(this).closest(".newTagDraggable"));
  var isHidden = $(this).closest(".newTagDraggable").find(".tag_settings_options").hasClass("hidden");
  $(".content_main .tag_settings_options").addClass("hidden");
  if(isHidden) {
    $(this).closest(".newTagDraggable").find(".tag_settings_options").removeClass("hidden");
  } else {
    $(this).closest(".newTagDraggable").find(".tag_settings_options").addClass("hidden");
  }
  // updateRecipientsListInTagger();
  updateRecipientsListInTarget($(this).closest(".newTagDraggable"));

  // console.log($(".toolbar_tagger .toolbarRecipientsMenu button.item.on").parent().attr("data-qa").split("-")[1]);
});

function updateRecipientsListInTarget(target) {
  var recipientNames = localStorage.getItem("recipientNames");
  if(!recipientNames || recipientNames.length <= 0) {
    recipientNames = ["Alex Edwards", "Corey Kimel"];
  } else {
    recipientNames = localStorage.getItem("recipientNames").split(",");
  }

  target.find(".toolbarRecipientsMenu ul:first-child").html("");
  $.each(recipientNames, function(idx, elem) {
    // console.log(elem);
    target.find(".toolbarRecipientsMenu ul:first-child").append('<li data-qa="recipient-' + (idx + 1) + '" class="ng-scope" role="menuitem"><button class="item"><span class="swatch swatch-round swatch-recipient swatch-ext-' + idx + '" data-qa="recipient-list-name-' + (idx + 1) + '"></span><span class="ng-binding">' + elem + '</span></button></li>');
  });
}

$(".content_main").on("click", ".newTagDraggable.DropdownTabView .dropdown_menu .btn-trigger", function(evt) {
  // evt.stopPropagation();
  $(this).closest(".newTagDraggable").addClass("isEditing").find(".tag_settings_options").addClass("hidden");
  $(this).next(".menu").toggleClass("invisible");
  if(!$(this).next(".menu").hasClass("invisible")) {
    $(this).next(".menu").find(".item").removeClass("pseudo_hover");
  }
});
$(".content_main").on("click", ".newTagDraggable.DropdownTabView .dropdown_menu .menu .item", function(evt) {
  evt.stopPropagation();
  $(this).closest(".menu").find(".item").removeClass("on");
  $(this).addClass("on");
  $(this).closest(".menu").prev(".btn-trigger").find(".ng-binding").text($(this).text().trim());
  $(this).closest(".menu").addClass("invisible");
});

$("body").on("click", ".btn-keyboard-shortcuts", function(evt) {
  // evt.stopPropagation();
  $(".ds-modal-background").removeClass("invisible");
  $(".modal-shortcut-keys").removeClass("hide_modal");
});

$(".content_sidebar-right").on("focus", ".form-group *", function(evt) {
  evt.stopPropagation();
  if($(this).closest(".drawer").prev(".accordion").hasClass("closed")) {
    $(this).closest(".drawer").prev(".accordion").click();
  }
});
$(".content_sidebar-right").on("blur", ".btn[data-qa='properties-panel-delete']", function(evt) {
  evt.stopPropagation();
  // $("body").click();
  $(".sidebar_main .sidebarTabs .sidebarTabs_tab[data-qa='Standard Fields']").click();
  // $(".sidebar-fields[data-tab-name='Standard Fields'] .menu_listItem .menu_item[data-qa='Signature']").focus();
});


$(".content_main").on("click", ".newTagDraggable .add_new_option", function(evt) {
  evt.stopPropagation();
  $(this).before($(this).prev().clone().removeClass("checkbox_radio_selected"));
  syncSubElementsWithRightPanel($(this).closest(".newTagDraggable"));
  resizeBoundingBox($(this).prev());
});

$(".tagger_content").on("mouseover", "[data-sync-tag-option-id]", function(evt) {
  evt.stopPropagation();
  var syncID = $(this).attr("data-sync-tag-option-id");
  $(".tagger_content [data-sync-tag-option-id='" + syncID + "']").addClass("syncIDHighlight");
});
$(".tagger_content").on("mouseout", "[data-sync-tag-option-id]", function(evt) {
  evt.stopPropagation();
  $(".tagger_content [data-sync-tag-option-id]").removeClass("syncIDHighlight");
});
$(".drawer-properties_main").on("change", "[data-sync-tag-option-id]", function(evt) {
  evt.stopPropagation();
  $(".content_main [data-sync-tag-option-id='" + $(this).attr("data-sync-tag-option-id") + "']").attr("data-mini-tooltip-text", $(this).val().trim());
});
$(".drawer-properties_main").on("change", ".cb_input", function(evt) {
  evt.stopPropagation();
  $(".content_main [data-sync-tag-option-id='" + $(this).closest(".form_addon").next(".form_item").find("[data-sync-tag-option-id]").attr("data-sync-tag-option-id") + "'] .input-cb").prop("checked", $(this).prop("checked"));
});

$(".drawer-properties_main").on("change", ".select_checkbox_group_validation", function(evt) {
  evt.stopPropagation();
  $(this).closest(".drawer-content").find(".form-group[data-select-option]").addClass("hidden");
  $(this).closest(".drawer-content").find(".form-group[data-select-option='" + $(this).val() + "']").removeClass("hidden");
});
$(".drawer-properties_main").on("change", ".form-select-range-min", function(evt) {
  evt.stopPropagation();
  var parentEl = $(this).closest(".form-select-range");
  if(!parentEl.find(".form-select-range-max").val() || (parseInt(parentEl.find(".form-select-range-max").val()) < parseInt($(this).val()))) {
    parentEl.find(".form-select-range-max").val($(this).val()).click();
  }
});
$(".drawer-properties_main").on("change", ".form-select-range-max", function(evt) {
  evt.stopPropagation();
  var parentEl = $(this).closest(".form-select-range");
  if(!parentEl.find(".form-select-range-min").val() || (parseInt(parentEl.find(".form-select-range-min").val()) > parseInt($(this).val()))) {
    parentEl.find(".form-select-range-min").val($(this).val()).click();
  }
});

$(".drawer-properties_main").on("click", "#validationTagRequired", function(evt) {
  // evt.stopPropagation();
  // console.log($(this).prop("checked"));
  var parentEl = $(this).closest(".drawer-content");
  if($(this).prop("checked")) {
    parentEl.find(".form-select-range-min option").first().addClass("hidden");
  } else {
    parentEl.find(".form-select-range-min option").first().removeClass("hidden");
  }
});

function syncSubElementsWithRightPanel(parentEl) {
  if(parentEl.hasClass("CheckboxTabView")) {
    $(".drawer-properties_main > .tag_option[data-qa='checkbox-group-values-properties-accordion'] .drawer-properties_section .drawer-content .section").html("");

    $(".drawer-properties_main > .tag_option[data-qa='checkbox-group-validation-properties-accordion'] .drawer-properties_section .drawer-content [data-select-option] .input-select").html("");
    $(".drawer-properties_main > .tag_option[data-qa='checkbox-group-validation-properties-accordion'] .drawer-properties_section .drawer-content [data-select-option] .input-select").html("");

    $(".drawer-properties_main > .tag_option[data-qa='checkbox-group-validation-properties-accordion'] .drawer-properties_section .drawer-content [data-select-option] .input-select.form-select-range-min").append('<option data-qa="0" value="0">0</option>');

    parentEl.find(".draggable").each(function(idx, elem) {
      var syncID = "checkbox-" + Math.ceil(Math.random()*Math.random()*1000) + "-" + Math.ceil(Math.random()*Math.random()*1000);

      $(elem).attr("data-sync-tag-option-id", syncID);
      $(elem).attr("data-mini-tooltip-text", "Checkbox" + (idx+1));

      $(".drawer-properties_main > .tag_option[data-qa='checkbox-group-values-properties-accordion'] .drawer-properties_section .drawer-content .section").append('<div class="form_unit"><div class="form_group"><span class="form_addon"><span class="cb cb-noText"><input id="' + syncID + '" class="cb_input" type="checkbox" ' + ($(elem).find(".input-cb").prop("checked")?"checked":null) + ' /><label class="cb_label" for="' + syncID + '">Select</label></span></span><span class="form_item"><input type="text" class="input-text" value="Checkbox' + (idx+1) + '" data-sync-tag-option-id="' + syncID + '" /></span></div></div>');

      $(".drawer-properties_main > .tag_option[data-qa='checkbox-group-validation-properties-accordion'] .drawer-properties_section .drawer-content [data-select-option] .input-select").append('<option data-qa="' + (idx+1) + '" value="' + (idx+1) + '">' + (idx+1) + '</option>');
    });

  }
}
