//GLOBAL VARIABLES
var userConfirm = true;
var sourceOfClick;
var firstClickParental = true;
var firstClickGuest = true;
var isOutage = false;

$(window).resize(function() {
// 	if($(window).innerWidth() < 481) {
// 		console.log("mobile");
// 		mobileView();
// 	} else {
// 		console.log("desktop");
// 		desktopView();
// 	}
	if($(window).innerWidth() > 480) {
		// $(".nav_item.selected").find(".name").css({"border-bottom": "4px solid #1B5C9C"});
		$("svg.connectivity_line").css("z-index", -1);
	} else {
		// $(".nav_item.selected").find(".name").css({"border-bottom": "0px"});
		updateSVGLine();
	}
});
function updateSVGLine() {
	var totalHeight = 0;
	$(".device.active").each(function() {
		totalHeight += $(this).outerHeight();
	});
	$(".device.active + .accordion").each(function() {
		totalHeight += $(this).outerHeight();
	});
	$("svg.device_line").css("height", totalHeight - 20);
}
$(".nav_item").click(function() {
	$(".nav_item").removeClass("selected");
	$(".name").css({"border-bottom": "0px"});
	$(this).addClass("selected");
	if($(window).innerWidth() > 480) {
		// $(this).find(".name").css({"border-bottom": "4px solid #1B5C9C"});
		$(".nav_tab .card").removeClass("selected");
		$(".nav_tab").find("." + $(this).attr("id")).addClass("selected");
	}
});

$("#toggleParCtrl").click(function() {
	if(firstClickParental && $(this).prop("checked")) {
		firstClickParental = false;
		$(".toggleParCtrl").click();
	}
});
$(".toggleParCtrl").click(function() {
	$(".more_settings").click();
	if($("#net_parental_settings .header").parent().find(".card").hasClass("hide")) {
		$("#net_parental_settings .header").click();

		$("#toggleSiteAccs_S").prop("checked", false);
		$("#toggleSiteAccs_S").click();
	}

	$("#net_parental_settings").velocity("scroll", {
	  duration: 500,
	  delay: 800
	});
});

/* $(".toggleFirewall").click(function() {
	$(".more_settings").click();
	$("#network_security .header").click();

	$("#toggleNetSecurity1").prop("checked", false);
	$("#toggleNetSecurity1").click();

	$("#network_security").velocity("scroll", {
	  duration: 500,
	  delay: 800
	});
}); */

$("#toggleGuestNet").click(function() {
	if(firstClickGuest && $(this).prop("checked")) {
		firstClickGuest = false;
		$(".toggleGuestNet").click();
	}
});
$(".toggleGuestNet").click(function() {
	$(".more_settings").click();
	if($("#guest_network .header").parent().find(".card").hasClass("hide")) {
		$("#guest_network .header").click();

		$("#toggleGuestNet1").prop("checked", false);
		$("#toggleGuestNet1").click();
		$("#toggleGuestNet2").prop("checked", false);
		$("#toggleGuestNet2").click();
	}
	$("#guest_network").velocity("scroll", {
	  duration: 500,
	  delay: 800
	});

});

$("#toggleGuestNet1").click(function() {
	if($(this).prop("checked")) {
		$(".guest_network1").removeClass("hidden");
	} else {
		$(".guest_network1").addClass("hidden");
	}
});
$("#toggleGuestNet2").click(function() {
	if($(this).prop("checked")) {
		$(".guest_network2").removeClass("hidden");
	} else {
		$(".guest_network2").addClass("hidden");
	}
});

$(".more_settings").click(function() {
	// $(".devices_menu").addClass("hide");
	$(".devices_menu, .acs_nav, .internet_info, .margin2, header").css("display", "none");
	$(".settings_return").css("display", "block");
	$(".settings_menu").removeClass("hide");
	$(".factory_reset").removeClass("hidden");
});
$(".settings_return").click(function() {
	if(!userConfirm) {
		sourceOfClick = $(this);
		$(".overlay_header").text("Save Changes");
		$(".overlay_msg").text("Are you sure you want to return without saving?");
		$(".confirm_overlay").removeClass("hidden");
	} else {
		$(".devices_menu, .acs_nav, .internet_info, .margin2, header").css("display", "block");
		$(".settings_return").css("display", "none");
		$(".settings_menu").addClass("hide");
		$(".factory_reset").addClass("hidden");
	}
});

