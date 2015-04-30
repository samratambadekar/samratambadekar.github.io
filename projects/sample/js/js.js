
$(".notification, .alertNotification, .menuItem, .voiceMailLine, .callHistoryLine, .textMessage, .button, .tab, .settingsMenuItem").on("click", function(e) {
	if ($(window).width() <= 481) {
		/* e.preventDefault(); */
		/* remove the div with class ripple from all other elements */
		$("div").find(".ripple").remove();
		
		//var parent = $(this).parent();
		var parent = $(this);
		
		//create .ripple element if it doesn't exist
		if(parent.find(".ripple").length == 0)
		{
			parent.prepend("<div class='ripple'></div>");
		}

		ripple = parent.find(".ripple");
		//incase of quick double clicks stop the previous animation
		ripple.removeClass("animate");
		parent.css({overflow: "hidden"});
		parent.css({position: "relative"});
		// parent.css({background: "#F8F8F8"});
		
		//set size of .ripple
		if(!ripple.height() && !ripple.width())
		{
			//use parent's width or height whichever is larger for the diameter to make a circle which can cover the entire element.
			d = Math.max(parent.outerWidth(), parent.outerHeight());
			ripple.css({height: d, width: d});
			//console.log(d);		
		}
		
		//get click coordinates
		//logic = click coordinates relative to page - parent's position relative to page - half of self height/width to make it controllable from the center;
		x = e.pageX - parent.offset().left - ripple.width()/2;
		y = e.pageY - parent.offset().top - ripple.height()/2;
		
		//set the position and add class .animate
		ripple.css({top: y+'px', left: x+'px'}).addClass("animate");
	}
});

/* stop ripple propagation for these elements */
$(".editCallIcon, .editCallInfo, .deleteVMIcon, .voicemailTranscript").click(function(event){
	event.stopPropagation();
});

$(window).resize(function() {
	$("body").find(".ripple").remove();
});

initChecks();

function initChecks() {
	console.log("initializing..");
	
	if($("#alertDisable").prop("checked")) {
		$("#serviceOutageAlert").addClass("hidden");
	}
	else {
		$("#serviceOutageAlert").removeClass("hidden");
	}
	
	$("#settingsToggle1").prop("checked", true);
	$("#settingsToggle2").prop("checked", false);
	$("#settingsToggle1, #settingsToggle2").prop("disabled", false);
	
	/* load call list based on selected filter */
	if($("#callFilter60").prop("checked")) {
		$(".listCalls30Days").removeClass("hidden");
		$(".listCalls60Days").removeClass("hidden");
	}
	else if($("#callFilter30").prop("checked")) {
		$(".listCalls30Days").removeClass("hidden");
		$(".listCalls60Days").addClass("hidden");
	}
	else if($("#callFilter7").prop("checked")) {
		$(".listCalls30Days").addClass("hidden");
		$(".listCalls60Days").addClass("hidden");
	}
}

