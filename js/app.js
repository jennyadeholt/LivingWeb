/*!
** Example App
** Licensed under the Apache License v2.0
** http://www.apache.org/licenses/LICENSE-2.0
** Built by Jay Kanakiya ( @techiejayk )
**/

"use strict";

var App = angular.module("example",[]);

App.controller("ExmpCtrl",function  ($scope, $window) {
($window.mockWindow || $window).alert('Hello');
});

function imageCtrl($scope, $window) {
	$scope.fetchImages = function () {
		var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
		$.getJSON( flickerAPI, {
			tags: "mount rainier",
			tagmode: "any",
			format: "json"
		})
		.done(function( data ) {
			$scope.images = data.items;
		});
	};
}

function booliCtrl($scope, $window) {
	$scope.fetchData = function () {
		$getResult($scope);
		($window.mockWindow || $window).alert('Hello');
	};
}