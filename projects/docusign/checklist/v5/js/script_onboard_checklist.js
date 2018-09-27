$(document).ready(function() {
  updateCount();
  $("body").on("click", ".checklist_card", function(evt) {
    var _this = this;

    if($(_this).attr("data-card-animation") == "pop_out" && !$(_this).hasClass("completed")) {
      $(".checklist_card").removeClass("animate_height");
      $(_this).addClass("animate_transition_layer");
      $(_this).addClass("animate_height");


      window.setTimeout(function(evt) {
        $(_this).removeClass("animate_transition_layer");
        $(_this).removeClass("animate_height");
      }, 1800);

      window.setTimeout(function(evt) {
        $(_this).addClass("completed");
      }, 2100);

      window.setTimeout(function(evt) {
        checkConfetti();
        updateCount();
      }, 2600);
    } else {
      if($(_this).attr("data-card-name") == "adopt_signature" && !$(_this).hasClass("completed")) {
        return;
      }

      playCardAnimation($(_this));
    }
  });

  $("body").on("click", ".show_onboarding_checklist", function(evt) {
    showModal($(".modal-onboard-checklist"));
  });

  $("body").on("click", "[data-card-name='adopt_signature']:not(.completed)", function(evt) {
    hideModal($(".modal-onboard-checklist"));
    showModal($(".modal-adopt-signature"));
  });
  $("body").on("click", ".modal-adopt-signature", function(evt) {
    hideModal($(".modal-adopt-signature"));
    showModal($(".modal-onboard-checklist"));

    window.setTimeout(function() {
      playCardAnimation($(".modal-onboard-checklist [data-card-name='adopt_signature']"));
    }, 300);

  });
});

function playCardAnimation(targetCard) {
  $(targetCard).toggleClass("completed");
  updateCount();

  window.setTimeout(function(evt) {
    checkConfetti();
  }, 1000);
}

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
    $(".modal-onboard-checklist").addClass("modal_completed");
    window.setTimeout(function(evt) {
      clearConfetti();
    }, 5500);
  } else {
    $(".modal-onboard-checklist").removeClass("modal_completed");
  }
}

function clearConfetti() {
  $(".confetti-layer").html("");
}

function updateCount() {
  var completedCount = $(".checklist_card.completed").length;
  var totalCount = $(".checklist_card").length;
  $(".manage4 .chklst_total_items").text(totalCount);
  $(".manage4 .chklst_items_left").text(completedCount);
  $(".manage4 .progress_indicator .progress_indicator_bar").css("width", (100*completedCount/totalCount) + "%");
}