$(".menuItem").click(function() {
	// console.log("");
	var isMenuOpen = false;
	
	if($(this).find(".rightArrow").hasClass("expandArrow"))
	{
		isMenuOpen = true;
	}
	
	$(".menuItem").find(".rightArrow").removeClass("expandArrow");
	$(".menuItem").find(".accordionOpen").css({"line-height": "25px"}).html("+");

	if(isMenuOpen == false)	{
		$(this).find(".rightArrow").addClass("expandArrow");
		$(this).find(".accordionOpen").css({"line-height": "21px"}).html("&ndash;");
		if($(this).hasClass("callHistoryMenu"))	{
			$("#callHistoryPage").delay(500).animate({height: "560px"}, 200, "linear");
		} else {
			$("#callHistoryPage").delay(500).animate({height: "0px"}, 200, "linear");
		}
		
		if($(this).hasClass("settingsMenu"))	{
			$("#settingsPage").delay(500).animate({height: "497px"}, 200, "linear");
		} else {
			$("#settingsPage").delay(500).animate({height: "0px"}, 200, "linear");
		}
		
		// console.log($(".textMessages").outerHeight());
		// var textMessagePageHeight = $(".textMessages").outerHeight();
		//adjust height by 5
		var textMessagePageHeight = $(".textMessages").outerHeight() + 5;
		if($(this).hasClass("textMessageMenu"))	{
			$("#textMessagePage").delay(500).animate({height: textMessagePageHeight}, 200, "linear");
		} else {
			$("#textMessagePage").delay(500).animate({height: "0px"}, 200, "linear");
		}
	}
	else {
		if($(this).hasClass("callHistoryMenu"))
		{
			$("#callHistoryPage").delay(500).animate({height: "0px"}, 200, "linear");
		} else if($(this).hasClass("settingsMenu"))
		{
			$("#settingsPage").delay(500).animate({height: "0px"}, 200, "linear");
		} else if($(this).hasClass("textMessageMenu"))
		{
			$("#textMessagePage").delay(500).animate({height: "0px"}, 200, "linear");
		}
	}

	$(".notificationSummary, .alternateNotificationSummary").animate({margin: "0px", height: "0px"},120);
	
	var menuItemSelected = $(this);
	setTimeout(function() {
		//console.log(menuItemSelected.offset().top);
		$("html").animate({
			scrollTop: menuItemSelected.offset().top
		}, 100);
	}, 1200);
	
	
	/* close opened voicemail and reset */
	console.log(vmDiv.css("height"));
	if(vmDiv.css("height") != "0px") {
		/* click the corresponding line */
		vmDiv.parent().click();
	}
});

$(".closeCallHistoryMenu").click(function() {
	$("#callHistoryPage").css({height: "0px"});
	$(".menuItem").find(".rightArrow").removeClass("expandArrow");
});

$(".tab").click(function() {
	/* disable open edit elements */
	$(".editCallInfo").css("height", "0px");
	if($(editVMList).text().trim() == "Done") {
		$("#editVMList").click();
	}
	if($("#editCallList").text().trim() == "Done") {
		$("#editCallList").click();
	}
	
	if(!$(this).hasClass("tabSelected")) {
		$(".tab").toggleClass("tabSelected");
	}
	
	var changeTab = $(this);
	setTimeout(function() {
		console.log("to");
		if(changeTab.hasClass("voicemailTab")) {
			$(".callHistory").addClass("hidden");
			$(".voicemailHistory").removeClass("hidden");
		} 
		else if(changeTab.hasClass("callHistroyTab")) {
			$(".callHistory").removeClass("hidden");
			$(".voicemailHistory").addClass("hidden");
		}
	}, 800);
});

$(".voiceMailLine").click(function() {
	/* Disable Edit */
	if($(editVMList).text().trim() == "Done") {
		$("#editVMList").click();
	}
	
	/* collapse all other voicemails */
	$(".voicemailTranscript").css({height: "0px"});
	console.log($(this).find(".vmTranscriptText").outerHeight());
	var totalHeight = $(this).find(".vmTranscriptText").outerHeight() + $(this).find(".vmControls").outerHeight() + $(this).find(".vmOptions").outerHeight();
	totalHeight -= 10; /* fixing the bottom space */
	
	/* this variable is intentionally kept global to enable close */
	vmDiv = $(this).find(".voicemailTranscript");
	if(vmDiv.css("height") == "0px") {
		$(".voiceMailLine").css({display: "none"});
		vmDiv.parent().css({display: "block"});
		vmDiv.css({height: totalHeight});
		$(".callHistoryOptionsTabs, .dayFilters").css({height: "0px", margin: "0px", padding: "0px"});
		$(".searchBox").css({height: "0px", margin: "0px"});
	} else {
		$(".voiceMailLine").css({display: "block"});
		vmDiv.css({height: "0px"});
		$(".callHistoryOptionsTabs, .dayFilters").css({height: "auto"});
		$(".dayFilters").css({padding: "10px 0"});
		$(".searchBox").css({height: "35px", margin: "20px 4%"});
	}
	
	/* console.log($(this).offset().top);
	var missedCallList = $(this).parent().parent();
	missedCallList.animate({
		scrollTop: $(this).offset().top
	}, 300); */
});

