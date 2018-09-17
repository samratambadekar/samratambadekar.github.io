$(document).ready(function() {
  $(".profile_status .completion").addClass("completion_value");

  if(localStorage.getItem("signedByMe") == true || localStorage.getItem("signedByMe") == "true") {
    $(".signedByMe").removeClass("hide");
  } else {
    $(".signedByMe").addClass("hide");
  }

  if(localStorage.getItem("envelopeName") != null && localStorage.getItem("envelopeName") != "") {
    $("[data-field-id='Envelope Name']").text(localStorage.getItem("envelopeName"));
    localStorage.setItem("envelopeName", "");
  } else {
    $("[data-field-id='Envelope Name']").text("NDA_Edwards_Consulting_Group.pdf");
  }

  if(localStorage.getItem("signReturn") == true || localStorage.getItem("signReturn") == "true") {
    $(".options_grid, .signedByMe").addClass("hidden");
    $(".signReturn").removeClass("hide");
  } else {
    $(".options_grid, .signedByMe").removeClass("hidden");
    $(".signReturn").addClass("hide");
  }

  setTimeout(function() {
    $(".checkmark__circle, .checkmark, .checkmark__check").addClass("animate");
  }, 500);
  setTimeout(function() {
    $(".stars_shapes").addClass("show");
    $("article > .title").removeClass("invisible");
  }, 1500);
  setTimeout(function() {
    $("article > div").removeClass("invisible");
  }, 2000);

  $("body").on("click", ".SignReturn .btn", function(evt) {
    $(".ds-modal-background").removeClass("invisible");
    $(".modal-send-copy").removeClass("hide_modal");
  });
});
