$(document).ready(() => {
    $("body").on("click", ".next_step", function(evt) {
        if(!!$(".overlay-page.current_page").next(".overlay-page").length) {
            $(".overlay-page.current_page").removeClass("current_page").next(".overlay-page").addClass("current_page");
        }
    });
    $("body").on("click", ".prev_step", function(evt) {
        if(!!$(".overlay-page.current_page").prev(".overlay-page").length) {
            $(".overlay-page.current_page").removeClass("current_page").prev(".overlay-page").addClass("current_page");
        }
    });
    
    let showBrokenSync = true;
    $("body").on("click", ".overlay-page-3", function(evt) {
        $(".overlay-page-3 .progress-bar-fill").css("width", "20%");
        $(".overlay-page-3 .progress-bar-value").text("20");

        setTimeout(() => {
            $(".overlay-page-3 .progress-bar-fill").css("width", "53%");
            $(".overlay-page-3 .progress-bar-value").text("53");
        }, 500);
        setTimeout(() => {
            $(".overlay-page-3 .progress-bar-fill").css("width", "89%");
            $(".overlay-page-3 .progress-bar-value").text("89");
        }, 1200);

        if (showBrokenSync) {
            setTimeout(() => {
                $(".overlay-page-3").removeClass("current_page");
                $(".overlay-page-4").addClass("current_page");
            }, 2500);
        } else {
            setTimeout(() => {
                $(".overlay-page-3 .progress-bar-fill").css("width", "100%");
                $(".overlay-page-3 .progress-bar-value").text("100");
            }, 2500);
            setTimeout(() => {
                $(".overlay-page-3 .progress-bar-container").addClass("completed");
            }, 2500);
            setTimeout(() => {
                $(".overlay-page-3, .overlay-page-4").removeClass("current_page");
                $(".overlay-page-5").addClass("current_page");
            }, 3500);
        }
    });

    $("body").on("click", ".re_sync", function (evt) {
        $(".overlay-page-4").removeClass("current_page");
        $(".overlay-page-3").addClass("current_page");
        $(".overlay-page-3 .progress-bar-fill").css("width", "0%");
        $(".overlay-page-3 .progress-bar-value").text("0");
        showBrokenSync = false;
    });


});