$(".nav_item").click(function() {
	if(window.innerWidth < 481) {
		var targetEl = $(this).next(".card");
		targetEl.toggleClass("show");

		if(targetEl.hasClass("show")) {
			$(this).prev("svg").css("z-index", 1);
			$(this).next().next("svg").css("z-index", -1);
			$(this).addClass("selected");
			$(this).find(".name .change_text").text("Hide");
			targetEl.css({height: targetEl.children().outerHeight() + 125});
		} else {
			targetEl.css({height: 0});
			$(this).prev("svg").css("z-index", -1);
			$(this).removeClass("selected");
			$(this).find(".name .change_text").text("Show");
		}

		if($(this).attr("id") == "devices_nav") {
			$(".settings_menu").addClass("hide");
			$(".factory_reset").addClass("hidden");
			$(".devices_menu").toggleClass("hide");
			if($(".devices_menu").hasClass("hide")) {
				$("#devices_nav .change_text").text("Show");
			} else {
				$("#devices_nav .change_text").text("Hide");
			}
		}
	} else {
		if(userConfirm) {
			$(".acs_menu_item").addClass("hide");
			$(".factory_reset").addClass("hidden");

			if($(this).attr("id") == "devices_nav") {
				$(".devices_menu").removeClass("hide");
			} else if($(this).attr("id") == "modem_nav") {
				$(".settings_menu").removeClass("hide");
				$(".factory_reset").removeClass("hidden");
			}
		} else {
			sourceOfClick = $(this);
			$(".overlay_header").text("Save Changes");
			$(".overlay_msg").text("Are you sure you want to return without saving?");
			$(".confirm_overlay").removeClass("hidden");
		}
	}
	updateSVGLine();
});
$(".acs_nav .toggle").click(function() {
	var elemID = $(this).attr("id");
	if($(this).prop("checked")) {
		$(this).parents(".card").find(".hidden_text." + elemID).css({visibility: "visible", opacity: 1});
	} else {
		$(this).parents(".card").find(".hidden_text." + elemID).css({visibility: "hidden", opacity: 0});
	}
});

$(".toggle.prioritize_device").click(function() {
	var element = $(this);

	if(element.prop("checked")) {
		$(".toggle.prioritize_device").prop("checked", false);
		element.prop("checked", true);
	} else {
		$(".toggle.prioritize_device").prop("checked", false);
	}
});

$(".filter_item").click(function() {
	$(".filter_item").removeClass("selected");
	$(this).addClass("selected");
});

$(".show_password").click(function() {
	if($(this).text().trim() == "Show Password") {
		$(this).prev(".show_this").removeClass("hidden");
		$(this).text("Hide Password");
	} else if($(this).text().trim() == "Hide Password") {
		$(this).prev(".show_this").addClass("hidden");
		$(this).text("Show Password");
	}
});

