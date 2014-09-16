angular.module('livingWebApp') 
.service('ProfitService', function ProfitService(){  
	
	var hasKvmValues = function(object){
		return hasValue(object.soldPrice) && hasValue(object.livingArea);
	}
	
	var hasValue = function(str) {
		return str && 0 != str.length && !isNaN(str);
	}

	var getKvm = function(object) {
		return object.soldPrice/object.livingArea;
	}

	var getDifference = function(object) {
		return object.soldPrice - object.listPrice
	}

	var getProcent = function(object) {
		return getDifference(object)/object.listPrice;
	}
	
	var roundNumber = function(number) { 
		return Math.round(number * Math.pow(10, 0)) / Math.pow(10, 0);
	}
	
	var getKvmValues = function(objects){
		return objects.filter(function(listing) {
			return hasKvmValues(listing);
		});
	}
	
	var getTypeValue = function(objects, divider){
		var numbers = Array.apply(null, {length: 100}).map(Number.call, Number);
		
		var result = numbers.map(function(number){
			return {
				number : number,
				data   : getKvmValues(objects).filter(function(object){
					return roundNumber(getKvm(object) / divider) == number;
				})
			};
		}).reduce(function(acc, curr){
			return curr.data.length < acc.data.length ? acc : curr;
		});
		
		
		
		return result;
	}
	
	this.getProcent = function(objects, high) {
		if (high) {
			return objects.reduce(function(acc, curr) {
				return getProcent(acc) < getProcent(curr) ?  curr : acc;
			});
		} else {
			return objects.reduce(function(acc, curr) {
				return getProcent(acc) < getProcent(curr) ? acc : curr;
			});
	
		}	
	}
	
	this.getPrice = function(objects, high) {
		if (high) {
			return objects.reduce(function(acc, curr) {
				return acc.soldPrice < curr.soldPrice ? curr : acc;
			});	
		} else {
			return objects.reduce(function(acc, curr) {
				return acc.soldPrice < curr.soldPrice ? acc : curr;
			});
		}
	}
	
	this.getKvm = function (objects, high) {
		if (high) {
		return getKvmValues(objects).reduce(function(acc, curr) {
			return getKvm(acc) < getKvm(curr) ? curr : acc;
		});		
		} else {
			return getKvmValues(objects).reduce(function(acc, curr) {
				return getKvm(acc) < getKvm(curr) ? acc : curr;
			});		
		}	
	}	
	
	
	this.getKvmPrice = function (objects) {
		var nbr = 0;
		var total = getKvmValues(objects).map(function(object) {
			nbr++;
			return getKvm(object);
		}).reduce(function(acc, curr) {
			return curr + acc;
		});
		
		return total/nbr;	
	}
	
	this.getMedianKvm = function(objects) {
		var objects = getKvmValues(objects).map(function(object) {
			return getKvm(object);
		}).sort(function(x, y){ 
			return x < y ? 1 : -1;
		});
		
		if (objects.length % 2 == 0) {
			return objects[objects.length / 2];
		} else {
			var i = objects.length / 2 + 0.5;
			return  (objects[i] + objects[i - 1]) / 2;
		}
	}
	
	this.getTypeValue = function(objects) {
		var result = getTypeValue(objects, 1000);
		return this.getKvmPrice(result.data);
	}
	
	
});


	
