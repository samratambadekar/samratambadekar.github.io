$(".new_doc").on("click", function() {
  $("#menuNewDocument, #menuNew").toggleClass("invisible");
  // console.log($(this).position().left+ parseInt($(this).css("margin-left")) + " " + $(this).offset().left);
  $("#menuNewDocument, #menuNew").css({"opacity": 1, "top": $(this).position().top + $(this).outerHeight(), "left": $(this).position().left + parseInt($(this).css("margin-left"))});
});

$("body").on("click", function(e) {
  $(this).find(".menuRecipientActions, .menuRecipientTypes").addClass("invisible");

  $(this).find(".drawer").each(function() {
    if(!$(this).hasClass("hide")) {
      $(this).find(".drawer_header .btn_save").click();
    }
  });
});

$(".upload_document").on("click", function(e) {
  // $(this).parents(".upload-start").prev(".upload-item").removeClass("hidden");
  $("#upload-document").click();
});
// $('input[type=text]').click(function() {
//     $('input[type=file]').trigger('click');
// });

$("#upload-document").change(function() {
    var vals = $(this).val(),
        fileName = vals.length ? vals.split('\\').pop() : '';

    // console.log(val);
    $(this).parents(".upload-start").prev(".upload-item").find(".file_name").text(fileName);
    $(this).parents(".upload-start").prev(".upload-item").removeClass("hidden");
});

$(".recipient_cards").on("click", function(e) {
  e.stopPropagation();

  // TRIGGERED MANUALLY TO RESOLVE CONFLICT WITH MINIMIZING DRAWERS
  $(this).find(".menuRecipientActions, .menuRecipientTypes").addClass("invisible");
});

$(".recipient_cards").on("click", ".recipient_task > .btn-trigger, .recipient_actions > .btn-trigger", function(e) {
  e.stopPropagation();
  $(this).parents(".recipient_cards").find(".menuRecipientActions, .menuRecipientTypes").addClass("invisible");
  $(this).next(".menu").removeClass("invisible");
});
$(".recipient_cards").on("click", ".menuRecipientTypes .item", function() {
  var target = $(this).parents(".recipient_task").find(".btn-trigger");
  target.find(".ng-binding").text($(this).text().trim());
  // console.log($(this).find(".icon").attr("class"));
  target.find(".icon").removeClass().addClass($(this).find(".icon").attr("class"));

  //SWITCH BETWEEN IN PERSON SIGNER AND REGULAR SIGNER
  if(target.find(".icon").hasClass("icon-user-sign")) {
    $(this).parents(".recipient").find(".recipient_info .in_person_signer").removeClass("hidden");
    $(this).parents(".recipient").find(".recipient_info .regular_signer").addClass("hidden");
  } else {
    $(this).parents(".recipient").find(".recipient_info .in_person_signer").addClass("hidden");
    $(this).parents(".recipient").find(".recipient_info .regular_signer").removeClass("hidden");
  }
  $(this).parents(".recipient").find(".input-text.name:not(.hidden):first-of-type").focus();

  // $(this).parents(".recipient").find(".recipient_info input").removeClass("filled");
  // console.log($(this).text().trim());
});
$(".recipient_cards").on("click", ".menuRecipientActions .item", function() {
  var target = $(this).parents(".recipient_card").find("." + $(this).attr("recipient-drawer"));
  if(target.hasClass("hide")) {
    if($(this).attr("recipient-drawer") == "drawerCertificate") {
      // $(this).parents(".recipient_card").find(".drawer").removeClass("hide");
      // console.log($(".drawerCertificate > div").outerHeight());
      target.css("height", target.children("div").height() + 20);
      target.removeClass("hide");
    }
    if($(this).attr("recipient-drawer") == "drawerAccess") {
      target.css("height", target.children("div").height() + 20);
      target.removeClass("hide");
    }
    if($(this).attr("recipient-drawer") == "drawerMessage") {
      target.css("height", target.children("div").height() + 20);
      target.removeClass("hide");
    }
    if($(this).attr("recipient-drawer") == "drawerLanguage") {
      target.css("height", target.children("div").height() + 20);
      target.removeClass("hide");
    }
    if($(this).attr("recipient-drawer") == "drawerAdvancedSettings") {
      target.css("height", target.children("div").height() + 20);
      target.removeClass("hide");
    }
  }
  // else {
  //   if($(this).attr("recipient-drawer") == "drawerCertificate") {
  //     target.css("height", $(".drawerCertificate > div").height() + 4);
  //   }
  //   if($(this).attr("recipient-drawer") == "drawerAccess") {
  //     target.css("height", $(".drawerAccess > div").height() + 4);
  //   }
  //   if($(this).attr("recipient-drawer") == "drawerMessage") {
  //     target.css("height", $(".drawerMessage > div").height() + 4);
  //   }
  //   if($(this).attr("recipient-drawer") == "drawerLanguage") {
  //     target.css("height", $(".drawerLanguage > div").height() + 4);
  //   }
  //   if($(this).attr("recipient-drawer") == "drawerAdvancedSettings") {
  //     target.css("height", $(".drawerAdvancedSettings > div").height() + 4);
  //   }
  // }
});