$(".device .device_info").click(function() {
	var accordion_height = 0;
	var targetEl = $(this).closest(".card").next(".accordion");
	var animateEl = $(this).find(".device_settings img");
	var nameEl = $(this).find(".editable");

	if($(window).innerWidth() < 481) {
		// $(".devices_menu").addClass("hide");
		$(".settings_menu, .internet_info, .margin2, header").css("display", "none");
		$(".factory_reset").addClass("hidden");
		$(".devices_menu").children().css("display", "none");
		$(".device_return").removeClass("hide");
		targetEl.css("display", "block");

		targetEl.find("svg.indicator circle:nth-child(2)").css("stroke-dashoffset", $(this).next(".device_stats").find(".bandwidth svg.indicator circle:nth-child(2)").css("stroke-dashoffset"));

		targetEl.find(".bandwidth.indicator").css("transform", "scale(1)");
	} else {
		if($(this).closest(".device").hasClass("active") && $(window).innerWidth() > 480) {
			nameEl.attr("contenteditable", true);
			nameEl.addClass("content_editable");
			$(this).find(".device_settings .desktop").text("Hide Device Settings");
			// nameEl.focus();
		}
	}

	targetEl.children().each(function() {
		accordion_height += $(this).outerHeight();
	});

	if(targetEl.height() < 5) {
		targetEl.css({height: accordion_height});
		animateEl.css("transform", "rotate(135deg)");
		if($(window).innerWidth() > 480) {
			targetEl.find(".settings_item, .buttons").css({margin: "0 20px"});
			targetEl.next(".device").css("box-shadow", "0 0 4px #DEDEDE");
		}
	} else {
		targetEl.css({height: 0});
		animateEl.css("transform", "rotate(0deg)");

		nameEl.removeClass("content_editable");
		nameEl.attr("contenteditable", false);
		$(this).find(".device_settings .desktop").text("Device Settings");

		if($(window).innerWidth() > 480) {
			targetEl.find(".settings_item, .buttons").css({margin: "0"});
			targetEl.next(".device").css("box-shadow", "0 3px 4px #DEDEDE");
		}
	}
});

$(".device .device_info").on("click", ".content_editable", function(e) {
	e.stopPropagation();
});

$(".background_white").click(function() {
	$(".confirm_no").click();
});

$(".confirm_no").click(function() {
	userConfirm = false;
	$(".confirm_overlay").addClass("hidden");
});
$(".confirm_yes").click(function() {
	userConfirm = true;
	// console.log(userConfirm);
	$(".confirm_overlay").addClass("hidden");

	if(sourceOfClick.hasClass("blockButton")) {
		blockDevice(sourceOfClick);
	}
	if(sourceOfClick.hasClass("removeButton")) {
		blockDevice(sourceOfClick);
		sourceOfClick.parents(".accordion").velocity({height: 0, padding: 0});
		sourceOfClick.parents(".accordion").prev(".device").velocity({height: 0, padding: 0});
		sourceOfClick.parents(".accordion").next(".device").css("box-shadow", "0 3px 4px #DEDEDE");
		// sourceOfClick.parents(".accordion").prev(".device").addClass("hidden");
		if($(window).innerWidth() < 481) {
			sourceOfClick.parents(".accordion").find(".device_return").click();
		}
	}
	if(sourceOfClick.hasClass("settings_return")) {
		sourceOfClick.click();
		deactivateButtons(sourceOfClick.closest(".accordion"));
	}
	if(sourceOfClick.hasClass("device_return")) {
		sourceOfClick.click();
		deactivateButtons(sourceOfClick.closest(".accordion"));
	}
	if(sourceOfClick.hasClass("nav_item")) {
		sourceOfClick.click();
		// deactivateButtons(sourceOfClick.closest(".accordion"));
	}
});
$(".blockButton").click(function() {
	userConfirm = false;
	sourceOfClick = $(this);
	$(".confirm_overlay").removeClass("hidden");

	if(sourceOfClick.text() == "Block Device") {
		$(".overlay_header").text("Block Device?");
		$(".overlay_msg").text("You are about to block this device. Are you sure you want to block it?");
	} else if(sourceOfClick.text() == "Unblock Device") {
		$(".overlay_header").text("Unblock Device?");
		$(".overlay_msg").text("You are about to block this device. Are you sure you want to unblock it?");
	}
});
$(".removeButton").click(function() {
	userConfirm = false;
	sourceOfClick = $(this);
	$(".confirm_overlay").removeClass("hidden");

	if(sourceOfClick.text() == "Remove Device") {
		$(".overlay_header").text("Remove Device?");
		$(".overlay_msg").text("remove this device?");
	} else if(sourceOfClick.text() == "Add Device") {
		$(".overlay_header").text("Add Device?");
		$(".overlay_msg").text("add this device?");
	}
});

$(".device_return").click(function() {
	if(!userConfirm) {
		sourceOfClick = $(this);
		$(".overlay_header").text("Save Changes");
		$(".overlay_msg").text("Are you sure you want to return without saving?");
		$(".confirm_overlay").removeClass("hidden");
	} else {
		$(".settings_menu, .internet_info, .margin2, header").css("display", "block");
		$(".factory_reset").removeClass("hidden");
		$(".device_return").addClass("hide");
		$(".devices_menu").children().css("display", "block");
		$(".devices_menu .accordion").css({height: 0});
	}
});

