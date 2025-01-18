export function convertUnit(value, fromUnit, toUnit) {
	let conversionRate = 1;
	if (fromUnit === 'meters' && toUnit === 'centimeters') {
			conversionRate = 100;
	} else if (fromUnit === 'centimeters' && toUnit === 'meters') {
			conversionRate = 0.01;
	} else if (fromUnit === 'meters' && toUnit === 'kilometers') {
			conversionRate = 0.001;
	} else if (fromUnit === 'kilometers' && toUnit === 'meters') {
			conversionRate = 1000;
	} else if (fromUnit === 'centimeters' && toUnit === 'kilometers') {
			conversionRate = 0.00001;
	} else if (fromUnit === 'kilometers' && toUnit === 'centimeters') {
			conversionRate = 100000;
	}

	return value * conversionRate;
}
