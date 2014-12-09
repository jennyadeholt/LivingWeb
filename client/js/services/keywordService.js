
angular.module('livingWebApp')
.service('KeywordService',function KeywordService(){

	this.getKeywords = function() {
		return localStorage['search'] || 'Gata, ort eller kommun' ;
	}

	this.getKeywordsOrNull = function(){
		return localStorage['search'] || '' ;
	};

	this.storeKeywords  = function(keywords) {
		localStorage['search'] = keywords;
	}
});