$(".settings_item .header").click(function() {
	var targetEl = $(this).parent().find(".card,.buttons");
	var parentEl = $(this).closest(".accordion");
	// targetEl.height(targetEl.children("div").height());
	var isOpen = targetEl.hasClass("hide");
	$(this).closest(".accordion").find(".settings_item .card:not(.keep_open),.buttons").addClass("hide");
	parentEl.find(".settings_item .header img").attr("src", "images/Plus_Blue.svg");
	// targetEl.toggleClass("hide");
	if(isOpen) {
		targetEl.removeClass("hide");
		$(this).find("img").attr("src", "images/Minus_White.svg");
	} else {
		targetEl.addClass("hide");
		$(this).find("img").attr("src", "images/Plus_Blue.svg");
	}
	updateAccordion(parentEl);
});

$(".accordion .card input, .accordion .card select").change(function() {
	activateButtons($(this).closest(".accordion"));
	userConfirm = false;
});

$(".saveButton, .cancelButton").click(function(e) {
	e.stopPropagation();
	deactivateButtons($(this).closest(".accordion"));
	userConfirm = true;
});
$(".cancelButton").click(function(e) {
	// $(this).parents(".accordion:not(.settings_menu)").css({height: 0});
	$(this).parents(".accordion").prev(".device").find(".device_info").click();
	$(this).parents(".accordion").find(".device_return").click();

	// $(this).parents(".accordion").next(".device").css("box-shadow", "0 3px 4px #DEDEDE");
});

$(".restrictAccessButton").click(function(e) {
	var radio_name_new = 'radio_new' + Math.random() * 1000;
	var newContent = '<div class="form"><div class=""><span class="semi_bold">Step 1: Input site you would like to restrict access to.</span><span class="delete_icon disabled right">Delete <img src="images/Delete.svg"/></span></div><div class="changeDiv"><input type="text" value="*"/></div><div><span class="semi_bold">Step 2: Would you like to always block this site or based on a schedule?</span></div><div class="changeDiv"><input type="radio" name="' + radio_name_new + '" class="radio_device_option" checked><label class="radio_label">Always</label><input type="radio" name="' + radio_name_new + '" class="radio_device_option"><label class="radio_label">Per Schedule</label></div><div class="per_schedule"><div><div class="semi_bold"><span class="">Step 3: Set time of day te network cannot access this site.</span></div><div class="changeDiv"><span>Start Time</span> <span><input class="input_time start_hr" type="text" value="6" maxlength="2"/></span> : <span><input class="input_time start_min" type="text" value="00" maxlength="2"/></span><select class="start_AM"><option>AM</option><option checked>PM</option></select></div><div class="changeDiv"><span>End Time</span> <span><input class="input_time end_hr" type="text" value="8" maxlength="2"/></span> : <span><input class="input_time end_min" type="text" value="00" maxlength="2"/></span><select class="end_AM"><option>AM</option><option checked>PM</option></select></div><div class="semi_bold"><span>Step 4 (optional): Set day of the week the above time restriction is active.</span></div><div class=""><input type="checkbox"/> <span>S</span><input type="checkbox"/> <span>M</span><input type="checkbox"/> <span>T</span><input type="checkbox"/> <span>W</span><input type="checkbox"/> <span>T</span><input type="checkbox"/> <span>F</span><input type="checkbox"/> <span>S</span></div><div class="semi_bold">Summary</div><div class="">Devices will not be able to access the network between <span class="start_time">6:00pm</span>and <span class="end_time">8:00PM</span><span class="summary_details"></span></div></div></div>';

	$(this).before(newContent);
	updateAccordion($(this).closest(".accordion"));
});

