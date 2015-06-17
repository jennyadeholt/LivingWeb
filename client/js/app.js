"use strict";

var App = angular.module('livingWebApp', [
    'ngRoute',
    'filters',
    'ui.date'
])

App.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'partials/profit-list.html',
                controller: 'ProfitCtrl'
            }).
            when('/bostad', {
                templateUrl: 'partials/object-list.html',
                controller: 'ListCtrl'
            }).
            when('/chart', {
                templateUrl: 'partials/chart.html',
                controller: 'ChartCtrl'
            }).
            when('/bostad/:booliId', {
                templateUrl: 'partials/object-detail.html',
                controller: 'DetailCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);
