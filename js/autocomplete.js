
function setUpAutoComplete($scope, $http) {
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
			$getListings($scope, $http);
		},
	});
	
	autocomplete.keypress(function(e) {
		if(e.keyCode == 13) {
			e.preventDefault();
			$getListings($scope, $http);
			$(this).autocomplete('close');
		}
	});	
}