
"use strict";

var App = angular.module('livingWebApp', [
  'ngRoute',
  'controllers',
  'animations'
]);

App.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/bostad', {
        templateUrl: 'partials/phone-list.html',
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
