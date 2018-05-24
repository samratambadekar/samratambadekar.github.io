$(".notification, .alertNotification, .menuItem, .voiceMailLine, .callHistoryLine, .textMessage, .button, .userInfoShortcuts > div, .userInfoLine span").on("click", function(e) {
	if ($(window).width() <= 480) {
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
$(".editCallIcon, .editCallInfo, .deleteVMIcon, .voicemailTranscript, .selectItem, .addEditContact, .callNotifyCallHistory, .callRejectCallHistory, .voicemailTranscript").click(function(event){
	event.stopPropagation();
});

$(window).resize(function() {
	$("body").find(".ripple").parent().removeAttr("style");
	$("body").find(".ripple").remove();
	
	
	if ($(window).width() <= 480) {
		$(".callHistoryLine .vmDuration, .voiceMailLine .vmDuration").css("width", "10%");
	} else  {
		$(".callHistoryLine .vmDuration, .voiceMailLine .vmDuration").css("width", "25%");
	}
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
	
	$("#toggleVM").prop("checked", true);
	$("#toggleCallFrwd").prop("checked", false);
	$("#toggleVM, #toggleCallFrwd").prop("disabled", false);
	
	/* load call list based on selected filter */
	if($("#dayFilter60").prop("checked")) {
		$(".listCalls30Days").removeClass("hidden");
		$(".listCalls60Days").removeClass("hidden");
	}
	else if($("#dayFilter30").prop("checked")) {
		$(".listCalls30Days").removeClass("hidden");
		$(".listCalls60Days").addClass("hidden");
	}
	else if($("#dayFilter7").prop("checked")) {
		$(".listCalls30Days").addClass("hidden");
		$(".listCalls60Days").addClass("hidden");
	}
	
	$("#callBlockingCheck2").prop("checked", false);
	
	$("#radioUpdateVMPin").prop("checked", false);
	
	$(".callerName").each(function() {
		if($(this).closest(".callHistoryLine").length) {
			$(this).text($(this).closest(".callHistoryLine").find(".phNumber").text());
		} else {
			$(this).text($(this).closest(".voiceMailLine").find(".phNumber").text());
		}
	});

	$(".showVoiceMailIcon").each(function() {
		if($(this).closest(".callHistoryLine").length) {
			$(this).addClass("hidden");
		}
	});
}

/* REMOVE OVERLAYS */
$("body").click(function() {
	$(".helpOverlay").addClass("hidden");
});

$(".menuItem").click(function() {
	// console.log("");
	var isMenuOpen = false;
	var delayTime = 500;
	if ($(window).width() > 480) {
		delayTime = 10;
	}
	
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
			$("#callHistoryPage").delay(delayTime).animate({height: $("#callHistoryPage > div").outerHeight()}, 200, "linear");
		} else {
			$("#callHistoryPage").delay(delayTime).animate({height: "0px"}, 200, "linear");
		}
		
		if($(this).hasClass("settingsMenu"))	{
			$("#settingsPage").delay(delayTime).animate({height: "497px"}, 200, "linear");
		} else {
			$("#settingsPage").delay(delayTime).animate({height: "0px"}, 200, "linear");
		}
		
		// console.log($(".textMessages").outerHeight());
		// var textMessagePageHeight = $(".textMessages").outerHeight();
		//adjust height by 5
		var textMessagePageHeight = $(".textMessages").outerHeight() + 5;
		if($(this).hasClass("textMessageMenu"))	{
			$("#textMessagePage").delay(delayTime).animate({height: textMessagePageHeight}, 200, "linear");
		} else {
			$("#textMessagePage").delay(delayTime).animate({height: "0px"}, 200, "linear");
		}
	}
	else {
		if($(this).hasClass("callHistoryMenu"))
		{
			$("#callHistoryPage").delay(delayTime).animate({height: "0px"}, 200, "linear");
		} else if($(this).hasClass("settingsMenu"))
		{
			$("#settingsPage").delay(delayTime).animate({height: "0px"}, 200, "linear");
		} else if($(this).hasClass("textMessageMenu"))
		{
			$("#textMessagePage").delay(delayTime).animate({height: "0px"}, 200, "linear");
		}
	}

	$(".notificationSummary, .alternateNotificationSummary").animate({margin: "0px auto", height: "0px"},120);
	
	var menuItemSelected = $(this);
	setTimeout(function() {
		// console.log(menuItemSelected.offset().top);
		$("html, body").animate({
			scrollTop: menuItemSelected.offset().top
		}, 400);
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
/* 
$(".tab").click(function() {
	$(".editCallInfo").css("height", "0px");
	if($(editVMList).text().trim() == "Done") {
		$("#editVMList").click();
	}
	if($(".editCallList").text().trim() == "Done") {
		$(".editCallList").click();
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
}); */

$(".voiceMailLine .vmDuration").click(function() {
	/* Disable Edit */
	if($(".editCallList").text().trim() == "Done") {
		$(".editCallList").click();
	}
	
	var $thisVM = $(this).parents(".voiceMailLine");
	
	/* MARK AS OPENED */
	if($thisVM.find(".voicemailTranscript").css("height") == "0px") {
		$thisVM.removeClass("isNotOpened");
		$thisVM.find(".toggle").prop("checked", false);
	}
	
	/* collapse all other voicemails */
	$(".voicemailTranscript, .addEditContact").css({height: "0px"});
	// console.log($thisVM.find(".vmTranscriptText").outerHeight());
	var totalHeight = $thisVM.find(".vmTranscriptText").outerHeight() + $thisVM.find(".vmControls").outerHeight() + $thisVM.find(".vmOptions").outerHeight();
	totalHeight -= 10; /* fixing the bottom space */
	
	/* this variable is intentionally kept global to enable close */
	vmDiv = $thisVM.find(".voicemailTranscript");
	if(vmDiv.css("height") == "0px") {
		// $(".voiceMailLine").css({display: "none"});
		//vmDiv.parent().css({display: "block"});
		vmDiv.css({height: totalHeight});
		// $(".callHistoryOptionsTabs, .dayFilters").css({height: "0px", margin: "0px", padding: "0px"});
		// $(".searchBox").css({height: "0px", margin: "0px"});
	} else {
		// $(".voiceMailLine").css({display: "block"});
		vmDiv.css({height: "0px"});
		// $(".callHistoryOptionsTabs, .dayFilters").css({height: "auto"});
		// $(".dayFilters").css({padding: "10px 0"});
		// $(".searchBox").css({height: "35px", margin: "20px 4%"});
	}
	
	/* var selectedItem = $thisVM;
	setTimeout(function() {
			console.log(selectedItem.position().top);
		selectedItem.parent().parent().animate({
			scrollTop: selectedItem.parent().parent().scrollTop() + selectedItem.position().top
		}, 300);
	}, 500); */
});

$(".missedCallsList > .marginDiv2 > div").click(function() {
	/* $("html, body").animate({
		scrollTop: $(".missedCallsList").offset().top
	}, 600); */
	
	var selectedItem = $(this);
	setTimeout(function() {
		$(".missedCallsList").animate({
			scrollTop: $(".missedCallsList").scrollTop() + selectedItem.position().top - $(".missedCallsList").position().top
		}, 500);
	}, 400);
	
	$(".addEditContact, .callNotifyCallHistory, .callRejectCallHistory, .voicemailTranscript, .callHistoryIcons").css("height", 0);
	
	var iconsDiv = selectedItem.find(".callHistoryIcons");
	if(iconsDiv.css("height") <= "2px") {
		iconsDiv.css({height: iconsDiv.children("div").outerHeight() + 1});
	} else {
		iconsDiv.css({height: 0});
	}
	if(selectedItem.hasClass("isVoiceMail")) {
		console.log(selectedItem.find(".voicemailTranscript").outerHeight())
		if(selectedItem.find(".voicemailTranscript").outerHeight() == 0 && selectedItem.find(".callHistoryIcons").outerHeight() == 0) {
			selectedItem.find(".voicemailIcon").click();
			selectedItem.removeClass("isNotOpened");
		}
	}
});

$(".icon").click(function(e) {
	e.stopPropagation();
	$(".addEditContact, .callNotifyCallHistory, .callRejectCallHistory, .voicemailTranscript").css("height", 0);
	if($(this).hasClass("newContactIcon")) {
		$(this).closest(".callHistoryLine").find(".addEditContact").css("height", $(".addEditContact > div").outerHeight() + 40);
		$(this).closest(".voiceMailLine").find(".addEditContact").css("height", $(".addEditContact > div").outerHeight() + 40);
	}
	if($(this).hasClass("callNotifyIcon")) {
		$(this).closest(".callHistoryLine").find(".callNotifyCallHistory").css("height", $(".callNotifyCallHistory > div").outerHeight() + 20);
		$(this).closest(".voiceMailLine").find(".callNotifyCallHistory").css("height", $(".callNotifyCallHistory > div").outerHeight() + 20);
	}
	if($(this).hasClass("callRejectIcon")) {
		$(this).closest(".callHistoryLine").find(".callRejectCallHistory").css("height", $(".callRejectCallHistory > div").outerHeight() + 20);
		$(this).closest(".voiceMailLine").find(".callRejectCallHistory").css("height", $(".callRejectCallHistory > div").outerHeight() + 20);
	}
	if($(this).hasClass("voicemailIcon")) {
		$(this).closest(".callHistoryLine").find(".voicemailTranscript").css("height", $(".voicemailTranscript > div").outerHeight() + 20);
		$(this).closest(".voiceMailLine").find(".voicemailTranscript").css("height", $(".voicemailTranscript > div").outerHeight() + 20);
	}
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

$(".changeSettings").click(function () {
	if($("." + $(this).attr("id")).css("height") == "0px") {
		if($(this).parent().find(".toggle").prop("checked")) {
			$("." + $(this).attr("id")).css({height: $("." + $(this).attr("id") + " > div").outerHeight() + 50});
			
			var selectedItem = $(this).parent();
			//console.log($("#settingsPage").scrollTop() + selectedItem.position().top);
			$("#settingsPage").animate({
				scrollTop: $("#settingsPage").scrollTop() + selectedItem.position().top
			}, 500);
		}
	} else {
		$("." + $(this).attr("id")).css("height", 0);
	}
	
	// SPECIAL CASES
	$(".changeVoicemailPin").css("height", 0);
});

$(".settingsMenuItem .toggle").click(function () {
	$(this).parent().parent().find(".changeSettings").click();
});

$(".vmFlagOverlay .toggle").click(function () {
	if($(this).prop("checked")) {
		$(this).parents(".voiceMailLine").addClass("isNotOpened");
	} else {
		$(this).parents(".voiceMailLine").removeClass("isNotOpened");
	}
});

$(".chExport").click(function () {
	$(this).addClass("hidden");
});
$(".chDownload").click(function () {
	$(".chExport").toggleClass("hidden");
});

$(".btnAddToList").click(function () {
	var parentEl = $(this).parents(".addNumsListParent");
	
	if($(this).parents().hasClass("sequentialRingingSettings")) {
		if(parentEl.find(".addNumInput").val().trim() != "") {
			if($.isNumeric(parentEl.find(".addNumInput").val().trim())) {
				// parentEl.find(".addNumsList").prepend("");
				
				parentEl.find(".numsList").append("<div><button class='hidden'><img src='images/arrowUp_black.png'></button><button class='hidden'><img src='images/arrowDown_black.png'></button><button class='hidden'>" + (parentEl.find(".numsList > div:not(.hidden)").length + 1) + "</button><span class='removeName'>(unknown)</span><span>" + parentEl.find(".addNumInput").val().trim() + "</span><img class='removeNums hidden' src='images/delete_cross.png'><img class='hidden' src='images/address.png'></div>");
			} else {
				// parentEl.find(".addNumsList").prepend("<div><img src='images/arrowUp_black.png'><img src='images/arrowDown_black.png'><button>1</button></div>");
				
				parentEl.find(".numsList").append("<div><button class='hidden'><img src='images/arrowUp_black.png'></button><button class='hidden'><img src='images/arrowDown_black.png'></button><button class='hidden'>" + (parentEl.find(".numsList > div:not(.hidden)").length + 1) + "</button><span class='removeName'>" + parentEl.find(".addNumInput").val().trim() + "</span><span>202-555-0160</span><img class='removeNums hidden' src='images/delete_cross.png'><img class='hidden' src='images/address.png'></div>");
			}
			parentEl.find(".addNumsList").removeClass("hidden");
		}
	}
	else {
		if(parentEl.find(".addNumInput").val().trim() != "") {
			if($.isNumeric(parentEl.find(".addNumInput").val().trim())) {
				parentEl.find(".numsList").append("<div><span>(unknown)</span><span>" + parentEl.find(".addNumInput").val().trim() + "</span><img class='removeNums hidden' src='images/delete_cross.png'><img class='hidden' src='images/address.png'></div>");
			} else {
				parentEl.find(".numsList").append("<div><span>" + parentEl.find(".addNumInput").val().trim() + "</span><span>202-555-0160</span><img class='removeNums hidden' src='images/delete_cross.png'><img class='hidden' src='images/address.png'></div>");
			}
			parentEl.find(".addNumsList").removeClass("hidden");
		}
	}	
	$(this).parents(".marginDiv2").parent().css("height", $(this).parents(".marginDiv2").outerHeight() + 50);
});
$(".addNumsListParent .addButton").click(function () {
	var parentEl = $(this).closest(".addNumsListParent");
	// console.log($(this).parents(".marginDiv2").outerHeight() + 50);
	if($(this).parents().hasClass("sequentialRingingSettings")) {
		if(parentEl.find(".addNumInput").val().trim() != "") {
			if($.isNumeric(parentEl.find(".addNumInput").val().trim())) {
				// parentEl.find(".addNumsList").prepend("");
				
				parentEl.find(".numsList").append("<div><button class='hidden'><img src='images/arrowUp_black.png'></button><button class='hidden'><img src='images/arrowDown_black.png'></button><button class='hidden'>" + (parentEl.find(".numsList > div:not(.hidden)").length + 1) + "</button><span class='removeName'>(unknown)</span><span>" + parentEl.find(".addNumInput").val().trim() + "</span><img class='removeNums hidden' src='images/delete_cross.png'><img class='hidden' src='images/address.png'></div>");
			} else {
				// parentEl.find(".addNumsList").prepend("<div><img src='images/arrowUp_black.png'><img src='images/arrowDown_black.png'><button>1</button></div>");
				
				parentEl.find(".numsList").append("<div><button class='hidden'><img src='images/arrowUp_black.png'></button><button class='hidden'><img src='images/arrowDown_black.png'></button><button class='hidden'>" + (parentEl.find(".numsList > div:not(.hidden)").length + 1) + "</button><span class='removeName'>" + parentEl.find(".addNumInput").val().trim() + "</span><span>202-555-0160</span><img class='removeNums hidden' src='images/delete_cross.png'><img class='hidden' src='images/address.png'></div>");
			}
			parentEl.find(".addNumsList").removeClass("hidden");
		}
	}
	else {
		if(parentEl.find(".addNumInput").val().trim() != "") {
			if(parentEl.closest(".speedDialSettings").length){
				parentEl.find(".numsList").append("<div><span>" + parentEl.find(".addNameInput").val().trim() + "</span><span>" + parentEl.find(".speedDialInput").val().trim() + "</span><img class='removeNums hidden' src='images/delete_cross.png'></div>");
			} else if($.isNumeric(parentEl.find(".addNumInput").val().trim())) {
				parentEl.find(".numsList").append("<div><span>(unknown)</span><span>" + parentEl.find(".addNumInput").val().trim() + "</span><img class='removeNums hidden' src='images/delete_cross.png'><img class='hidden' src='images/address.png'></div>");
			} else {
				parentEl.find(".numsList").append("<div><span>" + parentEl.find(".addNumInput").val().trim() + "</span><span>202-555-0160</span><img class='removeNums hidden' src='images/delete_cross.png'><img class='hidden' src='images/address.png'></div>");
			}
			parentEl.find(".addNumsList").removeClass("hidden");
		}
	}
	$(this).closest(".marginDiv2").parent().css("height", $(this).closest(".marginDiv2").outerHeight() + 50);
});
$(".btnAddContact").click(function () {
	var parentEl = $(this).closest(".addNumsListParent");
	if(parentEl.find(".addNameInput").val().trim() != "" && parentEl.find(".addNumInput").val().trim() != "") {
		if(parentEl.closest(".speedDialSettings").length){
			parentEl.find(".numsList").append("<div><span>" + parentEl.find(".addNameInput").val().trim() + "</span><span>" + parentEl.find(".speedDialInput").val().trim() + "</span><img class='removeNums hidden' src='images/delete_cross.png'></div>");
		} else if($.isNumeric(parentEl.find(".addNumInput").val().trim())) {
			parentEl.find(".numsList").append("<div><span>" + parentEl.find(".addNameInput").val().trim() + "</span><span>" + parentEl.find(".addNumInput").val().trim() + "</span><img class='removeNums hidden' src='images/delete_cross.png'></div>");
		}
		parentEl.find(".addNumsList").removeClass("hidden");
	}
	
	$(this).closest(".marginDiv2").parent().css("height", $(this).closest(".marginDiv2").outerHeight() + 50);
});
$(".editNumsList").click(function() {
	if($(this).text().trim() == "Edit") {
		$(this).text("Done");
		$(this).parent().find(".removeNums").removeClass("hidden");
		$(this).parent().find(".removeName").addClass("hidden");
	} else {
		$(this).text("Edit");
		$(this).parent().find(".removeNums").addClass("hidden");
		$(this).parent().find(".removeName").removeClass("hidden");
	}

	$(".removeNums").unbind("click", function() {
		$(this).parent().addClass("hidden");
		if($(this).parent().parent().height() == 0) {
			$(this).parent().parent().parent().addClass("hidden");
			$(this).parent().parent().parent().find(".editNumsList").text("Edit");
		}
		var parentEl = $(this).parent().parent().parent().parent().parent().parent();
		parentEl.parent().css("height", parentEl.outerHeight() + 50);
	});
	$(".removeNums").bind("click", function() {
		$(this).parent().addClass("hidden");
		if($(this).parent().parent().height() == 0) {
			$(this).parent().parent().parent().addClass("hidden");
			$(this).parent().parent().parent().find(".editNumsList").text("Edit");
		}
		var parentEl = $(this).parent().parent().parent().parent().parent().parent();
		parentEl.parent().css("height", parentEl.outerHeight() + 50);
	});
	
});
$(".addNumsList .cancelButton").click(function() {
	var parentEl = $(this).closest(".marginDiv2");
	parentEl.parent().css("height", 0);
});
$(".changeVoicemailPin .button").click(function() {
	$(".changeVoicemailPin").css("height", 0);
});
$(".radioChangeSelection").click(function() {
	var parentEl = $(this).parents(".marginDiv2");
	if($(this).attr("id") == "callNotifyEmail") {
		parentEl.find(".radioSelectedOption").text("email address");
		parentEl.find(".searchAddUser img").addClass("hidden");
	}
	else if($(this).attr("id") == "callNotifyText") {
		parentEl.find(".radioSelectedOption").text("mobile number");
		parentEl.find(".searchAddUser img").removeClass("hidden");
	}
	if($(this).attr("id") == "vmNotifyEmail") {
		parentEl.find(".radioSelectedOption").text("email address");
		parentEl.find(".searchAddUser img").addClass("hidden");
	} 
	else if($(this).attr("id") == "vmNotifyText") {
		parentEl.find(".radioSelectedOption").text("mobile number");
		parentEl.find(".searchAddUser img").removeClass("hidden");
	}
	else if($(this).attr("id") == "callForwardAll") {
		parentEl.find(".addNumsListParent").addClass("hidden");
		parentEl.parent().css("height", parentEl.outerHeight() + 50);
	}
	else if($(this).attr("id") == "callForwardSelected") {
		parentEl.find(".addNumsListParent").removeClass("hidden");
		parentEl.parent().css("height", parentEl.outerHeight() + 50);
	}
	else if($(this).attr("id") == "radioUpdateVMPin") {		
		if ($(window).width() <= 480) {
			parentEl.parent().css("height", 0);
			$(".changeVoicemailPin.mobile").css("height", $(".changeVoicemailPin.mobile > div").outerHeight() + 50);
			// parentEl.parent().css("height", parentEl.outerHeight() + 50);
		} else {
			parentEl.parent().css("height", parentEl.outerHeight() + 50);
			$(".changeVoicemailPin.desktop").css("height", $(".changeVoicemailPin.desktop > div").outerHeight() + 20);
		}
	}
});
$("#callBlockingCheck2").click(function() {
	if($("#callBlockingCheck2").prop("checked") == false) {
		$(this).parent().parent().find(".addNumsListParent").addClass("hidden");
	} else {
		$(this).parent().parent().find(".addNumsListParent").removeClass("hidden");
	}
	$(this).parent().parent().parent().parent().css("height", $(this).parent().parent().parent().outerHeight() + 50);
});
$("#callBlockingSelect1").click(function() {
	if($("#callBlockingSelect1").val() == "all") {
		$(this).parent().parent().find(".timePeriodSelector").addClass("hidden");
	} else if($("#callBlockingSelect1").val() == "specific") {
		$(this).parent().parent().find(".timePeriodSelector").removeClass("hidden");
	}
	$(this).parent().parent().parent().parent().css("height", $(this).parent().parent().parent().outerHeight() + 50);
});

$("#toggleCallFrwd").click(function() {
	if($("#toggleVM").prop("checked")) {
		$(this).prop("checked", false);
		$("#toggleVM, #toggleCallFrwd").prop("disabled", true);
		$("#callForwardingSettingsConflict").css({height: $("#callForwardingSettingsConflict > div").outerHeight() + 50});
		$(".callForwardSettings").css({height: "0px"});
	}
});
$("#toggleVM").click(function() {
	if($("#toggleCallFrwd").prop("checked")) {
		$(this).prop("checked", false);
		$("#toggleVM, #toggleCallFrwd").prop("disabled", true);
		$("#voicemailSettingsConflict").css({height: $("#voicemailSettingsConflict > div").outerHeight() + 50});
		$(".voicemailSettings").css({height: "0px"});
	}
});
$("#toggleVMPin").click(function() {
	if($(this).prop("checked")) {
		$("." + $(this).attr("id")).removeClass("hidden");
	}
	else {
		$("." + $(this).attr("id")).addClass("hidden");
	}
	$(".voicemailSettings").css("height", $(".voicemailSettings > div").outerHeight() + 50);
});
$("#cfDoneButton").click(function() {
	// $("#callForwardTo").css({height: "0px"});
});
$("#btnKeepVmOn").click(function() {
	$("#callForwardingSettingsConflict").css({height: "0px"});
	$("#voicemailSettingsConflict").css({height: "0px"});
	$("#toggleCallFrwd").prop("checked", false);
	$("#toggleVM").prop("checked", true);
	
	$("#toggleVM, #toggleCallFrwd").prop("disabled", false);
});
$("#btnDeacvtivateVm").click(function() {
	$("#callForwardingSettingsConflict").css({height: "0px"});
	$("#voicemailSettingsConflict").css({height: "0px"});
	$("#toggleVM").prop("checked", false);
	$("#toggleCallFrwd").prop("checked", true);
	$("#toggleVM, #toggleCallFrwd").prop("disabled", false);
	
	$(".voicemailSettings").css({height: "0px"});
	$(".callForwardSettings").css({height: "0px"});
	$("#callForwardSettings").click();
	
	/* FIX NEEDED: TEMPORAROILY ADDING THIS SECTION TO AVOID OVER SCROLLING */
	var selectedItem = $("#callForwardSettings").parent();
	setTimeout(function() {
		$("#settingsPage").animate({
			scrollTop: $("#settingsPage").scrollTop() + selectedItem.position().top
		}, 500);
	}, 400);
});
$("#btnKeepCfOn").click(function() {
	$("#callForwardingSettingsConflict").css({height: "0px"});
	$("#voicemailSettingsConflict").css({height: "0px"});
	$("#toggleVM").prop("checked", false);
	$("#toggleCallFrwd").prop("checked", true);
	$("#toggleVM, #toggleCallFrwd").prop("disabled", false);
	
	// $("#callForwardTo").css({height: "180px"});
});
$("#btnDeacvtivateCf").click(function() {
	$("#callForwardingSettingsConflict").css({height: "0px"});
	$("#voicemailSettingsConflict").css({height: "0px"});
	$("#toggleCallFrwd").prop("checked", false);
	$("#toggleVM").prop("checked", true);	
	$("#toggleVM, #toggleCallFrwd").prop("disabled", false);
	
	$(".voicemailSettings").css({height: "0px"});
	$(".callForwardSettings").css({height: "0px"});
	$("#voicemailSettings").click();
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

$(".chEdit").click(function() {
	$(".editCallList").click();
	
	if($(".editCallList").text().trim() == "Edit") {
		$(this).find("div").text("Edit");
	}
	else {
		$(this).find("div").text("Done");
	}
});
$(".editCallList").click(function() {
	/* disable open edit elements */
	$(".editCallInfo").css("height", "0px");
	
	if($(this).text().trim() == "Edit") {
		$(this).text("Done");
		$(".callHistoryLine .vmDuration").css("width", "0px");
		$(".callHistoryLine .editCallIcon").css("margin-right", "10px");
		$(".callHistoryLine .editCallIcon").css("width", "15px");
		
		$(".voiceMailLine .vmDuration").css("width", "0px");
		$(".voiceMailLine .deleteVMIcon").css("margin-right", "10px");
		$(".voiceMailLine .deleteVMIcon").css("width", "15px");
		
		$(".addContact").removeClass("desktop");
	}
	else {
		$(this).text("Edit");
		$(".callHistoryLine .vmDuration").css("width", "25%");
		$(".callHistoryLine .editCallIcon").css("width", "0px");
		$(".callHistoryLine .editCallIcon").css("margin", "0px");
		
		$(".voiceMailLine .vmDuration").css("width", "25%");
		$(".voiceMailLine .deleteVMIcon").css("width", "0px");
		$(".voiceMailLine .deleteVMIcon").css("margin", "0px");
		
		$(".addContact").addClass("desktop");
		
		if ($(window).width() <= 480) {
			$(".callHistoryLine .vmDuration, .voiceMailLine .vmDuration").css("width", "10%");
		}
	}
});
$(".addContact").click(function (event) {
	event.stopPropagation();
	$(".addEditContact, .voicemailTranscript").css("height", 0);
	$(this).parent().find(".addEditContact").css("height", $(this).parent().find(".addEditContact .vmSettingButtons").outerHeight() + $(this).parent().find(".addEditContact .contactInfo").outerHeight() + 30);
	
	$("html, body").animate({
		scrollTop: $(".missedCallsList").offset().top
	}, 600);
	
	var selectedItem = $(this).parent();
	setTimeout(function() {
		console.log($(".missedCallsList").scrollTop() + selectedItem.position().top - $(".missedCallsList").position().top);
		$(".missedCallsList").animate({
			scrollTop: $(".missedCallsList").scrollTop() + selectedItem.position().top - $(".missedCallsList").position().top
		}, 500);
	}, 400);
});
$(".missedCallsList .closeMenus").click(function() {
	$(".callHistoryIcons, .addEditContact, .callNotifyCallHistory, .callRejectCallHistory, .voicemailTranscript").css("height", 0);
});
/* $(".editCallIcon").click(function () {
	var editDiv = $(this).parent().find(".editCallInfo");
	if(editDiv.css("height") == "0px") {
		
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
}); */

$("#filterMissedCalls").click(function() {
	/* disable open edit elements */
	$(".editCallInfo").css("height", "0px");
	
	$(".callHistoryLine").addClass("hidden");
	$(".voiceMailLine").addClass("hidden");
	
	$(".isMissedCall").removeClass("hidden");
	
	$(".vmDurHeader").removeClass("hideElement");
	// $(".vmDuration img").removeClass("hideElement");
});
$("#filterVoiceMails").click(function() {
	/* disable open edit elements */
	$(".editCallInfo").css("height", "0px");
	
	$(".callHistoryLine").addClass("hidden");
	$(".voiceMailLine").addClass("hidden");
	
	$(".isVoiceMail").removeClass("hidden");
	
	$(".vmDurHeader").addClass("hideElement");
	// $(".vmDuration img").addClass("hideElement");
});
$("#filterAllCalls").click(function() {
	/* disable open edit elements */
	$(".editCallInfo").css("height", "0px");
	
	$(".callHistoryLine").removeClass("hidden");
	$(".voiceMailLine").removeClass("hidden");
	
	$(".vmDurHeader").removeClass("hideElement");
	// $(".vmDuration img").removeClass("hideElement");
});

$(".helpQuestion").click(function (e) {
	e.stopPropagation();
	$(".helpOverlay").addClass("hidden");
	var helpDiv = $("." + $(this).attr("id"));
	// console.log($("#settingsPage").scrollTop() + $(this).position().top);

	if($(this).attr("id") == "pinHelpInstr") { /* SPECIAL CASE */
		helpDiv.find(".topArrowDiv").css({"left": e.pageX - helpDiv.offset().left - 15});
		helpDiv.css({"top": e.pageY - helpDiv.position().top - 30});
		console.log("pinINstr");
	} else if(helpDiv.parent().attr("id") == "settingsPage") {
		helpDiv.find(".topArrowDiv").css({"left": e.pageX - $("#settingsPage").offset().left - 15});
		console.log($(this).position().top);
		helpDiv.css({"top": $("#settingsPage").scrollTop() + $(this).position().top + 50});
	}
	helpDiv.removeClass("hidden");
});
$(".helpOverlay").click(function (e) {
	e.stopPropagation();
	$(".helpOverlay").addClass("hidden");	
});

$("#voicemailSettings").click(function(e) {
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
		$(this).parent().css({height: "0px", "margin-top": "0px", "margin-bottom": "0px", "padding-top": "0px", "padding-bottom": "0px", border: "0px", overflow: "hidden"});
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

$("#dayFilter60").click(function() {
	if($("#dayFilter60").prop("checked")) {
		$(".listCalls30Days").removeClass("hidden");
		$(".listCalls60Days").removeClass("hidden");
	}
});
$("#dayFilter30").click(function() {	
	if($("#dayFilter30").prop("checked")) {
		$(".listCalls30Days").removeClass("hidden");
		$(".listCalls60Days").addClass("hidden");
	}
});
$("#dayFilter7").click(function() {	
	if($("#dayFilter7").prop("checked")) {
		$(".listCalls30Days").addClass("hidden");
		$(".listCalls60Days").addClass("hidden");
	}
});
