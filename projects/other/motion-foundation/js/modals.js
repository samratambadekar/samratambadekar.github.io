
$(document).ready(function () {
    $("body").on("click", ".show_alert", function (evt) {
        if(!!$(".modal.alert").length) {
            $(".overlay-background, .modal.alert").removeClass("hide");
        }
    });
    $("body").on("click", ".show_dialog_simple", function (evt) {
        if(!!$(".modal.dialog_simple").length) {
            $(".overlay-background, .modal.dialog_simple").removeClass("hide");
        }
    });
    $("body").on("click", ".show_dialog_confirmation", function (evt) {
        if(!!$(".modal.dialog_confirmation").length) {
            $(".overlay-background, .modal.dialog_confirmation").removeClass("hide");
        }
    });
    $("body").on("click", ".show_dialog_coach_mark", function (evt) {
        if(!!$(".modal.dialog_coach_mark").length) {
            $(".overlay-background, .modal.dialog_coach_mark").removeClass("hide");
        }
    });

    $("body").on("click", ".overlay-close", function (evt) {
        closeOverlay(this);
    });
});

function closeOverlay(_this) {
    if (!!_this) {
        $(_this).closest(".modal").addClass("hide");
        $(_this).closest(".overlay-background").addClass("hide");
    } else {
        $(".overlay-background, .modal").addClass("hide");
    }
}