// let pixelDensity = window.screen.availWidth / document.documentElement.clientWidth;
let pixelDensity = 1.425;
console.log(window.screen.availWidth);
(window.screen.availWidth > 1790) && (pixelDensity = 2);
// 1792

let elementsMap = {
  // "id": {
  //   "37": "", // Left
  //   "38": "", // Up
  //   "39": "", // Right
  //   "40": "", // Down
  //   "13": "", // Enter
  //   "32": "", // Spacebar
  //   "27": ""  // Esc
  // },
  "progress-bar": {
    "37": "", // Left
    "38": "#option-game-views", // Up
    "39": "", // Right
    "40": "#option-more-to-watch", // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": hidePlayerControls  // Esc
  },
  "option-channels": {
    "37": "", // Left
    "38": "#progress-bar", // Up
    "39": "#option-key-plays", // Right
    "40": "", // Down
    "13": showChannelsList, // Enter
    "32": "", // Spacebar
    "27": hidePlayerControls  // Esc
  },
  "option-key-plays": {
    "37": "#option-channels", // Left
    "38": "#progress-bar", // Up
    "39": "#option-more-to-watch", // Right
    // "39": "#option-game-views", // Right
    "40": "", // Down
    "13": showKeyPlaysList, // Enter
    "32": "", // Spacebar
    "27": hidePlayerControls  // Esc
  },
  "option-more-to-watch": {
    "37": "#option-key-plays", // Left
    "38": "#progress-bar", // Up
    // "39": "#option-feeds", // Right
    "39": "", // Right
    "40": "", // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": hidePlayerControls  // Esc
  },
  "option-feeds": {
    "37": "#option-key-plays", // Left
    "38": "#progress-bar", // Up
    "39": "#option-game-views", // Right
    "40": "", // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": hidePlayerControls  // Esc
  },
  "option-game-views": {
    // "37": "#option-feeds", // Left
    "37": "", // Left
    "38": "", // Up
    "39": "#option-more-options", // Right
    "40": "#progress-bar", // Down
    "13": () => {showRightPanel($("#stats-and-scores-panel"), $("#show-game-stat-panel"));}, // Enter
    "32": "", // Spacebar
    "27": hidePlayerControls  // Esc
  },
  "option-more-options": {
    // "37": "#option-feeds", // Left
    "37": "#option-game-views", // Left
    "38": "", // Up
    "39": "", // Right
    "40": "#progress-bar", // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": hidePlayerControls  // Esc
  },
  "show-game-stat-panel": {
    "37": checkMosaicTile, // Left
    "38": "", // Up
    "39": "#show-game-fantasy-panel", // Right
    "40": goToGameStatCards, // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": hideRightPanel  // Esc
  },
  "show-game-fantasy-panel": {
    "37": "#show-game-stat-panel", // Left
    "38": "", // Up
    "39": "#show-game-score-panel", // Right
    "40": goToGameFantasyCards, // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": hideRightPanel  // Esc
  },
  "show-game-score-panel": {
    "37": "#show-game-fantasy-panel", // Left
    "38": "", // Up
    "39": "#show-game-odds-panel", // Right
    "40": goToGameScoreCards, // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": hideRightPanel  // Esc
  },
  "show-game-odds-panel": {
    "37": "#show-game-score-panel", // Left
    "38": "", // Up
    "39": "#show-game-feeds-panel", // Right
    "40": goToGameOddsCards, // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": hideRightPanel  // Esc
  },
  "show-game-feeds-panel": {
    "37": "#show-game-odds-panel", // Left
    "38": "", // Up
    "39": "", // Right
    "40": goToGameFeedsCards, // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": hideRightPanel  // Esc
  },
  "channel-logo": {
    "isClass": true,
    "37": changeChannelLeft, // Left
    "38": "", // Up
    "39": changeChannelRight, // Right
    "40": "", // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": hideChannelsList  // Esc
  },
  "key-play": {
    "isClass": true,
    "37": changeKeyPlayLeft, // Left
    "38": hideKeyPlaysList, // Up
    "39": changeKeyPlayRight, // Right
    "40": hideKeyPlaysList, // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": hideKeyPlaysList  // Esc
  },
  "game-stat-card": {
    "isClass": true,
    "37": () => {
      highlightedElements.delete("#show-game-stat-panel");
      checkMosaicTile();
    }, // Left
    "38": () => {scrollTabCardsUp($(".game-stat-card.focused"), "#show-game-stat-panel");}, // Up
    "39": "", // Right
    "40": () => {scrollTabCardsDown($(".game-stat-card.focused"));}, // Down
    "13": () => {toggleMosaic($(".focused"));}, // Enter
    "32": "", // Spacebar
    "27": "#show-game-stat-panel"  // Esc
  },
  "game-fantasy-card": {
    "isClass": true,
    "37": () => {
      highlightedElements.delete("#show-game-fantasy-panel");
      checkMosaicTile();
    }, // Left
    "38": () => {scrollTabCardsUp($(".game-fantasy-card.focused"), "#show-game-fantasy-panel");}, // Up
    "39": "", // Right
    "40": () => {scrollTabCardsDown($(".game-fantasy-card.focused"));}, // Down
    "13": () => {toggleMosaic($(".focused"));}, // Enter
    "32": "", // Spacebar
    "27": "#show-game-fantasy-panel"  // Esc
  },
  "game-score-card": {
    "isClass": true,
    "37": () => {
      highlightedElements.delete("#show-game-score-panel");
      checkMosaicTile();
    }, // Left
    "38": () => {scrollTabCardsUp($(".game-score-card.focused"), "#show-game-score-panel");}, // Up
    "39": "", // Right
    "40": () => {scrollTabCardsDown($(".game-score-card.focused"));}, // Down
    "13": () => {toggleMosaic($(".focused"));}, // Enter
    "32": "", // Spacebar
    "27": "#show-game-score-panel"  // Esc
  },
  "game-odds-card": {
    "isClass": true,
    "37": () => {
      highlightedElements.delete("#show-game-odds-panel");
      checkMosaicTile();
    }, // Left
    "38": () => {scrollTabCardsUp($(".game-odds-card.focused"), "#show-game-odds-panel");}, // Up
    "39": "", // Right
    "40": () => {scrollTabCardsDown($(".game-odds-card.focused"));}, // Down
    "13": () => {toggleMosaic($(".focused"));}, // Enter
    "32": "", // Spacebar
    "27": "#show-game-odds-panel"  // Esc
  },
  "game-feeds-card": {
    "isClass": true,
    "37": () => {
      highlightedElements.delete("#show-game-feeds-panel");
      checkMosaicTile();
    }, // Left
    "38": () => {scrollTabCardsUp($(".game-feeds-card.focused"), "#show-game-feeds-panel");}, // Up
    "39": "", // Right
    "40": () => {scrollTabCardsDown($(".game-feeds-card.focused"));}, // Down
    "13": () => {playFeedCardVideo($(".focused"));}, // Enter
    "32": "", // Spacebar
    "27": "#show-game-feeds-panel"  // Esc
  },
  "mosaic-tile1": {
    "37": "", // Left
    "38": "", // Up
    "39": mosaicTile1Right, // Right
    "40": mosaicTile1Down, // Down
    "13": () => {makeTileFullScreen($("#mosaic-tile1"));}, // Enter
    "32": "", // Spacebar
    "27": hideRightPanel  // Esc
  },
  "mosaic-tile2": {
    "37": mosaicTile2Left, // Left
    "38": mosaicTile2Up, // Up
    "39": mosaicTile2Right, // Right
    "40": mosaicTile2Down, // Down
    "13": () => {makeTileFullScreen($("#mosaic-tile2"));}, // Enter
    "32": "", // Spacebar
    "27": hideRightPanel  // Esc
  },
  "mosaic-tile3": {
    "37": mosaicTile3Left, // Left
    "38": "#mosaic-tile1", // Up
    "39": mosaicTile3Right, // Right
    "40": "", // Down
    "13": () => {makeTileFullScreen($("#mosaic-tile3"));}, // Enter
    "32": "", // Spacebar
    "27": hideRightPanel  // Esc
  },
  "mosaic-tile4": {
    "37": "#mosaic-tile3", // Left
    "38": "#mosaic-tile2", // Up
    "39": "#show-game-stat-panel", // Right
    "40": "", // Down
    "13": () => {makeTileFullScreen($("#mosaic-tile4"));}, // Enter
    "32": "", // Spacebar
    "27": hideRightPanel  // Esc
  },
  // "channel-logo7": {
  //   "37": "#channel-logo6", // Left
  //   "38": "", // Up
  //   "39": "#channel-logo8", // Right
  //   "40": "", // Down
  //   "13": "", // Enter
  //   "32": "", // Spacebar
  //   "27": hideChannelsList  // Esc
  // },
  // "channel-logo8": {
  //   "37": "#channel-logo7", // Left
  //   "38": "", // Up
  //   "39": "#channel-logo9", // Right
  //   "40": "", // Down
  //   "13": "", // Enter
  //   "32": "", // Spacebar
  //   "27": hideChannelsList  // Esc
  // },
  // "channel-logo": {
  //   "37": $(".focused").prev(".channel-logo").attr("id"), // Left
  //   "38": "", // Up
  //   "39": $(".focused").next(".channel-logo").attr("id"), // Right
  //   "40": "", // Down
  //   "13": "", // Enter
  //   "32": "", // Spacebar
  //   "27": ""  // Esc
  // },
};

