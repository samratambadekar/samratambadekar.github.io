$(document).ready(function() {
  $(".selectSigners").on("click", ".card", function(evt) {
    $(this).toggleClass("selected");
    $(this).find(".cb_input[type='checkbox']").click();

    $(".selectSigners .btn-next").addClass("disabled");
    $(".card").each(function(idx,elem) {
      if($(elem).hasClass("selected")) {
        $(".selectSigners .btn-next").removeClass("disabled");
      }
    });
  });

  $(".selectSigners").on("click", ".card .cb_input", function(evt) {
    evt.stopPropagation();
  });
});
