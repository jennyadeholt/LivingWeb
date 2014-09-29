
angular.module('livingWebApp')
.controller('DetailCtrl', function DetailsController($scope, $routeParams, $http, $location, BooliService) {
	$scope.init = function () {
		BooliService.getListing($scope, $http, $routeParams.booliId).then(function(response) {
			$scope.listing = response.data.sold ? response.data.sold[0] :response.data.listings[0] ;
			google.maps.event.addDomListener(window, 'load', $initializeMap($scope.listing));
			$scope.detailsUrl =  "templates/" + (isEmpty($scope.listing.soldPrice) ? 'listing' : 'sold') + "Details.html";

		}, function(response) {
			$location.path('/bostad');
		});
	};

	$scope.openUrl = function(url){
		window.open(url), "_blank";
	};
		
});
