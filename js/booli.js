

var $getResult = function($scope, $http) {
	
	var booliAPI = "api.booli.se//listings?q=malmö&";
	
	$http({ 
		method: 'GET', 
		url: 'http://www.corsproxy.com/' + booliAPI + $auth(),  
		params : { format: "json" }, 
		headers: {'Accept': 'application/json' }
	}).success(function(data, status, headers, config) {
		$scope.listings =  data.listings;
		$.each($scope.listings, function(i, item) {
			var temp = "http://api.bcdn.se/cache/primary_" + item.booliId +"_140x94.jpg";
			item.imageUrl = temp;
		})
		
		$scope.orderProp = '-published';
		
	}).error(function(data, status, headers, config) {
		
	});
}	

var $auth = function() {
	var callerId = "EasyLiving";
	var time = $time();
	var privateKey = "fN9u8gmUFMvXCgNS8SAWkE96535Ttul5lNzpWeP2";
	var unique = Math.random().toString(36).slice(2);
	var hash = sha1(callerId + time + privateKey + unique);
 
	console.log(hash);	
	return "callerId=" + callerId + "&time=" + time + "&unique=" + unique + "&hash=" + hash;
};


var $time = Date.now || function() {
	return +new Date;
};

var $uniquehashCode = function() {
	var hash = 0, i, chr, len;
	if (this.length == 0) return hash;
	for (i = 0, len = this.length; i < len; i++) {
		chr   = this.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};