const elementsMapHomeBrowse = {
  "top-nav-browse": {
    "37": "", // Left
    "38": "", // Up
    "39": goToLivePage, // Right
    "40": () => {
      highlightedElements.add("#top-nav-browse");
      setFocusTo($("#hero-section-watch-button"));
    }, // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": ""  // Esc
  },
  "hero-section-watch-button": {
    "37": () => {channelZap("prev");}, // Left
    "38": "#top-nav-browse", // Up
    "39": () => {channelZap("next");}, // Right
    "40": expandBrowsingSheet, // Down
    "13": () => {
      $(".home-page").addClass("go_to_player_animation")
      setTimeout(() => {
        window.location.href = `./player.html?videoIdPlayer1=${$(".hero-section-carousal-dot.highlighted").attr("data-video-id")}&startTime1=${parseInt(playerHomePage.getCurrentTime())}`;
        sessionStorage.removeItem("showRightPanelOnPageLoad");
      }, 2000);
    }, // Enter
    "32": "", // Spacebar
    "27": ""  // Esc
  },
  // "top-nav-live": {
  //   "37": goToBrowsePage, // Left
  //   "38": "", // Up
  //   "39": "#top-nav-library", // Right
  //   "40": "#epg-card1-1", // Down
  //   "13": "", // Enter
  //   "32": "", // Spacebar
  //   "27": ""  // Esc
  // },
  "top-nav-library": {
    "37": "#top-nav-live", // Left
    "38": "", // Up
    "39": "#top-nav-store", // Right
    "40": "", // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": ""  // Esc
  },
  "top-nav-store": {
    "37": "#top-nav-library", // Left
    "38": "", // Up
    "39": "", // Right
    "40": "", // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": ""  // Esc
  },
  "shelf-card": {
    "isClass": true,
    "37": changeShelfLeft, // Left
    "38": changeShelfUp, // Up
    "39": changeShelfRight, // Right
    "40": changeShelfDown, // Down
    "13": openPlayerPage, // Enter
    "32": "", // Spacebar
    "27": collapseBrowsingSheet  // Esc
  },
  "shelf-card4-1": {
    "37": changeShelfLeft, // Left
    "38": changeShelfUp, // Up
    "39": changeShelfRight, // Right
    "40": changeShelfDown, // Down
    "13": showMovieDetailsSheet, // Enter
    "32": "", // Spacebar
    "27": () => {
      // if($("#side-sheet").hasClass("show")) {
      //   hideMovieDetailsSheet();
      // } else {
        collapseBrowsingSheet();
      // }
    }  // Esc
  },
  "side-sheet-watch-live": {
    "37": hideMovieDetailsSheet, // Left
    "38": "", // Up
    "39": "", // Right
    "40": "", // Down
    "13": showMovieDetailsPage, // Enter
    "32": "", // Spacebar
    "27": hideMovieDetailsSheet, // Esc
  },
  "movie-details-page-watch-live": {
    "37": "", // Left
    "38": "", // Up
    "39": "", // Right
    "40": expandMovieDetailsPageSheet, // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": hideMovieDetailsPage, // Esc
  },
  "movie-details-card1-1": {
    "37": "", // Left
    "38": collapseMovieDetailsPageSheet, // Up
    "39": "", // Right
    "40": "", // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": collapseMovieDetailsPageSheet, // Esc
  },
}

