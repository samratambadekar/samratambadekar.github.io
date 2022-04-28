$(document).ready(function() {
  invokeDraggable();

  $(".cards .card").each(function(idx, elem) {
    $(elem).find(".card_item_count").text($(elem).find(".card_items .card_item").length);
  });

  $("body").on("mousedown touchstart", ".concept_a .card_header", function(evt) {
    var targetEl = $(this).closest(".card");
    targetEl.removeClass("disable_dragging");
    var otherCardEl = (targetEl.prev(".card").length?targetEl.prev(".card"):targetEl.next(".card"));

    if (evt.originalEvent !== undefined) {
      swapAnimationReverse = false;
    }
    // otherCardEl.addClass("disable_dragging");
    // targetEl.removeClass("disable_dragging");
    // invokeDraggable();

    var isTargetCardActive = targetEl.hasClass("active");

    if(!isTargetCardActive) {
      $(this).closest(".cards").find(".card").removeClass("active").addClass("disable_dragging");
      if(swapAnimationReverse) {
        // otherCardEl.addClass("swap_animation_reverse");
        swapAnimationReverse = false;
      } else {
        otherCardEl.addClass("swap_animation");
      }
      window.setTimeout(function() {
        targetEl.addClass("transition_to_front active");
      }, 250);
      window.setTimeout(function() {
        targetEl.removeClass("transition_to_front");
        otherCardEl.removeClass("swap_animation swap_animation_reverse");
      }, 750);
    }
  });


  var scrollPos = 0;
  var swapAnimationReverse = false;
  // $("body").on("mousedown scroll", ".concept_a .card_items", function(evt) {
  $(".concept_a .card_items").on("mousedown scroll", function(evt) {
    evt.stopPropagation();
    var scrollDirection = "";
    if (this.scrollTop < scrollPos) {
  		scrollDirection = 'UP';
      swapAnimationReverse = false;
    } else {
  		scrollDirection = 'DOWN';
      swapAnimationReverse = true;
    }
  	scrollPos = this.scrollTop;

    $(this).closest(".card").addClass("disable_dragging");

    if(scrollDirection.toUpperCase() == "DOWN" && $(this).scrollTop() + $(this).height() >= (this.scrollHeight - 10)) {
      // $(this).closest(".card").removeClass("disable_dragging");
      // this.scrollTop -= 1;
      // console.log("unlock DOWN");
      $(this).closest(".card").addClass("disable_dragging");
    } else if(scrollDirection.toUpperCase() == "UP" && $(this).scrollTop() <= 10) {
      $(this).closest(".card").removeClass("disable_dragging");
      // this.scrollTop += 1;
      console.log("unlock UP");
    } else {
      $(this).closest(".card").addClass("disable_dragging");
      console.log("lock dragging");
    }
    // console.log($(this).scrollTop() + $(this).height());
    // console.log(this.scrollHeight);

  });

  $("body").on("click mousedown", ".bottom_menu", function(evt) {
    evt.stopPropagation();
    $("body").addClass("show_menu");
  });
  $("body").on("click mousedown", ".menu_close", function(evt) {
    $("body").removeClass("show_menu");
  });
});

function invokeDraggable() {
  // $(".card_draggable").draggable({
  interact(".concept_a .card_draggable:not(.disable_dragging)").draggable({
    lockAxis: "y",
    onend: function(evt) {
      $(evt.target).addClass("transition_to_front").css({"left": 0, "top": 0});
      evt.target.setAttribute('data-x', 0);
      evt.target.setAttribute('data-y', 0);

      window.setTimeout(function() {
        $(evt.target).removeClass("transition_to_front");
      }, 300);
      // target.style.webkitTransform = target.style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)';
      $(".cards .card").addClass("disable_dragging");

      var currentCardScrollPos = $(evt.target).find(".card_items").scrollTop();
      if(currentCardScrollPos <= 5) {
        $(evt.target).find(".card_items").scrollTop(15);
      } else {
        $(evt.target).find(".card_items").scrollTop(currentCardScrollPos - 25);
      }
      // console.log(currentCardScrollPos);
      // $(".cards .card_items").scrollTop(10);

      if(boolSwapCards) {
        swapTargetCard.find(".card_header").mousedown();
        boolSwapCards = false;
      }
    },
    onmove: dragMoveListener
  });

  $("body").on("click", ".top_nav .btn-next", function(evt) {
    if($(this).closest(".top_nav").find(".nav-middle .nav-progress-dot.selected").length < 1) {
      $(this).closest(".top_nav").find(".nav-middle .nav-progress-dot").first().addClass("selected");
    } else {
      var targetEl = $(this).closest(".top_nav").find(".nav-middle .nav-progress-dot.selected");
      targetEl.removeClass("selected");
      targetEl.next(".nav-progress-dot").addClass("selected");
    }
  });
}

var boolSwapCards = false;
var swapTargetCard;

function dragMoveListener (evt) {
  var target = evt.target,
  // keep the dragged position in the data-x/data-y attributes
  x = (parseFloat(target.getAttribute('data-x')) || 0) + evt.dx,
  y = (parseFloat(target.getAttribute('data-y')) || 0) + evt.dy;

  // // translate the element
  // target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
  $(target).css({"left": x, "top": y});

  swapTargetCard = ($(target).prev(".card").length?$(target).prev(".card"):$(target).next(".card"));

  if(y > 0) {
    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }
  // if(y >= 150 || y <= -100) {
  if(y >= 150) {
    boolSwapCards = true;
    $(target).closest(".card").removeClass("disable_dragging");
    // swapTargetCard.find(".card_header").mousedown();
  } else if(y > 0) {
    $(target).closest(".card").addClass("disable_dragging");
    boolSwapCards = false;
  }
}
