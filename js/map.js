var map;
var mapOptions

var $initializeMap = function($listing) {
	
	var position = getLocation($listing)
	
	var mapOptions = {
		zoom: 13,
		center: position
	};
  
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	  
	addLocation($listing);  
}


var $initializeListMap = function($listings) {

	var long = 0;
	var lat = 0;
	var size = $listings.length;
	
	$.each($listings, function(i, listing) {
		long += listing.location.position.longitude;
		lat += listing.location.position.latitude;
	})
	
	var position = new google.maps.LatLng(lat / size, long / size);
	
	var mapOptions = {
		zoom: 11,
		center: position
	};
	
	map = new google.maps.Map(document.getElementById('map-canvas-list'), mapOptions);

	$.each($listings, function(i, listing) {
		addLocation(listing);
	})
}

function addLocation(listing) {
	new google.maps.Marker({
		position: getLocation(listing),
		map: map,
		draggable: true,
		animation: google.maps.Animation.DROP,
	});
}

function getLocation(listing) {
	var location  = listing.location.position;
	return new google.maps.LatLng(location.latitude, location.longitude);	 
}

function toggleBounce() {

	if (marker.getAnimation() != null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}
