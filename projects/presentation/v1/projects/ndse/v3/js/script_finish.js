$(document).ready(function() {
  $(".profile_status .completion").addClass("completion_value");

  if(localStorage.getItem("envelopeName") != null && localStorage.getItem("envelopeName") != "") {
    $("[data-field-id='Envelope Name']").text(localStorage.getItem("envelopeName"));
    localStorage.setItem("envelopeName", "");
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
});
