var flagC2AUsed = localStorage.getItem("flagC2AUsed");
var flagC2AEditMode = localStorage.getItem("flagC2AEditMode");
// flagC2AUsed = true;

$(document).ready(function(evt) {
  if(flagC2AUsed == true || flagC2AUsed == "true") {
    $(".ndse_home-manage .switch-to-manage-c2a").removeClass("empty_c2a_list");
    setTimeout(function() {
      // $(".ndse_home-manage .manage_c2a_list").click();
      showMessage($(".message.message-success"), "Terms of Service successfully saved.");
    }, 100);
    localStorage.setItem("flagC2AUsed", false);
  } else if(!flagC2AUsed || flagC2AUsed == false || flagC2AUsed == "false") {
    $(".ndse_home-manage .switch-to-manage-c2a").addClass("empty_c2a_list");
    setTimeout(function() {
      // showCallout(evt, $("#tab_c2a"));
    }, 500);
  }
  // console.log(flagC2AEditMode);
  $(".manage_c2a_list .table .doc_version_num").addClass("hidden");
  if(flagC2AEditMode == true || flagC2AEditMode == "true") {
    $(".ndse_home-manage .switch-to-manage-c2a").removeClass("empty_c2a_list");
    $(".manage_c2a_list .table .doc_version_num").removeClass("hidden");
    setTimeout(function() {
      // $(".ndse_home-manage .manage_c2a_list").click();
      showMessage($(".message.message-success"), "Terms of Service successfully updated.");
    }, 100);
    localStorage.setItem("flagC2AEditMode", false);
  }
  if((flagC2AUsed == true || flagC2AUsed == "true") && !(flagC2AEditMode == true || flagC2AEditMode == "true")) {
    setTimeout(function() {
      $(".callout").removeClass("start end");
      $(".callout .callout_content").html('Select Get Code from the dropdown and apply it to your website. <span class="link">Learn more...</span>');
      showCallout(evt, $("[data-callout-target='button_edit_c2a']"));
    }, 500);
  }

  $("body").on("click", ".create_first_c2a", function(evt) {
    showModal($(".modal-intro"));
  });

  $("body").on("click", ".get_started", function(evt) {
    $(this).closest(".modal-intro").addClass("modal_close_only");

    setTimeout(function() {
      showModal($(".modal-c2a-agreement-type"));
    }, 100);
  });

  $("body").on("click", "table .btn-combo .menu_item.c2a-action-download", function(evt) {
    evt.stopPropagation();

    setTimeout(function() {
      showModal($(".modal-c2a-download"));
    }, 100);
  });

  $("body").on("click", "table .btn-combo .menu_item.c2a-action-delete", function(evt) {
    evt.stopPropagation();
    setTimeout(function() {
      showModal($(".modal-delete-clickwrap"));
    }, 100);
  });

  $("body").on("click", ".delete_clickwrap", function(evt) {
    // $(this).closest(".table_row-clickable").remove();
    setTimeout(function() {
      $(".ndse_home-manage .switch-to-manage-c2a").addClass("empty_c2a_list");
      showMessage($(".message.message-success"), "Terms of Service successfully deleted.");
    }, 500);
  });

  $("body").on("click", "table.table-c2a-list .c2a_show_entry_details", function(evt) {
    $(this).closest(".manage_c2a_list").addClass("c2a_details_view");
  });
  $("body").on("click", ".table-c2a-entry-details-header .back_to_c2a_list", function(evt) {
    $(this).closest(".manage_c2a_list").removeClass("c2a_details_view");
  });
  //
  // $(".modal-c2a-agreement-type").on("click", ".tile", function(evt) {
  //   $(this).closest(".tile-section").find(".tile").removeClass("tile-selected");
  //   $(this).addClass("tile-selected");
  // });



  $("body").on("click", ".edit_this_c2a", function(evt) {
    localStorage.setItem("flagC2AEditMode", true);
  });
  $("body").on("click", ".button-new-c2a", function(evt) {
    localStorage.setItem("flagC2AEditMode", false);
  });

  $("body").on("click", ".download-zip", function(evt) {
    window.open("download_code/code_files.zip", '_blank');
  });
});
