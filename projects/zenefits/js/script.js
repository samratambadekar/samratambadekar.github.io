$("body").on("click", ".button, .card, .icon,.blue_link", function(e){
	// if ($(window).width() <= 480) {
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
		// parent.css({overflow: "hidden"});
		// parent.css({position: "relative"});
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
	// }
});

$.ajax( { 
  url: "https://freegeoip.net/json?jsoncallback=?", 
  type: "GET", 
  success: function(location) {
    // example where I update content on the page.
	lat_lng[0] = location.latitude;
	lat_lng[1] = location.longitude;
	
    //console.log(location.city + "\n" + location.region_code + "\n" + location.region_name + "\n" + location.metro_code + "\n" + location.ip + "\n" + location.zip_code + "\n" + location.longitude + "\n" + location.latitude + "\n" + location.country_name + "\n" + location.country_code);
	//console.log(lat_lng);
	initialize();
  }
});

var lat_lng = [];
var map;
var infoWindow;
var service;
var markers = [];
var locationTypes = ['book_store', 'cafe', 'food'];
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var startLoc, endLoc;
selectedMode = "DRIVING"; /* DEFAULT MODE */
var timeout_counter = 0;
var searchBox, input, bounds;
var distances = [];

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  startLoc = new google.maps.LatLng(lat_lng[0], lat_lng[1]);
  map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: new google.maps.LatLng(lat_lng[0], lat_lng[1]),
    zoom: 13,
    styles: [
      {
        stylers: [
          { visibility: 'simplified' }
        ]
      },
      {
        elementType: 'labels',
        stylers: [
          { visibility: 'on' }
        ]
      }
    ]
  });
  
  
  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  google.maps.event.addListenerOnce(map, 'bounds_changed', performSearch);
  // google.maps.event.addListenerOnce(map, 'zoom_changed', performSearch);
  // google.maps.event.addListenerOnce(map, 'center_changed', performSearch);
  
  // google.maps.event.addListener(map, 'bounds_changed', function() {});
  
  // Create the search box and link it to the UI element.
  input = (document.getElementById("search_place"));
  searchBox = new google.maps.places.SearchBox((input));
  google.maps.event.addListener(searchBox, 'places_changed', searchPlaces);
}

function searchPlaces() {
    var places = searchBox.getPlaces();
	
	map.setCenter(new google.maps.LatLng(places[0].geometry.location.A, places[0].geometry.location.F));

    if (places.length == 0) {
      return;
    }
	
	clearMarkers();
	/* CLEAR EXISTING LIST */
	$(".place_list").empty();
	
    // bounds = new google.maps.LatLngBounds();
    bounds = map.getBounds();
	
	if (places.length == 1) {
		// console.log(places);
		map.setZoom(13);
		performSearch();
	} else {
		locationTypes = [];
		for (var i = 0, result; result = places[i]; i++) {
			var price_index = "";
			for(var j = 0; j < result.price_level; j++) {
				price_index += "$";
			}
			if(result.opening_hours && result.opening_hours.open_now) {
				$(".place_list#open_places").append('<div class="card multiple_locations"><div class="' + (result.opening_hours == undefined ? "gray_border":(result.opening_hours.open_now ? "green_border" : "red_border")) + '"></div><div class="card_info"><div class="hidden place_address">' + result.formatted_address + '</div><div class="place_name">' + result.name + '</div><div class="place_rating more_card_info hidden">Ratings: ' + (result.rating?result.rating:" - ") + '</div><div class="place_price_level more_card_info hidden">Price Level: ' + (result.price_level?price_index:" - ") + '</div><div class="place_open more_card_info hidden">' + (result.opening_hours.open_now ? "<span class='green_text'>open</span>" : "<span class='red_text'>closed</span>") + '</div><div class="blue_link show_on_map more_card_info hidden right">Navigate here</div><div class="similar_locations blue_link more_card_info hidden">Find similar locations</div><div class="location hidden">' + result.geometry.location + '</div><div class="location_type hidden">' + result.types[0] + '</div></div></div>');
			} else {
				$(".place_list#closed_places").append('<div class="card multiple_locations"><div class="' + (!result.opening_hours ? "gray_border":(result.opening_hours.open_now ? "green_border" : "red_border")) + '"></div><div class="card_info"><div class="hidden place_address">' + result.formatted_address + '</div><div class="place_name">' + result.name + '</div><div class="place_rating more_card_info hidden">Ratings: ' + (result.rating?result.rating:" - ") + '</div><div class="place_price_level more_card_info hidden">Price Level: ' + (result.price_level?price_index:" - ") + '</div><div class="place_open more_card_info hidden">' + (result.opening_hours.open_now ? "<span class='green_text'>open</span>" : "<span class='red_text'>closed</span>") + '</div><div class="blue_link show_on_map more_card_info hidden right">Navigate here</div><div class="similar_locations blue_link more_card_info hidden">Find similar locations</div><div class="location hidden">' + result.geometry.location + '</div><div class="location_type hidden">' + result.types[0] + '</div></div></div>');
			}
			
			$(this).parents(".card").css("height", $(this).find(".card_info").outerHeight() + 5);
			locationTypes.push(result.types[0]);
		}
		
		
		// lat_lng[0] = map.getCenter().A;
		// lat_lng[1] = map.getCenter().F;
		// startLoc = new google.maps.LatLng(lat_lng[0], lat_lng[1]);
		// map.setCenter(new google.maps.LatLng(lat_lng[0], lat_lng[1]));
		// zoom: 13,
		// console.log(map.getCenter().A);
		
		for (var i = 0, place; place = places[i]; i++) {
		  var image = {
			url: place.icon,
			size: new google.maps.Size(71, 71),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(17, 34),
			scaledSize: new google.maps.Size(25, 25)
		  };

		  // Create a marker for each place.
		  var marker = new google.maps.Marker({
			map: map,
			icon: image,
			title: place.name,
			position: place.geometry.location
		  });	  
		  markers.push(marker);

		  bounds.extend(place.geometry.location);
		}
		map.fitBounds(bounds);
	}
}