$(".recipient_cards").on("mouseenter", ".recipient_card", function(e) {
  // e.stopPropagation();
  $(this).find(".recipient_remove").removeClass("hide");
});
$(".recipient_cards").on("mouseleave", ".recipient_card", function() {
  var ele = $(this);
  // window.setTimeout(function() {
    ele.find(".recipient_remove").addClass("hide");
  // },500);
});

$(".recipient_cards").on("keypress", ".recipient_info input", function(e) {
  var parent = $(this).parents(".recipient_content");
  if(e.which == 13) {
    if($(this).val().length>0) {
      // $(".recipient_info > input").addClass("filled");
      parent.find(".recipient_info input").blur();
    }
  }
});
$(".recipient_cards").on("blur", ".recipient_info input", function(e) {
  var parent = $(this).parents(".recipient_content");
  if(parent.find(".recipient_info :not(.hidden) .name").val().length > 0 && parent.find(".recipient_info :not(.hidden) .email").val().length > 0) {
    parent.find(".recipient_info input").addClass("filled");
  }
});
$(".recipient_cards").on("focusin", ".recipient_info input", function(e) {
  var parent = $(this).parents(".recipient_content");
  // if($(".recipient_info .name").val().length>0 && $(".recipient_info .email").val().length>0) {
  parent.find(".recipient_info input").removeClass("filled");
  parent.find(".recipient_info").removeClass("filled");
  // parent.find(".recipient_info > .name").focus();
  // }
});

$(".recipient_cards").on("mouseenter", ".recipient_info", function(e) {
  var parent = $(this).parents(".recipient_content");
  if(parent.find(".recipient_info .name").hasClass("filled") && parent.find(".recipient_info .email").hasClass("filled")) {
    $(this).addClass("filled");
  }
});
$(".recipient_cards").on("mouseleave", ".recipient_info", function(e) {
  $(this).removeClass("filled");
});

$(".recipient_cards").on("click", ".drawer_header .btn_save", function(e) {
  e.stopPropagation();
  var error = false;
  var target;
  var parent = $(this).parents(".drawer");
  if(parent.hasClass("drawerCertificate")) {
    if(parent.find("input.input-text").val().length<10 || isNaN(parent.find("input.input-text").val().trim())) {
      // error = true;
      target = parent.find("input.input-text");
    }
  }
  if(!error) {
    parent.find(".select_value_1").text(parent.find(".selectTrigger option:selected").text());

    if(!parent.find(".selectTrigger3").parent().hasClass("hidden")) {
      parent.find(".country_code").text(parent.find(".selectTrigger3 option:selected").text());
    } else {
      parent.find(".country_code").text("");
    }

    if(!parent.find(".selectTrigger2").parent().hasClass("hidden")) {
      parent.find(".select_value_2").text(parent.find(".selectTrigger2 option:selected").text());
    } else {
      parent.find(".select_value_2").text("");
    }

    parent.find(".select_value_2").text(parent.find(".input_value2:not(.hidden)").val());

    parent.find(".select_value_3").text("");
    parent.find(".select_value_3").text(parent.find(".input_value:not(.hidden)").val());

    // JUST ADDING COMMAS
    if(parent.find(".select_value_2").text().length) {
      parent.find(".select_value_2").text(", " + parent.find(".select_value_2").text());
    }
    if(parent.find(".country_code").text().length) {
      parent.find(".country_code").text(", " + parent.find(".country_code").text());
    } else if(parent.find(".select_value_3").text().length) {
      parent.find(".select_value_3").text(", " + parent.find(".select_value_3").text());
    }

    // parent.find(".input_value").each(function() {
    //   if(!$(this).hasClass("hidden")) {
    //     parent.find(".select_value_3").text($(this).val());
    //   } else {
    //     // parent.find(".select_value_3").text("");
    //   }
    // });

    parent.addClass("minimize");
    parent.css("height", $(this).children("div").height() + 40);
  } else {
    target.addClass("error_state");
  }
});

