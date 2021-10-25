$(document).ready(() => {
  $("body").on("click", function(evt) {
    $(".select-container").removeClass("is-open");
  });
  $("body").on("click", ".rd-select:not(.rd-select-search)", function(evt) {
    if(!$(this).closest(".select-container").hasClass("disabled")) {
      evt.stopPropagation();
      // $(this).closest(".select-container").removeClass("has-error");
      let isOpen = $(this).closest(".select-container").hasClass("is-open");
      $(".select-container").removeClass("is-open");

      if(isOpen) {
        $(this).closest(".select-container").removeClass("is-open");
      } else {
        $(this).closest(".select-container").addClass("is-open");
      }
    }

    // if is editable
    if(!$(this).prop("readonly")) {
      $(this).closest(".select-container").addClass("is-open");
    }
  });

  $("body").on("input change", ".rd-select, .rd-select-search", function(evt) {
    $(this).closest(".select-container").find(".list-item").addClass("hide");
    $(this).closest(".select-container").find(".list-item").each((idx, elem) => {
      if($(elem).text().toLowerCase().trim().indexOf($(this).val().toLowerCase().trim()) >= 0) {
        $(elem).removeClass("hide");
      }
    });
    // if($(this).hasClass("rd-select")) {
    //   $(this).closest(".select-container").removeClass("has-error");
    // }
  });
  $("body").on("change", ".rd-select", function(evt) {
    setTimeout(() => {
      let hasError = true;
      if(!!$(this).val().length) {
        $(this).closest(".select-container").find(".list-item").each((idx, elem) => {
          if($(elem).text().toLowerCase().trim() === $(this).val().toLowerCase().trim()) {
            hasError = false;
          }
        });
      }
      if(hasError) {
        $(this).closest(".select-container").addClass("has-error");
      } else {
        $(this).closest(".select-container").removeClass("has-error");
      }
    }, 300);
  });
  $("body").on("input change", ".rd-select-search", function(evt) {
    if($(this).val().trim().length > 0) {
      $(this).removeClass("is-empty");
      $(this).closest(".select-search-container").find(".select-search-icon").removeClass("hide");
    } else {
      $(this).addClass("is-empty");
      $(this).closest(".select-search-container").find(".select-search-icon").addClass("hide");
    }
  });
  $("body").on("click focus", ".rd-select-search", function(evt) {
    evt.stopPropagation();
    $(this).closest(".select-search-container").addClass("has-focus");
  });
  $("body").on("blur", ".rd-select-search", function(evt) {
    $(this).closest(".select-search-container").removeClass("has-focus");
  });
  $("body").on("click", ".select-search-icon", function(evt) {
    evt.stopPropagation();
    $(this).closest(".select-search-container").find(".rd-select-search").val("").change().focus();
    $(this).addClass("hide");
  });

  $("body").on("click", ".select-dropdown .menu-dropdown-item", function(evt) {
    $(this).closest(".select-container").find(".rd-select").val($(this).text().trim());
    $(this).closest(".select-container").find(".select-dropdown .rd-select-search").val("").change();
    $(this).closest(".select-container").removeClass("has-error");
  });
  $("body").on("click", ".select-dropdown .placeholder-label", function(evt) {
    evt.stopPropagation();
    $(this).closest(".select-container").find(".rd-select-search").focus();
  });
});
