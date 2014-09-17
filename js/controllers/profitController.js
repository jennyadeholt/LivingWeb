
angular.module('livingWebApp') 
.controller('ProfitCtrl', function ProfitController($scope, $http, $filter, $q, BooliService, ProfitService) {
	
	$scope.searchObjects = function(){
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
			
			if ($scope.profits) {
				$scope.highest = ProfitService.getProcent($scope.profits, true);
				$scope.lowest = ProfitService.getProcent($scope.profits, false);
				$scope.highestPrice = ProfitService.getPrice($scope.profits, true);
				$scope.lowestPrice = ProfitService.getPrice($scope.profits, false);
				$scope.highestKvm = ProfitService.getKvmPrice($scope.profits, true);
				$scope.lowestKvm = ProfitService.getKvmPrice($scope.profits, false);
				$scope.kvmPrice = ProfitService.getAverageKvmPrice($scope.profits);
				$scope.medianKvm = ProfitService.getMedianKvmPrice($scope.profits);
				$scope.typeValue = ProfitService.getTypeValueKvmPrice($scope.profits);
			}		
					
		}, function(error) {
			console.log(error);
		});
	}
	
	$scope.itemClicked = function($listing) {
		$updateProfitInfoWindow($listing, $filter);
	}
	
	$scope.setUpAutoComplete = function($scope, BooliService) {
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
				$scope.searchObjects();
			},
		});
	
		autocomplete.keypress(function(e) {
			if(e.keyCode == 13) {
				e.preventDefault();
				$scope.searchObjects();
				$(this).autocomplete('close');
			}
		});	
	}
	
	$scope.init = function () {
		$scope.keywords = 'Davidshall, Malmö';
		$scope.profits = [];
		$scope.data = [];
		$scope.nbr = 0;
		
		$scope.setUpAutoComplete($scope, $http, BooliService);	
		$scope.searchObjects();
	}		
});



