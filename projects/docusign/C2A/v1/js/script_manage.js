var flagC2AUsed = localStorage.getItem("flagC2AUsed");
flagC2AUsed = true;

$(document).ready(function(evt) {
  if(flagC2AUsed == true || flagC2AUsed == "true") {
    $(".ndse_home-manage .tabs-wrap-target [olive-tab-id='manage_c2a_list']").removeClass("empty_c2a_list");
    setTimeout(function() {
      $(".ndse_home-manage .tabs .tab[olive-tab-id='manage_c2a_list']").click();
      showMessage($(".message.message-success"), null);
    }, 100);
    localStorage.setItem("flagC2AUsed", false);
  } else if(!flagC2AUsed || flagC2AUsed == false || flagC2AUsed == "false") {
    $(".tabs-wrap-target [tab-id='manage_c2a_list']").addClass("empty_c2a_list");
    setTimeout(function() {
      showCallout(evt, $("#tab_c2a"));
    }, 500);
  }

  $("body").on("click", ".create_first_c2a", function(evt) {
    showModal($(".modal-intro"));
  });

  $("body").on("click", ".tab", function(evt) {
    if($(this).attr("olive-tab-id") == "manage_c2a_list") {
      $(this).closest(".content_wrap").addClass("switch-to-manage-c2a");
    } else if($(this).attr("olive-tab-id") == "manage_envelope_list") {
      $(this).closest(".content_wrap").removeClass("switch-to-manage-c2a");
    }
  });

  $("body").on("click", ".get_started", function(evt) {
    $(this).closest(".modal-intro").addClass("modal_close_only");

    setTimeout(function() {
      showModal($(".modal-c2a-agreement-type"));
    }, 100);
  });

  $("body").on("click", "table .btn-combo .btn-icon.btn-secondary", function(evt) {
    evt.stopPropagation();
    $(this).next(".menu").toggleClass("invisible");
  });

  $("body").on("click", "table .btn-combo .menu_item.c2a-action-download", function(evt) {
    evt.stopPropagation();

    setTimeout(function() {
      showModal($(".modal-c2a-download"));
    }, 100);
  });
  //
  // $(".modal-c2a-agreement-type").on("click", ".tile", function(evt) {
  //   $(this).closest(".tile-section").find(".tile").removeClass("tile-selected");
  //   $(this).addClass("tile-selected");
  // });
});
