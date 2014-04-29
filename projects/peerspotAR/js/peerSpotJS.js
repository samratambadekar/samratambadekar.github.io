
	var walkFlag = false;
	var bikeFlag = false;
	var trolleyFlag = false;
	var redBusFlag = false;
	var blueBusFlag = false;
	var greenBusFlag = false;
	//var buses;

	var directionDisplay;
	var map;

	/* Global variables created for accessibility */
	var bikesGeoObjects = new Array();
	var bikeImgDrawable = new Array();

	var trolleyGeoObjects = new Array();
	var trolleyImgDrawable = new Array();

	var redBusImgDrawable = new Array();
	var redBusGeoObjects = new Array();

	var blueBusImgDrawable = new Array();
	var blueBusGeoObjects = new Array();

	var greenBusImgDrawable = new Array();
	var greenBusGeoObjects = new Array();

	var customDestination = "";
	/* End: Global variables created for accessibility */



	function showTrolleys(j)
	{
		if(j == 1)
		{
			trolleyFlag = true;
			/* in case one wants to access hotels' information later on somewhere else in the code, set on very first location update */
			function locationChangedTrolley(lat, lon, alt, acc)
			{

				/* (*) set location-update function to null to avoid calling it twice */
				AR.context.onLocationChanged = null;

				var buses = jsonGetBusLocations();

				//alert(buses.length);
				for(i=0,k=0; i < buses.length; i++)
				{
					//alert(buses[i].color);
					if(buses[i].color == "yellow")
					{
						//var myLoc = new AR.Location();
						var percentOccupancy = Math.floor(Math.random()*100);
						trolleyImgDrawable[k] = new AR.HtmlDrawable({html:"<style>*{margin:0;padding:0;border:0;list-style:none;outline:none;border:0;}#box_body{background:rgba(0,0,0,0.7);height:120px;width:170px;}h4{padding:8px;font:14px Arial, Helvetica, sans-serif;font-weight:400;width:154px;color:#FFF;background:#ffa200;}h1{padding:5px;font:40px Arial, Helvetica, sans-serif;font-weight:bold;color:#FFF;float:left;}#occupancy{width:150px;height:20px;border-radius:20px;background:rgba(255,255,255,0.7);margin-left:10px;float:left;}h3{padding:3px 10px;color:#FFF;font:14px Arial, Helvetica, sans-serif;font-weight:bold;}.arrow-down {margin-left:10px;width: 0;height: 0; border-left: 0px solid transparent;border-right: 30px solid transparent;border-top: 30px solid;border-top-color:rgba(0,0,0,0.7);}a{float:right;text-decoration:none;color:#fff;}h2{padding-top:22px;padding-left:5px;color:#FFF;font:20px Arial, Helvetica, sans-serif;font-weight:400;float:left;}.percent{width:" + percentOccupancy + "%;height:20px;border-radius:20px;background:#090;float:left;}</style>" +
						"<body><div id='box_body'><h4>Trolley<a href='#'>Pin it</a></h4><h1>" + Math.floor(Math.random()*12) + "</h1><h2>mins</h2><div id='occupancy'><div class='percent'><h3>" + percentOccupancy + "%</h3></div></div></div><div class='arrow-down'></div></body>"},
						 5, {viewportWidth: 1024, scale:5,
						  horizontalAnchor : AR.CONST.HORIZONTAL_ANCHOR.LEFT,
						  opacity : 0.9
							});
						var busLocation = new AR.GeoLocation(buses[i].lat, buses[i].lng);
						trolleyGeoObjects[k] = new AR.GeoObject(busLocation, {drawables: {cam: trolleyImgDrawable[k]}} );

						k++;
						//alert(busLocation.distanceToUser() + " meters");
					}
				}
					//alert(k);
				//var closestStopLocation = closestStop('trolley');
				//alert("Closest Trolley Stop is " + closestStopLocation[1] + " at " + parseFloat(closestStopLocation[0]) + " meters");

			}

			/* animates hotels drawable (stored in pos. 2 of info-array) */
			function animate(hotelNr) {
				var tiltAnimation = new AR.PropertyAnimation(hotels[hotelNr][2], 'tilt', 0, 360, 1000, {type:AR.CONST.EASING_CURVE_TYPE.EASE_IN_OUT_QUAD});
				tiltAnimation.start();
			}

			/* force ARchitect framework to call function below on location update (*) */
			AR.context.onLocationChanged = locationChangedTrolley;

		}

		if(j == 0)
		{
			trolleyFlag = false;
			//alert(trolleyGeoObjects.length);
			//destroyAllObjects();
			for(var i=0;i<trolleyGeoObjects.length;i++)
			{
				trolleyImgDrawable[i].destroy();
				trolleyGeoObjects[i].destroy();
			}

		}

	}

	function showRedBus(j)
	{
		if(j == 1)
		{
			redBusFlag = true;
			function locationChangedTrolley(lat, lon, alt, acc)
			{
				/* (*) set location-update function to null to avoid calling it twice */
				AR.context.onLocationChanged = null;

				var buses = jsonGetBusLocations();

				//alert(buses.length);
				for(i=0,k=0; i < buses.length; i++)
				{
					//alert(buses[i].color);
					if(buses[i].color == "red")
					{
						var percentOccupancy = Math.floor(Math.random()*100);
						redBusImgDrawable[k] = new AR.HtmlDrawable({html:"<style>*{margin:0;padding:0;border:0;list-style:none;outline:none;border:0;}#box_body{background:rgba(0,0,0,0.7);height:120px;width:170px;}h4{padding:8px;font:14px Arial, Helvetica, sans-serif;font-weight:400;width:154px;color:#FFF;background:#F30;}h1{padding:5px;font:40px Arial, Helvetica, sans-serif;font-weight:bold;color:#FFF;float:left;}#occupancy{width:150px;height:20px;border-radius:20px;background:rgba(255,255,255,0.7);margin-left:10px;float:left;}h3{padding:3px 10px;color:#FFF;font:14px Arial, Helvetica, sans-serif;font-weight:bold;}.arrow-down {margin-left:10px;width: 0;height: 0; border-left: 0px solid transparent;border-right: 30px solid transparent;border-top: 30px solid;border-top-color:rgba(0,0,0,0.7);}a{float:right;text-decoration:none;color:#fff;}h2{padding-top:22px;padding-left:5px;color:#FFF;font:20px Arial, Helvetica, sans-serif;font-weight:400;float:left;}.percent{width:" + percentOccupancy + "%;height:20px;border-radius:20px;background:#090;float:left;}</style>" +
						"<body><div id='box_body'><h4>Red Bus<a href='#'>Pin it</a></h4><h1>" + Math.floor(Math.random()*13) + "</h1><h2>mins</h2><div id='occupancy'><div class='percent'><h3>" + percentOccupancy + "%</h3></div></div></div><div class='arrow-down'></div></body>"},
						 5, {viewportWidth: 1024, scale:5,
						  horizontalAnchor : AR.CONST.HORIZONTAL_ANCHOR.LEFT,
						  opacity : 0.9
						});
						var busLocation = new AR.GeoLocation(buses[i].lat, buses[i].lng);
						redBusGeoObjects[k] = new AR.GeoObject(busLocation, {drawables: {cam: redBusImgDrawable[k]}} );
						//alert(busLocation.distanceToUser() + " meters");

						k++;
					}
				}
				//var closestStopLocation = closestStop("red");
				//alert("Closest Red Route Stop is " + closestStopLocation[1] + " at " + parseFloat(closestStopLocation[0]) + " meters");
			}

			/* animates hotels drawable (stored in pos. 2 of info-array) */
			function animate(hotelNr) {
				var tiltAnimation = new AR.PropertyAnimation(hotels[hotelNr][2], 'tilt', 0, 360, 1000, {type:AR.CONST.EASING_CURVE_TYPE.EASE_IN_OUT_QUAD});
				tiltAnimation.start();
			}

			/* force ARchitect framework to call function below on location update (*) */
			AR.context.onLocationChanged = locationChangedTrolley;

		}

		if(j == 0)
		{
			redBusFlag = false;
			//destroyAllObjects();
			for(var i=0;i<redBusGeoObjects.length;i++)
			{
				redBusImgDrawable[i].destroy();
				redBusGeoObjects[i].destroy();
			}
		}
	}


	function showBlueBus(j)
	{
		if(j == 1)
		{
			blueBusFlag = true;
			function locationChangedTrolley(lat, lon, alt, acc)
			{
				/* (*) set location-update function to null to avoid calling it twice */
				AR.context.onLocationChanged = null;

				var buses = jsonGetBusLocations();

				//alert(buses.length);
				for(i=0,k=0; i < buses.length; i++)
				{
					//alert(buses[i].color);
					if(buses[i].color == "blue")
					{
						var percentOccupancy = Math.floor(Math.random()*100);
						blueBusImgDrawable[k] = new AR.HtmlDrawable({html:"<style>*{margin:0;padding:0;border:0;list-style:none;outline:none;border:0;}#box_body{background:rgba(0,0,0,0.7);height:120px;width:170px;}h4{padding:8px;font:14px Arial, Helvetica, sans-serif;font-weight:400;width:154px;color:#FFF;background:#007b9f;}h1{padding:5px;font:40px Arial, Helvetica, sans-serif;font-weight:bold;color:#FFF;float:left;}#occupancy{width:150px;height:20px;border-radius:20px;background:rgba(255,255,255,0.7);margin-left:10px;float:left;}h3{padding:3px 10px;color:#FFF;font:14px Arial, Helvetica, sans-serif;font-weight:bold;}.arrow-down {margin-left:10px;width: 0;height: 0; border-left: 0px solid transparent;border-right: 30px solid transparent;border-top: 30px solid;border-top-color:rgba(0,0,0,0.7);}a{float:right;text-decoration:none;color:#fff;}h2{padding-top:22px;padding-left:5px;color:#FFF;font:20px Arial, Helvetica, sans-serif;font-weight:400;float:left;}.percent{width:" + percentOccupancy + "%;height:20px;border-radius:20px;background:#090;float:left;}</style>" +
						"<body><div id='box_body'><h4>Blue Bus<a href='#'>Pin it</a></h4><h1>" + Math.floor(Math.random()*15) + "</h1><h2>mins</h2><div id='occupancy'><div class='percent'><h3>" + percentOccupancy + "%</h3></div></div></div><div class='arrow-down'></div></body>"},
						 5, {viewportWidth: 1024, scale:5,
						  horizontalAnchor : AR.CONST.HORIZONTAL_ANCHOR.LEFT,
						  opacity : 0.9
						});

						var busLocation = new AR.GeoLocation(buses[i].lat, buses[i].lng);
						blueBusGeoObjects[k] = new AR.GeoObject(busLocation, {drawables: {cam: blueBusImgDrawable[k]}} );
						//alert(busLocation.distanceToUser() + " meters");

						k++;
					}
				}
			}

			/* animates hotels drawable (stored in pos. 2 of info-array) */
			function animate(hotelNr) {
				var tiltAnimation = new AR.PropertyAnimation(hotels[hotelNr][2], 'tilt', 0, 360, 1000, {type:AR.CONST.EASING_CURVE_TYPE.EASE_IN_OUT_QUAD});
				tiltAnimation.start();
			}

			/* force ARchitect framework to call function below on location update (*) */
			AR.context.onLocationChanged = locationChangedTrolley;

		}

		if(j == 0)
		{
			blueBusFlag = false;
			//destroyAllObjects();
			for(var i=0;i<blueBusGeoObjects.length;i++)
			{
				blueBusImgDrawable[i].destroy();
				blueBusGeoObjects[i].destroy();
			}
		}
	}


	function showGreenBus(j)
	{
		if(j == 1)
		{
			greenBusFlag = true;
			function locationChangedTrolley(lat, lon, alt, acc)
			{
				/* (*) set location-update function to null to avoid calling it twice */
				AR.context.onLocationChanged = null;

				var buses = jsonGetBusLocations();

				//alert(buses.length);
				for(i=0,k=0; i < buses.length; i++)
				{
					//alert(buses[i].color);
					if(buses[i].color == "green")
					{
						var percentOccupancy = Math.floor(Math.random()*100);
						greenBusImgDrawable[k] = new AR.HtmlDrawable({html:"<style>*{margin:0;padding:0;border:0;list-style:none;outline:none;border:0;}#box_body{background:rgba(0,0,0,0.7);height:120px;width:170px;}h4{padding:8px;font:14px Arial, Helvetica, sans-serif;font-weight:400;width:154px;color:#FFF;background:#00b308;}h1{padding:5px;font:40px Arial, Helvetica, sans-serif;font-weight:bold;color:#FFF;float:left;}#occupancy{width:150px;height:20px;border-radius:20px;background:rgba(255,255,255,0.7);margin-left:10px;float:left;}h3{padding:3px 10px;color:#FFF;font:14px Arial, Helvetica, sans-serif;font-weight:bold;}.arrow-down {margin-left:10px;width: 0;height: 0; border-left: 0px solid transparent;border-right: 30px solid transparent;border-top: 30px solid;border-top-color:rgba(0,0,0,0.7);}a{float:right;text-decoration:none;color:#fff;}h2{padding-top:22px;padding-left:5px;color:#FFF;font:20px Arial, Helvetica, sans-serif;font-weight:400;float:left;}.percent{width:" + percentOccupancy + "%;height:20px;border-radius:20px;background:#090;float:left;}</style>" +
							"<body><div id='box_body'><h4>Green Bus<a href='#'>Pin it</a></h4><h1>" + Math.floor(Math.random()*20) + "</h1><h2>mins</h2><div id='occupancy'><div class='percent'><h3>" + percentOccupancy + "%</h3></div></div></div><div class='arrow-down'></div></body>"},
							 5, {viewportWidth: 1024, scale:5,
							  horizontalAnchor : AR.CONST.HORIZONTAL_ANCHOR.LEFT,
							  opacity : 0.9
							});

						var busLocation = new AR.GeoLocation(buses[i].lat, buses[i].lng);
						greenBusGeoObjects[k] = new AR.GeoObject(busLocation, {drawables: {cam: greenBusImgDrawable[k]}} );
						//alert(busLocation.distanceToUser() + " meters");

						k++;
					}
				}
				//var closestStopLocation = closestStop("green");
				//alert("Closest Green Route Stop is " + closestStopLocation[1] + " at " + parseFloat(closestStopLocation[0]) + " meters");
			}

			/* animates hotels drawable (stored in pos. 2 of info-array) */
			function animate(hotelNr) {
				var tiltAnimation = new AR.PropertyAnimation(hotels[hotelNr][2], 'tilt', 0, 360, 1000, {type:AR.CONST.EASING_CURVE_TYPE.EASE_IN_OUT_QUAD});
				tiltAnimation.start();
			}

			/* force ARchitect framework to call function below on location update (*) */
			AR.context.onLocationChanged = locationChangedTrolley;

		}

		if(j == 0)
		{
			greenBusFlag = false;
			//destroyAllObjects();
			for(var i=0;i<greenBusGeoObjects.length;i++)
			{
				greenBusImgDrawable[i].destroy();
				greenBusGeoObjects[i].destroy();
			}
		}
	}


	function showBike(j)
	{


		var bikes = jsonGetBikeInfo();


		var bikeStopLocation = closestBikeStop();


		if(j == 1)
		{
			bikeFlag = true;

			function locationChangedBike(lat, lon, alt, acc)
			{
				/* (*) set location-update function to null to avoid calling it twice */
				AR.context.onLocationChanged = null;

				//alert('1');


				//alert(bikes.zones.length);
				for(var i=0; i < bikes.zones.length; i++)
				{
					//alert(bikes.zones[i].location.latitude);
					var bikeLocation = new AR.GeoLocation(bikes.zones[i].location.latitude, bikes.zones[i].location.longitude);
					//alert('3');

					bikeImgDrawable[i] = new AR.HtmlDrawable({html:"<style>*{margin:0;padding:0;border:0;list-style:none;outline:none;border:0;}#box_body{background:rgba(255,255,255,0.7);height:120px;width:250px;border-radius:15px;overflow:hidden;border:3px solid #090;}h4{padding:8px;font:14px Arial, Helvetica, sans-serif;font-weight:700;width:234px;color:#000;background:#cde126;border-top-left-radius:15px;border-top-right-radius:15px;}h1{font:40px Arial, Helvetica, sans-serif;font-weight:bold;color:#000;float:left;}h3{color:#000;font:24px Arial, Helvetica, sans-serif;font-weight:bold;float:left;}.arrow-down {margin-left:40px;width: 0;height: 0;border-left: 0px solid transparent;border-right: 30px solid transparent;border-top: 30px solid;border-top-color:#090;}a{float:right;text-decoration:none;color:#fff;background:#090;	padding:5px;margin-top:-6px;border-radius:8px;}h2{padding-top:18px;	padding-left:5px;color:#000;font:20px Arial, Helvetica, sans-serif;	font-weight:400;float:left;}</style><body><div id='box_body'><h4>"+ bikeStopLocation[i][0] + "<a href='#'>Unlock</a></h4><img src='http://www.gatech.edu/inc/hgImage.php?nid=68412&f=medium' style='height:70px; float:left; margin:6px; border-radius:15px;' /><h1>"+ parseInt(bikeStopLocation[i][2]) + "</h1><h2>m</h2><h3>" + bikeStopLocation[i][1] + " available</h3></div><div class='arrow-down'></div></body>"}, 5, {viewportWidth: 1024, scale:5,
					horizontalAnchor : AR.CONST.HORIZONTAL_ANCHOR.LEFT,
					opacity : 0.9
					});

					//alert('1');
					bikesGeoObjects[i] = new AR.GeoObject(bikeLocation, {drawables: {cam: bikeImgDrawable[i]}});
					//alert(bikesGeoObjects.length);

				}


			}
			//name count dist isnot

			/* force ARchitect framework to call function below on location update (*) */
			AR.context.onLocationChanged = locationChangedBike;

		}

		if(j == 0)
		{
			bikeFlag = false;
			//destroyAllObjects();
			//alert(bikesGeoObjects.length);
			for(var i=0;i<bikesGeoObjects.length;i++)
			{
				bikeImgDrawable[i].destroy();
				bikesGeoObjects[i].destroy();
			}
		}

	}


	function showCustomLocation(location)
	{
		// Create a new image, which will be loaded right away
		//imageCustomLocation = new AR.ImageResource("./img/customLocation.png");

		//var locationName =

		// Called if the location changes
		function locationCustomLocation(lat, lon, alt, acc)
		{
			// We are only interested in the first location, lets set the onLocationChanged trigger to null which
			// will deactivate it.
			AR.context.onLocationChanged = null;

			myCustomGeoLocation = new AR.GeoLocation(location.lat(), location.lng());

			//imageCustomLocationDrawable = new AR.ImageDrawable(imageCustomLocation, 3, {enabled: true});

			imageCustomLocationDrawable = new AR.HtmlDrawable({html:"<body><style>*{margin:0;padding:0;border:0;list-style:none;outline:none;border:0;}#bigbox{width:200px;text-align:center;}#tooltip{margin:auto;height:40px;width:40px;border-radius:40px;border:20px solid #F00;}h1{font:25px Arial, Helvetica, sans-serif;font-weight:bold;color:#FFF;padding:5px;background:rgba(0,0,0,0.6);margin-bottom:10px;width: 190px;max-height:60px;white-space: wrap;overflow: hidden;text-overflow: ellipsis;}.arrow-down {margin-left:70px;margin-top:-13px;width: 0;height: 0;border-left: 30px solid transparent;border-right: 30px solid transparent;border-top: 30px solid;border-top-color:#F00;}</style><div id='bigbox'><h1>" + customDestination + "</h1><div id='tooltip'></div><div class='arrow-down'></div></div></body>"}, 5, {viewportWidth: 1024, scale:5,
			horizontalAnchor : AR.CONST.HORIZONTAL_ANCHOR.LEFT,
			opacity : 0.9
			});

			// create the GeoObject at the GeoLocation myLocation.
			var customGeoObject = new AR.GeoObject(myCustomGeoLocation, {drawables: {cam: imageCustomLocationDrawable}});

		}

		/* force ARchitect framework to call function below on location update (*) */
		AR.context.onLocationChanged = locationCustomLocation;
	}



  	function initialize()
  	{
		directionsDisplay = new google.maps.DirectionsRenderer();

		document.getElementById('map_canvas').style.display = 'block';
		//var map;
		var myLatlng = new google.maps.LatLng(33.775919, -84.397276);
		//var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		var mapOptions =
		{
		  zoom: 16,
		  center: myLatlng,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

		google.maps.event.addListener(map, 'click', function(event)
		{
		  placeMarker(event.latLng, map);
		});

		directionsDisplay.setMap(map);
 	}
/*
 	function 2DView()
	{
		directionsDisplay = new google.maps.DirectionsRenderer();

		//document.getElementById('map_canvas').style.display = 'block';
		//var map;
		var myLatlng = new google.maps.LatLng(33.775919, -84.397276);
		//var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		var mapOptions =
		{
		  zoom: 16,
		  center: myLatlng,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

		directionsDisplay.setMap(map);
	}
	*/


	function placeMarker(location, map)
	{
		var marker = new google.maps.Marker({
			position: location,
			map: map
		});

		getLocationName(location);

		//alert(locationName);

		showCustomLocation(location);
		getMyLoc(location);
	}

	function getLocationName(location)
	{
        var geocoder = new google.maps.Geocoder();

        var latlng = new google.maps.LatLng(location.lat(), location.lng());

        geocoder.geocode({'latLng': latlng}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              document.getElementById('search_field').value = results[1].formatted_address;
              customDestination = results[1].formatted_address;
            } else {
              //alert('No results found');
              return("Selected Location");
            }
          } else {
            //alert('Geocoder failed due to: ' + status);
         	return("Selected Location");
          }
        });
	}

	function calcRoute(travelMode,origin1, destination)
	{
		//var origin2 = new google.maps.LatLng(41.850033, -87.6500523);
		var origin2 = new google.maps.LatLng(parseFloat(origin1[0]), parseFloat(origin1[1]));
		var request =
		{
			origin: origin2,
			destination: destination,
			// Note that Javascript allows us to access the constant
			// using square brackets and a string value as its
			// "property."
			travelMode: google.maps.TravelMode[travelMode]
		};
		//alert(request.origin);
		//alert(request.destination);
		//alert(request);

		var directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function(response, status) {
         //alert('1');
         if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          }
		});
	}

	function jsonGetBusLocations()
	{
		var jsontext = httpGet('http://m.cip.gatech.edu/api/buses/position');
		var buses = JSON.parse(jsontext);

		//alert(buses[0].id + ", " + buses[1].id);
		return buses;
	}

	function jsonGetStopLocations()
	{
		var jsontext = httpGet('http://m.cip.gatech.edu/api/buses/stop');
		//alert(jsontext.substring(14,,jsontext.length-2));
		var stops = JSON.parse(jsontext);
		//alert(stops);
		return stops;
	}


	function jsonGetBikeInfo()
	{
		var jsontext = httpGet('https://gt.viacycle.com/m/data/');
		//alert(jsontext.substring(14,,jsontext.length-2));
		var stops = JSON.parse(jsontext);
		//alert('bikes');
		//alert(stops);
		return stops;
	}

	function httpGet(theUrl)
    {
		var xmlHttp = null;

		xmlHttp = new XMLHttpRequest();
		xmlHttp.open( "GET", theUrl, false );
		xmlHttp.send( null );
		return xmlHttp.responseText;
    }


    function getLocationInfo(theUrl)
    {
		$.getJSON(theUrl, function(json)
		{
		   alert("JSON Data: " + json.results[0].formatted_address);
 		});
	}

	function closestBikeStop()
	{

		var bikes = jsonGetBikeInfo();
		var allBikesInfoArray = new Array();

		//alert(bikes.zones.length);
		for(var i=0; i < bikes.zones.length; i++)
		{
			var bikeInfoArray = new Array();
			bikeInfoArray.push(bikes.zones[i].name);
			bikeInfoArray.push(bikes.zones[i].bikecount);

			var bikeLocation = new AR.GeoLocation(bikes.zones[i].location.latitude, bikes.zones[i].location.longitude);
			bikeInfoArray.push(bikeLocation.distanceToUser());
			bikeInfoArray.push('isNotClosest');
			bikeInfoArray.push(bikes.zones[i].location.latitude);
			bikeInfoArray.push(bikes.zones[i].location.longitude);

			allBikesInfoArray.push(bikeInfoArray);

			//alert(bikes.zones[i].location.longitude);
			//var bikesGeoObjects = new AR.GeoObject(busLocation, {drawables: {cam: bikeImgDrawable}} );
			//alert(busLocation.distanceToUser() + " meters");
		}

		/* Set the first stop as closest */
		var closestStopDistance = allBikesInfoArray[0][2];
		allBikesInfoArray[0][3] = 'isClosest';

		for(var i=1; i < allBikesInfoArray.length; i++)
		{
			if(closestStopDistance > allBikesInfoArray[i][2])
			{
				resetClosestBikeLocation(allBikesInfoArray);
				allBikesInfoArray[i][3] = 'isClosest';
			}
		}

		return(allBikesInfoArray);
	}

	function resetClosestBikeLocation(allBikesInfoArray)
	{
		for(var i=0; i < allBikesInfoArray.length; i++)
		{
			allBikesInfoArray[i][3] = 'isNotClosest';
		}
	}

	function getMyLoc(location)
	{
		navigator.geolocation.getCurrentPosition(function(position) {
		            //lat = position.coords.latitude;
		            //lng = position.coords.longitude;
		            //alert(lat + " " + long);
		            //return(new Array(lat, long));
					calcRoute("WALKING", new Array(position.coords.latitude, position.coords.longitude), location);
				}, function() {
		            alert('Can\'t retrieve position.\nError: ');
		            //return null;
        });

	}

	function destroyAllObjects()
	{
		AR.context.destroyAll();
		if(bikeFlag == true)
		{
			showBike(1);
		}

		if(greenBusFlag == true)
		{
			showGreenBus(1);
		}

		if(blueBusFlag == true)
		{
			showBlueBus(1);
		}

		if(redBusFlag == true)
		{
			showRedBus(1);
		}

		if(trolleyFlag == true)
		{
			showTrolleys(1);
		}

		if(walkFlag == true)
		{
			showBike(1);
		}
	}

	function clearScreen()
	{
		AR.context.destroyAll();
	}


	function decisionTrolley()
	{
		clearScreen();
		var closestBusStopLocation = new Array(closestStop("trolley"), closestStop("red"), closestStop("green"), closestStop("blue"));

		showClosestBusStopsMarker(closestBusStopLocation);

		document.getElementById('sabDirections').style.display = 'block';
		//setTimeout(hideWalkBar(),3000);
	}

	function decisionBike()
	{
		clearScreen();
		var bikeStopLocation = closestBikeStop();
		for(var i=0; i < bikeStopLocation.length; i++)
		{
			if(bikeStopLocation[i][3] == 'isClosest')
			{
				showClosestCycleMarker("ViaCycle", bikeStopLocation[i][0], bikeStopLocation[i][2], bikeStopLocation[i][4], bikeStopLocation[i][5]);
				//alert("Closest Bike Stop is " + bikeStopLocation[i][0] + " at " + parseFloat(bikeStopLocation[i][2]) + " meters with " + bikeStopLocation[i][1] + " bikes");
			}
		}
		document.getElementById('sabDirections').style.display = 'block';
		//setTimeout(hideWalkBar(),3000);
	}

	function decisionWalk()
	{
		alert("You wanna walk huh!!");
		document.getElementById('sabDirections').style.display = 'block';
		//setTimeout(hideWalkBar(),3000);
	}

	function hideWalkBar()
	{
		document.getElementById('sabDirections').style.display = 'none';
	}



	function showClosestBusStopsMarker(closestBusStopLocation)
	{

		// Called if the location changes
		function locationCustomLocation(lat, lon, alt, acc)
		{
			// We are only interested in the first location, lets set the onLocationChanged trigger to null which
			// will deactivate it.
			AR.context.onLocationChanged = null;

			for(var i=0; i < closestBusStopLocation.length; i++)
			{
				//bus type, stopName, closestStopLocation
				myCustomGeoLocation = new AR.GeoLocation(parseFloat(closestBusStopLocation[i][2].latitude), parseFloat(closestBusStopLocation[i][2].longitude));
				//alert(myCustomGeoLocation.longitude);
				//type, name, distance, locLat, locLng

				imageCustomLocationDrawable = new AR.HtmlDrawable({html:"<body><style>*{margin:0;padding:0;border:0;list-style:none;outline:none;border:0;}#bigbox{width:200px;text-align:center;height:auto;border:#FFF 3px solid;}h3{width:200px;font:30px Arial, Helvetica, sans-serif;color:#000;background:rgba(255,255,255,0.7);text-align:center;}h1{font:25px Arial, Helvetica, sans-serif;font-weight:bold;color:#FFF;padding:5px;max-height:60px;white-space: wrap;overflow: hidden;text-overflow: ellipsis;background:#00F;}h2{font:18px Arial, Helvetica, sans-serif;font-weight:400;color:#FFF;background:#090;}.arrow-down {margin-left:98px;width: 3px;height: 200px;background:#FFF;}.here{height:20px;width:20px;border-radius:20px;background-color:#fff;margin-left:90px;}</style><div id='bigbox'><h2>Nearest " + closestBusStopLocation[i][0] + " Stop</h2><h1>" + closestBusStopLocation[i][1] + "</h1><h3>At " + parseInt(closestBusStopLocation[i][2].distanceToUser()) + " meters</h3></div><div class='arrow-down'></div><div class='here'></div></body>"}, 5, {viewportWidth: 1024, scale:5,
				horizontalAnchor : AR.CONST.HORIZONTAL_ANCHOR.LEFT,
				opacity : 0.9
				});


				// create the GeoObject at the GeoLocation myLocation.
				var customGeoObject = new AR.GeoObject(myCustomGeoLocation, {drawables: {cam: imageCustomLocationDrawable}});
			}
		}

		AR.context.onLocationChanged = locationCustomLocation;
	}


	function showClosestCycleMarker(type, name, distance, locLat, locLng)
	{
		// Called if the location changes
		function locationCustomLocation(lat, lon, alt, acc)
		{
			// We are only interested in the first location, lets set the onLocationChanged trigger to null which
			// will deactivate it.
			AR.context.onLocationChanged = null;

			myCustomGeoLocation = new AR.GeoLocation(locLat, locLng);

			//imageCustomLocationDrawable = new AR.ImageDrawable(imageCustomLocation, 3, {enabled: true});

			imageCustomLocationDrawable = new AR.HtmlDrawable({html:"<body><style>*{margin:0;padding:0;border:0;list-style:none;outline:none;border:0;}#bigbox{width:200px;text-align:center;height:auto;border:#FFF 3px solid;}h3{width:200px;font:30px Arial, Helvetica, sans-serif;color:#000;background:rgba(255,255,255,0.7);text-align:center;}h1{font:25px Arial, Helvetica, sans-serif;font-weight:bold;color:#FFF;padding:5px;max-height:60px;white-space: wrap;overflow: hidden;text-overflow: ellipsis;background:#00F;}h2{font:18px Arial, Helvetica, sans-serif;font-weight:400;color:#FFF;background:#090;}.arrow-down {margin-left:98px;width: 3px;height: 200px;background:#FFF;}.here{height:20px;width:20px;border-radius:20px;background-color:#fff;margin-left:90px;}</style><div id='bigbox'><h2>Nearest " + type + " Stop</h2><h1>" + name + "</h1><h3>At " + parseInt(distance) + " meters</h3></div><div class='arrow-down'></div><div class='here'></div></body>"}, 5, {viewportWidth: 1024, scale:5,
			horizontalAnchor : AR.CONST.HORIZONTAL_ANCHOR.LEFT,
			opacity : 0.9
			});


			// create the GeoObject at the GeoLocation myLocation.
			var customGeoObject = new AR.GeoObject(myCustomGeoLocation, {drawables: {cam: imageCustomLocationDrawable}});

		}

		AR.context.onLocationChanged = locationCustomLocation;
	}


	function closestStop(routeType)
	{
			var stops = jsonGetStopLocations();
			var stopByRouteType = null;
			//alert(routeType);

			var closestStopLocation = new AR.GeoLocation(parseFloat(stops[0].stop_lat), parseFloat(stops[0].stop_lon));

			//var closestStopInfoArray = new Array();
			var stopName;

			for(var i=1; i < stops.length; i++)
			{
				if(stops[i].route_id == routeType)
				{
					stopByRouteType = new AR.GeoLocation(parseFloat(stops[i].stop_lat), parseFloat(stops[i].stop_lon));
					//alert(stopByRouteType.distanceToUser());

					if(closestStopLocation.distanceToUser() > stopByRouteType.distanceToUser())
					{
						closestStopLocation = stopByRouteType;
						stopName = stops[i].stop_name;
					}
				}
			}

			var type = "Tech Trolley";

			switch(routeType)
			{
				case "trolley":
					type = "Tech Trolley";
					break;

				case "red":
					type = "Red Bus";
					break;

				case "blue":
					type = "Blue Bus";
					break;

				case "green":
					type = "Green Bus";
					break;
			}

			return(new Array(type, stopName, closestStopLocation));

	}

	function sortByDistance(arrayToSort)
	{
		for(var i = 0; i < arrayToSort.length - 1; i++)
		{
			for(var j = 1; j < arrayToSort.length; j++)
			{
				if(arrayToSort[j] < arrayToSort[i])
				{
					var tempElement = arrayToSort[j];
					arrayToSort[j] = arrayToSort[i];
					arrayToSort[i] = tempElement;
				}
			}
		}
	}

	function init()
	{
		//buses = jsonGetBusLocations();
		showTrolleys(1);
	}



//https://www.googleapis.com/latitude/v1/currentLocation?key=AIzaSyAit68vDrPzXg9o-zmdO69czzDXakJCWns
