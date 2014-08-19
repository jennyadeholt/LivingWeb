var $getListings = function($scope, $http) {	
	
	if (isEmpty($scope.keywords)){
		$scope.keywords = 'Malmö';
	}
	
	console.log("search " + $scope.keywords);
	
	var booliAPI = "api.booli.se//listings?q=" + $scope.keywords + "&";

	$http({ 
		method: 'GET', 
		url: 'http://www.corsproxy.com/' + booliAPI + $auth(),  
		params : { format: "json" }, 
		headers: {'Accept': 'application/json' }
	}).success(function(data, status, headers, config) {
		$scope.data = data;
		$scope.listings =  data.listings;
	
		$.each($scope.listings, function(i, item) {
			item.imageUrl =$getImageUrl(item.booliId);
		})
	
		$scope.orderProp = '-published';
		
		google.maps.event.addDomListener(window, 'load', $initializeListMap($scope.listings));
	
	}).error(function(data, status, headers, config) {
	
	});
};

var $getListing = function($scope, $routeParams, $http) {
	$scope.booliId = $routeParams.booliId;
	var booliAPI = "api.booli.se/listings/" + $scope.booliId + "?" + $auth();
	
	$http({ 
		method: 'GET', 
		url: 'http://www.corsproxy.com/' + booliAPI,  
		params : { format: "json" }, 
		headers: {'Accept': 'application/json' }
	}).success(function(data, status, headers, config) {
		console.log("search on id " + $scope.booliId);
		$scope.listing =  data.listings[0];
		$scope.listing.imageUrl = $getImageUrl($scope.booliId);
		console.log($scope.listing);
		
		google.maps.event.addDomListener(window, 'load', $initializeMap($scope.listing));
		
	}).error(function(data, status, headers, config) {
		console.log("search on id ERROR");
	});
}


var $getAreas = function($scope) { 
	return function(request, response) {
		console.log("autocomplete " + request.term);
		$scope.keywords = request.term;
		var api = "http://www.corsproxy.com/api.booli.se/areas?q=" + request.term + "&" + $auth();
		console.log("autocomplete " + request.term  + " on " + api);
		$.getJSON(api, {}, 
			function(data) {
				var array = data.error ? [] : $.map(data.areas, function(m) {
					return {
						label: m.fullName
					};
				});
				response(array);
			});
	}
}			
			
var $getImageUrl = function(booliId) {
	return "http://api.bcdn.se/cache/primary_" + booliId +"_140x94.jpg";
}


var $auth = function() {
	var callerId = "EasyLiving";
	var time = $time();
	var privateKey = "fN9u8gmUFMvXCgNS8SAWkE96535Ttul5lNzpWeP2";
	var unique = Math.random().toString(36).slice(2);
	var hash = sha1(callerId + time + privateKey + unique);
 
	return "callerId=" + callerId + "&time=" + time + "&unique=" + unique + "&hash=" + hash;
};


var $time = Date.now || function() {
	return +new Date;
};

function isEmpty(str) {
	return (!str || 0 === str.length);
}

