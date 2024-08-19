/*!
 * Bootstrap 4 multi dropdown navbar ( https://bootstrapthemes.co/demo/resource/bootstrap-4-multi-dropdown-navbar/ )
 * Copyright 2017.
 * Licensed under the GPL license
*/

$(document).ready(function(){
	$('.dropdown-menu a.dropdown-toggle').on('click', function (e){
		var $el = $(this);
		var $parent = $(this).offsetParent(".dropdown-menu");
		if (!$(this).next().hasClass('show')){
			$(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
		}
		var $subMenu = $(this).next(".dropdown-menu");
		$subMenu.toggleClass('show');
		
		$(this).parent("li").toggleClass('show');

		$(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e){
			$('.dropdown-menu .show').removeClass("show");
		});
		
		if (!$parent.parent().hasClass('navbar-nav')){
			$el.next().css({"top": $el[0].offsetTop, "left": $parent.outerWidth() - 4});
		}
		return false;
	});
});





// Todays Date
$(function() {
	var interval = setInterval(function() {
		var momentNow = moment();
		$('#today-date').html(momentNow.format('DD') + ' ' + ''
		+ momentNow.format('- dddd').substring(0, 12));
	}, 100);
});


$(function() {
	var interval = setInterval(function() {
		var momentNow = moment();
		$('#todays-date').html(momentNow.format('DD MMMM YYYY'));
	}, 100);
});




// Loading
$(function() {
	$("#loading-wrapper").fadeOut(3000);
});



// Textarea characters left
$(function() {
	$('#characterLeft').text('140 characters left');
	$('#message').keydown(function () {
		var max = 140;
		var len = $(this).val().length;
		if (len >= max) {
			$('#characterLeft').text('You have reached the limit');
			$('#characterLeft').addClass('red');
			$('#btnSubmit').addClass('disabled');            
		} 
		else {
			var ch = max - len;
			$('#characterLeft').text(ch + ' characters left');
			$('#btnSubmit').removeClass('disabled');
			$('#characterLeft').removeClass('red');            
		}
	});
});



// Bootstrap JS ***********

// Tooltip
$(function () {
	$('[data-toggle="tooltip"]').tooltip()
})

$(function () {
	$('[data-toggle="popover"]').popover()
})
