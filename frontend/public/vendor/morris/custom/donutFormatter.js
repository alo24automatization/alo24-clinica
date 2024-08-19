Morris.Donut({
	element: 'donutFormatter',
	data: [
		{value: 155, label: 'voo', formatted: 'at least 70%' },
		{value: 12, label: 'bar', formatted: 'approx. 15%' },
		{value: 10, label: 'baz', formatted: 'approx. 10%' },
		{value: 5, label: 'A really really long label', formatted: 'at most 5%' }
	],
	resize: true,
	hideHover: "auto",
	formatter: function (x, data) { return data.formatted; },
	colors: ['#0a3d3f', '#105e61', '#18888c', '#20b2b7', '#6edce0', '#b6f5f7']
});