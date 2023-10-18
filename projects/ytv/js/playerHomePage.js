var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
$("body.home-page").append(tag);

var playerHomePage;
// // let parsedVideoId = getUrlParameter("videoId") || "aywrfQw83zc";
let parsedVideoIdHome = getUrlParameter("videoIdHome") || "xTQ7vhtp23w";
// window.history.replaceState(null, null, `?videoIdHome=${parsedVideoIdHome}`);

function onYouTubeIframeAPIReady() {
  playerHomePage = new YT.Player("video-player-container-home", {
    height: "100%",
    width: "100%",
    videoId: parsedVideoIdHome,
    host: 'https://www.youtube-nocookie.com',
    playerVars: {
      "playsinline": 1,
      "adformat": 15_8,
      "autoplay": 1,
      "mute": 1,
      "enablejsapi": 1,
      "iv_load_policy": 3,
      "modestbranding": 0,
      "nologo": 1,
      "ps": "gvn",
      "rel": 0,
      "suppress_creator_endscreen": 1,
      "title": "",
      "controls": 0,
      "showinfo": 0,
      // "widget_referrer": "https://www.youtube.com/videomasthead/",
      // "origin": "https://www.youtube.com",
      "widgetid": 1
    },
    // events: {
    //   "onReady": onPlayerReady,
    //   "onStateChange": onPlayerStateChange
    // }
  });
}

let carousalInterval = null;
let goToPlayerTimeout = null;

$(document).ready(function() {
  // startCarousal();
  // checkGoToPlayer();

  $("body").hasClass("home-page") && !!sessionStorage.getItem("lastFocusedCard") && backToLastFocusedCard();
});

function pauseCarousal() {
  clearInterval(carousalInterval);
  $(".hero-section-carousal-dot.highlighted").addClass("paused");
}
function cancelGoToPlayer() {
  clearInterval(goToPlayerTimeout);
}
function checkGoToPlayer() {
  goToPlayerTimeout = setTimeout(() => {
    $(".home-page").addClass("go_to_player_animation")
    setTimeout(() => {
      window.location.href = `./player.html?videoIdPlayer1=${$(".hero-section-carousal-dot.highlighted").attr("data-video-id")}&startTime1=${parseInt(playerHomePage.getCurrentTime())}`;
      sessionStorage.removeItem("showRightPanelOnPageLoad");
    }, 2000);
  }, 15000);
}
function startCarousal() {
  let currentHighlighted = $(".hero-section-carousal-dot.highlighted");
  currentHighlighted.removeClass("paused highlighted");
  setTimeout(() => {
    currentHighlighted.addClass("highlighted");
  }, 100);

  carousalInterval = setInterval(() => {
    // console.log("started");
    if(!!$(".hero-section-carousal-dot.highlighted").next(".hero-section-carousal-dot").length) {
      $(".hero-section-carousal-dot.highlighted").removeClass("highlighted").addClass("filled").next(".hero-section-carousal-dot").addClass("highlighted");
    } else {
      $(".hero-section-carousal-dot").removeClass("highlighted filled");
      $(".hero-section-carousal-dot").first().addClass("highlighted");
    }
    // console.log($(".hero-section-carousal-dot.highlighted"));
    let isLive = $(".hero-section-carousal-dot.highlighted").attr("data-is-live");
    let isLargeTitle = $(".hero-section-carousal-dot.highlighted").attr("data-large-title");
    $(".hero-section-details .badge").removeClass("badge-live");
    if(isLive !== undefined) {
      $(".hero-section-details .badge").addClass("badge-live");
    }
    if(!!$(".hero-section-carousal-dot.highlighted").attr("data-badge")) {
      $(".hero-section-details .badge").text($(".hero-section-carousal-dot.highlighted").attr("data-badge"));
    }
    if(!!$(".hero-section-carousal-dot.highlighted").attr("data-title")) {
      $(".hero-section-metadata .hero-section-title").text($(".hero-section-carousal-dot.highlighted").attr("data-title"));
    }
    $(".hero-section-metadata .hero-section-title").removeClass("large");
    if(isLargeTitle !== undefined) {
      $(".hero-section-metadata .hero-section-title").addClass("large");
    }
    if(!!$(".hero-section-carousal-dot.highlighted").attr("data-details")) {
      $(".hero-section-metadata .hero-section-details-inner").text($(".hero-section-carousal-dot.highlighted").attr("data-details"));
    }
    playerHomePage.loadVideoById($(".hero-section-carousal-dot.highlighted").attr("data-video-id"));

  }, 8000);
}

