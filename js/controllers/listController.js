
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
			
			var objects = $scope.soldObjects ? response.data.sold : response.data.listings;
			
			if (response.data.offset === 0) {
				$scope.totalCount = response.data.totalCount;
				$scope.listings = objects;
				$scope.currentPage = 0;
				google.maps.event.addDomListener(window, 'load', $initializeListMap($scope, $filter));
			} else {
				$.each(objects, function(i, object) {
					$scope.listings.push(object);
				});
			}	
			$scope.nbr++;			
			
			if ($scope.totalCount - $scope.listings.length << 0) {
				$scope.search();				
			} else {
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
	$scope.listItemClicked = function($listing) {
		$updateInfoWindow($listing, $filter);
	}
	
	$scope.newSearchOrder = function() {
		if (sortOrder != $scope.orderProp ) {
			$scope.currentPage = 0;
			sortOrder = $scope.orderProp;
			$updateListMap($scope, $filter);
		}
	}
} 

function pageListings($scope, $filter, next) {
	$scope.currentPage = $scope.currentPage + (next ? 1 : -1);
	$updateListMap($scope, $filter);
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