var dateTimeInterval;
$(document).ready(function() {
  document.addEventListener('touchmove', function (event) {
    if (event.scale !== 1) {
      event.preventDefault();
      event.scale = 1;
    }
  }, { passive: false });

  initDateTime();
  dateTimeInterval = setInterval(() => {
    initDateTime();
  }, 10000);

  $("#feed_page").load("feed.html");

  // showFeedPage();
  // setTimeout(() => {
  //   $(".button-comment").first().click();
  //   $(".comment_input").focus();
  // }, 300);

  setTimeout(() => {
    // $(".status_bar").css("transform", "translateY(-55px)");
  //   $(".lock_screen").closest("html").scrollTop(250).css("overflow", "hidden");
  },0);

  // $(document).on("touchstart, touchmove", function(evt) {
  //   evt.preventDefault();
  // });

  $("body").on("click", ".lock_screen", function(evt) {
    $(".notification").addClass("show");
  });
  $("body").on("click", ".notification", showFeedPage);
});

function initDateTime() {
  let date = new Date();
  // let date = new Date(2018, 11, 24, 12, 33, 30, 0);
  let currentHour = date.getHours() % 12;
  if(currentHour === 0) {
    currentHour = 12;
  }
  $(".clock .current_hour").text(currentHour);
  $(".clock .current_minutes").text(date.getMinutes()>9?date.getMinutes():`0${date.getMinutes()}`);

  $(".clock .current_day_of_week").text(getDayOfWeek(date));
  $(".clock .current_month").text(getMonthOfYear(date));
  $(".clock .current_date").text(date.getDate());
}
function getDayOfWeek(date) {
  var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return weekdays[date.getDay()];
}
function getMonthOfYear(date) {
  const monthNames = ["January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  return monthNames[date.getMonth()];
}

function showFeedPage(evt) {
  if(evt) {
    // evt.preventDefault();
    evt.stopPropagation();
  }
  $("#feed_page").removeClass("hide");
  $("html").removeClass("no_overflow");
  setTimeout(() => {
    // $("html").scrollTop($("html")[0].scrollHeight);
    $(".lock_screen").addClass("hide_up");
  }, 200);
  setTimeout(() => {
    clearInterval(dateTimeInterval);
    $(".lock_screen").remove();
  }, 500);
  // $("head").append(`<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`);
  // window.location.href = "./feed.html";
  // window.location.replace = "./feed.html";
  // window.location.replace("./feed.html");
  // window.location.assign("./feed.html");
  // return false;
}
