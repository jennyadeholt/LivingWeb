
angular.module('livingWebApp')
.controller('DatePickerCtrl', function DatePickerController($scope, $filter, DateService) {
	var self = this;

	self.selected = '';
	self.endDate = DateService.getEndDate();
	self.startDate = DateService.getStartDate();

	self.startDateOptions = {
		dateFormat: 'd MM yy',
		maxDate: '+0m +0w',
		changeMonth: true,
		changeYear: true,
		showButtonPanel: true,
	};

	self.endDateOptions = {
		dateFormat: 'd MM yy',
		maxDate: '+0m +0w',
		changeMonth: true,
		changeYear: true,
		showButtonPanel: true,
	};

	$scope.$watch(
		function() {
			return self.startDate;
		},
		function($scope) {
			if (self.startDate) {
				DateService.setStartDate(self.startDate);
				self.endDateOptions.minDate = self.startDate;
			}
		}
	);

	$scope.$watch(
		function() {
			return self.endDate;
		},
		function() {
		 if (self.endDate) {
				DateService.setEndDate(self.endDate);
				self.startDateOptions.maxDate = self.endDate;
			}
		}
	);
});
