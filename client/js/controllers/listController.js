
angular.module('livingWebApp')
.controller('ListCtrl', function ListController($scope, $http, $filter, $q, BooliService) {

	$scope.numberOfPages = function(){
		return Math.ceil($scope.totalCount/$scope.pageSize);
	}

	$scope.search = function(){
		runSearch($scope, $http, $filter, BooliService);
	}

	$scope.updateSoldStatus = function() {
		$scope.currentPage = 0;
		$scope.options = getOptions($scope);
		$scope.orderProp = $scope.options[0].value;
		$scope.search();
	}

	$scope.previousPage = function() {
		pageListings($scope, $filter, false);
	}
	$scope.nextPage = function(){
		pageListings($scope, $filter, true);

	};
	$scope.itemClicked = function($listing) {
		$updateInfoWindow($listing, $filter);
	}

	$scope.newSearchOrder = function() {
		$scope.currentPage = 0;
		$updateListMap($scope, $filter);
	}

	$scope.getPagination = function() {
		return $scope.currentPage * $scope.pageSize;
	}

	$scope.getView = function(listing) {
		var temp = isEmpty(listing.soldPrice) ? 'listing' : 'sold';
		return "templates/" + temp + ".html";
	}

	$scope.getListView = function() {
		return "templates/objectList.html";
	}

	$scope.init = function () {
		$scope.soldObjects = false;
		$scope.keywords = 'Lund, Lund';
		$scope.currentPage = 0;
		$scope.pageSize = 25;
		$scope.count = 0;
		$scope.listings = [];
		$scope.data = [];
		$scope.nbr = 0;
		$scope.totalCount = 0;

		$scope.options = getOptions($scope);
		$scope.orderProp = $scope.options[0].value;

		setUpAutoComplete($scope, $http, BooliService);
		$scope.search();
	}
});

function runSearch($scope, $http, $filter, BooliService) {
	BooliService.getListings($scope, $http).then(function(response){

		var objects = $scope.soldObjects ? response.data.sold : response.data.listings;

		if (response.data.offset === 0) {
			$scope.totalCount = response.data.totalCount;
			$scope.listings = objects;
			$scope.currentPage = 0;
			google.maps.event.addDomListener(window, 'load', $initializeListMap($scope, $filter));
		} else if (objects){
			$.each(objects, function(i, object) {
				$scope.listings.push(object);
			});
		}
		$scope.nbr++;

		if ($scope.totalCount - $scope.listings.length << 0) {
			//$scope.search();
		} else {
			$scope.nbr = 0;
		}
	}, function(error) {
		console.log(error);
	});
}


function pageListings($scope, $filter, next) {
	$scope.currentPage = $scope.currentPage + (next ? 1 : -1);
	$updateListMap($scope, $filter);
}

function getOptions($scope){
	if ($scope.soldObjects) {
		return [
		{'name': 'Senast såld',  'value' : '-soldDate'},
		{'name': 'Störst vinst',  'value' : '(listPrice-soldPrice)/listPrice'},
		{'name': 'Lägst vinst',  'value' : '(soldPrice-listPrice)/listPrice'},
		{'name': 'A-Ö', 'value' : 'location.address.streetAddress'},
		{'name': 'Pris - stigande',  'value' : 'listPrice'},
		{'name': 'Pris - fallande',  'value' : '-listPrice'}
		];
	} else {
		return  [
		{'name': 'Senast publicerad',  'value' : '-published'},
		{'name': 'Längst på Booli',  'value' : 'published'},
		{'name': 'A-Ö', 'value' : 'location.address.streetAddress'},
		{'name': 'Pris - stigande',  'value' : 'listPrice'},
		{'name': 'Pris - fallande',  'value' : '-listPrice'}
		];
	}
}

function setUpAutoComplete($scope, $http, BooliService) {
	var autocomplete = 	$("#autocomplete");
	autocomplete.autocomplete({
		delay: 0,
		minLength: 1,
		source: $getAreas($scope, $http),
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
