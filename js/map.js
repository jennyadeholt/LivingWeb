var map;
var $initialize = function($scope) {
	
	var location  = $scope.listing.location.position;
	
	var position = new google.maps.LatLng(location.latitude, location.longitude);	
	
	
	var mapOptions = {
		zoom: 13,
		center: position
	};
  
	map = new google.maps.Map(document.getElementById('map-canvas'),
	mapOptions);
	  
	  
	marker = new google.maps.Marker({
		map: map,
		draggable: true,
		animation: google.maps.Animation.DROP,
		position: position
	});
	
	google.maps.event.addListener(marker, 'click', toggleBounce);	  
}

function toggleBounce() {

	if (marker.getAnimation() != null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}