$(".vmPlayPause").click(function() {
	$(this).find("span").toggleClass("playButton").toggleClass("pauseButton");
});

$(".vmFlag").click(function() {
	var superParent = $(this).parent().parent();
	var totalHeight = superParent.find(".vmTranscriptText").outerHeight();
	// superParent.find(".vmFlagOverlay").css({top: totalHeight});
	
	/* Reset other overlays */
	superParent.find(".vmForwardOverlay").css({height: "0px", top: totalHeight});
	superParent.find(".vmDeleteOverlay").css({height: "0px", top: totalHeight});
	
	if(superParent.find(".vmFlagOverlay").css("height") == "0px") {
		superParent.find(".vmFlagOverlay").css({height: totalHeight, top: 0});
		removeVMOptionSelected();
		$(this).addClass("vmFlagSelected");
	} else {
		superParent.find(".vmFlagOverlay").css({height: "0px", top: totalHeight});
		$(this).removeClass("vmFlagSelected");
	}
});

$(".vmForward").click(function() {
	var superParent = $(this).parent().parent();
	var totalHeight = superParent.find(".vmTranscriptText").outerHeight() + superParent.find(".vmControls").outerHeight();
	// superParent.find(".vmForwardOverlay").css({top: totalHeight});
	
	/* Reset other overlays */
	superParent.find(".vmFlagOverlay").css({height: "0px", top: totalHeight});
	superParent.find(".vmDeleteOverlay").css({height: "0px", top: totalHeight});
	
	if(superParent.find(".vmForwardOverlay").css("height") == "0px") {
		superParent.find(".vmForwardOverlay").css({height: totalHeight, top: 0});
		removeVMOptionSelected();
		$(this).addClass("vmForwardSelected");
	} else {
		superParent.find(".vmForwardOverlay").css({height: "0px", top: totalHeight});
		$(this).removeClass("vmForwardSelected");
	}
});

$(".vmDelete").click(function() {
	var superParent = $(this).parent().parent();
	var totalHeight = superParent.find(".vmTranscriptText").outerHeight();
	
	/* Reset other overlays */
	superParent.find(".vmFlagOverlay").css({height: "0px", top: totalHeight});
	superParent.find(".vmForwardOverlay").css({height: "0px", top: totalHeight});
	
	// superParent.find(".vmDeleteOverlay").css({top: totalHeight});
	if(superParent.find(".vmDeleteOverlay").css("height") == "0px") {
		superParent.find(".vmDeleteOverlay").css({height: totalHeight, top: 0});
		removeVMOptionSelected();
		$(this).addClass("vmDeleteSelected");
	} else {
		superParent.find(".vmDeleteOverlay").css({height: "0px", top: totalHeight});
		$(this).removeClass("vmDeleteSelected");
	}
});
$(".deleteButton").click(function() {
	var vmLine = $(this).parent().parent().parent().parent();
	vmLine.click();
	
	setTimeout(function() {
		vmLine.find(".deleteVMIcon").click();
	}, 800);
});

function removeVMOptionSelected() {
	$(".vmDelete").removeClass("vmDeleteSelected");
	$(".vmForward").removeClass("vmForwardSelected");
	$(".vmFlag").removeClass("vmFlagSelected");
}

$(".deleteVMIcon").click(function(event) {
	var vmLine = $(this).parent();
	vmLine.css({overflow: "hidden"});
	//vmLine.css({opacity: "0"});
	vmLine.css({height: "0px", margin: "0px", padding: "0px", border: "0px"});
});

$(".settingsHelp").click(function () {
		if($(this).hasClass("forVoicemailHelp")) {
			if($("#voicemailSettings").css("height") == "0px") {
				$("#voicemailSettings").css({height: "280px"});
			}
			else {
				$("#voicemailSettings").css({height: "0px"});
			}
		}
});

