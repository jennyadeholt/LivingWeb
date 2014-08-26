var map;
var mapOptions;

var currentInfoWindow;

var featureOpts = [{
	stylers: [ { hue: '#317dec' },
	{ visibility: 'simplified' },
	{ gamma: 0.5 },
	{ weight: 0.5 } ]
},
{
	elementType: 'labels',
	stylers: [{ visibility: 'off' }]
},
{
	featureType: 'water',
	stylers: [ { color: '#317dec' } ]
}];

var MY_MAPTYPE_ID = 'custom_style';

var $initializeMap = function($listing) {
	
	var position = getLocation($listing)
	
	var mapOptions = {
		zoom: 13,
		center: position
	};
  
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	  
	addLocation($listing);  
}


var $initializeListMap = function($listings, $filter) {

	var long = 0;
	var lat = 0;
	var size = $listings.length;
	
	$.each($listings, function(i, listing) {
		long += listing.location.position.longitude;
		lat += listing.location.position.latitude;
	})
	
	var position = new google.maps.LatLng(lat / size, long / size);
	
	var mapOptions = {
		zoom: 13,
		center: position,
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
		},
		mapTypeId: MY_MAPTYPE_ID
	};
	
	map = new google.maps.Map(document.getElementById('map-canvas-list'), mapOptions);
	
	google.maps.event.addListener(map, 'click', function() {
		// 3 seconds after the center of the map has changed, pan back to the
		// marker.
		window.setTimeout(function() {
			map.panTo(marker.getPosition());
		}, 3000);
	});
	

	$.each($listings, function(i, listing) {
		var marker = addLocation(listing);		
		
		google.maps.event.addListener(marker, 'click', function() {
			if (currentInfoWindow) {
				currentInfoWindow.close();
			}
			currentInfoWindow = getInfoWindow(listing, $filter);
			currentInfoWindow.open(marker.get('map'), marker);
		});		
	})
	
	var styledMapOptions = {
		name: 'Vatten'
	};

	var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

	map.mapTypes.set(MY_MAPTYPE_ID, customMapType);	
}

function addLocation(listing) {
	return new google.maps.Marker({
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

function getInfoWindow(listing, $filter) {
	return new google.maps.InfoWindow({
		content: '<div id="infoWindow">'+
		'<a href="#/bostad/' + listing.booliId + '">' +	
		'<h2 id="firstHeading" class="firstHeading">'+ listing.location.address.streetAddress + '</h2>'+
		'</a>' +
		'<div id="bodyContent">'+
		'<img src="'+ listing.imageUrl + '"></img>'+ 
		'<div id="textInfo">'+
		'<p><b>Pris: </b>' + $filter("nfcurrency")(listing.listPrice) + '</p>' + 
		'<p><b>Typ: </b>' + listing.objectType + '</p>' +
		'<p><b>Rum: </b>' + listing.rooms + '</p>' +
		'<p><b>Boyta: </b> ' + listing.livingArea + ' kvm </p>' + 
		'</div>'+	
		'<p><a href="'+ listing.url + '" target="_blank">Mäklarbeskrivning</a></p>'+
		'</div>'+
		'</div>'
	});
}

function toggleBounce() {

	if (marker.getAnimation() != null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}
