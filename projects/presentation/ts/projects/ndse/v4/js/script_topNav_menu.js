$(document).ready(function() {
  $("body").on("click", function(evt) {
    evt.stopPropagation();
    $(".menu").addClass("invisible");
  });

  $(".site-header .actions").on("click", ".user_help, .user_profile", function(evt) {
    evt.stopPropagation();
    $(".topNav-menu > div").addClass("hide");
    $(".topNav-menu ." + $(this).attr("data-menu-id")).removeClass("hide");

    $(".topNav-menu").css({"right": $(document).outerWidth() - ($(this).offset().left + ($(this).width() + 20)), "top": $(".site-header").height() + 5});

    $(".topNav-menu").removeClass("invisible");
  });
});
