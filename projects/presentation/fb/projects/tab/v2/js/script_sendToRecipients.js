$(document).ready(function() {
  var targetUserEl;

  $("body").on("click", ".tab", function() {
    var parentEl = $(this).closest(".tabs-wrap");
    var target = parentEl.next(".section");
    parentEl.find(".tab").removeClass("on");
    $(this).addClass("on");

    target.children("div").addClass("hide");
    target.find("[olive-tab-id=" + $(this).attr("olive-tab-id") + "]").removeClass("hide");

  });

  $("body").on("click", ".private-message-menu .btn-trigger", function(evt) {
    evt.stopPropagation();
    $(this).next(".menu").toggleClass("invisible");
  });
  $("body").on("click", ".private-message-menu .menu .item", function(evt) {
    $(".ds-modal-background").removeClass("invisible");
    $(".modal-private-message").removeClass("hide_modal");
    $(".modal-private-message .pm-recipient-name").text($(this).find(".pm-recipient-name").text());
    targetUserEl = $(this);
  });

  $("body").on("click", ".modal-private-message .btn-done", function(evt) {
    if($(".modal-private-message .modal_content .input-textarea").val().trim().length > 0) {
      targetUserEl.find(".icon").removeClass("invisible");
    } else {
      targetUserEl.find(".icon").addClass("invisible");
    }
    $(".modal-private-message .modal_content .input-textarea").val("");
  });

  $(".sendToRecipients").on("click", ".accordion", function(evt) {
    evt.stopPropagation();
    $(this).toggleClass("open closed");

    if($(this).hasClass("open")) {
      // $(this).next(".drawer").css({"height": $(this).next(".drawer").find(".drawer-wrapper").outerHeight() + 25});
      $(this).next(".drawer").css({"height": "auto"});
    } else if($(this).hasClass("closed")) {
      $(this).next(".drawer").css({"height": 0});
    }
  });

  $(".sendToRecipients").on("click", ".envelope_section_name .link a", function(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    $(".ndse_page").removeClass("selected");
    $(".ndse_page[data-step-name='Select']").first().addClass("selected");
    goToSelectedPage(0);
    // flowProgressIndicator();
    window.location.href = window.location.href.split("#")[0] + "#" + $(this).attr("data-step-num");
  });
});