$(".recipient_cards").on("click", ".input-text", function(e) {
  $(this).removeClass("error_state");
});

$(".recipient_cards").on("click", ".drawer_header .btn_cancel", function(e) {
  e.stopPropagation();
  $(this).parents(".drawer").addClass("hide").css("height", 0);
  $(this).parents(".drawer").find("input.input-text").val("");
  $(this).parents(".drawer").find("input.cb_input").attr("checked", false);
});
$(".recipient_cards").on("click", ".drawer", function() {
  // console.log($(this));
  // CONFLICTS WITH STOPPROPAGATION
  if($(this).hasClass("minimize")) {
    $(this).removeClass("minimize");
    $(this).css("height", $(this).children("div").height() + 20);
  }
});
$(".recipient_cards").on("change", ".input-select.selectTrigger", function() {
  var parent = $(this).parents(".drawer");
  parent.find(".select_change").addClass("hidden");
  parent.find("." + $(this).val()).removeClass("hidden");
  // console.log($(this).val());

  //JUST TO MAKE IS SIMPLE
  // parent.find(".selectTrigger2").prop("selectedIndex", 0);
  //
  // if(parent.find(".selectTrigger").parent().hasClass("hidden")) {
  //   parent.find(".select_value_1").addClass("hidden");
  // } else {
  //   parent.find(".select_value_1").removeClass("hidden");
  //   parent.find(".select_value_1").text(parent.find(".selectTrigger option:selected").text());
  // }
  //
  // // console.log(parent.find(".selectTrigger2").parent().hasClass("hidden"))
  // if(parent.find(".selectTrigger2").parent().hasClass("hidden")) {
  //   parent.find(".select_value_2").addClass("hidden");
  // } else {
  //   parent.find(".select_value_2").removeClass("hidden");
  //   parent.find(".select_value_2").text(", " + parent.find(".selectTrigger2 option:selected").text());
  // }
  //
  // parent.find(".selectTrigger3").change();
  // parent.find(".input_value:not(.hidden)").change();
  // parent.find(".input_value2:not(.hidden)").change();

  parent.css("height", parent.children("div").height() + 20);
});
$(".recipient_cards").on("change", ".input-select.selectTrigger2", function() {
  $(this).parents(".form_unit").next(".form_unit").find(".select_change").addClass("hidden");
  $(this).parents(".form_unit").next(".form_unit").find("." + $(this).val()).removeClass("hidden");
  // console.log($(this).val());

  // var parent = $(this).parents(".drawer");
  //   // console.log(parent.find(".selectTrigger2").parent().hasClass("hidden"))
  // if(parent.find(".selectTrigger2").parent().hasClass("hidden")) {
  //   parent.find(".select_value_2").addClass("hidden");
  // } else {
  //   parent.find(".select_value_2").removeClass("hidden");
  //   parent.find(".select_value_2").text(", " + parent.find(".selectTrigger2 option:selected").text());
  // }
  //
  // parent.find(".selectTrigger3").change();
  // parent.find(".input_value:not(.hidden)").change();
});
// $(".recipient_cards").on("change", ".input_value2", function() {
//   var parent = $(this).parents(".drawer");
//   if(parent.find(".input_value2").parent().hasClass("hidden")) {
//     parent.find(".select_value_2").addClass("hidden");
//   } else {
//     parent.find(".select_value_2").removeClass("hidden");
//     parent.find(".select_value_2").text(", " + parent.find(".input_value2:not(.hidden)").val());
//   }
//
//   // parent.find(".selectTrigger3").change();
//   // parent.find(".input_value:not(.hidden)").change();
// });
// $(".recipient_cards").on("change", ".input-select.selectTrigger3", function() {
//   var parent = $(this).parents(".drawer");
//     // console.log(parent.find(".selectTrigger2").parent().hasClass("hidden"))
//   if(parent.find(".selectTrigger3").parent().hasClass("hidden")) {
//     parent.find(".country_code").addClass("hidden");
//   } else {
//     parent.find(".select_value_3, .country_code").removeClass("hidden");
//     parent.find(".country_code").text(parent.find(".selectTrigger3 option:selected").text());
//     parent.find(".select_value_3").text(parent.find(".input_value:not(.hidden)").val());
//   }
// });
$(".recipient_cards").on("focus change", ".input_value:not(.hidden)", function() {
  var parent = $(this).parents(".drawer");
  parent.find(".select_value_3").text(parent.find(".input_value:not(.hidden)").val());
});

