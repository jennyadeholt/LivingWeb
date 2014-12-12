
var startDate;
var endDate;
var filterEndDate;
var filterStartDate;


angular.module('livingWebApp')
.service('DateService',function DateService($filter){

	this.getEndDate = function() {
		if(!endDate) {
			endDate = getDate(new Date());
		}
		return endDate;
	}

	this.getStartDate = function() {
		if(!startDate) {
			startDate = getDate(moment().subtract(2, 'year'));
		}
		return startDate;
	}

	this.setStartDate = function(date) {
		startDate = date;
	}

	this.setEndDate = function(date) {
		endDate = date;
	}

	this.getSearchDate = function(date) {
		return $filter('searchDate')(date);
	}

	this.getDate = function(date) {
		return getDate(date);
	}

	this.getMonthAndYear = function(input) {
		return $filter('chartDate')(getDate(input));
	}

	function getDate(input) {
		return moment(input).toDate();
	}
});
