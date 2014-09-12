
"use strict";

var App = angular.module('livingWebApp', [
'ngRoute',
//'controllers',
'animations',
'filters',
'services'
])
		
App.config(['$routeProvider',
function($routeProvider) {
	$routeProvider.
	when('/', {
		templateUrl: 'partials/object-list.html',
		controller: 'ListCtrl'
	}).
	when('/bostad', {
		templateUrl: 'partials/object-list.html',
		controller: 'ListCtrl'
	}).
	when('/profit', {
		templateUrl: 'partials/profit-list.html',
		controller: 'ProfitCtrl'
	}).
	when('/bostad/:booliId', {
		templateUrl: 'partials/object-detail.html',
		controller: 'DetailCtrl'
	}).
	otherwise({
		redirectTo: '/'
	});
}]);



