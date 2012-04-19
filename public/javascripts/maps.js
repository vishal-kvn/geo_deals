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

MYMAP.placeMarkers = function() {
	$.ajax(
		{
		     	url: 'http://api.groupon.com/v2/deals.json',
	        dataType: 'jsonp',
          data:
          {
           client_id: '7dd6695c43abb73bd81f14bf26d427e4e4990cf5', 
           lat: '40.714623', 
           lng: '-74.006605', 
           radius: '20', 
           show: 'division,title,smallImageUrl,options'
          },
		     success: function(json){
			      map_current_location(MYMAP.map, 40.714623, -74.006605);
			
						$.each(json.deals, function(i, item){
							//console.log(item.options);
							var lat;
							var lng;
							var rl;
							$.each(item.options, function(i, obj){
														                //console.log(obj.redemptionLocations[0].lat);
														rl = obj.redemptionLocations.length;
														//jQuery.isEmptyObject(obj.redemptionLocations);
														if(rl > 0){
														 	lat = obj.redemptionLocations[0].lat;
															lng = obj.redemptionLocations[0].lng;	
															return false; //break after finding lat and lng
														}
							});
							
			var name = item.id;//$(this).find('name').text();
			var address = item.division.name;//$(this).find('address').text();
			if((typeof lat == 'undefined') || (typeof lng == 'undefined')){
				return; //continue to next deal
			}
			
			//console.log(i + ' : ' + ' lat = ' + lat + ' lng = ' + lng + ' rL : ' + rl);
			
			// create a new LatLng point for the marker
			// var lat = item.division.lat;//$(this).find('lat').text();
			// var lng = item.division.lng;//$(this).find('lng').text();
			var point = new google.maps.LatLng(parseFloat(lat),parseFloat(lng));
			
			// console.log("index : " + i);
			// 			console.log("address : " + address);
			// 			console.log("lat : " + lat);
			// 			console.log("lng : " + lng);
			// 			console.log("name : " + name);
			
			// extend the bounds to include the new point
			MYMAP.bounds.extend(point);
			
			var marker = new google.maps.Marker({
				position: point,
				map: MYMAP.map
			});
			
			var infoWindow = new google.maps.InfoWindow();
			var html='<strong>'+name+'</strong.><br />'+address;
			google.maps.event.addListener(marker, 'click', function() {
				infoWindow.setContent(html);
				infoWindow.open(MYMAP.map, marker);
			});
			//MYMAP.map.fitBounds(MYMAP.bounds);
		});
				 }
	});
}

var map_current_location = function(map, lat, lng) {
	//displaying current location
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
		var html='<strong>'+"Current Location"+'</strong.><br />';
		google.maps.event.addListener(center_marker, 'click', function() {
			infoWindow.setContent(html);
			infoWindow.open(MYMAP.map, center_marker);
		});
}