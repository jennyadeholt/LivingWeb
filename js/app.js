
"use strict";

var App = angular.module('livingWebApp', [
  'ngRoute',
  'phonecatControllers'
]);

App.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/bostad', {
        templateUrl: 'partials/phone-list.html',
        controller: 'PhoneListCtrl'
      }).
      when('/bostad/:booliId', {
        templateUrl: 'partials/object-detail.html',
        controller: 'PhoneDetailCtrl'
      }).
      otherwise({
        redirectTo: '/bostad'
      });
  }]);
