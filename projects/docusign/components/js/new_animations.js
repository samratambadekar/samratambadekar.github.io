$(".text_input_animations .sample1 input").on("focus", function(evt) {
  $(".text_input_animations .sample1 .label").addClass("sampleLabel1")
});
$(".text_input_animations .sample1 input").on("blur", function(evt) {
  if($(this).val().trim() == "") {
    $(".text_input_animations .sample1 .label").removeClass("sampleLabel1");
  }
});

$(".text_input_animations .sample2 input").on("focus", function(evt) {
  $(".text_input_animations .sample2 .label").addClass("sampleLabel2")
});
$(".text_input_animations .sample2 input").on("blur", function(evt) {
  // if($(this).val().trim() == "") {
    $(".text_input_animations .sample2 .label").removeClass("sampleLabel2");
  // }
});

$(".text_input_animations .sample3 input").on("focus", function(evt) {
  $(".text_input_animations .sample3 .label").addClass("sampleLabel3")
});
$(".text_input_animations .sample3 input").on("blur", function(evt) {
  // if($(this).val().trim() == "") {
    $(".text_input_animations .sample3 .label").removeClass("sampleLabel3");
  // }
});

$(".text_input_animations .sample4 input").on("focus", function(evt) {
  $(".text_input_animations .sample4 .label").addClass("sampleLabel4")
});
$(".text_input_animations .sample4 input").on("blur", function(evt) {
  // if($(this).val().trim() == "") {
    $(".text_input_animations .sample4 .label").removeClass("sampleLabel4");
  // }
});




$(".radio_input_animations .sample1 input").on("focus", function(evt) {
  $(".radio_input_animations .sample1 .label").addClass("sampleLabel1")
});
$(".radio_input_animations .sample1 input").on("blur", function(evt) {
  if($(this).val().trim() == "") {
    $(".radio_input_animations .sample1 .label").removeClass("sampleLabel1");
  }
});

$(".radio_input_animations .sample2 input").on("focus", function(evt) {
  $(".radio_input_animations .sample2 .label").addClass("sampleLabel2")
});
$(".radio_input_animations .sample2 input").on("blur", function(evt) {
  // if($(this).val().trim() == "") {
    $(".radio_input_animations .sample2 .label").removeClass("sampleLabel2");
  // }
});

$(".radio_input_animations .sample3 input").on("focus", function(evt) {
  $(".radio_input_animations .sample3 .label").addClass("sampleLabel3")
});
$(".radio_input_animations .sample3 input").on("blur", function(evt) {
  // if($(this).val().trim() == "") {
    $(".radio_input_animations .sample3 .label").removeClass("sampleLabel3");
  // }
});

$(".radio_input_animations .sample4 input").on("focus", function(evt) {
  $(".radio_input_animations .sample4 .label").addClass("sampleLabel4")
});
$(".radio_input_animations .sample4 input").on("blur", function(evt) {
  // if($(this).val().trim() == "") {
    $(".radio_input_animations .sample4 .label").removeClass("sampleLabel4");
  // }
});






$(".checkbox_input_animations .sample1 input").on("focus", function(evt) {
  $(".checkbox_input_animations .sample1 .label").addClass("sampleLabel1")
});
$(".checkbox_input_animations .sample1 input").on("blur", function(evt) {
  if($(this).val().trim() == "") {
    $(".checkbox_input_animations .sample1 .label").removeClass("sampleLabel1");
  }
});

$(".checkbox_input_animations .sample2 input").on("focus", function(evt) {
  $(".checkbox_input_animations .sample2 .label").addClass("sampleLabel2")
});
$(".checkbox_input_animations .sample2 input").on("blur", function(evt) {
  // if($(this).val().trim() == "") {
    $(".checkbox_input_animations .sample2 .label").removeClass("sampleLabel2");
  // }
});





$(document).ready(function() {
  $(".drawer_animation .container-drawer .drawer").each(function(index, elem) {
    $(this).css("height", $(elem).children("div").height());
  });
});
$(".drawer_animation .sample1").on("click", ".toggleDrawer", function(evt) {
  var targetEl = $(this).closest(".container-drawer").find(".drawer");

  if(targetEl.hasClass("open")) {
    targetEl.find(".drawer-content").removeClass("showing");
    targetEl.find(".drawer-summary").removeClass("showing");
    targetEl.removeClass("open full").addClass("closed");
    targetEl.css("height", 0);
    // targetEl.find(".drawer-wrapper").css("top", -158);
  } else {
    targetEl.removeClass("closed").addClass("full open");
    targetEl.find(".drawer-content").addClass("showing");
    targetEl.find(".drawer-summary").addClass("showing");
    targetEl.css("height", "158px");
    // targetEl.find(".drawer-wrapper").css("top", 0);
  }
});
$(".drawer_animation .sample2").on("click", ".toggleDrawer", function(evt) {
  var targetEl = $(this).closest(".container-drawer").find(".drawer");

  if(targetEl.hasClass("open") && $(this).attr("data-toggle") == "hide") {
    targetEl.find(".drawer-content").removeClass("showing");
    targetEl.find(".drawer-summary").removeClass("showing");
    targetEl.removeClass("open full").addClass("closed");
    targetEl.css("height", 0);
  }
  if($(this).attr("data-toggle") == "full") {
    targetEl.removeClass("closed").addClass("full open");
    targetEl.find(".drawer-content").addClass("showing");
    targetEl.find(".drawer-summary").addClass("showing");
    targetEl.css("height", "206px");
  }
  if($(this).attr("data-toggle") == "content") {
    targetEl.removeClass("closed").addClass("full open");
    targetEl.find(".drawer-summary").removeClass("showing");
    targetEl.find(".drawer-content").addClass("showing");
    targetEl.css("height", "158px");
  }
  if($(this).attr("data-toggle") == "summary") {
    targetEl.removeClass("closed").addClass("full open");
    targetEl.find(".drawer-content").removeClass("showing");
    targetEl.find(".drawer-summary").addClass("showing");
    targetEl.css("height", "48px");
  }
  // if($(this).attr("data-toggle") == "hide") {
  // } else {
  //
  //   targetEl.css("height", targetEl.children("div").height());
  // }
});






$(".tab_animation").on("click", ".tab", function(evt) {
  $(this).closest(".tabs-wrap").find(".tab").removeClass("on");
  $(this).addClass("on");

  $(this).closest(".tabs-wrap").next(".section").children("div").css({"display": "none"});
  $(this).closest(".tabs-wrap").next(".section").children("div[olive-tab-id='" + $(this).attr("olive-tab-id") + "']").css({"display": "block"});
});





$(".accordion_animation").on("click", "button.accordion", function(evt) {
  $(this).toggleClass("open closed");
  var targetEl = $(this).next(".drawer");
  targetEl.toggleClass("full open closed");

  if(targetEl.hasClass("closed")) {
    targetEl.css("height", "0px");
  } else {
    targetEl.css("height", targetEl.children(".drawer-wrapper").height());
  }
});
