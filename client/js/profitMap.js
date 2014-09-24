var map;
var profitMapBounds;
var mapOptions;

var currentInfoWindow;
var circles = [];
var ids = [];

var $initializeProfitMap = function($scope, $filter) {

	var objects = $scope.profits;

	if (objects) {
		var profitMapOptions = {
			mapTypeControlOptions: {
				mapTypeIds: [google.maps.MapTypeId.ROADMAP]
			},
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		map = new google.maps.Map(document.getElementById("map"), profitMapOptions);
		profitMapBounds = new google.maps.LatLngBounds();

		drawCirles(objects, $filter);
	}
}

var $updateProfitInfoWindow = function($listing, $filter) {
	$.each(ids, function(i, id) {
		if (id == $listing.booliId) {
			var circle = circles[i];
			if (circle) {
				showProfitInfoWindow($listing, circles[i], $filter);
			}
		}
	});
}

var $updateProfitMap = function($scope, $filter) {
	var offset = $scope.nbr * 250;
	var objects =  $scope.profits.slice(offset, offset + 500);

	drawCirles(objects, $filter);
}

var $redrawProfitMap = function($scope, $filter) {
	var objects = $scope.queryData;

	if (objects) {
		var profitMapOptions = {
			mapTypeControlOptions: {
				mapTypeIds: [google.maps.MapTypeId.ROADMAP]
			},
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		map = new google.maps.Map(document.getElementById('map-canvas-profit'), profitMapOptions);
		profitMapBounds = new google.maps.LatLngBounds();

		drawCirles(objects, $filter);
	}
}

function drawCirles(objects, $filter) {
	$.each(objects, function(i, listing) {
		var location = getLocation(listing);
		var color = '#000000';
		var opacity = 0.1;
		var rooms = listing.rooms ? listing.rooms : 1;
		if (listing.listPrice && listing.soldPrice) {
			opacity = getOpacity(listing);
			color = getColor(listing);
		}

		var populationOptions = {
			strokeColor: color ,
			strokeOpacity: opacity,
			strokeWeight: 2,
			fillColor: color ,
			fillOpacity: opacity,
			map: map,
			center: location,
			radius: 10 * rooms
		};
		var circle = new google.maps.Circle(populationOptions);

		profitMapBounds.extend(location);

		google.maps.event.addListener(circle, 'click', function() {
			showProfitInfoWindow(listing, circle, $filter);
		});

		circles.push(circle);
		ids.push(listing.booliId);

	})
	map.fitBounds(profitMapBounds);
}

function getColor(listing) {
	return getProcent(listing)* 100 > 0 ? '#B80000' : 'green';
}

function getOpacity(listing) {
	var procent = getProcent(listing);
	if (procent < 0) {
		procent = -procent;
	} else if (procent == 0) {
		return 0.1;
	}
	return procent * 4;
}

function getProcent(listing) {
	return ((listing.listPrice-listing.soldPrice)/listing.listPrice);
}

function showProfitInfoWindow($listing, circle, $filter) {
	if (currentInfoWindow) {
		currentInfoWindow.close();
	}

	currentInfoWindow = getProfitInfoWindow($listing, $filter);
	currentInfoWindow.setPosition(circle.getCenter());
	currentInfoWindow.open(map);
}

function getProfitInfoWindow(listing, $filter) {
	return new google.maps.InfoWindow({
		content: getWindowContent(listing, $filter)
	});
}

function getWindowContent(listing, $filter) {
	var negative = ((listing.soldPrice-listing.listPrice) < 0);

	return '<div id="infoWindow">'+
	'<a href="#/bostad/' + listing.booliId + '">' +
	'<h2 id="firstHeading" class="firstHeading">'+ listing.location.address.streetAddress + '</h2>'+
	'</a>' +
	'<div id="bodyContent">'+
	'<img src="http://api.bcdn.se/cache/primary_' + listing.booliId + '_140x94.jpg"></img>'+
	'<div id="textInfo">' +
	'<div><b ' + (negative ? " class=negative" : "") + '>'+ $filter("nfcurrency")(listing.soldPrice) + '</b> - '+ $filter("nfcurrency")(listing.listPrice) + '</div>' +
	'<p>' + listing.objectType + '</p>' +
	'<p>' + $filter("kvm")(listing.livingArea) + ", " + $filter("room")(listing.rooms) +'</p>' +
	'</div>'+
	'<div id="price" ' + (negative ? " class=negative" : "") +'><p>' + $filter("procent")(getProcent(listing)) + '</p></div>' +
	'<p><a href="'+ listing.url + '" target="_blank">Mäklarbeskrivning</a></p>'+
	'</div>'+
	'</div>';
}
