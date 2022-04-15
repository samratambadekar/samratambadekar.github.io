
var TOTAL_PAGES = $(".pages").children().length;

$(document).ready(function() {
  $(".bottom-bar").on("click", ".btn-next", function() {
    var target = $(".page.showing");
    var nextTarget = target.next();
    var currentPage = parseInt(target.attr("data-page-num"));
    var nextPage = currentPage + 1;

    $(".btn-next").addClass("disabled");
    $(".bottom-bar").removeClass("fixed");

    $(".btn-next").text("Next");
    $(".btn-next").addClass("btn-primary").removeClass("btn-main");
    $(".bottom-bar > div").removeClass("hide");
    if(nextPage <= TOTAL_PAGES) {
      $(".page").removeClass("showing");
      $(".page[data-page-num=" + nextPage + "]").addClass("showing");
      $(".pages").css("transform", "translateX(" + (currentPage * -100) + "%)");
    }
  });

  $(".bottom-bar").on("click", ".btn", function() {
    $("body, article, .page").scrollTop(0);
    $(window).scrollTop(0);
  });

  $("body").on("click", ".screen", function() {
    $(this).toggleClass("disabled");
  });

  $(".bottom-bar").on("click", ".btn-prev", function() {
    var target = $(".page.showing");
    var currentPage = parseInt(target.attr("data-page-num"));
    var prevPage = currentPage - 1;
    var prevTarget = target.prev();

    if(prevPage > 0) {
      $(".page").removeClass("showing");
      $(".page[data-page-num=" + prevPage + "]").addClass("showing");
      $(".pages").css("transform", "translateX(" + ((prevPage - 1) * -100) + "%)");
    }

    $(".btn-next").removeClass("disabled");
    $(".btn-next").addClass("btn-primary").removeClass("btn-main");
  });

  $("body").on("keydown", function(evt) {
    if(evt.keyCode == 39 || evt.which == 39) {
      $(".btn-next").click();
    }
    if(evt.keyCode == 37 || evt.which == 37) {
      $(".btn-prev").click();
    }
  });
});

function goToPage(number) {
  var target = $(".page.showing");
  var currentPage = parseInt(target.attr("data-page-num"));
  var buttonTarget;
  var difference = 0;
  if(number < 1 || number > TOTAL_PAGES) {
    return;
  }

  if(number < currentPage) {
    difference = currentPage - number;
    buttonTarget = $(".btn-prev");
  } else if(number > currentPage) {
    difference = number - currentPage;
    buttonTarget = $(".btn-next");
  }

  for(var i=0;i<difference;i++) {
    buttonTarget.click();
  }
}