const elementsMapHomeEPG = {
  "top-nav-live": {
    "37": goToBrowsePage, // Left
    "38": "", // Up
    // "39": "#top-nav-library", // Right
    "39": goToLibraryPage, // Right
    "40": () => {
      highlightedElements.add("#top-nav-live");
      setFocusTo($("#epg-card1-1"));
    }, // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": ""  // Esc
  },
  "top-nav-library": {
    "37": goToLivePage, // Left
    "38": "", // Up
    "39": goToStorePage, // Right
    "40": "#library-hero-card-1-1", // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": ""  // Esc
  },
  "library-hero-card-1-1": {
    "37": "", // Left
    "38": "#top-nav-library", // Up
    "39": "#library-hero-card-1-2", // Right
    "40": "#library-hero-card-2-1", // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": "#top-nav-library"  // Esc
  },
  "library-hero-card-1-2": {
    "37": "#library-hero-card-1-1", // Left
    "38": "#top-nav-library", // Up
    "39": "", // Right
    "40": "#library-hero-card-2-2", // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": "#top-nav-library"  // Esc
  },
  "library-hero-card-2-1": {
    "37": "", // Left
    "38": "#library-hero-card-1-1", // Up
    "39": "#library-hero-card-2-2", // Right
    "40": "", // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": "#top-nav-library"  // Esc
  },
  "library-hero-card-2-2": {
    "37": "#library-hero-card-2-1", // Left
    "38": "#library-hero-card-1-2", // Up
    "39": "", // Right
    "40": "", // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": "#top-nav-library"  // Esc
  },
  "top-nav-store": {
    "37": goToLibraryPage, // Left
    "38": "", // Up
    "39": "", // Right
    "40": "#store-page-carousal-item1", // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": ""  // Esc
  },
  "store-page-chip1": {
    "37": "", // Left
    "38": "#store-page-carousal-item1", // Up
    "39": "", // Right
    "40": "", // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": "#top-nav-store"  // Esc
  },
  "store-page-carousal-item1": {
    "37": "", // Left
    "38": "#top-nav-store", // Up
    "39": "", // Right
    "40": "#store-page-chip1", // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": "#top-nav-store"  // Esc
  },
  "shelf-card": {
    "isClass": true,
    "37": changeShelfLeft, // Left
    "38": "#top-nav-live", // Up
    "39": changeShelfRight, // Right
    "40": () => {
        showEPGCellDetails("#epg-table-cell1-2");
        setFocusTo($("#epg-table-cell1-2"));
        $("#epg-page").addClass("hide-epg-top-nav");
        $("body").removeClass("collapse-browsing-sheet");
      }, // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": "#top-nav-live"  // Esc
  },
  "epg-guide-table-cell": {
    "isClass": true,
    "37": changeShelfLeft, // Left
    // "38": "#epg-card1-1",
    "38": () => {
      hideEPGCellDetails();
      setFocusTo($("#epg-card1-1"));
      $("#epg-page").removeClass("hide-epg-top-nav");
      $("body").addClass("collapse-browsing-sheet");
    }, // Up
    "39": changeShelfRight, // Right
    "40": "", // Down
    "13": "", // Enter
    "32": "", // Spacebar
    "27": () => {
      hideEPGCellDetails();
      setFocusTo($("#top-nav-live"));
      $("#epg-page").removeClass("hide-epg-top-nav");
      $("body").addClass("collapse-browsing-sheet");
    }, // Esc
  },
}

let currentVideoItem = 0;

const highlightedElements = new Set();

$(document).ready(function() {
  // new-watch-metadata-active
  // live-playback

  // or
  // watch-overlay
  setTimeout(() => {
    !$("body").hasClass("home-page") && !!sessionStorage.getItem("showRightPanelOnPageLoad") && showRightPanel($("#stats-and-scores-panel"), $("#show-game-stat-panel"));
  }, 750);

  $("body").hasClass("home-page") && (elementsMap = elementsMapHomeBrowse);

  $("video").length && ($("video")[0].volume = 0.3);

  maintainAspectRatio();
  $("html").css("font-size", ((137 * (pixelDensity/window.devicePixelRatio))) + "%");
  $(window).resize(maintainAspectRatio);
  $(window).resize();

  let slateLink = "../videos/live-slate-TNT.mp4";
  $("body").hasClass("prototype_2") && (slateLink = "../videos/YTTV-zen-waterfall.mp4");

  $(".video-stream").on("ended", function(evt) {
    // if(videoList[currentVideoItem].title === "Old Spice") {
    //   currentVideoItem++;
    // }
    // updateCurrentVideoItem();

    // hidePlayerControls();
    $(".video-stream").trigger("play");
  });

  const nextKeys = [13, 39];
  const prevKeys = [8, 37];
  const arrowKeys = [37, 38, 39, 40];
  const functionKeys = [13, 27, 32];
  const playPauseKeys = [13, 32];

  $(".highlightable").removeClass("highlighted");
  highlightedElements.forEach((elem) => {
    $(elem).addClass("highlighted");
  });

  $("body").on("keydown", function(evt) {
    if(arrowKeys.includes(evt.keyCode) || functionKeys.includes(evt.keyCode)) {
      evt.preventDefault();
    }
  });
  $("body").on("keyup", function(evt) {
    
    setTimeout(() => {
      // $("body").hasClass("home-page") && cancelGoToPlayer();
      if($("#top-nav-browse").hasClass("focused") ||
        $("#hero-section-watch-button").hasClass("focused")) {
        // checkGoToPlayer();
      }

      if(!$("#top-nav-browse").hasClass("focused") &&
        !$("#hero-section-watch-button").hasClass("focused")) {
        !!playerHomePage && playerHomePage.pauseVideo();
      } else {
        !!playerHomePage && playerHomePage.playVideo();
      }
    }, 100);
    
    if(evt.keyCode === 32) {
      if($("#watch").hasClass("show-pause")) {
        playVideoStream(true);
      } else {
        pauseVideoStream(true);
      }
    }
    if(arrowKeys.includes(evt.keyCode) || functionKeys.includes(evt.keyCode)) {
      let currentFocused = $(".focused");
      // if(isVisible(currentFocused)) {
      if(currentFocused.is(":visible")) {
        let currentFocusedId = `${currentFocused.attr("id")}`;
        if(!elementsMap[currentFocusedId] &&
          !!$(`#${currentFocusedId}`).attr("data-class") &&
          !!$(`#${currentFocusedId}`).attr("data-class").trim().length) {
            currentFocusedId = $(`#${currentFocusedId}`).attr("data-class");
        }
        console.log("currentFocus: " + currentFocusedId);
        // console.log(!!elementsMap[currentFocusedId]["isClass"]);

        if(!!elementsMap[currentFocusedId] &&
          !!elementsMap[currentFocusedId][evt.keyCode]) {
            if(typeof elementsMap[currentFocusedId][evt.keyCode] === "string") {
              setFocusTo($(elementsMap[currentFocusedId][evt.keyCode]));
            } else if(typeof elementsMap[currentFocusedId][evt.keyCode] === "function") {
              elementsMap[currentFocusedId][evt.keyCode]();
            }
        }
      } else {
        showPlayerControls();
        setFocusTo($("#progress-bar"));
      }
    }
    // if(functionKeys.includes(evt.keyCode)) {
    //   let currentFocused = $(".focused");
    //   if(currentFocused.is(":visible")) {
    //     let currentFocusedId = `${currentFocused.attr("id")}`;
        
    //     if(!!elementsMap[currentFocusedId] &&
    //     !!elementsMap[currentFocusedId][evt.keyCode]) {
    //       if(typeof elementsMap[currentFocusedId][evt.keyCode] === "string") {
    //         setFocusTo($(elementsMap[currentFocusedId][evt.keyCode]));
    //       } else if(typeof elementsMap[currentFocusedId][evt.keyCode] === "function") {
    //         elementsMap[currentFocusedId][evt.keyCode]();
    //       }
    //     }
    //   }
    // }
  });
});

