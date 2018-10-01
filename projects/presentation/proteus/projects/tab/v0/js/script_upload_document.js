$(document).ready(function(evt) {
  var firstFileName = localStorage.getItem("firstFileName");
  var showSampleModalCallout = localStorage.getItem("showSampleModalCallout");
  var showEmptyfileArea = localStorage.getItem("showEmptyfileArea");
  // var firstFileExt = firstFileName.split(".").pop();

  var newFile = $(".files .file").last();

  if(firstFileName != null && firstFileName != "") {
    newFile.removeClass("sample_document upload_complete");
    newFile.find(".file_name").text(firstFileName);
    // localStorage.setItem("firstFileName", "");
  } else {
    firstFileName = "NDA_Edwards_Consulting_Group.pdf";
  }

  if(showSampleModalCallout == true || showSampleModalCallout == "true") {
    localStorage.setItem("showSampleModalCallout", false);
  }

  var filename = firstFileName;
  // console.log($(".upload_file"));
  var extension = filename.split(".").pop();
  var newFile;

  if(showEmptyfileArea == false || showEmptyfileArea == "false") {
    newFile = appendNewFile(filename, extension);
    uploadNewFile(newFile);

    $(".selectDocument .upload_file_list_view").removeClass("hidden");
    $(".selectDocument .upload_file_screen_view").addClass("hidden");
  } else {
    $(".selectDocument .upload_file_list_view").addClass("hidden");
    $(".selectDocument .upload_file_screen_view").removeClass("hidden");
  }

  $("[data-field-id='Envelope Name']").text(firstFileName).blur();

  $(".selectDocument").on("click", ".upload_file", function(evt) {
    evt.stopPropagation();
    $(this).find("input[type=file]").click();
  });
  $(".selectDocument").on("click", ".upload_file input[type=file]", function(evt) {
    evt.stopPropagation();
  });
  $(".selectDocument").on("change", ".upload_file input[type=file]", function(evt) {
    var filename = $(this)[0].files[0]['name'];
    // console.log($(".upload_file"));
    var extension = filename.split(".").pop();
    var newFile = appendNewFile(filename, extension);
    uploadNewFile(newFile);

    $(".sample_document").addClass("hide");
  });

  $(".selectDocument").on("click", ".layouts > .btn-icon", function(evt) {
    var parentEl = $(this).closest(".layouts");
    parentEl.find(".btn-icon").removeClass("btn-active");
    $(this).addClass("btn-active");

    if($(this).attr("data-view-id") === "List") {
      $(".selectDocument .files").removeClass("grid_view").addClass("list_view");
    } else if($(this).attr("data-view-id") === "Grid") {
      $(".selectDocument .files").addClass("grid_view").removeClass("list_view");
    }
  });


  $(".ndse_steps").on("dragenter", ".selectDocument", function(evt) {
    evt.preventDefault();
    $(this).addClass("file-droppable");
    // return false;
  });
  $(".ndse_steps").on("dragexit drop", ".selectDocument", function(evt) {
    evt.preventDefault();
    $(this).removeClass("file-droppable");

    // localStorage.setItem("firstFileName", evt.originalEvent.dataTransfer.files[0].name);
    var filename = evt.originalEvent.dataTransfer.files[0].name;
    // console.log($(".upload_file"));
    var extension = filename.split(".").pop();
    var newFile = appendNewFile(filename, extension);
    uploadNewFile(newFile);
  });

  $(window).on("dragover", function(evt){
    evt.preventDefault();
    return false;
  });
  $(window).on("drop", function(evt){
    evt.preventDefault();
    return false;
  });

  $(".files").on("click", ".deleteDocument", function(evt){
    evt.stopPropagation();
    $(this).closest(".file").remove();
  });

  $("body").on("click", "#sortableDocuments, .file .file_name, .file .file_preview, .close_doc_preview", function(evt){
    evt.stopPropagation();
    $(".doc_preview .title").text(firstFileName);
    $(".doc_preview").toggleClass("hide_bottom");
  });
});

