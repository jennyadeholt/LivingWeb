angular.module('livingWebApp') 
.service('ProfitService', function ProfitService(){  
	
	this.getProcent = function(objects, high) {
		return objects.reduce(high ? getHigh(getProcent) : getLow(getProcent));
	}
	
	this.getPrice = function(objects, high) {
		return getKvmValues(objects).reduce(high ? getHigh(getSoldPrice) : getLow(getSoldPrice));		
	}
	
	this.getKvmPrice = function (objects, high) {
		return getKvmValues(objects).reduce(high ? getHigh(getKvmPrice) : getLow(getKvmPrice));
	}	
		
	this.getAverageKvmPrice = function (objects) {
		var result = getKvmValues(objects);
		var count = result.length;		
		return result.map(getKvmPrice).reduce(getSum) / count;
	}
	
	this.getMedianKvmPrice = function(objects) {
		var objects = getKvmValues(objects).map(getKvmPrice).sort(orderBySize);
		
		if (objects.length % 2 == 0) {
			return objects[objects.length / 2];
		} else {
			var i = objects.length / 2 + 0.5;
			return  (objects[i] + objects[i - 1]) / 2;
		}
	}
	
	this.getTypeValueKvmPrice = function(objects) {
		return this.getAverageKvmPrice(getTypeValue(objects, 1000).data);
	}	
	
	
	var getHigh = function(x) {
		return function(acc, curr) {
			return x(acc) < x(curr) ?  curr : acc;
		}
	}
	
	var getLow = function(x) {
		return function(acc, curr) {
			return x(acc) < x(curr) ? acc : curr;
		}
	}
	
	var getTypeValue = function(objects, divider){
		var numbers = Array.apply(null, {length: 100}).map(Number.call, Number);
		
		var result = numbers.map(function(number){
			return {
				number : number,
				data   : getKvmValues(objects).filter(function(object){
					return roundNumber(getKvmPrice(object) / divider) == number;
				})
			};
		}).reduce(function(acc, curr){
			return curr.data.length < acc.data.length ? acc : curr;
		});
		
		result = numbers.map(function(number){
			return {
				number : number, 
				data   : result.data.filter(function(item){
					var n = getKvmPrice(item);
					return  roundNumber((n - roundNumber(n / 1000) * 1000)/100) == number;
				})
			};
		}).reduce(function(acc, curr) {
			return curr.data.length < acc.data.length ? acc : curr;
		});
		
		
		return result;
	}
	
	var getKvmValues = function(objects){
		return objects.filter(function(listing) {
			return hasKvmPrice(listing);
		});
	}
	
	var hasKvmPrice = function(object){
		return hasValue(getSoldPrice(object)) && hasValue(getLivingArea(object));
	}
	
	var getSum = function(acc, curr) {
		return curr + acc;
	}
	
	var orderBySize = function(x, y) { 
		return x < y ? 1 : -1;
	}
	
	var hasValue = function(str) {
		return str && 0 != str.length && !isNaN(str);
	}

	var getDifference = function(object) {
		return getSoldPrice(object) - getListPrice(object);
	}

	var getProcent = function(object) {
		return getDifference(object) / getListPrice(object);
	}
	
	var roundNumber = function(number) { 
		return parseInt(number);
	}
	
	var getKvmPrice = function(object) {
		return getSoldPrice(object) / getLivingArea(object);
	}
	
	var getSoldPrice = function(object) {
		return object.soldPrice;
	}
	
	var getListPrice = function(object) {
		return object.listPrice;
	}
	
	var getLivingArea = function(object) {
		return object.livingArea;
	}
	
});


	
