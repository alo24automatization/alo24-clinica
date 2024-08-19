// Morris Days
var day_data = [
	{"period": "2016-10-01", "licensed": 3213, "Royal Hospitals Admin Template": 887},
	{"period": "2016-09-30", "licensed": 3321, "Royal Hospitals Admin Template": 776},
	{"period": "2016-09-29", "licensed": 3671, "Royal Hospitals Admin Template": 884},
	{"period": "2016-09-20", "licensed": 3176, "Royal Hospitals Admin Template": 448},
	{"period": "2016-09-19", "licensed": 3376, "Royal Hospitals Admin Template": 565},
	{"period": "2016-09-18", "licensed": 3976, "Royal Hospitals Admin Template": 627},
	{"period": "2016-09-17", "licensed": 2239, "Royal Hospitals Admin Template": 660},
	{"period": "2016-09-16", "licensed": 3871, "Royal Hospitals Admin Template": 676},
	{"period": "2016-09-15", "licensed": 3659, "Royal Hospitals Admin Template": 656},
	{"period": "2016-09-10", "licensed": 3380, "Royal Hospitals Admin Template": 663}
];
Morris.Line({
	element: 'dayData',
	data: day_data,
	xkey: 'period',
	ykeys: ['licensed', 'Royal Hospitals Admin Template'],
	labels: ['Licensed', 'Royal Hospitals Admin Template'],
	resize: true,
	hideHover: "auto",
	gridLineColor: "#e4e6f2",
	pointFillColors:['#ffffff'],
	pointStrokeColors: ['#ff5661'],
	lineColors: ['#0a3d3f', '#105e61', '#18888c', '#20b2b7', '#6edce0', '#b6f5f7'],
});