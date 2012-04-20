var MYMAP = {
  map: null,
	bounds: null
}

MYMAP.init = function(selector, latLng, zoom) {
  var myOptions = {
    zoom:zoom,
    center: latLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  this.map = new google.maps.Map($(selector)[0], myOptions);
	this.bounds = new google.maps.LatLngBounds();
}

// Method to add markers to the map based on the json returned from the groupon API
MYMAP.placeMarkers = function() {
	$.ajax(
	{
	 url: 'http://api.groupon.com/v2/deals.json',
   dataType: 'jsonp',
    data:
    	{
     	client_id: '7dd6695c43abb73bd81f14bf26d427e4e4990cf5', 
       lat: clat,//'40.714623', 
       lng: clng,//'-74.006605', 
       radius: '20', 
       show: 'division,title,buyUrl,options'
     },
	  success: function(json){
			map_current_location(MYMAP.map, clat, clng, "Current Location");
			
			// Iterate through all the deal options and get the first valid redemptionLocation.
			$.each(json.deals, function(i, item){
				console.log(item.options);

				var title;
				var url = item.buyUrl;
				var expiery;
				
				//Get the first valid redemptionLocation, to map the deal
				$.each(item.options, function(i, obj){
					
					title = obj.title;
					expiery = obj.expiresAt;
										
					if(obj.redemptionLocations.length > 0){
						console.log(obj.redemptionLocations[0].lat);
						lat = obj.redemptionLocations[0].lat;
						lng = obj.redemptionLocations[0].lng;	
						return false; //break after finding lat and lng
						}
				});
						
				var name = item.id;
				
				if((typeof lat == 'undefined') || (typeof lng == 'undefined'))
					{
						return; //continue to next deal
					}
		
				var point = new google.maps.LatLng(parseFloat(lat),parseFloat(lng));
			
				//creating markers for each deal
				MYMAP.bounds.extend(point);
				var marker = new google.maps.Marker({
					position: point,
					map: MYMAP.map
				});
				
				//creating info window for the corresponding deal
				var infoWindow = new google.maps.InfoWindow();
				var html='<strong>'+title+'</strong.><br />'+"ExpiresAt : "+expiery;
				
				google.maps.event.addListener(marker, 'click', function() {
					infoWindow.setContent(html);
					infoWindow.open(MYMAP.map, marker);
				});
			});
		},
		error:function(error){
			console.log(error);
			map_current_location(MYMAP.map, clat, clng, "No deals available near you");
		}
	});
}

// Method to display the current location on the map, obtained from the geolocation.
var map_current_location = function(map, lat, lng, msg) {

	 //diff pin for current location
	  var myLatLng = new google.maps.LatLng(lat, lng);
	  var pinColor = "008000";
	  var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
	  new google.maps.Size(42, 68),
	  new google.maps.Point(0,0),
	  new google.maps.Point(10, 34));
	
	  var center_marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			icon: pinImage
		});
		
		var infoWindow = new google.maps.InfoWindow();
		var html='<strong>'+ msg +'</strong.><br />';
		google.maps.event.addListener(center_marker, 'click', function() {
			infoWindow.setContent(html);
			infoWindow.open(MYMAP.map, center_marker);
		});
}