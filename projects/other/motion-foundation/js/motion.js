$(document).ready(() => {
    $("body").on("click keypress", ".toggle", function (evt) {
        if (evt.type === "click" || evt.keyCode === 13) {
            $(this).toggleClass("on");
        }
        if ($(this).hasClass("on")) {
            $(this).find(".toggle-text").text("Switch on");
        } else {
            $(this).find(".toggle-text").text("Switch off");
        }
    });


    $("body").on("click", ".replay", function (evt) {
        if($(this).hasClass("opacity")) {
            $(this).removeClass("opacity");
            setTimeout(() => {
                $(this).addClass("opacity");
            }, 100);
        } else if ($(this).hasClass("slide-right")) {
            $(this).removeClass("slide-right");
            setTimeout(() => {
                $(this).addClass("slide-right");
            }, 100);
        } else if ($(this).hasClass("scale")) {
            $(this).removeClass("scale");
            setTimeout(() => {
                $(this).addClass("scale");
            }, 100);
        } else if ($(this).hasClass("stagger")) {
            if ($(this).find(".motion-card").hasClass("slide-up")) {
                $(this).find(".motion-card").removeClass("slide-up");
                setTimeout(() => {
                    $(this).find(".motion-card").addClass("slide-up");
                }, 100);
            } else if ($(this).find(".motion-card").hasClass("slide-left")) {
                $(this).find(".motion-card").removeClass("slide-left");
                setTimeout(() => {
                    $(this).find(".motion-card").addClass("slide-left");
                }, 100);
            }
        }
    });


    $("body").on("click", ".show_new_toast", function (evt) {
        // let newToast = $(`<div class="motion-toast">${$(this).find(".motion-toasts .motion-toast").length+1}</div>`);
        $(this).find(".motion-toasts .motion-toast").each((idx, elem) => {
            // $(elem).css({ top: $(elem).position().top - 60 });
            $(elem).css({ top: -($(this).find(".motion-toasts .motion-toast").length - idx) * 60});
        });
        let newToast = $(`<div class="motion-toast">Click to dismiss</div>`);
        $(this).find(".motion-toasts").append(newToast);
        // $(this).find(".motion-toasts").css({ height: $(this).find(".motion-toasts .motion-toast").length * 60 + 10});
        // setTimeout(() => {
        //     // $(this).find(".motion-toasts").css({ height: $(this).find(".motion-toasts").height() - 60 });
        //     newToast.remove();
        // }, 5000);
    });
    $("body").on("click", ".motion-toast", function (evt) {
        evt.stopPropagation();
        $(this).prevAll(".motion-toast").each((idx, elem) => {
            $(elem).css({ top: $(elem).position().top + 60 });
        });
        $(this).remove();
    });


    $("body").on("click", ".motion-stepper", function (evt) {
        evt.stopPropagation();
        if(!!$(this).find(".motion-step.active_step").next(".motion-step").length) {
            $(this).find(".motion-step.active_step").removeClass("active_step").addClass("completed").next(".motion-step").addClass("active_step");
        } else {
            $(this).find(".motion-step").removeClass("active_step completed");
            $(this).find(".motion-step").first().addClass("active_step");
        }
    });


    $("body").on("click", ".show_alert", function (evt) {
        if (!!$(".modal.alert").length) {
            animateModalHeight();
        }
    });
    $("body").on("click", ".modal .add-new-input", function (evt) {
        evt.stopPropagation();
        // $(this).find(".modal-content-inner").text($(this).find(".modal-content-inner").text() + ' Body MD Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ante augue, dipiscing elit. Ante augue.');
        $(this).closest(".modal").find(".modal-content-inner").append(`
            <div class="form-element">
              <label class="input-label">Input label</label>
              <div class="input-container">
                <input type="text" class="input-text" />
              </div>
            </div>`);
        animateModalHeight();
    });
});

function animateModalHeight() {
    setTimeout(() => {
        console.log($(".modal.alert .modal-content").outerHeight());
        // $(".modal.alert .modal-content-inner").append(`<div></div>`);
        // $(".modal.alert").height($(".modal.alert .modal-header").outerHeight() + $(".modal.alert .modal-footer").outerHeight() + $(".modal.alert .modal-content").outerHeight() + $(".modal.alert .modal-content-inner").outerHeight());
        $(".modal.alert").height($(".modal.alert .modal-header").outerHeight() + $(".modal.alert .modal-footer").outerHeight() + $(".modal.alert .modal-content-inner").outerHeight() + 48);
    }, 0);
}