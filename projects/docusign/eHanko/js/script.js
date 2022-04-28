$("img.stamp_here").click(function() {
  $(".adopt_stamp").css({opacity:1,top:"0%",height:"100%"});
  $("body").css("overflow", "hidden");
  window.location.href = "#";
});
$(".close_icon").click(function() {
  $(this).closest(".overlay").css({opacity:0, top:"100%",height:0});
  $("body").css("overflow", "scroll");
});
$("#take_picture3, #take_picture2, #browse_picture").click(function() {
  $("#take_picture1").click();
  loadPicture();
});
$("#upload_button").click(function() {
  if($("#upload_button").text().trim() == "UPLOAD IMAGE" || $("#upload_button").text().trim() == "画像を取得") {
    $(this).parent().find(".overlay").css({opacity:1,top:0,height:"100%"});
    $("#take_picture1").click();
    loadPicture();
  } else if($("#upload_button").text().trim() == "NEXT" || $("#upload_button").text().trim() == "次へ") {
    newPictureCroppie.result({
				type: 'canvas',
				size: 'viewport',
        format: 'png'
			}).then(function (resp) {
				$(".show_picture").attr("src", resp);
				$(".show_picture").css("height", "97px");


				$(".stamp_id").css("height", "140px");
				$(".stamp_info_text").css("display", "block");
        $(".new_picture").css("display","none");
        // $("#upload_button").text("ADOPT");
        if($("#upload_button").text().trim() == "次へ") {
          $("#upload_button").text("採用");
        } else if($("#upload_button").text().trim() == "NEXT") {
          $("#upload_button").text("ADOPT");
        }

        if($(window).innerWidth() < 481) {
          $("#upload_button, #back_button").css("width", "50%");
        }

        $(".adopt_stamp .sub_header").css("display","none");
        $("#take_picture3").css("display","none");

        if($("#cancel_button").text().trim() == "キャンセル") {
          $("#cancel_button").text("次へ");
        } else {
          $("#cancel_button").text("BACK");
        }
			});
  } else if($("#upload_button").text().trim() == "ADOPT" || $("#upload_button").text().trim() == "採用") {
    $("img.stamp_here").css("display", "none");
    $("div.stamp_here").css("display", "block");
    $(".close_icon").click();

    $('html, body').animate({scrollTop: 1000});
    $("#bottom_nav").removeClass("hidden");
    $("#top_nav").addClass("hidden");
    $("#bookmark").addClass("hidden");
  }
});

$("#back_button, #cancel_button").click(function() {
  if($(window).innerWidth() < 481) {
    $("#upload_button").css("width", "100%");
    $("#back_button").css("width", "0");
  }

  // $("#upload_button").text("NEXT");
  if($("#upload_button").text().trim() == "採用") {
    $("#upload_button").text("次へ");
  } else if($("#upload_button").text().trim() == "ADOPT") {
    $("#upload_button").text("NEXT");
  }

  $(".show_picture").css("height", "0px");
  $(".stamp_id").css("height", "0px");
  $(".new_picture").css("display","block");

  if(isTaken) {
    $(".adopt_stamp .sub_header").css("display","block");
    $("#take_picture3").css("display","block");
    // $("#cancel_button").text("CANCEL");
    if($("#cancel_button").text().trim() == "次へ") {
      $("#cancel_button").text("キャンセル");
    } else {
      $("#cancel_button").text("CANCEL");
    }
  }
});

var newPictureCroppie,
    isTaken = false;

