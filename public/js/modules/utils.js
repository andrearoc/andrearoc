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
	},

	formatTime: (seconds) => {
			const hours = Math.floor(seconds / 3600);
			const minutes = Math.floor((seconds % 3600) / 60);
			const remainingSeconds = seconds % 60;

			return {
					hours,
					minutes,
					seconds: remainingSeconds,
					formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
			};
	}
};

export default UTL;