let px_ratio = pixelDensity/window.devicePixelRatio;
// console.log(px_ratio);
function isZooming() {
  var newPx_ratio = window.devicePixelRatio;
  // console.log(newPx_ratio);
  if(newPx_ratio != px_ratio){
      px_ratio = newPx_ratio;
      // console.log("zooming");
      return true;
  } else {
      // console.log("resizing");
      return false;
  }
}


function isVisible(targetEl) {
  // console.log(targetEl.css("opacity"));
  // console.log(targetEl.css("visibility"));
  // console.log(targetEl.css("display"));
  if(targetEl.css("opacity") == 0 ||
      targetEl.css("visibility") == "hidden" ||
      targetEl.css("display") == "none") {
    return false;
  } else {
    return true;
  }
}

function showRightPanel(targetPanel, targetFocusEl) {
  $("body").addClass("squeeze-back");
  $(".right-panel").addClass("show");
  $(".right-panel .panel-inner").addClass("hide");
  targetPanel.removeClass("hide");
  hidePlayerControls();
  setFocusTo(targetFocusEl);
}
function hideRightPanel() {
  $("body").removeClass("squeeze-back");
  $(".right-panel").removeClass("show");
  if(!$(".mosaic-tile").hasClass("focused")) {
    setFocusTo($("#progress-bar"));
  }
}

function showPlayerControls() {
  $("#watch-overlay").removeClass("hidden-controls");
}
function hidePlayerControls() {
  $("#watch-overlay").addClass("hidden-controls");
}

function pauseVideoStream(showIndicator = false) {
  showIndicator && $("#watch").removeClass("show-play").addClass("show-pause");
  $(".video-stream").trigger("pause");
  !!player1 && player1.pauseVideo();
  showPlayerControls();
}
function playVideoStream(showIndicator = false) {
  showIndicator && $("#watch").removeClass("show-pause").addClass("show-play");
  $(".video-stream").trigger("play");
  !!player1 && player1.playVideo();
  hidePlayerControls();
}

function maintainAspectRatio() {
  $("#app-markup").css("height", $(window).width() * 720/1280);
  // console.log(isZooming());
  // console.log(pixelDensity/window.devicePixelRatio);
  // console.log(window.devicePixelRatio);

  let scaledFont = 16 * ($("#app-markup").width() / 1280);
  $("html").css("font-size", scaledFont);

  if(isZooming()) {
    // $("html").css("font-size", ((137 * (pixelDensity)) / 2) + "%");
    // console.log(px_ratio);
    $("html").css("font-size", ((137 * (pixelDensity/window.devicePixelRatio))) + "%");
  }
}

function setFocusTo(targetEl) {
  // console.log(targetEl.attr("id"));
  $(".focusable").removeClass("focused");
  targetEl.addClass("focused");
  onTabFocusAnimation(targetEl);

  highlightedElements.delete("#" + targetEl.attr("id"));
  if(targetEl.parent().hasClass("game-stat-options-chips")) {
    targetEl[0].scrollIntoView({block: "nearest"});
    console.log(targetEl.parent()[0].scrollWidth);
    setTimeout(() => {
      targetEl.parent().removeClass("scrolled");
      if(targetEl.parent().scrollLeft() > 0) {
        targetEl.parent().addClass("scrolled");
      }
    }, 300);
  }
  $(".highlightable").removeClass("highlighted");
  highlightedElements.forEach((elem) => {
    $(elem).addClass("highlighted");
  });
}
function onTabFocusAnimation(targetEl) {
  if(!targetEl.hasClass("highlighted")) {
    switch (targetEl.attr("id")) {
      case "show-game-stat-panel":
        $(".stat-card").addClass("hide");
        setTimeout(() => {
          $(".game-stat-card").removeClass("hide");
        }, 100);
        break;

      case "show-game-fantasy-panel":
        $(".stat-card").addClass("hide");
        setTimeout(() => {
          $(".game-fantasy-card").removeClass("hide");
        }, 100);
        break;

      case "show-game-score-panel":
        $(".stat-card").addClass("hide");
        setTimeout(() => {
          $(".game-score-card").removeClass("hide");
        }, 100);
        break;
    
      case "show-game-odds-panel":
        $(".stat-card").addClass("hide");
        setTimeout(() => {
          $(".game-odds-card").removeClass("hide");
        }, 100);
        break;
    
      case "show-game-feeds-panel":
        $(".stat-card").addClass("hide");
        setTimeout(() => {
          $(".game-feeds-card").removeClass("hide");
        }, 100);
        break;
    
      case "mosaic-mode-card1":
        $(".stat-card").addClass("hide");
        setTimeout(() => {
          $(".mosaic-mode-card").removeClass("hide");
        }, 100);
        break;
    
      default:
        break;
    }
  }
}

function goToLivePage() {
  $(".top-nav-directed-page").addClass("hide");
  $("#epg-page").removeClass("hide");
  setFocusTo($("#top-nav-live"));
  elementsMap = elementsMapHomeEPG;
}
function goToBrowsePage() {
  $(".top-nav-directed-page").addClass("hide");
  $("#browsing-sheet, #hero-section-browse").removeClass("hide");
  setFocusTo($("#top-nav-browse"));
  elementsMap = elementsMapHomeBrowse;
}
function goToLibraryPage() {
  $(".top-nav-directed-page").addClass("hide");
  $("#library-page").removeClass("hide");
  setFocusTo($("#top-nav-library"));
  elementsMap = elementsMapHomeEPG;
}
function goToStorePage() {
  $(".top-nav-directed-page").addClass("hide");
  $("#store-page").removeClass("hide");
  setFocusTo($("#top-nav-store"));
  elementsMap = elementsMapHomeEPG;
}




var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
$("body").append(tag);

var player1;
let parsedVideoId1 = getUrlParameter("videoIdPlayer1") || "vuJotAeyLpw";
let parsedStartTime1 = parseInt(getUrlParameter("startTime1")) || 0;
console.log(parsedStartTime1);
// window.history.replaceState(null, null, `?videoIdPlayer1=${parsedVideoId1}`);

function onYouTubeIframeAPIReady() {
  player1 = new YT.Player("video-player-container1", {
    height: "100%",
    width: "100%",
    videoId: parsedVideoId1,
    host: 'https://www.youtube-nocookie.com',
    playerVars: {
      "playsinline": 1,
      "adformat": 15_8,
      "start": parsedStartTime1,
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
    events: {
      "onReady": onPlayer1Ready,
      "onStateChange": onPlayer1StateChange
    }
  });
}


function onPlayer1Ready(event) {
  isVideoPlaying = true;
  // updateProgressBar();
  // $("#watch-metadata .primary-text").text(player1.getVideoData().title);
  let secondaryText = player1.getVideoData().author;
  if(!secondaryText) {
    let date = new Date();
    secondaryText = date.toLocaleString('default', { month: 'long' }) + " " + date.getDay() + ", " + date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  }
  // $("#watch-metadata .secondary-text").text("secondaryText");
}

function onPlayer1StateChange(event) {
    switch (event.data) {
        case YT.PlayerState.ENDED:
            !!player1 && player1.playVideo();
            break;
    }
}

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}
function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

