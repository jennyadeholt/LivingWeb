
var soldObjects;

angular.module('livingWebApp')
.service('BooliService',function BooliService(){

	soldObjects = false;

	var findListing = function($scope, $http) {
		return $http({
			method: 'GET',
			url: 'http://www.corsproxy.com/' + getBooliAPI($scope, soldObjects ? 3 : 2),
			params : { format: "json" },
			headers: {'Accept': 'application/json' }
		});
	}


	var getBooliAPI = function($scope, param) {
		var offset = $scope.nbr === 0 ? 0 : $scope.nbr * 250;

		switch(param) {
		case 0:
			return "api.booli.se/listings?q=" + $scope.keywords + "&" + $auth($scope) + "&offset=" + offset;
		case 1:
			return "api.booli.se/sold?q=" + $scope.keywords + "&" + $auth($scope) + "&offset=" + offset;
		case 2:
			return "api.booli.se/listings/" + $scope.booliId + "?" + $auth($scope);
		case 3:
			return "api.booli.se/sold/" + $scope.booliId + "?" + $auth($scope);
		}
	}


	this.showSoldObjects = function () {
		return soldObjects;
	}

	this.getListings = function($scope, $http) {
		soldObjects = $scope.soldObjects;
		return $http({
			method: 'GET',
			url: 'http://www.corsproxy.com/' + getBooliAPI($scope, soldObjects ? 1 : 0),
			params : { format: "json" },
			headers: {'Accept': 'application/json' }
		});
	}

	this.getProfits = function($scope, $http) {
		return $http({
			method: 'GET',
			url: 'http://www.corsproxy.com/' + getBooliAPI($scope, 1),
			params : { format: "json" },
			headers: {'Accept': 'application/json' }
		});
	}

	this.getListing = function($scope, $http, booliId) {
		$scope.booliId = booliId;

		var p = findListing($scope, $http)

		p = p.catch(function() {
			soldObjects = !soldObjects;
			p = findListing($scope, $http);
			return p;
		});

		p = p.catch(function () {
			return "Failure";
		});

		return p;
	}
});

var $getAreas = function($scope) {
	return function(request, response) {
		$scope.keywords = request.term;
		var api = "http://www.corsproxy.com/api.booli.se/areas?q=" + request.term + "&" + $auth();
		$.getJSON(api, {}, function(data) {
			var array = data.error ? [] : $.map(data.areas, function(m) {
				return {
					label: m.fullName
				};
			});
			response(array);
		});
	}
}

var $auth = function($scope) {
	var callerId = "EasyLiving";
	var time = $time();
	var privateKey = "fN9u8gmUFMvXCgNS8SAWkE96535Ttul5lNzpWeP2";
	var unique = Math.random().toString(36).slice(2);
	var hash = sha1(callerId + time + privateKey + unique);
	var offset = 0;


	return "callerId=" + callerId + "&time=" + time + "&unique=" + unique + "&hash=" + hash + "&limit=250";
};

var $time = Date.now || function() {
	return +new Date;
};
