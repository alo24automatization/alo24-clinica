// Denmark
$(function(){
	$('#mapDenmark').vectorMap({
		map: 'dk_mill',
		zoomOnScroll: false,
		regionStyle:{
			initial: {
				fill: '#105e61',
			},
			hover: {
				"fill-opacity": 0.8
			},
			selected: {
				fill: '#20b2b7'
			},
		},
		backgroundColor: 'transparent',
	});
});