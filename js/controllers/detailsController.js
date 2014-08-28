
function DetailsController($scope, $routeParams, $http, BooliService) {	
	
	$scope.openUrl = function(url){
		window.open(url), "_blank";
	};
		
	BooliService.getListing($scope, $routeParams,  $http);
}