function appendNewFile(filename, extension) {
  var newFile;
  if(extension == "pdf") {
    newFile = $('<div class="file"><div class="state uploading"><div class="file_loader"><div class="file_loader_status"></div></div><div class="file_options icon icon-times"></div></div><div class="state uploaded"><div class="file_ext pdf"><img src="images/svg/pdf_doc.svg"/></div><div class="file_preview"><img src="docs/Sales_Order_page1.png"/></div><div class="file_info"><div class="file_name ellipsis">' + filename + '</div><div class="file_pages">' + 1  + ' Page</div></div><div class="file_options"><button class="btn-minor btn-menu"><span class="icon icon-ellipsis-vert"></span></button><div style="" class="menu ng-scope menuDocumentActions invisible"><ul aria-labelledby="More" role="menu" class=""><li role="menuitem"><a class="item"><span>Apply Templates</span></a></li><li role="menuitem" class="setAsSupplement hidden"><a class="item"><span>Set as Supplemental</span></a></li><li role="menuitem"><a class="item"><span>Replace Document</span></a></li><li role="menuitem"><a class="item"><span>Rename Document</span></a></li><li role="menuitem" class="deleteDocument"><a class="item"><span>Delete Document</span></a></li></ul></div></div></div></div>');
    // console.log(newFile[0]);
  } else {
    newFile = $('<div class="file"><div class="state uploading"><div class="file_loader"><div class="file_loader_status"></div></div><div class="file_options icon icon-times"></div></div><div class="state uploaded"><div class="file_ext pdf"><img src="images/svg/word_doc.svg"/></div><div class="file_preview"><img src="docs/Sales_Order_page1.png"/></div><div class="file_info"><div class="file_name ellipsis">' + filename + '</div><div class="file_pages">' + 1  + ' Page</div></div><div class="file_options"><button class="btn-minor btn-menu"><span class="icon icon-ellipsis-vert"></span></button><div style="" class="menu ng-scope menuDocumentActions invisible"><ul aria-labelledby="More" role="menu" class=""><li role="menuitem"><a class="item"><span>Apply Templates</span></a></li><li role="menuitem" class="setAsSupplement hidden"><a class="item"><span>Set as Supplemental</span></a></li><li role="menuitem"><a class="item"><span>Replace Document</span></a></li><li role="menuitem"><a class="item"><span>Rename Document</span></a></li><li role="menuitem" class="deleteDocument"><a class="item"><span>Delete Document</span></a></li></ul></div></div></div></div>');
  }
  $(".files .upload_file").before(newFile);

  return newFile;
}

function uploadNewFile(newFile) {
  $(".selectDocument .upload_file_list_view").removeClass("hidden");
  $(".selectDocument .upload_file_screen_view").addClass("hidden");
  // $("#sortableDocuments .upload_file").css({"z-index": -1});
  $("#sortableDocuments .file").each(function(idx, elem) {
    var newZIndex = $("#sortableDocuments .file").length - idx;
    $(elem).css({"z-index": newZIndex});
    $(elem).find(".state").css({"z-index": newZIndex});
  });

  setTimeout(function() {
    newFile.find(".state .file_loader_status").addClass("half");
      newFile.find(".file_name, .file_options").removeClass("invisible");
  }, 200);
  setTimeout(function() {
    newFile.find(".state .file_loader_status").removeClass("half").addClass("full");
  }, 700);
  setTimeout(function() {
    newFile.addClass("upload_complete");

    // createSortableDocuments();
  }, 1100);
}

function createSortableDocuments() {
  $("#sortableDocuments .uploaded").css("transition", "none");
  sortableDocuments = Sortable.create(sortableDocuments, {
    filter: ".ignore-sortable",
    preventOnFilter: false,
    animation: 250,
    handle: ".uploaded",
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
      // checkLinkedFields();
    }
  });
}
