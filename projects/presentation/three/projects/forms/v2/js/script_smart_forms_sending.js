$(document).ready(function() {
  console.log("smart forms");
  var TOTAL_PAGES = $(".pages").children().length;

  $(".bottom-bar").on("click", ".btn-next", function() {
    var target = $(".page.showing");
    var currentPage = parseInt(target.attr("data-page-num"));
    var nextPage = currentPage + 1;

    $(".btn-next").text("Next");
    // if(currentPage == 1) {
      $(".bottom-bar > div").removeClass("hide");
      $(".btn-next").addClass("disabled");
    // }
    if(nextPage <= TOTAL_PAGES) {
      $(".page").removeClass("showing");
      $(".page[data-page-num=" + nextPage + "]").addClass("showing");
      $(".pages").css("transform", "translateX(" + (currentPage * -100) + "%)");
    }

    if(nextPage == 3) {
      checkInputEmpty();
    }
    if(nextPage == 4) {
      $(".btn-next").text("Sign");
      $(".btn-next").removeClass("disabled");
    }
    if(nextPage == 5) {
      $(".btn-next").text("Adopt & Sign");
      $(".btn-next").removeClass("disabled");
      $(".bottom-bar > div").addClass("hide");
      $(".btn-next").removeClass("hide");
    }

    // $(".progress-indicator")
    // var currentVal = parseInt($(this).text());
    animateNumber($(".progress-indicator .number"), parseInt($(".progress-indicator .number").text()), (nextPage/TOTAL_PAGES)*100);
  });

  $(".bottom-bar").on("click", ".btn-prev", function() {
    var target = $(".page.showing");
    var currentPage = parseInt(target.attr("data-page-num"));
    var prevPage = currentPage - 1;

    $(".btn-next").removeClass("disabled");
    if(currentPage == 2) {
      $(".bottom-bar > div").addClass("hide");
      $(".btn-next").removeClass("hide").text("Start I-9");
    }
    if(prevPage > 0) {
      $(".page").removeClass("showing");
      $(".page[data-page-num=" + prevPage + "]").addClass("showing");
      $(".pages").css("transform", "translateX(" + ((prevPage - 1) * -100) + "%)");
    }

    animateNumber($(".progress-indicator .number"), parseInt($(".progress-indicator .number").text()), (prevPage/TOTAL_PAGES)*100);
  });

  $("article").on("click", ".input-text", function() {
    var element = $(this);
    setTimeout(function() {
      $("article").scrollTop(element.position().top - 50);
    }, 300);
  });
  $("article").on("click", ".sign_here", function() {
    $(".btn-next").click();
  });

  $("article").on("input", ".page .input-text", function() {
    checkInputEmpty();
  });

  function checkInputEmpty() {
    var infoFilled = true;
    $(".input-text").each(function(i, d) {
      // console.log($(d).val());
      if($(d).val().trim() == "") {
        infoFilled = false;
      }
    });

    if(infoFilled) {
      $(".btn-next").removeClass("disabled");
    } else {
      $(".btn-next").addClass("disabled");
    }
  }

  function animateNumber(element, fromNumber1, toNumber1) {
    var fromNumber = parseInt(fromNumber1);
    var toNumber = parseInt(toNumber1);
  	element.text(fromNumber);

  	if(toNumber > fromNumber) {
  		animateNumber(element, fromNumber, toNumber-1);
  		window.setTimeout(function() {
  			element.text(toNumber);
  		}, toNumber * 300/(fromNumber+20));
  	}

  	if(toNumber < fromNumber) {
      animateNumber(element, fromNumber, toNumber+1);
  		window.setTimeout(function() {
  			element.text(toNumber);
  		}, (300 * fromNumber) / toNumber);
  	}
  };

  $(".select-options").on("click", "li", function() {
    var element = $(this);
    $(".select-options li").removeClass("selected");
    element.addClass("selected");

    $(".btn-next").removeClass("disabled");
  });
});
