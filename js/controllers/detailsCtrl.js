var detailsController = function($scope, $routeParams, $http) {
	
	$scope.openUrl = function(url){
		window.open(url), "_blank";
	};	
	  
	$scope.init = function() {
	
	
		console.log("search on id");		
		
		$scope.booliId = $routeParams.booliId;
		var booliAPI = "api.booli.se/listings/" + $scope.booliId + "?" + $auth();
	
		$http({ 
			method: 'GET', 
			url: 'http://www.corsproxy.com/' + booliAPI,  
			params : { format: "json" }, 
			headers: {'Accept': 'application/json' }
		}).success(function(data, status, headers, config) {
			$scope.listing =  data.listings[0];
			$scope.listing.imageUrl = "http://api.bcdn.se/cache/primary_" + $scope.booliId +"_140x94.jpg"
			console.log($scope.listing);
		
		}).error(function(data, status, headers, config) {
			console.log("search on id ERROR");
		});
	}
}