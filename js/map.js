var map;
var mapOptions;

var currentInfoWindow;

var markers = [];
var ids = [];
var position;

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
	var mapOptions = {
		zoom: 13,
		center: getLocation($listing)
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);	  
	addLocation($listing);  
}

var $initializeListMap = function($scope, $filter) {
	
	var objects = getObjects($scope, $filter);

	var mapOptions = {
		zoom: 12,
		center: findCenter(objects),
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
		},
		mapTypeId: MY_MAPTYPE_ID
	};
	
	map = new google.maps.Map(document.getElementById('map-canvas-list'), mapOptions);

	addMarkers(objects, $filter);
	map.mapTypes.set(MY_MAPTYPE_ID, new google.maps.StyledMapType(featureOpts, { name: 'Vatten'}));	
	setBounds(objects);
}

var $updateListMap = function($scope, $filter) {

	$.each(markers, function(i, marker) {
		marker.setMap(null);
	});
	markers = [];
	ids = [];
	
	var objects = getObjects($scope, $filter);
	addMarkers(objects, $filter);
	setBounds(objects);
}

var $updateInfoWindow = function($listing, $filter) {
	$.each(ids, function(i, id) {
		if (id == $listing.booliId) {
			showInfoWindow($listing, $filter, markers[i]);
		}
	});	
}

function findCenter(listings) {
	var long = 0;
	var lat = 0;
	var size = listings.length;
	
	$.each(listings, function(i, listing) {
		long += listing.location.position.longitude;
		lat += listing.location.position.latitude;
	})
	
	return new google.maps.LatLng(lat / size, long / size);
}

function showInfoWindow($listing, $filter, marker) {
	if (currentInfoWindow) {
		currentInfoWindow.close();
	}
	
	currentInfoWindow = getInfoWindow($listing, $filter);
	currentInfoWindow.open(marker.get('map'), marker);	
}

function getObjects($scope, $filter) {
	var offset = $scope.currentPage === 0 ? 0 : $scope.currentPage * $scope.pageSize;	
	$scope.listings = $filter('orderBy')($scope.listings, $scope.orderProp);
	return $scope.listings.slice(offset, offset + $scope.pageSize);
}

function addMarkers(objects, $filter) {
	$.each(objects, function(i, listing) {
		var marker = addLocation(listing);		
	
		markers.push(marker);	
		ids.push(listing.booliId);
			
		google.maps.event.addListener(marker, 'click', function() {
			showInfoWindow(listing, $filter, marker);
		});		
	})
}

function addLocation(listing) {
	return new google.maps.Marker({
		position: getLocation(listing),
		map: map,
		draggable: true,
		animation: google.maps.Animation.DROP,
	});
}

function setBounds(listings) {
	var bounds = new google.maps.LatLngBounds();
	$.each(listings, function(i, listing) {
		bounds.extend(getLocation(listing));
		
	})
	map.fitBounds(bounds);
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
		'<img src="http://api.bcdn.se/cache/primary_' + listing.booliId + '_140x94.jpg"></img>'+ 
		'<div id="textInfo">'+
		'<p>'+ $filter("nfcurrency")(listing.listPrice) + '</p>' + 
		'<p>' + listing.objectType + '</p>' +
		'<p>' + $filter("kvm")(listing.livingArea) + ", " + $filter("room")(listing.rooms) +'</p>' +
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
