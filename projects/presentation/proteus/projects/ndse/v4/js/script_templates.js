var firstTime;
var guidedFormActive;

$(document).ready(function() {
  // $(".modal-intro > .slick-div").slick({
  //   dots: true,
  //   infinite: false
  // });

  firstTime = localStorage.getItem("firstTime");
  guidedFormActive = localStorage.getItem("guidedFormActive");
  console.log(firstTime);
  // console.log(guidedFormActive);
  // localStorage.clear();

  if(firstTime === "false" || firstTime === null) {
    localStorage.setItem("firstTime", true);
  } else if(firstTime === "true") {
    intro();
    // localStorage.setItem("firstTime", false);
  }

    // $(".guided_status_i9").removeClass("hidden").addClass("active");
  if(guidedFormActive === "true" || guidedFormActive === true) {
    $(".guided_status_i9").removeClass("hidden").addClass("active");
    localStorage.setItem("guidedFormActive", false);

    window.setTimeout(function() {
      $(".msg_form_active").removeClass("hide");
    }, 500);
    window.setTimeout(function() {
      $(".msg_form_active").addClass("hide");
    }, 1500);
  }

  $(".new_doc").on("click", function(evt) {
    evt.stopPropagation();
    $("#menuNew").toggleClass("invisible");
  });

  $("body").on("click", function() {
    $(".menu").addClass("invisible");
  });
  $(".list-tbl.rtbl").on("click", ".btn-trigger", function(evt) {
    evt.stopPropagation();
    var targetEl = $(this).closest(".use_button");
    targetEl.next(".menu").toggleClass("invisible");
    console.log(targetEl.offset().left);
    console.log(targetEl.position().left);
    console.log($(document).width());
    // $(".menu-use").css({"right": $(document).width() - targetEl.position().left - targetEl.width()});
  });

  $("body").on("click", ".modal_close, .btn-cancel, .new_guided_modal", function(evt) {
    // evt.stopPropagation();
    $(".ds-modal-background").addClass("invisible");
    // $(".modal-guided-forms").toggleClass("hide_modal");
    $(this).closest(".modal").addClass("hide_modal");
  });
  $("body").on("click", ".new_guided_modal", function(evt) {
    // evt.stopPropagation();
    $(".ds-modal-background").removeClass("invisible");
    $(".modal-guided-forms").removeClass("hide_modal");
  });

  $("body").on("click", ".get_started", function(evt) {
    // evt.stopPropagation();
    // console.log("sta");
    showCallout(evt, $("#i9Button"));
  });
  $(".modal-guided-forms").on("click", ".row-clickable", function(evt) {
    // evt.stopPropagation();
    // console.log("sta");
    $(".row-clickable").removeClass("table_row-selected");
    $(this).addClass("table_row-selected");
  });

  $(".modal-intro").on("click", ".right_arrow", function(evt) {
    // evt.stopPropagation();
    // console.log("sta");
    $(".swipe-dots button").removeClass("selected");

    if($(".modal-intro .slick-div").hasClass("step-1")) {
      $(".modal-intro .slick-div").removeClass("step-1 step-2 step-3 step-4");
      $(".modal-intro .slick-div").addClass("step-2");

      transitionText($(".modal-intro .modal_title"), "Scan your Template");
      transitionText($(".modal-intro .modal_title + p"), "We will scan your document and identify all your fields, user roles and conditional logic.");
      // $(".modal-intro .modal_title").text("Scan your Template");
      // $(".modal-intro .modal_title + p").text("We will scan your document and identify all your fields, user roles and conditional logic.");

      $(".swipe-dots button.step-2").addClass("selected");
      $(".nav_arrow.left_arrow").removeClass("hide");
    } else if($(".modal-intro .slick-div").hasClass("step-2")) {
      $(".modal-intro .slick-div").removeClass("step-1 step-2 step-3 step-4");
      $(".modal-intro .slick-div").addClass("step-3");

      transitionText($(".modal-intro .modal_title"), "Create Sections");
      transitionText($(".modal-intro .modal_title + p"), "Your form is then broken out into sections. Edit your sections to help your user complete your form faster.");
      // $(".modal-intro .modal_title").text("Create Sections");
      // $(".modal-intro .modal_title + p").text("Your form is then broken out into sections. Edit your sections to help your user complete your form faster.");

      $(".swipe-dots button.step-3").addClass("selected");
    } else if($(".modal-intro .slick-div").hasClass("step-3")) {
      $(".modal-intro .slick-div").removeClass("step-1 step-2 step-3 step-4");
      $(".modal-intro .slick-div").addClass("step-4");

      transitionText($(".modal-intro .modal_title"), "Preview on any device");
      transitionText($(".modal-intro .modal_title + p"), "Users can fill out your forms more quickly on any device. Get started below.");
      // $(".modal-intro .modal_title").text("Preview on any device");
      // $(".modal-intro .modal_title + p").text("Users can fill out your forms more quickly on any device. Get started below.");

      $(".swipe-dots button.step-4").addClass("selected");
      $(".nav_arrow.right_arrow").addClass("hide");
    }
    // $(".modal-intro .slick-div").addClass("step-2");
  });
  $(".modal-intro").on("click", ".left_arrow", function(evt) {
    // evt.stopPropagation();
    // console.log("sta");
    $(".swipe-dots button").removeClass("selected");

    if($(".modal-intro .slick-div").hasClass("step-4")) {
      $(".modal-intro .slick-div").removeClass("step-1 step-2 step-3 step-4");
      $(".modal-intro .slick-div").addClass("step-3");

      $(".modal-intro .modal_title").text("Create Sections");
      $(".modal-intro .modal_title + p").text("Your form is then broken out into sections. Edit your sections to help your user complete your form faster.");
      $(".swipe-dots button.step-3").addClass("selected");
      $(".nav_arrow.right_arrow").removeClass("hide");
    } else if($(".modal-intro .slick-div").hasClass("step-3")) {
      $(".modal-intro .slick-div").removeClass("step-1 step-2 step-3 step-4");
      $(".modal-intro .slick-div").addClass("step-2");

      $(".modal-intro .modal_title").text("Scan your Template");
      $(".modal-intro .modal_title + p").text("We will scan your document and identify all your fields, user roles and conditional logic.");

      $(".swipe-dots button.step-2").addClass("selected");
    } else if($(".modal-intro .slick-div").hasClass("step-2")) {
      $(".modal-intro .slick-div").removeClass("step-1 step-2 step-3 step-4");
      $(".modal-intro .slick-div").addClass("step-1");

      $(".modal-intro .modal_title").text("Create a Guided Form for any Template");
      $(".modal-intro .modal_title + p").text("Help your signers fill out your templates faster with a step-by-step experience on any device.");

      $(".swipe-dots button.step-1").addClass("selected");
      $(".nav_arrow.left_arrow").addClass("hide");
    }
    // $(".modal-intro .slick-div").addClass("step-2");
  });
});

function transitionText(target, newText) {
  target.addClass("fadeOut");
  setTimeout(function() {
    target.text(newText);
  }, 175);
  setTimeout(function() {
    target.removeClass("fadeOut");
  }, 350);
}

function intro() {
  // console.log("intro");

  setTimeout(function() {
    $(".ds-modal-background").removeClass("invisible");
    $(".modal-intro").removeClass("hide_modal");
  }, 1000);
  setTimeout(function() {
    $(".modal-intro .slick-div").addClass("step-1");
  }, 2000);
}
