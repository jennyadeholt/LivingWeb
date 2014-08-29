
var soldObjects;

function BooliService(){   
	
	soldObjects = false;
	
	this.showSoldObjects = function () {
		console.log("Show sold objects " + soldObjects );
		return soldObjects;
	}
		
	this.getListings = function($scope, $http) {	
		soldObjects = $scope.soldObjects;
		
		var promise = $http({ 
			method: 'GET', 
			url: 'http://www.corsproxy.com/' + getBooliAPI($scope, this.showSoldObjects() ? 1 : 0),  
			params : { format: "json" }, 
			headers: {'Accept': 'application/json' }
		}).success(function(data, status, headers, config) {
			return data;	
		}).error(function(data, status, headers, config) {
			return data;
		});
		
		return promise;
	};
	
	this.getListing = function($scope, $routeParams, $http) { 
		$scope.booliId = $routeParams.booliId;

		var promise = $http({ 
			method: 'GET', 
			url: 'http://www.corsproxy.com/' + getBooliAPI($scope, this.showSoldObjects() ? 3 : 2),  
			params : { format: "json" }, 
			headers: {'Accept': 'application/json' }
		}).success(function(data, status, headers, config) {
			return data;			
		}).error(function(data, status, headers, config) {
			return data;
		});
		return promise;			
	};
}

function getBooliAPI($scope, param) {	
	
	var offset = $scope.nbr === 0 ? 0 : $scope.nbr * 100;
	console.log("Offset " + offset);
	
	switch(param) {
	case 0:
		return "api.booli.se/listings?q=" + $scope.keywords + "&" + $auth($scope) + "&offset=" + offset;
	case 1:
		return "api.booli.se/sold?q=" + $scope.keywords + "&" + $auth($scope) + "&offset=" + offset;
	case 2:
		return "api.booli.se/listings/" + $scope.booliId + "?" + $auth($scope) + "&offset=" + offset;
	case 3:
		return "api.booli.se/sold/" + $scope.booliId + "?" + $auth($scope) + "&offset=" + offset;
	}	
}

var $getImageUrl = function(booliId) {
	return "http://api.bcdn.se/cache/primary_" + booliId +"_140x94.jpg";
}


var $auth = function($scope) {
	var callerId = "EasyLiving";
	var time = $time();
	var privateKey = "fN9u8gmUFMvXCgNS8SAWkE96535Ttul5lNzpWeP2";
	var unique = Math.random().toString(36).slice(2);
	var hash = sha1(callerId + time + privateKey + unique);
	var offset = 0;
	

	return "callerId=" + callerId + "&time=" + time + "&unique=" + unique + "&hash=" + hash + "&limit=100";
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
			
	

