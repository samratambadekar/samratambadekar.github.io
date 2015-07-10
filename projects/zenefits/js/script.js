$(".searchbox, .button").on("click", function(e) {
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
		parent.css({overflow: "hidden"});
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
  dataType: "json",
  success: function(location) {
    // example where I update content on the page.
	lat_lng[0] = location.latitude;
	lat_lng[1] = location.longitude;
	
    //console.log(location.city + "\n" + location.region_code + "\n" + location.region_name + "\n" + location.metro_code + "\n" + location.ip + "\n" + location.zip_code + "\n" + location.longitude + "\n" + location.latitude + "\n" + location.country_name + "\n" + location.country_code);
	console.log(lat_lng);
	initialize();
  }
});



var map;
var infowindow;
var lat_lng = [];

function initialize() {
  // var location = new google.maps.LatLng(-33.8665433, 151.1956316);
  var location = new google.maps.LatLng(lat_lng[0], lat_lng[1]);

  map = new google.maps.Map(document.getElementById("map-canvas"), {
    center: location,
    zoom: 15
  });

  var request = {
    location: location,
    radius: 500,
    types: ['store']
  };
  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

//google.maps.event.addDomListener(window, 'load', initialize);