let initialChannelFocusEl = $("#channel-logo7");
function showChannelsList() {
  $(".channel-logos").removeClass("hide");
  setFocusTo(initialChannelFocusEl);
  hidePlayerControls();
  $(".ytvlr-overlay-scrim").removeClass("hide");

  $(".channel-logo").removeClass("show-channels show-channels-left show-channels-right");
  // initialChannelFocusEl.addClass("show-channels");
  initialChannelFocusEl.css({"animation-delay": `0s`});
  initialChannelFocusEl.prevAll(".channel-logo").each((idx, elem) => {
    $(elem).addClass("show-channels-left");
    $(elem).css({"animation-delay": `${idx * 0.05}s`});
  });
  initialChannelFocusEl.nextAll(".channel-logo").each((idx, elem) => {
    $(elem).addClass("show-channels-right");
    $(elem).css({"animation-delay": `${idx * 0.05}s`});
  });
}
function hideChannelsList() {
  initialChannelFocusEl = $(".channel-logo.focused");
  $(".channel-logos").addClass("hide");
  setFocusTo($("#option-channels"));
  showPlayerControls();
  $(".ytvlr-overlay-scrim").addClass("hide");
}
function changeChannelLeft() {
  // console.log("left");
  if($(".channel-logo").hasClass("focused")) {
    let currentChannel = $(".channel-logo.focused");
    !!currentChannel.prev(".channel-logo").length && setFocusTo(currentChannel.prev(".channel-logo"));

    let transformXFactor = (6 - currentChannel.index()) + 1;
    // changeVideoStream(currentChannel.prev(".video-card").attr("data-src").trim(), currentChannel.prev(".video-card").attr("data-title").trim());
    let transformXValue = 5.75 * transformXFactor;
    (transformXValue > 0 ? transformXValue = 0 : null);
    // (transformXValue < 0?transformXValue = 0:null);
    currentChannel.closest(".channel-logos").css({
      "transform": `translateX(${(transformXValue)}rem)`
    });
  }
}
function changeChannelRight() {
  // console.log("right");
  if($(".channel-logo").hasClass("focused")) {
    let currentChannel = $(".channel-logo.focused");
    !!currentChannel.next(".channel-logo").length && setFocusTo(currentChannel.next(".channel-logo"));

    let transformXFactor = (6 - currentChannel.index()) - 1;
    // changeVideoStream(currentChannel.prev(".video-card").attr("data-src").trim(), currentChannel.prev(".video-card").attr("data-title").trim());
    let transformXValue = 5.75 * transformXFactor;
    (transformXValue > 0 ? transformXValue = 0 : null);
    // (transformXValue < 0?transformXValue = 0:null);
    currentChannel.closest(".channel-logos").css({
      "transform": `translateX(${(transformXValue)}rem)`
    });
  }
}



let initialKeyPlayFocusEl = $("#key-play4");
function showKeyPlaysList() {
  $(".key-plays-list").removeClass("hide");
  setFocusTo(initialKeyPlayFocusEl);
  hidePlayerControls();
  $(".ytvlr-overlay-scrim").removeClass("hide");

  $(".key-play").removeClass("show-key-plays show-key-plays-left show-key-plays-right");
  // initialKeyPlayFocusEl.addClass("show-key-plays");
  initialKeyPlayFocusEl.css({"animation-delay": `0s`});
  initialKeyPlayFocusEl.prevAll(".key-play").each((idx, elem) => {
    $(elem).addClass("show-key-plays-left");
    $(elem).css({"animation-delay": `${idx * 0.05}s`});
  });
  initialKeyPlayFocusEl.nextAll(".key-play").each((idx, elem) => {
    $(elem).addClass("show-key-plays-right");
    $(elem).css({"animation-delay": `${idx * 0.05}s`});
  });
  highlightKeyPlayBar();
}
function hideKeyPlaysList() {
  initialKeyPlayFocusEl = $(".key-play.focused");
  $(".key-plays-list").addClass("hide");
  setFocusTo($("#option-key-plays"));
  showPlayerControls();
  $(".ytvlr-overlay-scrim").addClass("hide");
}
function changeKeyPlayLeft() {
  // console.log("left");
  if($(".key-play").hasClass("focused")) {
    let currentKeyPlay = $(".key-play.focused");
    !!currentKeyPlay.prev(".key-play").length && setFocusTo(currentKeyPlay.prev(".key-play"));

    let transformXFactor = (3 - currentKeyPlay.index()) + 1;
    // changeVideoStream(currentKeyPlay.prev(".video-card").attr("data-src").trim(), currentKeyPlay.prev(".video-card").attr("data-title").trim());
    let transformXValue = 17.5 * transformXFactor;
    (transformXValue > 0 ? transformXValue = 0 : null);

    let widthDiff = ($("#app-markup").width() - ($(".key-play").length * $(".key-play").outerWidth(true))) / 16;
    (transformXValue < widthDiff?transformXValue = widthDiff:null);

    currentKeyPlay.closest(".key-plays-list-inner").css({
      "transform": `translateX(${(transformXValue)}rem)`
    });

    highlightKeyPlayBar();
  }
}
function changeKeyPlayRight() {
  // console.log("right");
  if($(".key-play").hasClass("focused")) {
    let currentKeyPlay = $(".key-play.focused");
    !!currentKeyPlay.next(".key-play").length && setFocusTo(currentKeyPlay.next(".key-play"));

    let transformXFactor = (3 - currentKeyPlay.index()) - 1;
    // changeVideoStream(currentKeyPlay.prev(".video-card").attr("data-src").trim(), currentKeyPlay.prev(".video-card").attr("data-title").trim());
    let transformXValue = 17.5 * transformXFactor;
    (transformXValue > 0 ? transformXValue = 0 : null);
    
    let widthDiff = ($("#app-markup").width() - ($(".key-play").length * $(".key-play").outerWidth(true))) / 16;
    (transformXValue < widthDiff?transformXValue = widthDiff:null);

    console.log(transformXValue);
    currentKeyPlay.closest(".key-plays-list-inner").css({
      "transform": `translateX(${(transformXValue)}rem)`
    });

    highlightKeyPlayBar();
  }
}
function highlightKeyPlayBar() {
  $("[data-key-play-id]").removeClass("targetHightlight");
  $(`[data-key-play-id="${$(".key-play.focused").attr("id")}"]`).addClass("targetHightlight");
}

