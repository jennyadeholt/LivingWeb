
var filters = angular.module('filters', []);

filters.filter('nfcurrency', ['$filter', '$locale', function ($filter, $locale) {
	var currency = $filter('currency'), formats = $locale.NUMBER_FORMATS;
	return function (amount, symbol) {
		var value = currency(amount, symbol);
		if (isEmpty(value)) {
			return "";
		}
		return  value.replace(new RegExp('\\' + formats.DECIMAL_SEP + '\\d{2}'), '');
	}
}]);

filters.filter('published', function($filter, $locale) {
	return function(input) {
		if (isEmpty(input)) {
			return "";
		}
		var date = moment(input).toDate();
		var _date = $filter('date')(date, 'd MMMM y'), formats = $locale.DATETIME_FORMATS;
		return _date;
	};
});

filters.filter('searchDate', function($filter, $locale) {
	return function(input) {
		if (isEmpty(input)) {
			return "";
		}
		var date = moment(input).toDate();
		var _date = $filter('date')(date, 'yyyyMMdd'), formats = $locale.DATETIME_FORMATS;
		return _date;
	};
});

filters.filter('kvm', function() {
	return function(input) {
		return setString(input, ' kvm');
	};
});

filters.filter('procent', function($filter) {
	return function(input) {
		return setString($filter('number')(input * 100, 2), '%');
	};
});

filters.filter('room', function() {
	return function(input) {
		return setString(input, ' rum');
	};
});

filters.filter('pagination', function () {
	return function (input, offset) {
		return (input instanceof Array) ? input.slice(offset) : input;
	}
});

filters.filter('kvmprice', function($filter) {
	return function(input) {
		return setString($filter('number')(input, 0), ' kr/m²');
	};
});

function setString(input, text) {
	return isEmpty(input) ? '' : input + text;
}
