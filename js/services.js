
var services = angular.module('services', []);

services.service('BooliService', function(){     
    this.getListings = function($scope, $http, $filter) { 
		$getListings($scope, $http, $filter);
	};  
	
    this.getListing = function($scope, $routeParams, $http) { 
		$getListing($scope, $routeParams, $http);
	};
});