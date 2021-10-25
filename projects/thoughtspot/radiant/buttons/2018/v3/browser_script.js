cssButtonStyleContent = ".rd-button ::before,.rd-button ::after {transition: all 0.2s ease;}.rd-button {position: relative;height: 32px;line-height: 1;vertical-align: middle;padding: 0 24px;border-width: 2px;border-style: solid;border-radius: 16px;border-color: transparent;font-size: 14px;font-weight: 400;font-family: inherit;color: #2F3947;background-color: #E9EDF2;display: inline-flex;justify-content: center;align-items: center;cursor: pointer;text-transform: capitalize;transition: background-color .5s ease,border .2s ease,box-shadow .2s ease,color .2s ease;}.rd-button.disabled {opacity: 0.4;}.rd-button:focus {outline: 0;}.rd-button::-moz-focus-inner {border: 0;}/* PRIMARY BUTTON STYLES */.rd-button-primary {min-width: 56px;color: #FFF;background-color: #0D74FF;}.rd-button-primary:hover {background-color: #0063E6;}/* ACTIVE STATE NEEDS TO BE AFTER FOCUS */.rd-button-primary:focus,.rd-button-primary:active {background-color: #0058CC;}/* SECONDARY BUTTON STYLES */.rd-button-secondary {min-width: 56px;color: #2F3947;background-color: #E9EDF2;}.rd-button-secondary:hover {background-color: #DCE0E6;}/* ACTIVE STATE NEEDS TO BE AFTER FOCUS */.rd-button-secondary:focus,.rd-button-secondary:active {color: #FFF;background-color: #2F3947;}.rd-button.rd-button-icon-text {padding-left: 16px;}.rd-button.rd-button-icon-text .svg-icon {width: 24px;height: 24px;margin-right: 4px;margin-top: -2px;fill: #2F3947;}.rd-button.rd-button-icon-text:focus .svg-icon,.rd-button.rd-button-icon-text:active .svg-icon {fill: #FFF;}/* Secondary button with icon (16px - Icon 24px - 4px - Text -24px) *//* GHOST BUTTON BASE + SECONDARY STYLES */.rd-button.rd-button-ghost {min-width: 48px;height: 24px;color: #0D74FF;background-color: transparent;font-size: 12px;padding: 0;border-width: 0px;border-radius: 0px;}.rd-button.rd-button-ghost:hover {color: #0063E6;background-color: transparent;}/* ACTIVE STATE NEEDS TO BE AFTER FOCUS */.rd-button.rd-button-ghost:focus,.rd-button.rd-button-ghost:active {color: #0058CC;background-color: transparent;}/* GHOST BUTTON PRIMARY STYLES */.rd-button.rd-button-ghost-primary {font-weight: 700;}/* ICON BUTTONS (small,med,large) STYLES */.rd-button.rd-button-icon {width: 24px;height: 24px;padding: 0;}.rd-button.rd-button-icon-s {width: 20px;height: 20px;}.rd-button.rd-button-icon-m {width: 24px;height: 24px;}.rd-button.rd-button-icon-l {width: 32px;height: 32px;}.rd-button-icon {color: #2F3947;background-color: #E9EDF2;border-width: 0px;}.rd-button-icon:hover {background-color: #DCE0E6;}/* ACTIVE STATE NEEDS TO BE AFTER FOCUS */.rd-button-icon:focus,.rd-button-icon:active {color: #FFF;background-color: #2F3947;}.rd-button-icon:focus .svg-icon,.rd-button-icon:active .svg-icon {fill: #FFF;}/* INVERSE BUTTON SECONDARY STYLES */.rd-button-secondary.rd-button-inverse {color: #FFF;background-color: #47515F;}.rd-button-secondary.rd-button-inverse:hover {background-color: #5A6678;}/* ACTIVE STATE NEEDS TO BE AFTER FOCUS */.rd-button-secondary.rd-button-inverse:focus,.rd-button-secondary.rd-button-inverse:active {color: #2F3947;background-color: #FFF;}.rd-button.rd-button-inverse.rd-button-icon-text .svg-icon {fill: #FFF;}.rd-button.rd-button-inverse.rd-button-icon-text:focus .svg-icon,.rd-button.rd-button-inverse.rd-button-icon-text:active .svg-icon {fill: #2F3947;}/* INVERSE BUTTON GHOST STYLES */.rd-button-ghost.rd-button-inverse {color: #FFF;background-color: transparent;}.rd-button-ghost.rd-button-inverse:hover {color: #BEC6D0;background-color: transparent;}/* ACTIVE STATE NEEDS TO BE AFTER FOCUS */.rd-button-ghost.rd-button-inverse:focus,.rd-button-ghost.rd-button-inverse:active {color: #747E8C;}/* INVERSE BUTTON ICON STYLES */.rd-button-icon.rd-button-inverse {color: #FFF;background-color: #47515F;}.rd-button-icon.rd-button-inverse .svg-icon {fill: #FFF;}.rd-button-icon.rd-button-inverse:hover {background-color: #5A6678;}/* ACTIVE STATE NEEDS TO BE AFTER FOCUS */.rd-button-icon.rd-button-inverse:focus,.rd-button-icon.rd-button-inverse:active {color: #2F3947;background-color: #FFF;}.rd-button-icon.rd-button-inverse:focus .svg-icon,.rd-button-icon.rd-button-inverse:active .svg-icon {fill: #323946;}.rd-button.rd-button-sync {color: rgba(0, 0, 0, 0) !important;background-color: transparent;/* pointer-events: none; */}.rd-button .sync-loader {content: '';position: absolute;left: 0;right: 0;top: 0;bottom: 0;margin: auto;width: 32px;height: 32px;border: 0px solid;border-radius: 16px;border-color: #DCE0E6 #2F3947 #DCE0E6 #DCE0E6;opacity: 0;transition: width 0.2s ease;pointer-events: none;}.rd-button-sync .sync-loader {opacity: 1;width: 32px;border-width: 2px;animation: loader-spinner 0.8s 0.2s linear infinite;}.rd-button-sync .svg-icon {opacity: 0;}.rd-button-primary .sync-loader,.rd-button-secondary .sync-loader {width: 94px;}.rd-button-primary.rd-button-sync .sync-loader,.rd-button-secondary.rd-button-sync .sync-loader {width: 32px;}.rd-button-ghost .sync-loader {width: 48px;}.rd-button-ghost.rd-button-sync .sync-loader {width: 32px;}.rd-button-icon-s .sync-loader {width: 20px;height: 20px;}.rd-button-icon-m .sync-loader {width: 24px;height: 24px;}.rd-button-icon-l .sync-loader {width: 32px;height: 32px;}.rd-button-icon.rd-button-sync .sync-loader {animation-delay: 0s;}.rd-button-primary.rd-button-sync:hover {background-color: transparent;}.rd-button-secondary.rd-button-sync:hover {background-color: transparent;}.rd-button-secondary.rd-button-sync .sync-loader {border-color: #DCE0E6 #2F3947 #DCE0E6 #DCE0E6;}.rd-button.rd-button-ghost.rd-button-sync .sync-loader {border-color: #DCE0E6 #0D74FF #DCE0E6 #DCE0E6;}.rd-button-icon.rd-button-sync {background-color: transparent;}.rd-button-icon.rd-button-sync .sync-loader {border-color: #DCE0E6 #2F3947 #DCE0E6 #DCE0E6;}.rd-button-icon.rd-button-sync svg {opacity: 0;}/* INVERSE BUTTON BASE STYLES */.rd-button.rd-button-inverse.rd-button-sync .sync-loader {border-color: #DCE0E6 #FFF #DCE0E6 #DCE0E6;}.rd-button-secondary.rd-button-inverse.rd-button-sync {background-color: transparent;}.rd-button-secondary.rd-button-inverse.rd-button-sync:hover {background-color: transparent;}.rd-button-icon.rd-button-sync {background-color: transparent;}.rd-button-icon.rd-button-sync:hover {background-color: transparent;}@keyframes loader-spinner {100% {transform: rotate(360deg);}}";


