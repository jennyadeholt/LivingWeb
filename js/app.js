
"use strict";
var App = angular.module("example",[]);

App.controller("ExmpCtrl",function ($scope, $http) {

	$scope.todos = [
	{ taskName : "Write an Angular js Tutorial for Todo-List" , isDone : false },
	{ taskName : "Update jquer.in" , isDone : false },
	{ taskName : "Create a brand-new Resume" , isDone : false }
	];
	
	
	$getResult($scope, $http);
	
	$http({method: 'GET', 
	url: 'http://www.corsproxy.com/api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?',  
	params : { tags: "mount rainier", tagmode: "any", format: "json" }, 
	headers: {'Accept': 'application/json'} }).
	success(function(data, status, headers, config) {
		$scope.images =  data.items;
	}).
	error(function(data, status, headers, config) {
		
	});
	
});
