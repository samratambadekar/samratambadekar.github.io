var selectCountry1 = localStorage.getItem("selectCountry1");

$(document).ready(function() {
  checkCountrySelected();
  checkVideoSources();
  checkImageSources();

  if($(".learning_page video").length > 0) {
    console.log($(".learning_page video").length);
    $(".learning_page video")[0].play();
  }

  if(selectCountry1) {
    $(".selected_country").text(selectCountry1);

    // if(selectCountry1 == "United States") {
    //   $(".id_type_USA").removeClass("hide");
    // }
  }

  $("body").on("click", ".btn-continue", function(evt) {
    $(".form_unit").removeClass("form_unit-hasError form_unit-radioError");
    // window.location.replace("./id_auth1.html");
    // window.location.replace("./document.html");
    // window.location.replace("./auth_failed.html");
  });
  $("body").on("click", ".mobile_graphic_step1 .btn-continue", function(evt) {
    if($(window).width() <= 480) {
      evt.preventDefault();
      evt.stopPropagation();
      $(this).closest(".pre-sign-content").removeClass("mobile_graphic_step1").addClass("mobile_graphic_step2");
    }
  });
  $("body").on("click", ".btn-select-country", function(evt) {
    localStorage.setItem("selectCountry1", $("#selectCountry1").val());

    if($(this).hasClass("feature_unavailable")) {
      window.setTimeout(function() {
        showToastMessageOlive($(".message-error"), "Please select a country", isPersistent=false);
      },10);
    }
  });

  $("body").on("change", "#selectCountry1", function(evt) {
    checkCountrySelected();
  });

  $(window).on("resize", function(evt) {
    checkVideoSources();
    checkImageSources();
  });

  $(".camera_container_instructions").on("click", ".btn-next-step", function(evt) {
    var currentStepNum = parseInt($(this).closest(".pre-sign-content").attr("data-camera-container-step"));
    $(this).closest(".pre-sign-content").attr("data-camera-container-step", (currentStepNum+1));
    $(".camera_container_instructions video").click();
  });

  if($("body .camera_container").length > 0) {
    // start_image_stream();
    trackFace();
    enableTakePicture();
  }

  if($("body .frontImage").length > 0) {
    $("body .frontImage").each(function() {
      $(this).attr("src", localStorage.getItem("frontImage"));
    });
  }
  if($("body .backImage").length > 0) {
    $("body .backImage").each(function() {
      $(this).attr("src", localStorage.getItem("backImage"));
    });
  }

  if($("body .splash_page_verifying").length > 0) {
    window.setTimeout(function() {
      $("body .section-title h1").text("We're Verifying Your ID");
      $("body .verification_status").text("Don't close this window.")
    }, 1500);

    window.setTimeout(function() {
      $("body .section-title h1").text("Your ID Has Been Verified");
      $("body .verification_status").text("Redirecting to your document in 3 seconds...");
      $("body .page_instriction").addClass("hide");
      $("body .spinner-circle").addClass("hide");
      $("body .icon-circle-check").removeClass("hide");
    }, 3000);

    window.setTimeout(function() {
      $("body .verification_status").text("Redirecting to your document in 2 seconds...");
    }, 4000);
    window.setTimeout(function() {
      $("body .verification_status").text("Redirecting to your document in 1 second...");
    }, 5000);
    window.setTimeout(function() {
      window.location.replace("document.html");
    }, 5500);
  }


  $("body").on("click", ".camera_instructions_toggle", function(evt) {
    if($(this).hasClass("closed") && $(this).find(".accordion").hasClass("closed")) {
      $(this).removeClass("closed").find(".accordion").removeClass("closed");
      $(this).addClass("open").find(".accordion").addClass("open");
    } else {
      $(this).addClass("closed").find(".accordion").addClass("closed");
      $(this).removeClass("open").find(".accordion").removeClass("open");
    }
  });

  $("body").on("click", ".go_to_prev_page", function(evt) {
    evt.preventDefault();
    window.history.back();
  });
  $("body").on("click", "video", function(evt) {
    // console.log($(this).attr("loop"));
    if(this.paused) {
      this.play();
    }
  });

  $("body").on("click", ".retake_photo", function(evt) {
    currentStepNum = parseInt($(this).closest("[data-camera-container-step]").attr("data-camera-container-step"));
    $(this).closest("[data-camera-container-step]").attr("data-camera-container-step", currentStepNum - 1);
  });
});

function trackFace() {
  var video = $(".camera_container .video_container")[0];
  var canvas = $(".camera_container .canvas_container")[0];
  var context = canvas.getContext('2d');
  var tracker = new tracking.ObjectTracker('face');
  tracker.setInitialScale(4);
  tracker.setStepSize(2);
  tracker.setEdgesDensity(0.1);
  // tracking.track('#video', tracker, { camera: true });
  tracking.track('.video_container', tracker, { camera: true });
  // tracker.on('track', function(event) {
  //   context.clearRect(0, 0, canvas.width, canvas.height);
  //   $(".camera_container .container_middle").removeClass("cameraFocussed");
  //   event.data.forEach(function(rect) {
  //     context.strokeStyle = '#a64ceb';
  //     context.strokeRect(rect.x, rect.y, rect.width, rect.height);
  //     context.font = '11px Helvetica';
  //     context.fillStyle = "#fff";
  //     // context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
  //     // context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
  //     $(".camera_container .container_middle").addClass("cameraFocussed");
  //   });
  // });
  video.play();
}

