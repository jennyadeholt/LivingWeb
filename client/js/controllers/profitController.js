
angular.module('livingWebApp')
.controller('ProfitCtrl', function ProfitController($scope, $http, $filter, $q, BooliService, ProfitService, KeywordService, DateService) {

	function updateProfits() {
		if ($scope.profits) {

			ProfitService.storeProfits($scope.profits);

			$scope.brokers = ProfitService.getBrokers($scope.profits);

			$scope.highestPrice = ProfitService.getPrice($scope.profits, true);
			$scope.lowestPrice = ProfitService.getPrice($scope.profits, false);
			$scope.highestKvm = ProfitService.getKvmPrice($scope.profits, true);
			$scope.lowestKvm = ProfitService.getKvmPrice($scope.profits, false);
			$scope.averageKvmPrice = ProfitService.getAverageKvmPrice($scope.profits);
			$scope.medianKvm = ProfitService.getMedianKvmPrice($scope.profits);
			$scope.typeValue = ProfitService.getTypeValueKvmPrice($scope.profits);

			$scope.startDate = DateService.getDate(ProfitService.getDate($scope.profits, false));
			$scope.endDate = DateService.getDate(ProfitService.getDate($scope.profits, true));
		}
	};

	$scope.searchObjects = function() {
		$scope.filterStartDate = DateService.getSearchDate(DateService.getStartDate());
		$scope.filterEndDate = DateService.getSearchDate(DateService.getEndDate());

		document.getElementById("result").style.visibility = "visible";

		KeywordService.storeKeywords($scope.keywords);

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

			if ($scope.totalCount - $scope.profits.length << 0 && $scope.profits.length < 3000) {
				$scope.searchObjects();
			} else {
				$scope.nbr = 0;
			}

			updateProfits();

		}, function(error) {
			console.log(error);
		});
	}

	$scope.itemClicked = function(listing) {
		$updateProfitInfoWindow(listing, $filter);
	}


	$scope.init = function () {
		var keywords = KeywordService.getKeywordsOrNull();
		if (keywords) {
			$scope.keywords = keywords;
			$scope.searchWords = keywords;
		}

		$scope.profits = [];
		ProfitService.storeProfits($scope.profits);

		$scope.data = [];
		$scope.nbr = 0;
		$scope.orderProp = '-highestKvm.price';

		document.getElementById("result").style.visibility = "hidden";

		if ($scope.keywords) {
				$scope.searchObjects();
		}
	}
});