$(".active .indicator.signal").click(function(e) {
	e.stopPropagation();
	$(".tool_tip, .tool_tip > div").addClass("hidden");
	// $(".tool_tip_alert").addClass("hide");

	var signalLevel = $(this).find("svg.indicator circle:nth-child(2)").css("stroke-dashoffset");
	console.log(signalLevel);
	if(signalLevel == "66px") {
		$(".tool_tip, .tool_tip > .med").removeClass("hidden");
	} else if(signalLevel == "0px") {
		$(".tool_tip, .tool_tip > .high").removeClass("hidden");
	} else if(signalLevel == "129px") {
		$(".tool_tip, .tool_tip > .med").removeClass("hidden");
	}

	var posn = ($(window).width() - $("article").outerWidth()) / 2;
	// console.log($(window).width());
	$(".tool_tip").css({left: e.pageX - posn - $(".tool_tip").width(), top: $(this).offset().top - $(".tool_tip").height() - 190});

	if($(window).innerWidth() < 481) {
		$(".tool_tip").css({left: $(this).offset().left - 175, top: $(this).offset().top - $(".tool_tip").height() - 110});
	}
});
$(".active .indicator.bandwidth").click(function(e) {
	e.stopPropagation();
	$(".tool_tip, .tool_tip > div").addClass("hidden");
	$(".tool_tip, .tool_tip > .bandwidth_t").removeClass("hidden");
	// $(".tool_tip_alert").addClass("hide");

	var posn = ($(window).width() - $("article").outerWidth()) / 2;
	$(".tool_tip").css({left: e.pageX - posn - $(".tool_tip").width(), top: $(this).offset().top - $(".tool_tip").height() - 190});

	if($(window).innerWidth() < 481) {
		$(".tool_tip").css({left: $(this).offset().left - 175, top: $(this).offset().top - $(".tool_tip").height() - 110});
	}
	// $("head").append('<style>.tool_tip:after, .tool_tip:before{left:82%;}</style>');

	if($(this).parents(".accordion").length) {
		console.log("should not be");
		$(".tool_tip").css({left: $(this).offset().left, top: $(this).offset().top - $(".tool_tip").height() - 50});
		// $("head").append('<style>.tool_tip:after, .tool_tip:before{left:15%;}</style>');
	}
});
$("article").click(function(e) {
	e.stopPropagation();
	$(".tool_tip, .tool_tip > div").addClass("hidden");
	$(".help_tool_tip").addClass("hidden");
	// $(".tool_tip_alert").addClass("hide");
});

$(".helpQ").click(function(e) {
	e.stopPropagation();
	$(".help_tool_tip").removeClass("hidden");
	// $(".tool_tip_alert").addClass("hide");

	var posn = ($(window).width() - $("article").outerWidth()) / 2;
	// console.log($(window).width());
	$(".help_tool_tip").css({left: e.pageX - posn - $(".help_tool_tip").width(), top: $(this).offset().top - 100});

	if($(window).innerWidth() < 481) {
		$(".help_tool_tip").css({left: 20, top: $(this).offset().top + 30});
	}
});

function blockDevice(device) {
	var newText = "";
	if(device.text() == "Block Device") {
		newText = "Unblock Device";
	} else if(device.text() == "Unblock Device") {
		newText = "Block Device";
	} else if(device.text() == "Remove Device") {
		newText = "Device ";
	}
	// } else if(device.text() == "Add Device") {
	// 	newText = "Remove Device";
	// }

	device.text(newText);
	device.closest(".settings_options").find(".semi_bold").text(newText);
}

function activateButtons(targetEl) {
	targetEl.find(".saveButton").removeClass("disabled");
	// targetEl.find(".cancelButton").removeClass("blue");
	targetEl.find(".saveButton").addClass("blue");
	targetEl.find(".float_buttons").removeClass("hide");
}
function deactivateButtons(targetEl) {
	targetEl.find(".saveButton").addClass("disabled");
	// targetEl.find(".cancelButton").addClass("blue");
	targetEl.find(".saveButton").removeClass("blue");
	targetEl.find(".float_buttons").addClass("hide");
}

$(".detailed_settings").on("click", ".delete_icon", function() {
	$(this).closest(".form").addClass("hide");
	updateAccordion($(this).closest(".accordion"));
});

