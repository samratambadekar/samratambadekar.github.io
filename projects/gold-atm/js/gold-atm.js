
$(document).ready(function() {
  let verticalGolds = Math.round($(".screensaver").height() / $(".gold-symbol").outerHeight(true)) * 2;
  let horizontalGolds = Math.ceil($(".screensaver").width() / 90) - 1;
  
  const screensaverColumn = `<div class="screensaver-column"></div>`;
  const goldSymbol = `<div class="gold-symbol">
        <img src="./img/Au.svg" class="gold-symbol-img">
      </div>`;

  for(let i = 0; i < horizontalGolds; i++) {
    $(".screensaver").append(screensaverColumn);
    // $(".screensaver-column").html();
  }
  for(let i = 0; i < verticalGolds; i++) {
    $(".screensaver-column").append(goldSymbol);
    // console.log(i % 2=== 1);
    // if(i%2 === 1) {
    //   $(".screensaver-column").addClass("reverse");
    // }
    // $(".screensaver-column").each(function() {
      // $(this).append(goldSymbol);
      // $(this).innerHTML(goldSymbol);
      // console.log($(this));
    // });
  }

  $(".screensaver-column").each(function(evt) {
    ($(this).index() % 2) && $(this).addClass("reverse");
  })


  $("body").on("mouseover", ".gold-symbol", function(evt) {
    evt.stopPropagation();
    $(".gold-symbol").addClass("dimmed");
    $(this).removeClass("dimmed");
  });
  $("body").on("mouseover mouseout", function(evt) {
    // evt.stopPropagation();
    $(".gold-symbol").removeClass("dimmed");
  });


  $("body").on("mouseover", ".gold-symbol", function(evt) {
    evt.stopPropagation();
    $(".start-screen-au").css({
      position: "absolute",
      top: $(this).offset().top,
      left: $(this).offset().left,
      transform: 'scale(0.5)',
      opacity: 0
    });
  });

  let screenSaverTimeout = null;
  $("body").on("click mousemove", function(evt) {
    clearTimeout(screenSaverTimeout);

    if($(".screensaver").hasClass("hide")) {
      screenSaverTimeout = setTimeout(() => {
        $(".screensaver").click();
        $(".start-screen-au-placeholder").removeClass("show-all");
        $(".start-screen").removeClass("buy-screen");
        $(".toggle-button-type").removeClass("icon-button");
      // }, 90000);
      }, 30000);
    }
  });

  $("body").on("click", ".gold-symbol", function(evt) {
    evt.stopPropagation();
    $(".start-screen-au").css({
      position: "absolute",
      top: $(".start-screen-au-placeholder").position().top,
      left: $(".start-screen-au-placeholder").position().left,
      transform: 'scale(1)',
      opacity: 1
    });
    $("body").addClass("no-sc-animation");
    $(".gold-symbol").addClass("invisible");
    // $(this).removeClass("invisible");
    $(".screensaver").addClass("hide");

    setTimeout(() => {
      $(".start-screen-au-placeholder").addClass("show-all");
    }, 500);

  });

  $("body").on("click", ".screensaver", function(evt) {
    evt.stopPropagation();
    // $(".gold-symbol").css({
    //   position: "relative",
    //   top: "auto",
    //   left: "auto",
    // });
    // $(".start-screen-au").removeAttr("style");
    $(this).removeClass("hide");
    $("body").removeClass("no-sc-animation");
    $(".gold-symbol").removeClass("invisible");

    console.log($(".start-screen-au-placeholder").position().top);
    console.log($(".start-screen-au").position().top);
  });

  // $("body").on("click", ".toggle-button-type", function(evt) {
  //   $(this).toggleClass("icon-button");
  // });

  $("body").on("click", ".buy-now", function(evt) {
    $(".start-screen").addClass("buy-screen");
    $(".toggle-button-type").addClass("icon-button");
    
    $(".start-screen-au").css({
      position: "relative",
      top: "auto",
      left: "auto",
      transform: 'scale(0.5)',
    });
  });

  getGoldPrice();
  setInterval(() => {
    getGoldPrice();
  }, 30000);
});

function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  seconds = seconds < 10 ? '0'+seconds : seconds;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  // let strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
  return strTime;
}

function getGoldPrice() {
  $(".last-timestamp").text(formatAMPM(new Date));

  $.getJSON( "https://data-asg.goldprice.org/dbXRates/USD", function(data) {
    console.log(data.items[0].xauPrice);
    $(".price-ounce").text(data.items[0].xauPrice.toFixed(2));
    $(".price-gram").text((data.items[0].xauPrice / 31.1034768).toFixed(2));
    $(".price-kg").text((1000 * data.items[0].xauPrice / 31.1034768).toFixed(2));
  })
  .fail(function() {
    console.log("ajax error");
  });
}

// 31.1034768