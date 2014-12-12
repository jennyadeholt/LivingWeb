


var libLoaded = false;

var options = {
	title: 'Kvadratmeterpris / månad',
	height: 599,
	width: 700,
	legend: {position: 'right'},
	titlePosition: 'top',
	orientation: 'vertical',
	annotations: {
		alwaysOutside: true
	},
	seriesType: "bars",
	series: {
		0: { color: '#04567C'},
		1: { color: '#68cbfa'},
		2: {
			type: "line",
			color: 'red'
		}
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

	$scope.init = function () {}

		/*{
		calc: getValueAt.bind(undefined, 1),
		sourceColumn: 1,
		type: "string",
		role: "annotation"
	}*/

function drawChart() {
	var objects = $scope.profits;
	if (objects && objects.length > 0) {
		var data = google.visualization.arrayToDataTable(ProfitService.getData(objects));

		var view = new google.visualization.DataView(data);

		view.setColumns([0, 1, {
			calc: getValueAt.bind(undefined, 1),
			sourceColumn: 1,
			type: "string",
			role: "annotation"
		}, 2, 3]);

		var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
		chart.draw(view, options);
	}
}

function getValueAt(column, dataTable, row) {
	return $filter('kvmprice')(dataTable.getFormattedValue(row, column)) + $filter('kvmprice')(dataTable.getFormattedValue(row, column + 1));
}
});