$(".recipient_cards").on("click", ".recipient_remove", function() {
  var parent = $(this).parents(".recipient_card").remove();
  sortRecipients();
});

$(".recipient_cards").on("change", ".seq_num > input", function() {
  var target = $(this).parents(".recipient_card");

  if($(this).val() < 1) {
    $(this).val(1);
  }

  var new_val = $(this).val();
  var num_children = $(this).parents(".recipient_cards").children().length;

  if(new_val == 1) {
    $('.recipient_cards').children().eq(0).before(target); //ADD BEFORE IF IT'S FIRST ELEMENT
  } else if(new_val <= num_children) {
    $('.recipient_cards').children().eq(new_val - 2).after(target);
  } else if (new_val > num_children) {
    $('.recipient_cards').children().eq(num_children - 1).after(target);
  }
  sortRecipients();
});

$("body").on("click", ".btn-add-recipient", function() {
  // console.log($(".recipient_cards").children().length);
  var child_num = $(".recipient_cards").children(":not(.hidden)").length + 1;
  $(".recipient_cards").append('<div class="recipient_card recipient-group-item"><div class="seq_num"><input class="input-text" value="' + child_num + '" type="text"></div><div class="recipient"><div class="recipient_content"><div class="icon icon-handle"></div><div class="profile_pic"><img src="images/avatar.png"/></div><div class="recipient_info"><div class="regular_signer"><input type="text" class="input-text name" placeholder="Name"/><input type="text" class="input-text email" placeholder="Email"/></div><div class="in_person_signer hidden"><input type="text" class="input-text name" placeholder="Signer Name"/><input type="text" class="input-text name" placeholder="Host Name"/><input type="text" class="input-text email" placeholder="Host Email"/></div></div><div class="recipient_task"><button class="btn btn-minor btn-trigger"><span class="icon icon-needsmysignature"></span><span class="ng-binding">Needs to Sign</span></button><div style="" class="menu ng-scope below left invisible menuRecipientTypes"><ul role="menu" class=""><li role="menuitem"><a class="item"><span class="icon icon-needsmysignature"></span><span>Needs to Sign</span></a></li><li role="menuitem"><a class="item"><span class="icon icon-user-sign"></span><span>In-person Signer</span></a></li><li role="menuitem"><a class="item"><span class="icon icon-copied"></span><span>Receives a Copy</span></a></li><li role="menuitem"><a class="item"><span class="icon icon-eye-open"></span><span>Needs to View</span></a></li><!-- <li role="menuitem"><a class="item"><span class="icon icon-user"></span><span>Specify Recipients</span></a></li><li role="menuitem"><a class="item"><span class="icon icon-user-placeholder"></span><span>Update Recipients</span></a></li><li role="menuitem"><a class="item"><span class="icon icon-editpen"></span><span>Allow Edit</span></a></li> --></ul></div></div><div class="recipient_actions"><button class="btn btn-minor btn-trigger">More</button><div style="" class="menu ng-scope invisible menuRecipientActions"><ul aria-labelledby="More" role="menu" class=""><li role="menuitem"><a recipient-drawer-state="content" recipient-drawer="drawerCertificate" class="item"><span class="icon icon-trustcenter"></span><span>Add certificate</span></a></li><li role="menuitem"><a recipient-drawer-state="content" recipient-drawer="drawerAccess" class="item"><span class="icon icon-key"></span><span>Add access authentication</span></a></li><li role="menuitem"><a recipient-drawer-state="content" recipient-drawer="drawerMessage" class="item"><span class="icon icon-privatenote"></span><span>Add private message</span></a></li><li role="menuitem"><a recipient-drawer-state="content" recipient-drawer="drawerLanguage" class="item"><span class="icon icon-globe"></span><span>Change language</span></a></li></ul><ul aria-labelledby="More" role="menu" class=""><li role="menuitem"><a recipient-drawer-state="content" recipient-drawer="drawerAdvancedSettings" class="item"><span class="icon icon-gear"></span><span>Advanced Settings</span></a></li></ul></div></div></div><div class="drawerCertificate drawer hide"><div><div class="block_picture show_min"><span class="icon icon-trustcenter"></span></div><div class="block_content show_min"><span class="select_value_1">DS EU Advanced</span> certificate<span class="select_value_2">SMS authentication</span><span class="country_code">+1</span> <span class="select_value_3">6501234567</span></div><div class="block_content"><div class="block_picture"><span class="icon icon-trustcenter"></span></div><div class="form_row"><div class="drawer_header"><span>Select certificate</span><button class="link u-float-right btn_cancel" recipient-drawer="drawerCertificate" recipient-drawer-state="closed">Discard</button><button class="link u-float-right btn_save invisible" recipient-drawer="drawerCertificate">Temp Save</button></div><div><div class="form_unit"><div data-title="DSEUAdvanced" class="select-wrap input-sm"><select class="input-select selectTrigger" label="selectCertificate"><option value="DSEUAdvanced">DS EU Advanced</option><option value="SignatureAppliance">Signature Appliance</option><option value="ICPBrasil" selected>ICP Brasil</option></select></div></div><div class="form_unit"><input class="input-text input-sm SignatureAppliance select_change input_value hidden" placeholder="Username" label="Username" type="text"><input class="input-text input-sm ICPBrasil select_change input_value" placeholder="CPF (optional)" label="CPF" type="text"><div data-title="SMS authentication" class="select-wrap input-sm DSEUAdvanced select_change hidden"><select class="input-select selectTrigger2" aria-label="Select an authentication type"><option value="SMSAuthentication">SMS authentication</option><option value="OTPass">One-time password</option></select></div></div><div class="form_unit"><div class="select-wrap input-sm DSEUAdvanced SMSAuthentication select_change hidden"><select class="input-select country-code selectTrigger3"><option value="+1">+1</option><option value="+1">+91</option><option value="+1">+665</option></select></div><input class="input-text input-sm DSEUAdvanced SMSAuthentication select_change input_value hidden" placeholder="Mobile Number" label="Mobile Number" type="text" value="6501234567"><input class="input-text input-sm OTPass select_change input_value hidden" placeholder="One-time password" label="One-time password" type="text"></div></div></div></div></div></div><div class="drawerAccess drawer hide"><div><div class="block_picture show_min"><span class="icon icon-key"></span></div><div class="block_content show_min"><!-- Phone access authentication, +1 (650) 123-4567 --><span class="select_value_1">Access Code</span> authentication<span class="country_code">+1</span> <span class="select_value_3"></span><span class="select_value_2">1234</span></div><div class="block_content"><div class="block_picture"><span class="icon icon-key"></span></div><div class="form_row"><div class=""><div class="drawer_header"><span>Select access authentication</span><button class="link u-float-right btn_cancel" recipient-drawer="drawerAccess" recipient-drawer-state="closed">Discard</button><button class="link u-float-right btn_save invisible" recipient-drawer="drawerAccess">Temp Save</button></div><div class="btn-group"><button type="button" access-type="single" class="btn btn-primary group-item">Single</button><button type="button" access-type="multiple" class="btn btn-secondary group-item">Multiple</button></div><div class="hidden_unit hidden"><div class="form_unit"><input class="input-text input-sm disabled" label="AccessCode" type="text" value="Access Code"></div><div class="form_unit"><input class="input-text input-sm" placeholder="Enter access code" label="AccessCode" type="text" value="1234"></div><div>You must provide this code to the signer.</div></div><div class="form_unit form_unit_change single"><div data-title="Phone $" class="select-wrap input-sm"><select class="input-select selectTrigger" aria-label="Select access authentication"><option value="AccessCode" selected>Access Code</option><option value="Phone">Phone¹</option><option value="SMS">SMS¹</option><option value="KnowledgeBased">Knowledge Based¹</option></select></div></div><div class="form_unit"><input class="input-text input-sm AccessCode select_change input_value" placeholder="Enter access code" label="AccessCode" type="text" value="1234"><div class="select-wrap input-sm select_change Phone SMS hidden"><select class="input-select country-code selectTrigger3"><option value="+1">+1</option><option value="+1">+91</option><option value="+1">+66</option></select></div><input class="input-text input-sm select_change Phone SMS input_value hidden" placeholder="Phone number" label="Phone number" type="text"></div><div class="form_unit"><input class="input-text input-xs select_change Phone input_value input_value2 hidden" placeholder="Extension" aria-label="Extension" type="text"></div></div><div class="cb select_change Phone hidden"><input class="cb_input" id="cbProvidePhone' + child_num + '" type="checkbox"><label class="cb_label" for="cbProvidePhone' + child_num + '">Allow recipient to provide phone number.</label></div><div class="select_change Phone SMS KnowledgeBased hidden"><sup>1</sup> A fee will be charged per usage</div></div></div></div></div><div class="drawerMessage drawer hide"><div><div class="block_picture show_min"><span class="icon icon-privatenote"></span></div><div class="block_content show_min">Private message added</div><div class="block_content"><div class="block_picture"><span class="icon icon-privatenote"></span></div><div class="form_row"><div class="drawer_header"><span>Private Message</span><button class="link u-float-right btn_cancel" recipient-drawer="drawerMessage" recipient-drawer-state="closed">Discard</button><button class="link u-float-right btn_save invisible" recipient-drawer="drawerMessage">Temp Save</button></div><div class="form_unit input-xl"><textarea class="input-textarea" label="Private Message"></textarea></div></div></div></div></div><div class="drawerLanguage drawer hide"><div><div class="block_picture show_min"><span class="icon icon-globe"></span></div><div class="block_content show_min">Custom language: <span class="select_value_1"></span></div><div class="block_content"><div class="block_picture"><span class="icon icon-globe"></span></div><div class="form_row"><div class="drawer_header"><span>Select language for this recipient</span><button class="link u-float-right btn_cancel" recipient-drawer="drawerLanguage" recipient-drawer-state="closed">Discard</button><button class="link u-float-right btn_save invisible" recipient-drawer="drawerLanguage">Temp Save</button></div><div class="form_unit"><div data-title="Nederlands" class="select-wrap"><select class="input-select input-sm selectTrigger" aria-label="Select language for this recipient"><option value="English (US)">English (US)</option><option value="German">Deutsch</option><option value="Spanish">Español</option><option value="French (France)">Français (France)</option><option value="Italian">Italiano</option><option value="Dutch">Nederlandse</option><option value="Portuguese (Brasil)">Português (Brasil)</option><option value="Portuguese (Portugal)">Português (Portugal)</option><option value="Russian">Русский</option><option value="Simplified Chinese">中文 (简体)</option><option value="Traditional Chinese">中文 (繁体)</option><option value="Japanese">日本語</option><option value="Korean">한국어</option><option value="Bahasa Indonesia">Bahasa Indonesia</option><option value="Bahasa Malay">Bahasa Melayu</option><option value="Danish">Dansk</option><option value="Estonian">Eesti</option><option value="English (UK)">English (UK)</option><option value="Spanish (Latin America)">Español (América Latina)</option><option value="French (Canada)">Français (Canada)</option><option value="Croatian">Hrvatski</option><option value="Latvian">Latviešu</option><option value="Lithuanian">Lietuvių</option><option value="Hungarian">Magyar</option><option value="Norwegian">Norsk</option><option value="Polish">Polski</option><option value="Romanian">Română</option><option value="Slovak">Slovenčina</option><option value="Slovenian">Slovenščina</option><option value="Finnish">Suomi</option><option value="Swedish">Svenska</option><option value="Turkish">Türkçe</option><option value="Vietnamese">Việt</option><option value="Czech">Čeština</option><option value="Greek">Ελληνικά</option><option value="Bulgarian">Български</option><option value="Serbian">Српски</option><option value="Ukrainian">Українська</option><option value="Hebrew">עברית‏</option><option value="Arabic">العربية‏</option><option value="Farsi">فارسی</option><option value="Hindi">हिन्दी</option><option value="Thai">ภาษาไทย</option><option value="Browser Default Language">Browser Default Language</option></select></div></div></div></div></div></div><div class="drawerAdvancedSettings drawer hide"><div><div class="block_picture show_min"><span class="icon icon-gear"></span></div><div class="block_content show_min">Advanced Settings selected</div><div class="block_content"><div class="block_picture"><span class="icon icon-gear"></span></div><div class="form_row"><div class=""><div class="drawer_header"><span>Advanced Options</span><button class="link u-float-right btn_cancel" recipient-drawer="drawerAdvancedSettings" recipient-drawer-state="closed">Discard</button><button class="link u-float-right btn_save invisible" recipient-drawer="drawerAdvancedSettings">Temp Save</button></div><div class="form_unit">Signing settings</div></div><div class="cb"><input class="cb_input" id="cbAdvancedSettings' + child_num + '" type="checkbox"><label class="cb_label" for="cbAdvancedSettings' + child_num + '">Draw a new signature for each signature or recipient field</label></div></div></div></div></div></div><div class="recipient_remove hide"><span class="icon icon-times"></span><span class="sr-text">Remove</span></div></div>');



  // FIXING WIDTH ON CHROME
  $(".recipient_cards").find(".country-code").parent(".select-wrap").css("width", "60px");
});

