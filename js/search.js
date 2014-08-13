
function SearchCtrl($scope, $http) {
		
	// The function that will be executed on button click (ng-click="search()")
	$scope.search = function() {
	
		console.log("search");
		
		var booliAPI = "api.booli.se//listings?q=" + $scope.keywords + "&";
	
		console.log("search url: " + booliAPI);
	
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
}