function loadPicture(newURL) {
    var takePicture = document.querySelector("#take_picture1"),
        showPicture = document.querySelector(".show_picture");

    if (takePicture && !newURL) {
        // Set events
        takePicture.onchange = function (event) {
            // Get a reference to the taken picture or chosen file
            var files = event.target.files,
                file;
            if (files && files.length > 0) {
                file = files[0];
                try {
                    // Create ObjectURL
                    imgURL = window.URL.createObjectURL(file);

                    // Set img src to ObjectURL
                    // showPicture.src = imgURL;

                    // Revoke ObjectURL
                    // URL.revokeObjectURL(imgURL);
                    //     console.log(imgURL);
                    isTaken = true;
                    processPicture();

                }
                catch (e) {
                    try {
                        // Fallback if createObjectURL is not supported
                        var fileReader = new FileReader();
                        fileReader.onload = function (event) {
                            showPicture.src = event.target.result;
                        };
                        fileReader.readAsDataURL(file);
                        isTaken = true;
                    }
                    catch (e) {
                        //
                        var error = document.querySelector("#error");
                        if (error) {
                            error.innerHTML = "Neither createObjectURL or FileReader are supported";
                        }
                    }
                }


                // if(isTaken) {
                //   $(".new_picture").css("display","block");
                //   $(".existing_stamps,.instructions").css("display","none");
                //   $(".adopt_stamp .sub_header").css("display","block");
                //   // $(".show_picture").panzoom();
                //   var boundaryWidth = $(this).parent().width();
                //   var boundaryHeight = $(this).parent().height() - 150;
                //   // var vpWidthHeight = $(this).parent().width() * 0.4;
                //   var vpWidthHeight = 150;
                //   // var vpHeight = $(window).height();
                //   if(!newPictureCroppie) {
                //     newPictureCroppie = new Croppie(document.getElementsByClassName("new_picture")[0], {
                //         enableExif: true,
                //         enableOrientation: true,
                //         viewport: {
                //             width: vpWidthHeight,
                //             height: vpWidthHeight,
                //             type: 'circle'
                //         },
                //         boundary: { width: boundaryWidth, height: boundaryHeight },
                //
                //         showZoomer: true
                //     });
                //   }
                //   newPictureCroppie.bind({
                //     // url: "images/stamp_1.png",
                //     url: imgURL,
                //     orientation: 6,
                //     points: [0,0,0,0]
                //   });
                //   newPictureCroppie.setZoom(.5);
                //   // $(".cr-image").css("width", "100%");
                //   $(".adopt_stamp .cancel_button").click();
                //   console.log($("#upload_button").text());
                //   if($("#upload_button").text().trim() == "画像を取得") {
                //     $("#upload_button").text("次へ");
                //   } else if($("#upload_button").text().trim() == "UPLOAD IMAGE") {
                //     $("#upload_button").text("NEXT");
                //   }
                // }
            }
        }
        // newPictureCroppie.rotate(90);

    } else if(newURL) {
      imgURL = newURL;
      isTaken = true;
      processPicture();
    }
}

function processPicture() {
  // if(isTaken) {
    $("#upload_button").removeClass("disabled");
    $("#dropbox").css("display", "none");
    if($("#take_picture3").text().trim() == "画像を取得") {
      $("#take_picture3").text("画像の変更");
    } else if($("#take_picture3").text().trim() == "UPLOAD IMAGE") {
      $("#take_picture3").text("CHANGE IMAGE");
    }

    $(".new_picture").css("display","block");
    $(".existing_stamps,.instructions").css("display","none");
    $(".adopt_stamp .sub_header").css("display","block");
    // $(".show_picture").panzoom();
    // var boundaryWidth = $(this).parent().width();
    // var boundaryHeight = $(this).parent().height() - 150;
    // var vpWidthHeight = $(this).parent().width() * 0.4;
    var boundaryWidth = 350;
    var boundaryHeight = 350;
    if($(window).innerWidth() < 481) {
      boundaryWidth = $(window).innerWidth();
      boundaryHeight = $(window).innerHeight() - 150;
    }
    var vpWidthHeight = 200;
    // var vpHeight = $(window).height();
    if(!newPictureCroppie) {
      if($(window).innerWidth() < 481) {
        newPictureCroppie = new Croppie(document.getElementsByClassName("new_picture")[0], {
            enableExif: true,
            enableOrientation: true,
            viewport: {
                width: vpWidthHeight,
                height: vpWidthHeight,
                type: 'circle'
            },
            boundary: { width: boundaryWidth, height: boundaryHeight },
            showZoomer: true
        });
      } else {
        newPictureCroppie = new Croppie(document.getElementsByClassName("new_picture")[0], {
            enableExif: true,
            // enableOrientation: true,
            viewport: {
                width: vpWidthHeight,
                height: vpWidthHeight,
                type: 'circle'
            },
            boundary: { width: boundaryWidth, height: boundaryHeight },
            showZoomer: true
        });
      }
    }

    if($(window).innerWidth() < 481) {
      newPictureCroppie.bind({
        // url: "images/stamp_1.png",
        url: imgURL,
        orientation: 6,
        points: [100,100,0,0]
      });
      newPictureCroppie.setZoom(0.1);
      // $("div.cr-overlay").css({width: "100%"});
      $("canvas.cr-image").css({"margin-top" : "-20%"});
      // $("canvas.cr-image").css({"transform": "translateX(-72.826px)"});
    } else {
      newPictureCroppie.bind({
        // url: "images/stamp_1.png",
        url: imgURL,
        // orientation: 6,
        points: [100,200,300,400]
      });
      // newPictureCroppie.setZoom(0.5);
    }

    // $(".cr-image").css("width", "100%");
    $(".adopt_stamp .cancel_button").click();

    if($("#upload_button").text().trim() == "画像を取得" ||
    $("#upload_button").text().trim() == "次へ") {
      $("#upload_button").text("次へ");
    } else {
      $("#upload_button").text("NEXT");
    }

    // Caman(".cr-image", function () {
    //   this.brightness(10);
    //   this.contrast(50);
    //   // this.sepia(70);
    //   this.saturation(-10);
    //   this.opacity(100);
    //   this.resize({
    //     width: "auto",
    //     height: "auto"
    //   });
    //   this.render();
    // });


  // }
}

