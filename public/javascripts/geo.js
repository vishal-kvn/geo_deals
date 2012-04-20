function initiate_geolocation() { 
 	//alert("inside initiate_geolocation");
      if (navigator.geolocation)  
      {  
          navigator.geolocation.getCurrentPosition(handle_geolocation_query, handle_errors);
      } 
  }  

  function handle_errors(error)  
  {  
      switch(error.code)  
      {  
          case error.PERMISSION_DENIED: alert("user did not share geolocation data");  
          break;  

          case error.POSITION_UNAVAILABLE: alert("could not detect current position");  
          break;  

          case error.TIMEOUT: alert("retrieving position timedout");  
          break;  

          default: alert("unknown error");  
          break;  
      }  
  }  

  function handle_geolocation_query(position)
   {  
		//console.log('before' + 'lat: ' + clat + ' lng: ' + clng);
		clat = 37.4419444;//40.353;//position.coords.latitude;40.714623;
		clng = -122.1419444;//-74.673;//position.coords.longitude;-74.006605;

		console.log('values to map current location' + 'lat: ' + clat + ' lng: ' + clng);

		var myLatLng = new google.maps.LatLng(clat, clng);
		MYMAP.init('#map', myLatLng, 9);

		map_current_location(MYMAP.map, clat, clng, "Current Location");
   }