function channelZap(direction = "next") {
  // let currentHighlighted = $(".hero-section-carousal-dot.highlighted");
  // currentHighlighted.removeClass("paused highlighted");
  // setTimeout(() => {
  //   currentHighlighted.addClass("highlighted");
  // }, 100);

  // carousalInterval = setInterval(() => {
    // console.log("started");
    switch (direction) {
      case "next":
        if(!!$(".hero-section-carousal-dot.highlighted").next(".hero-section-carousal-dot").length) {
          $(".hero-section-carousal-dot.highlighted").removeClass("highlighted").addClass("filled").next(".hero-section-carousal-dot").addClass("highlighted");
        } else {
          $(".hero-section-carousal-dot").removeClass("highlighted filled");
          $(".hero-section-carousal-dot").first().addClass("highlighted");
        }
        break;
    
      case "prev":
        if(!!$(".hero-section-carousal-dot.highlighted").prev(".hero-section-carousal-dot").length) {
          $(".hero-section-carousal-dot.highlighted").removeClass("highlighted").addClass("filled").prev(".hero-section-carousal-dot").addClass("highlighted");
        } else {
          $(".hero-section-carousal-dot").removeClass("highlighted filled");
          $(".hero-section-carousal-dot").last().addClass("highlighted");
        }
        break;
    }
    
    // console.log($(".hero-section-carousal-dot.highlighted"));
    let isLive = $(".hero-section-carousal-dot.highlighted").attr("data-is-live");
    let isLargeTitle = $(".hero-section-carousal-dot.highlighted").attr("data-large-title");
    $(".hero-section-details .badge").removeClass("badge-live");
    $("#hero-section-watch-button .button-text").text("Watch Now");
    if(isLive !== undefined) {
      $(".hero-section-details .badge").addClass("badge-live");
      $("#hero-section-watch-button .button-text").text("Watch Live");
    }
    if(!!$(".hero-section-carousal-dot.highlighted").attr("data-badge")) {
      $(".hero-section-details .badge").text($(".hero-section-carousal-dot.highlighted").attr("data-badge"));
    }
    if(!!$(".hero-section-carousal-dot.highlighted").attr("data-title")) {
      $(".hero-section-metadata .hero-section-title").text($(".hero-section-carousal-dot.highlighted").attr("data-title"));
    }
    $(".hero-section-metadata .hero-section-title").removeClass("large");
    if(isLargeTitle !== undefined) {
      $(".hero-section-metadata .hero-section-title").addClass("large");
    }
    if(!!$(".hero-section-carousal-dot.highlighted").attr("data-details")) {
      $(".hero-section-metadata .hero-section-details-inner").text($(".hero-section-carousal-dot.highlighted").attr("data-details"));
    }
    playerHomePage.loadVideoById($(".hero-section-carousal-dot.highlighted").attr("data-video-id"));

  // }, 8000);
}

function backToLastFocusedCard() {
  // console.log("#" + sessionStorage.getItem("lastFocusedCard"));
  $("body").addClass("no-animation");
  expandBrowsingSheet();
  setFocusTo($("#" + sessionStorage.getItem("lastFocusedCard")));
  sessionStorage.removeItem("lastFocusedCard");


  let currentElement = $(".shelf-card.focused").closest(".shelf");
  let transformYValue = (getTranslateXY(currentElement.closest(".shelves")[0]).translateY - (currentElement.index() * currentElement.outerHeight(true)) + 200);
  currentElement.closest(".shelves").css({
    // "transform": `translateY(${(transformYValue)}px)`
    "transform": `translateY(${transformYValue}px)`
  });
  setTimeout(() => {
    $("body").removeClass("no-animation");
  }, 100);
}