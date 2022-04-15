$(document).ready(function() {
    $("body").on("click", ".tab-item", function(evt) {
        $(this).closest(".tabs").find(".tab-item").removeClass("active");
        $(this).addClass("active");

        if($(this).attr('data-tab-id')) {
            $(this).closest(".tab-container").find(".tab-page").addClass("hide");
            $(this).closest(".tab-container").find(`.tab-page[data-tab-id='${$(this).attr('data-tab-id')}']`).removeClass("hide");
        }
    });
    $("body").on("keydown", ".tab-item", function(evt) {
        if(evt.keyCode === 13 || evt.which === 13) {
            $(evt.target).click();
        }
    });

    $("body").on("click focus", "[data-linked-elem-id]", function(evt) {
        evt.stopPropagation();
        $("[data-linked-elem-id], .input-container-inner").removeClass("highlight");
        if($(this).closest("input").length > 0) {
            // $(this).closest(".input-container-inner").addClass("highlight");
            $(`.highlight-tag[data-linked-elem-id='${$(this).attr("data-linked-elem-id")}']`).addClass("highlight");

            // setTimeout(() => {
            //     $(`.highlight-tag[data-linked-elem-id='${$(this).attr("data-linked-elem-id")}']`).removeClass("highlight");
            // }, 1000);
        }
        if($(this).closest(".highlight-tag").length > 0) {
            // $(this).addClass("highlight");
            $(`input[data-linked-elem-id='${$(this).attr("data-linked-elem-id")}']`).closest(".input-container-inner").addClass("highlight");

            // setTimeout(() => {
            //     $(`input[data-linked-elem-id='${$(this).attr("data-linked-elem-id")}']`).removeClass("highlight");
            // }, 1000);
        }
    });
    $("body").on("click", function(evt) {
        evt.stopPropagation();
        $("[data-linked-elem-id], .input-container-inner").removeClass("highlight");
        $(".tooltip").addClass("hide");
        // $(".list-section-item").removeClass("selected");
    });

    $("body").on("click", "input[type='file']", function(evt) {
        evt.stopPropagation();
    });
    $("body").on("drop", ".upload-card", function(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        $(this).find("input[type='file']").change();
    });
    $(window).on("dragover", function(evt) {
        evt.preventDefault();
        return false;
    });
    $(window).on("drop", function(evt) {
        evt.preventDefault();
        return false;
    });

    $("body").on("change", "input[type='file']", function (evt) {

        if($(this).closest(".section-upload-bill").length > 0) {
            $(this).closest(".section-upload-bill").addClass("uploaded");


            setTimeout(() => {
                $("[data-schedule-state]").attr("data-schedule-state", "edit-vendor");
                $(".section-vendor-list").addClass("slide_animation");
                $(".recent-payments").removeClass("hide");

                sessionStorage.setItem("data-vendor-name", "Bub's Hubs");
                stateManagement();
            }, 10200);

            showUploadAnimation($(this).closest(".section-upload-bill"));
            showScanAnimation($(this).closest(".section-upload-bill"));
            autoFillScannedInfo($(this).closest(".card-schedule-payment").find(".payment-details"));
            disableFormFields($(this).closest(".card-schedule-payment").find(".payment-details"));
        }
        if($(this).closest(".hero").length > 0) {
            // $(this).closest(".hero").removeClass("no_upload");
            sessionStorage.setItem("data-bill-uploaded", "true");
            sessionStorage.setItem("data-schedule-state", "edit-vendor");
            sessionStorage.setItem("data-vendor-name", "Bub's Hubs");
            // window.location.href = './schedule_payment.html';
        }
    });

    $("body").on("change", "input[type='date']", function (evt) {
        if($(this).closest(".autofill_deliver_by").length > 0) {
            updateDeliveryDate();
        }
    });
    $("body").on("click", ".upload-card", function(evt) {
        $(this).find("input[type='file']").change();
    });

    $("body").on("focus click", ".input-radio, .input-checkbox, .input-text", function(evt) {
        $(this).removeClass("error");
        $(this).closest(".form-element").removeClass("error");

        if($(this).hasClass("input-text") && $(this).closest(".combo-container").find(".input-radio").length > 0) {
            $(this).closest(".combo-container").find(".input-radio").click();
        }
        if($(this).hasClass("input-text") && $(this).closest(".radio-container").find(".input-radio").length > 0) {
            $(this).closest(".radio-container").find(".input-radio").click();
        }
        if($(this).hasClass("input-text") && $(this).closest(".combo-container").find(".input-checkbox").length > 0) {
            $(this).closest(".combo-container").find(".input-checkbox").prop("checked", true);
        }
        if($(this).hasClass("input-text") && $(this).closest(".checkbox-container").find(".input-checkbox").length > 0) {
            $(this).closest(".checkbox-container").find(".input-checkbox").prop("checked", true);
        }
    });

    $("body").on("click", ".select-dropdown", function(evt) {
        $(this).toggleClass("open");
        // $(this).addClass("active");
        $(this).closest(".form-element").removeClass("error");
    });
    $("body").on("click", ".select-option", function(evt) {
        evt.stopPropagation();
        $(this).closest(".select-options").find(".select-option").removeClass("active");
        $(this).addClass("active");

        // $(this).closest(".select-dropdown").removeClass("open").find(".select-header").text($(this).text().split('   ').join(' ').trim());
        $(this).closest(".select-dropdown").removeClass("open").find(".select-header").html($(this).html());
    });

    $("body").on("click", ".scheduled-cards .arrow-left", function(evt) {
        // $(this).closest(".scheduled-cards").animate("scrollLeft", )
        $(this).closest(".scheduled-cards").find(".scheduled-cards-inner").scrollLeft($(this).closest(".scheduled-cards").find(".scheduled-cards-inner").scrollLeft() - 216);
    });
    $("body").on("click", ".scheduled-cards .arrow-right", function(evt) {
        $(this).closest(".scheduled-cards").find(".scheduled-cards-inner").scrollLeft($(this).closest(".scheduled-cards").find(".scheduled-cards-inner").scrollLeft() + 216);
    });
    $(".scheduled-cards-inner").on("scroll", function(evt) {
        checkHeroCardScroll(this);
    });

    $("body").on("click", ".nav_settings", function(evt) {
        $(".pay-tab-page .hero").toggleClass("no_upload");
        // if ($(".pay-tab-page .hero").hasClass("two_uploads")) {
        //     $(".pay-tab-page .hero").addClass("no_upload").removeClass("two_uploads");
        // } else {
        //     $(".pay-tab-page .hero").addClass("two_uploads");
        // }
        $(".pay-tab-page .scheduled-cards-inner").scroll();
    });
    $("body").on("click", ".demo_nav_settings", function(evt) {
        console.log($(this).closest(".demo-card"));
        $(this).closest(".demo-card").toggleClass("inverse");
        if($(this).closest(".demo-card").hasClass("inverse")) {
            setTimeout(() => {
                $(this).closest(".demo-card").find(".tabs").addClass("inverse");
            }, 650);
        } else {
            setTimeout(() => {
                $(this).closest(".demo-card").find(".tabs").removeClass("inverse");
            }, 650);
        }
    });
    // $("body").on("keydown", ".demo_nav_settings", function(evt) {
    //     if (evt.keyCode === 13 || evt.which === 13) {
    //         evt.preventDefault();
    //         $(evt.target).click();
    //     }
    // });

    // $("body").on("click", ".list-section-item", function(evt) {
    //     evt.stopPropagation();
    //     // $(".list-section-item").removeClass("selected");
    //     // $(this).addClass("selected");
    //     sessionStorage.setItem("data-schedule-state", "payment-scheduled");
    //     sessionStorage.setItem("data-schedule-overlay-title", "Payment details");
    //     if($(this).closest(".scheduled_payments_card").length > 0) {
    //         sessionStorage.setItem("data-schedule-state", "edit-vendor");
    //         sessionStorage.setItem("data-payment-type", $(this).find(".payment-type").text().trim());
    //         sessionStorage.setItem("data-schedule-state-editable", "true");
    //         sessionStorage.setItem("data-schedule-overlay-title", "Edit payment");
    //         sessionStorage.setItem("data-schedule-state-editable-amount", $(this).find(".amount").text().trim().substring(1));
    //         // sessionStorage.setItem("data-schedule-state-editable-pay-from", "true");
    //         sessionStorage.setItem("data-schedule-state-editable-deliver-by", $(this).find(".date").text().trim());
    //         // sessionStorage.setItem("data-schedule-state-editable-note", "true");
    //     }
    //     sessionStorage.setItem("data-vendor-name", $(this).find(".data-vendor-name").text().trim());

    //     if($(this).closest(".vendors-list").length > 0) {
    //         sessionStorage.setItem("data-vendor-short-name", getVendorShortName($(this).find(".data-vendor-name").text().trim()));
    //         // window.location.href = './vendor_details.html';
    //     } else {
    //         // window.location.href = './schedule_payment.html';
    //     }
    // });
    $("body").on("keydown", function(evt) {
        if(evt.keyCode === 13 || evt.which === 13) {
            evt.stopPropagation();
            // $(".list-section-item").removeClass("selected");
            $(evt.target).closest(".list-section-item").click();
        }
    });

    $("body").on("click", ".save_button", function(evt) {
        $(this).addClass("is-loading");
        let timeoutDuration = 5500;
        if($(this).hasClass("morph_button")) {
            timeoutDuration = 8000;
        }

        setTimeout(() => {
            $(this).find(".loading-check").removeClass("hide");
        }, timeoutDuration - 1000);

        setTimeout(() => {
            $(this).removeClass("is-loading");
            $(this).find(".loading-check").addClass("hide");
        }, timeoutDuration);
    });

    $("body").on("click", ".overlay-close", function(evt) {
        closeOverlay(this);
    });

    $("body").on("click", ".hide_invoice", function(evt) {
        if(!!cardToClose) {
            cardToClose.remove();
            $(".scheduled-cards-inner .card").addClass("hide");
            setTimeout(() => {
                $(".scheduled-cards-inner .card").removeClass("hide");
            }, 10);
        }
        // $(this).closest(".overlay-background").addClass("hide");
    });

    let cardToClose = null;
    $("body").on("click", ".hero .card .close", function(evt) {
        closeOverlay();
        cardToClose = $(this).closest(".card");
        $(".overlay-background, .modal").removeClass("hide");
    });

    $("body").on("click", ".preview_check", function(evt) {
        closeOverlay();
        $(".overlay-background, .image-previews").removeClass("hide");
    });

    $("body").on("input", ".search_vendor_list", function(evt) {
        let targetEls = $(this).closest(".card-section").find(".vendors-list-item");

        targetEls.addClass("hide");
        targetEls.each((idx, elem) => {
            if ($(elem).text().trim().toLowerCase().indexOf($(this).val().trim().toLowerCase()) >= 0) {
                $(elem).removeClass("hide");
            }
        });
    });

    $("body").on("click", ".vendors-list-item", function(evt) {
        $("[data-schedule-state]").attr("data-schedule-state", "edit-vendor");
        sessionStorage.setItem("data-vendor-name", $(this).find(".vendor-name").text().trim());
        stateManagement({"keepName": true});

        $(this).closest(".section-vendor-list").addClass("slide_animation");

        if($(this).find(".vendor-name").text().indexOf("Hubs") > 0) {
            $(".recent-payments").removeClass("hide");
        } else {
            $(".recent-payments").addClass("hide");
        }
    });
    $("body").on("click", ".section-vendor-details .back", function(evt) {
        $("[data-schedule-state]").attr("data-schedule-state", "select-vendor");
    });

    $("body").on("click", ".delivery-method .info-icon", function(evt) {
        evt.stopPropagation();
        $(".tooltip .tooltip-content").html(`We'll deduct funds on <span class="funds-deduction-time"></span>`);
        updateDeliveryDate();
        $(".tooltip").css({
            top: evt.pageY + 20,
            left: evt.pageX
        });
        $(".tooltip").removeClass("hide");

    });
    $("body").on("click", ".schedule_payment", function(evt) {
        let isSaved = true;
        let targetEls = $(this).closest(".payment-details").find(".form-element.required");
        targetEls.each((idx, elem) => {
            if ($(elem).find(".input-text").length && $(elem).find(".input-text").val().trim().length <= 0) {
                $(elem).addClass("error");
                isSaved = false;
            } else if ($(elem).find(".select-header").length && $(elem).find(".select-header").text().trim().length <= 0) {
                $(elem).addClass("error");
                isSaved = false;
            }
        });

        if (isSaved) {
            sessionStorage.setItem("data-payment-scheduled", "true");
            let autofillAmount = $(".autofill_amount").val().trim().split(',').join('');
            autofillAmount = autofillAmount.indexOf("$") >= 0 ? autofillAmount.substring(1) : autofillAmount;
            sessionStorage.setItem("data-payment-scheduled-amount", autofillAmount);
            let scheduledDate = new Date($(".autofill_deliver_by").val().trim());
            sessionStorage.setItem("data-payment-scheduled-date",
                `${scheduledDate.toString().split(' ')[1]} ${convertUTCDateToLocalDate(scheduledDate).toString().split(' ')[2]}`);
            // window.location.href = './index.html';
        }
    });
    function convertUTCDateToLocalDate(date) {
        var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();

        newDate.setHours(hours - offset);

        return newDate;
    }
    let zoomInDocVal = 1;
    $("body").on("click", ".zoom-in", function(evt) {
        zoomInDocVal += .2;

        if(zoomInDocVal !== 1) {
            $(".highlight-tag").addClass("hide");
        } else {
            $(".highlight-tag").removeClass("hide");
        }
        // $(".highlight-tag").each(function() {
        //     $(this).css({
        //         transform: `scale(${zoomInDocVal})`,
        //         left: $(this).position().left + ($(this).position().left * .2),
        //         top: $(this).position().top + ($(this).position().top * .2)
        //     });
        // });

        $(".uploaded-document-image").css({
            transform: `scale(${zoomInDocVal})`
        });
    });
    $("body").on("click", ".zoom-out", function(evt) {
        zoomInDocVal -= .2;

        if(zoomInDocVal !== 1) {
            $(".highlight-tag").addClass("hide");
        } else {
            $(".highlight-tag").removeClass("hide");
        }
        // $(".highlight-tag").each(function () {
        //     $(this).css({
        //         transform: `scale(${zoomInDocVal})`,
        //         left: $(this).position().left - ($(this).position().left * zoomInDocVal),
        //         top: $(this).position().top - ($(this).position().top * zoomInDocVal)
        //     });
        // });

        $(".uploaded-document-image").css({
            transform: `scale(${zoomInDocVal})`
        });
    });
    $("body").on("click", ".delete-document", function(evt) {
        $(this).closest(".section-upload-bill").removeClass("uploaded");
        // showUploadAnimation($(this).closest(".section-upload-bill"));
    });

    $("body").on("click", ".button-group .button-x-large", function(evt) {
        $(this).closest(".button-group").find(".button-x-large").removeClass("selected");
        $(this).addClass("selected");
    });

    $("body").on("input", ".input-vendor-search", function(evt) {
        let totalResults = 0;
        if($(this).val().trim().length > 0) {
            $(".search-vendor-results").removeClass("hide");

            let targetEls = $(".search-vendor-results .network-vendors-list-item");

            targetEls.addClass("hide");
            targetEls.each((idx, elem) => {
                if ($(elem).find(".vendor-name").text().trim().toLowerCase().indexOf($(this).val().trim().toLowerCase()) >= 0) {
                    $(elem).removeClass("hide");
                    totalResults++;
                }
            });
            $(".search-vendor-results .total-results .count").text(totalResults);
        } else {
            $(".search-vendor-results").addClass("hide");
        }
    });

    $("body").on("click", ".add-input-text", function(evt) {
        let newInputElem = `<div class="form-element no-margin">
              <div class="input-container-inner">
                <input type="text" class="input-text input-vendor-address2" />
              </div>
            </div>`;
        $(this).before(newInputElem);
        $(this).remove();
    });

    $("body").on("click", ".add_vendor_manually", function(evt) {
        $(this).closest(".card-add-vendor").find(".add-vendor-manual").removeClass("hide");
        $(this).closest(".card-add-vendor").find(".vendor-results").addClass("hide");
        $(this).closest(".card-add-vendor").find(".input-vendor-search").attr("placeholder", "").next(".input-icon").remove();
    });

    $("body").on("click", ".save-manual-vendor", function(evt) {
        let isSaved = true;
        let targetEls = $(this).closest(".card-add-vendor").find(".form-element.required");
        targetEls.each((idx, elem) => {
            if($(elem).find(".input-text").length && $(elem).find(".input-text").val().trim().length <= 0) {
                $(elem).addClass("error");
                isSaved = false;
            }
        });

        if(isSaved) {
            sessionStorage.setItem("data-vendor-name", $(this).closest(".card-add-vendor").find(".input-vendor-search").val().trim());
            let parentEl = $(this).closest(".card-add-vendor");
            let fullAddress = `<div>${parentEl.find(".input-vendor-address").val().trim()},</div>
                                ${!!parentEl.find(".input-vendor-address2").val() ?'<div>' + parentEl.find(".input-vendor-address2").val().trim() + ',</div>':''}
                                <div>${parentEl.find(".input-vendor-city").val().trim()},
                                ${parentEl.find(".input-vendor-state").val().trim()},
                                ${parentEl.find(".input-vendor-zipcode").val().trim()}</div>
                                <div>${parentEl.find(".input-vendor-email").val().trim()}</div>
                            `;
            sessionStorage.setItem("data-vendor-address", fullAddress);
            // window.location.href = './vendor_details.html';
        }
    });

    $("body").on("click", ".connect_to_vendor", function(evt) {
        $(this).closest(".page").find(".card-connect-to-vendor").removeClass("hide");
        $(this).closest(".card-add-vendor").addClass("hide");
        sessionStorage.setItem("data-vendor-name", $(this).closest(".network-vendors-list-item").find(".vendor-name").text().trim());
        sessionStorage.setItem("data-vendor-address", $(this).closest(".network-vendors-list-item").find(".vendor-address").html());
        sessionStorage.setItem("data-vendor-logo", $(this).closest(".network-vendors-list-item").find(".vendor-logo img").attr("src"));
        stateManagement({keepName: true, keepAddress: true});
    });
    $("body").on("click", ".back_to_vendor_search", function (evt) {
        $(this).closest(".page").find(".card-add-vendor").removeClass("hide");
        $(this).closest(".card-connect-to-vendor").addClass("hide");
    });
    $("body").on("click", ".confirm_connect_to_vendor", function (evt) {
        let isSaved = true;
        let targetEls = $(this).closest(".card-connect-to-vendor").find(".form-element.required");
        targetEls.each((idx, elem) => {
            if ($(elem).find(".input-text").length && $(elem).find(".input-text").val().trim().length <= 0) {
                $(elem).addClass("error");
                isSaved = false;
            }
        });

        if (isSaved) {
            // window.location.href = './vendor_details.html';
        }
    });

    $("body").on("click", ".save_autopay", function (evt) {
        let isSaved = true;
        let targetEls = $(this).closest(".card-add-autopay").find(".form-element.required");
        targetEls.each((idx, elem) => {
            if($(elem).is(":visible")) {
                if ($(elem).find(".input-radio").length) {
                    // if ($(elem).find("[name='rb-group-29a21']:checked").length <= 0) {
                    //     $(elem).closest(".radio-group").addClass("error");
                    //     isSaved = false;
                    // }
                } else if ($(elem).find(".input-text").length && $(elem).find(".input-text").val().trim().length <= 0) {
                    $(elem).addClass("error");
                    isSaved = false;
                } else if ($(elem).find(".select-header").length && $(elem).find(".select-header").text().trim().length <= 0) {
                    $(elem).addClass("error");
                    isSaved = false;
                }
            }
        });

        if (isSaved) {
            sessionStorage.setItem("data-autopay-scheduled", "true");
            if($(".input-autopay-amount").val().trim() > 0) {
                sessionStorage.setItem("data-autopay-amount", $(".input-autopay-amount").val().trim());
            } else {
                let selectedCheckboxVal = $("input[name='rb-group-dkam23']:checked").val();

                if ($(".cb_alternate_max").is(":checked")) {
                    if($(".input-autopay-amount-alternate").val().trim().length <= 0 ||
                        isNaN($(".input-autopay-amount-alternate").val().trim())) {
                        $(".input-autopay-amount-alternate").addClass("error");
                    } else {
                        selectedCheckboxVal = `Maximum up to $${numberWithCommas(parseFloat($(".input-autopay-amount-alternate").val().trim()).toFixed(2))}`;
                    }
                }
                sessionStorage.setItem("data-autopay-amount-min", selectedCheckboxVal);
            }
            if($(".input-autopay-amount-alternate").val().trim() > 0) {
                sessionStorage.setItem("data-autopay-amount", $(".input-autopay-amount-alternate").val().trim());
            }

            if ($(".days_before_due").val().trim().length > 0) { 
                if(isNaN($(".days_before_due").val().trim())) {
                    $(".days_before_due").addClass("error");
                } else {
                    sessionStorage.setItem("data-autopay-days-before", $(".days_before_due").val().trim() + ' days before due date');
                }
            }

            if(!$(".input-autopay-amount-alternate").hasClass("error") &&
               !$(".days_before_due").hasClass("error")) {
                // window.location.href = './vendor_details.html';
            }
        }
    });

    $("body").on("click", ".schedule_payment_for_vendor", function (evt) {
        sessionStorage.setItem("data-schedule-state", "edit-vendor");
        // window.location.href = './schedule_payment.html';
    });

    $("body").on("click", ".add_autopay", function (evt) {
        if(!!sessionStorage.getItem("data-vendor-name") && sessionStorage.getItem("data-vendor-name").indexOf("AT&T") >= 0) {
            sessionStorage.setItem("data-autopay-vendor-size", "large-biller");
            // sessionStorage.setItem("data-autopay-vendor-title", "Automatic bill payment for");
        }
        // window.location.href = './add_autopay.html';
    });

    init();

    stateManagement();
});

