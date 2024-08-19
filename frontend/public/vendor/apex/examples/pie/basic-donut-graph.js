var options = {
	chart: {
		width: 400,
		type: 'donut',
	},
	labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
	series: [20, 20, 20, 20, 20],
	responsive: [{
		breakpoint: 480,
		options: {
			chart: {
				width: 200
			},
			legend: {
				position: 'bottom'
			}
		}
	}],
	stroke: {
		width: 0,
	},
	color:'#0a3d3f',
}
var chart = new ApexCharts(
	document.querySelector("#basic-donut-graph"),
	options
);
chart.render();