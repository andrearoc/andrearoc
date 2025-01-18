const UTL = {
	saveData: (key, data) => {
			const existingData = JSON.parse(localStorage.getItem(key)) || [];
			existingData.push(data);
			localStorage.setItem(key, JSON.stringify(existingData));
	},

	getData: (key) => {
			return JSON.parse(localStorage.getItem(key)) || [];
	},

	clearData: (key) => {
			localStorage.removeItem(key);
	}
};

export default UTL;
