var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('PhoneListCtrl', ['$scope', '$http',
function ($scope, $http) {
	console.log("search");
	
	$scope.search = function() {	
		console.log("search");
		var booliAPI = "api.booli.se//listings?q=" + $scope.keywords + "&";

		$http({ 
			method: 'GET', 
			url: 'http://www.corsproxy.com/' + booliAPI + $auth(),  
			params : { format: "json" }, 
			headers: {'Accept': 'application/json' }
		}).success(function(data, status, headers, config) {
			$scope.data = data;
			$scope.listings =  data.listings;
		
			$.each($scope.listings, function(i, item) {
				var temp = "http://api.bcdn.se/cache/primary_" + item.booliId +"_140x94.jpg";
				item.imageUrl = temp;
			})
		
			$scope.orderProp = '-published';
		
		}).error(function(data, status, headers, config) {
		
		});
	};
}]);
  
  

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', '$http', 
function($scope, $routeParams, $http) {
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
	
}]);