$("#settingsToggle2").click(function() {
	var isVmOn = $("#settingsToggle1").prop("checked");
	$("#voicemailSettings").css({height: "0px"});
	console.log(isVmOn);
	if($("#settingsToggle2").prop("checked")) {
		/* check if voicemail is on */
		if($("#settingsToggle1").prop("checked")) {
			$("#settingsToggle1").prop("checked", false);
			if($("#callForwardingSettingsConflict").css("height") == "0px") {
				$("#callForwardingSettingsConflict").css({height: "190px"});
				$("#settingsToggle1, #settingsToggle2").prop("disabled", true);
			}
		}
		else {
			$("#callForwardTo").css({height: "180px"});
		}
	}
	else {
		$("#callForwardTo").css({height: "0px"});
	}
});
$("#settingsToggle1").click(function() {
	var isCfOn = $("#settingsToggle2").prop("checked");
	$("#voicemailSettings").css({height: "0px"});
	$("#callForwardTo").css({height: "0px"});
	console.log(isCfOn);
	if($("#settingsToggle1").prop("checked")) {
		/* check if call forwarding is on */
		if($("#settingsToggle2").prop("checked")) {
			$("#settingsToggle2").prop("checked", false);
			if($("#voicemailSettingsConflict").css("height") == "0px") {
				$("#voicemailSettingsConflict").css({height: "190px"});
				$("#settingsToggle1, #settingsToggle2").prop("disabled", true);
			}
		}
	}
});
$("#cfDoneButton").click(function() {
	$("#callForwardTo").css({height: "0px"});
});
$("#btnKeepVmOn").click(function() {
	$("#callForwardingSettingsConflict").css({height: "0px"});
	$("#voicemailSettingsConflict").css({height: "0px"});
	$("#settingsToggle2").prop("checked", false);
	$("#settingsToggle1").prop("checked", true);
	
	$("#settingsToggle1, #settingsToggle2").prop("disabled", false);
});
$("#btnDeacvtivateVm").click(function() {
	$("#callForwardingSettingsConflict").css({height: "0px"});
	$("#voicemailSettingsConflict").css({height: "0px"});
	$("#settingsToggle1").prop("checked", false);
	$("#settingsToggle2").prop("checked", true);
	$("#settingsToggle1, #settingsToggle2").prop("disabled", false);
	
	$("#callForwardTo").css({height: "180px"});
});
$("#btnKeepCfOn").click(function() {
	$("#callForwardingSettingsConflict").css({height: "0px"});
	$("#voicemailSettingsConflict").css({height: "0px"});
	$("#settingsToggle1").prop("checked", false);
	$("#settingsToggle2").prop("checked", true);
	$("#settingsToggle1, #settingsToggle2").prop("disabled", false);
	
	$("#callForwardTo").css({height: "180px"});
});
$("#btnDeacvtivateCf").click(function() {
	$("#callForwardingSettingsConflict").css({height: "0px"});
	$("#voicemailSettingsConflict").css({height: "0px"});
	$("#settingsToggle2").prop("checked", false);
	$("#settingsToggle1").prop("checked", true);
	
	$("#settingsToggle1, #settingsToggle2").prop("disabled", false);
});

$("#editVMList").click(function() {
	/* collapse all voicemail transcripts */
	$(".voicemailTranscript").css({height: "0px"});
	
	if($(this).text().trim() == "Edit") {
		$(this).text("Done");
		$(".voiceMailLine .vmDuration").css("width", "0px");
		$(".voiceMailLine .deleteVMIcon").css("margin", "0px 10px");
		$(".voiceMailLine .deleteVMIcon").css("width", "15px");
	}
	else {
		$(this).text("Edit");
		$(".voiceMailLine .vmDuration").css("width", "10%");
		$(".voiceMailLine .deleteVMIcon").css("width", "0px");
		$(".voiceMailLine .deleteVMIcon").css("margin", "0px");
	}
});

