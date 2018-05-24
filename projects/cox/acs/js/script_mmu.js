$(".mega_menu_item").bind("click", function (event) {
	event.stopPropagation();
	// console.log($("." + $(this).attr("id")).outerHeight() +20);
	$(".nav_menu_mmu > div").addClass("hidden");
	$(".nav_menu_mmu").css("height", "0px");
	
	if($(this).hasClass("mmu_selected")) {
		$(this).removeClass("mmu_selected");
	} else {
		$(".mega_menu_item").removeClass("mmu_selected");
		$(this).addClass("mmu_selected");
		
		$(".nav_menu_mmu").css("height", $("." + $(this).attr("id")).outerHeight() + 50);
		$("." + $(this).attr("id")).removeClass("hidden");
	}
	
	$("#myAccount_mega_menu .profile_img_mmu").attr("src","images/profile.png");
	$("#myAccount_mega_menu .arrow_img_mmu").attr("src","images/arrow_down_white_mmu.png");
	$("#myAccount_mega_menu.mmu_selected .profile_img_mmu").attr("src","images/profile_blue.png");
	$("#myAccount_mega_menu.mmu_selected .arrow_img_mmu").attr("src","images/arrow_down_blue_mmu.png");
});
$("header").bind("click", function (event) {
	event.stopPropagation();
});

$("body").click(function() { /* CLOSE MENU, RESET STATES */
	$(".mega_menu_item").removeClass("mmu_selected");
	$(".nav_menu_mmu").css("height", "0px");
	
	$("#myAccount_mega_menu .profile_img_mmu").attr("src","images/profile.png");
	$("#myAccount_mega_menu .arrow_img_mmu").attr("src","images/arrow_down_white_mmu.png");
});