function goToGameStatCards() {
  highlightedElements.add("#show-game-stat-panel");
  // setFocusTo($("#game-stat-card1"));
  setFocusTo($(".game-stat-card").first());
  $(".card-container-inner").css({"transform": `translateY(0)`});
}
function goToGameFantasyCards() {
  highlightedElements.add("#show-game-fantasy-panel");
  // setFocusTo($("#game-fantasy-card1"));
  setFocusTo($(".game-fantasy-card").first());
  $(".card-container-inner").css({"transform": `translateY(0)`});
}
function goToGameScoreCards() {
  highlightedElements.add("#show-game-score-panel");
  // setFocusTo($("#game-score-card1"));
  setFocusTo($(".game-score-card").first());
  $(".card-container-inner").css({"transform": `translateY(0)`});
}
function goToGameOddsCards() {
  highlightedElements.add("#show-game-odds-panel");
  // setFocusTo($("#game-odds-card1"));
  setFocusTo($(".game-odds-card").first());
  $(".card-container-inner").css({"transform": `translateY(0)`});
}
function goToGameFeedsCards() {
  highlightedElements.add("#show-game-feeds-panel");
  // setFocusTo($("#game-feeds-card1"));
  setFocusTo($(".game-feeds-card").first());
  $(".card-container-inner").css({"transform": `translateY(0)`});
}
function scrollTabCardsDown(targetEl) {
  if(targetEl.hasClass("focused")) {
    // let currentStatCard = $(".game-stat-card.focused");
    let currentStatCard = targetEl.filter(".focused");
    if(!!currentStatCard.next(".stat-card").length) {
      setFocusTo(currentStatCard.next(".stat-card"));

      // let transformYFactor = currentStatCard.index() + 1;
      // let transformYValue = (parseFloat(currentStatCard.css("margin-top")) + (currentStatCard.outerHeight())) * transformYFactor;

      let transformYValue = (getTranslateXY(currentStatCard.closest(".card-container-inner")[0]).translateY - currentStatCard.outerHeight(true));


      currentStatCard.closest(".card-container-inner").css({
        "transform": `translateY(${(transformYValue)}px)`
      });
    }
  }
}
function scrollTabCardsUp(targetEl, parentTabId) {
  if(!!parentTabId && targetEl.index() === 0) {
    setFocusTo($(parentTabId));
  }
  if(targetEl.hasClass("focused")) {
    // let currentStatCard = $(".game-stat-card.focused");
    let currentStatCard = targetEl.filter(".focused");
    if(!!currentStatCard.prev(".stat-card").length) {
      setFocusTo(currentStatCard.prev(".stat-card"));

      // let transformYFactor = currentStatCard.index() - 1;
      // let transformYValue = (parseFloat(currentStatCard.css("margin-top")) + (currentStatCard.outerHeight())) * transformYFactor;

      let transformYValue = (getTranslateXY(currentStatCard.closest(".card-container-inner")[0]).translateY + currentStatCard.prev(".stat-card").outerHeight(true));

      currentStatCard.closest(".card-container-inner").css({
        "transform": `translateY(${(transformYValue)}px)`
      });
    }
  }
}

let mosaicTilesNum = 1;
let mosaicLimitReached = false;
function addToMosaic(targetEl) {
  if(!mosaicLimitReached) {
    let cleanedTargetEl = $(targetEl[0].outerHTML).removeAttr("id class").addClass("mosaic-tile-inner")[0];
    if(targetEl.hasClass("game-feeds-card")) {
      cleanedTargetEl = `<video tabindex="-1" class="video-stream html5-main-video" controlslist="nodownload" autoplay src="../videos/NBA2-2.mp4" muted></video>`;
    }
    mosaicTilesNum++;
    if(mosaicTilesNum >= 4) {
      // mosaicTilesNum = 2;
      mosaicLimitReached = true;
    }

    !!$(`.mosaic${mosaicTilesNum}`).length && $(`.mosaic${mosaicTilesNum}`).html(cleanedTargetEl);
    $(".mosaic-container").attr("data-tiles", mosaicLimitReached?4:mosaicTilesNum);

    if(targetEl.hasClass("game-score-card")) {
      setTimeout(function() {
        !!$(`.mosaic${mosaicTilesNum}`).length && $(`.mosaic${mosaicTilesNum}`).html(`<video tabindex="-1" class="video-stream html5-main-video" controlslist="nodownload" autoplay src="../videos/NBA2-2.mp4" muted></video>`);

        $(`.mosaic${mosaicTilesNum}`).find("video")[0].currentTime = 5;
      }, 2500);
    }

    $(".mosaic-tile").each((id, elem) => {
      console.log(!!$(elem).find(".mosaic-tile-inner").attr("data-mosaic23"));
      if(mosaicTilesNum > 1 && mosaicTilesNum < 4) {
        if(!!$(elem).find(".mosaic-tile-inner").attr("data-mosaic23")) {
          $(elem).find(".mosaic-tile-inner img").attr("src", $(elem).find(".mosaic-tile-inner").attr("data-mosaic23"));
        }
      } else if(mosaicTilesNum === 4) {
        if(!!$(elem).find(".mosaic-tile-inner").attr("data-mosaic4")) {
          $(elem).find(".mosaic-tile-inner img").attr("src", $(elem).find(".mosaic-tile-inner").attr("data-mosaic4"));
        }
      }
    });
  }
}
function removeFromMosaic(targetEl) {
  console.log(mosaicTilesNum);
  mosaicTilesNum--;
  mosaicLimitReached = false;
  console.log(mosaicTilesNum);
  if(mosaicTilesNum < 1) {
    mosaicTilesNum = 1;
  }
  console.log(mosaicTilesNum);
  $(".mosaic-container").attr("data-tiles", mosaicTilesNum);
}
// const pinnableItems = [];
function toggleMosaic(targetEl) {
  if(targetEl.hasClass("pinnable") && !mosaicLimitReached) {
    if(!targetEl.hasClass("pinned")) {
      // targetEl.addClass("pinned hide");
      targetEl.next().length?setFocusTo(targetEl.next()):setFocusTo(targetEl.prev());
      targetEl.remove();
      addToMosaic(targetEl);
    } else {
      targetEl.removeClass("pinned");
      removeFromMosaic(targetEl);
    }
  }
}

function playFeedCardVideo(targetEl) {
  // if(!!targetEl.attr("data-video-url") &&
  //    !!targetEl.attr("data-video-url").trim().length) {
  //   $(".mosaic1 .video-stream").attr("src", targetEl.attr("data-video-url"));
  // }
  if(!!targetEl.attr("data-yt-video-id") &&
     !!targetEl.attr("data-yt-video-id").trim().length) {
    player1.loadVideoById(targetEl.attr("data-yt-video-id"));

    $("#watch-metadata .secondary-text").text("5pm – 8pm · LeBronCast");
  }
}

function goToMosaicModePanel() {
  showRightPanel($("#mosaic-mode-panel"), $("#mosaic-mode-card1"));
  setFocusTo($("#mosaic-mode-card1"));
  $(".card-container-inner").css({"transform": `translateY(0)`});
}

