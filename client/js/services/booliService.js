
var soldObjects;

angular.module('livingWebApp')
.service('BooliService',function BooliService(){

	soldObjects = false;

	var getHttp = function($http, url) {
		var location = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
		return $http({
				method: 'GET',
				url:  location + '/api/booli/' + url
		});
	}

	var fetchListings = function($scope, $http, url) {
		var offset = $scope.nbr === 0 ? 0 : $scope.nbr * 500;
			return getHttp($http, url + $scope.keywords + "&offset=" + offset);
	}

	var fetchListingsInIntervall = function($scope, $http, url, minSoldDate, maxSoldDate) {
		var offset = $scope.nbr === 0 ? 0 : $scope.nbr * 500;
		return getHttp($http, url + $scope.keywords + "&offset=" + offset + "&minSoldDate=" + minSoldDate + "&maxSoldDate=" + maxSoldDate);
	}

	this.showSoldObjects = function () {
		return soldObjects;
	}

	this.getProfits = function($scope, $http) {
		return fetchListingsInIntervall($scope, $http, 'solds/',  $scope.filterStartDate, 	$scope.filterEndDate);
	}

	this.getListings = function($scope, $http) {
		soldObjects = $scope.soldObjects;
		return fetchListings($scope, $http, (soldObjects ? 'solds/' : 'listings/') );
	}

	this.getListing = function($scope, $http, booliId) {
		$scope.booliId = booliId;
		var p = getHttp($http, 'listing/' + booliId);
		p = p.catch(function () {
			return "Failure";
		});

		return p;
	}

	this.getAreas = function($scope, $http) {
		return function(request, response) {
			getHttp($http, 'areas/' + request.term)
			.then(function(content) {
				var array = content.data.error ? [] : content.data.areas.map(function(m) {
					return {
						label: m.fullName
					};
				});
				response(array);
			});
		}
	}
});
