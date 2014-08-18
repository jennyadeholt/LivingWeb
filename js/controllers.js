var controllers = angular.module('controllers', []);

controllers.controller('ListCtrl', ['$scope', '$http',
function ($scope, $http) {

	$scope.search = function() {	
		$getListings($scope, $http);
	};
	
	$getListings($scope, $http);
	
	$("#autocomplete").autocomplete({
		delay: 100,
		minLength: 1,
		source: $getAreas(),
		focus: function(event, ui) {
			event.preventDefault();
		},
		select: function(event, ui) {
			$scope.keywords = ui.item.label;
		}
	});
}]);
    

controllers.controller('DetailCtrl', ['$scope', '$routeParams', '$http', 
function($scope, $routeParams, $http) {
	
	$scope.openUrl = function(url){
		window.open(url), "_blank";
	};	
	  
	$getListing($scope, $routeParams, $http);	
}]);
