$(document).ready(function() {
  console.log(localStorage.getItem("show_activity"));

  if(localStorage.getItem("show_activity") == true || localStorage.getItem("show_activity") == "true") {
    $(".ndse_home").removeClass("invisible");
    $(".documents_card").removeClass("hide");
    $(".documents_card.empty").addClass("hide");

    localStorage.setItem("show_activity", false);
  } else {
    $(".ndse_home").addClass("invisible");
    $(".ds-modal-background").removeClass("invisible");
    $(".modal-ndse-intro").removeClass("hide_modal");
  }
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
    window.location.href = "ndse.html";
    // return false;
  });
  $(".modal").on("click", ".show_sample_doc", function(evt) {
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
