var options = {
	chart: {
		height: 400,
		type: 'bar',
		stacked: true,
		toolbar: {
			show: false, 
		},
	},
	colors: ['#0a3d3f', '#105e61', '#18888c', '#20b2b7', '#6edce0', '#b6f5f7'],
	plotOptions: {
		bar: {
			horizontal: true,
			barHeight: '80%',
		},
	},
	dataLabels: {
		enabled: false
	},
	fill: {
		type:'solid',
		opacity: [1, 1],
	},
	stroke: {
		width: 1,
		colors: ["#fff"]
	},
	series: [{
			name: 'Male',
			data: [0.4, 0.5, 0.7, 0.88, 1.5, 2.1, 2.9, 3.8, 3.9, 4.2, 4, 4.3, 4.1, 4.2, 4.5, 3.9, 3.5, 3]
		},
		{
			name: 'Female',
			data: [-0.4, -0.5, -0.7, -0.88, -1.5, -2.1, -2.9, -3.8, -3.9, -4.2, -4, -4.3, -4.1, -4.2, -4.5, -3.9, -3.5, -3]
		}
	],
	grid: {
		xaxis: {
			showLines: false
		}
	},
	yaxis: {
		min: -5,
		max: 5,
		title: {
			// text: 'Age',
		},
	},
	tooltip: {
		shared: false,
		x: {
			formatter: function(val) {
				return val
			}
		},
		y: {
			formatter: function(val) {
				return Math.abs(val) + "%"
			}
		}
	},
	colors: ['#0a3d3f', '#105e61', '#18888c', '#20b2b7', '#6edce0', '#b6f5f7'],
	title: {
		text: 'Patients by Age & Gender',
		align: 'center',
	},
	xaxis: {
		categories: ['85+', '80-84', '75-79', '70-74', '65-69', '60-64', '55-59', '50-54', '45-49', '40-44', '35-39', '30-34', '25-29', '20-24', '15-19', '10-14', '5-9', '0-4'],
		title: {
			text: 'Percent'
		},
		labels: {
			formatter: function(val) {
				return Math.abs(Math.round(val)) + "%"
			}
		}
	},
}

var chart = new ApexCharts(
	document.querySelector("#hospital-patients-by-age"),
	options
);

chart.render();