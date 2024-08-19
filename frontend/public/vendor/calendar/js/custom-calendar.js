$(function () {

	/* initialize the calendar */
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
	$('#calendar').fullCalendar({
		header: {
			left: 'prev, next',
			center: 'title',
			right: 'today, month, agendaWeek, agendaDay'
		},
		//Add Events
		events: [
			{
				title: 'Daily meeting',
				start: new Date(y, m, 1, 10),
				end: new Date(y, m, 3),
			},
			{
				title: 'Football',
				start: new Date(y, m, d-3, 15, 0),
				allDay: false,
			},
			{
				title: 'Clients',
				start: new Date(y, m, 13, 5),
				end: new Date(y, m, 14),
			},
			{
				title: 'Business',
				start: new Date(y, m, 9, 12),
				end: new Date(y, m, 10),
			},
			{
				title: 'Meeting',
				start: new Date(y, m, 28, 18),
				end: new Date(y, m, 29),
			},
			{
				title: 'Movie',
				start: new Date(y, m, 3, 9),
				end: new Date(y, m, 4),
			},
			{
				title: 'Party',
				start: new Date(y, m, 25, 7),
				end: new Date(y, m, 26),
			},
			{
				title: 'Updates',
				start: new Date(y, m, 22, 19),
				end: new Date(y, m, 24),
			},
			{
				title: 'Seminar',
				start: new Date(y, m, 18, 8),
				end: new Date(y, m, 19),
			},
			{
				title: 'Investors',
				start: new Date(y, m, 16, 20),
				end: new Date(y, m, 16),
			},
			{
				title: 'UX Dev',
				start: new Date(y, m, 31, 21),
				end: new Date(y, m, 31),
			},
		],

		editable: true,
		eventLimit: true,
		droppable: true, // this allows things to be dropped onto the calendar
		drop: function (date, allDay) { // this function is called when something is dropped

			// retrieve the dropped element's stored Event Object
			var originalEventObject = $(this).data('eventObject');

			// we need to copy it, so that multiple events don't have a reference to the same object
			var copiedEventObject = $.extend({}, originalEventObject);

			// assign it the date that was reported
			copiedEventObject.start = date;
			copiedEventObject.allDay = allDay;

			// render the event on the calendar
			// the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
			$('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

			// is the "remove after drop" checkbox checked?
			if ($('#drop-remove').is(':checked')) {
				// if so, remove the element from the "Draggable Events" list
				$(this).remove();
			}
		}
	});
});