cssButtonExplorationsContent = ".section-radiant {border-bottom: 1px solid #DCE0E6;}.section-radiant:nth-child(even) {border-left: 1px solid #DCE0E6;background-color: #f6f8fa;}.button-experiments .exploration1 .rd-button {transition: all 0.3s ease;}.button-experiments .exploration1 .rd-button:not(.rd-button-ghost):hover {box-shadow: 0 16px 16px -12px rgba(18,28,37,.15);}.button-experiments .exploration1 .rd-button:not(.rd-button-ghost):focus,.button-experiments .exploration1 .rd-button:not(.rd-button-ghost):active {box-shadow: 0 16px 8px -12px rgba(18,28,37,.15);}.button-experiments .exploration2 .rd-button {border-width: 0;}.button-experiments .exploration2 .rd-button-sync .sync-loader  {display: none;}.button-experiments .exploration2 .rd-button::after {content: '';position: absolute;left: 0;top: 0;right: 0;bottom: 0;width: 108px;height: 108px;margin: auto;background-color: rgba(0, 0, 0, 0.1);transform: scale(0);border-radius: 100px;}.button-experiments .exploration2 .rd-button-primary::after,.button-experiments .exploration2 .rd-button-secondary::after {left: -8px;}.button-experiments .exploration2 .rd-button.ripple::after {transition: transform 0.8s ease;transform: scale(1.2);}.button-experiments .exploration2 .rd-button-ghost::after {width: 48px;height: 48px;}.button-experiments .exploration2 .rd-button-icon-l::after {width: 32px;height: 32px;}.button-experiments .exploration2 .rd-button-icon-m::after {width: 24px;height: 24px;}.button-experiments .exploration2 .rd-button-icon-s::after {width: 20px;height: 20px;}.button-experiments .rd-button {overflow: hidden;}.button-experiments .exploration3 .rd-button:hover {transform: scale(1.03);transition: transform 0.2s ease;}.button-experiments .exploration4 .rd-button.shake-animation {animation: shake 0.3s linear 2;}@keyframes shake {0% {transform: translateX(0);}20% {transform: translateX(-4px);}40% {transform: translateX(0);}60% {transform: translateX(4px);}100% {transform: translateX(0);}}";

