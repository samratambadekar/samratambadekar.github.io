var data;
$.getJSON("./data/data.json", function(json) {
  data = json;
}).done(function() {
  setBarHeights('y2017');
});

function loadData_XLS() {
  /* set up XMLHttpRequest */
  var url = "data/data_latest.xls";
  var oReq = new XMLHttpRequest();
  oReq.open("GET", url, true);
  oReq.responseType = "arraybuffer";

  oReq.onload = function(e) {
    var arraybuffer = oReq.response;

    /* convert data to binary string */
    var data = new Uint8Array(arraybuffer);
    var arr = new Array();
    for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");

    /* Call XLSX */
    var workbook = XLSX.read(bstr, {type:"binary"});

    var sheetName = workbook.SheetNames[0];
    var result_json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    // console.log(workbook.SheetNames[0]);
    // console.log(result_json);
    if (result_json.length > 0) {
      for(var ii = 0; ii < result_json.length; ii++) {
        if(result_json[ii].FY) {
          console.log(result_json[ii].FY.replace(/,/g, ''));
          console.log(result_json[ii].Month);
          console.log(parseInt(result_json[ii].Target.replace(/,/g, ''), 10));
          console.log(parseInt(result_json[ii].Total.replace(/,/g, ''), 10));
        }
      }
        // result = result_json;
    }
    /* DO SOMETHING WITH workbook HERE */
  }

  oReq.send();
}

$(document).ready(function() {
  loadData_XLS();

  if(localStorage.getItem("textInputEmail1") && localStorage.getItem("textInputEmail1").length > 0) {
    $("#textInputEmail1").val(localStorage.getItem("textInputEmail1"));
  }
  if(localStorage.getItem("textInputEmail2") && localStorage.getItem("textInputEmail2").length > 0) {
    $("#textInputEmail2").val(localStorage.getItem("textInputEmail2"));
  }

  var date = new Date("August 01, 2017 12:00:00");
  var now = new Date();
  var diff = (date.getTime()/1000) - (now.getTime()/1000);
  // console.log(diff);

  var clock = $('.flip-countdown').FlipClock(diff, {
    clockFace: 'DailyCounter',
    countdown: true,
    // showSeconds: false,
    // autoStart: false,
  });

  // setTimeout(function() {
  //   clock.setTime(diff);
  //   clock.start();
  // }, 1000);
  setTimeout(function() {
    zoomIntoRaceView(true);
    $("#toggle_button").prop("checked", false);
    $(".infographic").addClass("race_view");
    $(".doc-e-block").removeClass("scaleDown");
  }, 1000);


  $("#toggle_button").on("change", function() {
    if($(this).prop("checked")) {
      $(".toggle_view .race_view").removeClass("selected");
      $(".toggle_view .chart_view").addClass("selected");
      $(".infographic").addClass("chart_view").removeClass("race_view");
      zoomIntoRaceView(false);
      $("#gabe_song")[0].pause();
    } else {
      $(".toggle_view .chart_view").removeClass("selected");
      $(".toggle_view .race_view").addClass("selected");
      $(".infographic").removeClass("chart_view").addClass("race_view");

      // $(".menu.years .year_option[data-year='y2017']").click();
      $(".filters .year > span").text("2017");
      setBarHeights('y2017');
      zoomIntoRaceView(true);
      $("#gabe_song")[0].play();
    }
  });

  $(".filters").on("click", ".year", function(evt) {
    evt.stopPropagation();
    $(this).find(".menu.years").toggleClass("hide");
  });
  $(".menu.years").on("click", ".year_option", function(evt) {
    evt.stopPropagation();
    $(this).closest(".menu.years").addClass("hide");
    $(this).closest(".year").find("span").text($(this).text().trim());
    setBarHeights($(this).attr("data-year").trim());

    zoomIntoRaceView(false);
    $("#toggle_button").prop("checked", true);
    $(".infographic").removeClass("race_view").addClass("chart_view");
    $("#gabe_song")[0].pause();
  });

  $("body").on("click", ".support_doc-e", function() {
    $(".modal_background").removeClass("hide");
    $(".modal_support_doc-e").removeClass("hideDown");
  });
  $("body").on("click", ".show_modal_raffle", function() {
    $(".modal_background").removeClass("hide");
    $(".modal_raffle").removeClass("hideDown");
  });
  $("body").on("click", ".modal_close", function() {
    $(this).closest(".modal_background").addClass("hide");
    $(this).closest(".modal").addClass("hideDown");
  });
  $(".modal_support_doc-e").on("click", ".send_feedback", function() {
    // $(this).closest(".modal_background").addClass("hide");
    var _this = this;
    $(_this).closest(".modal").addClass("hideDown");
    $(_this).closest(".modal_background").find(".thankYou").removeClass("hideDown");
    localStorage.setItem("textInputEmail1", $("#textInputEmail1").val());

    setTimeout(function() {
      if(!$(_this).closest(".modal_background").find(".thankYou").hasClass("hideDown")) {
        $(_this).closest(".modal_background").find(".thankYou").find(".modal_close").click();
      }
    }, 5000);
  });
  $(".modal_raffle").on("click", ".submit_raffle", function() {
    // $(this).closest(".modal_background").addClass("hide");
    $(this).closest(".modal").find(".pre_raffle_submit").addClass("hidden");
    $(this).closest(".modal").find(".post_raffle_submit").removeClass("hidden");
    localStorage.setItem("textInputEmail2", $("#textInputEmail2").val());
  });

  $("body").on("click", ".volume_mute", function() {
    if($("#gabe_song").prop("muted")) {
      $("#gabe_song").prop("muted", false);
      $(".volume_mute").addClass("on");
    } else {
      $("#gabe_song").prop("muted", true);
      $(".volume_mute").removeClass("on");
    }
  });

});

