
angular.module('livingWebApp').directive('autocomplete', function($http, BooliService) {
  return function (scope, element, attrs) {
    element.autocomplete({
      delay: 0,
      minLength: 1,
      source: BooliService.getAreas(scope, $http),
      focus:function (event, ui) {
        event.preventDefault();

      },
      select:function (event, ui) {
        scope.keywords = ui.item.label;
        scope.searchWords = ui.item.label;
      },
      change:function (event, ui) {
        if (ui.item === null) {
          //scope.myModelId.selected = null;
        }
      }
    }).keypress(function(e) {
      if(e.keyCode == 13) {
        e.preventDefault();
        $(this).autocomplete('close');
      }
    });
  }
});
