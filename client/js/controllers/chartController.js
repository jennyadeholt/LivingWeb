


var libLoaded = false;

var options = {
	title: 'Kvadratmeterpris - medelvärde',
	height: 577,
	width: 700,
	legend: 'none',
	annotations: {
		alwaysOutside: true
	},
	series: {
		0: { color: '#04567C' }
	}
};

google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(function () {
	libLoaded = true;
});

angular.module('livingWebApp').controller('ChartCtrl',
	function ChartController($scope, ProfitService, $filter) {

	$scope.$watch(
		function() {
			return $scope.profits;
		},
		function(scope) {
			drawChart();
		}
	);

	$scope.init = function () {

	}

	function drawChart() {
		var objects = $scope.profits;
		if (objects && objects.length > 0) {
			var data = google.visualization.arrayToDataTable(ProfitService.getAveragePerMonths(objects));

			var view = new google.visualization.DataView(data);

			view.setColumns([0, 1, {
					calc: getValueAt.bind(undefined, 1),
					sourceColumn: 1,
					type: "string",
					role: "annotation"
				}]);

				var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
				chart.draw(view, options);
			}
		}

		function getValueAt(column, dataTable, row) {
			return $filter('kvmprice')(dataTable.getFormattedValue(row, column));
		}
});
