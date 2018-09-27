$(document).ready(function() {
  updateCount();
  $("body").on("click", ".checklist_card", function(evt) {
    var _this = this;
    // $(this).toggleClass("completed");

    if($(this).attr("data-card-name") == "upload_pic" && !$(this).hasClass("completed")) {
      $(".checklist_card").removeClass("animate_height");
      $(this).addClass("animate_height");

      window.setTimeout(function(evt) {
        $(_this).removeClass("thumb_rotate");
      }, 500);
      window.setTimeout(function(evt) {
        $(_this).removeClass("thumb_hide_stars");
      }, 700);
      window.setTimeout(function(evt) {
        $(_this).removeClass("animate_height");
      }, 1800);

      window.setTimeout(function(evt) {
        $(_this).toggleClass("completed");
      }, 2100);

      window.setTimeout(function(evt) {
        checkConfetti();
        updateCount();
      }, 2600);
    } else {
      if($(this).attr("data-card-name") == "upload_pic") {
        $(_this).addClass("thumb_rotate thumb_hide_stars");
      }

      $(_this).toggleClass("completed");
      updateCount();

      window.setTimeout(function(evt) {
        checkConfetti();
      }, 1000);
    }


  });

  $("body").on("click", ".show_onboarding_checklist", function(evt) {
    $(".ds-modal-background").removeClass("invisible");
    $(".modal-onboard-checklist").removeClass("hide_modal");
  });
});


function checkConfetti() {
  var allCompleted = true;
  $(".checklist_card").each(function(idx, elem) {
    if(!$(elem).hasClass("completed") || $(elem).hasClass("animate_height")) {
      allCompleted = false;
    }

  });

  if(allCompleted) {
    // $(".modal-onboard-checklist").addClass("show_confetti");
    // $(".confetti-layer").removeClass("hide");
    showConfetti();

    window.setTimeout(function(evt) {
      clearConfetti();
    }, 5500);
  }
}

function clearConfetti() {
  $(".confetti-layer").html("");
}

function updateCount() {
  var completedCount = $(".checklist_card.completed").length;
  $(".chklst_itms_left").text(5 - completedCount);
  $(".checklist_completion circle.completion_value").css("stroke-dashoffset", (285 - (285*completedCount/5)) + "%");
}
