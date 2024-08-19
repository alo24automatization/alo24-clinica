var options = {
	chart: {
		height: 280,
		type: 'line',
		toolbar: {
			show: false,
		},
	},
	stroke: {
		curve: 'straight'
	},
	series: [{
		name: 'Operations',
		type: 'area',
		data: [40, 55, 35, 45, 30, 35, 27, 32, 33, 41, 30, 49]
	}, {
		name: 'Treatment',
		type: 'line',
		data: [20, 40, 25, 35, 20, 35, 37, 52, 44, 61, 60, 38]
	}],
	fill: {
		type:'solid',
		opacity: [1, 1],
	},
	stroke: {
		width: [0, 4]
	},
	labels: ['01 Jan 2019', '02 Jan 2019', '03 Jan 2019', '04 Jan 2019', '05 Jan 2019', '06 Jan 2019', '07 Jan 2019', '08 Jan 2019', '09 Jan 2019', '10 Jan 2019', '11 Jan 2019', '12 Jan 2019'],
	markers: {
		size: [0, 4],
	},
	yaxis: [
		{
			title: {
				text: 'Operations',
			},
		},
		{
			opposite: true,
			title: {
				text: 'Treatment',
			},
		},
	],
	tooltip: {
		shared: true,
		intersect: false,
		y: {
			formatter: function (y) {
				if(typeof y !== "undefined") {
					return  y.toFixed(0) + " points";
				}
				return y;
				
			}
		}
	},
	xaxis: {
		type: 'datetime'
	},
	colors: ['#d3eced', '#0A3D3f', '#4b61cc', '#5871ec', '#7c90ec', '#bec9fb'],
}
var chart = new ApexCharts(
	document.querySelector("#hospital-line-area-graph"),
	options
);
chart.render();