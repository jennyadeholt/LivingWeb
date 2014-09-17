angular.module('livingWebApp')
.service('ProfitService', function ProfitService(){

	this.getPercent = function(objects, high) {
		return objects.reduce(high ? getHigh(getProcent) : getLow(getProcent));
	}

	this.getPrice = function(objects, high) {
		return getKvmValues(objects).reduce(high ? getHigh(getSoldPrice) : getLow(getSoldPrice));
	}

	this.getKvmPrice = function (objects, high) {
		return getKvmValues(objects).reduce(high ? getHigh(getKvmPrice) : getLow(getKvmPrice));
	}

	this.getAverageKvmPrice = function (objects) {
		return getAverageKvmPrice(objects);
	}

	this.getMedianKvmPrice = function(objects) {
		return getMedianKvmPrice(objects);
	}

	this.getTypeValueKvmPrice = function(objects) {
		return getTypeValueForKvmPrice(objects);
	}

	this.getBrokers = function(objects) {
		var brokers = objects.map(function(listing){
			return listing.source.name;
		}).reduce(function(a , b){
			if (a.indexOf(b) < 0 ) {
				a.push(b);
			}
			return a;
		},[]).map(function(broker){
			var brokerObjects = getBrokerObjects(objects, broker);
			var highestKvmPrice = getKvmPrice(brokerObjects.reduce(getHigh(getKvmPrice)));
			var lowestKvmPrice = getKvmPrice(brokerObjects.reduce(getLow(getKvmPrice)));
			return {
				broker : broker,
				listings : brokerObjects,
				averageKvmPrice : getAverageKvmPrice(brokerObjects),
				medianKvmPrice : getMedianKvmPrice(brokerObjects),
				highestKvmPrice : highestKvmPrice,
				lowestKvmPrice : lowestKvmPrice,
				variationKvmPrice : highestKvmPrice - lowestKvmPrice
			}
		})

		return brokers.sort(function(x, y) {
			return x.listings.length < y.listings.length ? 1 : -1;
		});
	}

	var getBrokerObjects = function(objects, broker){
		return objects.filter(function(listing) {
			return listing.source.name == broker;
		});
	}

	var getTypeValueForKvmPrice = function(objects){
		var numbers = Array.apply(null, {length: 100}).map(Number.call, Number);

		var result = numbers.map(function(number){
			return {
				number : number,
				data   : getKvmValues(objects).map(getKvmPrice).filter(function(object){
					return roundNumber(object / 1000) == number;
				})
			};
		}).reduce(getLength);

		result = numbers.map(function(number){
			return {
				number : number,
				data   : result.data.filter(function(item){
					return roundNumber((item - roundNumber(item / 1000) * 1000) / 100) == number;
				})
			};
		}).reduce(getLength);

		return result.data.reduce(getSum) / result.data.length;
	}

	var getMedianKvmPrice = function(objects) { 	var objects =
	getKvmValues(objects).map(getKvmPrice).sort(orderBySize);

		if (objects.length == 1) {
			return objects[0];
		} else if (objects.length % 2 == 0) {
			return objects[objects.length / 2];
		} else {
			var i = objects.length / 2 + 0.5;
			return  (objects[i] + objects[i - 1]) / 2;
		}
	}

	var getAverageKvmPrice = function(objects) {
		var result = getKvmValues(objects);
		return result.map(getKvmPrice).reduce(getSum, []) / result.length;
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

	var getKvmValues = function(objects){
		return objects.filter(function(listing) {
			return hasKvmPrice(listing);
		});
	}

	var hasKvmPrice = function(object){
		return hasValue(getSoldPrice(object)) && hasValue(getLivingArea(object));
	}

	var getSum = function(acc, curr) {
		return (+acc) + (+curr);
	}

	var getLength = function(acc, curr){
		return curr.data.length < acc.data.length ? acc : curr;
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
