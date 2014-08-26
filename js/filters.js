
var filters = angular.module('filters', []);

filters.filter('nfcurrency', [ '$filter', '$locale', function ($filter, $locale) {
	var currency = $filter('currency'), formats = $locale.NUMBER_FORMATS;
	return function (amount, symbol) {
		var value = currency(amount, symbol);
		if (isEmpty(value)) {
			value = "- kr";
		}
		return  value.replace(new RegExp('\\' + formats.DECIMAL_SEP + '\\d{2}'), ''); 
	}       
}]);


function isEmpty(str) {
	return (!str || 0 === str.length);
}
