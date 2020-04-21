$(document).ready(function() {
  var targetUserEl;

  // $("body").on("click", ".tab", function() {
  //   var parentEl = $(this).closest(".tabs-wrap");
  //   var target = parentEl.next(".section");
  //   parentEl.find(".tab").removeClass("on");
  //   $(this).addClass("on");
  //
  //   target.children("div").addClass("hide");
  //   target.find("[olive-tab-id=" + $(this).attr("olive-tab-id") + "]").removeClass("hide");
  //
  // });

  // $("body").on("click", ".private-message-menu .btn-trigger", function(evt) {
  //   evt.stopPropagation();
  //   $(this).next(".menu").toggleClass("invisible");
  // });
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
  $(".c2a_main_container .c2a_footer").on("mouseup", function(evt) {
    evt.stopPropagation();
    var pageX = evt.pageX;
    var pageY = evt.pageY;
    var selectedText = getSelectedText();
    if (selectedText != '') {
      var isButton = false;
      var wrapperElement = document.createElement("span");
      // $(wrapperElement).addClass("strong");

      // console.log(selectedText.getRangeAt(0).startContainer);
      // console.log(selectedText.getRangeAt(0).endContainer);
      // console.log(selectedText.getRangeAt(0).commonAncestorContainer);
      // console.log(selectedText.getRangeAt(0).startContainer === selectedText.getRangeAt(0).commonAncestorContainer);
      // console.log(selectedText.getRangeAt(0).endContainer === selectedText.getRangeAt(0).commonAncestorContainer);
      // console.log(selectedText.getRangeAt(0).endContainer === selectedText.getRangeAt(0).startContainer);
      // console.log($(window.getSelection().getRangeAt(0).commonAncestorContainer).find(".strong").length);
      // console.log(window.getSelection().getRangeAt(0).startOffset);

      if($(window.getSelection().getRangeAt(0).commonAncestorContainer).hasClass("btn") ||
         $(window.getSelection().getRangeAt(0).commonAncestorContainer).parent().hasClass("btn") ||
         $(window.getSelection().getRangeAt(0).commonAncestorContainer).closest(".btn").length > 0) {
        isButton = true;
      } else {
        isButton = false;
      }
      if($(window.getSelection().getRangeAt(0).commonAncestorContainer).find(".strong").length > 0) {
        $(window.getSelection().getRangeAt(0).commonAncestorContainer).find(".strong").contents().unwrap();
        $(window.getSelection().getRangeAt(0).commonAncestorContainer)[0].normalize();
        window.getSelection().getRangeAt(0).surroundContents(wrapperElement);
        showTextFormatter(pageX, pageY, isButton);
      } else if(selectedText.getRangeAt(0).endContainer === selectedText.getRangeAt(0).startContainer) {
        window.getSelection().getRangeAt(0).surroundContents(wrapperElement);
        showTextFormatter(pageX, pageY, isButton);
      }

      // selectedText.removeAllRanges();

      // window.getSelection().getRangeAt(0).deleteContents();
      // console.log(window.getSelection().getRangeAt(0).extractContents());
      // console.log($(window.getSelection().getRangeAt(0)).parent());
    }
  });

  $("body").on("click", function(evt) {
    $(".text_formatting_menu").addClass("invisible");
  });
  $("body").on("click", ".text_formatting_menu", function(evt) {
    evt.stopPropagation();
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
});

function showTextFormatter(pageX, pageY, isButton) {
  if(isButton) {
    $(".text_formatting_menu").addClass("button_formatter");
  } else {
    $(".text_formatting_menu").removeClass("button_formatter");
  }
  window.setTimeout(function() {
    $(".text_formatting_menu").css({"left": (pageX - $(".text_formatting_menu").width()/2>0?pageX - $(".text_formatting_menu").width()/2:0), "top": (pageY - 125)}).removeClass("invisible");
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
