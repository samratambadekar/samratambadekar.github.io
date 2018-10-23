$(document).ready(function() {
  $("body").on("click", ".btn-continue", function(evt) {
    $(".form_unit").removeClass("form_unit-hasError form_unit-radioError");
    // window.location.replace("./id_auth1.html");
    // window.location.replace("./document.html");
    // window.location.replace("./auth_failed.html");
  });

  $(".camera_container_instructions").on("click", ".btn-next-step", function(evt) {
    var currentStepNum = parseInt($(this).closest(".camera_container_instructions").attr("data-camera-container-step"));
    $(this).closest(".camera_container_instructions").attr("data-camera-container-step", (currentStepNum+1));
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
      $("body .verification_status").text("Verifying your ID")
    }, 1500);

    window.setTimeout(function() {
      $("body .section-title h1").text("ID Verification Complete");
      $("body .verification_status").text("Redirecting to your document");
      $("body .page_instriction").addClass("hide");
      $("body .spinner-circle").addClass("hide");
      $("body .icon-circle-check").removeClass("hide");
    }, 3000);

    window.setTimeout(function() {
      window.location.replace("document.html");
    }, 4500);
  }
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
  tracker.on('track', function(event) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    $(".camera_container .container_middle").removeClass("cameraFocussed");
    event.data.forEach(function(rect) {
      context.strokeStyle = '#a64ceb';
      context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      context.font = '11px Helvetica';
      context.fillStyle = "#fff";
      // context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
      // context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
      $(".camera_container .container_middle").addClass("cameraFocussed");
    });
  });
  video.play();
  // var gui = new dat.GUI();
  // gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
  // gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
  // gui.add(tracker, 'stepSize', 1, 5).step(0.1);
}
