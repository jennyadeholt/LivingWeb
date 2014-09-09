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
	var location = getLocation($listing);
	var mapOptions = {
		zoom: 13,
		center: location
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);	  
	addLocation(location);  
}

var $initializeListMap = function($scope, $filter) {
	
	var objects = getObjects($scope, $filter);

	var mapOptions = {
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
		},
		mapTypeId: MY_MAPTYPE_ID
	};
	
	map = new google.maps.Map(document.getElementById('map-canvas-list'), mapOptions);

	addMarkers(objects, $filter);
	map.mapTypes.set(MY_MAPTYPE_ID, new google.maps.StyledMapType(featureOpts, { name: 'Vatten'}));	
}

var $updateListMap = function($scope, $filter) {

	$.each(markers, function(i, marker) {
		marker.setMap(null);
	});
	markers = [];
	ids = [];
	
	var objects = getObjects($scope, $filter);
	addMarkers(objects, $filter);
}

var $updateInfoWindow = function($listing, $filter) {
	$.each(ids, function(i, id) {
		if (id == $listing.booliId) {
			showInfoWindow($listing, $filter, markers[i]);
		}
	});	
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
	var bounds = new google.maps.LatLngBounds();
	
	$.each(objects, function(i, listing) {
		var location = getLocation(listing);
		var marker = addLocation(location);		
	
		markers.push(marker);	
		ids.push(listing.booliId);
			
		google.maps.event.addListener(marker, 'click', function() {
			showInfoWindow(listing, $filter, marker);
		});	
		
		bounds.extend(location);	
	})
	
	map.fitBounds(bounds);
}

function addLocation(location) {
	return new google.maps.Marker({
		position: location,
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
		content: getContent(listing, $filter)
	});
}

function getContent(listing, $filter) {
	var content = '<div id="infoWindow">'+
	'<a href="#/bostad/' + listing.booliId + '">' +	
	'<h2 id="firstHeading" class="firstHeading">'+ listing.location.address.streetAddress + '</h2>'+
	'</a>' +
	'<div id="bodyContent">'+
	'<img src="http://api.bcdn.se/cache/primary_' + listing.booliId + '_140x94.jpg"></img>'+ 
	'<div id="textInfo">' ;
		
	if (!listing.soldPrice || 0 === listing.soldPrice.length) {
		content += '<p>'+ $filter("nfcurrency")(listing.listPrice) + '</p>' + 
		'<p>' + listing.objectType + '</p>' +
		'<p>' + $filter("kvm")(listing.livingArea) + ", " + $filter("room")(listing.rooms) +'</p>' +
		'</div>';
	} else {
		var negative = ((listing.soldPrice-listing.listPrice) < 0);	
		
		content += '<div><b ' + (negative ? " class=negative" : "") + '>'+ $filter("nfcurrency")(listing.soldPrice) + '</b> - '+ $filter("nfcurrency")(listing.listPrice) + '</div>' + 
		'<p>' + listing.objectType + '</p>' +
		'<p>' + $filter("kvm")(listing.livingArea) + ", " + $filter("room")(listing.rooms) +'</p>' +
		'</div>'+	
		'<div id="price" ' + (negative ? " class=negative" : "") +'><p>' + $filter("procent")((listing.soldPrice-listing.listPrice)/listing.listPrice) + '</p></div>';
	}
		
	content +=  '<p><a href="'+ listing.url + '" target="_blank">Mäklarbeskrivning</a></p>'+
	'</div>'+
	'</div>';
	
	return content;	
}

function toggleBounce() {
	if (marker.getAnimation() != null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}