$("#rotate_image").click(function() {
  newPictureCroppie.rotate(-90);
});

$("#crop_shape").click(function() {
  if(newPictureCroppie.options.viewport.type === "circle") {
    $(".new_picture .cr-vp-circle").css("border-radius", "10px");
    newPictureCroppie.options.viewport.type = "square";
    $("#crop_shape>img").attr("src", "images/Icons/mask_square.png");
  } else {
    $(".new_picture .cr-vp-circle").css("border-radius", "50%");
    newPictureCroppie.options.viewport.type = "circle";
    $("#crop_shape>img").attr("src", "images/Icons/mask_round.png");
  }
});

$(window).on("load resize", function() {
  // console.log("ding ding");
  if($(window).innerWidth() > 480) {
    // $(".croppie-container .cr-boundary").css({"max-width": "100%", "max-height": "100%"});
    // if(isTaken) {
      // if($("#upload_button").text().trim() == "UPLOAD IMAGE") {
      //   $("#upload_button").text("NEXT");
      // }
      if($("#upload_button").text().trim() == "画像を取得") {
        $("#upload_button").text("次へ");
      } else if($("#upload_button").text().trim() == "UPLOAD IMAGE") {
        $("#upload_button").text("NEXT");
      }
      // $("#bookmark").css("top", parseInt($(".stamp_here").css("top")) + $(".stamp_here").height()/3);

      $(".existing_stamps").attr("src", "images/desk_no_stamps.png");
    // }
  } else {
      if($("#upload_button").text().trim() == "次へ" && !isTaken) {
        $("#upload_button").text("画像を取得");
      } else if($("#upload_button").text().trim() == "NEXT" && !isTaken) {
        $("#upload_button").text("UPLOAD IMAGE");
      }

      $(".existing_stamps").attr("src", "images/no_stamps.png");

      $("#upload_button").removeClass("disabled");
  }
  // $('html, body').animate({scrollTop: 1000});
});

$(document).keyup(function(e) {
  e.stopPropagation();
  e.preventDefault();
  if (e.keyCode === 27) $('.close_icon').click();   // esc
});

var dropbox = document.getElementById('dropbox');

dropbox.addEventListener('dragenter', dragIn, false);
dropbox.addEventListener('dragexit', dragOut, false);
dropbox.addEventListener('dragover', noopHandler, false);
dropbox.addEventListener('drop', drop, false);

function noopHandler(evt) {
    evt.stopPropagation();
    evt.preventDefault();
}
function dragIn(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    console.log(evt.target);
    $("#dropbox").css({"border": "2px dashed #D00", "opacity": "0.5"});
    // $(this).target.attr("style", "border: 1px dashed #800")
}
function dragOut(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    clearBorder();
}
function clearBorder() {
  $("#dropbox").css({"border": "0px dashed transparent", "opacity": "1"});
}
function drop(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    loadPicture(window.URL.createObjectURL(evt.dataTransfer.files[0]));
    clearBorder();
}

$("body").on("touchend click", ".cr-boundary", function() {
  window.setTimeout(function() {
    $(".text_overlay").css("display", "none");
  }, 5000);
});

$("#bookmark").click(function() {
});
$("#bookmark, #start_button").click(function() {
  if($(this).text().trim() == "スタート") {
    $(this).text("捺印")
  }
  if($(this).text().trim() == "Start") {
    $(this).text("Stamp")
  }

  $('html, body').animate({scrollTop: 1000});
  $('img.stamp_here').addClass("blink");
  $("#bookmark").css("top", parseInt($(".stamp_here").css("top")) + $(".stamp_here").height()/3);
  window.setTimeout(function() {
    $('img.stamp_here').removeClass("blink");
  }, 1000);
});


// $("#take_picture1").on("keyup", function(e) {
//
//   if (e.keyCode === 27) {
//     if (e.keyCode === 27) this.blur(), e.stopPropagation();
//   }
// });
