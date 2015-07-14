$("body").on("click", ".button, .card, .icon", function(e){
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
var locationTypes = ['book_store', 'cafe'];
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var startLoc, endLoc;
selectedMode = "DRIVING"; /* DEFAULT MODE */
var timeout_counter = 0;

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  startLoc = new google.maps.LatLng(lat_lng[0], lat_lng[1]);
  map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: new google.maps.LatLng(lat_lng[0], lat_lng[1]),
    zoom: 14,
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
}

function performSearch() {
  var request = {
    bounds: map.getBounds(),
    radius: 1000,
    types: locationTypes
  };
  service.radarSearch(request, callback);
}

function callback(results, status) {
  if (status != google.maps.places.PlacesServiceStatus.OK) {
    alert(status);
    return;
  }
  for (var i = 0, result; result = results[i]; i++) {
    createMarker(result);
  }
}

function createMarker(place) {
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location,
		animation: google.maps.Animation.DROP,
		icon: {
			// Star
			path: 'M 0,-24 6,-7 24,-7 10,4 15,21 0,11 -15,21 -10,4 -24,-7 -6,-7 z',
			fillColor: '#ffff00',
			fillOpacity: 1,
			scale: 1/4,
			strokeColor: '#bd8d2c',
			strokeWeight: 1
		}
	});
	markers.push(marker);

	service.getDetails(place, function(result, status) {
		if (status != google.maps.places.PlacesServiceStatus.OK) {
			// alert(status);
			console.log(status);
			return;
		}
		console.log(result.types);
		//infoWindow.setContent(result);
		
		$("article").append('<div class="card"><div class="card_info"><div class="place_name">' + result.name + '</div><div class="place_phone more_card_info hidden">' + result.formatted_phone_number + '</div><div class="place_address more_card_info hidden">' + result.formatted_address + '</div><div class="place_open more_card_info hidden">' + (result.opening_hours.open_now ? "<span class='green_text'>open</span>" : "<span class='red_text'>closed</span>") + '</div><div class="blue_link show_on_map more_card_info hidden right">Navigate here</div><div class="similar_locations blue_link more_card_info hidden">Find similar locations</div><div class="location hidden">' + result.geometry.location + '</div><div class="location_type hidden">' + result.types[0] + '</div></div></div>');

		// $(".card").css("height", $(".card").find(".card_info").outerHeight() + 40);
	});

	google.maps.event.addListener(marker, 'click', function() {
		/* service.getDetails(place, function(result, status) {
			if (status != google.maps.places.PlacesServiceStatus.OK) {
				alert(status);
				return;
			}
			console.log(result);
			infoWindow.setContent(result.name);
			infoWindow.open(map, marker);
		}); */
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
}

function getDistance() {
	var distanceService = new google.maps.DistanceMatrixService();
	distanceService.getDistanceMatrix({
		origins: [startLoc],
		destinations: [endLoc],
		travelMode: google.maps.TravelMode.selectedMode,
		durationInTraffic: true
	}, getETA);
}
function getETA(response, status) {
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
			}
		}
	}
}

$("article").on("click", ".card", function() {
	if($(this).find(".more_card_info").hasClass("hidden")) {
		$(this).find(".more_card_info").removeClass("hidden");
		$(this).find(".place_name").css("white-space", "initial");
	} else {
		$(this).find(".more_card_info").addClass("hidden");
		$(this).find(".place_name").css("white-space", "nowrap");
	}
	//console.log($(this).find(".card_info").outerHeight());
	$(this).css("height", $(this).find(".card_info").outerHeight() + 40);

	timeout_counter = 0;
});

$("article").on("click", ".show_on_map", function(e) {
	$("#map_canvas").css({"filter": "grayscale(0)", "-webkit-filter": "grayscale(0)", "z-index": 1});
	// $("article").css("display", "none");
	// $(".card").css("opacity", "0");
	$(".card").css({"opacity": 0, "height": "60px"});
	$(this).css("opacity", "1");
	var lat_lng_dst = $(this).parent().find(".location").text().trim().toString().substring(1, $(this).parent().find(".location").html().trim().length - 1).split(',');
	endLoc = new google.maps.LatLng(lat_lng_dst[0], lat_lng_dst[1]);
	//console.log(lat_lng_dst);
	
	window.setTimeout(function() {
		$("article").css("display", "none");
		$(".card").css("opacity", "0");
		$(".card").find(".more_card_info").addClass("hidden");

		clearMarkers();		
		var marker = new google.maps.Marker({
			map: map,
			position: endLoc,
			animation: google.maps.Animation.DROP
		});
		markers.push(marker);
		// map.setCenter(endLoc);
		calcRoute(startLoc, endLoc);
	}, 1000);
});
function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  directionsDisplay.setMap(null);
}
function showMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
  directionsDisplay.setMap(null);
}
$("article").on("click", ".similar_locations", function(e) {
	locationTypes = [];
	locationTypes.push($(this).parent().find(".location_type").text().trim());
	
	/* CLEAR EXISTING LIST */
	$("article").empty();
	performSearch();
});

$("#changeView").on("click", function(){
	$("#map_canvas").css({"filter": "grayscale(1)", "-webkit-filter": "grayscale(1)", "z-index": -1});
	$("article").css("display", "initial");
	
	/* REMOVE THE LAST MARKER */
	markers.splice((markers.length), 1);
	showMarkers();
	
	$(".card").each(function() {
		var card = $(this);
		window.setTimeout(function() {
			card.css("opacity", 1);
		}, 140 * timeout_counter++);
	});
});
//google.maps.event.addDomListener(window, 'load', initialize);


$(".icon").on("click", function() {
	if($(this).hasClass("icon_walking")) {
		selectedMode = "WALKING";
	} else if($(this).hasClass("icon_transit")) {
		selectedMode = "TRANSIT";
	} else if($(this).hasClass("icon_bicycle")) {
		selectedMode = "BICYCLING";
	} else if($(this).hasClass("icon_driving")) {
		selectedMode = "DRIVING";
	}
	calcRoute(startLoc, endLoc);
});