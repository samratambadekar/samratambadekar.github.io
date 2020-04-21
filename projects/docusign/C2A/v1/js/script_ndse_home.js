var flagMixpanelTracked = false;

$(document).ready(function() {
  if(flagMixpanelTracked) {
    var mixpanelStartTime = localStorage.getItem("mixpanelStartTime");
    var userTestingId = localStorage.getItem("userTestingId");
    var mixpanelUserInformation = {};
    mixpanelUserInformation.userTestingId = userTestingId;

    if(mixpanelStartTime == null || mixpanelStartTime == "") {
      mixpanelStartTime = Date.now();
      mixpanelUserInformation.startTime = String(new Date());
      mixpanelUserInformation.totalTimeSpent = String((Date.now() - mixpanelStartTime)/1000);
      mixpanelUserInformation.userTestingId = String(new Date());
      localStorage.setItem("mixpanelStartTime", mixpanelStartTime);
      localStorage.setItem("mixpanelUserInformation", mixpanelUserInformation);
      mixpanel.track("Begin", mixpanelUserInformation);
    }
  }

  $(".envelope_sent_number").text("0");


  if(localStorage.getItem("show_activity") == true || localStorage.getItem("show_activity") == "true") {
    $(".ndse_home").removeClass("invisible");
    $(".documents_card").removeClass("hide");
    $(".documents_card.empty").addClass("hide");
    $(".upgrade_banner").removeClass("invisible");
    $(".envelope_sent_number").text("1");

    // localStorage.setItem("show_activity", false);
  } else if(localStorage.getItem("firstTimeModal") == false || localStorage.getItem("firstTimeModal") == "false") {
    $(".ndse_home").removeClass("invisible");
    $(".ds-modal-background").addClass("invisible");
    $(".modal-ndse-intro").addClass("hide_modal");
    $(".upgrade_banner").removeClass("invisible");
    localStorage.setItem("firstTimeModal", true);
  } else {
    $(".ndse_home").addClass("invisible");
    $(".ds-modal-background").removeClass("invisible");
    $(".modal-ndse-intro").removeClass("hide_modal");
  }


          // SETTING FLAGS FOR USER TESTING
            // localStorage.setItem("firstTimeModal", false);
            // localStorage.setItem("show_activity", true);
          // END SETTING FLAGS

  setTimeout(function() {
    $(".profile_status .completion").addClass("completion_value");
  },800);


  $(".ndse_home").on("click", ".select_document", function(evt) {
    evt.stopPropagation();

    // $(".ds-modal-background").removeClass("invisible");
    // $(".tamaras-new-modal").removeClass("hide_modal");
  });
  $(".ndse_home, .modal").on("click", ".add_document", function(evt) {
    evt.stopPropagation();
    $(this).find("input[type=file]").click();
  });
  $(".ndse_home, .modal").on("click", ".add_document input[type=file]", function(evt) {
    evt.stopPropagation();
  });
  $(".ndse_home, .modal").on("change", ".add_document input[type=file]", function(evt) {
    localStorage.setItem("firstFileName", $(this)[0].files[0]['name']);
    if(flagMixpanelTracked) {
      mixpanelUserInformation.totalTimeSpent = String((Date.now() - mixpanelStartTime)/1000);
      localStorage.setItem("mixpanelUserInformation", mixpanelUserInformation);
      mixpanel.track("HomePage", mixpanelUserInformation);
    }
    window.location.href = "ndse.html";
  });
  $(".ndse_home, .modal").on("dragenter", ".add_document", function(evt) {
    evt.preventDefault();
    $(this).addClass("file-droppable");
    // return false;
  });
  $(".ndse_home, .modal").on("dragexit drop", ".add_document", function(evt) {
    evt.preventDefault();
    $(this).removeClass("file-droppable");

    localStorage.setItem("firstFileName", evt.originalEvent.dataTransfer.files[0].name);

    if(flagMixpanelTracked) {
      mixpanelUserInformation.totalTimeSpent = String((Date.now() - mixpanelStartTime)/1000);
      localStorage.setItem("mixpanelUserInformation", mixpanelUserInformation);
      mixpanel.track("HomePage", mixpanelUserInformation);
    }
    window.location.href = "ndse.html";
    // return false;
  });
  $(".modal").on("click", ".show_sample_doc", function(evt) {
    $(".ndse_home").removeClass("invisible");
    $(".documents_card:not(.hide) .add_document").click();
    localStorage.setItem("showSampleModalCallout", true);
  });

  $(window).on("dragover", function(evt){
    evt.preventDefault();
    return false;
  });
  $(window).on("drop", function(evt){
    evt.preventDefault();
    return false;
  });
});
