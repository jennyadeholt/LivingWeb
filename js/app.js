
"use strict";

var App = angular.module('livingWebApp', [
	'ngRoute',
	'controllers',
	'animations',
	'filters',
	'services'
])
		
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


App.factory('db', function() {
  var listings = [];

  var modify = {};
  var modify.addListing = function(listing) {
    listings.push(listing);
  };  
  var modify.addListings = function(listings) {
    listings.push(listings);
  };
  var modify.deleteListings = function() {
    listings = [];
  };
  var modify.getListings = function() {
    return listings;
  }
  return modify; 
});