function performSearch() {
  /* if(!bounds) {
	  bounds = map.getBounds();
  } */
	bounds = map.getBounds();
	searchBox.setBounds(bounds);

  // console.log(new google.maps.LatLng(lat_lng[0], lat_lng[1]));
  var request = {
    location: new google.maps.LatLng(lat_lng[0], lat_lng[1]),
    bounds: bounds,
	radius: 1000,
    types: locationTypes
  };
  // service.radarSearch(request, callback);
  service.nearbySearch(request, callback);
}

function callback(results, status) {
  if (status != google.maps.places.PlacesServiceStatus.OK) {
    console.log(status);
    return;
  }
  distances = [];
  for (var i = 0, result; result = results[i]; i++) {
	getDistance(startLoc, new google.maps.LatLng(result.geometry.location.A, result.geometry.location.F));
    createMarker(result);
  }
  // hideMarkers();
}

function createMarker(place) {
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location,
		animation: google.maps.Animation.DROP/* ,
		icon: {
			// Star
			path: 'M 0,-24 6,-7 24,-7 10,4 15,21 0,11 -15,21 -10,4 -24,-7 -6,-7 z',
			fillColor: '#ffff00',
			fillOpacity: 1,
			scale: 1/3,
			strokeColor: '#bd8d2c',
			strokeWeight: 1
		} */
	});
	markers.push(marker);
	var price_index = "";

	service.getDetails(place, function(result, status) {
		if (status != google.maps.places.PlacesServiceStatus.OK) {
			console.log(status);
			return;
		}
		
		for(var j = 0; j < result.price_level; j++) {
			price_index += "$";
		}
		
		// console.log(result.opening_hours.open_now);
		//infoWindow.setContent(result);
		if(result.opening_hours && result.opening_hours.open_now) {
			$(".place_list#open_places").append('<div class="card"><div class="' + (result.opening_hours == undefined ? "gray_border":(result.opening_hours.open_now ? "green_border" : "red_border")) + '"></div><div class="card_info"><div class="place_name">' + result.name + '</div><div class="blue_link place_phone more_card_info hidden">' + (result.formatted_phone_number?result.formatted_phone_number:" - ") + '</div><div class="place_address hidden">' + result.formatted_address + '</div><div class="place_distance more_card_info hidden"></div><div class="place_open more_card_info hidden">' + (result.opening_hours.open_now ? "<span class='green_text'>open</span>" : "<span class='red_text'>closed</span>") + '</div><div class="blue_link show_on_map more_card_info hidden right">Navigate here</div><div class="similar_locations blue_link more_card_info hidden">Find similar locations</div><div class="location hidden">' + result.geometry.location + '</div><div class="location_type hidden">' + result.types[0] + '</div></div></div>');
		} else {
			$(".place_list#closed_places").append('<div class="card"><div class="' + (result.opening_hours == undefined ? "gray_border":(result.opening_hours.open_now ? "green_border" : "red_border")) + '"></div><div class="card_info"><div class="place_name">' + result.name + '</div><div class="blue_link place_phone more_card_info hidden">' + (result.formatted_phone_number?result.formatted_phone_number:" - ") + '</div><div class="place_address hidden">' + result.formatted_address + '</div><div class="place_distance more_card_info hidden"></div><div class="place_open more_card_info hidden">' + (result.opening_hours.open_now ? "<span class='green_text'>open</span>" : "<span class='red_text'>closed</span>") + '</div><div class="blue_link show_on_map more_card_info hidden right">Navigate here</div><div class="similar_locations blue_link more_card_info hidden">Find similar locations</div><div class="location hidden">' + result.geometry.location + '</div><div class="location_type hidden">' + result.types[0] + '</div></div></div>');
		}

		// $(".card").css("height", $(".card").find(".card_info").outerHeight() + 40);
	});

	google.maps.event.addListener(marker, 'click', function() {
		service.getDetails(place, function(result, status) {
			if (status != google.maps.places.PlacesServiceStatus.OK) {
				//alert(status);
				console.log(status);
				return;
			}
			// console.log(result);
			infoWindow.setContent('<div class="place_name">' + result.name + '</div><div class="blue_link place_phone">' + (result.formatted_phone_number?result.formatted_phone_number:" - ") + '</div><div class="place_rating">Ratings: ' + (result.rating?result.rating:" - ") + '</div><div class="place_price_level">Price Level: ' + (result.price_level?price_index:" - ") + '</div><br/><div class="blue_link show_on_map right">Navigate here</div><div class="similar_locations blue_link">Similar locations</div><div class="location hidden">' + result.geometry.location + '</div>');
			infoWindow.open(map, marker);
		});
	});
}