$(".detailed_settings").on("change", ".input_time, .start_AM, .end_AM", function() {
	var parentEl = $(this).parents(".detailed_settings");

	if($(this).parents(".per_schedule").length) {
		parentEl = $(this).parents(".per_schedule");
	} else {
		parentEl = $(this).parents(".detailed_settings");
	}

	parentEl.find(".start_time").text(parentEl.find(".start_hr").val() + ":" + parentEl.find(".start_min").val() + parentEl.find(".start_AM").val());

	parentEl.find(".end_time").text(parentEl.find(".end_hr").val() + ":" + parentEl.find(".end_min").val() + parentEl.find(".end_AM").val());
});

$(".accordion").on("click", "input[type='checkbox']", function() {
	var parentEl = $(this).parents(".detailed_settings");

	if($(this).parents(".per_schedule").length) {
		parentEl = $(this).parents(".per_schedule");
	} else {
		parentEl = $(this).parents(".detailed_settings");
	}

	var targetEl = parentEl.find(".summary_details");
	var checkBoxes = parentEl.find("input[type='checkbox']");
	var updateString = "on ";

	checkBoxes.each(function() {
		if($(this).index() == 0 && $(this).prop("checked")) {
			updateString += "Sunday, ";
		}
		if($(this).index() == 2 && $(this).prop("checked")) {
			updateString += "Monday, ";
		}
		if($(this).index() == 4 && $(this).prop("checked")) {
			updateString += "Tuesday, ";
		}
		if($(this).index() == 6 && $(this).prop("checked")) {
			updateString += "Wednesday, ";
		}
		if($(this).index() == 8 && $(this).prop("checked")) {
			updateString += "Thursday, ";
		}
		if($(this).index() == 10 && $(this).prop("checked")) {
			updateString += "Friday, ";
		}
		if($(this).index() == 12 && $(this).prop("checked")) {
			updateString += "Saturday, ";
		}
	});

	if(updateString.length < 4) {
		updateString = "";
	}
	if(updateString.length > 4) {
		updateString = updateString.substring(0, updateString.lastIndexOf(","));
	}
	if(updateString.length > 13) {
		updateString = updateString.substring(0, updateString.lastIndexOf(",")) + " and " +
		updateString.substring(updateString.lastIndexOf(",") + 2);
	}
	targetEl.text(updateString);
	// if(thisEl.next().next().next().text().trim === "M") {
	// 	if(updateString === "") {
	// 		updateString = "Sunday";
	// 	} else if(updateString.length() < 10) {
	// 		updateString = "Sunday and " + updateString;
	// 	}
	// }
});
$(".accordion").on("click", "input.radio_device_option, .settings_options .toggle", function() {
	var targetEl = $(this).closest(".card").find(".detailed_settings");
	// console.log($(this).prop("checked"));
	if($(this).next("label").text() == "On" || ($(this).prop("checked") && $(this).next("label").attr("data-on") == "On")) {
	// console.log($(this).next("label").text());
		// targetEl.css("height", targetEl.children("div").outerHeight());
		targetEl.removeClass("hide");
	} else if($(this).next("label").text() == "Off" || (!$(this).prop("checked") && $(this).next("label").attr("data-on") == "On")) {
	// console.log($(this).next("label").text());
		// targetEl.css("height", 0);
		targetEl.addClass("hide");
	}

	var targetEl2 = $(this).closest(".form").find(".per_schedule");
	if($(this).next("label").text() == "Per Schedule") {
		targetEl2.css("height", targetEl2.children("div").outerHeight() + 40);
	} else if($(this).next("label").text() == "Always" || $(this).next("label").text() == "Never") {
		targetEl2.css("height", 0);
	}
	updateAccordion(targetEl.closest(".accordion"));

	$(this).closest(".detailed_settings").find(".chk_high").css("visibility", "hidden");
	$(this).closest(".detailed_settings").find(".chk_high").parent().removeClass("semi_bold");
	if($(this).next("label").text() == "Low") {
		$(this).closest(".detailed_settings").find(".chk_low").css("visibility", "visible");
		$(this).closest(".detailed_settings").find(".chk_low").parent().addClass("semi_bold");
	} else if($(this).next("label").text() == "Medium") {
		$(this).closest(".detailed_settings").find(".chk_med").css("visibility", "visible");
		$(this).closest(".detailed_settings").find(".chk_med").parent().addClass("semi_bold");
	} else if($(this).next("label").text() == "High") {
		$(this).closest(".detailed_settings").find(".chk_high").css("visibility", "visible");
		$(this).closest(".detailed_settings").find(".chk_high").parent().addClass("semi_bold");
	}
});

