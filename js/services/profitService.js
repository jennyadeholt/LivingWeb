angular.module('livingWebApp') 
.service('ProfitService', function ProfitService(){  
	
	this.getHighest = function ($scope) {
		return $scope.profits.reduce(function(acc, curr) {
			return ((acc.soldPrice - acc.listPrice)/acc.listPrice) < ((curr.soldPrice - curr.listPrice)/curr.listPrice) ? curr : acc;
		});
	}
	
	this.getHighestPrice = function ($scope) {
		return $scope.profits.reduce(function(acc, curr) {
			return acc.soldPrice < curr.soldPrice ? curr : acc;
		});	
	}
	
	this.getHighestKvm = function ($scope) {
		return $scope.profits.reduce(function(acc, curr) {
			return acc.soldPrice/acc.livingArea < curr.soldPrice/curr.livingArea ? curr : acc;
		});			
	}

	this.getLowest = function ($scope) {
		return $scope.profits.reduce(function(acc, curr) {
			return (acc.soldPrice - acc.listPrice)/acc.listPrice < (curr.soldPrice - curr.listPrice)/curr.listPrice ? acc : curr;
		});
	}
	
	this.getLowestPrice = function ($scope) {
		return $scope.profits.reduce(function(acc, curr) {
			return acc.soldPrice < curr.soldPrice ? acc : curr;
		});
	}
	
	this.getLowestKvm = function ($scope) {
		return $scope.profits.reduce(function(acc, curr) {
			return acc.soldPrice/acc.livingArea < curr.soldPrice/curr.livingArea ? acc : curr;
		});		
	}
});
	
