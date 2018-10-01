var firstTimeAdded = true;

$(document).ready(function() {
  $(".selectRecipients").on("keydown", ".recipient_number", function(evt) {
    evt.stopPropagation();
    if(evt.keyCode === 13 || evt.which === 13) {
      evt.preventDefault();
      $(this).blur();
    }

  });

  $(".selectRecipients").on("click", ".add_recipient", function(evt) {

    var newRecipient;
    var recipient_index = $(this).closest(".recipients").find(".recipient").last().index();
    if(recipient_index > 9 || recipient_index < 0) {
      recipient_index = 0;
    }
    // console.log(recipient_index);

    newRecipient = $('<div class="recipient hide_recipient"><div class="recipient_number" contenteditable="true"></div><div class="recipient_color swatch swatch-ext-' + recipient_index + '"></div><div class="recipient_drag"><div class="icon icon-handle"></div></div><div class="recipient_picture"><div class="invisible userInitial">AE</div><img src="images/svg/profile_icon.svg"/></div><div class="recipient_details"><div class="form_item-iconRight"><div class="recipient_name"><input type="text" class="input-text" placeholder="Name"/></div><span class="icon icon-contacts"></span></div><div class="recipient_email"><input type="text" class="input-text" placeholder="Email"/></div></div><div class="recipient_task"><button class="btn btn-minor btn-trigger btn-menu"><span class="icon icon-needsmysignature"></span><span class="ng-binding">Needs to Sign</span></button><div style="" class="menu ng-scope below left invisible menuRecipientTypes"><ul role="menu" class=""><li role="menuitem"><a class="item"><span class="icon icon-needsmysignature"></span><span>Needs to Sign</span></a></li><li role="menuitem"><a class="item"><span class="icon icon-user-sign"></span><span>In-person Signer</span></a></li><li role="menuitem" class=""><a class="item"><span class="icon icon-copied"></span><span>Receives a Copy</span></a></li><li role="menuitem" class="hidden"><a class="item"><span class="icon icon-eye-open"></span><span>Needs to View</span></a></li></ul></div></div><div class="recipient_actions"><button class="btn btn-minor btn-menu"><span class="icon icon-ellipsis-vert"></span></button><div style="" class="menu ng-scope menuRecipientActions invisible"><ul aria-labelledby="More" role="menu" class=""><li role="menuitem" class="hidden"><a recipient-drawer-state="content" recipient-drawer="drawerCertificate" class="item"><span class="icon icon-trustcenter"></span><span>Add certificate</span></a></li><li role="menuitem"><a recipient-drawer-state="content" recipient-drawer="drawerAccess" class="item"><span class="icon icon-key"></span><span>Add access authentication</span></a></li><li role="menuitem" class="hidden"><a recipient-drawer-state="content" recipient-drawer="drawerMessage" class="item"><span class="icon icon-privatenote"></span><span>Add private message</span></a></li><li role="menuitem" class="hidden"><a recipient-drawer-state="content" recipient-drawer="drawerLanguage" class="item"><span class="icon icon-globe"></span><span>Change language</span></a></li><li role="menuitem" class="remove-recipient"><a recipient-drawer-state="content" class="item"><span class="icon icon-trash"></span><span>Delete Recipient</span></a></li></ul><ul aria-labelledby="More" role="menu" class="hidden"><li role="menuitem"><a recipient-drawer-state="content" recipient-drawer="drawerAdvancedSettings" class="item"><span class="icon icon-gear"></span><span>Advanced Settings</span></a></li></ul></div></div><div class="recipient_delete"><span class="icon icon-times"></span></div></div>');
      // console.log(newRecipient[0]);

    $(this).closest(".add_recipient").before(newRecipient);
    $(this).closest(".selectRecipients").animate({scrollTop: $(this).closest(".selectRecipients").scrollTop() + 100}, 750);

    addNewRecipient(newRecipient);
    createSortableRecipients();
    sortRecipients();

    if($(".selectRecipients").hasClass("selected") && !$(".selectRecipients").hasClass("hidden") && firstTimeAdded == true) {
      setTimeout(function() {
        firstTimeAdded = false;
        $(".callout > div").addClass("hidden");
        $(".callout .callout-signing-order").removeClass("hidden");
        newRecipient.find(".recipient_number").attr("callout-pos", "below left");
        showCallout(evt, newRecipient.find(".recipient_number"));
      }, 1200);
    }
  });

  $(".recipients").on("input", ".input-text", function(evt) {
    if($(".recipients .recipient_name input").val().trim().length > 0 && $(".recipients .recipient_email input").val().trim().length > 0) {
      $(".selectRecipients .btn-next").removeClass("disabled");
    }
  });

  $(".recipients").on("input", ".recipient_name input", function(evt) {
    evt.stopPropagation();

    var parentEl = $(this).closest(".recipient");
    var fullname;
    var firstInitial;
    var lastInitial;

    if($(this).val().trim().length > 0) {
      fullname = $(this).val().trim().split(" ");
      firstInitial = fullname[0].split("")[0];
      if(fullname.length > 1) {
        lastInitial = fullname[fullname.length - 1].split("")[0];
      } else {
        lastInitial = "";
      }

      parentEl.find(".recipient_picture img").addClass("invisible");
      parentEl.find(".recipient_picture .userInitial").removeClass("invisible").text(firstInitial+lastInitial);
    } else {
      parentEl.find(".recipient_picture img").removeClass("invisible");
      parentEl.find(".recipient_picture .userInitial").addClass("invisible");
    }
  });

  $(".recipients").on("click", ".recipient_delete, .remove-recipient", function(evt) {
    evt.stopPropagation();

    var parentEl = $(this).closest(".recipient");
    parentEl.remove();

    sortRecipients();
  });

  $(".selectRecipients").on("click", ".signing_chart", function(evt) {
    $(".ds-modal-background").removeClass("invisible");
    $(".modal-signing-order").removeClass("hide_modal");
  });
  $("body").on("click", "#setSigningOrder", function(evt) {
    evt.stopPropagation();
    // console.log($(this).prop("checked"));
    if($(this).prop("checked") == false) {
      $(".modal-signing-order [data-signing-viz]").addClass("hidden");
      $(".modal-signing-order [data-signing-viz='rectangle']").removeClass("hidden");
    } else {
      $(".modal-signing-order [data-signing-viz]").addClass("hidden");
      $(".modal-signing-order [data-signing-viz='linear']").removeClass("hidden");
    }
    sortRecipients();
  });

  $(".selectRecipients").on("click", ".bulk_upload", function(evt) {
    evt.stopPropagation();
    $(".feature_unavailable").first().click();
  });

  $(".recipients").on("click", ".menuRecipientTypes .item", function(evt) {
    var target = $(this).closest(".recipient_task").find(".btn-trigger");
    target.find(".ng-binding").text($(this).text().trim());
    // console.log($(this).find(".icon").attr("class"));
    target.find(".icon").removeClass().addClass($(this).find(".icon").attr("class"));
    if($(this).find(".icon").hasClass("icon-needsmysignature")) {
      target.closest(".recipient").removeClass("dontAddToTagger");
    } else {
      target.closest(".recipient").addClass("dontAddToTagger");
    }
  });
});

function addNewRecipient(newRecipient) {
  setTimeout(function() {
    newRecipient.removeClass("hide_recipient");
  }, 200);
  // setTimeout(function() {
  $(".selectRecipients .recipients .signing_chart").removeClass("invisible");
  // }, 1200);
}
function sortRecipients(newRecipient) {
  if($(".modal-signing-order #setSigningOrder").prop("checked") == true) {
    $(".recipients .recipient:not(.uneditable,.hidden)").each(function(idx, elem) {
      $(elem).find(".recipient_number").text(idx+1);
    });
  } else {
    $(".recipients .recipient:not(.uneditable,.hidden) .recipient_number").text("1");
  }
}

function createSortableRecipients() {
  Sortable.create(sortableRecipients, {
    filter: ".ignore-sortable",
    preventOnFilter: false,
    animation: 250,
    handle: ".recipient_drag",
    // dragClass: "sortable-drag",
    ghostClass: "sortable-ghost",
    forceFallback: true,
    onSort: function (/**Event*/evt) {
    },
    onMove: function (evt) {
      return evt.related.className.indexOf('ignore-sortable') === -1;
    },
    group: {
      name: "fields"
    },
    onEnd: function(evt) {
      sortRecipients();
    }
  });
}