function init() {
    let totalAmount = 0;
    setTimeout(() => {
        $(".scheduled_payments_card .list-section-item:not(.hide) .amount").each((idx, elem) => {
            totalAmount += parseFloat($(elem).text().trim().substring(1).split(',').join(''));
        });
        $(".list-section-total .total_amount").text(numberWithCommas(totalAmount.toFixed(2)));
    }, 100);


    $(".scheduled-cards-inner").scroll();

    $("input[type='text']:not(.dont_clear)").val('');

    let nextDate = addDays(new Date(), 3).toISOString().split('T')[0];
    $("input[type='date']:not(.date-1-year)").attr('min', nextDate).val(nextDate);
    // $("input[type='date'].date-1-year").attr('min', nextDate).val(nextDate);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function addDays(theDate, days) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
}

var newDate = addDays(new Date(), 5);

function stateManagement(keepItems = {}) {
    let {keepName, keepAddress, keepEverything} = keepItems;

    if($(".card-add-autopay").length > 0) {
        keepEverything = true;
    }

    if($("[data-vendor-name]").length > 0 && !!sessionStorage.getItem("data-vendor-name")) {
        $("[data-vendor-name]").text(sessionStorage.getItem("data-vendor-name"));
    }

    if($("[data-vendor-address]").length > 0 && !!sessionStorage.getItem("data-vendor-address")) {
        $("[data-vendor-address]").html(sessionStorage.getItem("data-vendor-address"));
    }
    if($("[data-vendor-logo]").length > 0 && !!sessionStorage.getItem("data-vendor-logo")) {
        $("[data-vendor-logo]").attr("src", sessionStorage.getItem("data-vendor-logo"));
    }

    if($("[data-schedule-state]").length > 0 && !!sessionStorage.getItem("data-schedule-state")) {
        $("[data-schedule-state]").attr("data-schedule-state", sessionStorage.getItem("data-schedule-state"));
        $(".overlay-page-title").text(sessionStorage.getItem("data-schedule-overlay-title"));
        
        if(!!sessionStorage.getItem("data-schedule-state-editable")) {
            $("[data-schedule-state] .section-vendor-details").addClass("edit-existing");
            $(".autofill_amount").val(sessionStorage.getItem("data-schedule-state-editable-amount"));
            $(".autofill_select_savings").click();
            $(".autofill_deliver_by").val((new Date(`${sessionStorage.getItem("data-schedule-state-editable-deliver-by")} 2020`)).toISOString().split('T')[0]);
        }

    }

    if($("[data-bill-uploaded]").length > 0 && !!sessionStorage.getItem("data-bill-uploaded")) {
        sessionStorage.removeItem("data-bill-uploaded"); // IMPORTANT TO REMOVE RECURSION
        $("[data-bill-uploaded]").change();
    }

    if(!!sessionStorage.getItem("data-payment-scheduled")) {
        // $(".list-section-item.highlight").removeClass("hide invisible").addClass("selected");
    }
    if($("[data-payment-scheduled-amount]").length > 0 && !!sessionStorage.getItem("data-payment-scheduled-amount")) {
        $("[data-payment-scheduled-amount]").text(numberWithCommas(parseFloat(sessionStorage.getItem("data-payment-scheduled-amount")).toFixed(2)));
        if($("[data-payment-scheduled-amount]").text().trim().indexOf("$") !== 0) {
            $("[data-payment-scheduled-amount]").prepend("$");
        }
    }
    if($("[data-payment-scheduled-date]").length > 0 && !!sessionStorage.getItem("data-payment-scheduled-date")) {
        $("[data-payment-scheduled-date]").text(sessionStorage.getItem("data-payment-scheduled-date"));
    }

    // if($("[data-payment-type]").length > 0 && !!sessionStorage.getItem("data-payment-type")) {
    if(!sessionStorage.getItem("data-payment-type")) {
        sessionStorage.setItem("data-payment-type", "ePayment");
    }
    if(!!sessionStorage.getItem("data-payment-type") && ($("[data-payment-type]").length > 0 || $(".autofill_deliver_by").length > 0)) {
        $("[data-payment-type]").text(sessionStorage.getItem("data-payment-type"));
        updateDeliveryDate();
    }

    if(!!sessionStorage.getItem("data-autopay-scheduled")) {
        // $(".vendor-page-list-inner").addClass("hide");
        if(!!sessionStorage.getItem("data-autopay-amount-min")) {
            $("[data-autopay-amount-min]").text(sessionStorage.getItem("data-autopay-amount-min"));
            $(".vendor-page-list-inner.large-biller").removeClass("hide");
        } else {
            $(".vendor-page-list-inner.small-biller").removeClass("hide");
            $(".empty_table").addClass("hide");
        }
    }
    if($("[data-autopay-amount]").length > 0 && !!sessionStorage.getItem("data-autopay-amount")) {
        $("[data-autopay-amount]").text(numberWithCommas(parseFloat(sessionStorage.getItem("data-autopay-amount")).toFixed(2)));
        if ($("[data-autopay-amount]").text().trim().indexOf("$") !== 0) {
            $("[data-autopay-amount]").prepend("$");
        }
    }
    if($("[data-autopay-vendor-size]").length > 0 && !!sessionStorage.getItem("data-autopay-vendor-size")) {
        $("[data-autopay-vendor-size]").addClass(sessionStorage.getItem("data-autopay-vendor-size"));
    }
    if($("[data-autopay-vendor-title]").length > 0 && !!sessionStorage.getItem("data-autopay-vendor-title")) {
        $("[data-autopay-vendor-title]").text(sessionStorage.getItem("data-autopay-vendor-title"));
    }
    if($("[data-autopay-days-before]").length > 0 && !!sessionStorage.getItem("data-autopay-days-before")) {
        $("[data-autopay-days-before]").text(sessionStorage.getItem("data-autopay-days-before"));
    }

    $(".vendor_payment_history_card .vendor-page-list-inner").addClass("hide");
    if($("[data-vendor-short-name]").length > 0 &&
         !!sessionStorage.getItem("data-vendor-short-name") &&
         hasPaymentHistry(sessionStorage.getItem("data-vendor-short-name"))) {
        $("[data-vendor-short-name]").attr("data-vendor-short-name", sessionStorage.getItem("data-vendor-short-name"));
        $(".vendor_payment_history_card .vendor-page-list-inner").removeClass("hide");
    } else {
        // $("[data-vendor-short-name]").removeAttr("data-vendor-short-name");
        // $(".vendor_payment_history_card .vendor-page-list-inner").addClass("hide");
    }


    if ($(".home-page").length > 0) {
        sessionStorage.clear();
    }
}

