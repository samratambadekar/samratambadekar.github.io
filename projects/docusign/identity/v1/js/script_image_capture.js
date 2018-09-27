var enableTakePicture = function() {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 640;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;

  function startup() {
    video = $(".camera_container .video_container")[0];
    canvas = $(".camera_container .canvas_container")[0];
    photo = $(".camera_container .photo_container")[0];
    // startbutton = $(".camera_container .btn-takepicture")[0];
    startbutton = $(".camera_container .btn-takepicture");

   //  navigator.getMedia = ( navigator.getUserMedia ||
   //                         navigator.webkitGetUserMedia ||
   //                         navigator.mozGetUserMedia ||
   //                         navigator.msGetUserMedia);
   //
   // var cameraId;
   // // navigator.mediaDevices.enumerateDevices()
   // //  .then(devices => {
   // //    var videoDevices = [0,0];
   // //    var videoDeviceIndex = 0;
   // //    devices.forEach(function(device) {
   // //    // console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
   // //      if (device.kind == "videoinput") {
   // //        videoDevices[videoDeviceIndex++] =  device.deviceId;
   // //        // console.log(device.deviceId);
   // //        $("body .section-title").append("<div>" + device.deviceId + "</div>");
   // //      }
   // //    });
   // //    cameraId = videoDevices[videoDevices.length-1];
   // //    // console.log(cameraId);
   // //    // $("body .section-title").append("<div>" + cameraId + "</div>");
   // //    // $("body .section-title").text(videoDevices.length);
   // //  });
   // //    navigator.getMedia(
   // //      {
   // //        // video: { facingMode: "environment" },
   // //        video: { deviceId: { exact: cameraId  } },
   // //        // video: { facingMode: { exact: "environment" } },
   // //        audio: false
   // //      },
   // //      function(stream) {
   // //        // if (navigator.mozGetUserMedia) {
   // //        if (navigator.mozGetUserMedia) {
   // //          video.mozSrcObject = stream;
   // //        } else {
   // //          var vendorURL = window.URL || window.webkitURL;
   // //          // video.src = vendorURL.createObjectURL(stream);
   // //          video.srcObject = stream;
   // //        }
   // //        video.play();
   // //      },
   // //      function(err) {
   // //        console.log(err);
   // //        if(err.name == "NotAllowedError") {
   // //          // requestCameraAccess();
   // //        }
   // //      }
   // //    );
   //
   //    navigator.mediaDevices.enumerateDevices()
   //    .then(gotDevices).then(getStream).catch(handleError);
   //
   //      function gotDevices(deviceInfos) {
   //        for (var i = 0; i !== deviceInfos.length; ++i) {
   //          var deviceInfo = deviceInfos[i];
   //          var option = deviceInfo.deviceId;
   //          if (deviceInfo.kind === 'videoinput') {
   //            cameraId = deviceInfo.deviceId;
   //            if (navigator.mozGetUserMedia) {
   //              cameraId = deviceInfos[0].deviceId;
   //              // $("body .section-title").append("<div>" + deviceInfos[0] + "</div>");
   //            }
   //          }
   //        }
   //      }
   //
   //      function getStream() {
   //        if (window.stream) {
   //          window.stream.getTracks().forEach(function(track) {
   //            track.stop();
   //          });
   //        }
   //
   //        var constraints = {
   //          audio: false,
   //          video: {
   //            deviceId: {exact: cameraId}
   //          }
   //        };
   //
   //        navigator.mediaDevices.getUserMedia(constraints).
   //          then(gotStream).catch(handleError);
   //      }
   //
   //    function gotStream(stream) {
   //      window.stream = stream; // make stream available to console
   //      video.srcObject = stream;
   //      video.play();
   //    }
   //
   //    function handleError(error) {
   //      console.log('Error: ', error);
   //    }

    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);

        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.

        if (isNaN(height)) {
          height = width / (4/3);
        }

        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    // startbutton.addEventListener('click', function(ev){
    //   takepicture(ev);
    //   ev.preventDefault();
    // }, false);
    startbutton.on('click', function(ev) {
      takepicture(ev);
      ev.preventDefault();
    });

    clearphoto();
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }

  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture(evt) {
    var context = canvas.getContext('2d');
    if (width && height) {

      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
      // var trimLeft = $(".camera_container .guiding_rectangle").position().left;
      // var trimTop = $(".camera_container .guiding_rectangle").position().top;
      // var trimWidth = ($(".camera_container .guiding_rectangle").width());
      // var trimHeight = ($(".camera_container .guiding_rectangle").height());
      // context.drawImage(video, trimLeft, trimTop, trimWidth, trimHeight);

      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
      // console.log(data);
      // console.log($(evt.target).closest(".id_verify_buttons").attr("data-camera-container-step-visible") == 6);
      if($(evt.target).closest(".id_verify_buttons").hasClass("frontImageMode")) {
        localStorage.setItem("frontImage", data);
      }
      if($(evt.target).closest(".id_verify_buttons").hasClass("backImageMode")) {
        localStorage.setItem("backImage", data);
      }
    } else {
      clearphoto();
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  // window.addEventListener('load', startup, false);
  startup();
}
