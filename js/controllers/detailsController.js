
function DetailsController($scope, $routeParams, $http, $location, BooliService) {		
	$scope.openUrl = function(url){
		window.open(url), "_blank";
	};
	
	$scope.search = function($scope, $routeParams, $http) {
		BooliService.getListing($scope, $routeParams, $http).then(function(response) {
			$scope.data = response.data;
			$scope.listing = BooliService.showSoldObjects() ? response.data.sold[0] : response.data.listings[0] ;
			$scope.listing.imageUrl = $getImageUrl($scope.booliId);

			google.maps.event.addDomListener(window, 'load', $initializeMap($scope.listing));
		}, function(response) {
			console.log("Error");
			$location.path('/bostad');		
		});
	}
		
	$scope.search($scope, $routeParams, $http, false);		
}