function updateAccordion(element) {
	// USING TIMER TO ALLOW TIME FOR toggleClass TO TAKE EFFECT
	window.setTimeout(function() {
		var accordion_height = 0;
		element.children().each(function() {
			accordion_height += $(this).outerHeight();
		});

		element.css({"height": accordion_height});

	},360);

	// window.setTimeout(function() {
	// 	updateSVGLine();
	// },1500);
}

var animateNumber = function(element, fromNumber, toNumber) {
	element.text(fromNumber);
	var i = toNumber;

	if(i > fromNumber) {
		animateNumber(element, fromNumber, i-1);
		window.setTimeout(function() {
			element.text(i);
		}, i * 1000/(i+5));
	}
};

var checkInternet = function() {
	if(isOutage) {
		$("#internet_nav .status_check").attr("src", "images/X_Red.svg");
		$("#internet_nav .status_text").removeClass("green_text").addClass("red_text");
		$("#internet_nav .status_text").text("Not Connected");

		// $(".internet_info").addClass("hidden");
	}
	$("#internet_nav .status_check").delay(500).velocity({scale: 1});
	$("#internet_nav .status_text").delay(500).velocity({opacity: 1});

	if(!isOutage) {
		$("#internet_modem_line line").delay(600).velocity({x2: "100%"});

		window.setTimeout(function() {
			$("#internet_nav").addClass("enabled");
		}, 300);
	}
	return true;
}
var checkModem = function() {
	if(isOutage) {
		$("#modem_nav .status_check").attr("src", "images/X_Red.svg");
		$("#modem_nav .status_text").removeClass("green_text").addClass("red_text");
		$("#modem_nav .status_text").text("Not Connected");

		$(".settings_menu").addClass("hidden");
	}
	$("#modem_nav .status_check").delay(800).velocity({scale: 1});
	$("#modem_nav .status_text").delay(800).velocity({opacity: 1});

	if(!isOutage) {
		$("#modem_devices_line line").delay(1100).velocity({x2: "100%"});

		window.setTimeout(function() {
			$("#modem_nav").addClass("enabled");
		}, 800);
	}
	return true;
}
var checkDeviceList = function() {
	if(isOutage) {
		$("#devices_nav .status_check").attr("src", "images/X_Red.svg");
		$("#devices_nav .status_text").removeClass("green_text").addClass("red_text");
		$("#devices_nav .status_text").text("Not Connected");
		$("#devices_nav .status_text:not(:first-of-type)").addClass("hidden");
		$("#devices_nav .status .icon_text").text("");

		$(".devices_menu").addClass("hidden");
	}

	$("#devices_nav .status_check").delay(1600).velocity({scale: 1});
	$("#devices_nav .status_text").delay(1400).velocity({opacity: 1});

	if(!isOutage) {
		window.setTimeout(function() {
			$("#devices_nav").addClass("enabled");

			if($(window).innerWidth() > 480) {
				$("#devices_nav").addClass("selected");
				// randomSignalStrength();
			}
			// $("#devices_nav .icon_text").text("4");

			var devicesNum = 4;
			if(devicesNum>99) {
				$("div.icon_text").css("font-size", "30px");
			} else if(devicesNum>9) {
				$("div.icon_text").css("font-size", "40px");
			}
			animateNumber($("#devices_nav .icon_text"), 0, devicesNum);

			var totalHeight = 0;
			$(".devices_menu .card").each(function() {
				totalHeight += $(this).outerHeight();
			})

			$(".devices_menu").velocity({opacity: 1});
		}, 1600);
	}
	return true;
}