$('head').append('<style>' + cssButtonStyleContent + '</style>');
$('head').append('<style>' + cssButtonExplorationsContent + '</style>');

$(".bk-primary-button").each(function(idx, elem) {
  let classList = "rd-button rd-button-primary";
  if($(elem).hasClass("bk-disabled-button")) {
    classList += " disabled";
  }
  let buttonText = $(elem).find(".bk-text").text();
  $(elem).replaceWith('<button class="' + classList + '">' + buttonText + '</button>');
});
$(".bk-secondary-button").each(function(idx, elem) {
  let classList = "rd-button rd-button-secondary";
  if($(elem).hasClass("bk-disabled-button")) {
    classList += " disabled";
  }
  let buttonText = $(elem).find(".bk-text").text();
  if($(elem).find(".svg-icon").length > 0) {
    let innerHtml = $(elem).find(".svg-icon-block").clone(true)[0];
    $(elem).replaceWith('<button class="' + classList + ' rd-button-icon-text">' + $(innerHtml).html() + ' ' + buttonText + '</button>');
  } else {
    $(elem).replaceWith('<button class="' + classList + '">' + buttonText + '</button>');
  }
});

$("body").on("click", ".rd-button-primary", function(evt) {
  evt.stopPropagation();
  $(this).toggleClass("rd-button-sync");
});


$(".svg-icon-action-block").each(function(idx, elem) {
  let innerHtml = $(elem).clone(true)[0];
  let classList = $(elem).attr("class") + " rd-button rd-button-icon rd-button-icon-";
  // let classList = "svg-icon-block rd-button rd-button-icon rd-button-icon-";
  // svg-icon-block svg-icon-action-block svg-icon-block-xl rd-icon-more-xl
  classList = classList.split("svg-icon-action-block").join("");
  if($(elem).width() >= 32) {
    classList += "l";
  } else if($(elem).width() < 32 && $(elem).width() >= 24) {
    classList += "m";
  } else if($(elem).width() < 24) {
    classList += "s";
  }
  $(elem).replaceWith('<button class="' + classList + '">' + $(innerHtml).html() + '</button>');
});


$("body").on("click", ".rd-button", function(evt) {
  if($("body").hasClass("exploration2")) {
    evt.stopPropagation();
    // evt.preventDefault();

    $(this).removeClass("rd-button-sync");
    $(this).addClass("ripple");
    setTimeout(() => {
      $(this).removeClass("ripple");
    }, 500);
  }
});

$("body").on("click", ".rd-button.disabled", function(evt) {
  if($("body").hasClass("exploration4")) {
    evt.stopPropagation();
    $(this).removeClass("shake-animation");
    $(this).addClass("shake-animation");

    setTimeout(() => {
      $(this).removeClass("shake-animation");
    }, 1000);
  }
});

$("html").addClass("button-experiments");
$("body").addClass("exploration1");