function checkVideoSources() {
  // console.log($(document).width());
  if($(document).width() < 768) {
    if($(".video-graphic_id").attr("src") != "videos/mobile-id.mp4") {
      $(".video-graphic_id").attr("src", "videos/mobile-id.mp4");
    }
    if($(".video-graphic_passport").attr("src") != "videos/mobile-passport.mp4") {
      $(".video-graphic_passport").attr("src", "videos/mobile-passport.mp4");
    }

    if($(".sample_video_passport").attr("src") != "videos/mobile-passport.mp4") {
      $(".sample_video_passport").attr("src", "videos/mobile-passport.mp4");
    }
    if($(".sample_video_id_front").attr("src") != "videos/mobile-id-front.mp4") {
      $(".sample_video_id_front").attr("src", "videos/mobile-id-front.mp4");
    }
    if($(".sample_video_id_back").attr("src") != "videos/mobile-id-back.mp4") {
      $(".sample_video_id_back").attr("src", "videos/mobile-id-back.mp4");
    }

  } else {
    if($(".video-graphic_id").attr("src") != "videos/desktop-id.mp4") {
      $(".video-graphic_id").attr("src", "videos/desktop-id.mp4");
    }
    if($(".video-graphic_passport").attr("src") != "videos/desktop-passport.mp4") {
      $(".video-graphic_passport").attr("src", "videos/desktop-passport.mp4");
    }

    if($(".sample_video_passport").attr("src") != "videos/desktop-passport.mp4") {
      $(".sample_video_passport").attr("src", "videos/desktop-passport.mp4");
    }
    if($(".sample_video_id_front").attr("src") != "videos/desktop-id-front.mp4") {
      $(".sample_video_id_front").attr("src", "videos/desktop-id-front.mp4");
    }
    if($(".sample_video_id_back").attr("src") != "videos/desktop-id-back.mp4") {
      $(".sample_video_id_back").attr("src", "videos/desktop-id-back.mp4");
    }
  }
}

function checkCountrySelected() {
  if($("#selectCountry1").val() == "-1") {
    // $(".btn-select-country").addClass("feature_unavailable");
    $(".is_country_selected").addClass("hide");
  } else {
    // $(".btn-select-country").removeClass("feature_unavailable");
    $(".is_country_selected").removeClass("hide");
  }
}

function checkImageSources() {
  if($(document).width() < 481) {
    if($(".image-dont-graphic_id").attr("src") != "images/dont_id_mobile.png") {
      $(".image-dont-graphic_id").attr("src", "images/dont_id_mobile.png");
    }
    if($(".image-do-graphic_id").attr("src") != "images/do_id_mobile.png") {
      $(".image-do-graphic_id").attr("src", "images/do_id_mobile.png");
    }

    if($(".image-dont-graphic_passport").attr("src") != "images/dont_passport_mobile.png") {
      $(".image-dont-graphic_passport").attr("src", "images/dont_passport_mobile.png");
    }
    if($(".image-do-graphic_passport").attr("src") != "images/do_passport_mobile.png") {
      $(".image-do-graphic_passport").attr("src", "images/do_passport_mobile.png");
    }


    if($(".sample_image_passport").attr("src") != "images/example_passport_mobile.png") {
      $(".sample_image_passport").attr("src", "images/example_passport_mobile.png");
    }
    if($(".sample_image_front_id").attr("src") != "images/example_id_front_mobile.png") {
      $(".sample_image_front_id").attr("src", "images/example_id_front_mobile.png");
    }
    if($(".sample_image_back_id").attr("src") != "images/example_id_back_mobile.png") {
      $(".sample_image_back_id").attr("src", "images/example_id_back_mobile.png");
    }
  } else {
    if($(".image-dont-graphic_id").attr("src") != "images/dont_id.png") {
      $(".image-dont-graphic_id").attr("src", "images/dont_id.png");
    }
    if($(".image-do-graphic_id").attr("src") != "images/do_id.png") {
      $(".image-do-graphic_id").attr("src", "images/do_id.png");
    }
    if($(".image-dont-graphic_passport").attr("src") != "images/dont_passport.png") {
      $(".image-dont-graphic_passport").attr("src", "images/dont_passport.png");
    }
    if($(".image-do-graphic_passport").attr("src") != "images/do_passport.png") {
      $(".image-do-graphic_passport").attr("src", "images/do_passport.png");
    }


    if($(".sample_image_passport").attr("src") != "images/example_passport.png") {
      $(".sample_image_passport").attr("src", "images/example_passport.png");
    }
    if($(".sample_image_front_id").attr("src") != "images/example_id_front.png") {
      $(".sample_image_front_id").attr("src", "images/example_id_front.png");
    }
    if($(".sample_image_back_id").attr("src") != "images/example_id_back.png") {
      $(".sample_image_back_id").attr("src", "images/example_id_back.png");
    }
  }
}
