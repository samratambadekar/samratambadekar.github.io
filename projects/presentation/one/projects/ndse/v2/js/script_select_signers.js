$(document).ready(function() {
  $(".selectSigners").on("click", ".card", function(evt) {
    if($(this).hasClass("not_implemented")) {
      $(".selectSigners .btn-next").addClass("feature_unavailable");
    }
    $(this).toggleClass("selected");

    $(".selectSigners .btn-next").addClass("disabled");
    $(".card").each(function(idx,elem) {
      if($(elem).hasClass("selected")) {
        $(".selectSigners .btn-next").removeClass("disabled");
      }

      if($(elem).hasClass("selected") && !$(elem).hasClass("not_implemented")) {
        $(".selectSigners .btn-next").removeClass("feature_unavailable");
      }
    });
  });
});