function calcRoute(start, end) {
  var request = {
    origin:start,
    destination:end,
    travelMode: google.maps.TravelMode[selectedMode]
  };
  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
	  directionsDisplay.setMap(map);
      directionsDisplay.setDirections(result);
    }
  });
  
  getDistance(startLoc, endLoc);
}

function getDistance(start, end) {
	var distanceService = new google.maps.DistanceMatrixService();
	distanceService.getDistanceMatrix({
		origins: [start],
		destinations: [end],
		travelMode: google.maps.TravelMode[selectedMode],
		unitSystem: google.maps.UnitSystem.IMPERIAL,
		durationInTraffic: true
	}, function (response, status) {
		if (status == google.maps.DistanceMatrixStatus.OK) {
			var origins = response.originAddresses;
			var destinations = response.destinationAddresses;

			for (var i = 0; i < origins.length; i++) {
				var results = response.rows[i].elements;
				for (var j = 0; j < results.length; j++) {
					var element = results[j];
					var distance = element.distance.text;
					var duration = element.duration.text;
					var from = origins[i];
					var to = destinations[j];
					
					distances.push(distance + " - " + duration + " " + selectedMode.toLowerCase());
					// console.log(distances[distances.length-1]);
					$(".arrival_info").html(distance + " - " + duration + " " + selectedMode.toLowerCase());
				}
			}
		}
	});
}


$(".place_list").on("click", ".card", function() {
	/* ADD DISTANCE ON FIRST CLICK AS THE ARRAY IS NOT UPDATED QUICKLY */
	if($(this).find(".place_distance").text().trim() == "") {
		$(this).find(".place_distance").text(distances[$(this).index()]);
	}
	
	if($(this).find(".more_card_info").hasClass("hidden")) {
		$(this).find(".more_card_info").removeClass("hidden");
		$(this).find(".place_name").css("white-space", "initial");
	} else {
		$(this).find(".more_card_info").addClass("hidden");
		$(this).find(".place_name").css("white-space", "nowrap");
	}
	// console.log();
	//console.log($(this).find(".card_info").outerHeight());
	$(this).css("height", $(this).find(".card_info").outerHeight() + 5);

	timeout_counter = 0;
});

