
var profits = [];


	angular.module('livingWebApp')
	.service('ProfitService', function ProfitService(DateService, $filter){

		this.getProfits = function() {
			return profits;
		}

		this.storeProfits = function(profits) {
			this.profits = profits;
			localStorage.profits = profits;
		}

		this.getPercent = function(objects, high) {
			return high ? getHigh(objects, getProcent) : getLow(objects, getProcent);
		}

		this.getProcent = function(object) {
			return getProcent(object);
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

		this.getDate = function (objects, high) {
			var object = high ? getHigh(objects, getDate) : getLow(objects, getDate);

			return {
				date: object.soldDate,
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

		this.getAveragePerMonths2 = function(objects) {
			var average = parseInt(getAverageKvmPrice(objects), 10);

			var dates = objects.map(function(listing){
				return DateService.getMonthAndYear(listing.soldDate);
			}).reduce(function(a , b){
				if (a.indexOf(b) < 0 ) {
					a.push(b);
				}
				return a;
			},[]).map(function(month){
				var monthObjects = getMonthObjects(objects, month);
				var averagePerMonth = parseInt(getAverageKvmPrice(monthObjects), 10);
				var type = parseInt(getTypeValueForKvmPrice(monthObjects), 10);

				return [month, averagePerMonth, type, average];

			});

			dates.push(["Månad", "Medelvärde", "Typvärde", "Tot. medelvärde"]);

			return dates.reverse();
		}

		this.getAveragePerMonths = function(objects){
			objects = getKvmValues(objects);
			var average = parseInt(getAverageKvmPrice(objects), 10);

			var prices = objects.reduce(function(acc, listing) {
				var key =  DateService.getMonthAndYear(listing.soldDate);
				if (acc[key]) {
					acc[key].price += getKvmPrice(listing);
					acc[key].total++;
				} else {
					acc[key] = {};
					acc[key].price = getKvmPrice(listing);
					acc[key].total = 1;
				}
				return acc;
			}, { });

			var result = [];

			for (var key in prices) {
				if (prices.hasOwnProperty(key)) {
					var price = prices[key];
					result.push([key, parseInt(price.price / price.total, 10), 0,  average]);
				}
			}

			result.push(["Månad", "Medelvärde", "", ""]);

			return result.reverse();
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

				var typeValue = hasValues ?  getTypeValueForKvmPrice(brokerObjects) : 0;

				return {
					broker : 					broker,
					listings : 				brokerObjects,
					averageKvmPrice : hasValues ? getAverageKvmPrice(brokerObjects) : 0,
					medianKvmPrice : 	hasValues ? getMedianKvmPrice(brokerObjects) : 0,
					highestKvm : {
							price : 		highestKvmPrice,
							listing: 		highestKvmPriceObject
					},
					lowestKvm : {
						price : lowestKvmPrice,
						listing: lowestKvmPriceObject
					},
					variationKvmPrice : hasValues ? highestKvmPrice - lowestKvmPrice : 0,
					typeValue : typeValue
				}
			});

			return brokers;
		}

		var getBrokerObjects = function(objects, broker){
			return objects.filter(function(listing) {
				return listing.source.name == broker;
			});
		}

		var getMonthObjects = function(objects, month) {
			return objects.filter(function(listing) {
				return DateService.getMonthAndYear(listing.soldDate) == month;
			})
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

			return result.data.length > 0 ? result.data.reduce(getSum) / result.data.length : 0;
		}

		var getMedianKvmPrice = function(objects) {
			var result = getKvmValues(objects).map(getKvmPrice).sort(orderBySize);

			if (result.length == 1) {
				return result[0];
			} else if (result.length % 2 == 0) {
				return result[result.length / 2];
			} else {
				var i = result.length / 2 + 0.5;
				return  (result[i] + result[i - 1]) / 2;
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

		var getDate = function(object){
			return object.soldDate;
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
			return str && 0 !== str.length && !isNaN(str);
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
