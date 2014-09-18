	angular.module('livingWebApp')
	.service('ProfitService', function ProfitService(){

		this.getPercent = function(objects, high) {
			return high ? getHigh(objects, getProcent) : getLow(objects, getProcent);
		}

		this.getPrice = function(objects, high) {
			objects = getKvmValues(objects);
			var object = high ? getHigh(objects, getSoldPrice) : getLow(objects, getSoldPrice);

			return {
					price: getKvmPrice(object),
					listing: object
			};
		}

		this.getKvmPrice = function (objects, high) {
			objects = getKvmValues(objects);
			var object = high ? getHigh(objects, getKvmPrice) : getLow(objects, getKvmPrice);

			return {
					price: getKvmPrice(object),
					listing: object
			};			
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
				var hasValues = getKvmValues(brokerObjects).length != 0;

				var highestKvmPriceObject = getHigh(brokerObjects, getKvmPrice);
				var lowestKvmPriceObject = getLow(brokerObjects, getKvmPrice);

				var highestKvmPrice = hasValues ? getKvmPrice(highestKvmPriceObject) : 0;
				var lowestKvmPrice = hasValues ? getKvmPrice(lowestKvmPriceObject) : 0;

				return {
					broker : 					broker,
					listings : 				brokerObjects,
					averageKvmPrice : hasValues ? getAverageKvmPrice(brokerObjects) : 0,
					medianKvmPrice : 	hasValues ? getMedianKvmPrice(brokerObjects) : 0,
					highestKvm : {
							price : 		hasValues ? highestKvmPrice : 0,
							listing: 		highestKvmPriceObject
					},
					lowestKvm : {
						price : hasValues ? lowestKvmPrice : 0,
						listing: lowestKvmPriceObject
					},
					variationKvmPrice : hasValues ? highestKvmPrice - lowestKvmPrice : 0
				}
			});

			return brokers;
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

		var getMedianKvmPrice = function(objects) {
			var objects = getKvmValues(objects).map(getKvmPrice).sort(orderBySize);

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

		var getHigh = function(objects, x) {
			return objects.reduce(function(acc, curr){
				return x(acc) < x(curr) ?  curr : acc;
			})
		}

		var getLow = function(objects, x) {
			return objects.reduce(function(acc, curr) {
				return x(acc) < x(curr) ? acc : curr;
			})
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