function updateDeliveryDate() {
    if($(".autofill_deliver_by").length > 0) {
        let deliveryDateTemp = $(".autofill_deliver_by").val().split("-");
        let deliveryDate = deliveryDateTemp[1] + '/' + (deliveryDateTemp[2] - 2) + '/' + deliveryDateTemp[0];
        // $(".funds-deduction-time").text(deliveryDate);
        if (sessionStorage.getItem("data-payment-type") === "Check") {
            $(".payment-type-article").text("a");
            // $(".funds-deduction-time").text("4 days before");
            deliveryDate = deliveryDateTemp[1] + '/' + (deliveryDateTemp[2] - 4) + '/' + deliveryDateTemp[0];
        }
        if ((deliveryDateTemp[2] - 4) < 1) {
            deliveryDate = "2020/30/08";
        }
        $(".funds-deduction-time").text(deliveryDate);
    }
}

function getVendorShortName(vendorName) {
    return vendorName.split(' ')[0].split("'").join('').toLowerCase();
}

function hasPaymentHistry(vendorShortName) {
    if(vendorShortName === "bubs" ||
       vendorShortName === "hansen" ||
       vendorShortName === "capital" ||
       vendorShortName === "costco" ||
       vendorShortName === "maria" ||
       vendorShortName === "seaburn" ||
       vendorShortName === "verizon") {
           return true;
    }
    return false;
}

