
var soldObjects;

angular.module('livingWebApp')
.service('BooliService',function BooliService(){

	soldObjects = false;

	var location = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

	var getListing = function($scope, $http, booliId) {
		return $http({
				method: 'GET',
				url:  location + '/api/booli/listing/' + booliId
			});
	}

	var getListings = function($scope, $http, q) {
		return $http({
				method: 'GET',
				url: location + '/api/booli/listings/' + q
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

		return getListings($scope, $http, $scope.keywords);
	}

	this.getProfits = function($scope, $http) {
		return $http({
				method: 'GET',
				url:  location + '/api/booli/sold/' + $scope.keywords
			});
	}

	this.getListing = function($scope, $http, booliId) {
		$scope.booliId = booliId;

		var p = getListing($scope, $http, booliId);

		p = p.catch(function() {
			soldObjects = !soldObjects;
			p = getListing($scope, $http);
			return p;
		});

		p = p.catch(function () {
			return "Failure";
		});

		return p;
	}
});

var $getAreas = function($scope, $http) {
	return function(request, response) {
		$http({
				method: 'GET',
				url: window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api/booli/areas/' + request.term
			}).then(function(content) {
			var array = content.data.error ? [] : content.data.areas.map(function(m) {
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
