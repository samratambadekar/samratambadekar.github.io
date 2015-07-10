$("body").on("click", ".button, .card", function(e){
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
	console.log(lat_lng);
	initialize();
  }
});



var lat_lng = [];
var map;
var infoWindow;
var service;

function initialize() {
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
    types: ['food', 'storage']
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

	service.getDetails(place, function(result, status) {
	  if (status != google.maps.places.PlacesServiceStatus.OK) {
		alert(status);
		return;
	  }
	  console.log(result.name);
	  //infoWindow.setContent(result);
	  $("article").append('<div class="card"><div class="place_name">' + result.name + '</div><div class="place_phone">' + result.formatted_phone_number + '</div><div class="place_address">' + result.formatted_address + '</div><div class="place_open">' + result.opening_hours.open_now + '</div></div>');
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

$("article").on("click", ".card", function(){
	$("#map_canvas").css({"opacity": 1, "z-index": 1});
	$("article").css("display", "none");
});
$("#changeView").on("click", function(){
	$("#map_canvas").css({"opacity": 0.1, "z-index": -1});
	$("article").css("display", "initial");
});

//google.maps.event.addDomListener(window, 'load', initialize);


