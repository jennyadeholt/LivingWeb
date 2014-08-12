
"use strict";
var App = angular.module("LivingWeb",[]);

App.controller("ExmpCtrl",function ($scope, $http) {	
	$getResult($scope, $http);
	
    $scope.openUrl = function(url){
       window.open(url), "_blank";
     };	
});
