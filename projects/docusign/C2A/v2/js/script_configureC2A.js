$(document).ready(function(evt) {
  var targetUserEl;
  var firstTimeButtonAgreeCallout = true;
  var flagAddedNewDoc = false;
  var flagReplacedDocEditMode = false;
  var changeVersionTarget = null;
  var flagC2AEditMode = localStorage.getItem("flagC2AEditMode");


  if(flagC2AEditMode == true || flagC2AEditMode == "true") {
    $(".configureC2A").removeClass("no_doc_added").addClass("c2a_edit_mode");
    // window.setTimeout(function() {
    //   $(".configureC2A .toggle_c2a_type .c2a_type_modal").click();
    // }, 100);
    $(".configureC2A .c2a_main_container").removeClass(" inline_view").addClass("modal_view");
    // localStorage.setItem("flagC2AEditMode", false);
  } else if(flagC2AEditMode == false || flagC2AEditMode == "false") {
    $(".configureC2A").removeClass("c2a_edit_mode");
  }

  if($(".configureC2A").hasClass("no_doc_added")) {
    setTimeout(function() {
      $(".callout").removeClass("start end");
      $(".callout .callout_content_text").text("You can now upload your HTML files.");
      showCallout(evt, $("[data-callout-target='button_browse']"));
    }, 500);
  }

  $("body").on("click", ".private-message-menu .menu .item", function(evt) {
    $(".ds-modal-background").removeClass("invisible");
    $(".modal-private-message").removeClass("hide_modal");
    $(".modal-private-message .pm-recipient-name").text($(this).find(".pm-recipient-name").text());
    targetUserEl = $(this);
  });

  $("body").on("click", ".modal-private-message .btn-done", function(evt) {
    if($(".modal-private-message .modal_content .input-textarea").val().trim().length > 0) {
      targetUserEl.find(".icon").removeClass("invisible");
    } else {
      targetUserEl.find(".icon").addClass("invisible");
    }
    $(".modal-private-message .modal_content .input-textarea").val("");
  });

  $(".configureC2A").on("click", ".accordion", function(evt) {
    evt.stopPropagation();
    $(this).toggleClass("open closed");

    if($(this).hasClass("open")) {
      // $(this).next(".drawer").css({"height": $(this).next(".drawer").find(".drawer-wrapper").outerHeight() + 25});
      $(this).next(".drawer").css({"height": $(this).next(".drawer").children(".drawer-wrapper").outerHeight() + 16});
    } else if($(this).hasClass("closed")) {
      $(this).next(".drawer").css({"height": 0});
    }
  });

  $(".configureC2A").on("click", ".toggle_c2a_type .c2a_type_modal", function(evt) {
    $(".configureC2A .c2a_main_container").removeClass("modal_view inline_view");
    $(".configureC2A .c2a_main_container").addClass("modal_view");
  });
  $(".configureC2A").on("click", ".toggle_c2a_type .c2a_type_inline", function(evt) {
    $(".configureC2A .c2a_main_container").removeClass("modal_view inline_view");
    $(".configureC2A .c2a_main_container").addClass("inline_view");
  });
  $(".configureC2A").on("click", ".toggle_c2a_layout .c2a_layout_document", function(evt) {
    $(".configureC2A .c2a_main_container").removeClass("document_view link_view");
    $(".configureC2A .c2a_main_container").addClass("document_view");
  });
  $(".configureC2A").on("click", ".toggle_c2a_layout .c2a_layout_link", function(evt) {
    $(".configureC2A .c2a_main_container").removeClass("document_view link_view");
    $(".configureC2A .c2a_main_container").addClass("link_view");
  });
  $(".configureC2A").on("click", ".toggle_c2a_control .c2a_control_checkbox", function(evt) {
    $(".configureC2A .c2a_main_container").removeClass("checkbox_view button_view");
    $(".configureC2A .c2a_main_container").addClass("checkbox_view");
  });
  $(".configureC2A").on("click", ".toggle_c2a_control .c2a_control_button", function(evt) {
    $(".configureC2A .c2a_main_container").removeClass("checkbox_view button_view");
    $(".configureC2A .c2a_main_container").addClass("button_view");
  });
  $(".configureC2A").on("click", ".toggle_c2a_size .item", function(evt) {
    $(".configureC2A .recipient_message").removeClass("size_large size_medium size_small");
    $(".configureC2A .recipient_message").addClass($(this).attr("data-c2a-size"));

    $(this).closest(".section_custom_c2a_size").removeClass("show_custom_size_options");
    if($(this).hasClass("toggle_custom_size_flag")) {
      $(this).closest(".section_custom_c2a_size").addClass("show_custom_size_options");
    }
  });

  // $(".configureC2A").on("click", ".envelope_section_name .link a", function(evt) {
  //   evt.stopPropagation();
  //   evt.preventDefault();
  //
  //   $(".ndse_page").removeClass("selected");
  //   $(".ndse_page[data-step-name='Select']").first().addClass("selected");
  //   goToSelectedPage(0);
  //   // flowProgressIndicator();
  //   window.location.href = window.location.href.split("#")[0] + "#" + $(this).attr("data-step-num");
  // });
  // $(".c2a_main_container .c2a_footer").on("mouseup", function(evt) {
  //   evt.stopPropagation();
  //   var pageX = evt.pageX;
  //   var pageY = evt.pageY;
  //   var selectedText = getSelectedText();
  //   if (selectedText != '') {
  //     var isButton = false;
  //     var wrapperElement = document.createElement("span");
  //     // $(wrapperElement).addClass("strong");
  //
  //     // console.log(selectedText.getRangeAt(0).startContainer);
  //     // console.log(selectedText.getRangeAt(0).endContainer);
  //     // console.log(selectedText.getRangeAt(0).commonAncestorContainer);
  //     // console.log(selectedText.getRangeAt(0).startContainer === selectedText.getRangeAt(0).commonAncestorContainer);
  //     // console.log(selectedText.getRangeAt(0).endContainer === selectedText.getRangeAt(0).commonAncestorContainer);
  //     // console.log(selectedText.getRangeAt(0).endContainer === selectedText.getRangeAt(0).startContainer);
  //     // console.log($(window.getSelection().getRangeAt(0).commonAncestorContainer).find(".strong").length);
  //     // console.log(window.getSelection().getRangeAt(0).startOffset);
  //
  //     if($(window.getSelection().getRangeAt(0).commonAncestorContainer).hasClass("btn") ||
  //        $(window.getSelection().getRangeAt(0).commonAncestorContainer).parent().hasClass("btn") ||
  //        $(window.getSelection().getRangeAt(0).commonAncestorContainer).closest(".btn").length > 0) {
  //       isButton = true;
  //     } else {
  //       isButton = false;
  //     }
  //     if($(window.getSelection().getRangeAt(0).commonAncestorContainer).find(".strong").length > 0) {
  //       $(window.getSelection().getRangeAt(0).commonAncestorContainer).find(".strong").contents().unwrap();
  //       $(window.getSelection().getRangeAt(0).commonAncestorContainer)[0].normalize();
  //       // window.getSelection().getRangeAt(0).surroundContents(wrapperElement);
  //       showTextFormatter(pageX, pageY, isButton);
  //     } else if(selectedText.getRangeAt(0).endContainer === selectedText.getRangeAt(0).startContainer) {
  //       // window.getSelection().getRangeAt(0).surroundContents(wrapperElement);
  //       showTextFormatter(pageX, pageY, isButton);
  //     }
  //
  //     // selectedText.removeAllRanges();
  //
  //     // window.getSelection().getRangeAt(0).deleteContents();
  //     // console.log(window.getSelection().getRangeAt(0).extractContents());
  //     // console.log($(window.getSelection().getRangeAt(0)).parent());
  //   }
  // });

  $("body").on("click", function(evt) {
    $(".text_formatting_menu").addClass("invisible");
    $(".c2a_footer .btn").attr("contenteditable", false);
  });
  $("body").on("click", ".text_formatting_menu", function(evt) {
    evt.stopPropagation();
  });

  $("body").on("click", ".c2a_footer .btn", function(evt) {
    evt.stopPropagation();
    // $(this).attr("contenteditable", true).focus();
  });
  $("body").on("dblclick", ".c2a_footer .btn", function(evt) {
    // evt.stopPropagation();
    $(this).attr("contenteditable", true).focus();
  });

  $("body").on("change", ".text_formatting_menu .format_font_size select", function(evt) {
    $(window.getSelection().getRangeAt(0).commonAncestorContainer).closest(".c2a_footer_agreement, .btn").css("font-size", $(this).val());
  });
  $("body").on("change", ".text_formatting_menu .format_font_family select", function(evt) {
    $(window.getSelection().getRangeAt(0).commonAncestorContainer).closest(".c2a_footer_agreement, .btn").css("font-family", $(this).val());
  });
  $("body").on("change", ".text_formatting_menu .format_button_style select", function(evt) {
    $(window.getSelection().getRangeAt(0).commonAncestorContainer).closest(".btn").removeClass("btn-primary btn-secondary-minor btn-minor").addClass($(this).val());
  });


  // $(".c2a_content").on("scroll", function(evt) {
  //   if($(this).find(".c2a_content_doc2").position().top < 125) {
  //     $(".c2a_main_container .c2a_head .titles").scrollTop($(".c2a_main_container .c2a_head .titles").scrollTop() + 24);
  //   } else if($(this).find(".c2a_content_doc2").position().top >= 125) {
  //     $(".c2a_main_container .c2a_head .titles").scrollTop($(".c2a_main_container .c2a_head .titles").scrollTop() - 24);
  //   }
  // });

  $("body").on("click", ".bottomNav .btn-next", function(evt) {
    // evt.preventDefault();
    if(flagC2AEditMode == true || flagC2AEditMode == "true") {
      evt.preventDefault();
      showModal($(".modal-confirm-edit-c2a"));
    }
    localStorage.setItem("flagC2AUsed", true);
  });

  $("body").on("input", ".c2a_footer .btn[data-btn-agree-text]", function(evt) {
    // evt.preventDefault();
    $(".c2a_footer span[data-btn-agree-text]").text($(this).text().toUpperCase());
  });

  $("body").on("click", ".uploaded_docs_section .doc_action_delete", function(evt) {
    // evt.preventDefault();
    var parentEl = $(this).closest(".envelope_section_content");
    $(this).closest(".uploaded_doc").remove();

    if(parentEl.find(".uploaded_doc").length <= 0) {
      $("#sortableDocuments .upload_file_list_view").addClass("hidden");
      $("#sortableDocuments .upload_file_screen_view").removeClass("hidden");
      $("#sortableDocuments .file.upload_complete").remove();
      $(".configureC2A").addClass("no_doc_added").removeClass("c2a_edit_mode");
    }
  });
  $("body").on("click", ".uploaded_docs_section .doc_action_replace", function(evt) {
    // evt.preventDefault();
    $("#sortableDocuments .upload_file").click();
    if($(".configureC2A").hasClass("c2a_edit_mode")) {
      flagReplacedDocEditMode = true;
      changeVersionTarget = $(this).closest(".uploaded_doc").find(".doc_version_num");
    }
  });
  $("body").on("click", ".uploaded_docs_section .envelope_section_add_document", function(evt) {
    // evt.preventDefault();
    flagAddedNewDoc = true;
    $("#sortableDocuments .upload_file").click();
  });


  $("body").on("click", ".action-header .btn-close-flow", function(evt) {
    // evt.preventDefault();
    showModal($(".modal-close-clickwrap"));
  });

  $(".selectDocument").on("change", ".upload_file input[type=file]", function(evt) {
    var _this = this;
    window.setTimeout(function() {
      $(_this).closest(".configureC2A").removeClass("no_doc_added");
    }, 1500);

    $(".callout").addClass("callout-invisible");
    if(firstTimeButtonAgreeCallout && !$(".configureC2A").hasClass("c2a_edit_mode")) {
      firstTimeButtonAgreeCallout = false;
      setTimeout(function() {
        $(".callout").removeClass("start end");
        $(".callout .callout_content_text").text("Edit text, styling and position of buttons and text by clicking on them directly.");
        showCallout(evt, $("[data-callout-target='button_c2a_agree']"));
      }, 2500);
    }

    if(flagAddedNewDoc || $(".uploaded_docs_section .envelope_section_content").find(".uploaded_doc").length <= 0) {
      var newDocElemNum = $(".uploaded_docs_section .envelope_section_content").find(".uploaded_doc").length + 1;
      var newDocElem = $('<div class="uploaded_doc uploaded_doc' + newDocElemNum + '"><div><span class="envelope_section_doc_title">Other Terms</span><span class="doc_version_num hidden"> v2</span>.pdf</div><div class="doc_actions"><a class="link doc_action_replace">Replace</a><a class="link doc_action_delete">Delete</a></div></div>')
      $(".uploaded_docs_section .envelope_section_content .btn-group").before(newDocElem);
      flagAddedNewDoc = false;
    }

    if(flagReplacedDocEditMode) {
      changeVersionTarget.removeClass("hidden");
    }
  });


  var footer_buttons_grp_left = document.getElementById("footer_buttons_grp_left");
  var sort_left = Sortable.create(footer_buttons_grp_left, {
    animation: 150,
    handle: ".btn",
    forceFallback: true,
    group: "footer_buttons_grp",
    draggable: ".btn",
    ghostClass: ".sortable-ghost",
    onUpdate: function (evt) {
     // var item = evt.item;
    },
    onStart: function (evt) {
     // var item = evt.item;
     $(".c2a_footer .buttons .footer_buttons_grp").addClass("highlight_grp");
    },
    onEnd: function (evt) {
     // var item = evt.item;
     $(".c2a_footer .buttons .footer_buttons_grp").removeClass("highlight_grp");
    }
  });
  var footer_buttons_grp_right = document.getElementById("footer_buttons_grp_right");
  var sort_right = Sortable.create(footer_buttons_grp_right, {
    animation: 150,
    handle: ".btn",
    forceFallback: true,
    group: "footer_buttons_grp",
    draggable: ".btn",
    ghostClass: ".sortable-ghost",
    onUpdate: function (evt) {
     // var item = evt.item;
    },
    onStart: function (evt) {
     // var item = evt.item;
     $(".c2a_footer .buttons .footer_buttons_grp").addClass("highlight_grp");
    },
    onEnd: function (evt) {
     // var item = evt.item;
     $(".c2a_footer .buttons .footer_buttons_grp").removeClass("highlight_grp");
    }
  });

});

function showTextFormatter(pageX, pageY, isButton) {
  if(isButton) {
    $(".text_formatting_menu").addClass("button_formatter");
  } else {
    $(".text_formatting_menu").removeClass("button_formatter");
  }
  window.setTimeout(function() {
    $(".text_formatting_menu").css({"left": (pageX - $(".text_formatting_menu").width()/2>0?pageX - $(".text_formatting_menu").width()/2:0), "top": (pageY - 65)}).removeClass("invisible");
  }, 0);
}

function getSelectedText() {
    var t = '';
    if (window.getSelection) {
        t = window.getSelection();
    } else if (document.getSelection) {
        t = document.getSelection();
    } else if (document.selection) {
        t = document.selection.createRange().text;
    }
    return t;
}
