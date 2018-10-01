$(document).ready(function() {
  var firstFileName = localStorage.getItem("firstFileName");
  // var firstFileExt = firstFileName.split(".").pop();

  var newFile = $(".files .file").last();

  if(firstFileName != null && firstFileName != "") {
    newFile.find(".file_name").text(firstFileName);
    localStorage.setItem("firstFileName", "");
  }

  uploadNewFile(newFile);

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
    var newFile;
    if(extension == "pdf") {
      newFile = $('<div class="file"><div class="state uploading"><div class="file_loader"><div class="file_loader_status"></div></div><div class="file_options icon icon-times"></div></div><div class="state uploaded"><div class="file_ext pdf"><img src="images/svg/pdf_doc.svg"/></div><div class="file_preview"><img src="docs/Sales_Order_page1.png"/></div><div class="file_info"><div class="file_name ellipsis">' + filename + '</div><div class="file_pages">' + Math.floor((Math.random() * 10) + 2)  + ' Pages</div></div><div class="file_options icon icon-ellipsis-vert"></div></div></div>');
      // console.log(newFile[0]);
    } else {
      newFile = $('<div class="file"><div class="state uploading"><div class="file_loader"><div class="file_loader_status"></div></div><div class="file_options icon icon-times"></div></div><div class="state uploaded"><div class="file_ext pdf"><img src="images/svg/word_doc.svg"/></div><div class="file_preview"><img src="docs/Sales_Order_page1.png"/></div><div class="file_info"><div class="file_name ellipsis">' + filename + '</div><div class="file_pages">' + Math.floor((Math.random() * 10) + 2)  + ' Pages</div></div><div class="file_options icon icon-ellipsis-vert"></div></div></div>');
    }
    $(this).closest(".upload_file").before(newFile);
    uploadNewFile(newFile);
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
});

function uploadNewFile(newFile) {
  setTimeout(function() {
    newFile.find(".state .file_loader_status").addClass("half");
      newFile.find(".file_name, .file_options").removeClass("invisible");
  }, 200);
  setTimeout(function() {
    newFile.find(".state .file_loader_status").removeClass("half").addClass("full");
  }, 700);
  setTimeout(function() {
    newFile.addClass("upload_complete");

    createSortableDocuments();
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
