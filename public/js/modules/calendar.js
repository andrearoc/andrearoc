export function initializeCalendar() {
	const calendarDiv = document.getElementById('calendar');
	const calendar = new FullCalendar.Calendar(calendarDiv, {
			initialView: 'dayGridMonth'
	});
	calendar.render();
}

export function toggleCalendar() {
	const calendarDiv = document.getElementById('calendar');
	calendarDiv.style.display = (calendarDiv.style.display === 'none' ? 'block' : 'none');
}
