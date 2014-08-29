
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

filters.filter('kvm', function() {
	return function(input) {
		return isEmpty(input) ? '- kvm' : input + ' kvm';
	};
});

filters.filter('room', function() {
	return function(input) {
		return isEmpty(input) ? '- rum' : input + ' rum';
	};
});

filters.filter('pagination', function () {
	return function (input, offset) {
		return (input instanceof Array) ? input.slice(offset) : input;
	}
});


function isEmpty(str) {
	return (!str || 0 === str.length);
}