function checkMosaicTile() {

  if(isVisible($("#mosaic-tile4"))) {
    setFocusTo($("#mosaic-tile2"));
  } else if(isVisible($("#mosaic-tile2"))) {
    setFocusTo($("#mosaic-tile1"));
  } else {
    hideRightPanel();
  }
}
function mosaicTile1Right() {
  if(isVisible($("#mosaic-tile4"))) {
    setFocusTo($("#mosaic-tile2"));
  } else {
    setFocusTo($("#show-game-stat-panel"));
  }
}
function mosaicTile1Down() {
  if(isVisible($("#mosaic-tile4"))) {
    setFocusTo($("#mosaic-tile3"));
  } else {
    setFocusTo($("#mosaic-tile2"));
  }
}
function mosaicTile2Left() {
  if(isVisible($("#mosaic-tile4"))) {
    setFocusTo($("#mosaic-tile1"));
  }
}
function mosaicTile2Right() {
  if(isVisible($("#mosaic-tile4")) || !isVisible($("#mosaic-tile3"))) {
    setFocusTo($("#show-game-stat-panel"));
  } else {
    setFocusTo($("#mosaic-tile3"));
  }
}
function mosaicTile2Up() {
  if(!isVisible($("#mosaic-tile4"))) {
    setFocusTo($("#mosaic-tile1"));
  }
}
function mosaicTile2Down() {
  if(isVisible($("#mosaic-tile4"))) {
    setFocusTo($("#mosaic-tile4"));
  }
}
function mosaicTile3Left() {
  if(!isVisible($("#mosaic-tile4"))) {
    setFocusTo($("#mosaic-tile2"));
  }
}
function mosaicTile3Right() {
  if(isVisible($("#mosaic-tile4"))) {
    setFocusTo($("#mosaic-tile4"));
  } else {
    setFocusTo($("#show-game-stat-panel"));
  }
}

function checkMosaicTile1() {
  if(isVisible($("#mosaic-tile2"))) {
    setFocusTo($("#mosaic-tile1"));
  } else {
    hideRightPanel();
  }
}
function checkMosaicTile2() {
  if(isVisible($("#mosaic-tile2"))) {
    setFocusTo($("#mosaic-tile2"));
  } else {
    setFocusTo($("#show-game-stat-panel"));
  }
}
function checkMosaicTile3() {
  if(isVisible($("#mosaic-tile3"))) {
    setFocusTo($("#mosaic-tile3"));
  } else {
    setFocusTo($("#show-game-stat-panel"));
  }
}
function checkMosaicTile4() {
  if(isVisible($("#mosaic-tile4"))) {
    setFocusTo($("#mosaic-tile4"));
  } else {
    setFocusTo($("#show-game-stat-panel"));
  }
}

function makeTileFullScreen(targetEl) {
  $(".mosaic-tile").removeClass("full-screen");
  targetEl.addClass("full-screen");
  if(targetEl.attr("id") !== "mosaic-tile1") {
    $("#mosaic-tile1").addClass("full-screen hide");
    // $("#mosaic-tile1 .video-stream").attr("src", targetEl.find(".video-stream").attr("src"));
    // $("#mosaic-tile1 .video-stream")[0].currentTime = targetEl.find(".video-stream")[0].currentTime;
    player1.loadVideoById("vu6KuHyrTfw", (targetEl.find("video")[0].currentTime));
  }
  hideRightPanel();

  setTimeout(() => {
    $(".mosaic-tile").addClass("no-animation");
    $(".mosaic-container").attr("data-tiles", (mosaicTilesNum = 1));
    $("#mosaic-tile1").removeClass("hide");
    $(".mosaic-tile").removeClass("full-screen focused");
    $(".stat-card").removeClass("pinned");
  }, 500);
  setTimeout(() => {
    $(".mosaic-tile").removeClass("no-animation");
  }, 550);
}

function expandBrowsingSheet() {
  $("body").removeClass("collapse-browsing-sheet");
  // highlightedElements.add("#top-nav-browse");
  changeShelfDown(resetTop = true);

  // pauseCarousal();
}
function collapseBrowsingSheet() {
  $("body").addClass("collapse-browsing-sheet");
  $(".shelves").css({"transform": "translateY(0)"});
  setFocusTo($("#top-nav-browse"));

  // startCarousal();
}