var randomSignalStrength = function() {
		// console.log(Math.random()*190);
		var prevNum = 0;
		var elementNum = 0;
		$(".device.active svg.indicator circle:nth-child(2)").each(function() {
			var randomNo = Math.random()*190;
			var parentEl = $(this).parents("div.indicator")
			if(parentEl.hasClass("signal")) {
				elementNum++;

				//WORKAROUND FOR USER TESTS
				if(elementNum == 1) {
					randomNo = 130;
				}
				if(elementNum == 2) {
					randomNo = 67;
				}
				if(elementNum > 2) {
					randomNo = 1;
				}

				if(randomNo > 129) {
					randomNo = 129;
					$(this).css({"stroke": "#FF7D75"});
					parentEl.find("img").attr("src", "images/Wifi_Red.svg");
			 	} else if(randomNo > 66) {
					randomNo = 66;
				 $(this).css({"stroke": "#FF9951"});
				 parentEl.find("img").attr("src", "images/Wifi_Orange.svg");
				} else {
					randomNo = 0;
		 			$(this).css({"stroke": "#90D963"});
					parentEl.find("img").attr("src", "images/Wifi_Green.svg");
				}

				$(this).css({"stroke-dashoffset": randomNo});
			} else {
				// Math.random() * (max - min) + min;
				randomNo = Math.random() * (190 - prevNum) + prevNum;
				$(this).css({"stroke-dashoffset": randomNo});
				prevNum += 190 - randomNo;
				console.log(190 - randomNo);
				parentEl.find("img").attr("src", "images/Bandwidth_Blue.svg");
			}
		});
};

var initializePage = function() {

	if(params.serviceoutage === "true" || params.disconnected === "true") {
		isOutage = true;
	} else {
		isOutage = false;
	}

	if(params.serviceoutage === "true") {
		$("#serviceOutageAlert").removeClass("hidden");
	} else {
		$("#serviceOutageAlert").addClass("hidden");
	}

	if(params.disconnected === "true") {
		$("#deviceOutageAlert").removeClass("hidden");
	} else {
		$("#deviceOutageAlert").addClass("hidden");
	}

	if(!$("#serviceOutageAlert").hasClass("hidden")) {
		$(".nav_tab").css("top", "455px");
	}

	// INITIALIZING ACS_NAV ELEMENTS
	// $("#internet_modem_line line").delay(300).velocity({x2: "100%"});
	// $("#modem_devices_line line").delay(300).velocity({x2: "100%"});
	var statusInternet = false,
			statusModem = false,
			statusDevices = false;

	if(isOutage) {
		$(".devices_menu").addClass("hide");
	}

	statusInternet = checkInternet();

	if(statusInternet === true) {
		statusModem = checkModem();
	// checkDeviceList();
	}
	if(statusModem === true) {
		statusDevices = checkDeviceList();
	}

	if($(window).innerWidth() < 481) {
		$(".devices_menu").addClass("hide");
	}
	window.setTimeout(function() {
		randomSignalStrength();
		$(".tool_tip_alert, .error_state").removeClass("hide");
		$(".error_state").last().css({"border-bottom": "2px solid #DE6F69"});
		//$("svg.device_line").css("height", $(".devices_menu").height() + 10);
	}, 2500);


	// $.Velocity.RunSequence([
  //  { e: $("#internet_nav .status_check"), p: { scale: 1 }, o: {delay: 500}},
  //  { e: $("#internet_nav .status_text"), p: { opacity: 1 }},
  //  { e: $("#internet_modem_line line"), p: { x2: "100%" }, o: {delay: 300}},
  //  { e: $("#modem_nav .status_check"), p: { scale: 1 }, o: {easing: "spring", delay: 300}},
  //  { e: $("#modem_nav .status_text"), p: { opacity: 1 }},
  //  { e: $("#modem_devices_line line"), p: { x2: "100%" }, o: {delay: 500}},
  //  { e: $("#devices_nav .status_check"), p: { scale: 1 }, o: {easing: "spring", delay: 300}},
  //  { e: $("#devices_nav .status_text"), p: { opacity: 1 }}
	// ]);

};

initializePage();