$(".recipient_cards").on("click", ".btn-group > .btn", function(e) {
  $(this).parent().find(".btn").removeClass("btn-primary").addClass("btn-secondary");
  $(this).removeClass("btn-secondary").addClass("btn-primary");

  var targetEl = $(this).parent().parent().find(".form_unit_change");

  console.log(targetEl.find(".selectTrigger").val());
  if($(this).attr("access-type") == "multiple") {
    targetEl.removeClass("single").addClass("multiple");
    targetEl.prev(".hidden_unit").removeClass("hidden");
    if(targetEl.find(".selectTrigger").val() == "AccessCode") {
      targetEl.find(".selectTrigger").val("Phone").change();
    } else {
      targetEl.find(".selectTrigger").change();
    }
  } else {
    targetEl.removeClass("multiple").addClass("single");
    targetEl.prev(".hidden_unit").addClass("hidden");
    targetEl.find(".selectTrigger").change();
  }
});

$(document).ready(function() {
  $("body").find("select").prop("selectedIndex", 0);
  $("body").find(".drawer .input-text, .drawer .input-textarea").val("");

  $(".btn-add-recipient").click();

  var sortableRecipients = document.getElementById("sortableRecipients");
  Sortable.create(sortableRecipients, {
    handle: ".icon-handle",
    animation: 200,
    ghostClass: "sortable-ghost",
    onEnd: sortRecipients});
});

function sortRecipients() {
  $(".recipient_cards").find(".recipient_card .seq_num > input").each(function() {
    $(this).val($(this).parents(".recipient_card").index() + 1);
  });
}
