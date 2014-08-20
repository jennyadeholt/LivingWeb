var controllers = angular.module('controllers', []);

controllers.controller('ListCtrl', ['$scope', '$http',
function ($scope, $http) {

	$scope.soldObjects = false;
 	$scope.keywords = 'Malmö';
	
	setUpAutoComplete($scope, $http);
	
	$scope.search = function(){
		$getListings($scope, $http);
	}	
}]);
    

controllers.controller('DetailCtrl', ['$scope', '$routeParams', '$http', 
function($scope, $routeParams, $http) {
	
	$scope.openUrl = function(url){
		window.open(url), "_blank";
	};	
	$getListing($scope, $routeParams, $http);	
}]);



