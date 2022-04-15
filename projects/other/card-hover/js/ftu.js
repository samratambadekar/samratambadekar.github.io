$(document).ready(function () {
    $("body").on("click", ".select-dropdown", function (evt) {
        $(this).toggleClass("open");
        // $(this).addClass("active");
        $(this).closest(".form-element").removeClass("error");
    });
    $("body").on("click", ".select-option", function (evt) {
        evt.stopPropagation();
        $(this).closest(".select-options").find(".select-option").removeClass("active");
        $(this).addClass("active");

        // $(this).closest(".select-dropdown").removeClass("open").find(".select-header").text($(this).text().split('   ').join(' ').trim());
        $(this).closest(".select-dropdown").removeClass("open").find(".select-header").html($(this).html());
    });

    $("body").on("click", ".enable_next_step", function (evt) {
        $(".ftu_next").removeClass("disabled");
    });

    $("body").on("click", ".ftu_next", function(evt) {
        let currentStep = $(this).closest(".ftu_steps").find(".ftu_step.current_step");
        let totalSteps = $(".ftu_steps .ftu_step").length - 1;

        if(currentStep.next(".ftu_step").length > 0) {
            // currentStep.next(".ftu_step").addClass("current_step");
            currentStep.nextAll(".ftu_step:not(.skip_step)").first().addClass("current_step");
            currentStep.removeClass("current_step");
            $(this).closest(".button-group").find(".ftu_prev").removeClass("hide");
            $(".ftu_card .progress-bar-inner").width(`${100 * (($(".ftu_steps .current_step").index() - 1) / totalSteps)}%`);
            $(this).addClass("disabled");

            $(this).closest(".ftu_card").find(".progress-indicator .progress-dot").removeClass("current_step");
            $(this).closest(".ftu_card").find(`.progress-indicator .progress-dot[data-step-num='${$(".ftu_steps .current_step").attr("data-step-num")}']`).addClass("current_step");
        }

        if(($(".ftu_steps .current_step").index() - 1) === totalSteps) {
            $(".ftu_steps .ftu_footer").addClass("hide");
        }

        if($(".ftu_step.current_step").hasClass("recommendation_step")) {
            $(".progress-indicator").addClass("hide");
        } else {
            $(".progress-indicator").removeClass("hide");
        }
    });
    $("body").on("click", ".ftu_prev", function(evt) {
        let currentStep = $(this).closest(".ftu_steps").find(".ftu_step.current_step");
        let totalSteps = $(".ftu_steps .ftu_step").length - 1;

        if(currentStep.prev(".ftu_step").length > 0) {
            // currentStep.prev(".ftu_step").addClass("current_step");
            currentStep.prevAll(".ftu_step:not(.skip_step)").first().addClass("current_step");
            currentStep.removeClass("current_step");
            $(".ftu_card .progress-bar-inner").width(`${100 * (($(".ftu_steps .current_step").index() - 1) / totalSteps)}%`);

            $(this).closest(".ftu_card").find(".progress-indicator .progress-dot").removeClass("current_step");
            $(this).closest(".ftu_card").find(`.progress-indicator .progress-dot[data-step-num='${$(".ftu_steps .current_step").attr("data-step-num")}']`).addClass("current_step");
        }
        if(currentStep.prev(".ftu_step").prev(".ftu_step").length <= 0) {
            $(this).addClass("hide");
        }
    });

    $("body").on("click", ".needs_basic", function(evt) {
        $(this).closest(".ftu_step").next(".skipplable_step").addClass("skip_step");
    });
    let recommendedOption = "simba";
    $("body").on("click", ".needs_advanced", function(evt) {
        $(this).closest(".ftu_step").next(".skipplable_step").removeClass("skip_step");
        recommendedOption = "advanced";
        $(".recommendation_step").removeClass("recommend_basic");
        $(".recommendation_step").addClass("recommend_advanced");
        // $(".go_to_simba").text("Learn More About Advanced");
        $(".go_to_simba").text("Get Started with Advanced");
    });

    $("body").on("click", ".show_quickbooks_card", function(evt) {
        $(".xero_card").addClass("hide");
        $(".quickbooks_card").removeClass("hide");
    });
    $("body").on("click", ".show_xero_card", function(evt) {
        $(".quickbooks_card").addClass("hide");
        $(".xero_card").removeClass("hide");
    });
    $("body").on("click", ".hide_quickbooks_card", function (evt) {
        $(".quickbooks_card, .xero_card").addClass("hide");
    });
    $("body").on("click", ".show_approval_card", function(evt) {
        $(".approval_card").removeClass("hide");
    });
    $("body").on("click", ".hide_approval_card", function(evt) {
        $(".approval_card").addClass("hide");
    });
    $("body").on("click", ".show_collaborate_card", function(evt) {
        $(".collaborate_card").removeClass("hide");
    });
    $("body").on("click", ".hide_collaborate_card", function(evt) {
        $(".collaborate_card").addClass("hide");
    });


    $("body").on("click", ".card_option:not(.no_select)", function(evt) {
        $(this).closest(".card_options").find(".card_option").removeClass("selected");
        $(this).addClass("selected");
    });

    $("body").on("click", ".go_to_simba", function(evt) {
        // if(recommendedOption !== "simba") {
        //     evt.preventDefault();
        // }
        if(recommendedOption === "advanced") {
            // $(".page").addClass("hide");
            // $(".plan_comparision_page").removeClass("hide");
            // $(".bank-bar-nav-item").removeClass("active");
            // $(".bank-bar-nav-item.business_services").addClass("active");
            // $("body").scrollTop(0);
            $(this).attr("href", "./advanced/index.html");
        }
    });
    $("body").on("click", ".compare_plans", function(evt) {
        $(".page").addClass("hide");
        $(".plan_comparision_page").removeClass("hide");
        $(".bank-bar-nav-item").removeClass("active");
        $(".bank-bar-nav-item.business_services").addClass("active");
        $("body").scrollTop(0);
    });

    $("body").on("click", ".btn_enroll", function(evt) {
        $(".enroll_page").addClass("hide");
        $(".toc_agree_page").removeClass("hide");
    });

    $("body").on("click", ".btn_agree_toc", function(evt) {
        $(".toc_agree_page").addClass("hide");
        $(".page").removeClass("hide");
    });

    $("body").on("click", ".accept_toc", function(evt) {
        if($(this).prop("checked")) {
            $(".btn_agree_toc").removeClass("disabled");
        } else {
            $(".btn_agree_toc").addClass("disabled");
        }
    });

    init();
});

function init() {
    $(".ftu_card .progress-bar-inner").width("0%");
    $("input[type='checkbox").prop("checked", false);
    $("body").scrollTop(0);
}
