var $getListings = function($scope, $http, $filter) {	
	
	var booliAPI;
	
	if ($scope.soldObjects) {
		booliAPI = "api.booli.se/sold?q=" + $scope.keywords + "&";
	} else {
		booliAPI = "api.booli.se/listings?q=" + $scope.keywords + "&";
	}
	
	
	$http({ 
		method: 'GET', 
		url: 'http://www.corsproxy.com/' + booliAPI + $auth(),  
		params : { format: "json" }, 
		headers: {'Accept': 'application/json' }
	}).success(function(data, status, headers, config) {
		$scope.data = data;
		if ($scope.soldObjects) {
			$scope.listings =  data.sold;
		} else {
			$scope.listings =  data.listings;
		}
		
		google.maps.event.addDomListener(window, 'load', $initializeListMap($scope.listings, $filter));
	
		$.each($scope.listings, function(i, item) {
			item.imageUrl =$getImageUrl(item.booliId);
		})
	
		$scope.orderProp = '-published';
	
	}).error(function(data, status, headers, config) {
	
	});
	
};

var $getListing = function($scope, $routeParams, $http, sold) {
	$scope.booliId = $routeParams.booliId;

	var booliAPI;
	if (sold) {
		booliAPI = "api.booli.se/sold/" + $scope.booliId + "?" + $auth();
	} else {
		booliAPI = "api.booli.se/listings/" + $scope.booliId + "?" + $auth();
	}
	
	$http({ 
		method: 'GET', 
		url: 'http://www.corsproxy.com/' + booliAPI,  
		params : { format: "json" }, 
		headers: {'Accept': 'application/json' }
	}).success(function(data, status, headers, config) {
		console.log("search on id " + $scope.booliId);
		if (sold) {
			$scope.listing =  data.sold[0];
		} else {
			$scope.listing =  data.listings[0];
		}
		$scope.listing.imageUrl = $getImageUrl($scope.booliId);
		
		google.maps.event.addDomListener(window, 'load', $initializeMap($scope.listing));
		
	}).error(function(data, status, headers, config) {
		$getListing($scope, $routeParams, $http, true);
	});
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

var $getAreas = function($scope) { 
	return function(request, response) {
		$scope.keywords = request.term;
		var api = "http://www.corsproxy.com/api.booli.se/areas?q=" + request.term + "&" + $auth();
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

var $time = Date.now || function() {
	return +new Date;
};

function isEmpty(str) {
	return (!str || 0 === str.length);
}		
			
	

