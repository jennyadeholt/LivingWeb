
function ListController($scope, $http, $filter, $q, BooliService) {

	$scope.soldObjects = false;
	$scope.keywords = 'Malmö Centrum, Centrum Malmö, Malmö';
	
	setUpAutoComplete($scope, $http, BooliService);
	
	$scope.search = function(){
		BooliService.getListings($scope, $http, $filter);
	}
	
	$scope.search();
} 
	
function setUpAutoComplete($scope) {
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