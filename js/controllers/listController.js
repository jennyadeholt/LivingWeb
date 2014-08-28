
var sortOrder = '-published';

function ListController($scope, $http, $filter, $q, BooliService) {

	$scope.soldObjects = false;
	$scope.keywords = 'Lund, Lund';
	
	$scope.currentPage = 0;
	$scope.pageSize = 25;
	$scope.count = 0;
	$scope.listings = [];
	$scope.data = [];
	$scope.nbr = 0;
	$scope.totalCount = 0;
		
	$scope.numberOfPages = function(){
		return Math.ceil($scope.totalCount/$scope.pageSize);                
	}
		
	setUpAutoComplete($scope, $http, BooliService);
	$scope.orderProp = sortOrder;
	
	$scope.search = function(){
		BooliService.getListings($scope, $http).then(function(response){			
			if (response.data.offset === 0) {
				$scope.data = $scope.soldObjects ? response.data.sold : response.data.listings;
				$scope.currentPage = 0;
				showListings($scope, $filter);
			} else {
				$scope.data.push($scope.soldObjects ? response.data.sold : response.data.listings);
			}
			$scope.count = $scope.count + response.data.count;
			$scope.nbr++;			
			$scope.totalCount = response.data.totalCount;
			
			if ($scope.totalCount - $scope.count << 0) {
				$scope.search();				
			} else {
				$scope.count = 0;
				$scope.nbr = 0;
			}
		}, function(response) {
			
		});
	}
	
	$scope.search();
	
	$scope.previousPage = function() {
		pageListings($scope, $filter, false);		
	}
	
	$scope.nextPage = function(){
		pageListings($scope, $filter, true);
		
	};	
	
	$scope.mySortFunction = function(item) {
		console.log($scope.orderProp);
		$scope.data = $filter('orderBy')($scope.data, $scope.orderProp);
		return item[$scope.sortExpression];	
	}
} 

function pageListings($scope, $filter, next) {
	$scope.currentPage = $scope.currentPage + (next ? 1 : -1);
	showListings($scope, $filter);	
}

function showListings($scope, $filter) {
	console.log("showListings " + $scope.data.length);
	
	$scope.data = $filter('orderBy')($scope.data, $scope.orderProp);
	
	var offset = $scope.currentPage === 0 ? 0 : $scope.currentPage * $scope.pageSize;	
	var objects = $scope.data;

	$scope.listings = objects.slice(offset, offset + $scope.pageSize);

	google.maps.event.addDomListener(window, 'load', $initializeListMap($scope.listings, $filter));

	$.each($scope.listings, function(i, item) {
		item.imageUrl = $getImageUrl(item.booliId);
	});

	return $scope.listings;
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