function checkHeroCardScroll(_this) {
    let scrollWidth = _this.scrollWidth - $(_this).width();

    if(_this.scrollLeft === 0) {
        $(_this).prev(".arrow-left").addClass("hide");
    } else {
        $(_this).prev(".arrow-left").removeClass("hide");
    }

    if(_this.scrollLeft === scrollWidth) {
        $(_this).next(".arrow-right").addClass("hide");
    } else {
        $(_this).next(".arrow-right").removeClass("hide");
    }
}

function showUploadAnimation(parentEl) {
    parentEl.find(".uploading").removeClass("hide");
    setTimeout(() => {
        parentEl.find(".uploading").addClass("hide");
    }, 4000);
}

function showScanAnimation(parentEl) {
    // parentEl.find(".uploaded-document-page").each((idx, elem) => {
    //     setTimeout(() => {
    //         $(elem).addClass("scanning");
    //     },(idx*100) + 4000);
    // });

    setTimeout(() => {
        parentEl.find(".uploaded-document-page").addClass("scanning");
    }, 4200);

    parentEl.find(".highlight-tag").each((idx, elem) => {
        setTimeout(() => {
            $(elem).removeClass("hide invisible").addClass("highlight");
        }, 8600 + (idx * 250));
        // setTimeout(() => {
            // $(elem).removeClass("highlight");
        // }, 7600 + (idx * 250));
    });

    setTimeout(() => {
        parentEl.find(".uploaded-document-page").removeClass("scanning");
    }, 10200);
}

function autoFillScannedInfo(parentEl) {
    setTimeout(() => {
        parentEl.find(".autofill_amount").val("12,750.00");
        parentEl.find(".autofill_select_checking").click();
        parentEl.find(".autofill_deliver_by").val("2020-09-06");
        updateDeliveryDate();
    }, 9000);
}

function disableFormFields(parentEl) {
    parentEl.find(".form-element, .button").addClass("disabled");
    setTimeout(() => {
        parentEl.find(".form-element, .button").removeClass("disabled");
    }, 9000);
}

function closeOverlay(_this) {
    if(!!_this) {
        $(_this).closest(".image-previews").addClass("hide");
        $(_this).closest(".modal").addClass("hide");
        $(_this).closest(".overlay-background").addClass("hide");
    } else {
        $(".overlay-background, .image-previews, .modal").addClass("hide");
    }
}