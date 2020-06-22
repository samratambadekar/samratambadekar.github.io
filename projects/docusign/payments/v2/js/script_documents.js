$(document).ready(function() {
  $(".list_documents tr.ui-draggable").each(function() {
    $(this).attr("data-qa", $(this).find("span[data-qa='detail-status-title']").text().trim());
  })

  var prev_page1 = String(document.referrer).split('/');
  var prev_page = prev_page1[prev_page1.length-1];
  var show_row = true;
  var date = new Date();

  if(prev_page == "tagger.html" || show_row==true) {
    setTimeout(function() {
      $(".click-row.hide").removeClass("hide");
    },1000);
    show_row = false;
  }

  $(".today_date").text((date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear());

  $(".btn_filter").on("click", function(e) {
    e.stopPropagation();
    $(".cheshire-topRight").toggleClass("cheshire-off");
  });

  $(".site-container").on("click", function(e) {
    $(".select-menu").addClass("invisible");
    $(".cheshire-topRight").addClass("cheshire-off");
  });

  $(".cheshire, .cheshire_visibleContent").on("click", function(e) {
    e.stopPropagation();
  });
  $(".cheshire").on("click", ".btn-trigger", function(e) {
    e.stopPropagation();
    var isVisible = false;
    var target = $(this).next(".select-menu");
    if(target.hasClass("invisible")) {
      isVisible = false;
    } else {
      isVisible = true;
    }

    $(".select-menu").addClass("invisible");
    if(isVisible) {
      target.addClass("invisible");
    } else {
      target.removeClass("invisible");
    }
  });

  $(".cheshire_footer").on("click", ".btn", function(e) {
    if($(this).attr("data-qa") == "filter-menu-apply" && $("#cb_include_payments").prop("checked") == true) {
      $("span[data-qa='smart-folder-Includes Payments']").closest(".menu_item").click();
    } else {
      $(".tree_item-isActive").click();
    }
  });

  $("folders-root-item").on("click", ".tree_item-isActive", function() {
    $(".list_documents tr.ui-draggable").removeClass("hide");
  });

  $(".menu_list").on("click", ".menu_item", function() {
    $(".menu_list .menu_item").removeClass("menu_item-isOn");
    $(this).addClass("menu_item-isOn");

    $(".list_documents tr.ui-draggable").addClass("hide");

    if($(this).children("span").attr("data-qa") === "smart-folder-Action Required") {
      $(".list_documents tr.ui-draggable[data-qa='Need to Sign']").removeClass("hide");
    }
    if($(this).children("span").attr("data-qa") === "smart-folder-Waiting for Others") {
      $(".list_documents tr.ui-draggable[data-qa='Waiting for Others']").removeClass("hide");
    }
    if($(this).children("span").attr("data-qa") === "smart-folder-Expiring Soon") {
      $(".list_documents tr.ui-draggable[data-qa='Expiring Soon']").removeClass("hide");
    }
    if($(this).children("span").attr("data-qa") === "smart-folder-Completed") {
      $(".list_documents tr.ui-draggable[data-qa='Completed']").removeClass("hide");
    }
    if($(this).children("span").attr("data-qa") === "smart-folder-Includes Payments") {
      $(".list_documents tr.ui-draggable[includes-payment='true']").removeClass("hide");
    }
  });

  $(".action-btns").on("click", ".btn-trigger", function(e) {
    e.stopPropagation();
    var isVisible = false;
    var target = $("#" + $(this).attr("data-qa"));

    if(target.hasClass("invisible")) {
      isVisible = false;
    } else {
      isVisible = true;
    }

    $(".select-menu").addClass("invisible");
    if(isVisible) {
      target.addClass("invisible");
    } else {
      target.removeClass("invisible");
    }
    // $("#" + $(this).attr("data-qa")).removeClass("invisible");
    // .css({"top": $(this).offset().top, "left": $(this).offset().left});
  });

  $("#menuMore").on("click", ".item[data-qa='document-history']", function() {
    $(".modal-history").removeClass("invisible");
  });
  $(".modal-history").on("click", ".close-x, .btn-minor", function() {
    $(".modal-history").addClass("invisible");
  });

  $(".site-container").on("click", ".column-name, .column-badgeLabel, .column-icon, .column-status", function() {
    if(window.location.hash == "#details") {
      window.location.hash = "#";
    } else {
      window.location.hash = "#details";
    }
  });

  window.onhashchange = function() {
    if($("envelopes-page").hasClass("hide")) {
      $("envelopes-page").removeClass("hide");
      $(".envelope_detail").addClass("hide");
    } else {
      $("envelopes-page").addClass("hide");
      $(".envelope_detail").removeClass("hide");
    }
  }
});
