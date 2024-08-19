// Africa
$(function(){
	$('#mapAfrica').vectorMap({
		map: 'africa_mill',
		backgroundColor: 'transparent',
		scaleColors: ['#0a3d3f'],
		zoomOnScroll:false,
		zoomMin: 1,
		hoverColor: true,
		series: {
			regions: [{
				values: gdpData,
				scale: ['#0a3d3f', '#105e61', '#18888c', '#20b2b7', '#6edce0', '#b6f5f7'],
				normalizeFunction: 'polynomial'
			}]
		},
	});
});