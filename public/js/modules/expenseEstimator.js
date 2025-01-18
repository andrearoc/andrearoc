export function estimateBudget(income, expenses) {
	return income - expenses;
}

export function toggleExpenseEstimator() {
	const expenseDiv = document.getElementById('expenseEstimator');
	expenseDiv.style.display = (expenseDiv.style.display === 'none' ? 'block' : 'none');
}
