
"use strict";

var App = angular.module('livingWebApp', [
  'ngRoute',
  'controllers',
  'animations'
])


App.filter('nfcurrency', [ '$filter', '$locale', function ($filter, $locale) {
        var currency = $filter('currency'), formats = $locale.NUMBER_FORMATS;
        return function (amount, symbol) {
            var value = currency(amount, symbol);
			return  value.replace(new RegExp('\\' + formats.DECIMAL_SEP + '\\d{2}'), ''); 
        }       
    }]); 
		
App.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/bostad', {
        templateUrl: 'partials/object-list.html',
        controller: 'ListCtrl'
      }).
      when('/bostad/:booliId', {
        templateUrl: 'partials/object-detail.html',
        controller: 'DetailCtrl'
      }).
      otherwise({
        redirectTo: '/bostad'
      });
  }]);
