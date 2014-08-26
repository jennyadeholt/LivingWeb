var controllers = angular.module('controllers', []);

controllers.controller('ListCtrl', ListController);

controllers.controller('DetailCtrl', function($scope, $routeParams, $http, BooliService) {	
	$scope.openUrl = function(url){
		window.open(url), "_blank";
	};	
	BooliService.getListing($scope, $routeParams,  $http);

});