function setBarHeights(newYear) {
  var months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
  var selectedYear = newYear;
  var targetArray = [];
  var totalTargetAmount = 0, totalResultAmount = 0;
  var maxBarHeight = 0;

  months.forEach(function(elem) {
    targetArray.push(data[selectedYear][elem].target);
    // resultArray.push(data[selectedYear][elem].result);
  });
  maxBarHeight = Math.max.apply(null, targetArray);

  months.forEach(function(elem) {
    totalTargetAmount += data[selectedYear][elem].target;
    totalResultAmount += data[selectedYear][elem].result;
    $(".month_block .month[data-month-name='" + elem + "']").next(".bar_chart").height((data[selectedYear][elem].target/maxBarHeight) * $(".infographic").height());

    $(".month_block .month[data-month-name='" + elem + "']").next(".bar_chart").find(".bar_chart_filled").height((data[selectedYear][elem].result/maxBarHeight) * $(".infographic").height());

    // console.log(Math.floor((data[selectedYear][elem].result/data[selectedYear][elem].target) * 100));
    var targetEl = $(".month_block .month[data-month-name='" + elem + "']").closest(".month_block");
    var percentCompletion = Math.floor((data[selectedYear][elem].result/data[selectedYear][elem].target) * 100);
    // console.log(percentCompletion);
    targetEl.find(".completed").text(percentCompletion + "%").css("top", -((percentCompletion<100)?(data[selectedYear][elem].target/maxBarHeight):(data[selectedYear][elem].result/maxBarHeight)) * $(".infographic").height());

    targetEl.removeClass("under_target incomplete unavailable");
    if(data[selectedYear][elem].result == 0) {
      targetEl.addClass("unavailable");
    } else if (percentCompletion < 75) {
      targetEl.addClass("incomplete");
    } else if (percentCompletion < 100) {
      targetEl.addClass("under_target");
    }
  });
  if(!$(".month_block").hasClass("incomplete")) {
    $(".month_block").last().addClass("incomplete");
  }

  $(".xAxis .xAxis_filled").width((totalResultAmount/totalTargetAmount) * $(".xAxis").width());
  $(".filters .completion .percentage").text(Math.floor((totalResultAmount/totalTargetAmount) * 100) + "%");
}

function zoomIntoRaceView(isTrue) {
  if(isTrue) {
    // console.log($(".month_block.incomplete").position().left);
    // console.log($(".month_block.incomplete").offset().left);
    // console.log($(".infographic").width());
    $(".month_block.incomplete").nextAll(".month_block").addClass("hide").css("transform", 'translateX(' + ($(".infographic").width() - $(".month_block.incomplete").position().left) + 180 + 'px)');
    $(".month_block.incomplete").css("transform", 'translateX(' + ($(".infographic").width() - $(".month_block.incomplete").position().left - 110) + 'px)');

    $(".month_block.incomplete").prevAll(".month_block").addClass("hide").css("transform", 'translateX(' + (-$(".month_block.incomplete").position().left + 180) + 'px)');

    $(".month_block.incomplete").prev(".month_block").removeClass("hide");
  } else {
    $(".month_block").removeClass("hide move_left move_right").css("transform", 'translateX(0px');
  }

}
