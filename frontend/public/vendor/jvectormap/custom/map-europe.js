// Europe
$(function(){
	$('#mapEurope').vectorMap({
		map: 'europe_mill',
		zoomOnScroll: false,
		series: {
			regions: [{
				values: gdpData,
				scale: ['#0a3d3f', '#105e61', '#18888c', '#20b2b7', '#6edce0', '#b6f5f7'],
				normalizeFunction: 'polynomial'
			}]
		},
		backgroundColor: 'transparent',
	});
});