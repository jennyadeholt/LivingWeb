
var startDate;
var endDate;
var filterEndDate;
var filterStartDate;


angular.module('livingWebApp')
.service('ChartService',function ChartService(ProfitService, DateService, $filter){

	this.getEndDate = function() {
		if(!endDate) {
			endDate = getDate(new Date());
		}
		return endDate;
	}

	this.getAveragePerMonths = function(objects) {
		var average = parseInt(ProfitService.getAverageKvmPrice(objects), 10) / 1000;

		var dates = objects.map(function(listing){
			var date = DateService.getMonthAndYear(listing.soldDate);
			//console.log("Date " + date +  " " + listing.soldDate);
			return DateService.getMonthAndYear(listing.soldDate);
		}).reduce(function(a , b){
			if (a.indexOf(b) < 0 ) {
				a.push(b);
			}
			return a;
		},[]).map(function(month){
			var monthObjects = getMonthObjects(objects, month);
			var averagePerMonth = parseInt(ProfitService.getAverageKvmPrice(monthObjects), 10) / 1000;
			var type = parseInt(ProfitService.getTypeValueKvmPrice(monthObjects), 10) / 1000;

			return [month, averagePerMonth, type, monthObjects.length];

		});

		dates.push(["Månad", "Medelvärde", "Typvärde", "Antal object"]);

		return dates.reverse();
	}

	this.getAveragePerMonths2 = function(objects){
		objects = getKvmValues(objects);
		var average = parseInt(ProfitService.getAverageKvmPrice(objects), 10);

		var prices = objects.reduce(function(acc, listing) {
			var key = DateService.getMonthAndYear(listing.soldDate);
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

	var getMonthObjects = function(objects, month) {
		return objects.filter(function(listing) {
			return DateService.getMonthAndYear(listing.soldDate) == month;
		})
	}



});