$("body").on("click", ".show_on_map", function(e) {
	$("#map_canvas").css({"filter": "grayscale(0)", "-webkit-filter": "grayscale(0)", "z-index": 1});
	$(".nav_info").removeClass("hidden");
	highlightNavMode();
	$(".card").css("opacity", "0");
	$(".card").css({"opacity": 0, "height": "55px", "background-color": "#FFF"});
	$(this).parents(".card").css("opacity", "1");
	$(this).parents(".card").css({"background-color": "#F1F1F1"});
	var lat_lng_dst = $(this).parent().find(".location").text().trim().toString().substring(1, $(this).parent().find(".location").html().trim().length - 1).split(',');
	endLoc = new google.maps.LatLng(lat_lng_dst[0], lat_lng_dst[1]);
	//console.log(lat_lng_dst);

	window.setTimeout(function() {
		$(".place_list").css("display", "none");
		// $(".card").css("opacity", "0");
		$(".card").find(".more_card_info").addClass("hidden");
	}, 1500);
	
	hideMarkers();
	$("footer").removeClass("hidden");
	$("#map").css("height", $("#map").outerHeight() - $("footer").outerHeight());
	var marker = new google.maps.Marker({
		map: map,
		position: endLoc,
		animation: google.maps.Animation.DROP
	});
	markers.push(marker);
	// map.setCenter(endLoc);
	calcRoute(startLoc, endLoc);
});
function hideMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  directionsDisplay.setMap(null);
}
function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
  directionsDisplay.setMap(null);
}
function showMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
  directionsDisplay.setMap(null);
}

$("body").on("click", ".similar_locations", function(e) {
	locationTypes = [];
	locationTypes.push($(this).parent().find(".location_type").text().trim());
	
	/* CLEAR EXISTING LIST */
	$(".place_list").empty();
	performSearch();
});

$(".place_list").on("click", ".card", function(e) {
	$("#search_place").val($(this).find(".place_address").text().trim());
});

$("#changeView").on("click", function() {
	$(".nav_info").addClass("hidden");
	highlightNavMode();
	if($(".place_list").css("display") == "none") {
		$("#map").css("height", "90%");
		timeout_counter = 0;
		$("#map_canvas").css({"filter": "grayscale(1)", "-webkit-filter": "grayscale(1)", "z-index": -1});
		$(".place_list").css("display", "initial");
		$("footer").addClass("hidden");
		
		$(this).find("img").attr("src","images/map.svg");
		hideMarkers();
		
		
		$(".card").each(function() {
			var card = $(this);
			window.setTimeout(function() {
				card.css("opacity", 1);
			}, 140 * timeout_counter++);
		});
	} else {
		timeout_counter = 0;
		$(this).find("img").attr("src","images/list.svg");
		$(".card").each(function() {
			var card = $(this);
			window.setTimeout(function() {
				card.css("opacity", 0);
			}, 140 * timeout_counter++);
		});

		window.setTimeout(function() {
			$("#map_canvas").css({"filter": "grayscale(0)", "-webkit-filter": "grayscale(0)", "z-index": 1});
			$(".place_list").css("display", "none");
			/* REMOVE THE LAST MARKER */
			// markers.splice((markers.length), 1);
			showMarkers();
			$("footer").removeClass("hidden");
			$("#map").css("height", $("#map").outerHeight() - $("footer").outerHeight());
		}, 1500);
	}
});
//google.maps.event.addDomListener(window, 'load', initialize);


$(".nav_mode").on("click", function() {
	$(".nav_mode").css("background-color", "#DDD");
	if($(this).hasClass("icon_walking")) {
		selectedMode = "WALKING";
		// $(this).css("background-color", "#009688");
	} else if($(this).hasClass("icon_transit")) {
		// $(this).css("background-color", "#ff9800");
		selectedMode = "TRANSIT";
	} else if($(this).hasClass("icon_bicycle")) {
		selectedMode = "BICYCLING";
		// $(this).css("background-color", "#4CAf50");
	} else if($(this).hasClass("icon_driving")) {
		selectedMode = "DRIVING";
		// $(this).css("background-color", "#F44336");
	}
	
	highlightNavMode();
	calcRoute(startLoc, endLoc);
});

function highlightNavMode() {
	if(selectedMode == "WALKING") {
		$(".icon_walking").css("background-color", "#009688");
	} else if(selectedMode == "TRANSIT") {
		$(".icon_transit").css("background-color", "#ff9800");
	} else if(selectedMode == "BICYCLING") {
		$(".icon_bicycle").css("background-color", "#4CAf50");
	} else if(selectedMode == "DRIVING") {
		$(".icon_driving").css("background-color", "#F44336");
	}
}