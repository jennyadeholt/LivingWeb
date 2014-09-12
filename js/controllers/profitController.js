
angular.module('livingWebApp') 
.controller('ProfitCtrl', function ProfitController($scope, $http, $filter, $q, BooliService) {
	
	$scope.searchObjects = function(){
		runProfitSearch($scope, $http, $filter, BooliService);
	}
	
	$scope.itemClicked = function($listing) {
		$updateProfitInfoWindow($listing, $filter);
	}
	
	$scope.init = function () {
		$scope.keywords = 'Malmö Centrum, Centrum Malmö, Malmö';
		$scope.profits = [];
		$scope.data = [];
		$scope.nbr = 0;
		
		setUpAutoComplete($scope, $http, BooliService);	
		$scope.searchObjects();
	}	
});

function runProfitSearch($scope, $http, $filter, BooliService) {
	BooliService.getProfits($scope, $http).then(function(response){			
		
		var objects = response.data.sold;
		if (response.data.offset === 0) {
			$scope.totalCount = response.data.totalCount;
			$scope.profits = objects;		
			google.maps.event.addDomListener(window, 'load', $initializeProfitMap($scope, $filter));
		} else if (objects){
			$.each(objects, function(i, object) {
				$scope.profits.push(object);
			});
			$updateProfitMap($scope, $filter);
		}	
		$scope.nbr++;			
		
		if ($scope.totalCount - $scope.profits.length << 0 && $scope.profits.length < 2000) {
			$scope.searchObjects();				
		} else {
			$scope.nbr = 0;
		}	
		getData($scope);		
					
	}, function(error) {
		console.log(error);
	});
}

function getData($scope) {
	$scope.highest = $scope.profits.reduce(function(acc, curr) {
		return ((acc.soldPrice - acc.listPrice)/acc.listPrice) < ((curr.soldPrice - curr.listPrice)/curr.listPrice) ? curr : acc;
	});
	
	$scope.highestPrice = $scope.profits.reduce(function(acc, curr) {
		return acc.soldPrice < curr.soldPrice ? curr : acc;
	});	
	
	$scope.highestKvm = $scope.profits.reduce(function(acc, curr) {
		return acc.soldPrice/acc.livingArea < curr.soldPrice/curr.livingArea ? curr : acc;
	});			

	$scope.lowest = $scope.profits.reduce(function(acc, curr) {
		return (acc.soldPrice - acc.listPrice)/acc.listPrice < (curr.soldPrice - curr.listPrice)/curr.listPrice ? acc : curr;
	});
	
	$scope.lowestPrice = $scope.profits.reduce(function(acc, curr) {
		return acc.soldPrice < curr.soldPrice ? acc : curr;
	});
	
	$scope.lowestKvm = $scope.profits.reduce(function(acc, curr) {
		return acc.soldPrice/acc.livingArea < curr.soldPrice/curr.livingArea ? acc : curr;
	});		
		
}

function setUpAutoComplete($scope, BooliService) {
	var autocomplete = 	$("#autocomplete");
	autocomplete.autocomplete({
		delay: 0,
		minLength: 1,
		source: $getAreas($scope),
		focus: function(event, ui) {
			event.preventDefault();
		},
		select: function(event, ui) {
			$scope.keywords = ui.item.label;
			$scope.search();
		},
	});
	
	autocomplete.keypress(function(e) {
		if(e.keyCode == 13) {
			e.preventDefault();
			$scope.search();
			$(this).autocomplete('close');
		}
	});	
}