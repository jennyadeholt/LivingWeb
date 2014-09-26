
var soldObjects;

angular.module('livingWebApp')
.service('BooliService',function BooliService(){

	soldObjects = false;

	var getHttp = function($http, url) {
		var location = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
		return $http({
				method: 'GET',
				url:  location + url
		});
	}

	this.showSoldObjects = function () {
		return soldObjects;
	}

	this.getProfits = function($scope, $http) {
		var offset = $scope.nbr === 0 ? 0 : $scope.nbr * 500;
		return getHttp($http, '/api/booli/solds/' + $scope.keywords + "&offset=" + offset);
	}

	this.getListings = function($scope, $http) {
		soldObjects = $scope.soldObjects;
		var offset = $scope.nbr === 0 ? 0 : $scope.nbr * 500;
		return getHttp($http,  '/api/booli/' + (soldObjects ? 'solds/' : 'listings/') + $scope.keywords + "&offset=" + offset);
	}

	this.getListing = function($scope, $http, booliId) {
		$scope.booliId = booliId;

		var p = getHttp($http, '/api/booli/listing/' + booliId);

		p = p.catch(function() {
			soldObjects = !soldObjects;
			p = getHttp($http, '/api/booli/sold/' + booliId);
			return p;
		});

		p = p.catch(function () {
			return "Failure";
		});

		return p;
	}

	this.getAreas = function($scope, $http) {
		return function(request, response) {
			getHttp($http, '/api/booli/areas/' + request.term)
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
