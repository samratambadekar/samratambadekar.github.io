$(document).ready(function() {
  $(".preview_mode").on("click", ".tab", function() {
    // var parentEl = $(this).closest(".tabs-wrap");
    // parentEl.find(".tab").removeClass("on");
    // $(this).addClass("on");

    $(".preview_mode [data-preview-tab]").addClass("hide");
    $(".preview_mode [data-preview-tab='" + $(this).attr("data-preview-tab") + "']").removeClass("hide");
  });

  $("body").on("click", ".btn-preview", function() {
    $(".preview_mode").toggleClass("hide");
    if($(this).closest(".ndse_page").hasClass("sendToRecipients")) {
      $(".preview_mode .tab[data-preview-tab='Email']").click();
    } else {
      $(".preview_mode .tab[data-preview-tab='Documents']").click();
    }
  });
});
