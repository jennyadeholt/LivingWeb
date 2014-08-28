
function ListController($scope, $http, $filter, $q, BooliService) {

	$scope.soldObjects = false;
	$scope.keywords = 'Malmö Centrum, Centrum Malmö, Malmö';
	
    $scope.currentPage = 0;
    $scope.pageSize = 25;
    $scope.listings = [];
	$scope.totalCount = 0;
    $scope.numberOfPages = function(){
		console.log("numberOfPages " + $scope.totalCount);
        return Math.ceil($scope.totalCount/$scope.pageSize);                
    }
		
	setUpAutoComplete($scope, $http, BooliService);
	
	$scope.search = function(){
		BooliService.getListings($scope, $http, $filter);
	}
	
	$scope.search();
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