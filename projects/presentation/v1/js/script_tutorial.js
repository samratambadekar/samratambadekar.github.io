
const TOTAL_PAGES = $("#portfolio_presentation .pages").children().length;

$(document).ready(function() {
  goToPage(8);

  $("#experienceLoader").load("projects/ndse/v5/index.html");
  // $('#experienceLoader head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'projects/ndse/v5/css/style_callouts.css') );
  // $('#experienceLoader head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'projects/ndse/v5/css/style_create_form.css') );
  // $('#experienceLoader head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'projects/ndse/v5/css/style_finish.css') );
  // $('#experienceLoader head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'projects/ndse/v5/css/style_modal.css') );
  // $('#experienceLoader head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'projects/ndse/v5/css/style_ndse_home.css') );
  // $('#experienceLoader head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'projects/ndse/v5/css/style_ndse_tagger.css') );
  // $('#experienceLoader head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'projects/ndse/v5/css/style_preview_mode.css') );
  // $('#experienceLoader head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'projects/ndse/v5/css/style_selectDocument.css') );
  // $('#experienceLoader head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'projects/ndse/v5/css/style_selectRecipients.css') );
  // $('#experienceLoader head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'projects/ndse/v5/css/style_selectSigners.css') );
  // $('#experienceLoader head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'projects/ndse/v5/css/style_sendToRecipients.css') );
  // $('#experienceLoader head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'projects/ndse/v5/css/style_smart_forms.css') );
  // $('#experienceLoader head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'projects/ndse/v5/css/style_tagger.css') );
  // $('#experienceLoader head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'projects/ndse/v5/css/style_templates.css') );
  // $('#experienceLoader head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'projects/ndse/v5/css/style_toast.css') );
  // $('#experienceLoader head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'projects/ndse/v5/css/style_topNav_menu.css') );

  $("#portfolio_presentation .bottom-bar").on("click", ".btn-next", function(evt) {
    var target = $("#portfolio_presentation .page.showing");
    var nextTarget = target.next();
    var currentPage = parseInt(target.attr("data-page-num"));
    var nextPage = currentPage + 1;

    $("#portfolio_presentation .btn-prev").removeClass("hide");
    if(nextPage <= TOTAL_PAGES) {
      $("#portfolio_presentation .page").removeClass("showing");
      $("#portfolio_presentation .page[data-page-num=" + nextPage + "]").addClass("showing");
      $("#portfolio_presentation .pages").css("transform", "translateX(" + (currentPage * -100) + "%)");

      $("#portfolio_presentation .btn-next").removeClass("hide");
    }
    if(nextPage == TOTAL_PAGES) {
      $("#portfolio_presentation .btn-next").addClass("hide");
    }

    if(nextPage == 4) {
      // showDemo_NDSE();
    }
  });



  $("#portfolio_presentation .bottom-bar").on("click", ".btn-prev", function(evt) {
    var target = $("#portfolio_presentation .page.showing");
    var currentPage = parseInt(target.attr("data-page-num"));
    var prevPage = currentPage - 1;
    var prevTarget = target.prev();

    $("#portfolio_presentation .btn-next").removeClass("hide");
    if(prevPage > 0) {
      $("#portfolio_presentation .page").removeClass("showing");
      $("#portfolio_presentation .page[data-page-num=" + prevPage + "]").addClass("showing");
      $("#portfolio_presentation .pages").css("transform", "translateX(" + ((prevPage - 1) * -100) + "%)");

      $("#portfolio_presentation .btn-prev").removeClass("hide");
    }
    if(prevPage <= 1) {
      $("#portfolio_presentation .btn-prev").addClass("hide");
    }
  });

  $("body").on("keydown", function(evt) {
    if(!$(".tab_type_project .newTagDraggable").hasClass("selected")) {
      if(evt.keyCode == 39 || evt.which == 39) {
        $("#portfolio_presentation .btn-next").click();
      }
      if(evt.keyCode == 37 || evt.which == 37) {
        $("#portfolio_presentation .btn-prev").click();
      }
    }

    if(evt.keyCode == 9 || evt.which == 9) {
      if($(".tab_type_project").closest(".page").hasClass("showing")) {
        evt.preventDefault();
        if(!$(".tab_type_project .newTagDraggable").hasClass("selected") || $(".tab_type_project .newTagDraggable").last().hasClass("selected")) {
          $(".tab_type_project .newTagDraggable").removeClass("selected");
          $(".tab_type_project .newTagDraggable").first().addClass("selected");
          $(".tab_type_project .newTagDraggable textarea").first().focus();
        } else {
          $(".tab_type_project .newTagDraggable.selected").removeClass("selected").closest(".demo_card").next(".demo_card").find(".newTagDraggable").addClass("selected").find("textarea").focus();
        }
      }
      // $("#portfolio_presentation .btn-prev").click();
    }

    // if((evt.keyCode == 8 || evt.which == 8) && $(".tab_type_project .newTagDraggable").hasClass("selected")) {
    //   evt.preventDefault();
    //   console.log("prevented delete");
    // }

    if($(".tab_type_project .newTagDraggable.version3").hasClass("selected")) {
      var selectedTag = $(".tab_type_project .newTagDraggable.version3");
      if((evt.keyCode == 13) && evt.altKey) {
        selectedTag.find(".the_tag textarea").val(selectedTag.find(".the_tag textarea").val() + '\n').blur().focus();
      }
      if((evt.keyCode == 13) && !evt.altKey && selectedTag.find(".the_tag textarea").is(":focus")) {
        evt.preventDefault();
        if(selectedTag.find(".the_tag textarea").is(":focus")) {
          lastTextValue = selectedTag.find(".the_tag textarea").val();
          selectedTag.find(".the_tag textarea").blur();
        }
      } else if((evt.keyCode == 13) && !evt.altKey && !selectedTag.find(".the_tag textarea").is(":focus")) {
        evt.preventDefault();
        selectedTag.find(".the_tag textarea").focus();
      }
    }
  });

  $("body").on("click", function(evt) {
    $(".tab_type_project .newTagDraggable").removeClass("selected");
  });
  $("body").on("click", ".tab_type_project .newTagDraggable", function(evt) {
    evt.stopPropagation();
    $(".tab_type_project .newTagDraggable").removeClass("selected");
    $(this).addClass("selected");
  });
  $("body").on("click", ".tab_type_project .newTagDraggable.version2", function(evt) {
    evt.stopPropagation();
    $(this).find("textarea").focus();
  });
  $("body").on("dblclick", ".tab_type_project .newTagDraggable.version3", function(evt) {
    evt.stopPropagation();
    $(this).find("textarea").focus();
  });
  $("body").on("focus", ".tab_type_project .newTagDraggable textarea", function(evt) {
    evt.stopPropagation();
    // $(".tab_type_project .newTagDraggable").removeClass("isEditing");
    if($(this).closest(".newTagDraggable").hasClass("version2") || $(this).closest(".newTagDraggable").hasClass("version3")) {
      $(this).closest(".newTagDraggable").addClass("isEditing");
    }
  });
  $("body").on("blur", ".tab_type_project .newTagDraggable textarea", function(evt) {
    // evt.stopPropagation();
    $(this).closest(".newTagDraggable").removeClass("isEditing");
  });

});

function goToPage(newPageNumber) {
  var currentPageNumber = parseInt($("#portfolio_presentation .page.showing").attr("data-page-num"));

  if(newPageNumber >= 1 && newPageNumber <= TOTAL_PAGES) {
    for(let i=0;i<Math.abs(newPageNumber - currentPageNumber);i++) {
      if(newPageNumber < currentPageNumber) {
        $("#portfolio_presentation .bottom-bar .btn-prev").click();
      }
      if(newPageNumber > currentPageNumber) {
        window.setTimeout(() => {
          $("#portfolio_presentation .bottom-bar .btn-next").click();
        }, 100);
      }
    }
  }
}

function showDemo_NDSE() {
  window.location.href = "./projects/ndse/index.html";
}