function changeShelfLeft() {
  if($(".shelf-card").hasClass("focused") && !!$(".shelf-card.focused").prev(".shelf-card").length) {
    let currentElement = $(".shelf-card.focused");
    !!currentElement.prev(".shelf-card").length && setFocusTo(currentElement.prev(".shelf-card"));

    let prevIndex = !!currentElement.prev(".shelf-card") && currentElement.prev(".shelf-card").index();
    (prevIndex<0?prevIndex=0:prevIndex)
    currentElement.closest(".shelf").attr("data-current-card-index", prevIndex);

    let transformXFactor = currentElement.index() - 1;
    let transformXValue = currentElement.outerWidth(true) * -transformXFactor;
    (transformXValue > 0 ? transformXValue = 0 : null);
    
    currentElement.closest(".shelf-cards").css({
      "transform": `translateX(${(transformXValue)}px)`
    });

    checkSportsInfo(currentElement.prev(".shelf-card"));
  }
}
function changeShelfRight() {
  if($(".shelf-card").hasClass("focused") && !!$(".shelf-card.focused").next(".shelf-card").length) {
    let currentElement = $(".shelf-card.focused");
    !!currentElement.next(".shelf-card").length && setFocusTo(currentElement.next(".shelf-card"));

    let nextIndex = !!currentElement.next(".shelf-card") && currentElement.next(".shelf-card").index();
    (nextIndex<0?nextIndex=0:nextIndex)
    currentElement.closest(".shelf").attr("data-current-card-index", nextIndex);

    let transformXFactor = currentElement.index() + 1;
    let transformXValue = currentElement.next(".shelf-card").outerWidth(true) * -transformXFactor;
    (transformXValue > 0 ? transformXValue = 0 : null);
    
    currentElement.closest(".shelf-cards").css({
      "transform": `translateX(${(transformXValue)}px)`
    });

    checkSportsInfo(currentElement.next(".shelf-card"));
  }
}
function changeShelfUp() {
  if($(".shelf-card").hasClass("focused")) {
    let currentElement = $(".shelf-card.focused").closest(".shelf");
    
    $(".shelf").removeClass("focus-within");
    currentElement.prev(".shelf").addClass("focus-within");
    if(!!currentElement.prev(".shelf").length) {
      let targetCardEl = $(currentElement.prev(".shelf").find(".shelf-card").get(currentElement.prev(".shelf").attr("data-current-card-index")));
      setFocusTo(targetCardEl);

      // let transformYFactor = currentElement.index() - 1;
      // let transformYValue = currentElement.outerHeight() * -transformYFactor;
      // (transformYValue > 0 ? transformYValue = 0 : null);

      let transformYValue = (getTranslateXY(currentElement.closest(".shelves")[0]).translateY + currentElement.prev(".shelf").outerHeight(true) - 50);
      (transformYValue > 0 ? transformYValue = 0 : null);
      currentElement.closest(".shelves").css({
        // "transform": `translateY(${(transformYValue)}px)`
        "transform": `translateY(${transformYValue}px)`
      });
    } else {
      $("body").addClass("collapse-browsing-sheet");
      setFocusTo($("#hero-section-watch-button"));
      // highlightedElements.add("#show-game-stat-panel");
      // startCarousal();
    }
  }
}
function changeShelfDown(resetTop = false) {
  // if($(".shelf-card.focused").closest(".shelf").next(".shelf").attr("id") !== "movies-shelf") {
    if($(".shelf-card").hasClass("focused") && !resetTop) {
      let currentElement = $(".shelf-card.focused").closest(".shelf");

      $(".shelf").removeClass("focus-within");
      currentElement.next(".shelf").addClass("focus-within");
      if(!!currentElement.next(".shelf").length) {
        let targetCardEl = $(currentElement.next(".shelf").find(".shelf-card").get(currentElement.next(".shelf").attr("data-current-card-index")));
        setFocusTo(targetCardEl);

        // let transformYFactor = currentElement.index() + 1;
        // let transformYValue = currentElement.outerHeight() * -transformYFactor;
        // (transformYValue > 0 ? transformYValue = 0 : null);

        let transformYValue = (getTranslateXY(currentElement.closest(".shelves")[0]).translateY - currentElement.outerHeight(true) + 50);
        currentElement.closest(".shelves").css({
          // "transform": `translateY(${(transformYValue)}px)`
          "transform": `translateY(${transformYValue}px)`
        });
      }
    } else {
      $("#continue-watching-shelf").addClass("focus-within");
      setFocusTo($($("#continue-watching-shelf .shelf-card").get($("#continue-watching-shelf").attr("data-current-card-index"))));
    }
  // }
}
function checkSportsInfo(targetEl) {
  $(".selected-card-metadata .selected-card-metadata-stat-image").addClass("hide");
  switch (targetEl.attr("id")) {
    case "shelf-card3-1":
      $(".selected-card-metadata .selected-card-title").text("Formula 1 Aramco United States Grand Prix");
      $(".selected-card-metadata .selected-card-details").text("ESPN2 · 6am – 7:30am · Aired Sun, Sep 11");
      $(".selected-card-metadata .selected-card-metadata-stat-image").attr("src", "img/home-page/Stats_Lewis_Hamilton.png");
      setTimeout(() => {
        $(".selected-card-metadata .selected-card-metadata-stat-image").removeClass("hide");
      }, 100);
      break;

    case "shelf-card3-2":
      $(".selected-card-metadata .selected-card-title").text("Golden State Warriors at Boston Celtics");
      $(".selected-card-metadata .selected-card-details").text("ESPN · 5pm – 8pm");
      $(".selected-card-metadata .selected-card-metadata-stat-image").attr("src", "img/home-page/Stats_GSW.png");
      setTimeout(() => {
        $(".selected-card-metadata .selected-card-metadata-stat-image").removeClass("hide");
      }, 100);
      break;

    case "shelf-card3-3":
      $(".selected-card-metadata .selected-card-title").text("US Open");
      $(".selected-card-metadata .selected-card-details").text("ESPN · 5pm – 8pm");
      $(".selected-card-metadata .selected-card-metadata-stat-image").attr("src", "img/home-page/Stats_us_open.png");
      setTimeout(() => {
        $(".selected-card-metadata .selected-card-metadata-stat-image").removeClass("hide");
      }, 100);
      break;

    case "shelf-card3-4":
      $(".selected-card-metadata .selected-card-title").text("World Cup");
      $(".selected-card-metadata .selected-card-details").text("FOX · 5pm – 8pm");
      $(".selected-card-metadata .selected-card-metadata-stat-image").attr("src", "img/home-page/Stats_fifa.png");
      setTimeout(() => {
        $(".selected-card-metadata .selected-card-metadata-stat-image").removeClass("hide");
      }, 100);
      break;

    case "shelf-card3-5":
      $(".selected-card-metadata .selected-card-title").text("Sports Center");
      $(".selected-card-metadata .selected-card-details").text("ESPN · 5pm – 8pm");
      $(".selected-card-metadata .selected-card-metadata-stat-image").attr("src", "img/home-page/Stats_GSW.png");
      break;

    case "shelf-card3-6":
      $(".selected-card-metadata .selected-card-title").text("Los Angeles Dodgers vs Milwaukee Brewers");
      $(".selected-card-metadata .selected-card-details").text("ESPN · 5pm – 8pm");
      $(".selected-card-metadata .selected-card-metadata-stat-image").attr("src", "img/home-page/Stats_GSW.png");
      break;

    // case "shelf-card3-7":
    //   $(".selected-card-metadata .selected-card-title").text("aaa");
    //   $(".selected-card-metadata .selected-card-details").text("ESPN · 5pm – 8pm");
    //   $(".selected-card-metadata .selected-card-metadata-stat-image").attr("src", "img/home-page/Stats_GSW.png");
    //   break;

    default:
      break;
  }
}
function openPlayerPage() {
  if(!!$(".focused").attr("data-url")) {
    window.location.href = $(".focused").attr("data-url");
    sessionStorage.setItem("lastFocusedCard", $(".focused").attr("id"));
    sessionStorage.setItem("showRightPanelOnPageLoad", true);
  }
}


function getTranslateXY(element) {
    const style = window.getComputedStyle(element)
    const matrix = new DOMMatrixReadOnly(style.transform)
    return {
        translateX: matrix.m41,
        translateY: matrix.m42
    }
}

function showEPGCellDetails(cellId) {
  switch (cellId) {
    case "#epg-table-cell1-2":
      $("#epg-details-section").removeClass("hide");
      $("#epg-recommended-shelf").addClass("hide");
      break;
  
    default:
      break;
  }
}

function hideEPGCellDetails() {
    $("#epg-details-section").addClass("hide");
    $("#epg-recommended-shelf").removeClass("hide");
}

function showMovieDetailsSheet() {
  $("#side-sheet").addClass("show");
  setFocusTo($("#side-sheet-watch-live"));
}
function hideMovieDetailsSheet() {
  $("#side-sheet").removeClass("show");
  setFocusTo($("#shelf-card4-1"));
}

function showMovieDetailsPage() {
  hideMovieDetailsSheet();
  $("#movie-details-page").removeClass("hide");
  setFocusTo($("#movie-details-page-watch-live"));
}
function hideMovieDetailsPage() {
  $("#movie-details-page").addClass("hide");
  setFocusTo($("#shelf-card4-1"));
}

function expandMovieDetailsPageSheet() {
  $("#movie-details-page-sheet").addClass("expanded");
  $(".movie-details-shelf").addClass("focus-within");
  setFocusTo($("#movie-details-card1-1"));
}
function collapseMovieDetailsPageSheet() {
  $("#movie-details-page-sheet").removeClass("expanded");
  setFocusTo($("#movie-details-page-watch-live"));
}