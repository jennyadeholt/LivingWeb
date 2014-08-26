var controllers = angular.module('controllers', []);

controllers.controller('ListCtrl', ['$scope', '$http', '$filter', 
function ($scope, $http, $filter) {

	$scope.soldObjects = false;
 	$scope.keywords = 'Malmö Centrum, Centrum Malmö, Malmö';
	
	setUpAutoComplete($scope, $http);
	
	$scope.search = function(){
		$getListings($scope, $http, $filter);
	}
	$getListings($scope, $http, $filter);
	
	
	getBio().then(function(bio){
		console.log("Testing testing");
	  $scope.bio = bio;
	});
	

	
			
}]);


function getBio(){
  var deferred = $q.defer();
  // async call, resolved after ajax request completes
  return deferred.promise;
};

    

controllers.controller('DetailCtrl', ['$scope', '$routeParams', '$http', 
function($scope, $routeParams, $http) {
	
	$scope.openUrl = function(url){
		window.open(url), "_blank";
	};	
	$getListing($scope, $routeParams, $http);	
}]);





