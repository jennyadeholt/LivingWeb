
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

App.directive('contentItem', function ($compile) {
	//var listingTemplate = '<div><img src="http://api.bcdn.se/cache/primary_{{content.booliId}}_140x94.jpg" id="listItemImage" />	<div>		<a href="#/bostad/{{content.booliId}}">			<p id="listItemTitle">{{content.location.address.streetAddress}}</p>		</a>		<p id="listItemDate">{{content.published | date }} </p>	</div>	<div id="listItemInfo">		{{content.location.namedAreas[0]}} <br>		{{content.listPrice | nfcurrency }} <br>		{{content.livingArea | kvm }},  {{content.rooms | room}} 			</div> </div>';
	//var soldTemplate = '<div>	<img src="http://api.bcdn.se/cache/primary_{{content.booliId}}_140x94.jpg" id="listItemImage" />	<div>		<a href="#/bostad/{{content.booliId}}">			<p id="listItemTitle">{{content.location.address.streetAddress}}</p>		</a>		<p id="listItemDate">{{content.published | date }} </p>	</div>	<div id="listItemInfo">		{{content.location.namedAreas[0]}} <br>		{{content.listPrice | nfcurrency }} - {{content.soldPrice | nfcurrency }} <br>		{{content.livingArea | kvm }},  {{content.rooms | room}} 		</div></div>';
	
	
	
	var getTemplate = function(content) {
		var template = '';
		
		var sold = content.soldPrice;
		if (!sold || 0 === sold.length) {
			template = 'templates/listing.html';
		} else {
			template = 'templates/sold.html';
		}

		return template;
	}
	
	var directive = {};

	directive.restrict = 'E'; 
	directive.scope = { content: '='}

	directive.link = function(scope, element, attributes) {
		element.load(getTemplate(scope.content));
		$compile(element.contents())(scope);
	}

	return directive;
});