$("#editCallList").click(function() {
	/* disable open edit elements */
	$(".editCallInfo").css("height", "0px");
	
	if($(this).text().trim() == "Edit") {
		$(this).text("Done");
		$(".callHistoryLine .vmDuration").css("width", "0px");
		$(".callHistoryLine .editCallIcon").css("margin", "0px 10px");
		$(".callHistoryLine .editCallIcon").css("width", "10%");
	}
	else {
		$(this).text("Edit");
		$(".callHistoryLine .vmDuration").css("width", "10%");
		$(".callHistoryLine .editCallIcon").css("width", "0px");
		$(".callHistoryLine .editCallIcon").css("margin", "0px");
	}
});

$(".editCallIcon").click(function () {
	var editDiv = $(this).parent().find(".editCallInfo");
	if(editDiv.css("height") == "0px") {
		/* close other edits */
		$(".editCallInfo").css("height", "0px");
		console.log(editDiv.hasClass("isExistingContact"));
		if(editDiv.hasClass("isExistingContact")) {
			editDiv.css("height", "40px");
		}
		else {
			editDiv.css("height", "80px");
		}
	}
	else {
		editDiv.css("height", "0px");
	}
});

$("#filterMissedCalls").click(function() {
	/* disable open edit elements */
	$(".editCallInfo").css("height", "0px");
	
	$(".callHistoryLine").addClass("hidden");
	$(".isMissedCall").removeClass("hidden");
});

$("#filterAllCalls").click(function() {
	/* disable open edit elements */
	$(".editCallInfo").css("height", "0px");
	
	$(".callHistoryLine").removeClass("hidden");
});

$(".helpQuestion").click(function (e) {
	e.stopPropagation();
	var helpDiv = $(this).parent().parent().parent().find(".pinHelpInstr");
	// console.log(e.pageX);
	$(this).parent().parent().parent().find(".topArrowDiv").css("left", e.pageX - 15);
	helpDiv.toggleClass("hidden");
});
$("#voicemailSettings").click(function (e) {
	/* hide the popup */
	var helpDiv = $(this).find(".pinHelpInstr");
	helpDiv.addClass("hidden");
});

$(".closeIcon").click(function() {
	
	/* close transcript overlays */
	var superParent = $(this).parent().parent();
	
	if($(this).parent().hasClass("vmFlagOverlay")) {
		superParent.find(".vmFlag").click();
	} 
	else if($(this).parent().hasClass("vmForwardOverlay")) {
		superParent.find(".vmForward").click();
	}
	else if($(this).parent().hasClass("vmDeleteOverlay")) {
		superParent.find(".vmDelete").click();
	}
	else { /* else just hide the parent */
		$(this).parent().css({height: "0px", margin: "0px", padding: "0px", border: "0px", overflow: "hidden"});
	}
});
$(".cancelVMOverlay, .vmFlagOverlay .sendButton").click(function() {
	
	/* close transcript overlays */
	var superParent = $(this).parent().parent().parent();
	
	if($(this).parent().parent().hasClass("vmFlagOverlay")) {
		superParent.find(".vmFlag").click();
	} 
	else if($(this).parent().parent().hasClass("vmForwardOverlay")) {
		superParent.find(".vmForward").click();
	}
	else if($(this).parent().parent().hasClass("vmDeleteOverlay")) {
		superParent.find(".vmDelete").click();
	}
});

$("#callFilter60").click(function() {	
	if($("#callFilter60").prop("checked")) {
		$(".listCalls30Days").removeClass("hidden");
		$(".listCalls60Days").removeClass("hidden");
	}
});
$("#callFilter30").click(function() {	
	if($("#callFilter30").prop("checked")) {
		$(".listCalls30Days").removeClass("hidden");
		$(".listCalls60Days").addClass("hidden");
	}
});
$("#callFilter7").click(function() {	
	if($("#callFilter7").prop("checked")) {
		$(".listCalls30Days").addClass("hidden");
		$(".listCalls60Days").addClass("hidden");
	}
});
